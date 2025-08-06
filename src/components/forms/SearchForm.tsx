
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
  description: z.string().min(1, {
    message: "Please describe what you're looking for.",
  }),
  location: z.string(),
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

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSearch)} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    placeholder={strings.placeholder}
                    {...field} 
                    className="rounded-full h-12 pl-12 pr-12 text-base bg-white shadow-sm focus:shadow-md"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" size="icon" disabled={isSearching} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary hover:bg-primary/90">
             {isSearching ? <Loader2 className="animate-spin" /> : <Search className="text-white"/>}
          </Button>
          <FormMessage className="pl-4 pt-1 text-xs">
            {form.formState.errors.description?.message}
          </FormMessage>
        </form>
      </Form>
    </div>
  );
}
