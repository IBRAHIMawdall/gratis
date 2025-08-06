
"use client";

import React, { useState, useTransition, useMemo, useEffect } from "react";
import { FreeItem } from "@/lib/types";
import { performSearch, translateText } from "@/app/actions";
import SearchForm from "@/components/forms/SearchForm";
import ResultsList from "@/components/search/ResultsList";
import { useToast } from "@/hooks/use-toast";
import { FavoritesSheet } from "@/components/favorites/FavoritesSheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LanguageSelector from "@/components/LanguageSelector";
import Logo from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";

type TranslatedStrings = {
  placeholder: string;
  searchButton: string;
  feelingLucky: string;
  favorites: string;
  showingResults: string;
  sortBy: string;
  relevance: string;
  az: string;
  za: string;
  noResultsTitle: string;
  noResultsDescription: string;
  searchFailedTitle: string;
  newSearch: string;
  searchPrompt: string;
};

const defaultStrings: TranslatedStrings = {
    placeholder: "Used furniture, workshop...",
    searchButton: "Search",
    feelingLucky: "I'm Feeling Lucky",
    favorites: "Favorites",
    showingResults: 'Showing results for "{description}"',
    sortBy: "Sort by",
    relevance: "Relevance",
    az: "A-Z",
    za: "Z-A",
    noResultsTitle: "No Results Found",
    noResultsDescription: "Try a different search to find free items and services near you.",
    searchFailedTitle: "Search Failed",
    newSearch: "Gratis",
    searchPrompt: "What can we help you find today?",
};

export default function Home() {
  const [results, setResults] = useState<FreeItem[] | null>(null);
  const [favorites, setFavorites] = useState<FreeItem[]>([]);
  const [isSearching, startSearchTransition] = useTransition();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState<{ description: string; location: string } | null>(null);
  const [sortBy, setSortBy] = useState("relevance");
  const [language, setLanguage] = useState("en");
  const [translatedStrings, setTranslatedStrings] = useState<TranslatedStrings>(defaultStrings);
  const [isTranslating, startTranslation] = useTransition();

  useEffect(() => {
    if (language === 'en') {
        setTranslatedStrings(defaultStrings);
        if(results && searchQuery) {
            handleSearch(searchQuery, true);
        }
        return;
    }

    const translateUI = async () => {
        startTranslation(async () => {
            const keysToTranslate: (keyof TranslatedStrings)[] = [
                'placeholder', 'searchButton', 'feelingLucky', 'favorites', 
                'showingResults', 'sortBy', 'relevance', 'az', 'za', 
                'noResultsTitle', 'noResultsDescription', 'searchFailedTitle', 'newSearch',
                'searchPrompt'
            ];

            const translations = await Promise.all(
                keysToTranslate.map(async (key) => {
                    const result = await translateText({ text: defaultStrings[key], targetLanguage: language });
                    return { key, translatedText: result.translatedText || defaultStrings[key] };
                })
            );

            const newStrings = translations.reduce((acc, { key, translatedText }) => {
                acc[key] = translatedText;
                return acc;
            }, {} as TranslatedStrings);

            setTranslatedStrings(newStrings);

            if (results) {
              const translatedResults = await translateResults(results, language);
              setResults(translatedResults);
            }
        });
    };

    translateUI();
  }, [language, results, searchQuery]);


  const translateResults = async (items: FreeItem[], lang: string): Promise<FreeItem[]> => {
    if (lang === 'en') return items;
    return Promise.all(
        items.map(async (item) => {
            const [translatedTitle, translatedDescription] = await Promise.all([
                translateText({ text: item.title, targetLanguage: lang }),
                translateText({ text: item.description, targetLanguage: lang }),
            ]);
            return {
                ...item,
                title: translatedTitle.translatedText || item.title,
                description: translatedDescription.translatedText || item.description,
            };
        })
    );
  };


  const handleSearch = (data: { description: string; location: string }, fromTranslation: boolean = false) => {
    setSearchQuery(data);
    startSearchTransition(async () => {
      if (!fromTranslation || !results) {
        const searchResult = await performSearch(data);
        if (searchResult.error) {
          toast({
            variant: "destructive",
            title: translatedStrings.searchFailedTitle,
            description: searchResult.error,
          });
          setResults([]);
        } else {
            const items = searchResult.items || [];
            if (items.length === 0) {
              setResults([]);
            } else {
              const finalResults = await translateResults(items, language);
              setResults(finalResults);
            }
        }
      } else if (results) {
         const finalResults = await translateResults(results, language);
         setResults(finalResults);
      }
    });
  };

  const toggleFavorite = (item: FreeItem) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.some((fav) => fav.id === item.id);
      if (isFavorite) {
        return prevFavorites.filter((fav) => fav.id !== item.id);
      } else {
        return [...prevFavorites, item];
      }
    });
  };
  
  const sortedResults = useMemo(() => {
    if (!results) return [];
    return [...results].sort((a, b) => {
      if (sortBy === 'az') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'za') {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });
  }, [results, sortBy]);

  const displaySearchQuery = searchQuery 
    ? translatedStrings.showingResults
        .replace('{description}', searchQuery.description)
    : '';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b border-gray-200">
            <div className="container mx-auto flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                    <Logo className="h-8 w-8 text-blue-600" />
                    <span className="text-xl font-bold text-gray-800">
                        {translatedStrings.newSearch}
                    </span>
                </div>
                {results !== null && (
                    <div className="w-full max-w-md">
                        <SearchForm 
                            onSearch={(data) => handleSearch(data)} 
                            isSearching={isSearching || isTranslating} 
                            initialValues={searchQuery ?? undefined}
                            strings={translatedStrings}
                        />
                    </div>
                )}
                <div className="flex items-center gap-4">
                    <FavoritesSheet favorites={favorites} onToggleFavorite={toggleFavorite} strings={translatedStrings} />
                    <LanguageSelector onLanguageChange={setLanguage} />
                </div>
            </div>
        </header>
        
        <main className="flex-1 w-full container mx-auto p-6">
            {results === null ? (
                 <div className="flex flex-col items-center justify-center text-center h-full max-w-2xl mx-auto pt-20">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{translatedStrings.searchPrompt}</h1>
                    <div className="w-full">
                        <SearchForm onSearch={(data) => handleSearch(data)} isSearching={isSearching || isTranslating} strings={translatedStrings} />
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-lg text-gray-600">
                            {displaySearchQuery} ({sortedResults.length})
                        </p>
                        <div className="flex items-center gap-4">
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[180px] bg-white">
                                    <SelectValue placeholder={translatedStrings.sortBy} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="relevance">{translatedStrings.relevance}</SelectItem>
                                    <SelectItem value="az">{translatedStrings.az}</SelectItem>
                                    <SelectItem value="za">{translatedStrings.za}</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" onClick={() => setResults(null)}>New Search</Button>
                        </div>
                    </div>
                    <ResultsList
                        results={sortedResults}
                        favorites={favorites}
                        isLoading={isSearching || isTranslating}
                        onToggleFavorite={toggleFavorite}
                        onItemHover={() => {}}
                        strings={translatedStrings}
                    />
                </>
            )}
        </main>
    </div>
  );
}
