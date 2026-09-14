import React from 'react';
import { Logo } from './Logo';
import {
  LayoutGrid,
  ShieldAlert,
  Smartphone,
  Share2,
  Globe,
  TrendingUp,
  FileSpreadsheet,
  X,
  Lock,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { UserRole, getUserAccount } from '../utils/userAccounts';

export type NavPage =
  | 'overview'
  | 'threats'
  | 'threat-detail'
  | 'territory-detail'
  | 'applications'
  | 'accounts'
  | 'sites-forums'
  | 'market'
  | 'data-import'
  | 'expert';

export type ExpertTabType = 'sources' | 'donnees' | 'regles' | 'logs';

interface SidebarProps {
  currentPage: NavPage;
  currentExpertTab?: ExpertTabType;
  onNavigate: (page: NavPage, threatId?: string, expertTab?: ExpertTabType) => void;
  threatsCount: number;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
  currentRole?: UserRole;
}

interface NavItem {
  id: NavPage;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpenOnMobile = false,
  onCloseMobile,
  currentRole = 'admin',
}) => {
  const currentAccount = getUserAccount(currentRole);
  const allSurveillanceItems: NavItem[] = [
    {
      id: 'overview',
      label: "Vue d'ensemble",
      icon: LayoutGrid,
    },
    {
      id: 'threats',
      label: 'Menaces',
      icon: ShieldAlert,
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: Smartphone,
    },
    {
      id: 'accounts',
      label: 'Comptes & Réseaux',
      icon: Share2,
    },
    {
      id: 'sites-forums',
      label: 'Sites & Forums',
      icon: Globe,
    },
    {
      id: 'market',
      label: 'Intelligence Marché & Filiales',
      icon: TrendingUp,
    },
    {
      id: 'data-import',
      label: 'Import de Données',
      icon: FileSpreadsheet,
      badge: 'Excel / Forms',
    },
  ];

  // Filtrage strict : seules les pages assignées au rôle sont affichées dans le menu
  const surveillanceItems = allSurveillanceItems.filter((item) =>
    currentAccount.allowedPages.includes(item.id)
  );

  const handleItemClick = (id: NavPage) => {
    onNavigate(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <>
      {/* Top Header & Navigation */}
      <div className="flex flex-col">
        {/* Logo area */}
        <div className="h-[60px] px-5 flex items-center justify-between border-b border-[#f1f5f9]">
          <Logo />
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-[#64748b] hover:text-[#0b1c30] hover:bg-[#f1f5f9] cursor-pointer"
              title="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Section Surveillance */}
        <div className="px-5 pt-5 pb-2">
          <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
            Surveillance & BI PANAF
          </span>
        </div>

        <nav className="flex flex-col gap-0.5 px-3">
          {surveillanceItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#0b1c30] text-white font-medium shadow-xs'
                    : 'text-[#334155] hover:bg-[#f8fafc] hover:text-[#0b1c30]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-[#64748b]'
                    }`}
                  />
                  <span className="text-[13px] truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badge === 'Live'
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Institutional Context Footer & Current Account */}
      <div className="p-3.5 border-t border-[#f1f5f9] bg-[#f8fafc] m-3 rounded-xl border">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[11px] font-bold text-[#0b1c30]">Anti Piracy Factory</span>
          </div>
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
              currentAccount.canEdit
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            {currentAccount.canEdit ? 'Édition' : 'Lecture Seule'}
          </span>
        </div>
        <p className="text-[10px] font-semibold text-[#0b1c30] truncate">
          {currentAccount.title}
        </p>
        <p className="text-[9px] text-[#64748b] leading-tight truncate mt-0.5 font-mono">
          {currentAccount.email}
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-[#e2e8f0] z-40 hidden lg:flex flex-col justify-between select-none">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpenOnMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 lg:hidden transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 max-w-[85vw] bg-white border-r border-[#e2e8f0] z-50 flex lg:hidden flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out select-none ${
          isOpenOnMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

