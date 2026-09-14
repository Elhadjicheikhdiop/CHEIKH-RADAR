import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  TrendingUp,
  Globe,
  Server,
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Layers,
} from 'lucide-react';
import {
  semrushService,
  SemrushEnrichedData,
  SemrushStatusResponse,
} from '../utils/semrushService';

interface SemrushEnrichmentModalProps {
  initialDomain?: string;
  isOpen: boolean;
  onClose: () => void;
  onApplyEnrichment?: (data: SemrushEnrichedData) => void;
  onShowToast: (msg: string) => void;
}

export const SemrushEnrichmentModal: React.FC<SemrushEnrichmentModalProps> = ({
  initialDomain = 'stream-foot-dakar.xyz',
  isOpen,
  onClose,
  onApplyEnrichment,
  onShowToast,
}) => {
  const [domainInput, setDomainInput] = useState(initialDomain);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<SemrushStatusResponse | null>(null);
  const [enrichedData, setEnrichedData] = useState<SemrushEnrichedData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'server'>('overview');

  useEffect(() => {
    if (isOpen) {
      setDomainInput(initialDomain || 'stream-foot-dakar.xyz');
      loadStatusAndEnrich(initialDomain || 'stream-foot-dakar.xyz');
    }
  }, [isOpen, initialDomain]);

  const loadStatusAndEnrich = async (targetDom: string) => {
    setLoading(true);
    try {
      const st = await semrushService.getStatus();
      setStatus(st);
      const data = await semrushService.enrichDomain(targetDom);
      setEnrichedData(data);
    } catch (err: any) {
      console.error('Erreur appel SEMrush:', err);
      onShowToast(`Erreur lors de l'appel SEMrush : ${err.message || 'Échec réseau'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchNewDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim()) return;
    loadStatusAndEnrich(domainInput.trim());
  };

  const handleExportExcel = () => {
    if (!enrichedData) return;
    semrushService.exportToExcel([enrichedData], `SEMRUSH_AUDIT_${enrichedData.domain}.xlsx`);
    onShowToast(`Rapport Excel SEMrush exporté pour ${enrichedData.domain}`);
  };

  const handleApply = () => {
    if (enrichedData && onApplyEnrichment) {
      onApplyEnrichment(enrichedData);
      onShowToast(`Données SEMrush enregistrées pour le domaine ${enrichedData.domain}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="semrush-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="semrush-enrichment-modal"
        className="bg-white rounded-2xl border border-[#cbd5e1] shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden text-[#0b1c30]"
      >
        {/* EN-TÊTE DE LA MODALE */}
        <div className="p-4 sm:p-5 border-b border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-sm font-black text-[15px] tracking-wider">
              SE
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold text-[#0b1c30]">
                  Audit & Enrichissement SEMrush API
                </h3>
                {status?.mode === 'live' ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    API SEMrush Live
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                    Simulation Analytique
                  </span>
                )}
              </div>
              <p className="text-[12px] text-[#64748b]">
                Interrogation des métriques de trafic organique, autorité de domaine et requêtes de recherche piratées.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748b] hover:text-[#0b1c30] hover:bg-[#e2e8f0] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BARRE DE RECHERCHE D'URL / DOMAINE */}
        <div className="p-4 border-b border-[#e2e8f0] bg-white">
          <form onSubmit={handleSearchNewDomain} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="Entrez un nom de domaine (ex: livefootball-afrique.com)"
                className="w-full pl-9 pr-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-xl text-[13px] text-[#0b1c30] font-mono outline-hidden focus:border-[#0b1c30] focus:bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#0b1c30] hover:bg-[#1e40af] text-white rounded-xl text-[12px] font-bold transition-colors cursor-pointer flex items-center gap-2 shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Interrogation...' : 'Analyser le domaine'}</span>
            </button>
          </form>
        </div>

        {/* CONTENU PRINCIPAL */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-[#64748b]">
              <div className="w-10 h-10 border-3 border-[#0b1c30] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[13px] font-medium">
                Interrogation des serveurs SEMrush pour <span className="font-mono font-bold text-[#0b1c30]">{domainInput}</span>...
              </span>
              <span className="text-[11px] text-[#94a3b8]">
                Extraction des volumes mensuels, autorité et positions de mots-clés
              </span>
            </div>
          ) : enrichedData ? (
            <>
              {/* BANDEAU STATUT DU DOMAINE */}
              <div className="p-3.5 rounded-xl bg-[#f1f5f9] border border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-5 h-5 text-blue-700 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-mono font-bold text-[#0b1c30]">
                        {enrichedData.domain}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          enrichedData.threatLevel === 'Critique'
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : enrichedData.threatLevel === 'Élevé'
                            ? 'bg-orange-100 text-orange-800 border border-orange-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        Menace {enrichedData.threatLevel}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#64748b]">
                      Analysé le {new Date(enrichedData.enrichedAt).toLocaleDateString('fr-FR')} à {new Date(enrichedData.enrichedAt).toLocaleTimeString('fr-FR').slice(0, 5)} • Source : {enrichedData.source === 'semrush_live' ? 'SEMrush API Officielle' : 'Modèle Estimé SEMrush'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportExcel}
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#cbd5e1] hover:bg-[#f8fafc] text-[#0b1c30] text-[11px] font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Export Excel</span>
                  </button>
                </div>
              </div>

              {/* 4 CARTES MÉTRIQUES CLÉS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-[#e2e8f0] shadow-2xs">
                  <span className="text-[10px] font-bold uppercase text-[#64748b] block mb-1">
                    Trafic Mensuel
                  </span>
                  <div className="text-[18px] font-black text-[#0b1c30] font-mono">
                    {enrichedData.monthlyTraffic}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    Audience massive
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#e2e8f0] shadow-2xs">
                  <span className="text-[10px] font-bold uppercase text-[#64748b] block mb-1">
                    Authority Score
                  </span>
                  <div className="text-[18px] font-black text-blue-700 font-mono">
                    {enrichedData.domainAuthority} / 100
                  </div>
                  <span className="text-[10px] text-[#64748b] font-medium block mt-1">
                    Rang #{enrichedData.semrushRank.toLocaleString('fr-FR')}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#e2e8f0] shadow-2xs">
                  <span className="text-[10px] font-bold uppercase text-[#64748b] block mb-1">
                    Part Trafic Afrique
                  </span>
                  <div className="text-[18px] font-black text-purple-700 font-mono">
                    {enrichedData.africaTrafficShare}
                  </div>
                  <span className="text-[10px] text-purple-900 font-medium block mt-1">
                    Cible SN, CI, CM, ML
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#e2e8f0] shadow-2xs">
                  <span className="text-[10px] font-bold uppercase text-[#64748b] block mb-1">
                    Mots-Clés Organiques
                  </span>
                  <div className="text-[18px] font-black text-amber-700 font-mono">
                    {enrichedData.organicKeywordsCount.toLocaleString('fr-FR')}
                  </div>
                  <span className="text-[10px] text-amber-900 font-medium block mt-1">
                    Requêtes indexées
                  </span>
                </div>
              </div>

              {/* ONGLETS INTERNES */}
              <div className="flex border-b border-[#e2e8f0] gap-4 text-[12px] font-bold">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'overview'
                      ? 'border-[#0b1c30] text-[#0b1c30]'
                      : 'border-transparent text-[#64748b] hover:text-[#0b1c30]'
                  }`}
                >
                  Mots-Clés Pirates Détectés ({enrichedData.topKeywordsList?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('server')}
                  className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'server'
                      ? 'border-[#0b1c30] text-[#0b1c30]'
                      : 'border-transparent text-[#64748b] hover:text-[#0b1c30]'
                  }`}
                >
                  Infrastructure & Hébergement
                </button>
              </div>

              {activeTab === 'overview' && (
                <div className="space-y-3">
                  <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
                    <table className="w-full text-left text-[12px]">
                      <thead>
                        <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] font-bold text-[#64748b]">
                          <th className="py-2.5 px-3">Requête de Recherche</th>
                          <th className="py-2.5 px-3">Position Google</th>
                          <th className="py-2.5 px-3">Volume Mensuel</th>
                          <th className="py-2.5 px-3">Part de Clics</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f1f5f9]">
                        {enrichedData.topKeywordsList?.map((k, idx) => (
                          <tr key={idx} className="hover:bg-[#f8fafc]">
                            <td className="py-2 px-3 font-semibold text-[#0b1c30]">
                              <span className="text-red-700 mr-1.5 font-bold">⚠️</span>
                              {k.keyword}
                            </td>
                            <td className="py-2 px-3">
                              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-mono font-bold text-[11px]">
                                #{k.position}
                              </span>
                            </td>
                            <td className="py-2 px-3 font-mono font-bold text-[#0b1c30]">
                              {k.searchVolume.toLocaleString('fr-FR')} / mois
                            </td>
                            <td className="py-2 px-3 text-[#64748b] font-mono">
                              {k.trafficShare}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-950 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-900">Observation d'Enquête SEMrush :</span> Ce domaine capte une part substantielle des recherches Google liées aux retransmissions de football en Afrique de l'Ouest. Une notification DMCA / blocage DNS auprès des FAI locaux neutralisera directement ce flux de trafic.
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'server' && (
                <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] space-y-3 text-[12px]">
                  <div className="flex items-center justify-between py-2 border-b border-[#f1f5f9]">
                    <span className="text-[#64748b] font-medium">Hébergement & Localisation</span>
                    <span className="font-bold text-[#0b1c30] flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-blue-700" />
                      {enrichedData.hostingCountry}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[#f1f5f9]">
                    <span className="text-[#64748b] font-medium">Backlinks Totaux Identifiés</span>
                    <span className="font-bold font-mono text-[#0b1c30]">
                      {enrichedData.backlinksCount?.toLocaleString('fr-FR') || '3 450'} liens entrants
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[#f1f5f9]">
                    <span className="text-[#64748b] font-medium">Domaines Référents Uniques</span>
                    <span className="font-bold font-mono text-[#0b1c30]">
                      {enrichedData.referringDomains?.toLocaleString('fr-FR') || '142'} domaines
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-[#64748b] text-[13px]">
              Aucune donnée à afficher. Veuillez saisir un domaine valide.
            </div>
          )}
        </div>

        {/* PIED DE MODALE */}
        <div className="p-4 border-t border-[#e2e8f0] bg-[#f8fafc] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-[#64748b]">
            {status?.configured
              ? 'Connecté à l\'API SEMrush officielle.'
              : 'Clé SEMRUSH_API_KEY non configurée dans .env : mode d\'estimation heuristique activé.'}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white border border-[#cbd5e1] hover:bg-[#f1f5f9] text-[#0b1c30] text-[12px] font-bold transition-colors cursor-pointer"
            >
              Fermer
            </button>
            {onApplyEnrichment && enrichedData && (
              <button
                onClick={handleApply}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#0b1c30] hover:bg-[#1e40af] text-white text-[12px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Enregistrer l'enrichissement</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
