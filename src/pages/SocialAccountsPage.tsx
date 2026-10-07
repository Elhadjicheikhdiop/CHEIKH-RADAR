import React, { useState, useMemo } from 'react';
import { AccountItem, ThreatStatus } from '../types';
import {
  Share2,
  ExternalLink,
  Users,
  Radio,
  Globe,
  ZoomIn,
  Search,
  RotateCcw,
  SlidersHorizontal,
  LayoutGrid,
  List,
  AlertTriangle,
  FileDown,
  CheckCircle2,
  X,
  Lock,
  ShieldAlert,
} from 'lucide-react';

interface SocialAccountsPageProps {
  accounts: AccountItem[];
  onShowToast: (msg: string) => void;
}

export const SocialAccountsPage: React.FC<SocialAccountsPageProps> = ({
  accounts,
  onShowToast,
}) => {
  const [selectedAccModal, setSelectedAccModal] = useState<AccountItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | ThreatStatus>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedPlatform !== 'all') count++;
    if (selectedStatus !== 'all') count++;
    if (selectedCountry !== 'all') count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [selectedPlatform, selectedStatus, selectedCountry, searchQuery]);

  const resetFilters = () => {
    setSelectedPlatform('all');
    setSelectedStatus('all');
    setSelectedCountry('all');
    setSearchQuery('');
    onShowToast('Filtres des comptes réinitialisés');
  };

  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      // Platform
      if (selectedPlatform !== 'all' && !acc.platform.toLowerCase().includes(selectedPlatform.toLowerCase())) {
        return false;
      }

      // Status
      if (selectedStatus !== 'all' && acc.status !== selectedStatus) {
        return false;
      }

      // Country
      if (selectedCountry !== 'all' && !acc.country.toLowerCase().includes(selectedCountry.toLowerCase())) {
        return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          acc.name.toLowerCase().includes(q) ||
          acc.platform.toLowerCase().includes(q) ||
          acc.country.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [accounts, selectedPlatform, selectedStatus, selectedCountry, searchQuery]);

  return (
    <div className="flex flex-col w-full pb-8">
      {/* En-tête de page */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e2e8f0] mb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-bold tracking-tight text-[#0b1c30]">
              5. Comptes & Réseaux Sociaux
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#dbeafe] text-[#1e40af]">
              {filteredAccounts.length} sur {accounts.length} PROFILS
            </span>
          </div>
          <p className="text-[13px] text-[#64748b]">
            Comptes et canaux TikTok, Facebook, YouTube et Telegram diffusant illicitement
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

      {/* Barre de Filtres */}
      <div className="p-4 bg-white rounded-2xl border border-[#e2e8f0] shadow-xs mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
            Recherche compte / pseudo
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-[#64748b] w-4 h-4" />
            <input
              id="search-accounts"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par @pseudo, chaîne, pays..."
              className="w-full pl-9 pr-4 py-2 bg-[#f8fafc] rounded-lg text-[13px] text-[#0b1c30] placeholder:text-[#94a3b8] border border-[#e2e8f0] focus:outline-none focus:border-[#0b1c30] transition-all"
            />
          </div>
        </div>

        {/* Plateforme */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
            Réseau / Plateforme
          </label>
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="bg-[#f8fafc] border border-[#e2e8f0] text-[#0b1c30] text-[12px] rounded-lg p-2 focus:outline-none focus:border-[#0b1c30]"
          >
            <option value="all">Toutes plateformes</option>
            <option value="TikTok">TikTok</option>
            <option value="Facebook">Facebook</option>
            <option value="YouTube">YouTube</option>
            <option value="Telegram">Telegram</option>
            <option value="X">X (Twitter)</option>
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

      {/* Grille des comptes & réseaux */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAccounts.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl border border-[#e2e8f0] p-12 text-center text-[#64748b]">
              Aucun compte ne correspond à vos filtres.
            </div>
          ) : (
            filteredAccounts.map((acc) => (
              <div
                key={acc.id}
                id={`account-card-${acc.id}`}
                className="bg-white rounded-2xl border border-[#e2e8f0] shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-xs transition-all"
              >
                {/* Header */}
                <div className="p-5 pb-4">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#0b1c30] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {acc.platform.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-[16px] font-bold text-[#0b1c30]">
                            {acc.name}
                          </h2>
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#dbeafe] text-[#1e40af] border border-[#bfdbfe]">
                            {acc.platform}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[#64748b] mt-0.5">
                          <span>Abonnés : {acc.followers}</span>
                          <span>•</span>
                          <span>{acc.country}</span>
                        </div>
                      </div>
                    </div>

                    <a
                      id={`link-acc-${acc.id}`}
                      href={acc.accountUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0b1c30] text-[12px] font-semibold flex items-center gap-1.5 transition-colors border border-[#e2e8f0] cursor-pointer shrink-0"
                    >
                      <span>Lien compte</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Métadonnées */}
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#f8fafc] border border-[#f1f5f9] text-[12px]">
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#64748b] block mb-0.5">
                        Plateforme
                      </span>
                      <span className="text-[#0b1c30] font-medium block">
                        {acc.platform}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#64748b] block mb-0.5">
                        Date de détection
                      </span>
                      <span className="text-[#0b1c30] font-mono font-medium block">
                        {acc.detectionDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#64748b] block mb-0.5">
                        Portée estimée
                      </span>
                      <span className="text-[#dc2626] font-bold block">
                        {acc.estimatedAudience}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#64748b] block mb-0.5">
                        Monétisation suspectée
                      </span>
                      <span className="text-[#0b1c30] font-medium block">
                        {acc.monetizationMethod || 'Abonnements WhatsApp'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Capture */}
                <div className="px-5">
                  <div className="relative rounded-xl overflow-hidden border border-[#e2e8f0] bg-slate-100 group">
                    <img
                      src={acc.captureUrl}
                      alt={`Capture profil ${acc.name}`}
                      className="w-full h-44 object-cover object-top group-hover:scale-101 transition-transform duration-200"
                    />
                    <button
                      id={`zoom-acc-${acc.id}`}
                      onClick={() => setSelectedAccModal(acc)}
                      className="absolute bottom-2.5 right-2.5 bg-[#0b1c30]/90 backdrop-blur-xs text-white text-[11px] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md hover:bg-black transition-colors cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Aperçu</span>
                    </button>
                  </div>
                </div>

                {/* Publications liées */}
                <div className="p-5 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] block">
                      Publications et directs constatés
                    </span>
                    <button
                      onClick={() => setSelectedAccModal(acc)}
                      className="text-[11px] font-bold text-blue-700 hover:underline cursor-pointer"
                    >
                      Voir dossier
                    </button>
                  </div>

                  <div className="space-y-2">
                    {acc.linkedPosts.map((post) => (
                      <div
                        key={post.id}
                        id={`post-${post.id}`}
                        className="p-2.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-between gap-3 text-[12px]"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Radio className="w-3.5 h-3.5 text-[#dc2626] shrink-0" />
                          <span className="text-[#0b1c30] font-medium truncate">{post.title}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[11px] text-[#64748b] font-semibold">
                            {post.viewers}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              post.status === 'active'
                                ? 'bg-[#fee2e2] text-[#dc2626]'
                                : 'bg-[#f1f5f9] text-[#64748b]'
                            }`}
                          >
                            {post.status === 'active' ? 'En direct' : 'Terminé'}
                          </span>
                        </div>
                      </div>
                    ))}
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
                  <th className="py-3 px-4">Profil & Pseudo</th>
                  <th className="py-3 px-4">Plateforme</th>
                  <th className="py-3 px-4">Abonnés</th>
                  <th className="py-3 px-4">Portée estimée</th>
                  <th className="py-3 px-4">Pays / Filiale</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
                {filteredAccounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#0b1c30]">
                      <button
                        onClick={() => setSelectedAccModal(acc)}
                        className="text-left font-bold text-[#0b1c30] hover:underline cursor-pointer"
                      >
                        {acc.name}
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#0b1c30] text-xs font-semibold">
                        {acc.platform}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#64748b]">{acc.followers}</td>
                    <td className="py-3.5 px-4 text-red-600 font-semibold">{acc.estimatedAudience}</td>
                    <td className="py-3.5 px-4 text-[#0b1c30]">{acc.country}</td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => setSelectedAccModal(acc)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0b1c30] text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        Aperçu
                      </button>
                      <a
                        href={acc.accountUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#0b1c30] font-bold hover:underline"
                      >
                        <span>Ouvrir</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODALE DE PRÉVISUALISATION DÉTAILLÉE DU COMPTE SOCIAL AVEC SCROLLER DE HAUT EN BAS */}
      {selectedAccModal && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
          onClick={() => setSelectedAccModal(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200 shadow-xl overflow-hidden text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. EN-TÊTE FIXE */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-[14px]">
                  <Share2 className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">
                      Fiche d'Enquête Réseau Social & Stream Live
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {selectedAccModal.platform}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-700 border border-red-200">
                      Menace Active
                    </span>
                  </div>
                  <h3 className="text-[16px] font-bold text-slate-900 mt-0.5">
                    {selectedAccModal.name}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAccModal(null)}
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
                {selectedAccModal.country} • {selectedAccModal.platform}
              </span>
            </div>

            {/* 2. CORPS DÉFILABLE DE HAUT EN BAS (SCROLLER DÉDIÉ) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4 text-[12px]">
              {/* SYNTHÈSE EXPRESS */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                    Aperçu Flash • Métriques Réseau Social
                  </span>
                  <span className="text-[10.5px] font-mono text-slate-500">
                    Monétisation : {selectedAccModal.monetizationMethod || 'Abonnements WhatsApp'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="bg-white border border-slate-200/90 p-2.5 rounded-lg shadow-2xs">
                    <span className="text-[9.5px] text-slate-500 uppercase block font-semibold">Abonnés</span>
                    <span className="text-[15px] font-bold text-slate-900 font-mono block mt-0.5">{selectedAccModal.followers}</span>
                  </div>
                  <div className="bg-white border border-slate-200/90 p-2.5 rounded-lg shadow-2xs">
                    <span className="text-[9.5px] text-slate-500 uppercase block font-semibold">Portée Estimée</span>
                    <span className="text-[15px] font-bold text-slate-900 font-mono block mt-0.5">{selectedAccModal.estimatedAudience}</span>
                  </div>
                  <div className="bg-white border border-slate-200/90 p-2.5 rounded-lg shadow-2xs">
                    <span className="text-[9.5px] text-slate-500 uppercase block font-semibold">Territoire</span>
                    <span className="text-[13px] font-bold text-slate-900 truncate block mt-0.5">{selectedAccModal.country}</span>
                  </div>
                  <div className="bg-white border border-slate-200/90 p-2.5 rounded-lg shadow-2xs">
                    <span className="text-[9.5px] text-slate-500 uppercase block font-semibold">Directs</span>
                    <span className="text-[13px] font-bold text-slate-800 block mt-0.5">{selectedAccModal.linkedPosts.length} flux</span>
                  </div>
                </div>
              </div>

              {/* CAPTURE DU COMPTE ET PUBLICATIONS */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-600">
                    Capture d'Écran du Profil et Directs
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Scellement conforme ISO 27001
                  </span>
                </div>
                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center p-2 shadow-2xs">
                  <img
                    src={selectedAccModal.captureUrl}
                    alt={`Capture ${selectedAccModal.name}`}
                    className="w-full h-auto max-h-[420px] object-contain rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              {/* DIRECTS ET FLUX CONSTATÉS */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-600 block">
                  Historique des Streams Illégaux Signalés ({selectedAccModal.linkedPosts.length})
                </span>
                <div className="space-y-1.5">
                  {selectedAccModal.linkedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between gap-3 text-[11.5px]"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Radio className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                        <span className="font-semibold text-slate-900 truncate">{post.title}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-slate-600 font-mono text-[11px]">{post.viewers} spectateurs</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-medium uppercase ${post.status === 'active' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-600'}`}>
                          {post.status === 'active' ? 'En Direct' : 'Archivé'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* EMPREINTE ET PREUVE SCELLÉE */}
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 font-mono text-[11px] space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-1 font-sans font-medium">
                    <Lock className="w-3 h-3 text-slate-500" />
                    Signature de sécurité unique (infalsifiable)
                  </span>
                  <span className="text-slate-700 font-bold bg-slate-100 px-1.5 py-0.5 rounded">Vérifié</span>
                </div>
                <p className="text-slate-700 text-[10.5px] break-all select-all bg-slate-50 p-1.5 rounded border border-slate-100">
                  f731a982cb1048bca1940182fc092384a1e941f1981048bca1a7b8e1f0492cb412
                </p>
              </div>
            </div>

            {/* 3. PIED DE PAGE FIXE */}
            <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={selectedAccModal.accountUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                  <span>Accéder au compte</span>
                </a>
                <button
                  type="button"
                  onClick={() => onShowToast(`Signalement DMCA envoyé pour ${selectedAccModal.name}`)}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-slate-600" />
                  <span>Signaler la page</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAccModal(null)}
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
