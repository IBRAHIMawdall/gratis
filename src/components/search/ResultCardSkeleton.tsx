
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ResultCardSkeleton: React.FC = () => {
  return (
    <div className="h-full flex flex-col rounded-lg overflow-hidden bg-white shadow-md border border-gray-200">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 flex-grow">
        <Skeleton className="h-5 w-3/4 mb-3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
       <div className="p-4 pt-0 border-t mt-4">
         <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
};

export default ResultCardSkeleton;
