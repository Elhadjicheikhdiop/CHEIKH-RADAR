import React, { useState, useMemo } from 'react';
import { Threat, SiteForumItem } from '../types';
import {
  Shield,
  TrendingUp,
  TrendingDown,
  MapPin,
  Fingerprint,
  Calendar,
  ChevronDown,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Clock,
  Coins,
  Zap,
  CheckCheck,
  ShieldCheck,
  Filter,
  Layers,
  Activity,
  RotateCcw,
} from 'lucide-react';
import { ModernDateRangeButton } from '../components/ModernDateRangeButton';
import { SemrushOverviewMetrics } from '../components/SemrushOverviewMetrics';

interface OverviewPageProps {
  threats: Threat[];
  sitesForums?: SiteForumItem[];
  onSelectThreat: (threatId: string) => void;
  onNavigateToThreats: () => void;
  onNavigateToMarket?: () => void;
  onNavigateToImport?: () => void;
  onShowToast?: (message: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  threats,
  sitesForums = [],
  onSelectThreat,
  onNavigateToThreats,
  onNavigateToMarket,
  onNavigateToImport,
  onShowToast,
}) => {
  // Filtres globaux de la page
  const [globalCountry, setGlobalCountry] = useState<string>('all');
  const [globalPeriod, setGlobalPeriod] = useState<'today' | 'this_week' | 'this_month' | 'this_year' | 'last_year' | 'custom'>('today');
  const [customStartDate, setCustomStartDate] = useState<string>('2025-02-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2025-02-16');
  const [globalChannel, setGlobalChannel] = useState<string>('all');

  // Filtre dédié au bloc "Activité récente des menaces"
  const [threatsTableFilter, setThreatsTableFilter] = useState<'all' | 'critical' | 'social' | 'web' | 'iptv'>('all');
  const [threatsTableCountry, setThreatsTableCountry] = useState<string>('all');

  // Filtre dédié au bloc "Résolution & Économique"
  const [ecoScope, setEcoScope] = useState<'all' | 'SN' | 'CI' | 'CM' | 'GA_CD'>('all');

  // Libellé de la période sélectionnée
  const periodLabel = useMemo(() => {
    switch (globalPeriod) {
      case 'today':
        return "Aujourd'hui";
      case 'this_week':
        return 'Cette semaine';
      case 'this_month':
        return 'Ce mois';
      case 'this_year':
        return 'Cette année';
      case 'last_year':
        return "L'année dernière";
      case 'custom': {
        if (customStartDate && customEndDate) {
          const s = customStartDate.split('-');
          const e = customEndDate.split('-');
          const sStr = s.length === 3 ? `${s[2]}/${s[1]}` : customStartDate;
          const eStr = e.length === 3 ? `${e[2]}/${e[1]}/${e[0]}` : customEndDate;
          return `Du ${sStr} au ${eStr}`;
        }
        return 'Fourchette personnalisée';
      }
      default:
        return "Aujourd'hui";
    }
  }, [globalPeriod, customStartDate, customEndDate]);

  // Multiplicateurs selon la période globale choisie
  const periodFactor = useMemo(() => {
    switch (globalPeriod) {
      case 'today':
        return 1;
      case 'this_week':
        return 4.8;
      case 'this_month':
        return 16.5;
      case 'this_year':
        return 118.0;
      case 'last_year':
        return 104.0;
      case 'custom': {
        if (customStartDate && customEndDate) {
          const s = new Date(customStartDate).getTime();
          const e = new Date(customEndDate).getTime();
          const diffDays = Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1);
          if (diffDays <= 1) return 1;
          if (diffDays <= 7) return 1 + (diffDays - 1) * (3.8 / 6);
          if (diffDays <= 30) return 4.8 + (diffDays - 7) * (11.7 / 23);
          return Math.min(150, 16.5 + (diffDays - 30) * 0.3);
        }
        return 1;
      }
      default:
        return 1;
    }
  }, [globalPeriod, customStartDate, customEndDate]);

  // Données de base consolidées par pays
  const territoryStats = useMemo(() => {
    const base = {
      all: { detected: 142, new24h: 18, countriesCount: 6, actors: 29, lossFcfa: 2.17, recoveryFcfa: 392.5, closedCount: 118, label: 'Toutes les filiales' },
      SN: { detected: 41, new24h: 6, countriesCount: 1, actors: 9, lossFcfa: 0.68, recoveryFcfa: 118.5, closedCount: 36, label: 'Sénégal (SN)' },
      CI: { detected: 36, new24h: 5, countriesCount: 1, actors: 8, lossFcfa: 0.59, recoveryFcfa: 169.4, closedCount: 31, label: "Côte d'Ivoire (CI)" },
      CM: { detected: 28, new24h: 4, countriesCount: 1, actors: 6, lossFcfa: 0.44, recoveryFcfa: 49.4, closedCount: 24, label: 'Cameroun (CM)' },
      ML: { detected: 16, new24h: 2, countriesCount: 1, actors: 3, lossFcfa: 0.22, recoveryFcfa: 24.8, closedCount: 13, label: 'Mali (ML)' },
      GA_CD: { detected: 21, new24h: 3, countriesCount: 2, actors: 5, lossFcfa: 0.24, recoveryFcfa: 30.4, closedCount: 14, label: 'Gabon & RDC' },
    };
    return base[globalCountry as keyof typeof base] || base.all;
  }, [globalCountry]);

  // Canaux calculés avec ajustement selon le pays sélectionné
  const channelsVolume = useMemo(() => {
    const factor = globalCountry === 'all' ? 1 : globalCountry === 'SN' ? 0.32 : globalCountry === 'CI' ? 0.28 : 0.2;
    return {
      tiktok: Math.max(2, Math.round(46 * factor * (globalChannel === 'all' || globalChannel === 'social' ? 1 : 0.15))),
      meta: Math.max(2, Math.round(31 * factor * (globalChannel === 'all' || globalChannel === 'social' ? 1 : 0.15))),
      x: Math.max(1, Math.round(28 * factor * (globalChannel === 'all' || globalChannel === 'social' ? 1 : 0.15))),
      youtube: Math.max(1, Math.round(14 * factor * (globalChannel === 'all' || globalChannel === 'social' ? 1 : 0.15))),
      web: Math.max(1, Math.round(12 * factor * (globalChannel === 'all' || globalChannel === 'web' ? 1 : 0.15))),
      forums: Math.max(1, Math.round(7 * factor * (globalChannel === 'all' || globalChannel === 'forums' ? 1 : 0.15))),
      iptv: Math.max(1, Math.round(4 * factor * (globalChannel === 'all' || globalChannel === 'iptv' ? 1 : 0.15))),
    };
  }, [globalCountry, globalChannel]);

  // Hourly data ajustée
  const hourlyData = useMemo(() => {
    const ratio = globalCountry === 'all' ? 1 : 0.35;
    return [
      { hour: '00h', height: Math.max(8, Math.round(18 * ratio)), count: Math.max(2, Math.round(8 * ratio)), isPeak: false },
      { hour: '02h', height: Math.max(6, Math.round(12 * ratio)), count: Math.max(1, Math.round(5 * ratio)), isPeak: false },
      { hour: '04h', height: Math.max(5, Math.round(8 * ratio)), count: Math.max(1, Math.round(3 * ratio)), isPeak: false },
      { hour: '06h', height: Math.max(6, Math.round(10 * ratio)), count: Math.max(1, Math.round(4 * ratio)), isPeak: false },
      { hour: '08h', height: Math.max(8, Math.round(15 * ratio)), count: Math.max(2, Math.round(7 * ratio)), isPeak: false },
      { hour: '10h', height: Math.max(12, Math.round(22 * ratio)), count: Math.max(3, Math.round(11 * ratio)), isPeak: false },
      { hour: '12h', height: Math.max(18, Math.round(35 * ratio)), count: Math.max(5, Math.round(16 * ratio)), isPeak: false },
      { hour: '14h', height: Math.max(15, Math.round(28 * ratio)), count: Math.max(4, Math.round(13 * ratio)), isPeak: false },
      { hour: '16h', height: Math.max(25, Math.round(48 * ratio)), count: Math.max(7, Math.round(22 * ratio)), isPeak: false },
      { hour: '18h', height: Math.max(38, Math.round(64 * ratio)), count: Math.max(10, Math.round(29 * ratio)), isPeak: false },
      { hour: '20h', height: Math.max(50, Math.round(92 * ratio)), count: Math.max(14, Math.round(38 * ratio)), isPeak: true },
      { hour: '22h', height: Math.max(45, Math.round(84 * ratio)), count: Math.max(12, Math.round(32 * ratio)), isPeak: true },
    ];
  }, [globalCountry]);

  // Liste enrichie des signalements pour le tableau avec filtrage dédié
  const allOverviewThreats = useMemo(() => {
    return [
      {
        id: threats[0]?.id || 'INC-202502-8841-TK',
        name: '@exampletv',
        target: 'Direct Ligue 1 / Match clé',
        channel: 'TikTok',
        category: 'social',
        country: 'Sénégal',
        countryCode: 'SN',
        timeAgo: 'Il y a 2 h',
        date: '2025-02-16',
        isCritical: true,
      },
      {
        id: threats[1]?.id || 'INC-202502-8840-WB',
        name: 'example-site.com',
        target: 'Rediffusion en direct sur site web',
        channel: 'Web',
        category: 'web',
        country: "Côte d'Ivoire",
        countryCode: 'CI',
        timeAgo: 'Il y a 5 h',
        date: '2025-02-16',
        isCritical: true,
      },
      {
        id: threats[2]?.id || 'INC-202502-8839-AP',
        name: 'Example IPTV',
        target: 'Chaînes TV piratées dans l\'application',
        channel: 'Application',
        category: 'iptv',
        country: 'Sénégal',
        countryCode: 'SN',
        timeAgo: 'Hier',
        date: '2025-02-15',
        isCritical: true,
      },
      {
        id: threats[3]?.id || 'INC-202502-8838-TG',
        name: 't.me/stream_panaf',
        target: 'Groupe Telegram partageant des liens pirates',
        channel: 'Web / Réseaux',
        category: 'social',
        country: 'Cameroun',
        countryCode: 'CM',
        timeAgo: 'Hier',
        date: '2025-02-15',
        isCritical: false,
      },
      {
        id: threats[4]?.id || 'INC-202502-8837-FR',
        name: 'forum-sat-africa',
        target: 'Codes d\'accès et piratage de décodeurs',
        channel: 'Forum',
        category: 'forums',
        country: 'Non spécifié',
        countryCode: 'XX',
        timeAgo: 'Il y a 2 jours',
        date: '2025-02-14',
        isCritical: false,
      },
      {
        id: 'INC-202502-8836-YT',
        name: 'StreamFoot Live Dakar',
        target: 'Match direct CAN / CAF',
        channel: 'YouTube',
        category: 'social',
        country: 'Sénégal',
        countryCode: 'SN',
        timeAgo: 'Il y a 3 h',
        date: '2025-02-16',
        isCritical: true,
      },
      {
        id: 'INC-202502-8835-WA',
        name: 'Abonnement IPTV Abidjan',
        target: 'Vente panels IPTV illégaux via WhatsApp',
        channel: 'Application',
        category: 'iptv',
        country: "Côte d'Ivoire",
        countryCode: 'CI',
        timeAgo: 'Il y a 6 h',
        date: '2025-02-16',
        isCritical: false,
      },
      {
        id: 'INC-202502-8834-WB',
        name: 'foot24-afrique.net',
        target: 'Flux direct sans autorisation',
        channel: 'Web',
        category: 'web',
        country: 'Cameroun',
        countryCode: 'CM',
        timeAgo: 'Hier',
        date: '2025-02-15',
        isCritical: true,
      },
    ];
  }, [threats]);

  // Application des filtres sur le tableau des signalements
  const filteredThreatsList = useMemo(() => {
    return allOverviewThreats.filter((item) => {
      // Filtre global pays (si défini au niveau page)
      if (globalCountry !== 'all' && item.countryCode !== globalCountry && item.countryCode !== 'XX') {
        return false;
      }
      // Filtre spécifique de la table (pays)
      if (threatsTableCountry !== 'all' && item.countryCode !== threatsTableCountry) {
        return false;
      }
      // Filtre spécifique de la table (nature/vecteur)
      if (threatsTableFilter === 'critical' && !item.isCritical) {
        return false;
      }
      if (threatsTableFilter === 'social' && item.category !== 'social') {
        return false;
      }
      if (threatsTableFilter === 'web' && item.category !== 'web') {
        return false;
      }
      if (threatsTableFilter === 'iptv' && item.category !== 'iptv') {
        return false;
      }
      // Filtre global vecteur/plateforme
      if (globalChannel !== 'all' && item.category !== globalChannel) {
        return false;
      }
      // Filtre temporel (globalPeriod)
      if (globalPeriod === 'today') {
        if (item.date !== '2025-02-16') return false;
      } else if (globalPeriod === 'this_week') {
        if (item.date < '2025-02-10' || item.date > '2025-02-16') return false;
      } else if (globalPeriod === 'this_month') {
        if (!item.date.startsWith('2025-02')) return false;
      } else if (globalPeriod === 'this_year') {
        if (!item.date.startsWith('2025')) return false;
      } else if (globalPeriod === 'last_year') {
        if (!item.date.startsWith('2024')) return false;
      } else if (globalPeriod === 'custom') {
        if (customStartDate && item.date < customStartDate) return false;
        if (customEndDate && item.date > customEndDate) return false;
      }
      return true;
    });
  }, [allOverviewThreats, globalCountry, threatsTableCountry, threatsTableFilter, globalChannel, globalPeriod, customStartDate, customEndDate]);

  // Données économiques ajustées selon le scope choisi dans le bloc 4
  const ecoData = useMemo(() => {
    const activeScope = ecoScope !== 'all' ? ecoScope : (globalCountry !== 'all' ? globalCountry : 'all');
    switch (activeScope) {
      case 'SN':
        return {
          closed: 36,
          successRate: '87.8%',
          delayLive: '18 min',
          delayMedian: '55 min',
          lossFcfa: '680 Millions',
          lossFcfaRaw: 680000000,
          lossDay: '~22,6M FCFA',
          recoveredFcfa: '+118,5 M',
          recoveredFcfaRaw: 118500000,
          recoveredLtv: '533,2 M FCFA',
          conversionRate: '17.4%',
          reactivatedSubs: '+11 850',
          scopeLabel: 'Sénégal (SN)',
        };
      case 'CI':
        return {
          closed: 31,
          successRate: '86.1%',
          delayLive: '22 min',
          delayMedian: '1h 05 min',
          lossFcfa: '590 Millions',
          lossFcfaRaw: 590000000,
          lossDay: '~19,6M FCFA',
          recoveredFcfa: '+169,4 M',
          recoveredFcfaRaw: 169400000,
          recoveredLtv: '762,3 M FCFA',
          conversionRate: '28.7%',
          reactivatedSubs: '+15 400',
          scopeLabel: "Côte d'Ivoire (CI)",
        };
      case 'CM':
        return {
          closed: 24,
          successRate: '82.0%',
          delayLive: '28 min',
          delayMedian: '1h 30 min',
          lossFcfa: '440 Millions',
          lossFcfaRaw: 440000000,
          lossDay: '~14,6M FCFA',
          recoveredFcfa: '+49,4 M',
          recoveredFcfaRaw: 49400000,
          recoveredLtv: '222,3 M FCFA',
          conversionRate: '11.2%',
          reactivatedSubs: '+5 200',
          scopeLabel: 'Cameroun (CM)',
        };
      case 'GA_CD':
        return {
          closed: 27,
          successRate: '79.5%',
          delayLive: '26 min',
          delayMedian: '1h 45 min',
          lossFcfa: '460 Millions',
          lossFcfaRaw: 460000000,
          lossDay: '~15,3M FCFA',
          recoveredFcfa: '+55,2 M',
          recoveredFcfaRaw: 55200000,
          recoveredLtv: '248,4 M FCFA',
          conversionRate: '12.0%',
          reactivatedSubs: '+4 800',
          scopeLabel: 'Gabon & RDC (GA/CD)',
        };
      case 'all':
      default:
        return {
          closed: 118,
          successRate: '83.1%',
          delayLive: '24 min',
          delayMedian: '1h 15 min',
          lossFcfa: '2,17 Mds',
          lossFcfaRaw: 2170000000,
          lossDay: '~72,3M FCFA',
          recoveredFcfa: '+392,5 M',
          recoveredFcfaRaw: 392500000,
          recoveredLtv: '1,76 Md FCFA',
          conversionRate: '18.1%',
          reactivatedSubs: '+37 250',
          scopeLabel: 'Consolidé Panafrique (SN, CI, CM, GA, CD)',
        };
    }
  }, [ecoScope, globalCountry]);

  // Réinitialisation de tous les filtres
  const handleResetFilters = () => {
    setGlobalCountry('all');
    setGlobalPeriod('today');
    setCustomStartDate('2025-02-01');
    setCustomEndDate('2025-02-16');
    setGlobalChannel('all');
    setThreatsTableFilter('all');
    setThreatsTableCountry('all');
    setEcoScope('all');
  };

  const hasActiveFilters =
    globalCountry !== 'all' ||
    globalPeriod !== 'today' ||
    globalChannel !== 'all' ||
    threatsTableFilter !== 'all' ||
    threatsTableCountry !== 'all' ||
    ecoScope !== 'all';

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Top Banner / Title Header avec barre d'état & filtres globaux */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-bold tracking-tight text-[#0b1c30]">
              Vue d'ensemble
            </h1>
          </div>
          <p className="text-[13px] text-[#64748b]">
            Surveillance des diffusions non autorisées et pilotage opérationnel
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#e2e8f0] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#dc2626] animate-pulse"></span>
            <span className="text-[12px] font-medium text-[#0b1c30]">Veille active</span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0b1c30] text-[12px] font-medium transition-colors cursor-pointer border border-[#cbd5e1]"
              title="Réinitialiser tous les filtres de la page"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#64748b]" />
              <span>Réinitialiser</span>
            </button>
          )}
        </div>
      </div>

      {/* BARRE DE FILTRES GLOBAUX POUR TOUTE LA PAGE */}
      <div className="bg-white p-3.5 rounded-xl border border-[#e2e8f0] shadow-2xs mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[#0b1c30]">
          <Filter className="w-4 h-4 text-[#0b1c30]" />
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#0b1c30]">
            Filtres globaux de la page :
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Filtre 1 : Filiale / Pays */}
          <div className="flex items-center gap-1.5 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-2.5 py-1.5 shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-[#64748b]" />
            <select
              value={globalCountry}
              onChange={(e) => setGlobalCountry(e.target.value)}
              className="text-[12px] font-medium text-[#0b1c30] bg-transparent outline-hidden cursor-pointer"
            >
              <option value="all">Toutes les filiales</option>
              <option value="SN">Sénégal (SN)</option>
              <option value="CI">Côte d'Ivoire (CI)</option>
              <option value="CM">Cameroun (CM)</option>
              <option value="ML">Mali (ML)</option>
              <option value="GA_CD">Gabon & RDC (GA/CD)</option>
            </select>
          </div>

          {/* Filtre 2 : Période temporelle */}
          <div className="flex items-center gap-1.5 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-2.5 py-1.5 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-[#64748b]" />
            <select
              value={globalPeriod === 'custom' ? 'custom' : globalPeriod}
              onChange={(e) => {
                const val = e.target.value;
                if (val !== 'custom') {
                  setGlobalPeriod(val as any);
                }
              }}
              className="text-[12px] font-medium text-[#0b1c30] bg-transparent outline-hidden cursor-pointer"
            >
              <option value="today">Aujourd'hui</option>
              <option value="this_week">Cette semaine</option>
              <option value="this_month">Ce mois</option>
              <option value="this_year">Cette année</option>
              <option value="last_year">L'année dernière</option>
              {globalPeriod === 'custom' && (
                <option value="custom">Fourchette personnalisée</option>
              )}
            </select>
          </div>

          {/* Bouton moderne pour fourchette de dates à côté */}
          <ModernDateRangeButton
            startDate={customStartDate}
            endDate={customEndDate}
            isActive={globalPeriod === 'custom'}
            onChange={(start, end) => {
              setCustomStartDate(start);
              setCustomEndDate(end);
              setGlobalPeriod('custom');
            }}
            onClear={() => setGlobalPeriod('this_week')}
          />

          {/* Filtre 3 : Rubrique / Plateforme */}
          <div className="flex items-center gap-1.5 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-2.5 py-1.5 shadow-2xs">
            <Layers className="w-3.5 h-3.5 text-[#64748b]" />
            <select
              value={globalChannel}
              onChange={(e) => setGlobalChannel(e.target.value)}
              className="text-[12px] font-medium text-[#0b1c30] bg-transparent outline-hidden cursor-pointer"
            >
              <option value="all">Tous les vecteurs surveillés</option>
              <option value="social">Réseaux sociaux (TikTok, Meta, X)</option>
              <option value="web">Sites web & streaming</option>
              <option value="iptv">Applications & Panels IPTV</option>
              <option value="forums">Forums & Clés satellite</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards réactives aux filtres globaux */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* KPI 1 : Menaces Détectées */}
        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs flex flex-col justify-between hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-[#64748b] mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Diffusions détectées</span>
            <Shield className="w-4 h-4 text-[#64748b]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-[#0b1c30] tracking-tight leading-none font-mono">
              {Math.round(territoryStats.detected * periodFactor)}
            </span>
            <span className="text-[12px] text-[#64748b]">
              {periodLabel}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
            <span className="text-[12px] text-[#64748b]">Périmètre</span>
            <span className="text-[12px] text-[#0b1c30] font-bold truncate max-w-[160px]">
              {territoryStats.label}
            </span>
          </div>
        </div>

        {/* KPI 2 : Nouvelles Menaces */}
        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs flex flex-col justify-between hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-[#64748b] mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Nouvelles menaces</span>
            <TrendingUp className="w-4 h-4 text-[#dc2626]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-[#dc2626] tracking-tight leading-none font-mono">
              +{Math.max(1, Math.round(territoryStats.new24h * (globalPeriod === 'today' ? 1 : periodFactor * 0.28)))}
            </span>
            <span className="text-[12px] text-[#64748b]">
              {periodLabel}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
            <span className="text-[12px] text-[#64748b]">Pic d'activité</span>
            <span className="text-[12px] text-[#0b1c30] font-medium">21h00 - 23h00 GMT</span>
          </div>
        </div>

        {/* KPI 3 : Pays Concernés */}
        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs flex flex-col justify-between hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-[#64748b] mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pays concernés</span>
            <MapPin className="w-4 h-4 text-[#64748b]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-[#0b1c30] tracking-tight leading-none font-mono">
              {territoryStats.countriesCount}
            </span>
            <span className="text-[12px] text-[#64748b]">
              {territoryStats.countriesCount > 1 ? 'Filiales couvertes' : 'Filiale ciblée'}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
            <span className="text-[12px] text-[#0b1c30] font-medium truncate">
              {globalCountry === 'all' ? 'Sénégal, Côte d\'Ivoire, Cameroun...' : territoryStats.label}
            </span>
          </div>
        </div>

        {/* KPI 4 : Acteurs Identifiés */}
        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs flex flex-col justify-between hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-[#64748b] mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Acteurs identifiés</span>
            <Fingerprint className="w-4 h-4 text-[#64748b]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-[#0b1c30] tracking-tight leading-none font-mono">
              {territoryStats.actors}
            </span>
            <span className="text-[12px] text-[#64748b]">Entités récurrentes</span>
          </div>
          <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
            <span className="text-[12px] text-[#64748b]">Récurrence constatée</span>
            <span className="text-[12px] text-[#0b1c30] font-bold">82% récidive</span>
          </div>
        </div>
      </div>

      {/* Charts Section : Evolution des captures + Répartition géographique */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Graphique Évolution des captures */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-[#f1f5f9]">
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-[#0b1c30]">Évolution des captures</span>
              <span className="text-[12px] text-[#64748b]">Volume horaire des détections constatées (UTC)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#dc2626]"></span>
                <span className="text-[11px] text-[#334155] font-medium">Pic de diffusion</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#dbeafe]"></span>
                <span className="text-[11px] text-[#64748b]">Activité de fond</span>
              </div>
            </div>
          </div>

          <div className="w-full pt-6">
            <div className="h-44 w-full flex items-end justify-between gap-1.5 sm:gap-2 px-1">
              {hourlyData.map((item) => (
                <div
                  key={item.hour}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                >
                  <div className="w-full h-36 flex items-end justify-center relative">
                    <div
                      className={`w-full max-w-[38px] rounded-t-sm transition-all duration-300 ${
                        item.isPeak
                          ? 'bg-[#dc2626] group-hover:bg-[#b91c1c]'
                          : 'bg-[#dbeafe] group-hover:bg-[#bfdbfe]'
                      }`}
                      style={{
                        height: `${Math.max(10, Math.round((item.height / 100) * 144))}px`,
                      }}
                    ></div>
                    {/* Hover tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0b1c30] text-white text-[11px] px-2 py-0.5 rounded shadow-md pointer-events-none whitespace-nowrap z-20">
                      {item.count} flux
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-mono ${
                      item.isPeak ? 'text-[#dc2626] font-bold' : 'text-[#64748b]'
                    }`}
                  >
                    {item.hour}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-[#64748b] text-[12px]">
            <span className="font-mono">Distribution moyenne : ~5.9 signaux / heure</span>
            <span className="font-mono text-[#0b1c30] font-medium">Heure de référence : GMT+0</span>
          </div>
        </div>

        {/* Répartition géographique */}
        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
            <span className="text-[15px] font-bold text-[#0b1c30]">Répartition géographique</span>
            <span className="text-[10px] font-mono font-bold text-[#64748b] uppercase tracking-wider">
              RÉGIONS
            </span>
          </div>

          <div className="flex flex-col gap-4 my-auto py-2">
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[12px]">
                <span className="text-[#0b1c30] font-medium">Sénégal (SN)</span>
                <span className="font-mono text-[#0b1c30] font-semibold">41 flux (29%)</span>
              </div>
              <div className="w-full h-2 bg-[#eff5ff] rounded-full overflow-hidden">
                <div className="h-full bg-[#0b1c30] rounded-full" style={{ width: '29%' }}></div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[12px]">
                <span className="text-[#0b1c30] font-medium">Côte d'Ivoire (CI)</span>
                <span className="font-mono text-[#0b1c30] font-semibold">36 flux (25%)</span>
              </div>
              <div className="w-full h-2 bg-[#eff5ff] rounded-full overflow-hidden">
                <div className="h-full bg-[#0b1c30] rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[12px]">
                <span className="text-[#0b1c30] font-medium">Cameroun (CM)</span>
                <span className="font-mono text-[#0b1c30] font-semibold">28 flux (20%)</span>
              </div>
              <div className="w-full h-2 bg-[#eff5ff] rounded-full overflow-hidden">
                <div className="h-full bg-[#0b1c30] rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[12px]">
                <span className="text-[#0b1c30] font-medium">Mali, Gabon & RDC</span>
                <span className="font-mono text-[#0b1c30] font-semibold">37 flux (26%)</span>
              </div>
              <div className="w-full h-2 bg-[#eff5ff] rounded-full overflow-hidden">
                <div className="h-full bg-[#0b1c30] rounded-full" style={{ width: '26%' }}></div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-[#64748b] text-[12px]">
            <span>Nœud d'impact primaire</span>
            <span className="font-mono font-bold text-[#0b1c30]">AF-WEST (54%)</span>
          </div>
        </div>
      </div>

      {/* Canaux de diffusion surveillés */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-[#0b1c30]">Canaux de diffusion surveillés</span>
            <span className="text-[12px] text-[#64748b] font-mono">
              ({channelsVolume.tiktok + channelsVolume.meta + channelsVolume.x + channelsVolume.youtube + channelsVolume.web + channelsVolume.forums + channelsVolume.iptv} flux analysés)
            </span>
          </div>
          {globalChannel !== 'all' && (
            <button
              onClick={() => setGlobalChannel('all')}
              className="text-[11px] text-[#0b1c30] hover:text-[#dc2626] font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Réinitialiser filtre vecteur ({globalChannel})</span>
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          <div
            onClick={() => setGlobalChannel(globalChannel === 'social' ? 'all' : 'social')}
            className={`p-3.5 rounded-xl border shadow-2xs flex flex-col justify-between transition-colors cursor-pointer ${
              globalChannel === 'social' ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-400' : 'bg-white border-[#e2e8f0] hover:bg-[#f8fafc]'
            }`}
            title="Cliquer pour filtrer les réseaux sociaux"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold text-[#0b1c30]">TikTok</span>
              <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-[#0b1c30]">{channelsVolume.tiktok}</span>
              <span className="text-[11px] font-mono text-[#dc2626] font-semibold">Élevé</span>
            </div>
          </div>

          <div
            onClick={() => setGlobalChannel(globalChannel === 'social' ? 'all' : 'social')}
            className={`p-3.5 rounded-xl border shadow-2xs flex flex-col justify-between transition-colors cursor-pointer ${
              globalChannel === 'social' ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-400' : 'bg-white border-[#e2e8f0] hover:bg-[#f8fafc]'
            }`}
            title="Cliquer pour filtrer les réseaux sociaux"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold text-[#0b1c30]">Meta (FB/IG)</span>
              <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-[#0b1c30]">{channelsVolume.meta}</span>
              <span className="text-[11px] font-mono text-[#dc2626] font-semibold">Élevé</span>
            </div>
          </div>

          <div
            onClick={() => setGlobalChannel(globalChannel === 'social' ? 'all' : 'social')}
            className={`p-3.5 rounded-xl border shadow-2xs flex flex-col justify-between transition-colors cursor-pointer ${
              globalChannel === 'social' ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-400' : 'bg-white border-[#e2e8f0] hover:bg-[#f8fafc]'
            }`}
            title="Cliquer pour filtrer les réseaux sociaux"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold text-[#0b1c30]">X (Twitter)</span>
              <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-[#0b1c30]">{channelsVolume.x}</span>
              <span className="text-[11px] font-mono text-[#334155] font-semibold">Modéré</span>
            </div>
          </div>

          <div
            onClick={() => setGlobalChannel(globalChannel === 'social' ? 'all' : 'social')}
            className={`p-3.5 rounded-xl border shadow-2xs flex flex-col justify-between transition-colors cursor-pointer ${
              globalChannel === 'social' ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-400' : 'bg-white border-[#e2e8f0] hover:bg-[#f8fafc]'
            }`}
            title="Cliquer pour filtrer les réseaux sociaux"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold text-[#0b1c30]">YouTube</span>
              <span className="w-2 h-2 rounded-full bg-[#94a3b8]"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-[#0b1c30]">{channelsVolume.youtube}</span>
              <span className="text-[11px] font-mono text-[#64748b] font-semibold">Stable</span>
            </div>
          </div>

          <div
            onClick={() => setGlobalChannel(globalChannel === 'web' ? 'all' : 'web')}
            className={`p-3.5 rounded-xl border shadow-2xs flex flex-col justify-between transition-colors cursor-pointer ${
              globalChannel === 'web' ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-400' : 'bg-white border-[#e2e8f0] hover:bg-[#f8fafc]'
            }`}
            title="Cliquer pour filtrer les sites web"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold text-[#0b1c30]">Web Stream</span>
              <span className="w-2 h-2 rounded-full bg-[#94a3b8]"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-[#0b1c30]">{channelsVolume.web}</span>
              <span className="text-[11px] font-mono text-[#64748b] font-semibold">Stable</span>
            </div>
          </div>

          <div
            onClick={() => setGlobalChannel(globalChannel === 'forums' ? 'all' : 'forums')}
            className={`p-3.5 rounded-xl border shadow-2xs flex flex-col justify-between transition-colors cursor-pointer ${
              globalChannel === 'forums' ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-400' : 'bg-white border-[#e2e8f0] hover:bg-[#f8fafc]'
            }`}
            title="Cliquer pour filtrer les forums"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold text-[#0b1c30]">Forums</span>
              <span className="w-2 h-2 rounded-full bg-[#94a3b8]"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-[#0b1c30]">{channelsVolume.forums}</span>
              <span className="text-[11px] font-mono text-[#64748b] font-semibold">Faible</span>
            </div>
          </div>

          <div
            onClick={() => setGlobalChannel(globalChannel === 'iptv' ? 'all' : 'iptv')}
            className={`p-3.5 rounded-xl border shadow-2xs flex flex-col justify-between transition-colors cursor-pointer ${
              globalChannel === 'iptv' ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-400' : 'bg-white border-[#e2e8f0] hover:bg-[#f8fafc]'
            }`}
            title="Cliquer pour filtrer les applications IPTV"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold text-[#0b1c30]">Apps IPTV</span>
              <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-[#0b1c30]">{channelsVolume.iptv}</span>
              <span className="text-[11px] font-mono text-[#dc2626] font-semibold">Fermé</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dernières menaces / Activité récente des menaces */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-2xs p-5 flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#f1f5f9] gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-[#0b1c30]">Activité récente des menaces</span>
              <span className="text-[11px] font-mono bg-slate-100 text-[#0b1c30] px-2 py-0.5 rounded border border-[#e2e8f0]">
                {filteredThreatsList.length} incident{filteredThreatsList.length > 1 ? 's' : ''}
              </span>
            </div>
            <span className="text-[12px] text-[#64748b]">
              Dernières infractions signalées et analysées sur le périmètre sélectionné
            </span>
          </div>

          {/* Filtres dédiés à la rubrique Tableau des menaces */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filtre par rubrique / catégorie */}
            <div className="inline-flex rounded-lg border border-[#cbd5e1] p-0.5 bg-[#f8fafc]">
              <button
                onClick={() => setThreatsTableFilter('all')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                  threatsTableFilter === 'all'
                    ? 'bg-white text-[#0b1c30] font-bold shadow-2xs'
                    : 'text-[#64748b] hover:text-[#0b1c30]'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setThreatsTableFilter('critical')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                  threatsTableFilter === 'critical'
                    ? 'bg-[#dc2626] text-white font-bold shadow-2xs'
                    : 'text-[#64748b] hover:text-[#dc2626]'
                }`}
              >
                Critiques
              </button>
              <button
                onClick={() => setThreatsTableFilter('social')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                  threatsTableFilter === 'social'
                    ? 'bg-[#0b1c30] text-white font-bold shadow-2xs'
                    : 'text-[#64748b] hover:text-[#0b1c30]'
                }`}
              >
                Réseaux
              </button>
              <button
                onClick={() => setThreatsTableFilter('web')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                  threatsTableFilter === 'web'
                    ? 'bg-[#0b1c30] text-white font-bold shadow-2xs'
                    : 'text-[#64748b] hover:text-[#0b1c30]'
                }`}
              >
                Web
              </button>
              <button
                onClick={() => setThreatsTableFilter('iptv')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                  threatsTableFilter === 'iptv'
                    ? 'bg-[#0b1c30] text-white font-bold shadow-2xs'
                    : 'text-[#64748b] hover:text-[#0b1c30]'
                }`}
              >
                IPTV
              </button>
            </div>

            {/* Filtre local filiale */}
            <div className="flex items-center gap-1 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-2 py-1 shadow-2xs">
              <MapPin className="w-3 h-3 text-[#64748b]" />
              <select
                value={threatsTableCountry}
                onChange={(e) => setThreatsTableCountry(e.target.value)}
                className="text-[11px] font-medium text-[#0b1c30] bg-transparent outline-hidden cursor-pointer"
              >
                <option value="all">Toutes les filiales</option>
                <option value="SN">Sénégal</option>
                <option value="CI">Côte d'Ivoire</option>
                <option value="CM">Cameroun</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[620px]">
            <thead>
              <tr className="text-[#64748b] text-[11px] font-bold uppercase tracking-wider bg-[#f8fafc] border-b border-[#e2e8f0]">
                <th className="py-2.5 px-4">CIBLE & CONTENU</th>
                <th className="py-2.5 px-4">VECTEUR / SOURCE</th>
                <th className="py-2.5 px-4">LOCALISATION</th>
                <th className="py-2.5 px-4">CONSTATATION</th>
                <th className="py-2.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredThreatsList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#64748b] text-[13px]">
                    Aucune infraction ne correspond aux filtres appliqués sur cette rubrique.
                  </td>
                </tr>
              ) : (
                filteredThreatsList.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#f8fafc] transition-colors group cursor-pointer"
                    onClick={() => onSelectThreat(item.id)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            item.isCritical ? 'bg-[#dc2626]' : 'bg-[#cbd5e1]'
                          }`}
                        ></span>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[13px] font-bold text-[#0b1c30]">
                            {item.name}
                          </span>
                          <span className="text-[12px] text-[#64748b] truncate">
                            {item.target}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#dbeafe] text-[#1e40af]">
                        {item.channel}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`text-[12px] ${item.country === 'Non spécifié' ? 'italic text-[#64748b]' : 'text-[#0b1c30] font-medium'}`}>
                        {item.country}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[12px] text-[#475569]">
                        {item.timeAgo}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectThreat(item.id);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0b1c30] text-white text-[12px] font-medium hover:bg-black transition-colors"
                      >
                        <span>Voir la fiche</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-[#64748b]">
          <span className="text-[12px]">
            Affichage de {filteredThreatsList.length} incident{filteredThreatsList.length > 1 ? 's' : ''} filtré{filteredThreatsList.length > 1 ? 's' : ''}
          </span>
          <button
            onClick={onNavigateToThreats}
            className="text-[12px] text-[#0b1c30] font-bold hover:text-[#dc2626] flex items-center gap-1 cursor-pointer"
          >
            <span>Consulter l'ensemble des menaces</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SECTION : BILAN DES CLÔTURES & IMPACT ÉCONOMIQUE AVEC FILTRE PAR RUBRIQUE/PÉRIMÈTRE */}
      <div className="mt-8 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#e2e8f0]">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0b1c30]" />
              <h2 className="text-[17px] font-bold text-[#0b1c30]">
                Résolution des Signalements & Retombées Économiques
              </h2>
            </div>
            <p className="text-[12px] text-[#64748b] mt-0.5">
              Suivi des signalements clôturés, délais d'intervention, manque à gagner du piratage et montants reconvertis.
            </p>
          </div>

          {/* Filtre dédié au bloc économique */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[11px] text-[#64748b] font-medium">Périmètre de cette rubrique :</span>
            <div className="flex items-center gap-1.5 bg-white border border-[#cbd5e1] rounded-lg px-2.5 py-1 shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-[#64748b]" />
              <select
                value={ecoScope}
                onChange={(e) => setEcoScope(e.target.value as any)}
                className="text-[11px] font-mono font-medium text-[#0b1c30] bg-transparent outline-hidden cursor-pointer"
              >
                <option value="all">Consolidé Panafrique</option>
                <option value="SN">Sénégal (SN)</option>
                <option value="CI">Côte d'Ivoire (CI)</option>
                <option value="CM">Cameroun (CM)</option>
                <option value="GA_CD">Gabon & RDC</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4 KPI CARDS DÉDIÉES RÉACTIVES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1 : Signalements Clôturés */}
          <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs flex flex-col justify-between hover:shadow-xs transition-all">
            <div className="flex items-center justify-between text-[#64748b] mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider">Signalements Clôturés</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[30px] font-bold text-[#0b1c30] tracking-tight leading-none font-mono">
                {ecoData.closed}
              </span>
              <span className="text-[12px] font-semibold text-emerald-600 font-mono">
                +{Math.max(2, Math.round(ecoData.closed * 0.12))} en 24h
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
              <span className="text-[12px] text-[#64748b]">Taux de succès</span>
              <span className="text-[12px] text-emerald-700 font-bold font-mono">
                {ecoData.successRate} résolus
              </span>
            </div>
          </div>

          {/* KPI 2 : Délais Signalement -> Clôture */}
          <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs flex flex-col justify-between hover:shadow-xs transition-all">
            <div className="flex items-center justify-between text-[#64748b] mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider">Délai de Clôture</span>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[30px] font-bold text-blue-700 tracking-tight leading-none font-mono">
                {ecoData.delayLive}
              </span>
              <span className="text-[11px] text-[#64748b]">Flux prioritaires</span>
            </div>
            <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
              <span className="text-[12px] text-[#64748b]">Médiane tous canaux</span>
              <span className="text-[12px] text-[#0b1c30] font-bold font-mono">
                {ecoData.delayMedian}
              </span>
            </div>
          </div>

          {/* KPI 3 : Manque à Gagner Actuel */}
          <div className="bg-white p-5 rounded-xl border border-rose-200 bg-rose-50/20 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-all">
            <div className="flex items-center justify-between text-rose-800 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider">Manque à Gagner Actuel</span>
              <TrendingDown className="w-4 h-4 text-rose-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-black text-rose-700 tracking-tight leading-none font-mono">
                {ecoData.lossFcfa}
              </span>
              <span className="text-[12px] font-bold text-rose-600 font-mono">FCFA / mois</span>
            </div>
            <div className="mt-4 pt-3 border-t border-rose-100 flex items-center justify-between">
              <span className="text-[12px] text-rose-800">Périmètre ciblé</span>
              <span className="text-[12px] text-rose-900 font-bold font-mono">
                {ecoData.lossDay}
              </span>
            </div>
          </div>

          {/* KPI 4 : Montant de Conversion */}
          <div className="bg-white p-5 rounded-xl border border-emerald-300 bg-emerald-50/30 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-all">
            <div className="flex items-center justify-between text-emerald-800 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider">Montant de Conversion</span>
              <Coins className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-black text-emerald-800 tracking-tight leading-none font-mono">
                {ecoData.recoveredFcfa}
              </span>
              <span className="text-[12px] font-bold text-emerald-700 font-mono">FCFA / mois</span>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between">
              <span className="text-[12px] text-emerald-900 font-medium">Revenu cumulé (4,5 mois)</span>
              <span className="text-[12px] text-emerald-900 font-bold font-mono">
                {ecoData.recoveredLtv}
              </span>
            </div>
          </div>
        </div>

        {/* 2 BLOCS D'ANALYSE DÉTAILLÉE CÔTE-À-CÔTE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* BLOC 1 : DÉLAIS ET VÉLOCITÉ DE TRAITEMENT PAR VECTEUR */}
          <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs flex flex-col justify-between">
            <div className="pb-3 border-b border-[#f1f5f9] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0b1c30]" />
                <span className="text-[14px] font-bold text-[#0b1c30]">
                  Délais de Clôture par Plateforme & Vecteur
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#64748b]">Objectif réactivité &lt; 30 min</span>
            </div>

            <div className="flex flex-col gap-4 py-3">
              {/* Vecteur 1 : Événements Sportifs Majeurs */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-semibold text-[#0b1c30]">Événements Sportifs Majeurs</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-200">
                      Priorité 1
                    </span>
                  </div>
                  <span className="font-mono font-bold text-emerald-700">18 - 24 min (Extinction)</span>
                </div>
                <div className="w-full h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }}></div>
                </div>
                <span className="text-[11px] text-[#64748b]">
                  Blocage dynamique FAI (Orange, MTN, Moov) & extinction avant la mi-temps.
                </span>
              </div>

              {/* Vecteur 2 : Réseaux Sociaux */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span className="font-semibold text-[#0b1c30]">Réseaux Sociaux (TikTok, Meta, X)</span>
                  </div>
                  <span className="font-mono font-bold text-blue-700">45 min - 1h 15 min</span>
                </div>
                <div className="w-full h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '78%' }}></div>
                </div>
                <span className="text-[11px] text-[#64748b]">
                  Signalement DMCA automatisé aux plateformes & suspension de profils.
                </span>
              </div>

              {/* Vecteur 3 : Sites Web Streaming */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="font-semibold text-[#0b1c30]">Sites Web de streaming & Hébergeurs</span>
                  </div>
                  <span className="font-mono font-bold text-amber-700">2h 30 min - 4h</span>
                </div>
                <div className="w-full h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className="text-[11px] text-[#64748b]">
                  Notification aux hébergeurs Cloudflare / ASN et filtrage DNS opérateurs.
                </span>
              </div>

              {/* Vecteur 4 : Réseaux & IPTV Clandestins */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0b1c30]"></span>
                    <span className="font-semibold text-[#0b1c30]">Panels IPTV & Revendeurs</span>
                  </div>
                  <span className="font-mono font-bold text-[#0b1c30]">24h - 48h (Judiciaire / Gel)</span>
                </div>
                <div className="w-full h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0b1c30] rounded-full" style={{ width: '45%' }}></div>
                </div>
                <span className="text-[11px] text-[#64748b]">
                  Réquisitions judiciaires auprès de Wave / Orange Money et actions physiques.
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-[12px] text-[#64748b]">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Vélocité d'intervention : +42% de rapidité ce mois</span>
              </span>
              <span className="font-mono font-semibold text-[#0b1c30]">94% résolus sous 2h</span>
            </div>
          </div>

          {/* BLOC 2 : RAPPROCHEMENT FINANCIER : MANQUE À GAGNER VS CONVERSION RÉALISÉE */}
          <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs flex flex-col justify-between">
            <div className="pb-3 border-b border-[#f1f5f9] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#0b1c30]" />
                <span className="text-[14px] font-bold text-[#0b1c30]">
                  Rapprochement Financier & Taux de Reconversion
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                {ecoData.conversionRate} Reconversion directe
              </span>
            </div>

            <div className="py-3 flex flex-col gap-4">
              {/* Barre visuelle comparatif Perte vs Récupéré */}
              <div className="p-3.5 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] flex flex-col gap-2.5">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-[11px] font-bold text-[#64748b] uppercase">Manque à gagner théorique</span>
                    <div className="text-[18px] font-black text-rose-700 font-mono">
                      {ecoData.lossFcfa} FCFA
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase">Recapté (Mois 1)</span>
                    <div className="text-[18px] font-black text-emerald-700 font-mono">
                      {ecoData.recoveredFcfa} FCFA
                    </div>
                  </div>
                </div>

                <div className="w-full h-3 bg-rose-100 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-emerald-600 rounded-l-full relative group cursor-pointer"
                    style={{ width: `${Math.min(100, Math.round((ecoData.recoveredFcfaRaw / ecoData.lossFcfaRaw) * 100))}%` }}
                    title={`${ecoData.conversionRate} converti en abonnement officiel au Mois 1`}
                  ></div>
                  <div
                    className="h-full bg-emerald-400 relative group cursor-pointer"
                    style={{ width: '45%' }}
                    title="Revenu total cumulé sur 4,5 mois d'engagement"
                  ></div>
                </div>

                <div className="flex justify-between items-center text-[11px] text-[#64748b]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-emerald-600 rounded-xs"></span>
                    <span>Revenu direct Mois 1 ({ecoData.conversionRate})</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-xs"></span>
                    <span>Revenu cumulé estimé sur 4,5 mois ({ecoData.recoveredLtv})</span>
                  </span>
                </div>
              </div>

              {/* 3 Cartouches d'impact concret */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-2.5 rounded-lg bg-white border border-[#e2e8f0]">
                  <div className="text-[10px] text-[#64748b] uppercase font-bold">Abonnés Réactivés</div>
                  <div className="text-[15px] font-black text-[#0b1c30] font-mono mt-0.5">
                    {ecoData.reactivatedSubs}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                    Foyers officialisés
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-[#e2e8f0]">
                  <div className="text-[10px] text-[#64748b] uppercase font-bold">Panier Moyen</div>
                  <div className="text-[15px] font-black text-[#0b1c30] font-mono mt-0.5">
                    10 500 F
                  </div>
                  <div className="text-[10px] text-[#64748b] mt-0.5">
                    Formule Sport & Access
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-[#e2e8f0]">
                  <div className="text-[10px] text-[#64748b] uppercase font-bold">Rétention Client</div>
                  <div className="text-[15px] font-black text-emerald-700 font-mono mt-0.5">
                    4,5 mois
                  </div>
                  <div className="text-[10px] text-[#64748b] mt-0.5">
                    Durée d'engagement
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2 pt-3 border-t border-[#f1f5f9] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12px]">
              <span className="text-[#64748b]">Périmètre actif : <strong className="text-[#0b1c30]">{ecoData.scopeLabel}</strong></span>
              {onNavigateToMarket && (
                <button
                  onClick={onNavigateToMarket}
                  className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#1e40af] hover:text-[#0b1c30] transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <span>Consulter l'Intelligence Marché & Filiales</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 7. MÉTRIQUES ET INTELLIGENCE D'AUDIENCE SEMRUSH (TOUT EN BAS) */}
      <SemrushOverviewMetrics
        sitesForums={sitesForums}
        onNavigateToImport={onNavigateToImport}
        onShowToast={onShowToast}
      />
    </div>
  );
};
