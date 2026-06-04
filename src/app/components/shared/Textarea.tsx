import { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm text-muted-foreground mb-2">
            {label}
            {props.required && <span className="text-destructive mr-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full px-4 py-3 bg-input-background border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none ${
            error
              ? 'border-destructive focus:ring-destructive/20'
              : 'border-border focus:ring-ring/20'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-destructive mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-muted-foreground mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
