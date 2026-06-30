import { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm text-muted-foreground mb-2">
            {label}
            {props.required && <span className="text-destructive mr-1">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          )}
          <input
            ref={ref}
            className={`w-full px-4 py-3 ${
              Icon ? 'pr-10' : ''
            } bg-input-background border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              error
                ? 'border-destructive focus:ring-destructive/20'
                : 'border-border focus:ring-ring/20'
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-destructive mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-muted-foreground mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
