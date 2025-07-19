
"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Database, Youtube, Globe, FileText } from "@/components/icons";
import { ContentForm } from "@/components/content-form";
import { ContentList } from "@/components/content-list";
import { ContentPreviewCard } from "@/components/content-preview-card";
import type { ContentItem, ContentType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";

export default function ContentCuratorPage() {
  const [contentItems, setContentItems] = useLocalStorage<ContentItem[]>("contentItems", []);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [activeTab, setActiveTab] = useState<ContentType | "all">("all");
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleContentAdded = (newItem: ContentItem) => {
    setContentItems((prevItems) => {
      // Prevent adding duplicates
      if (prevItems.find(item => item.id === newItem.id)) {
        return prevItems;
      }
      return [newItem, ...prevItems];
    });
  };

  const handleViewItem = (item: ContentItem) => {
    setSelectedContent(item);
  };

  const handleClosePreview = () => {
    setSelectedContent(null);
  };

  const handleDeleteItem = (itemId: string) => {
    setContentItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    if (selectedContent?.id === itemId) {
      setSelectedContent(null);
    }
    toast({
      title: "Content Deleted",
      description: "The item has been removed from your list.",
    });
  };
  
  const handleExportHTML = () => {
    if (!isClient) return;
    if (contentItems.length === 0) {
      toast({
        title: "No Content to Export",
        description: "Please add some content before exporting.",
        variant: "destructive",
      });
      return;
    }
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Content Export</title>
          <style>
            body { font-family: sans-serif; margin: 20px; line-height: 1.6; }
            h1 { color: #333; }
            ul { list-style-type: none; padding: 0; }
            li { margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
            a { color: #007bff; text-decoration: none; }
            a:hover { text-decoration: underline; }
            .item-type { font-size: 0.9em; color: #555; }
            .item-tags { font-size: 0.9em; color: #777; }
          </style>
        </head>
        <body>
          <h1>My Curated Content</h1>
          <ul>
            ${contentItems.map(item => `
              <li>
                <strong><a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.title}</a></strong><br>
                <span class="item-type">Type: ${item.type}</span><br>
                <span class="item-url">URL: <a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.url}</a></span><br>
                ${item.summary ? `<p>Summary: ${item.summary}</p>` : ''}
                ${item.tags && item.tags.length > 0 ? `<span class="item-tags">Tags: ${item.tags.join(', ')}</span>` : ''}
              </li>`).join('')}
          </ul>
        </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'content_export.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast({
      title: "Export Successful",
      description: "HTML file has been downloaded.",
    });
  };

  const handleExportDatabase = () => {
    if (!isClient) return;
     if (contentItems.length === 0) {
      toast({
        title: "No Content to Export",
        description: "Please add some content before exporting.",
        variant: "destructive",
      });
      return;
    }
    const jsonContent = JSON.stringify(contentItems, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'content_database.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast({
      title: "Export Successful",
      description: "JSON database file has been downloaded.",
    });
  };

  const filteredItems = contentItems.filter(item => activeTab === 'all' || item.type === activeTab);

  if (!isClient) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
        <p className="text-lg">Loading Content Curator...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-background">
      <main className="w-full max-w-4xl flex-grow px-4 sm:px-6 py-8 sm:py-12">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Content Curator Pro
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                onClick={handleExportHTML}
                className="w-full sm:w-auto"
              >
                <Download className="mr-2 h-4 w-4" />
                Export HTML
              </Button>
              <Button
                variant="default"
                onClick={handleExportDatabase}
                className="w-full sm:w-auto"
              >
                <Database className="mr-2 h-4 w-4" />
                Export JSON
              </Button>
            </div>
          </div>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ContentType | 'all')}>
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="all" className="flex items-center gap-2"><Globe className="h-4 w-4"/> All</TabsTrigger>
              <TabsTrigger value="youtube" className="flex items-center gap-2"><Youtube className="h-4 w-4"/> YouTube</TabsTrigger>
              <TabsTrigger value="website" className="flex items-center gap-2"><Globe className="h-4 w-4"/> Websites</TabsTrigger>
              <TabsTrigger value="pdf" className="flex items-center gap-2"><FileText className="h-4 w-4"/> PDFs</TabsTrigger>
            </TabsList>
          </Tabs>
        </header>

        <section className="mb-8">
          <ContentForm onContentAdded={handleContentAdded} />
        </section>

        <section>
          <ContentList
            items={filteredItems}
            onViewItem={handleViewItem}
            onDeleteItem={handleDeleteItem}
          />
        </section>
      </main>

      {selectedContent && (
        <ContentPreviewCard item={selectedContent} onClose={handleClosePreview} />
      )}
       <footer className="w-full text-center p-4 border-t border-border text-sm text-muted-foreground mt-auto">
        Built with Next.js, ShadCN UI, and Genkit AI.
      </footer>
    </div>
  );
}
