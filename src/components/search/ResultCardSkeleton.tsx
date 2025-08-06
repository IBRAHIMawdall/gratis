
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '../ui/card';

const ResultCardSkeleton: React.FC = () => {
  return (
    <Card className="h-full flex flex-col rounded-lg overflow-hidden shadow-sm border">
      <Skeleton className="w-full aspect-square" />
      <CardContent className="p-3">
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
    </Card>
  );
};

export default ResultCardSkeleton;
