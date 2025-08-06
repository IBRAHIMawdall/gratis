import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription
} from "@/components/ui/sheet"
import { Star, Trash2 } from "lucide-react"
import { FreeItem } from "@/lib/types"
import { ScrollArea } from "../ui/scroll-area"

type FavoritesSheetProps = {
    favorites: FreeItem[];
    onToggleFavorite: (item: FreeItem) => void;
    strings: {
        favorites: string;
    }
};

export function FavoritesSheet({ favorites, onToggleFavorite, strings }: FavoritesSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
            <Star className="mr-2 h-4 w-4" />
            {strings.favorites} ({favorites.length})
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-headline">Your Favorites</SheetTitle>
          <SheetDescription>
            A list of your saved free items and services.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-4">
            {favorites.length > 0 ? (
                <div className="space-y-4">
                {favorites.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                        <div>
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.location}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => onToggleFavorite(item)}>
                            <Trash2 className="h-5 w-5 text-destructive" />
                        </Button>
                    </div>
                ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <Star className="w-16 h-16 text-muted-foreground/50 mb-4" />
                    <p className="font-semibold">No favorites yet</p>
                    <p className="text-sm text-muted-foreground">Click the star on an item to save it.</p>
                </div>
            )}
            </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}
