
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
import { MapPin } from 'lucide-react';

const formSchema = z.object({
  description: z.string().min(1, {
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
                      className="rounded-full h-12 pr-12 text-base bg-white"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
             <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-blue-600 hover:bg-blue-700">
                <Search className="text-white"/>
            </Button>
          </form>
       </Form>
    )
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSearch)} className="space-y-4">
          <div className="bg-white rounded-lg shadow-lg p-2 flex items-center gap-2">
            <div className="relative flex items-center flex-grow">
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
                        className="h-12 pl-12 pr-4 text-base border-0 focus-visible:ring-0 shadow-none"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="relative flex items-center flex-grow border-l">
              <MapPin className="absolute left-4 text-gray-400" />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input
                        placeholder="e.g., Dubai, UAE"
                        {...field}
                        className="h-12 pl-12 pr-4 text-base border-0 focus-visible:ring-0 shadow-none"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isSearching} className="bg-blue-600 text-white hover:bg-blue-700 px-6 h-12 rounded-md">
              {isSearching ? <Loader2 className="animate-spin" /> : <Search />}
            </Button>
          </div>
           <div className="flex justify-center gap-4 pt-2">
                <FormMessage>{form.formState.errors.description?.message}</FormMessage>
                <FormMessage>{form.formState.errors.location?.message}</FormMessage>
            </div>
        </form>
      </Form>
    </div>
  );
}
