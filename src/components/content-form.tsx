"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { createContentItem, validateUrl } from "@/lib/actions";
import type { ContentItem } from "@/lib/types";

interface ContentFormProps {
  onContentAdded: (item: ContentItem) => void;
}

export function ContentForm({ onContentAdded }: ContentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [urlError, setUrlError] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setUrlError("");

    const formData = new FormData(e.currentTarget);
    const url = formData.get("url") as string;

    const validation = validateUrl(url);
    if (!validation.success) {
      setUrlError(validation.error || "Invalid URL");
      setIsLoading(false);
      return;
    }

    try {
      const newItem = createContentItem(url);
      onContentAdded(newItem);
      
      toast({
        title: "Content Added",
        description: "Content has been added to your list.",
      });
      
      formRef.current?.reset();
      
    } catch (error) {
      console.error("Error adding content:", error);
      toast({
        title: "Error Adding Content",
        description: "Failed to add content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex w-full flex-col sm:flex-row items-start sm:items-end gap-4"
    >
      <div className="flex-grow w-full space-y-2">
        <Label htmlFor="url-input">Add Content URL</Label>
        <Input
          id="url-input"
          name="url"
          placeholder="Enter URL (e.g., https://youtube.com/... or https://example.com)"
          className={urlError ? "border-destructive" : ""}
          required
        />
        <p className="text-sm text-muted-foreground">
          Paste a URL from YouTube, a website, or a PDF to add it to your collection.
        </p>
        {urlError && (
          <p className="text-sm font-medium text-destructive">
            {urlError}
          </p>
        )}
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0"
      >
        {isLoading ? (
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
        ) : (
          <Plus className="mr-2 h-4 w-4" />
        )}
        Add Content
      </Button>
    </form>
  );
}
