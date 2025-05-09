
"use client";

import React, { useRef, useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Loader2 } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { addContentItemAction } from "@/lib/actions";
import type { ContentItem } from "@/lib/types";

interface ContentFormProps {
  onContentAdded: (item: ContentItem) => void;
}

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
});

export function ContentForm({ onContentAdded }: ContentFormProps) {
  const [state, formAction] = useActionState(addContentItemAction, { error: undefined, item: undefined, fieldErrors: undefined });
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const rhForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  useEffect(() => {
    if (state?.item) {
      onContentAdded(state.item);
      toast({
        title: "Content Added",
        description: `"${state.item.title}" has been added to your list.`,
      });
      rhForm.reset(); // Reset react-hook-form
      if (formRef.current) formRef.current.reset(); // Reset native form
    } else if (state?.error) {
      toast({
        title: "Error",
        description: state.error,
        variant: "destructive",
      });
    }
  }, [state, onContentAdded, toast, rhForm]);
  
  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" disabled={pending} className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0">
        {pending ? <Loader2 className="animate-spin mr-2" /> : <Plus className="mr-2" />}
        Add Content
      </Button>
    );
  }

  return (
    <Form {...rhForm}>
      <form
        ref={formRef}
        action={formAction}
        onSubmit={rhForm.handleSubmit(() => formRef.current?.requestSubmit())}
        className="flex w-full items-end gap-4"
      >
        <FormField
          control={rhForm.control}
          name="url"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel htmlFor="url-input">Add Content URL</FormLabel>
              <FormControl>
                <Input
                  id="url-input"
                  placeholder="Enter URL here (e.g., https://www.youtube.com/... or https://example.com)"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Paste a URL from YouTube, a website, or a PDF.
              </FormDescription>
              {(state?.fieldErrors?.url || rhForm.formState.errors.url) && <FormMessage />}
            </FormItem>
          )}
        />
        <SubmitButton />
      </form>
    </Form>
  );
}

