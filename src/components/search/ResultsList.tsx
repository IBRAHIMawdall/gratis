import React from 'react';
import { FreeItem } from '@/lib/types';
import SearchResult from './ResultCard';
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
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <ResultCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (results.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Inbox className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-2xl font-semibold text-gray-700">No Results Found</h3>
        <p className="text-gray-500">Try adjusting your search terms.</p>
      </div>
    );
  }

  return (
    <div>
      {results.map((item) => (
        <SearchResult
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
