"use client";

import React, { useState, useTransition } from "react";
import { FreeItem } from "@/lib/types";
import { performSearch } from "@/app/actions";
import Header from "@/components/layout/Header";
import SearchForm from "@/components/forms/SearchForm";
import ResultsView from "@/components/search/ResultsView";
import { FavoritesSheet } from "@/components/favorites/FavoritesSheet";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [results, setResults] = useState<FreeItem[]>([]);
  const [favorites, setFavorites] = useState<FreeItem[]>([]);
  const [isSearching, startSearchTransition] = useTransition();
  const { toast } = useToast();

  const handleSearch = (data: { description: string; location: string }) => {
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

  return (
    <div className="flex flex-col h-full bg-background">
      <Header>
        <FavoritesSheet favorites={favorites} onToggleFavorite={toggleFavorite} />
      </Header>
      <main className="flex-1 flex flex-col gap-8 p-4 md:p-8 overflow-hidden">
        <div className="container mx-auto max-w-4xl">
           <h1 className="font-headline text-4xl md:text-5xl font-bold text-center text-primary-foreground bg-primary py-4 rounded-lg shadow-md mb-2">Gratis Finder</h1>
           <p className="text-center text-muted-foreground font-body text-lg mb-8">Discover free items and services near you.</p>
          <SearchForm onSearch={handleSearch} isSearching={isSearching} />
        </div>
        <ResultsView
          results={results}
          favorites={favorites}
          isLoading={isSearching}
          onToggleFavorite={toggleFavorite}
        />
      </main>
    </div>
  );
}
