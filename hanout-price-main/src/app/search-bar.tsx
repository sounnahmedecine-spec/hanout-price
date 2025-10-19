oo'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { Input, InputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface SearchBarProps extends Omit<InputProps, 'onChange'> {
  onSearch?: (query: string) => void;
  debounce?: number;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, onSearch, debounce = 300, ...props }, ref) => {
    const [query, setQuery] = React.useState('');

    const handleClear = () => {
      setQuery('');
    };

    React.useEffect(() => {
      const handler = setTimeout(() => {
        onSearch?.(query);
      }, debounce);

      return () => clearTimeout(handler);
    }, [query, debounce, onSearch]);

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Rechercher un produit..."
        className="pl-12 pr-12 w-full h-12 rounded-full bg-card-bg border-border shadow-sm focus-visible:ring-primary"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={ref}
        {...props}
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Effacer la recherche"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';