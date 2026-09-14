import React from 'react';
import { Search, Menu, Shield, FileSpreadsheet, Lock } from 'lucide-react';
import { AccountSwitcher } from './AccountSwitcher';
import { UserRole, getUserAccount } from '../utils/userAccounts';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit?: () => void;
  onToggleMobileMenu?: () => void;
  onNavigateToImport?: () => void;
  currentRole?: UserRole;
  onSelectRole?: (role: UserRole) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onToggleMobileMenu,
  onNavigateToImport,
  currentRole = 'admin',
  onSelectRole = () => {},
  onLogout,
}) => {
  const currentAccount = getUserAccount(currentRole);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearchSubmit) {
      onSearchSubmit();
    }
  };

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-[60px] bg-white border-b border-[#e2e8f0] z-30 px-3 sm:px-6 flex items-center justify-between gap-3 transition-all">
      {/* Left: Mobile Menu Toggle Button */}
      <div className="flex items-center gap-2.5">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-label="Ouvrir le menu de navigation"
            className="lg:hidden p-2 rounded-xl text-[#0b1c30] hover:bg-[#f1f5f9] border border-[#e2e8f0] transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Center: Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <div className="relative w-full flex items-center">
          <Search className="absolute left-3 text-[#94a3b8] w-4 h-4 pointer-events-none" />
          <input
            id="global-quick-search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-9 pr-14 sm:pr-16 py-1.5 bg-[#f8fafc] hover:bg-white rounded-lg text-[12px] text-[#0b1c30] placeholder:text-[#94a3b8] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#0b1c30] border border-[#e2e8f0] transition-colors"
            placeholder="Rechercher flux, compte, filiale..."
            type="text"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 text-[10px] sm:text-[11px] text-gray-500 hover:text-gray-700 bg-gray-200/70 hover:bg-gray-200 rounded px-1.5 py-0.5 cursor-pointer font-medium"
            >
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* Right: Operational Status Indicator & Quick Import & User Account Switcher */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Bouton d'import réservé exclusivement au binôme administrateur */}
        {currentAccount.canImport && onNavigateToImport && (
          <button
            type="button"
            onClick={onNavigateToImport}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Importer des données Excel ou formulaires (Réservé Binôme Administrateur)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden xl:inline">Import Excel & Données</span>
          </button>
        )}

        {/* Badge d'accès lecture seule pour les directions */}
        {!currentAccount.canEdit && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-[10px] font-bold">
            <Lock className="w-3 h-3 text-amber-600" />
            <span>Consultation Seule</span>
          </div>
        )}

        <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          <span>Surveillance Active</span>
        </div>

        {/* Sélecteur de compte / profil utilisateur */}
        <AccountSwitcher
          currentRole={currentRole}
          onSelectRole={onSelectRole}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
};

