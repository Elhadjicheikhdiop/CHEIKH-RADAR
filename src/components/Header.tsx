import React from 'react';
import { Search } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange, onSearchSubmit }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearchSubmit) {
      onSearchSubmit();
    }
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-[60px] bg-white border-b border-[#e2e8f0] z-40 px-6 flex items-center justify-between transition-all">
      {/* Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <div className="relative w-full flex items-center">
          <Search className="absolute left-3 text-[#94a3b8] w-4 h-4 pointer-events-none" />
          <input
            id="global-quick-search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-9 pr-4 py-1.5 bg-[#f8fafc] hover:bg-white rounded-lg text-[12px] text-[#0b1c30] placeholder:text-[#94a3b8] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#0b1c30] border border-[#e2e8f0] transition-colors"
            placeholder="Rechercher un compte, un lien, un match, un pays..."
            type="text"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 text-[11px] text-gray-400 hover:text-gray-600 bg-gray-100 rounded px-1.5 py-0.5"
            >
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] font-semibold text-[#0b1c30]">
            Veille Marché PANAF active
          </span>
          <span className="text-[10px] text-[#64748b] font-mono border-l border-[#cbd5e1] pl-2">
            CHEIKH + International Dakar
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#eff6ff] border border-[#bfdbfe] rounded-lg">
          <span className="text-[11px] font-bold text-[#1d4ed8]">
            Hub BI & Takedowns
          </span>
        </div>
      </div>
    </header>
  );
};
