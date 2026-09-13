import React, { useState, useMemo } from 'react';
import { Threat, ThreatCategory, ThreatStatus } from '../types';
import {
  Video,
  Globe,
  Smartphone,
  Share2,
  MessageSquare,
  Search,
  ArrowUpDown,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Tv,
  LayoutGrid,
  List,
  Columns,
  MapPin,
  Zap,
  RotateCcw,
  SlidersHorizontal,
  FileDown,
  Send,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ArrowRight,
  ArrowLeft,
  Users,
} from 'lucide-react';

type ViewMode = 'table' | 'kanban' | 'map';
type PeriodFilter = 'all' | '2h' | 'today' | '24h' | '7d';
type AudienceFilter = 'all' | 'critical' | 'high' | 'moderate';

interface ThreatsPageProps {
  threats: Threat[];
  onSelectThreat: (threatId: string) => void;
  onSelectTerritory?: (countryName: string) => void;
  onUpdateStatus?: (threatId: string, newStatus: ThreatStatus) => void;
  onOpenPdfExport?: (threat: Threat) => void;
  onShowToast?: (msg: string) => void;
  externalSearch?: string;
}

export const ThreatsPage: React.FC<ThreatsPageProps> = ({
  threats,
  onSelectThreat,
  onSelectTerritory,
  onUpdateStatus,
  onOpenPdfExport,
  onShowToast,
  externalSearch = '',
}) => {
  // View states
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<ThreatCategory>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | ThreatStatus>('all');
  const [selectedAudience, setSelectedAudience] = useState<AudienceFilter>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);

  const effectiveSearch = localSearch || externalSearch;

  // Active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedPeriod !== 'all') count++;
    if (selectedStatus !== 'all') count++;
    if (selectedAudience !== 'all') count++;
    if (selectedCountry !== 'all') count++;
    if (selectedChannel !== 'all') count++;
    if (effectiveSearch.trim()) count++;
    return count;
  }, [
    selectedCategory,
    selectedPeriod,
    selectedStatus,
    selectedAudience,
    selectedCountry,
    selectedChannel,
    effectiveSearch,
  ]);

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedPeriod('all');
    setSelectedStatus('all');
    setSelectedAudience('all');
    setSelectedCountry('all');
    setSelectedChannel('all');
    setLocalSearch('');
    setCurrentPageNum(1);
    if (onShowToast) onShowToast('Tous les filtres ont été réinitialisés.');
  };

  // Helper to parse audience count
  const parseAudience = (viewersStr?: string): number => {
    if (!viewersStr) return 0;
    const num = parseInt(viewersStr.replace(/[^0-9]/g, ''), 10);
    return isNaN(num) ? 0 : num;
  };

  // Filtered threats
  const filteredThreats = useMemo(() => {
    return threats.filter((threat) => {
      // 1. Category filter
      if (selectedCategory !== 'all' && threat.category !== selectedCategory) {
        return false;
      }

      // 2. Status filter
      if (selectedStatus !== 'all' && threat.status !== selectedStatus) {
        return false;
      }

      // 3. Period filter
      if (selectedPeriod === '2h') {
        // Only today recent ones
        if (!threat.detectionDate.includes('20:') && !threat.detectionDate.includes('19:')) {
          return false;
        }
      } else if (selectedPeriod === 'today') {
        if (!threat.detectionDate.toLowerCase().includes("aujourd'hui")) {
          return false;
        }
      } else if (selectedPeriod === '24h') {
        if (threat.detectionDate.toLowerCase().includes('février 2025')) {
          return false;
        }
      }

      // 4. Audience filter
      const audience = parseAudience(threat.viewersCount);
      if (selectedAudience === 'critical' && audience < 10000) {
        return false;
      }
      if (selectedAudience === 'high' && (audience < 1000 || audience >= 10000)) {
        return false;
      }
      if (selectedAudience === 'moderate' && audience >= 1000) {
        return false;
      }

      // 5. Country filter
      if (selectedCountry !== 'all') {
        if (selectedCountry === 'International') {
          if (['Sénégal', "Côte d'Ivoire", 'Cameroun', 'Mali', 'Gabon', 'RDC'].includes(threat.country || '')) {
            return false;
          }
        } else if (!threat.country || !threat.country.includes(selectedCountry)) {
          return false;
        }
      }

      // 6. Channel filter
      if (selectedChannel !== 'all') {
        if (!threat.rightsHolder?.toLowerCase().includes(selectedChannel.toLowerCase()) &&
            !threat.content?.toLowerCase().includes(selectedChannel.toLowerCase())) {
          return false;
        }
      }

      // 7. Search query
      if (effectiveSearch.trim()) {
        const q = effectiveSearch.toLowerCase();
        const matchesName = threat.name.toLowerCase().includes(q);
        const matchesContent = threat.content.toLowerCase().includes(q);
        const matchesPlatform = threat.platform.toLowerCase().includes(q);
        const matchesCountry = (threat.country || '').toLowerCase().includes(q);
        const matchesId = threat.id.toLowerCase().includes(q);
        return matchesName || matchesContent || matchesPlatform || matchesCountry || matchesId;
      }

      return true;
    });
  }, [
    threats,
    selectedCategory,
    selectedStatus,
    selectedPeriod,
    selectedAudience,
    selectedCountry,
    selectedChannel,
    effectiveSearch,
  ]);

  // Match night stats
  const liveStats = useMemo(() => {
    let totalLiveAudience = 0;
    let criticalStreams = 0;
    filteredThreats.forEach((t) => {
      const aud = parseAudience(t.viewersCount);
      totalLiveAudience += aud;
      if (aud >= 5000 && t.status !== 'close') {
        criticalStreams++;
      }
    });
    return {
      totalAudience: totalLiveAudience,
      criticalCount: criticalStreams,
    };
  }, [filteredThreats]);

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      all: threats.length,
      social: threats.filter((t) => t.category === 'social').length,
      web: threats.filter((t) => t.category === 'web').length,
      iptv: threats.filter((t) => t.category === 'iptv').length,
      forums: threats.filter((t) => t.category === 'forums').length,
    };
  }, [threats]);

  // Render icon based on type
  const renderIcon = (type: string) => {
    switch (type) {
      case 'videocam':
        return <Video className="w-5 h-5 text-[#0b1c30]" />;
      case 'language':
        return <Globe className="w-5 h-5 text-[#0b1c30]" />;
      case 'android':
        return <Smartphone className="w-5 h-5 text-[#0b1c30]" />;
      case 'share':
        return <Share2 className="w-5 h-5 text-[#0b1c30]" />;
      case 'forum':
        return <MessageSquare className="w-5 h-5 text-[#0b1c30]" />;
      case 'smart_display':
        return <Tv className="w-5 h-5 text-[#0b1c30]" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-[#0b1c30]" />;
    }
  };

  const getStatusBadge = (status: Threat['status']) => {
    switch (status) {
      case 'analyse':
        return (
          <span className="px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider bg-[#ffdad6] text-[#410002]">
            À analyser
          </span>
        );
      case 'transmit':
        return (
          <span className="px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider bg-[#dce9ff] text-[#0b1c30]">
            À transmettre
          </span>
        );
      case 'follow':
        return (
          <span className="px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider bg-[#e5eeff] text-[#0b1c30]">
            À suivre
          </span>
        );
      case 'close':
        return (
          <span className="px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider bg-[#eff4ff] text-[#76777d]">
            Clôturé
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Header */}
      <div className="flex flex-col gap-4 mb-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#bb0112] font-bold uppercase tracking-wider">
                Surveillance active
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#bb0112] animate-pulse"></span>
              <span className="text-[11px] text-[#76777d]">
                {filteredThreats.length} flux sous monitoring
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0b1c30]">
              Menaces détectées
            </h1>
            <p className="text-[13px] text-[#45464d]">
              Diffusions, comptes, sites et applications non autorisés
            </p>
          </div>

          {/* Top Actions: Switcher de Vues (Tableau, Pipeline, Territoires) */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* View Mode Selector */}
            <div className="flex items-center p-1 bg-white rounded-xl border border-[#e5eeff] shadow-2xs">
              <button
                onClick={() => setViewMode('table')}
                title="Vue Tableau / Liste"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[#0b1c30] text-white shadow-xs'
                    : 'text-[#64748b] hover:text-[#0b1c30] hover:bg-[#f8fafc]'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tableau</span>
              </button>

              <button
                onClick={() => setViewMode('kanban')}
                title="Vue Pipeline Kanban"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${
                  viewMode === 'kanban'
                    ? 'bg-[#0b1c30] text-white shadow-xs'
                    : 'text-[#64748b] hover:text-[#0b1c30] hover:bg-[#f8fafc]'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pipeline</span>
              </button>

              <button
                onClick={() => setViewMode('map')}
                title="Vue Carte & Territoires"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-[#0b1c30] text-white shadow-xs'
                    : 'text-[#64748b] hover:text-[#0b1c30] hover:bg-[#f8fafc]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Territoires</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills & Primary Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#0b1c30] text-white shadow-xs font-semibold'
                  : 'bg-[#e5eeff] text-[#0b1c30] hover:bg-[#dce9ff]'
              }`}
            >
              Tous <span className="ml-1 opacity-75 font-mono text-[11px]">{categoryCounts.all}</span>
            </button>

            <button
              onClick={() => setSelectedCategory('social')}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer ${
                selectedCategory === 'social'
                  ? 'bg-[#0b1c30] text-white shadow-xs font-semibold'
                  : 'bg-[#e5eeff] text-[#0b1c30] hover:bg-[#dce9ff]'
              }`}
            >
              Réseaux sociaux{' '}
              <span className="ml-1 opacity-75 font-mono text-[11px]">{categoryCounts.social}</span>
            </button>

            <button
              onClick={() => setSelectedCategory('web')}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer ${
                selectedCategory === 'web'
                  ? 'bg-[#0b1c30] text-white shadow-xs font-semibold'
                  : 'bg-[#e5eeff] text-[#0b1c30] hover:bg-[#dce9ff]'
              }`}
            >
              Web & Sites{' '}
              <span className="ml-1 opacity-75 font-mono text-[11px]">{categoryCounts.web}</span>
            </button>

            <button
              onClick={() => setSelectedCategory('iptv')}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer ${
                selectedCategory === 'iptv'
                  ? 'bg-[#0b1c30] text-white shadow-xs font-semibold'
                  : 'bg-[#e5eeff] text-[#0b1c30] hover:bg-[#dce9ff]'
              }`}
            >
              Applications IPTV{' '}
              <span className="ml-1 opacity-75 font-mono text-[11px]">{categoryCounts.iptv}</span>
            </button>

            <button
              onClick={() => setSelectedCategory('forums')}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer ${
                selectedCategory === 'forums'
                  ? 'bg-[#0b1c30] text-white shadow-xs font-semibold'
                  : 'bg-[#e5eeff] text-[#0b1c30] hover:bg-[#dce9ff]'
              }`}
            >
              Forums{' '}
              <span className="ml-1 opacity-75 font-mono text-[11px]">{categoryCounts.forums}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-2.5 text-[#76777d] w-4 h-4" />
              <input
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Filtrer par compte, URL, domaine..."
                className="w-full pl-9 pr-4 py-2 bg-white rounded-xl text-[13px] text-[#0b1c30] placeholder:text-[#76777d] border border-[#e5eeff] shadow-xs focus:outline-none focus:ring-1 focus:ring-[#0b1c30] transition-all"
              />
            </div>

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-3.5 py-2 rounded-xl text-[12px] font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                showAdvancedFilters || activeFiltersCount > (selectedCategory !== 'all' ? 1 : 0)
                  ? 'bg-[#0b1c30] text-white border-[#0b1c30]'
                  : 'bg-white text-[#0b1c30] border-[#e5eeff] hover:bg-[#eff4ff]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtres</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#bb0112] text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={resetAllFilters}
                title="Réinitialiser tous les filtres"
                className="p-2 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-red-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Barre de filtres avancés déroulante */}
        {showAdvancedFilters && (
          <div className="p-4 bg-white rounded-2xl border border-[#e5eeff] shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 animate-fade-in">
            {/* 1. Période */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                Période
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as PeriodFilter)}
                className="bg-[#f8fafc] border border-[#e2e8f0] text-[#0b1c30] text-[12px] rounded-lg p-2 focus:outline-none focus:border-[#0b1c30]"
              >
                <option value="all">Toutes les dates</option>
                <option value="2h">Dernières 2 heures</option>
                <option value="today">Aujourd'hui</option>
                <option value="24h">Dernières 24 heures</option>
                <option value="7d">7 derniers jours</option>
              </select>
            </div>

            {/* 2. Statut */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                Statut du dossier
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="bg-[#f8fafc] border border-[#e2e8f0] text-[#0b1c30] text-[12px] rounded-lg p-2 focus:outline-none focus:border-[#0b1c30]"
              >
                <option value="all">Tous les statuts</option>
                <option value="analyse">À analyser</option>
                <option value="follow">À suivre</option>
                <option value="transmit">À transmettre</option>
                <option value="close">Clôturé</option>
              </select>
            </div>

            {/* 3. Seuil d'Audience */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                Audience estimée
              </label>
              <select
                value={selectedAudience}
                onChange={(e) => setSelectedAudience(e.target.value as AudienceFilter)}
                className="bg-[#f8fafc] border border-[#e2e8f0] text-[#0b1c30] text-[12px] rounded-lg p-2 focus:outline-none focus:border-[#0b1c30]"
              >
                <option value="all">Toutes audiences</option>
                <option value="critical">Critique (&gt; 10 000 spectateurs)</option>
                <option value="high">Élevée (1 000 - 10 000)</option>
                <option value="moderate">Modérée (&lt; 1 000)</option>
              </select>
            </div>

            {/* 4. Territoire / Pays */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                Territoire
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-[#f8fafc] border border-[#e2e8f0] text-[#0b1c30] text-[12px] rounded-lg p-2 focus:outline-none focus:border-[#0b1c30]"
              >
                <option value="all">Tous les pays</option>
                <option value="Sénégal">Sénégal</option>
                <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                <option value="Cameroun">Cameroun</option>
                <option value="Mali">Mali</option>
                <option value="RDC">RDC & Gabon</option>
                <option value="International">International (CDN / VPN)</option>
              </select>
            </div>

            {/* 5. Chaîne protégée */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                Chaîne ciblée
              </label>
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="bg-[#f8fafc] border border-[#e2e8f0] text-[#0b1c30] text-[12px] rounded-lg p-2 focus:outline-none focus:border-[#0b1c30]"
              >
                <option value="all">Toutes les chaînes</option>
                <option value="CHEIKH +">CHEIKH + (Généraliste)</option>
                <option value="Sport">CHEIKH + Sport</option>
                <option value="Foot">CHEIKH + Foot</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 1. VUE TABLEAU / LISTE CLASSIQUE                         */}
      {/* ========================================================= */}
      {viewMode === 'table' && (
        <div className="flex flex-col gap-3">
          {filteredThreats.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#e5eeff] p-12 text-center text-[#76777d]">
              <p className="font-semibold text-[15px] text-[#0b1c30] mb-1">
                Aucune menace ne correspond à vos filtres.
              </p>
              <p className="text-[13px]">
                Modifiez vos critères ou réinitialisez les filtres de recherche.
              </p>
              <button
                onClick={resetAllFilters}
                className="mt-4 px-4 py-2 rounded-lg bg-[#0b1c30] text-white text-[12px] font-bold"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            filteredThreats.map((item) => (
              <div
                key={item.id}
                className="group bg-white hover:bg-[#eff4ff] transition-all duration-150 p-4 lg:p-5 rounded-2xl border border-[#e5eeff] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer"
                onClick={() => onSelectThreat(item.id)}
              >
                <div className="flex items-start lg:items-center gap-4 min-w-0 flex-1">
                  <div className="w-11 h-11 rounded-xl bg-[#e5eeff] flex items-center justify-center shrink-0">
                    {renderIcon(item.iconType)}
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[15px] font-bold text-[#0b1c30] truncate">
                        {item.name}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#eff4ff] text-[#45464d] border border-[#dce9ff]">
                        {item.platform}
                      </span>
                      {item.viewersCount && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                          {item.viewersCount}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#76777d]">
                        <Globe className="w-3 h-3" />
                        {item.country || 'Territoire non spécifié'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-1.5 text-[#76777d] flex-wrap text-[13px]">
                      <span className="text-[#0b1c30] font-medium flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.status === 'analyse'
                              ? 'bg-[#bb0112]'
                              : item.status === 'transmit'
                              ? 'bg-[#e02928]'
                              : 'bg-[#76777d]'
                          }`}
                        ></span>
                        {item.content}
                      </span>
                      <span className="text-[11px] text-[#76777d]/90">
                        {item.detectionDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0">
                  {getStatusBadge(item.status)}

                  {onOpenPdfExport && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenPdfExport(item);
                      }}
                      title="Générer Fiche de constat PDF"
                      className="px-3 py-2 rounded-lg bg-white hover:bg-[#e2e8f0] text-[#0b1c30] border border-[#cbd5e1] text-[12px] font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <FileDown className="w-3.5 h-3.5 text-[#0b1c30]" />
                      <span className="hidden sm:inline">Constat PDF</span>
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectThreat(item.id);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#0b1c30] hover:bg-[#1e293b] text-white text-[12px] font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Dossier</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. VUE PIPELINE KANBAN (Traitement des dossiers)          */}
      {/* ========================================================= */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {(
            [
              {
                id: 'analyse' as ThreatStatus,
                title: 'À analyser',
                color: 'bg-red-50 text-red-800 border-red-200',
                badgeBg: 'bg-red-600 text-white',
              },
              {
                id: 'follow' as ThreatStatus,
                title: 'À suivre (Veille)',
                color: 'bg-blue-50 text-blue-800 border-blue-200',
                badgeBg: 'bg-blue-600 text-white',
              },
              {
                id: 'transmit' as ThreatStatus,
                title: 'À transmettre',
                color: 'bg-amber-50 text-amber-800 border-amber-200',
                badgeBg: 'bg-amber-600 text-white',
              },
              {
                id: 'close' as ThreatStatus,
                title: 'Clôturés / Coupés',
                color: 'bg-gray-100 text-gray-800 border-gray-200',
                badgeBg: 'bg-gray-600 text-white',
              },
            ] as const
          ).map((column) => {
            const colThreats = filteredThreats.filter((t) => t.status === column.id);
            return (
              <div
                key={column.id}
                className="bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] p-4 flex flex-col h-full min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e2e8f0]">
                  <span className="font-bold text-[14px] text-[#0b1c30]">
                    {column.title}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${column.badgeBg}`}
                  >
                    {colThreats.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[700px] pr-1">
                  {colThreats.length === 0 ? (
                    <div className="p-6 text-center text-[12px] text-gray-400 border border-dashed border-gray-200 rounded-xl">
                      Aucun dossier dans cette colonne
                    </div>
                  ) : (
                    colThreats.map((threat) => (
                      <div
                        key={threat.id}
                        className="bg-white p-3.5 rounded-xl border border-[#e2e8f0] shadow-2xs hover:shadow-xs transition-all flex flex-col gap-2.5 cursor-pointer"
                        onClick={() => onSelectThreat(threat.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[13px] font-bold text-[#0b1c30] truncate">
                            {threat.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#eff4ff] text-[#0b1c30] font-semibold shrink-0">
                            {threat.channel}
                          </span>
                        </div>

                        <p className="text-[12px] text-[#475569] line-clamp-2 leading-snug">
                          {threat.content}
                        </p>

                        {threat.viewersCount && (
                          <div className="text-[11px] font-semibold text-red-600 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                            <span>{threat.viewersCount}</span>
                          </div>
                        )}

                        <div className="pt-2 border-t border-[#f1f5f9] flex items-center justify-between text-[11px]">
                          <span className="text-[#94a3b8]">{threat.country || 'N/A'}</span>

                          {/* Quick Workflow Transitions */}
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            {column.id !== 'analyse' && onUpdateStatus && (
                              <button
                                onClick={() => {
                                  onUpdateStatus(threat.id, 'analyse');
                                  if (onShowToast) onShowToast(`Statut mis à jour : À analyser`);
                                }}
                                title="Passer en À analyser"
                                className="p-1 rounded bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0b1c30]"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}

                            {column.id !== 'transmit' && onUpdateStatus && (
                              <button
                                onClick={() => {
                                  onUpdateStatus(threat.id, 'transmit');
                                  if (onShowToast) onShowToast(`Statut mis à jour : À transmettre`);
                                }}
                                title="Transmettre à l'équipe juridique"
                                className="px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold"
                              >
                                Transmettre
                              </button>
                            )}

                            {column.id !== 'close' && onUpdateStatus && (
                              <button
                                onClick={() => {
                                  onUpdateStatus(threat.id, 'close');
                                  if (onShowToast) onShowToast(`Dossier clôturé`);
                                }}
                                title="Clôturer le dossier"
                                className="p-1 rounded bg-green-50 hover:bg-green-100 text-green-700"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. VUE CARTE & TERRITOIRES                                */}
      {/* ========================================================= */}
      {viewMode === 'map' && (
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#e5eeff] shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#f1f5f9] mb-5">
              <div>
                <h3 className="text-[16px] font-bold text-[#0b1c30]">
                  Cartographie des foyers de diffusion non autorisée
                </h3>
                <p className="text-[12px] text-[#64748b]">
                  Répartition des flux constatés et des audiences par territoire géographique
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#0b1c30] bg-[#f8fafc] px-3 py-1 rounded-full border border-[#e2e8f0]">
                Zone principale : Afrique de l'Ouest & Centrale
              </span>
            </div>

            {/* Regions interactive grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  country: 'Sénégal',
                  code: 'SN',
                  streams: 41,
                  percentage: '29%',
                  audience: '~19 200 spectateurs',
                  providers: 'Orange SN, Sonatel, Free',
                  urgency: 'Critique',
                },
                {
                  country: "Côte d'Ivoire",
                  code: 'CI',
                  streams: 36,
                  percentage: '25%',
                  audience: '~16 500 spectateurs',
                  providers: 'MTN CI, Orange CI, Moov',
                  urgency: 'Critique',
                },
                {
                  country: 'Cameroun',
                  code: 'CM',
                  streams: 28,
                  percentage: '20%',
                  audience: '~11 800 spectateurs',
                  providers: 'Camtel, MTN CM, Orange CM',
                  urgency: 'Élevée',
                },
                {
                  country: 'Mali & Guinée',
                  code: 'ML/GN',
                  streams: 19,
                  percentage: '13%',
                  audience: '~7 400 spectateurs',
                  providers: 'Malitel, Orange Mali',
                  urgency: 'Moyenne',
                },
                {
                  country: 'RDC & Gabon',
                  code: 'CD/GA',
                  streams: 18,
                  percentage: '13%',
                  audience: '~6 900 spectateurs',
                  providers: 'Airtel, Vodacom, Gabon Telecom',
                  urgency: 'Moyenne',
                },
                {
                  country: 'Serveurs & VPN Externes',
                  code: 'INT',
                  streams: 12,
                  percentage: '8%',
                  audience: '~5 100 spectateurs',
                  providers: 'Cloudflare, OVH, Hostinger',
                  urgency: 'Sous surveillance',
                },
              ].map((region) => (
                <div
                  key={region.country}
                  onClick={() => {
                    if (onSelectTerritory) {
                      onSelectTerritory(region.country);
                    } else {
                      setSelectedCountry(region.country === 'Serveurs & VPN Externes' ? 'International' : region.country);
                      setViewMode('table');
                      if (onShowToast) onShowToast(`Filtré sur le territoire : ${region.country}`);
                    }
                  }}
                  className="group p-5 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] hover:bg-white hover:border-[#0b1c30] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#bb0112] group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-[15px] text-[#0b1c30] group-hover:text-[#1e40af] transition-colors">
                          {region.country}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#64748b] block mt-0.5">
                        Opérateurs : {region.providers}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        region.urgency === 'Critique'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {region.urgency}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[12px]">
                      <span className="text-[#64748b]">Volume de flux</span>
                      <span className="font-bold text-[#0b1c30]">
                        {region.streams} flux ({region.percentage})
                      </span>
                    </div>

                    <div className="w-full h-2 bg-[#e2e8f0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0b1c30] rounded-full"
                        style={{ width: region.percentage }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-[11px] text-[#64748b] pt-1">
                      <span>Audience estimée :</span>
                      <span className="font-semibold text-red-600">{region.audience}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#e2e8f0] text-[12px] text-[#0b1c30] font-bold flex items-center justify-between group-hover:text-[#1e40af] transition-colors">
                    <span className="text-[11px] text-[#64748b] font-normal">Fiche analytique & indicateurs</span>
                    <div className="flex items-center gap-1 text-[#1e40af]">
                      <span>Consulter l'analyse</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-4 border-t border-[#e5eeff]">
        <div className="text-[12px] text-[#76777d]">
          Affichage de <span className="font-bold text-[#0b1c30] font-mono">1</span> à{' '}
          <span className="font-bold text-[#0b1c30] font-mono">
            {Math.min(filteredThreats.length, 12)}
          </span>{' '}
          sur <span className="font-bold text-[#0b1c30] font-mono">{filteredThreats.length}</span>{' '}
          menaces filtrées
        </div>

        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPageNum === 1}
            onClick={() => setCurrentPageNum((p) => Math.max(1, p - 1))}
            className="w-8 h-8 rounded-lg bg-white border border-[#e5eeff] flex items-center justify-center text-[#76777d] hover:bg-[#eff4ff] disabled:opacity-50 disabled:cursor-not-allowed shadow-xs cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-lg bg-[#0b1c30] text-white text-[11px] font-bold shadow-xs">
            1
          </button>
          <button className="w-8 h-8 rounded-lg bg-white hover:bg-[#eff4ff] text-[#0b1c30] border border-[#e5eeff] text-[11px] font-bold shadow-xs transition-colors cursor-pointer">
            2
          </button>
          <button className="w-8 h-8 rounded-lg bg-white hover:bg-[#eff4ff] text-[#0b1c30] border border-[#e5eeff] text-[11px] font-bold shadow-xs transition-colors cursor-pointer">
            3
          </button>
          <span className="px-1 text-[#76777d] font-mono text-[11px]">...</span>
          <button
            onClick={() => setCurrentPageNum((p) => p + 1)}
            className="w-8 h-8 rounded-lg bg-white hover:bg-[#eff4ff] border border-[#e5eeff] flex items-center justify-center text-[#0b1c30] shadow-xs transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
