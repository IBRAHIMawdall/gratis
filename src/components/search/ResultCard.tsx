
import React from 'react';
import Image from 'next/image';
import { FreeItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Star, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type SearchResultProps = {
  item: FreeItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

const SearchResult: React.FC<SearchResultProps> = ({ item, isFavorite, onToggleFavorite }) => {
  return (
    <Card className="h-full flex flex-col group rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border">
      <div className="relative aspect-square w-full overflow-hidden">
        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
          <Image 
              src={item.imageUrl || 'https://placehold.co/600x400.png'} 
              alt={item.title} 
              data-ai-hint={`${item.title} ${item.location}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <h3 className="text-md font-semibold text-white line-clamp-2">{item.title}</h3>
            <div className="flex items-center text-sm text-gray-200 mt-1">
                <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
                <span>{item.location}</span>
            </div>
          </div>
        </a>
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
       <CardContent className="p-3">
         <p className="text-xs text-gray-500">
            Source: <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{item.source}</a>
         </p>
      </CardContent>
    </Card>
  );
};

export default SearchResult;
