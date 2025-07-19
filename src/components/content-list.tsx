
"use client";

import type { ContentItem } from "@/lib/types";
import { ContentItemCard } from "./content-item-card";

interface ContentListProps {
  items: ContentItem[];
  onViewItem: (item: ContentItem) => void;
  onDeleteItem: (itemId: string) => void;
}

export function ContentList({ items, onViewItem, onDeleteItem }: ContentListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p className="text-lg">No content added yet.</p>
        <p>Use the form above to add your first piece of content!</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-start gap-4">
      {items.map((item, index) => (
        <ContentItemCard
          key={`${item.id}-${index}`}
          item={item}
          onView={onViewItem}
          onDelete={onDeleteItem}
        />
      ))}
    </div>
  );
}
