
"use client";

import type { ContentItem, ContentType } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconDisplay, Youtube, Globe, FileText, Eye, Edit2, Trash2 } from "@/components/icons";
import { Separator } from "./ui/separator";

interface ContentItemCardProps {
  item: ContentItem;
  onView: (item: ContentItem) => void;
  onDelete: (itemId: string) => void;
  // onEdit: (item: ContentItem) => void; // Future implementation
}

const typeIconMapping: Record<ContentType, React.ElementType> = {
  youtube: Youtube,
  website: Globe,
  pdf: FileText,
  unknown: Globe,
};

const typeIconVariantMapping: Record<ContentType, 'primary' | 'neutral' | 'accent'> = {
  youtube: 'primary', // Example: blue for YouTube
  website: 'accent',  // Example: green for websites
  pdf: 'neutral',     // Example: gray for PDFs
  unknown: 'neutral',
};

export function ContentItemCard({ item, onView, onDelete }: ContentItemCardProps) {
  const IconComponent = typeIconMapping[item.type] || Globe;

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <IconDisplay icon={IconComponent} size="large" variant={typeIconVariantMapping[item.type]} />
          <div className="flex-grow">
            <CardTitle className="text-lg leading-tight mb-1">{item.title}</CardTitle>
            <CardDescription className="text-sm break-all">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary">
                {item.url}
              </a>
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" onClick={() => onView(item)} aria-label="View content">
              <Eye className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => console.log("Edit:", item.id)} aria-label="Edit content"> {/* Placeholder */}
              <Edit2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)} className="text-destructive hover:text-destructive/90" aria-label="Delete content">
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      { (item.summary || (item.tags && item.tags.length > 0)) && <Separator className="my-0"/> }
      <CardContent className="pt-4 pb-3">
        {item.summary && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.summary}</p>}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-2 pb-3">
        Added on {new Date(item.createdAt).toLocaleDateString()}
      </CardFooter>
    </Card>
  );
}
