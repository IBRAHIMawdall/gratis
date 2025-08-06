"use client";

import React, { useState, useTransition, useMemo, useEffect } from "react";
import { FreeItem } from "@/lib/types";
import { performSearch, translateText } from "@/app/actions";
import SearchForm from "@/components/forms/SearchForm";
import ResultsList from "@/components/search/ResultsList";
import { useToast } from "@/hooks/use-toast";
import { FavoritesSheet } from "@/components/favorites/FavoritesSheet";
import MapView from "@/components/map/MapView";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LanguageSelector from "@/components/LanguageSelector";

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
};

const defaultStrings: TranslatedStrings = {
    placeholder: "Search for free items or services",
    searchButton: "Search",
    feelingLucky: "I'm Feeling Lucky",
    favorites: "Favorites",
    showingResults: 'Showing results for "{description}" near "{location}"',
    sortBy: "Sort by",
    relevance: "Relevance",
    az: "A-Z",
    za: "Z-A",
    noResultsTitle: "No Results",
    noResultsDescription: "We couldn't find any free items matching your search.",
    searchFailedTitle: "Search Failed",
    newSearch: "Gratis",
};

export default function Home() {
  const [results, setResults] = useState<FreeItem[] | null>(null);
  const [favorites, setFavorites] = useState<FreeItem[]>([]);
  const [isSearching, startSearchTransition] = useTransition();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState<{ description: string; location: string } | null>(null);
  const [sortBy, setSortBy] = useState("relevance");
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [language, setLanguage] = useState("en");
  const [translatedStrings, setTranslatedStrings] = useState<TranslatedStrings>(defaultStrings);
  const [isTranslating, startTranslation] = useTransition();

  useEffect(() => {
    if (language === 'en') {
        setTranslatedStrings(defaultStrings);
        if(results) {
            handleSearch(searchQuery!);
        }
        return;
    }

    const translateUI = async () => {
        startTranslation(async () => {
            const keysToTranslate: (keyof TranslatedStrings)[] = [
                'placeholder', 'searchButton', 'feelingLucky', 'favorites', 
                'showingResults', 'sortBy', 'relevance', 'az', 'za', 
                'noResultsTitle', 'noResultsDescription', 'searchFailedTitle', 'newSearch'
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
        const finalResults = await translateResults(searchResult.items || [], language);
        setResults(finalResults);
        if (!finalResults || finalResults.length === 0) {
          toast({
            title: translatedStrings.noResultsTitle,
            description: translatedStrings.noResultsDescription,
          });
        }
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
  
  const handleNewSearch = () => {
    setResults(null);
    setSearchQuery(null);
  }

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
        .replace('{location}', searchQuery.location)
    : '';

  return (
    <div className="flex flex-col h-full bg-white text-[#202124]">
      {results === null ? (
         <main className="flex flex-col items-center justify-center flex-grow">
            <h1 className="text-8xl font-bold mb-8">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#DB4437]">r</span>
                <span className="text-[#F4B400]">a</span>
                <span className="text-[#4285F4]">t</span>
                <span className="text-[#0F9D58]">i</span>
                <span className="text-[#DB4437]">s</span>
            </h1>
           <SearchForm onSearch={handleSearch} isSearching={isSearching || isTranslating} strings={translatedStrings} />
         </main>
      ) : (
        <>
            <header className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-[#4285F4] cursor-pointer" onClick={handleNewSearch}>
                        {translatedStrings.newSearch}
                    </h1>
                    <div className="w-[700px]">
                        <SearchForm 
                            onSearch={handleSearch} 
                            isSearching={isSearching || isTranslating} 
                            initialValues={searchQuery ?? undefined}
                            strings={translatedStrings}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <FavoritesSheet favorites={favorites} onToggleFavorite={toggleFavorite} strings={translatedStrings} />
                    <LanguageSelector onLanguageChange={setLanguage} />
                </div>
            </header>
            <main className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 p-6 overflow-hidden">
              <div className="lg:col-span-3 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">
                        {displaySearchQuery}
                    </p>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={translatedStrings.sortBy} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="relevance">{translatedStrings.relevance}</SelectItem>
                            <SelectItem value="az">{translatedStrings.az}</SelectItem>
                            <SelectItem value="za">{translatedStrings.za}</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-2">
                    <ResultsList
                        results={sortedResults}
                        favorites={favorites}
                        isLoading={isSearching || isTranslating}
                        onToggleFavorite={toggleFavorite}
                        onItemHover={setHoveredItemId}
                        strings={translatedStrings}
                    />
                  </div>
              </div>
              <aside className="hidden lg:block lg:col-span-2 rounded-lg overflow-hidden h-full">
                <MapView items={sortedResults} favorites={favorites} hoveredItemId={hoveredItemId} />
              </aside>
            </main>
        </>
      )}
    </div>
  );
}
