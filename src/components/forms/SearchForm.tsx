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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
};

export default function SearchForm({ onSearch, isSearching }: SearchFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      location: "",
    },
  });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Find Something Free</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSearch)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>I'm looking for...</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., a free couch, guitar lessons" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Near...</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Brooklyn, NY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isSearching} className="w-full">
              {isSearching ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Search />
              )}
              <span className="ml-2">Search</span>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
