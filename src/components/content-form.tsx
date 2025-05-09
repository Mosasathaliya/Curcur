
"use client";

import React, { useRef, useEffect } from "react"; // Removed useActionState from react import
import { useFormStatus } from "react-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Label removed as it's unused directly here, FormLabel is used from Form component
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
  // Use React.useActionState directly
  const [state, formAction, isPending] = React.useActionState(addContentItemAction, { error: undefined, item: undefined, fieldErrors: undefined });
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
      rhForm.reset(); 
      if (formRef.current) formRef.current.reset(); 
    } else if (state?.error) {
      toast({
        title: "Error Adding Content",
        description: state.error,
        variant: "destructive",
      });
       // Set react-hook-form errors if fieldErrors are present
      if (state.fieldErrors?.url) {
        rhForm.setError("url", { type: "manual", message: state.fieldErrors.url.join(", ") });
      }
    }
  }, [state, onContentAdded, toast, rhForm]);
  
  function SubmitButton() {
    // const { pending } = useFormStatus(); // Replaced by isPending from useActionState
    return (
      <Button type="submit" disabled={isPending} className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0">
        {isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
        Add Content
      </Button>
    );
  }

  // Use the formAction from useActionState directly in the form's action prop
  // For react-hook-form integration, we still use rhForm.handleSubmit to trigger validation
  // and then manually call formRef.current?.requestSubmit() which now uses the formAction.
  return (
    <Form {...rhForm}>
      <form
        ref={formRef}
        action={formAction} // Pass the formAction from useActionState
        onSubmit={(evt) => {
          evt.preventDefault(); // Prevent default form submission
          rhForm.handleSubmit(() => {
            // Create FormData from react-hook-form's values
            const formData = new FormData();
            formData.append("url", rhForm.getValues("url"));
            // Directly invoke the server action with FormData
            // This replaces formRef.current?.requestSubmit()
            // The 'formAction' from useActionState expects FormData.
             (formAction as (payload: FormData) => void)(formData);
          })(evt);
        }}
        className="flex w-full flex-col sm:flex-row items-start sm:items-end gap-4"
      >
        <FormField
          control={rhForm.control}
          name="url"
          render={({ field }) => (
            <FormItem className="flex-grow w-full">
              <FormLabel htmlFor="url-input">Add Content URL</FormLabel>
              <FormControl>
                <Input
                  id="url-input"
                  placeholder="Enter URL (e.g., https://youtube.com/... or https://example.com)"
                  {...field}
                  className={rhForm.formState.errors.url ? "border-destructive" : ""}
                />
              </FormControl>
              <FormDescription>
                Paste a URL from YouTube, a website, or a PDF. AI will summarize it.
              </FormDescription>
              {/* Display errors from react-hook-form which now includes server errors */}
              {rhForm.formState.errors.url && <FormMessage>{rhForm.formState.errors.url.message}</FormMessage>}
            </FormItem>
          )}
        />
        <SubmitButton />
      </form>
    </Form>
  );
}
