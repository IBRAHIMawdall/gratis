import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ResultCardSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
      <CardFooter className="flex justify-between items-center">
         <Skeleton className="h-6 w-20" />
         <Skeleton className="h-6 w-24" />
      </CardFooter>
    </Card>
  );
};

export default ResultCardSkeleton;
