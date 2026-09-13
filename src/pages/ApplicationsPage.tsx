import React, { useState, useMemo } from 'react';
import { AppItem, ThreatStatus } from '../types';
import {
  Smartphone,
  ExternalLink,
  Search,
  Download,
  ZoomIn,
  SlidersHorizontal,
  RotateCcw,
  LayoutGrid,
  List,
  Globe,
  Filter,
} from 'lucide-react';

interface ApplicationsPageProps {
  applications: AppItem[];
  onShowToast: (msg: string) => void;
}

export const ApplicationsPage: React.FC<ApplicationsPageProps> = ({
  applications,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'all' | ThreatStatus>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedStatus !== 'all') count++;
    if (selectedCountry !== 'all') count++;
    if (selectedSource !== 'all') count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [selectedStatus, selectedCountry, selectedSource, searchQuery]);

  const resetFilters = () => {
    setSelectedStatus('all');
    setSelectedCountry('all');
    setSelectedSource('all');
    setSearchQuery('');
    onShowToast('Filtres des applications réinitialisés');
  };

  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      // Status
      if (selectedStatus !== 'all' && app.status !== selectedStatus) return false;

      // Country
      if (selectedCountry !== 'all' && !app.country.toLowerCase().includes(selectedCountry.toLowerCase())) {
        return false;
      }

      // Source
      if (selectedSource !== 'all') {
        if (!app.source.toLowerCase().includes(selectedSource.toLowerCase())) return false;
      }

      // Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          app.name.toLowerCase().includes(q) ||
          (app.version || '').toLowerCase().includes(q) ||
          app.source.toLowerCase().includes(q) ||
          app.packageId.toLowerCase().includes(q) ||
          app.country.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [applications, selectedStatus, selectedCountry, selectedSource, searchQuery]);

  const getStatusBadge = (status: AppItem['status']) => {
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
              4. Applications & Boîtiers IPTV
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#dbeafe] text-[#1e40af]">
              {filteredApps.length} sur {applications.length} DÉTECTÉES
            </span>
          </div>
          <p className="text-[13px] text-[#64748b]">
            Applications Android (APK), services Xtream et boîtiers pirates non autorisés
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
              id="search-applications"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, version, package..."
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

        {/* Territoire */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
            Territoire
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-[#f8fafc] border border-[#e2e8f0] text-[#0b1c30] text-[12px] rounded-lg p-2 focus:outline-none focus:border-[#0b1c30]"
          >
            <option value="all">Tous les territoires</option>
            <option value="Sénégal">Sénégal</option>
            <option value="Côte d'Ivoire">Côte d'Ivoire</option>
            <option value="Cameroun">Cameroun</option>
            <option value="Mali">Mali & Gabon</option>
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

      {/* 1. Affichage Grille de cartes */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredApps.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl border border-[#e2e8f0] p-12 text-center text-[#64748b]">
              Aucune application ne correspond à vos filtres.
            </div>
          ) : (
            filteredApps.map((app) => (
              <div
                key={app.id}
                id={`app-card-${app.id}`}
                className="bg-white rounded-2xl border border-[#e2e8f0] shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-xs transition-all"
              >
                {/* Header */}
                <div className="p-5 pb-4">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#eff5ff] border border-[#dbeafe] flex items-center justify-center shrink-0">
                        <Smartphone className="w-5 h-5 text-[#0b1c30]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-[16px] font-bold text-[#0b1c30] tracking-tight">
                            {app.name}
                          </h2>
                          {app.version ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#f1f5f9] text-[#0b1c30] border border-[#e2e8f0] font-semibold">
                              {app.version}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[11px] font-mono text-[#94a3b8] bg-[#f8fafc]">
                              v1.0
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-[#64748b]">
                          Package : {app.packageId}
                        </span>
                      </div>
                    </div>

                    {getStatusBadge(app.status)}
                  </div>

                  {/* Métadonnées */}
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#f8fafc] border border-[#f1f5f9] text-[12px]">
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#64748b] block mb-0.5">
                        Source de diffusion
                      </span>
                      <span className="text-[#0b1c30] font-medium block truncate" title={app.source}>
                        {app.source}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#64748b] block mb-0.5">
                        Date de détection
                      </span>
                      <span className="text-[#0b1c30] font-mono font-medium block">
                        {app.detectionDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#64748b] block mb-0.5">
                        Installations estimées
                      </span>
                      <span className="text-[#0b1c30] font-semibold block">
                        {app.downloadsCount || 'Non estimé'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#64748b] block mb-0.5">
                        Territoire ciblé
                      </span>
                      <span className="text-[#0b1c30] font-medium block">
                        {app.country}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Capture */}
                <div className="px-5">
                  <div className="relative rounded-xl overflow-hidden border border-[#e2e8f0] bg-[#0b1c30] group">
                    <img
                      src={app.captureUrl}
                      alt={`Capture de l'application ${app.name}`}
                      className="w-full h-44 object-cover object-top group-hover:scale-101 transition-transform duration-200"
                    />
                    <button
                      onClick={() => setZoomImage(app.captureUrl)}
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
                    {app.link ? (
                      <a
                        href={app.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[12px] font-mono text-[#1e40af] hover:text-[#0b1c30] truncate max-w-xs"
                      >
                        <span className="truncate">{app.link}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-[12px] text-[#94a3b8] italic">
                        Lien direct non communiqué
                      </span>
                    )}

                    <button
                      onClick={() => onShowToast(`Fiche technique d'enquête téléchargée pour ${app.name}`)}
                      className="px-3 py-1.5 rounded-lg bg-[#0b1c30] hover:bg-[#1e293b] text-white text-[12px] font-medium flex items-center gap-1.5 shadow-2xs transition-colors shrink-0 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Fiche d'investigation</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. Affichage Tableau compact */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                  <th className="py-3 px-4">Application & Package</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Territoire</th>
                  <th className="py-3 px-4">Installations</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#eff5ff] flex items-center justify-center shrink-0">
                          <Smartphone className="w-4 h-4 text-[#0b1c30]" />
                        </div>
                        <div>
                          <span className="font-bold text-[#0b1c30] block">
                            {app.name} {app.version && <span className="font-normal text-xs text-[#64748b]">({app.version})</span>}
                          </span>
                          <span className="text-[11px] font-mono text-[#94a3b8]">
                            {app.packageId}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#475569]">{app.source}</td>
                    <td className="py-3.5 px-4 text-[#0b1c30] font-medium">{app.country}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#0b1c30]">
                      {app.downloadsCount || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(app.status)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onShowToast(`Fiche téléchargée pour ${app.name}`)}
                        className="px-3 py-1.5 rounded-lg bg-[#0b1c30] text-white text-[11px] font-bold hover:bg-[#1e293b] cursor-pointer"
                      >
                        Télécharger
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Zoom */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-6"
          onClick={() => setZoomImage(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full p-4 border border-[#e2e8f0] shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] font-bold text-[#0b1c30]">
                Capture de l'application
              </span>
              <button
                onClick={() => setZoomImage(null)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 font-bold hover:text-black flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>
            <img
              src={zoomImage}
              alt="Zoom capture"
              className="w-full h-auto rounded-xl max-h-[75vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
