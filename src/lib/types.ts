export type FreeItem = {
  id: string;
  title: string;
  description: string;
  location: string;
  source: string;
  sourceUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  imageUrl?: string;
};
