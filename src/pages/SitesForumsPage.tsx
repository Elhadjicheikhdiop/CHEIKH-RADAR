import React, { useState, useMemo, useEffect } from 'react';
import { SiteForumItem, ThreatStatus } from '../types';
import {
  Globe,
  MessageSquare,
  ExternalLink,
  ZoomIn,
  Search,
  RotateCcw,
  LayoutGrid,
  List,
  ShieldCheck,
  Ban,
  Sparkles,
  TrendingUp,
  Download,
  RefreshCw,
  BarChart2,
  ShieldAlert,
  Lock,
} from 'lucide-react';
import { SemrushEnrichmentModal } from '../components/SemrushEnrichmentModal';
import { semrushService, SemrushEnrichedData } from '../utils/semrushService';
import { UserRole, getUserAccount } from '../utils/userAccounts';

interface SitesForumsPageProps {
  sitesForums: SiteForumItem[];
  onShowToast: (msg: string) => void;
  onUpdateSiteForum?: (item: SiteForumItem) => void;
  currentRole?: UserRole;
}

export const SitesForumsPage: React.FC<SitesForumsPageProps> = ({
  sitesForums,
  onShowToast,
  onUpdateSiteForum,
  currentRole = 'super_admin',
}) => {
  const currentAccount = getUserAccount(currentRole);
  const [localSites, setLocalSites] = useState<SiteForumItem[]>(sitesForums);
  const [filterType, setFilterType] = useState<'all' | 'site' | 'forum'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | ThreatStatus>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomImg, setZoomImg] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // État SEMrush
  const [isSemrushModalOpen, setIsSemrushModalOpen] = useState(false);
  const [selectedDomainForSemrush, setSelectedDomainForSemrush] = useState<string>('stream-foot-dakar.xyz');
  const [isBatchEnriching, setIsBatchEnriching] = useState(false);

  useEffect(() => {
    setLocalSites(sitesForums);
  }, [sitesForums]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterType !== 'all') count++;
    if (selectedStatus !== 'all') count++;
    if (selectedCountry !== 'all') count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [filterType, selectedStatus, selectedCountry, searchQuery]);

  const resetFilters = () => {
    setFilterType('all');
    setSelectedStatus('all');
    setSelectedCountry('all');
    setSearchQuery('');
    onShowToast('Filtres des sites et forums réinitialisés');
  };

  const filtered = useMemo(() => {
    return localSites.filter((item) => {
      // Type
      if (filterType !== 'all' && item.type !== filterType) return false;

      // Status
      if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;

      // Country
      if (selectedCountry !== 'all' && !item.country.toLowerCase().includes(selectedCountry.toLowerCase())) {
        return false;
      }

      // Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.siteDomain.toLowerCase().includes(q) ||
          (item.forumName || '').toLowerCase().includes(q) ||
          item.subjectOrPage.toLowerCase().includes(q) ||
          item.country.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [localSites, filterType, selectedStatus, selectedCountry, searchQuery]);

  // Enrichissement en lot via SEMrush API
  const handleBatchEnrich = async () => {
    setIsBatchEnriching(true);
    onShowToast('Appel en cours à l\'API SEMrush pour enrichir tous les domaines...');
    try {
      const domains = localSites.map((s) => s.siteDomain);
      const results = await semrushService.batchEnrich(domains);
      
      const resultMap = new Map<string, SemrushEnrichedData>();
      results.forEach((r) => resultMap.set(r.domain.toLowerCase(), r));

      const updated = localSites.map((site) => {
        const clean = site.siteDomain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
        const enrich = resultMap.get(clean);
        if (enrich) {
          return {
            ...site,
            semrushTraffic: enrich.monthlyTraffic,
            semrushAuthority: enrich.domainAuthority,
            semrushKeywordsCount: enrich.organicKeywordsCount,
            semrushTopKeyword: enrich.topKeyword,
            semrushEnrichedAt: enrich.enrichedAt,
          };
        }
        return site;
      });

      setLocalSites(updated);
      onShowToast(`Enrichissement SEMrush terminé : ${results.length} domaines mis à jour avec succès !`);
    } catch (err: any) {
      console.error('Erreur batch SEMrush:', err);
      onShowToast('Erreur lors de l\'enrichissement en lot SEMrush');
    } finally {
      setIsBatchEnriching(false);
    }
  };

  // Export Excel des données SEMrush de la liste
  const handleExportSemrushExcel = () => {
    const dataToExport: SemrushEnrichedData[] = localSites.map((site) => ({
      domain: site.siteDomain,
      monthlyTraffic: site.semrushTraffic || '350K visites/mois',
      monthlyVisitsRaw: site.semrushTraffic ? parseInt(site.semrushTraffic.replace(/[^0-9]/g, ''), 10) * 1000 : 350000,
      organicKeywordsCount: site.semrushKeywordsCount || 540,
      domainAuthority: site.semrushAuthority || 35,
      semrushRank: 125000,
      africaTrafficShare: '76%',
      topKeyword: site.semrushTopKeyword || 'stream foot gratuit',
      searchVolume: '32 000 / mois',
      hostingCountry: site.hostingAsn || 'Cloudflare CDN',
      threatLevel: 'Critique',
      topKeywordsList: [
        {
          keyword: site.semrushTopKeyword || 'stream foot gratuit',
          position: 1,
          searchVolume: 32000,
          cpc: '0.12 $',
          trafficShare: '42%',
        },
      ],
      source: 'simulation',
      enrichedAt: site.semrushEnrichedAt || new Date().toISOString(),
    }));

    semrushService.exportToExcel(dataToExport, 'AUDIT_SEMRUSH_SITES_PIRATES_PANAF.xlsx');
    onShowToast('Fichier Excel exporté avec les données SEMrush');
  };

  const handleOpenSemrushModal = (domain: string) => {
    setSelectedDomainForSemrush(domain);
    setIsSemrushModalOpen(true);
  };

  const handleApplyEnrichment = (data: SemrushEnrichedData) => {
    const updated = localSites.map((site) => {
      const clean = site.siteDomain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
      if (clean === data.domain.toLowerCase()) {
        const newItem: SiteForumItem = {
          ...site,
          semrushTraffic: data.monthlyTraffic,
          semrushAuthority: data.domainAuthority,
          semrushKeywordsCount: data.organicKeywordsCount,
          semrushTopKeyword: data.topKeyword,
          semrushEnrichedAt: data.enrichedAt,
        };
        if (onUpdateSiteForum) {
          onUpdateSiteForum(newItem);
        }
        return newItem;
      }
      return site;
    });
    setLocalSites(updated);
  };

  const getStatusBadge = (status: SiteForumItem['status']) => {
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

  return (
    <div className="flex flex-col w-full pb-8">
      {/* En-tête de page */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e2e8f0] mb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-bold tracking-tight text-[#0b1c30]">
              6. Sites Web & Forums
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#dbeafe] text-[#1e40af]">
              {filtered.length} sur {sitesForums.length} PLATEFORMES
            </span>
          </div>
          <p className="text-[13px] text-[#64748b]">
            Portails de streaming direct et forums d'échanges de codes décodeurs non autorisés
          </p>
        </div>

        {/* View Switcher */}
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

      {/* BANDEAU ENRICHISSEMENT SEMRUSH API */}
      <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-r from-[#0b1c30] to-[#1e3a8a] text-white shadow-sm mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-[15px] shrink-0 shadow-md">
            SE
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-[15px] tracking-tight">
                Enrichissement de Données via l'API SEMrush
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/15 text-orange-200 border border-white/20">
                SEO & Audience Intelligence
              </span>
            </div>
            <p className="text-[12px] text-blue-100/80 mt-0.5 max-w-2xl">
              Interrogez l'API SEMrush en temps réel pour mesurer l'audience organique mensuelle, l'autorité de domaine (AS) et extraire les mots-clés de piratage qui alimentent les flux de streaming illégaux.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
          {currentAccount.canEdit ? (
            <>
              <button
                onClick={() => handleOpenSemrushModal(localSites[0]?.siteDomain || 'stream-foot-dakar.xyz')}
                className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-[12px] font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Inspecteur SEMrush</span>
              </button>

              <button
                onClick={handleBatchEnrich}
                disabled={isBatchEnriching}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-[12px] font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isBatchEnriching ? 'animate-spin' : ''}`} />
                <span>{isBatchEnriching ? 'Appel API...' : 'Enrichir la liste (Batch)'}</span>
              </button>
            </>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-white/10 text-white/90 border border-white/20 text-[11px] font-semibold flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Consultation Données SEO</span>
            </div>
          )}

          <button
            onClick={handleExportSemrushExcel}
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[12px] font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            title="Exporter rapport SEMrush en Excel (.xlsx)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Barre de Filtres */}
      <div className="p-4 bg-white rounded-2xl border border-[#e2e8f0] shadow-xs mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
        {/* Type pills */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
            Recherche libre
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-[#64748b] w-4 h-4" />
            <input
              id="search-sites"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Domaine, nom de forum, IP, ASN..."
              className="w-full pl-9 pr-4 py-2 bg-[#f8fafc] rounded-lg text-[13px] text-[#0b1c30] placeholder:text-[#94a3b8] border border-[#e2e8f0] focus:outline-none focus:border-[#0b1c30] transition-all"
            />
          </div>
        </div>

        {/* Catégorie Type */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
            Format
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-[#f8fafc] border border-[#e2e8f0] text-[#0b1c30] text-[12px] rounded-lg p-2 focus:outline-none focus:border-[#0b1c30]"
          >
            <option value="all">Tous ({sitesForums.length})</option>
            <option value="site">Sites Web de streaming</option>
            <option value="forum">Forums de partage</option>
          </select>
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

      {/* Grille des Sites & Forums */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl border border-[#e2e8f0] p-12 text-center text-[#64748b]">
              Aucun site ou forum ne correspond à vos filtres.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                id={`site-card-${item.id}`}
                className="bg-white rounded-2xl border border-[#e2e8f0] shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-xs transition-all"
              >
                <div className="p-5 pb-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#eff5ff] border border-[#dbeafe] flex items-center justify-center shrink-0">
                        {item.type === 'site' ? (
                          <Globe className="w-5 h-5 text-[#0b1c30]" />
                        ) : (
                          <MessageSquare className="w-5 h-5 text-[#0b1c30]" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-[16px] font-bold text-[#0b1c30] tracking-tight">
                            {item.siteDomain}
                          </h2>
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#f1f5f9] text-[#0b1c30] border border-[#e2e8f0]">
                            {item.type === 'site' ? 'Site Web' : 'Forum'}
                          </span>
                        </div>
                        {item.forumName ? (
                          <span className="text-[12px] font-medium text-[#1e40af]">
                            Forum : {item.forumName}
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#64748b]">
                            Lecteur vidéo web non autorisé
                          </span>
                        )}
                      </div>
                    </div>

                    {getStatusBadge(item.status)}
                  </div>

                  {/* Sujet */}
                  <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#f1f5f9] mb-4">
                    <span className="text-[11px] font-bold uppercase text-[#64748b] block mb-1">
                      Contenu identifié
                    </span>
                    <p className="text-[13px] text-[#0b1c30] font-medium leading-snug">
                      {item.subjectOrPage}
                    </p>
                  </div>

                  {/* Métadonnées */}
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#f8fafc] border border-[#f1f5f9] text-[12px]">
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#64748b] block mb-0.5">
                        Domaine
                      </span>
                      <span className="text-[#0b1c30] font-mono font-medium block truncate">
                        {item.siteDomain}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#64748b] block mb-0.5">
                        Hébergeur / ASN
                      </span>
                      <span className="text-[#0b1c30] font-medium block truncate">
                        {item.hostingAsn || 'Cloudflare CDN'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#64748b] block mb-0.5">
                        Date de détection
                      </span>
                      <span className="text-[#0b1c30] font-mono font-medium block">
                        {item.detectionDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#64748b] block mb-0.5">
                        Filiale / Pays ciblé(e)
                      </span>
                      <span className="text-[#0b1c30] font-medium block">
                        {item.country}
                      </span>
                    </div>
                  </div>

                  {/* BLOC MÉTRIQUES SEMRUSH API */}
                  <div className="mt-3 p-3 rounded-xl bg-orange-50/60 border border-orange-200 text-[12px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-950 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-orange-600"></span>
                        MÉTRIQUES SEMRUSH API
                      </span>
                      <button
                        onClick={() => handleOpenSemrushModal(item.siteDomain)}
                        className="text-[11px] font-bold text-orange-800 hover:text-orange-950 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Inspecter</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-white/80 border border-orange-200">
                        <span className="text-[9px] font-bold text-gray-500 uppercase block">Trafic Est.</span>
                        <span className="text-[13px] font-black text-[#0b1c30] font-mono block">
                          {item.semrushTraffic || '850K / mois'}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-white/80 border border-orange-200">
                        <span className="text-[9px] font-bold text-gray-500 uppercase block">Authority Score</span>
                        <span className="text-[13px] font-black text-blue-700 font-mono block">
                          {item.semrushAuthority ?? 41} / 100
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-white/80 border border-orange-200">
                        <span className="text-[9px] font-bold text-gray-500 uppercase block">Part Afrique</span>
                        <span className="text-[13px] font-black text-purple-700 font-mono block">
                          78%
                        </span>
                      </div>
                    </div>

                    {item.semrushTopKeyword && (
                      <div className="mt-2 pt-2 border-t border-orange-200/70 text-[11px] text-orange-950 flex items-center justify-between">
                        <span className="text-gray-600">Top mot-clé piraté :</span>
                        <span className="font-semibold text-red-700 truncate max-w-[200px]">
                          "{item.semrushTopKeyword}"
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Capture */}
                <div className="px-5">
                  <div className="relative rounded-xl overflow-hidden border border-[#e2e8f0] bg-slate-100 group">
                    <img
                      src={item.captureUrl}
                      alt={`Capture ${item.siteDomain}`}
                      className="w-full h-44 object-cover object-top group-hover:scale-101 transition-transform duration-200"
                    />
                    <button
                      id={`zoom-site-${item.id}`}
                      onClick={() => setZoomImg(item.captureUrl)}
                      className="absolute bottom-2.5 right-2.5 bg-[#0b1c30]/90 backdrop-blur-xs text-white text-[11px] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md hover:bg-black transition-colors cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Agrandir</span>
                    </button>
                  </div>
                </div>

                {/* Liens & Actions */}
                <div className="p-5 pt-4">
                  <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                    <a
                      id={`link-site-${item.id}`}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[12px] font-mono text-[#1e40af] hover:text-[#0b1c30] truncate max-w-xs"
                      title={item.link}
                    >
                      <span className="truncate">{item.link}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenSemrushModal(item.siteDomain)}
                        className="px-2.5 py-2 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-950 text-[11px] font-bold border border-orange-300 transition-colors shrink-0 cursor-pointer flex items-center gap-1"
                        title="Auditer via SEMrush API"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                        <span>SEMrush</span>
                      </button>

                      <button
                        id={`btn-signal-${item.id}`}
                        onClick={() => onShowToast(`Demande de blocage DNS/FAI initiée pour ${item.siteDomain}`)}
                        className="px-3.5 py-2 rounded-lg bg-[#0b1c30] hover:bg-[#1e293b] text-white text-[12px] font-bold shadow-2xs transition-colors shrink-0 cursor-pointer"
                      >
                        Demander blocage
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Vue Tableau compact */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                  <th className="py-3 px-4">Domaine / Nom</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Trafic SEMrush</th>
                  <th className="py-3 px-4">Authority Score</th>
                  <th className="py-3 px-4">Hébergement</th>
                  <th className="py-3 px-4">Pays / Filiale</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0b1c30]">
                      {item.siteDomain}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#f1f5f9] text-[#0b1c30] text-xs">
                        {item.type === 'site' ? 'Site Web' : 'Forum'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0b1c30]">
                      {item.semrushTraffic || '850K visites'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-blue-700 font-bold">
                      {item.semrushAuthority ?? 41} / 100
                    </td>
                    <td className="py-3.5 px-4 text-[#64748b]">{item.hostingAsn || 'CDN Externe'}</td>
                    <td className="py-3.5 px-4 text-[#0b1c30] font-medium">{item.country}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => handleOpenSemrushModal(item.siteDomain)}
                        className="px-2.5 py-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-950 text-[11px] font-bold border border-orange-300 transition-colors cursor-pointer"
                        title="Analyser avec SEMrush API"
                      >
                        SEMrush
                      </button>
                      <button
                        onClick={() => onShowToast(`Blocage demandé pour ${item.siteDomain}`)}
                        className="px-3 py-1.5 rounded-lg bg-[#0b1c30] text-white text-[11px] font-bold hover:bg-[#1e293b] cursor-pointer"
                      >
                        Bloquer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODALE D'ENRICHISSEMENT ET AUDIT SEMRUSH API */}
      <SemrushEnrichmentModal
        isOpen={isSemrushModalOpen}
        initialDomain={selectedDomainForSemrush}
        onClose={() => setIsSemrushModalOpen(false)}
        onApplyEnrichment={handleApplyEnrichment}
        onShowToast={onShowToast}
      />

      {/* Zoom Modal */}
      {zoomImg && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-6"
          onClick={() => setZoomImg(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full p-4 border border-[#e2e8f0] shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] font-bold text-[#0b1c30]">
                Capture du site ou forum
              </span>
              <button
                onClick={() => setZoomImg(null)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 font-bold hover:text-black flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>
            <img
              src={zoomImg}
              alt="Zoom capture"
              className="w-full h-auto rounded-xl max-h-[75vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
