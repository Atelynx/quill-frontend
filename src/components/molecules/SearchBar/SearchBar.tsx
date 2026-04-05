// components/molecules/SearchBar/SearchBar.tsx
import React from 'react';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ onSearch, placeholder = 'Search...' }: SearchBarProps) => {
  const [query, setQuery] = React.useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder={placeholder}
        value={query}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
      <Button onClick={handleSearch} variant="primary">
        Search
      </Button>
    </div>
  );
};