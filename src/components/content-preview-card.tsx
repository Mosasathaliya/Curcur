
"use client";

import type { ContentItem } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "@/components/icons";

interface ContentPreviewCardProps {
  item: ContentItem;
  onClose: () => void;
}

export function ContentPreviewCard({ item, onClose }: ContentPreviewCardProps) {
  const getEmbedUrl = (url: string): string | null => {
    if (item.type === 'youtube') {
      try {
        const videoId = new URL(url).searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      } catch {
        return null;
      }
    }
    return url; // For generic websites
  };
  
  const embedUrl = getEmbedUrl(item.url);

  return (
    <Card className="w-full shadow-lg fixed bottom-0 right-0 md:bottom-6 md:right-6 md:max-w-2xl max-h-[80vh] md:max-h-[calc(100vh-3rem)] z-50 flex flex-col animate-in slide-in-from-bottom-12 md:slide-in-from-right-12 duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="space-y-1">
          <CardTitle className="text-xl">{item.title}</CardTitle>
          <CardDescription>
            Previewing: <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary">{item.url}</a>
          </CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close preview">
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto p-0">
        {item.previewType === 'iframe' && embedUrl ? (
          <iframe
            src={embedUrl}
            title={item.title}
            className="w-full h-full min-h-[300px] md:min-h-[400px] border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-presentation" // Added sandbox for security
          />
        ) : item.previewType === 'text' && item.summary ? (
          <div className="p-6">
            <h3 className="font-semibold mb-2">Summary:</h3>
            <p className="text-sm whitespace-pre-wrap">{item.summary}</p>
            {item.keywords && item.keywords.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-1">Keywords:</h4>
                <div className="flex flex-wrap gap-2">
                  {item.keywords.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-96 w-full flex-none items-center justify-center rounded-md bg-muted/50">
            <span className="text-muted-foreground">
              {item.type === 'pdf' ? 'PDF preview not available. View summary or open link.' : 'Preview content here or open link.'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
