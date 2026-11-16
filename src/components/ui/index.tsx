import * as React from 'react';
import { cn } from '@/components/ui/button';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}

const badgeVariants = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
  outline: 'border border-input bg-background',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant = 'default', ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
});
Badge.displayName = 'Badge';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => {
  return (
    <label ref={ref} className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)} {...props} />
  );
});
Label.displayName = 'Label';

export interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {}
export const Separator = React.forwardRef<HTMLHRElement, SeparatorProps>(({ className, ...props }, ref) => {
  return (
    <hr ref={ref} className={cn('border-border', className)} {...props} />
  );
});
Separator.displayName = 'Separator';

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

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'animate-pulse rounded-md bg-secondary',
        className,
      )}
      {...props}
    />
  );
});
Skeleton.displayName = 'Skeleton';

export { cn };
