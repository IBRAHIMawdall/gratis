"use client";

import React from 'react';
import { FreeItem } from '@/lib/types';
import { MapPin, Star } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type MapViewProps = {
  items: FreeItem[];
  favorites: FreeItem[];
};

// Bounding box for UAE
const latMin = 22.5;
const latMax = 26.1;
const lngMin = 51.6;
const lngMax = 56.4;

const MapView: React.FC<MapViewProps> = ({ items, favorites }) => {
  const allItems = [...items, ...favorites];
  const uniqueItems = Array.from(new Map(allItems.map(item => [item.id, item])).values());
  
  const getPosition = (lat: number, lng: number) => {
    const top = 100 - ((lat - latMin) / (latMax - latMin)) * 100;
    const left = ((lng - lngMin) / (lngMax - lngMin)) * 100;
    return { top: `${top}%`, left: `${left}%` };
  };

  return (
    <TooltipProvider>
      <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden border">
        <div 
            className="absolute inset-0 opacity-20"
            style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'hsl(var(--muted-foreground))\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
            <p className="font-headline text-2xl text-gray-400 select-none">Map View</p>
        </div>

        {uniqueItems.map((item) => {
          const isFavorite = favorites.some(fav => fav.id === item.id);
          const { top, left } = getPosition(item.coordinates.lat, item.coordinates.lng);
          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ top, left }}
                >
                  {isFavorite ? (
                     <Star className="h-6 w-6 text-yellow-500 fill-yellow-500 animate-pulse" />
                  ) : (
                    <MapPin className="h-6 w-6 text-blue-600 fill-blue-600/70" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-bold">{item.title}</p>
                <p>{item.location}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default MapView;
