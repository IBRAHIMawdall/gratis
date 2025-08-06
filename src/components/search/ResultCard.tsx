import React from 'react';
import { FreeItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

type SearchResultProps = {
  item: FreeItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

const SearchResult: React.FC<SearchResultProps> = ({ item, isFavorite, onToggleFavorite }) => {
  return (
    <div className="mb-8">
       <div className="flex items-center justify-between">
         <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="group">
            <p className="text-sm text-gray-600">{item.source}</p>
            <h3 className="text-xl text-blue-800 group-hover:underline">{item.title}</h3>
         </a>
         <Button variant="ghost" size="icon" onClick={onToggleFavorite} aria-label="Toggle Favorite">
            <Star className={`w-6 h-6 transition-colors ${isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} />
        </Button>
       </div>
      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
       <p className="text-xs text-gray-500 mt-1">{item.location}</p>
    </div>
  );
};

export default SearchResult;
