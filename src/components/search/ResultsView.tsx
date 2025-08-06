import React from 'react';
import { FreeItem } from '@/lib/types';
import ResultsList from './ResultsList';
import MapView from '../map/MapView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ResultsViewProps = {
  results: FreeItem[];
  favorites: FreeItem[];
  isLoading: boolean;
  onToggleFavorite: (item: FreeItem) => void;
};

const ResultsView: React.FC<ResultsViewProps> = ({
  results,
  favorites,
  isLoading,
  onToggleFavorite,
}) => {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden">
      <div className="lg:col-span-1 h-full overflow-y-auto pr-2">
         <ResultsList
            results={results}
            favorites={favorites}
            isLoading={isLoading}
            onToggleFavorite={onToggleFavorite}
          />
      </div>
      <aside className="hidden lg:block lg:col-span-1 rounded-lg overflow-hidden h-full">
        <MapView items={results} favorites={favorites} />
      </aside>
    </div>
  );
};

export default ResultsView;
