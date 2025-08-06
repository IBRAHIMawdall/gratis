import React from 'react';
import { FreeItem } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Link as LinkIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type ResultCardProps = {
  item: FreeItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

const ResultCard: React.FC<ResultCardProps> = ({ item, isFavorite, onToggleFavorite }) => {
  return (
    <Card className="transition-all hover:shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="font-headline text-xl">{item.title}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onToggleFavorite} aria-label="Toggle Favorite">
            <Star className={`w-6 h-6 transition-colors ${isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
          </Button>
        </div>
        <CardDescription className="flex items-center gap-2 pt-2">
            <MapPin className="w-4 h-4 text-muted-foreground" /> 
            <span className="font-body">{item.location}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-body text-sm text-muted-foreground">{item.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
         <Badge variant="secondary">{item.source}</Badge>
         <Button variant="link" asChild>
            <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                View Source
                <LinkIcon className="w-4 h-4 ml-2" />
            </a>
         </Button>
      </CardFooter>
    </Card>
  );
};

export default ResultCard;
