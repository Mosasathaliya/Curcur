
export type ContentType = 'youtube' | 'website' | 'pdf' | 'unknown';

export interface ContentItem {
  id: string;
  url: string;
  title: string;
  type: ContentType;
  summary?: string;
  keywords?: string[];
  tags: string[];
  createdAt: string; // ISO date string
  previewType?: 'iframe' | 'text' | 'image'; // Helps determine how to render preview
}
