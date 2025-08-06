import React from 'react';
import { FreeItem } from '@/lib/types';
import ResultCard from './ResultCard';
import ResultCardSkeleton from './ResultCardSkeleton';
import { Inbox } from 'lucide-react';

type ResultsListProps = {
  results: FreeItem[];
  favorites: FreeItem[];
  isLoading: boolean;
  onToggleFavorite: (item: FreeItem) => void;
};

const ResultsList: React.FC<ResultsListProps> = ({
  results,
  favorites,
  isLoading,
  onToggleFavorite,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <ResultCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (results.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-card rounded-lg shadow-md">
        <Inbox className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="font-headline text-2xl font-semibold">No Results Yet</h3>
        <p className="text-muted-foreground">Use the search bar above to find free stuff!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((item) => (
        <ResultCard
          key={item.id}
          item={item}
          isFavorite={favorites.some((fav) => fav.id === item.id)}
          onToggleFavorite={() => onToggleFavorite(item)}
        />
      ))}
    </div>
  );
};

export default ResultsList;
