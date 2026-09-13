import React, { useState, useMemo } from 'react';
import { ThreatStatus } from '../types';
import {
  Film,
  Clapperboard,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Zap,
  Lock,
  X,
  Send,
  Radio,
  ZoomIn,
  RotateCcw,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Users,
  Eye,
  Video,
  Share2
} from 'lucide-react';
import { mockExcerptPages, mockSeriesPiracyList, SocialExcerptPageItem, SeriesPiracyItem } from '../data/seriesData';

interface SeriesPageProps {
  onShowToast: (msg: string) => void;
}

export const SeriesPage: React.FC<SeriesPageProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'pages' | 'series'>('pages');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | ThreatStatus>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [zoomImg, setZoomImg] = useState<string | null>(null);
  
  const [selectedPage, setSelectedPage] = useState<SocialExcerptPageItem | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<SeriesPiracyItem | null>(null);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedStatus !== 'all') count++;
    if (selectedPlatform !== 'all') count++;
    if (selectedRisk !== 'all') count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [selectedStatus, selectedPlatform, selectedRisk, searchQuery]);

  const resetFilters = () => {
    setSelectedStatus('all');
    setSelectedPlatform('all');
    setSelectedRisk('all');
    setSearchQuery('');
    onShowToast('Filtres des séries et pages réinitialisés');
  };

  const filteredPages = useMemo(() => {
    return mockExcerptPages.filter((item) => {
      // Threat Status
      if (selectedStatus !== 'all' && item.threatStatus !== selectedStatus) return false;

      // Platform
      if (selectedPlatform !== 'all' && item.platform !== selectedPlatform) return false;

      // Risk
      if (selectedRisk !== 'all' && item.riskLevel !== selectedRisk) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.pageName.toLowerCase().includes(q) ||
          item.seriesTitle.toLowerCase().includes(q) ||
          item.excerptType.toLowerCase().includes(q) ||
          item.country.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [searchQuery, selectedStatus, selectedPlatform, selectedRisk]);

  const filteredSeries = useMemo(() => {
    return mockSeriesPiracyList.filter((item) => {
      if (selectedStatus !== 'all' && item.threatStatus !== selectedStatus) return false;
      if (selectedRisk !== 'all' && item.riskLevel !== selectedRisk) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.genre.toLowerCase().includes(q) ||
          item.primaryLeakVector.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery, selectedStatus, selectedRisk]);

  const formatNumber = (num: number) => num.toLocaleString('fr-FR');

  const getStatusBadge = (status: ThreatStatus) => {
    switch (status) {
      case 'analyse':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#fffbeb] text-[#b45309]">
            À analyser
          </span>
        );
      case 'transmit':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#fee2e2] text-[#dc2626]">
            À transmettre
          </span>
        );
      case 'follow':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#dbeafe] text-[#1e40af]">
            À suivre
          </span>
        );
      case 'close':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#f1f5f9] text-[#64748b]">
            Clôturé
          </span>
        );
    }
  };

  const getRiskBadge = (risk: 'critical' | 'high' | 'medium') => {
    switch (risk) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1 shrink-0">
            <AlertTriangle className="w-3 h-3 text-red-600" />
            <span>Risque Critique</span>
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 shrink-0">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Risque Élevé</span>
          </span>
        );
      case 'medium':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1 shrink-0">
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
            <span>Sous Contrôle</span>
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col w-full pb-8">
      {/* En-tête de page */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e2e8f0] mb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-bold tracking-tight text-[#0b1c30]">
              7. Séries Originales & Extraits Longs sur Réseaux Sociaux
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#dbeafe] text-[#1e40af]">
              {activeTab === 'pages' ? `${filteredPages.length} PAGES INFRACTRICES` : `${filteredSeries.length} SÉRIES PROTEGÉES`}
            </span>
          </div>
          <p className="text-[13px] text-[#64748b]">
            Détection et suppression des pages/comptes (TikTok, Facebook, YouTube, Telegram) diffusant des extraits longs (15-45 min) des Créations Originales CANAL+
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-white rounded-xl border border-[#e2e8f0] shadow-2xs">
            <button
              onClick={() => setViewMode('grid')}
              title="Vue Cartes"
              className={`p-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#0b1c30] text-white shadow-xs'
                  : 'text-[#64748b] hover:text-[#0b1c30]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="Vue Tableau compact"
              className={`p-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#0b1c30] text-white shadow-xs'
                  : 'text-[#64748b] hover:text-[#0b1c30]'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-3 border-b border-[#e2e8f0] mb-6 pb-2">
        <button
          onClick={() => setActiveTab('pages')}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'pages'
              ? 'bg-[#0b1c30] text-white shadow-xs'
              : 'bg-white text-[#64748b] hover:text-[#0b1c30] border border-[#e2e8f0]'
          }`}
        >
          <Share2 className="w-4 h-4 text-purple-400" />
          <span>Pages & Comptes Diffusant des Extraits Longs ({mockExcerptPages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('series')}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'series'
              ? 'bg-[#0b1c30] text-white shadow-xs'
              : 'bg-white text-[#64748b] hover:text-[#0b1c30] border border-[#e2e8f0]'
          }`}
        >
          <Clapperboard className="w-4 h-4 text-purple-400" />
          <span>Synthèse par Série Originale ({mockSeriesPiracyList.length})</span>
        </button>
      </div>

      {/* Barre de Filtres & Recherche */}
      <div className="p-4 bg-white rounded-2xl border border-[#e2e8f0] shadow-xs mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
        {/* Recherche */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
            Recherche libre
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-[#64748b] w-4 h-4" />
            <input
              id="search-series-pages"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom de page, série, compte..."
              className="w-full pl-9 pr-4 py-2 bg-[#f8fafc] rounded-lg text-[13px] text-[#0b1c30] placeholder:text-[#94a3b8] border border-[#e2e8f0] focus:outline-none focus:border-[#0b1c30] transition-all"
            />
          </div>
        </div>

        {/* Statut */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
            Statut
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

        {/* Plateforme (pour l'onglet Pages) */}
        {activeTab === 'pages' ? (
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
              Réseau Social
            </label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="bg-[#f8fafc] border border-[#e2e8f0] text-[#0b1c30] text-[12px] rounded-lg p-2 focus:outline-none focus:border-[#0b1c30]"
            >
              <option value="all">Toutes plateformes</option>
              <option value="TikTok">🎵 TikTok</option>
              <option value="Facebook">📘 Facebook</option>
              <option value="YouTube">🔴 YouTube</option>
              <option value="Telegram">✈️ Telegram</option>
              <option value="Instagram">📸 Instagram</option>
            </select>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
              Niveau de Risque
            </label>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="bg-[#f8fafc] border border-[#e2e8f0] text-[#0b1c30] text-[12px] rounded-lg p-2 focus:outline-none focus:border-[#0b1c30]"
            >
              <option value="all">Tous les niveaux</option>
              <option value="critical">Critique (Leak HD)</option>
              <option value="high">Élevé</option>
              <option value="medium">Moyen</option>
            </select>
          </div>
        )}

        {/* Reset */}
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 ? (
            <button
              onClick={resetFilters}
              className="w-full px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-[12px] font-bold flex items-center justify-center gap-1.5 border border-red-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Effacer ({activeFiltersCount})</span>
            </button>
          ) : (
            <div className="text-[12px] text-[#94a3b8] italic text-center w-full py-2">
              Filtres inactifs
            </div>
          )}
        </div>
      </div>

      {/* SECTION 1: VUE PAGES & COMPTES (EXTRAITS LONGS) */}
      {activeTab === 'pages' && (
        <>
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPages.length === 0 ? (
                <div className="col-span-full bg-white rounded-xl border border-[#e2e8f0] p-12 text-center text-[#64748b]">
                  Aucun compte/page infracteur ne correspond à vos filtres.
                </div>
              ) : (
                filteredPages.map((page) => (
                  <div
                    key={page.id}
                    id={`page-card-${page.id}`}
                    className="bg-white rounded-2xl border border-[#e2e8f0] shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-xs transition-all"
                  >
                    {/* Header */}
                    <div className="p-5 pb-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-xl shrink-0">
                            {page.platformIcon}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-[15px] font-bold text-[#0b1c30]">
                                {page.pageName}
                              </h3>
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                                {page.platform}
                              </span>
                            </div>
                            <div className="text-[12px] text-purple-900 font-semibold mt-0.5">
                              Série ciblée : <span className="font-bold">{page.seriesTitle}</span> ({page.seasonEpisode})
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          {getStatusBadge(page.threatStatus)}
                          {getRiskBadge(page.riskLevel)}
                        </div>
                      </div>

                      {/* Video Proof Capture */}
                      <div className="relative w-full h-40 rounded-xl overflow-hidden border border-[#e2e8f0] bg-[#0b1c30] group mb-4">
                        <img
                          src={page.captureUrl}
                          alt={page.pageName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <button
                          onClick={() => setZoomImg(page.captureUrl)}
                          className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black transition-colors backdrop-blur-xs cursor-pointer"
                          title="Agrandir la vidéo probante"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>

                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                          <span className="font-bold bg-purple-950/80 px-2 py-0.5 rounded backdrop-blur-xs border border-purple-400/30 text-amber-300">
                            🎬 {page.excerptType} ({page.excerptDurationMinutes} min)
                          </span>
                          <span className="font-mono text-gray-200">
                            Actif : {page.lastActiveDate}
                          </span>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-2 text-[12px]">
                        <div className="p-2.5 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
                          <span className="text-[10px] font-bold text-[#64748b] uppercase block">
                            Vues Cumulative Extraits
                          </span>
                          <span className="text-[14px] font-bold font-mono text-red-600 flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {formatNumber(page.totalViews)} vues
                          </span>
                          <span className="text-[10px] text-[#64748b] block mt-0.5">
                            Audience page : {formatNumber(page.followersCount)} abonnés
                          </span>
                        </div>

                        <div className="p-2.5 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
                          <span className="text-[10px] font-bold text-[#64748b] uppercase block">
                            Watermark Extrait (Smartcard ID)
                          </span>
                          {page.smartcardWatermarkId ? (
                            <span className="text-[13px] font-bold font-mono text-purple-700 block">
                              {page.smartcardWatermarkId}
                            </span>
                          ) : (
                            <span className="text-[11px] text-gray-400 italic block">Flouté / En Analyse</span>
                          )}
                          <span className="text-[10px] text-amber-800 font-semibold block mt-0.5">
                            {page.country}
                          </span>
                        </div>
                      </div>

                      {/* Takedown Status */}
                      <div className="mt-3 p-2.5 rounded-xl bg-purple-50/70 border border-purple-200 text-[11px] text-purple-950 flex items-center justify-between">
                        <span className="font-semibold">Procédure : {page.takedownStatus}</span>
                        <a
                          href={page.pageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-bold text-purple-800 hover:underline flex items-center gap-1"
                        >
                          Lien Compte <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 bg-[#f8fafc] border-t border-[#e2e8f0] flex items-center justify-between">
                      <span className="text-[11px] font-bold text-red-700">
                        Piratage Extraits Longs
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedPage(page)}
                          className="px-3 py-1.5 rounded-lg bg-[#0b1c30] text-white hover:bg-[#1e40af] text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Fiche Signalement Compte
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {viewMode === 'table' && (
            <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12px] border-collapse">
                  <thead>
                    <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] font-bold text-[#64748b] uppercase">
                      <th className="py-3 px-4">Vidéo</th>
                      <th className="py-3 px-4">Compte / Réseau</th>
                      <th className="py-3 px-4">Série & Épisode</th>
                      <th className="py-3 px-4">Durée Excerpt</th>
                      <th className="py-3 px-4">Vues Extraits</th>
                      <th className="py-3 px-4">Statut</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0]">
                    {filteredPages.map((page) => (
                      <tr key={page.id} className="hover:bg-[#f8fafc] transition-colors">
                        <td className="py-3 px-4">
                          <div
                            onClick={() => setZoomImg(page.captureUrl)}
                            className="w-12 h-9 rounded-lg overflow-hidden border border-[#e2e8f0] bg-black relative group cursor-pointer"
                          >
                            <img src={page.captureUrl} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                              <ZoomIn className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-[#0b1c30] flex items-center gap-1.5">
                            <span>{page.platformIcon}</span>
                            <span>{page.pageName}</span>
                          </div>
                          <div className="text-[11px] text-[#64748b]">{page.platform} • {page.country}</div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-purple-900">{page.seriesTitle}</div>
                          <div className="text-[11px] text-[#64748b]">{page.seasonEpisode}</div>
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-[#0b1c30]">
                          {page.excerptDurationMinutes} min ({page.excerptType})
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-red-600">
                          {formatNumber(page.totalViews)}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1 items-start">
                            {getStatusBadge(page.threatStatus)}
                            {getRiskBadge(page.riskLevel)}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedPage(page)}
                            className="px-3 py-1.5 rounded-lg bg-[#0b1c30] text-white hover:bg-[#1e40af] text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Signalement
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* SECTION 2: SYNTHÈSE PAR SÉRIE ORIGINAL */}
      {activeTab === 'series' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSeries.map((series) => (
            <div
              key={series.id}
              className="bg-white rounded-xl border border-[#e2e8f0] shadow-2xs hover:shadow-xs transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-bold text-[#1e40af] uppercase tracking-wider">
                      {series.genre} • {series.season}
                    </div>
                    <h3 className="text-[16px] font-black text-[#0b1c30] mt-0.5">
                      {series.title}
                    </h3>
                  </div>
                  {getRiskBadge(series.riskLevel)}
                </div>

                <p className="text-[12px] text-[#64748b] leading-relaxed line-clamp-2">
                  {series.synopsis}
                </p>

                <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-[#0b1c30]">
                    <span className="text-[#64748b]">Canaux & Pages Réseaux :</span>
                    <span className="font-bold">{series.telegramChannelsCount} sources</span>
                  </div>
                  <div className="flex items-center justify-between text-[#0b1c30]">
                    <span className="text-[#64748b]">Cumul Vues Extraits Longs :</span>
                    <span className="font-mono font-bold text-red-600">{formatNumber(series.totalPirateViews)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#0b1c30]">
                    <span className="text-[#64748b]">Smartcards ID Identifiées :</span>
                    <span className="font-mono font-bold text-purple-700">{series.watermarkBreachesDetected} Cartes</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#f8fafc] border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-[#64748b] font-semibold">Conversions myCANAL :</div>
                  <div className="text-[14px] font-black text-emerald-700 font-mono">
                    +{formatNumber(series.conversionToMyCanalCount)}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedSeries(series)}
                  className="px-3 py-1.5 rounded-lg bg-[#0b1c30] text-white hover:bg-[#1e40af] text-[11px] font-bold transition-colors cursor-pointer"
                >
                  Fiche Série
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIGHTBOX SCREENSHOT ZOOM MODAL */}
      {zoomImg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-[#0b1c30] rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
            <button
              onClick={() => setZoomImg(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-2">
              <img src={zoomImg} alt="Capture Preuve Extraits" className="w-full max-h-[75vh] object-contain rounded-xl" />
            </div>
            <div className="p-4 bg-[#0b1c30] text-white border-t border-gray-800 text-center text-[12px]">
              Capture d'écran probante d'extrait long enregistrée avec horodatage.
            </div>
          </div>
        </div>
      )}

      {/* MODAL FICHE SIGNALEMENT COMPTE / PAGE (EXTRAITS LONGS) */}
      {selectedPage && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#cbd5e1] shadow-2xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{selectedPage.platformIcon}</span>
                  <h3 className="font-bold text-[16px] text-[#0b1c30]">{selectedPage.pageName}</h3>
                </div>
                <div className="text-[12px] text-purple-900 font-bold mt-0.5">
                  Diffusion : {selectedPage.seriesTitle} ({selectedPage.seasonEpisode})
                </div>
              </div>
              <button
                onClick={() => setSelectedPage(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-[12px]">
              <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] space-y-1">
                <span className="text-[10px] font-bold text-[#64748b] uppercase block">Type de Contenu Pirate :</span>
                <p className="text-[#0b1c30] font-bold">{selectedPage.excerptType} ({selectedPage.excerptDurationMinutes} min par vidéo)</p>
                <p className="text-[11px] text-[#64748b]">Compte actif au {selectedPage.country} ({formatNumber(selectedPage.followersCount)} abonnés)</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <span className="text-[10px] text-red-800 uppercase font-bold block">Vues Extraits Longs</span>
                  <span className="text-[18px] font-black text-red-700 font-mono">
                    {formatNumber(selectedPage.totalViews)}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                  <span className="text-[10px] text-purple-900 uppercase font-bold block">Watermark Smartcard</span>
                  <span className="text-[15px] font-black text-purple-900 font-mono">
                    {selectedPage.smartcardWatermarkId || 'Non Détecté'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  onShowToast(`Procédure Takedown transmise à la modération de ${selectedPage.platform}.`);
                  setSelectedPage(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-[12px] transition-colors cursor-pointer"
              >
                Exiger la Clôture du Compte
              </button>
              <button
                onClick={() => setSelectedPage(null)}
                className="py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[12px] transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FICHE DÉTAILLÉE DE PROTECTION SÉRIE */}
      {selectedSeries && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#cbd5e1] shadow-2xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <div className="text-[11px] font-bold text-purple-700 uppercase">
                  {selectedSeries.genre} • {selectedSeries.season}
                </div>
                <h3 className="font-black text-[18px] text-[#0b1c30]">{selectedSeries.title}</h3>
                <div className="text-[11px] text-[#64748b]">{selectedSeries.exclusivityWindow}</div>
              </div>
              <button
                onClick={() => setSelectedSeries(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-[12px]">
              <p className="text-[#334155] leading-relaxed">{selectedSeries.synopsis}</p>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                  <span className="text-[10px] text-purple-900 uppercase font-bold block">Smartcards Révoquées</span>
                  <span className="text-[18px] font-black text-purple-900 font-mono">
                    {selectedSeries.watermarkBreachesDetected} Cartes
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold block">Conversions myCANAL</span>
                  <span className="text-[18px] font-black text-emerald-700 font-mono">
                    +{formatNumber(selectedSeries.conversionToMyCanalCount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  onShowToast(`Ordre de suppression DMCA envoyé pour la série ${selectedSeries.title}.`);
                  setSelectedSeries(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#0b1c30] hover:bg-[#1e40af] text-white font-bold text-[12px] transition-colors cursor-pointer"
              >
                Takedown Massif DMCA
              </button>
              <button
                onClick={() => setSelectedSeries(null)}
                className="py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[12px] transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
