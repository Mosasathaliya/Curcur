
"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, Database, Youtube, Globe, FileText } from "@/components/icons";
import { ContentForm } from "@/components/content-form";
import { ContentList } from "@/components/content-list";
import { ContentPreviewCard } from "@/components/content-preview-card";
import type { ContentItem, ContentType } from "@/lib/types";

// Mock initial data for demonstration - remove or replace with actual data fetching/storage
const initialContentItems: ContentItem[] = [
  {
    id: "1",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    title: "Intro to Modern Web Development",
    type: "youtube",
    summary: "A comprehensive overview of current web development technologies and practices.",
    keywords: ["web development", "javascript", "react", "nodejs"],
    tags: ["lecture", "beginner", "web"],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    previewType: 'iframe',
  },
  {
    id: "2",
    url: "https://tailwindcss.com/docs/installation",
    title: "Tailwind CSS Documentation",
    type: "website",
    type: "website",
    summary: "Official documentation for Tailwind CSS, a utility-first CSS framework.",
    keywords: ["css", "tailwind", "framework", "documentation"],
    tags: ["reference", "css", "frontend"],
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    previewType: 'iframe',
  },
];


export default function ContentCuratorPage() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [activeTab, setActiveTab] = useState<ContentType>("youtube");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load from localStorage or fetch from API in a real app
    const storedItems = localStorage.getItem("contentItems");
    if (storedItems) {
      setContentItems(JSON.parse(storedItems));
    } else {
      // Use initial mock data if nothing in localStorage
      // setContentItems(initialContentItems); 
      // For now, start empty unless explicitly using mock.
      // If you want to start with mock data:
      // setContentItems(initialContentItems);
      // localStorage.setItem("contentItems", JSON.stringify(initialContentItems));
    }
  }, []);

  useEffect(() => {
    if(isClient) {
      localStorage.setItem("contentItems", JSON.stringify(contentItems));
    }
  }, [contentItems, isClient]);

  const handleContentAdded = (newItem: ContentItem) => {
    setContentItems((prevItems) => [newItem, ...prevItems]);
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
  };
  
  const handleExportHTML = () => {
    const htmlContent = `
      <html>
        <head><title>Content Export</title></head>
        <body>
          <h1>My Curated Content</h1>
          <ul>
            ${contentItems.map(item => `<li><a href="${item.url}">${item.title}</a> (${item.type}) - Tags: ${item.tags.join(', ')}</li>`).join('')}
          </ul>
        </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'content_export.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log("Exporting HTML...");
  };

  const handleExportDatabase = () => {
    const jsonContent = JSON.stringify(contentItems, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'content_database.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log("Exporting Database (JSON)...");
  };

  const filteredItems = contentItems.filter(item => activeTab === 'all' || item.type === activeTab);

  if (!isClient) {
    // Render a loading state or null until client-side hydration to avoid mismatch
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading Content Curator...</p>
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
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleExportHTML}
              >
                <Download className="mr-2 h-4 w-4" />
                Export HTML
              </Button>
              <Button
                variant="default"
                onClick={handleExportDatabase}
              >
                <Database className="mr-2 h-4 w-4" />
                Export JSON
              </Button>
            </div>
          </div>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ContentType | 'all')}>
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="all" className="flex items-center gap-2"><Globe /> All</TabsTrigger>
              <TabsTrigger value="youtube" className="flex items-center gap-2"><Youtube /> YouTube</TabsTrigger>
              <TabsTrigger value="website" className="flex items-center gap-2"><Globe /> Websites</TabsTrigger>
              <TabsTrigger value="pdf" className="flex items-center gap-2"><FileText /> PDFs</TabsTrigger>
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
