import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'hover' | 'interactive';
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-100',
        variant === 'default' && 'shadow-sm',
        variant === 'hover' && 'shadow-sm hover:shadow-md transition-all duration-200',
        variant === 'interactive' && 'shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
        className
      )}
      {...props}
    />
  );
}

Card.Header = function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6', className)} {...props} />;
};

Card.Content = function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-6 pb-6', className)} {...props} />;
};