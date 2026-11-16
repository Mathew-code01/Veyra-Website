import * as React from 'react';
import { cn } from '@/components/ui/button';

export interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {}
export const Separator = React.forwardRef<HTMLHRElement, SeparatorProps>(({ className, ...props }, ref) => {
  return (
    <hr ref={ref} className={cn('border-border', className)} {...props} />
  );
});
Separator.displayName = 'Separator';
