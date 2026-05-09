import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  isOpen: boolean;
  onToggle: () => void;
  onSearch: (query: string) => void;
  onClear: () => void;
}

export function SearchBar({ isOpen, onToggle, onSearch, onClear }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onClear();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClose = () => {
    setQuery('');
    onClear();
    onToggle();
  };

  return (
    <div className="flex items-center">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="search-open"
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex items-center gap-2 bg-white border border-[#DDD8F0] rounded-2xl h-[52px] px-4 flex-1 focus-within:border-[#9B8EC7] focus-within:shadow-[0_0_0_3px_rgba(155,142,199,0.12)] transition-shadow"
          >
            <Search size={18} className="text-[#9B8EC7] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleChange}
              placeholder="Search your notes..."
              className="flex-1 bg-transparent text-[17px] text-[#1E1E24] placeholder:text-[#6B6875] outline-none"
            />
            {query && (
              <button onClick={handleClear} aria-label="Clear search">
                <X size={16} className="text-[#6B6875]" />
              </button>
            )}
            <button onClick={handleClose} className="text-[12px] text-[#6B6875] ml-1">
              Cancel
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="search-closed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="p-2"
            aria-label="Search notes"
          >
            <Search size={20} className="text-[#6B6875]" strokeWidth={1.5} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
