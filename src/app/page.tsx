"use client";

import React, { useState, useTransition, useMemo } from "react";
import { FreeItem } from "@/lib/types";
import { performSearch } from "@/app/actions";
import SearchForm from "@/components/forms/SearchForm";
import ResultsList from "@/components/search/ResultsList";
import { useToast } from "@/hooks/use-toast";
import { FavoritesSheet } from "@/components/favorites/FavoritesSheet";
import MapView from "@/components/map/MapView";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Home() {
  const [results, setResults] = useState<FreeItem[] | null>(null);
  const [favorites, setFavorites] = useState<FreeItem[]>([]);
  const [isSearching, startSearchTransition] = useTransition();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState<{ description: string; location: string } | null>(null);
  const [sortBy, setSortBy] = useState("relevance");
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const handleSearch = (data: { description: string; location: string }) => {
    setSearchQuery(data);
    startSearchTransition(async () => {
      const searchResult = await performSearch(data);
      if (searchResult.error) {
        toast({
          variant: "destructive",
          title: "Search Failed",
          description: searchResult.error,
        });
        setResults([]);
      } else {
        setResults(searchResult.items || []);
        if (!searchResult.items || searchResult.items.length === 0) {
          toast({
            title: "No Results",
            description: "We couldn't find any free items matching your search.",
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
      // "relevance" is default
      return 0;
    });
  }, [results, sortBy]);

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
           <SearchForm onSearch={handleSearch} isSearching={isSearching} />
         </main>
      ) : (
        <>
            <header className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-[#4285F4] cursor-pointer" onClick={handleNewSearch}>
                        Gratis
                    </h1>
                    <div className="w-[700px]">
                        <SearchForm onSearch={handleSearch} isSearching={isSearching} initialValues={searchQuery ?? undefined} />
                    </div>
                </div>
                <FavoritesSheet favorites={favorites} onToggleFavorite={toggleFavorite} />
            </header>
            <main className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 p-6 overflow-hidden">
              <div className="lg:col-span-3 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">
                      {`Showing results for "${searchQuery?.description}" near "${searchQuery?.location}"`}
                    </p>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="relevance">Relevance</SelectItem>
                            <SelectItem value="az">A-Z</SelectItem>
                            <SelectItem value="za">Z-A</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-2">
                    <ResultsList
                        results={sortedResults}
                        favorites={favorites}
                        isLoading={isSearching}
                        onToggleFavorite={toggleFavorite}
                        onItemHover={setHoveredItemId}
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