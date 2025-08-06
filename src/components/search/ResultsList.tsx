
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
  strings
}) => {
  const grid_template = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6";

  if (isLoading) {
    return (
      <div className={grid_template}>
        {[...Array(10)].map((_, i) => (
          <ResultCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (results.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-16 border-2 border-dashed rounded-lg mt-8">
        <Inbox className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-2xl font-semibold text-gray-700">{strings.noResultsTitle}</h3>
        <p className="text-gray-500 mt-2">{strings.noResultsDescription}</p>
      </div>
    );
  }

  return (
    <div className={grid_template}>
      {results.map((item) => (
        <div
            key={item.id}
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
