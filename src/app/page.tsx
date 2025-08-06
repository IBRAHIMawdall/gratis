"use client";

import React, { useState, useTransition } from "react";
import { FreeItem } from "@/lib/types";
import { performSearch } from "@/app/actions";
import SearchForm from "@/components/forms/SearchForm";
import ResultsList from "@/components/search/ResultsList";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { FavoritesSheet } from "@/components/favorites/FavoritesSheet";

export default function Home() {
  const [results, setResults] = useState<FreeItem[] | null>(null);
  const [favorites, setFavorites] = useState<FreeItem[]>([]);
  const [isSearching, startSearchTransition] = useTransition();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState<{ description: string; location: string } | null>(null);

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
            <main className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    <p className="text-sm text-gray-600 mb-4">
                        {`Showing results for "${searchQuery?.description}" near "${searchQuery?.location}"`}
                    </p>
                    <ResultsList
                        results={results}
                        favorites={favorites}
                        isLoading={isSearching}
                        onToggleFavorite={toggleFavorite}
                    />
                </div>
            </main>
        </>
      )}
    </div>
  );
}
