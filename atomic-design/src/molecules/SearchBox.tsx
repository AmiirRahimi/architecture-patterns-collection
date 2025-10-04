// Molecule - Simple combination of atoms
import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

interface SearchBoxProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  loading?: boolean;
  className?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = 'Search...',
  onSearch,
  loading = false,
  className = '',
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <div className="flex-1">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full"
        />
      </div>
      
      <Button
        type="submit"
        variant="primary"
        loading={loading}
        disabled={!query.trim()}
      >
        Search
      </Button>
      
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
        >
          Clear
        </Button>
      )}
    </form>
  );
};
