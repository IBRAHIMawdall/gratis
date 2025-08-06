
import React from 'react';
import Image from 'next/image';
import { FreeItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Star, MapPin } from 'lucide-react';

type SearchResultProps = {
  item: FreeItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

const SearchResult: React.FC<SearchResultProps> = ({ item, isFavorite, onToggleFavorite }) => {
  return (
    <div className="h-full flex flex-col group rounded-lg overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200">
      <div className="relative h-48 w-full overflow-hidden">
        <Image 
            src={item.imageUrl || 'https://placehold.co/600x400.png'} 
            alt={item.title} 
            data-ai-hint={`${item.title} ${item.location}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleFavorite} 
              aria-label="Toggle Favorite"
              className="rounded-full bg-black/30 hover:bg-black/50 text-white hover:text-white"
            >
                <Star className={`w-5 h-5 transition-colors ${isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-white/80'}`} />
            </Button>
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex-grow">
          <h3 className="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">{item.title}</h3>
        </a>
        <div className="flex items-center text-sm text-gray-500 mt-2">
            <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
            <span>{item.location}</span>
        </div>
      </div>
       <div className="p-4 pt-0 border-t mt-4">
         <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:underline">
            Source: {item.source}
         </a>
      </div>
    </div>
  );
};

export default SearchResult;
