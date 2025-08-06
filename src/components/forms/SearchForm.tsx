"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";

const formSchema = z.object({
  description: z.string().min(3, {
    message: "Please describe what you're looking for.",
  }),
  location: z.string().min(3, {
    message: "Please provide your location (e.g., city, neighborhood).",
  }),
});

type SearchFormProps = {
  onSearch: (values: z.infer<typeof formSchema>) => void;
  isSearching: boolean;
  initialValues?: z.infer<typeof formSchema>;
  strings: {
    placeholder: string;
    searchButton: string;
    feelingLucky: string;
  }
};

export default function SearchForm({ onSearch, isSearching, initialValues, strings }: SearchFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      description: "",
      location: "",
    },
  });

  const hasResults = !!initialValues;

  if (hasResults) {
    return (
       <Form {...form}>
          <form onSubmit={form.handleSubmit(onSearch)} className="relative">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder={strings.placeholder} 
                      {...field} 
                      className="rounded-full h-12 pr-12 text-base"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
             <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-transparent hover:bg-gray-200">
                <Search className="text-[#4285F4]"/>
            </Button>
          </form>
       </Form>
    )
  }

  return (
    <div className="w-full max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSearch)} className="space-y-4">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-gray-400" />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input
                      placeholder={strings.placeholder}
                      {...field}
                      className="rounded-full h-12 pl-12 pr-4 text-base shadow-md focus-visible:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="pl-4"/>
                </FormItem>
              )}
            />
          </div>
          <div className="relative flex items-center">
             <Search className="absolute left-4 text-gray-400" />
             <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input
                      placeholder="e.g., Dubai, UAE"
                      {...field}
                      className="rounded-full h-12 pl-12 pr-4 text-base shadow-md focus-visible:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="pl-4" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-center gap-4 pt-2">
            <Button type="submit" disabled={isSearching} className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-2 h-10">
              {isSearching ? (
                <Loader2 className="animate-spin" />
              ) : (
                strings.searchButton
              )}
            </Button>
             <Button type="button" variant="ghost" className="text-gray-700 hover:bg-gray-100">{strings.feelingLucky}</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
