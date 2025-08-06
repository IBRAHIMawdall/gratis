import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ResultCardSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader className="p-0">
         <Skeleton className="h-48 w-full" />
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
         <Skeleton className="h-4 w-1/3" />
      </CardFooter>
    </Card>
  );
};

export default ResultCardSkeleton;
