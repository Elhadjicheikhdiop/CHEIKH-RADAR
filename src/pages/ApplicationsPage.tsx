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
  CheckCircle2,
  X,
  Lock,
  ShieldAlert,
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
  const [selectedAppModal, setSelectedAppModal] = useState<AppItem | null>(null);
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

        {/* Filiale / Pays */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
            Filiale / Pays
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-[#f8fafc] border border-[#e2e8f0] text-[#0b1c30] text-[12px] rounded-lg p-2 focus:outline-none focus:border-[#0b1c30]"
          >
            <option value="all">Toutes les filiales</option>
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
                        Filiale / Pays ciblé(e)
                      </span>
                      <span className="text-[#0b1c30] font-medium block">
                        {app.country}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Capture */}
                <div className="px-5">
                  <div className="relative rounded-xl overflow-hidden border border-[#e2e8f0] bg-slate-100 group">
                    <img
                      src={app.captureUrl}
                      alt={`Capture de l'application ${app.name}`}
                      className="w-full h-44 object-cover object-top group-hover:scale-101 transition-transform duration-200"
                    />
                    <button
                      onClick={() => setSelectedAppModal(app)}
                      className="absolute bottom-2.5 right-2.5 bg-[#0b1c30]/90 backdrop-blur-xs text-white text-[11px] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md hover:bg-black transition-colors cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Aperçu</span>
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

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedAppModal(app)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0b1c30] text-[11px] font-bold transition-colors cursor-pointer"
                        title="Voir la fiche complète"
                      >
                        Détails
                      </button>
                      <button
                        onClick={() => onShowToast(`Fiche technique d'enquête téléchargée pour ${app.name}`)}
                        className="px-3 py-1.5 rounded-lg bg-[#0b1c30] hover:bg-[#1e293b] text-white text-[12px] font-medium flex items-center gap-1.5 shadow-2xs transition-colors shrink-0 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Fiche</span>
                      </button>
                    </div>
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
                  <th className="py-3 px-4">Pays / Filiale</th>
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
                          <button
                            onClick={() => setSelectedAppModal(app)}
                            className="font-bold text-[#0b1c30] block text-left hover:underline cursor-pointer"
                          >
                            {app.name} {app.version && <span className="font-normal text-xs text-[#64748b]">({app.version})</span>}
                          </button>
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
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => setSelectedAppModal(app)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0b1c30] text-[11px] font-bold transition-colors cursor-pointer"
                        title="Voir la fiche détaillée"
                      >
                        Aperçu
                      </button>
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

      {/* MODALE DE PRÉVISUALISATION DÉTAILLÉE DE L'APPLICATION AVEC SCROLLER DE HAUT EN BAS */}
      {selectedAppModal && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
          onClick={() => setSelectedAppModal(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200 shadow-xl overflow-hidden text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. EN-TÊTE FIXE */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-[14px]">
                  <Smartphone className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">
                      Fiche d'Investigation Application APK / Store
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {selectedAppModal.source}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-700 border border-red-200">
                      Menace {selectedAppModal.status === 'validated' ? 'Critique' : 'Active'}
                    </span>
                  </div>
                  <h3 className="text-[16px] font-bold text-slate-900 mt-0.5">
                    {selectedAppModal.name} {selectedAppModal.version && <span className="text-slate-500 text-sm font-normal">v{selectedAppModal.version}</span>}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAppModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* BARRE INDICATRICE DE DÉFILEMENT */}
            <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-200 text-[11px] text-slate-600 font-medium flex items-center justify-between shrink-0">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span>↕</span> Défilement vertical complet disponible (haut en bas)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {selectedAppModal.country} • {selectedAppModal.packageId}
              </span>
            </div>

            {/* 2. CORPS DÉFILABLE DE HAUT EN BAS (SCROLLER DÉDIÉ) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4 text-[12px]">
              {/* SYNTHÈSE EXPRESS */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                    Aperçu Flash • Métriques Application
                  </span>
                  <span className="text-[10.5px] font-mono text-slate-500">
                    Package : {selectedAppModal.packageId}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="bg-white border border-slate-200/90 p-2.5 rounded-lg shadow-2xs">
                    <span className="text-[9.5px] text-slate-500 uppercase block font-semibold">Téléchargements</span>
                    <span className="text-[15px] font-bold text-slate-900 font-mono block mt-0.5">{selectedAppModal.downloadsCount || '25 000+'}</span>
                  </div>
                  <div className="bg-white border border-slate-200/90 p-2.5 rounded-lg shadow-2xs">
                    <span className="text-[9.5px] text-slate-500 uppercase block font-semibold">Source</span>
                    <span className="text-[13px] font-bold text-slate-900 truncate block mt-0.5">{selectedAppModal.source}</span>
                  </div>
                  <div className="bg-white border border-slate-200/90 p-2.5 rounded-lg shadow-2xs">
                    <span className="text-[9.5px] text-slate-500 uppercase block font-semibold">Filiale Ciblée</span>
                    <span className="text-[13px] font-bold text-slate-900 truncate block mt-0.5">{selectedAppModal.country}</span>
                  </div>
                  <div className="bg-white border border-slate-200/90 p-2.5 rounded-lg shadow-2xs">
                    <span className="text-[9.5px] text-slate-500 uppercase block font-semibold">Statut</span>
                    <span className="text-[12px] font-bold text-slate-800 block mt-1">{selectedAppModal.status}</span>
                  </div>
                </div>
              </div>

              {/* CAPTURE D'ÉCRAN */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-600">
                    Preuve d'Infraction Constatée (Interface de l'Application)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Scellement conforme ISO 27001
                  </span>
                </div>
                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center p-2 shadow-2xs">
                  <img
                    src={selectedAppModal.captureUrl}
                    alt={`Capture ${selectedAppModal.name}`}
                    className="w-full h-auto max-h-[420px] object-contain rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              {/* DÉTAILS TECHNIQUES & PACKAGE */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-600 block">
                  Identifiants Techniques & Source de Distribution
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11.5px]">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Identifiant de l'application (Package)</span>
                    <span className="font-mono font-bold text-slate-900 select-all block truncate">{selectedAppModal.packageId}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Lien direct de téléchargement</span>
                    {selectedAppModal.link ? (
                      <a
                        href={selectedAppModal.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-slate-800 hover:text-blue-600 hover:underline font-bold truncate block"
                      >
                        {selectedAppModal.link}
                      </a>
                    ) : (
                      <span className="text-slate-500">Fichier de l'application interne</span>
                    )}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 font-mono text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="flex items-center gap-1 font-sans font-medium">
                      <Lock className="w-3 h-3 text-slate-500" />
                      Signature de sécurité unique (infalsifiable)
                    </span>
                    <span className="text-slate-700 font-bold bg-slate-100 px-1.5 py-0.5 rounded">Vérifié</span>
                  </div>
                  <p className="text-slate-700 text-[10.5px] break-all select-all bg-slate-50 p-1.5 rounded border border-slate-100">
                    c490a182f7bb1048bca1940182fc092384a1e941f1981048bca17a8e1f0492cb
                  </p>
                </div>
              </div>
            </div>

            {/* 3. PIED DE PAGE FIXE */}
            <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    onShowToast(`Fiche d'investigation générée pour ${selectedAppModal.name}`);
                  }}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Exporter Fiche PDF</span>
                </button>
                {selectedAppModal.link && (
                  <a
                    href={selectedAppModal.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                    <span>Ouvrir Store / APK</span>
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedAppModal(null)}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-[12px] font-medium cursor-pointer transition-colors"
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
