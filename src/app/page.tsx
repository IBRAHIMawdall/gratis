
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
  sort: string;
};

const defaultStrings: TranslatedStrings = {
    placeholder: "Search for free items and services...",
    searchButton: "Search",
    feelingLucky: "I'm Feeling Lucky",
    favorites: "Favorites",
    showingResults: 'Showing results for "{description}"',
    sortBy: "Sort by",
    relevance: "Relevance",
    az: "A-Z",
    za: "Z-A",
    noResultsTitle: "No Results Found",
    noResultsDescription: "Try a different search to find what you're looking for.",
    searchFailedTitle: "Search Failed",
    newSearch: "Gratis",
    searchPrompt: "Find anything, for free.",
    sort: "Sort",
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
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    if (language === 'en') {
        setTranslatedStrings(defaultStrings);
        if(results && searchQuery) {
            // handleSearch(searchQuery, true); // Avoid re-searching on language change to english
        }
        return;
    }

    const translateUI = async () => {
        startTranslation(async () => {
            const keysToTranslate: (keyof TranslatedStrings)[] = [
                'placeholder', 'searchButton', 'feelingLucky', 'favorites', 
                'showingResults', 'sortBy', 'relevance', 'az', 'za', 
                'noResultsTitle', 'noResultsDescription', 'searchFailedTitle', 'newSearch',
                'searchPrompt', 'sort'
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
  }, [language]);


  const translateResults = async (items: FreeItem[], lang: string): Promise<FreeItem[]> => {
    if (lang === 'en') {
        // This is a simplified re-fetch, in a real app you might want to store original results
        if(searchQuery){
            const searchResult = await performSearch(searchQuery);
            return searchResult.items || [];
        }
        return [];
    };
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

  const handleSearch = (data: { description: string; location: string }) => {
    setSearchQuery(data);
    startSearchTransition(async () => {
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
             if (language !== 'en') {
                 const translated = await translateResults(items, language);
                 setResults(translated);
             } else {
                 setResults(items);
             }
        }
    });
  };

  const toggleFavorite = (item: FreeItem) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.some((fav) => fav.id === item.id);
      let updatedFavorites;
      if (isFavorite) {
        updatedFavorites = prevFavorites.filter((fav) => fav.id !== item.id);
      } else {
        updatedFavorites = [...prevFavorites, item];
      }
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
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

  const isLoading = isSearching || isTranslating;

  return (
    <div className="flex flex-col min-h-screen bg-background text-gray-900">
        <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-gray-200">
            <div className="container mx-auto flex items-center justify-between p-4 gap-4">
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Logo className="h-8 w-8" />
                    <span className="text-xl font-bold text-gray-800 hidden sm:inline">
                        {translatedStrings.newSearch}
                    </span>
                </div>
                
                <div className="flex-grow max-w-2xl">
                    <SearchForm 
                        onSearch={(data) => handleSearch(data)} 
                        isSearching={isLoading} 
                        initialValues={searchQuery ?? undefined}
                        strings={translatedStrings}
                    />
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                    <FavoritesSheet favorites={favorites} onToggleFavorite={toggleFavorite} strings={translatedStrings} />
                    <LanguageSelector onLanguageChange={setLanguage} />
                </div>
            </div>
        </header>
        
        <main className="flex-1 w-full container mx-auto p-6">
            {results === null ? (
                 <div className="flex flex-col items-center justify-center text-center h-full max-w-2xl mx-auto pt-20">
                    <div className="flex items-center gap-2 mb-4">
                        <Logo className="h-20 w-20" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-700 mb-8">{translatedStrings.searchPrompt}</h1>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-md text-gray-600">
                           {displaySearchQuery} ({sortedResults.length})
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600 hidden sm:inline">{translatedStrings.sort}</span>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-auto sm:w-[180px] bg-white">
                                    <SelectValue placeholder={translatedStrings.sortBy} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="relevance">{translatedStrings.relevance}</SelectItem>
                                    <SelectItem value="az">{translatedStrings.az}</SelectItem>
                                    <SelectItem value="za">{translatedStrings.za}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <ResultsList
                        results={sortedResults}
                        favorites={favorites}
                        isLoading={isLoading}
                        onToggleFavorite={toggleFavorite}
                        strings={translatedStrings}
                    />
                </>
            )}
        </main>
    </div>
  );
}
