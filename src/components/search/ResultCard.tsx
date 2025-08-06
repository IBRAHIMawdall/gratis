import React from 'react';
import Image from 'next/image';
import { FreeItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type SearchResultProps = {
  item: FreeItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

const SearchResult: React.FC<SearchResultProps> = ({ item, isFavorite, onToggleFavorite }) => {
  return (
    <Card className="h-full flex flex-col group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden">
            <Image 
                src={item.imageUrl || 'https://placehold.co/600x400.png'} 
                alt={item.title} 
                data-ai-hint={`${item.title} ${item.location}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
             <Button 
                variant="ghost" 
                size="icon" 
                onClick={onToggleFavorite} 
                aria-label="Toggle Favorite"
                className="absolute top-2 right-2 rounded-full bg-black/30 hover:bg-black/50 text-white hover:text-white"
            >
                <Star className={`w-5 h-5 transition-colors ${isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-white/80'}`} />
            </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
         <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
            <CardTitle className="text-lg font-bold group-hover:text-blue-600 transition-colors">{item.title}</CardTitle>
         </a>
        <p className="text-sm text-gray-500 mt-1">{item.location}</p>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
         <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:underline">
            Source: {item.source}
         </a>
      </CardFooter>
    </Card>
  );
};

export default SearchResult;
