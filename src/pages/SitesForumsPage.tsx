import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';

interface SitesForumsPageProps {
  sitesForums: SiteForumItem[];
  onShowToast: (msg: string) => void;
}

export const SitesForumsPage: React.FC<SitesForumsPageProps> = ({
  sitesForums,
  onShowToast,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'site' | 'forum'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | ThreatStatus>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomImg, setZoomImg] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

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
    return sitesForums.filter((item) => {
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
  }, [sitesForums, filterType, selectedStatus, selectedCountry, searchQuery]);

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

                    <button
                      id={`btn-signal-${item.id}`}
                      onClick={() => onShowToast(`Demande de blocage DNS/FAI initiée pour ${item.siteDomain}`)}
                      className="px-3.5 py-2 rounded-lg bg-[#0b1c30] hover:bg-[#1e293b] text-white text-[12px] font-bold shadow-2xs transition-colors shrink-0 cursor-pointer"
                    >
                      Demander le blocage FAI
                    </button>
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
                    <td className="py-3.5 px-4 text-[#64748b]">{item.hostingAsn || 'CDN Externe'}</td>
                    <td className="py-3.5 px-4 text-[#0b1c30] font-medium">{item.country}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onShowToast(`Blocage demandé pour ${item.siteDomain}`)}
                        className="px-3 py-1.5 rounded-lg bg-[#0b1c30] text-white text-[11px] font-bold hover:bg-[#1e293b] cursor-pointer"
                      >
                        Demander blocage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
