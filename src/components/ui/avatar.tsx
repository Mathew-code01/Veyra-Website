import * as React from 'react';
import { cn } from '@/components/ui/button';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(({ className, src, alt, size = 'md', ...props }, ref) => {
  const sizes = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' };
  return (
    <div ref={ref} className={cn('relative flex shrink-0 overflow-hidden rounded-full', sizes[size], className)} {...props}>
      {src ? <img src={src} alt={alt ?? 'Avatar'} className="aspect-square h-full w-full object-cover" /> : null}
    </div>
  );
});
Avatar.displayName = 'Avatar';
