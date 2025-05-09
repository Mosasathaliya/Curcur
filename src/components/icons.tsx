
"use client";
import type { LucideIcon } from 'lucide-react';
import { Youtube, Globe, FileText, Plus, Eye, Edit2, Trash2, X, Download, Database, Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export { Youtube, Globe, FileText, Plus, Eye, Edit2, Trash2, X, Download, Database, Search, Loader2 };

interface IconDisplayProps {
  icon: LucideIcon;
  variant?: 'primary' | 'neutral' | 'accent';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const IconDisplay: React.FC<IconDisplayProps> = ({ icon: Icon, variant = 'primary', size = 'medium', className }) => {
  const sizeClasses = {
    small: 'p-1.5',
    medium: 'p-2',
    large: 'p-3',
  };

  const iconSizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
  }

  const variantClasses = {
    primary: 'bg-primary/10 text-primary',
    neutral: 'bg-secondary text-secondary-foreground',
    accent: 'bg-accent/10 text-accent',
  };

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      <Icon className={cn(iconSizeClasses[size])} />
    </div>
  );
};
