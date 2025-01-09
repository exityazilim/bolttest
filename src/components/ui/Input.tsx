import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

export function Input({ className, icon, error, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'block w-full rounded-lg border transition duration-200',
            'focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500',
            icon ? 'pl-10' : 'px-4',
            'py-2.5',
            error ? 'border-red-300' : 'border-gray-300',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}