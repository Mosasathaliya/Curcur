"use client";

import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { addContentItemAction } from "@/lib/actions";
import type { ContentItem } from "@/lib/types";

interface ContentFormProps {
  onContentAdded: (item: ContentItem) => void;
}

export function ContentForm({ onContentAdded }: ContentFormProps) {
  const [state, formAction, isPending] = React.useActionState(addContentItemAction, {
    error: undefined,
    item: undefined,
    fieldErrors: undefined,
  });
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.item) {
      onContentAdded(state.item);
      toast({
        title: "Content Added",
        description: `"${state.item.title}" has been added to your list.`,
      });
      formRef.current?.reset();
    } else if (state?.error) {
      toast({
        title: "Error Adding Content",
        description: state.error,
        variant: "destructive",
      });
    }
  }, [state, onContentAdded, toast]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex w-full flex-col sm:flex-row items-start sm:items-end gap-4"
    >
      <div className="flex-grow w-full space-y-2">
        <Label htmlFor="url-input">Add Content URL</Label>
        <Input
          id="url-input"
          name="url"
          placeholder="Enter URL (e.g., https://youtube.com/... or https://example.com)"
          className={state?.fieldErrors?.url ? "border-destructive" : ""}
          required
        />
        <p className="text-sm text-muted-foreground">
          Paste a URL from YouTube, a website, or a PDF. AI will summarize it.
        </p>
        {state?.fieldErrors?.url && (
          <p className="text-sm font-medium text-destructive">
            {state.fieldErrors.url.join(", ")}
          </p>
        )}
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0"
      >
        {isPending ? (
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
        ) : (
          <Plus className="mr-2 h-4 w-4" />
        )}
        Add Content
      </Button>
    </form>
  );
}
