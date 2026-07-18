import { Search, X } from 'lucide-react';
import { useState } from 'react';

export function SearchBar({ value, onChange, placeholder = "Search...", className = "" }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`flex items-center px-3 py-1.5 bg-[#F6F8FA] border rounded-md transition-colors
          ${isFocused ? 'bg-white border-accent ring-2 ring-accent/40' : 'border-[#D0D7DE]'}
        `}
      >
        <Search className={`w-4 h-4 mr-2 ${isFocused ? 'text-accent' : 'text-[#57606A]'}`} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent border-none outline-none text-sm text-[#24292F] placeholder-[#8C959F]"
        />
        {value && (
          <button 
            onClick={() => onChange("")}
            className="ml-2 text-[#8C959F] hover:text-[#24292F] focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
