"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages } from "lucide-react";

type LanguageSelectorProps = {
    onLanguageChange: (language: string) => void;
};

export default function LanguageSelector({ onLanguageChange }: LanguageSelectorProps) {
  return (
    <Select onValueChange={onLanguageChange} defaultValue="en">
      <SelectTrigger className="w-[180px]">
        <Languages className="mr-2 h-4 w-4" />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="ar">العربية (Arabic)</SelectItem>
        <SelectItem value="es">Español (Spanish)</SelectItem>
        <SelectItem value="fr">Français (French)</SelectItem>
        <SelectItem value="de">Deutsch (German)</SelectItem>
        <SelectItem value="ur">اردو (Urdu)</SelectItem>
      </SelectContent>
    </Select>
  );
}
