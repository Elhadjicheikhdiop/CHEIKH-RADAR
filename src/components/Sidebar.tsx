import React from 'react';
import { Logo } from './Logo';
import {
  LayoutGrid,
  ShieldAlert,
  Smartphone,
  Share2,
  Globe,
  TrendingUp,
  Clapperboard,
} from 'lucide-react';

export type NavPage =
  | 'overview'
  | 'threats'
  | 'threat-detail'
  | 'territory-detail'
  | 'applications'
  | 'accounts'
  | 'sites-forums'
  | 'market'
  | 'series'
  | 'expert';

export type ExpertTabType = 'sources' | 'donnees' | 'regles' | 'logs';

interface SidebarProps {
  currentPage: NavPage;
  currentExpertTab?: ExpertTabType;
  onNavigate: (page: NavPage, threatId?: string, expertTab?: ExpertTabType) => void;
  threatsCount: number;
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
}) => {
  const surveillanceItems: NavItem[] = [
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
      id: 'series',
      label: 'Séries & VOD',
      icon: Clapperboard,
      badge: 'VOD',
    },
    {
      id: 'market',
      label: 'Analyse Marché & BI',
      icon: TrendingUp,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-[#e2e8f0] z-50 flex flex-col justify-between select-none">
      {/* Top Header & Navigation */}
      <div className="flex flex-col">
        {/* Logo area */}
        <div className="h-[60px] px-5 flex items-center border-b border-[#f1f5f9]">
          <Logo />
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
                onClick={() => onNavigate(item.id)}
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

      {/* Institutional Context Footer */}
      <div className="p-4 border-t border-[#f1f5f9] bg-[#f8fafc] m-3 rounded-xl border">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[11px] font-bold text-[#0b1c30]">Anti Piracy Factory</span>
        </div>
        <p className="text-[10px] text-[#64748b] leading-tight">
          Cellule Analyse de Données & Marché • CHEIKH + International Dakar
        </p>
      </div>
    </aside>
  );
};

