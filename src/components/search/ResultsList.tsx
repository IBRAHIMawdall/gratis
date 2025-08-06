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
  onItemHover: (id: string | null) => void;
  strings: {
    noResultsTitle: string;
    noResultsDescription: string;
  }
};

const ResultsList: React.FC<ResultsListProps> = ({
  results,
  favorites,
  isLoading,
  onToggleFavorite,
  onItemHover,
  strings
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <ResultCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (results.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Inbox className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-2xl font-semibold text-gray-700">{strings.noResultsTitle}</h3>
        <p className="text-gray-500">{strings.noResultsDescription}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {results.map((item) => (
        <div
            key={item.id}
            onMouseEnter={() => onItemHover(item.id)}
            onMouseLeave={() => onItemHover(null)}
        >
            <SearchResult
              item={item}
              isFavorite={favorites.some((fav) => fav.id === item.id)}
              onToggleFavorite={() => onToggleFavorite(item)}
            />
        </div>
      ))}
    </div>
  );
};

export default ResultsList;
