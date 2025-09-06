"use client";

import React, { useState, useTransition, useMemo, useEffect } from "react";
import { FreeItem } from "@/lib/types";
import { performSearch, translateText, getSuggestions, seedDatabase } from "@/app/actions";
import SearchForm from "@/components/forms/SearchForm";
import ResultsList from "@/components/search/ResultsList";
import { useToast } from "@/hooks/use-toast";
import { FavoritesSheet } from "@/components/favorites/FavoritesSheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LanguageSelector from "@/components/LanguageSelector";
import Logo from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Database } from "lucide-react";

type TranslatedStrings = {
  placeholder: string;
  searchButton: string;
  feelingLucky: string;
  favorites: string;
  showingResults: string;
  sortBy: string;
  relevance: string;
  az: string;
  za:string;
  noResultsTitle: string;
  noResultsDescription: string;
  searchFailedTitle: string;
  newSearch: string;
  searchPrompt: string;
  sort: string;
  suggestions: string;
  showingSuggestions: string;
};

const defaultStrings: TranslatedStrings = {
    placeholder: "I'm looking for...",
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
    suggestions: "Suggest for me",
    showingSuggestions: "Here are some suggestions for you",
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
  const [pageMode, setPageMode] = useState<'search' | 'suggestions'>('search');
  const [isSeeding, startSeedingTransition] = useTransition();


  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    if (language === 'en') {
        setTranslatedStrings(defaultStrings);
        return;
    }

    const translateUI = async () => {
        startTranslation(async () => {
            const keysToTranslate: (keyof TranslatedStrings)[] = [
                'placeholder', 'searchButton', 'feelingLucky', 'favorites', 
                'showingResults', 'sortBy', 'relevance', 'az', 'za', 
                'noResultsTitle', 'noResultsDescription', 'searchFailedTitle', 'newSearch',
                'searchPrompt', 'sort', 'suggestions', 'showingSuggestions'
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
  }, [language, results]);


  const translateResults = async (items: FreeItem[], lang: string): Promise<FreeItem[]> => {
    if (lang === 'en' && searchQuery) {
        const searchResult = await performSearch(searchQuery);
        return searchResult.items || [];
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
    setPageMode('search');
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

  const handleSuggest = () => {
    setSearchQuery(null);
    setPageMode('suggestions');
    startSearchTransition(async () => {
        const suggestionResult = await getSuggestions(favorites);
        if (suggestionResult.error) {
            toast({
                variant: "destructive",
                title: translatedStrings.searchFailedTitle,
                description: suggestionResult.error,
            });
            setResults([]);
        } else {
            const items = suggestionResult.items || [];
            if (language !== 'en') {
                const translated = await translateResults(items, language);
                setResults(translated);
            } else {
                setResults(items);
            }
        }
    });
  };

  const handleSeedDatabase = () => {
    startSeedingTransition(async () => {
      const result = await seedDatabase();
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Database Seeding Failed",
          description: result.error,
        });
      } else {
        toast({
          title: "Database Seeded",
          description: `Successfully added ${result.count} items to the database.`,
        });
        // Refresh search if there's a query
        if (searchQuery) {
          handleSearch(searchQuery);
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
    if (pageMode === 'suggestions') return results; // Don't sort suggestions
    return [...results].sort((a, b) => {
      if (sortBy === 'az') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'za') {
        return b.title.localeCompare(a.title);
      }
      return 0; // relevance
    });
  }, [results, sortBy, pageMode]);

  const displayQuery = pageMode === 'suggestions'
    ? translatedStrings.showingSuggestions
    : searchQuery
    ? translatedStrings.showingResults.replace('{description}', searchQuery.description)
    : '';

  const isLoading = isSearching || isTranslating;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto flex items-center justify-between p-4 gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <Logo className="h-8 w-8" />
            <a href="/" className="text-xl font-bold text-gray-800 hidden sm:inline tracking-tight">
                {translatedStrings.newSearch}
            </a>
          </div>

          <div className="flex-1 flex justify-center px-4">
            <div className="w-full max-w-2xl flex items-center gap-2">
              <SearchForm
                onSearch={handleSearch}
                isSearching={isLoading && pageMode === 'search'}
                initialValues={searchQuery ?? undefined}
                strings={translatedStrings}
              />
              <Button
                variant="outline"
                className="bg-white"
                onClick={handleSuggest}
                disabled={isLoading}
              >
                {isLoading && pageMode === 'suggestions' ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4 text-primary" />
                )}
                {translatedStrings.suggestions}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <FavoritesSheet favorites={favorites} onToggleFavorite={toggleFavorite} strings={translatedStrings} />
            <LanguageSelector onLanguageChange={setLanguage} />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full container mx-auto p-6">
        {results === null ? (
          <div className="flex flex-col items-center justify-center text-center h-full max-w-2xl mx-auto pt-20">
             <div className="relative w-48 h-48 mb-8">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full opacity-20 blur-2xl"></div>
                <Logo className="h-48 w-48" />
             </div>
             <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">{translatedStrings.searchPrompt}</h1>
             <p className="text-lg text-gray-500 max-w-md">Your gateway to discovering free treasures in your community.</p>
             <Button onClick={handleSeedDatabase} disabled={isSeeding} className="mt-8">
                {isSeeding ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Database className="mr-2 h-4 w-4" />
                )}
                Seed Database with Sample Data
              </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-md text-gray-600">
                {displayQuery} ({sortedResults.length})
              </p>
              {pageMode === 'search' && (
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
              )}
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
