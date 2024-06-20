import { NextPage } from "next";
import { Skeleton } from "../ui/skeleton";

interface ProductPlaceholderProps {}

export const ProductPlaceholder: NextPage<ProductPlaceholderProps> = ({}) => {
  return (
    <div className="flex w-full flex-col">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100">
        <Skeleton className="h-full w-full" />
      </div>
      <Skeleton className="mt-4 h-4 w-2/3 rounded-lg" />
      <Skeleton className="mt-4 h-4 w-16 rounded-lg" />
      <Skeleton className="mt-4 h-4 w-12 rounded-lg" />
    </div>
  );
};
