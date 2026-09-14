import React from 'react';
import {
  Globe,
  TrendingUp,
  ShieldAlert,
  Download,
  ExternalLink,
  Sparkles,
  ArrowRight,
  BarChart3,
  Search,
  Zap,
} from 'lucide-react';
import { SiteForumItem } from '../types';
import { semrushService, SemrushEnrichedData } from '../utils/semrushService';

interface SemrushOverviewMetricsProps {
  sitesForums?: SiteForumItem[];
  onNavigateToImport?: () => void;
  onShowToast?: (msg: string) => void;
}

export const SemrushOverviewMetrics: React.FC<SemrushOverviewMetricsProps> = ({
  sitesForums = [],
  onNavigateToImport,
  onShowToast,
}) => {
  // Liste de données SEMrush
  const semrushItems = sitesForums.filter((s) => s.semrushTraffic || s.type === 'site');

  // Top requêtes pirates captées
  const topKeywordsList = [
    {
      keyword: 'cheikh sport direct streaming',
      volume: '32 000 / mois',
      position: '#1',
      trafficShare: '42%',
      cpc: '0.12 $',
      target: 'Flux Sport 1 & Matchs Live',
    },
    {
      keyword: 'match direct afrique gratuit hd',
      volume: '24 500 / mois',
      position: '#2',
      trafficShare: '35%',
      cpc: '0.09 $',
      target: 'Éliminatoires & Coupes continentales',
    },
    {
      keyword: 'serveur iptv m3u dakar abidjan 2026',
      volume: '18 200 / mois',
      position: '#1',
      trafficShare: '28%',
      cpc: '0.15 $',
      target: 'Listes IPTV Xtream & m3u',
    },
    {
      keyword: 'regarder chaine sport direct afrique live',
      volume: '41 000 / mois',
      position: '#3',
      trafficShare: '22%',
      cpc: '0.08 $',
      target: 'Portails web streaming direct',
    },
    {
      keyword: 'code decodage satellite oscam panaf',
      volume: '11 800 / mois',
      position: '#1',
      trafficShare: '19%',
      cpc: '0.18 $',
      target: 'Partage de clés sur forums',
    },
  ];

  const handleExportSemrush = () => {
    const dataToExport: SemrushEnrichedData[] = semrushItems.map((s) => ({
      domain: s.siteDomain,
      monthlyTraffic: s.semrushTraffic || '450K visites/mois',
      monthlyVisitsRaw: s.semrushTraffic
        ? parseInt(s.semrushTraffic.replace(/[^0-9]/g, ''), 10) * 1000
        : 450000,
      organicKeywordsCount: s.semrushKeywordsCount || 540,
      domainAuthority: s.semrushAuthority || 38,
      semrushRank: 115000,
      africaTrafficShare: '78%',
      topKeyword: s.semrushTopKeyword || 'cheikh sport direct',
      searchVolume: '32 000 / mois',
      hostingCountry: s.hostingAsn || 'Cloudflare CDN',
      threatLevel: 'Critique',
      topKeywordsList: [
        {
          keyword: s.semrushTopKeyword || 'cheikh sport streaming',
          position: 1,
          searchVolume: 32000,
          cpc: '0.12 $',
          trafficShare: '42%',
        },
      ],
      source: 'simulation',
      enrichedAt: s.semrushEnrichedAt || new Date().toISOString(),
    }));

    semrushService.exportToExcel(dataToExport, 'METRIQUES_SEMRUSH_PIRATAGE_PANAF.xlsx');
    if (onShowToast) onShowToast('Export Excel des métriques SEMrush téléchargé avec succès');
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 sm:p-6 shadow-2xs mt-8 space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#f1f5f9]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-6 h-6 rounded-lg bg-orange-500 text-white flex items-center justify-center font-black text-[11px]">
              SE
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-orange-900 border border-orange-200 uppercase tracking-wider">
              MÉTRIQUES & AUDIENCE SEMRUSH
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#eff6ff] text-[#1e40af] border border-[#dbeafe]">
              SEO & Audience Intelligence
            </span>
          </div>
          <h2 className="text-[20px] font-bold text-[#0b1c30] tracking-tight">
            Métriques d'Audience et Trafic Organique SEMrush
          </h2>
          <p className="text-[13px] text-[#64748b] max-w-3xl">
            Volumes de recherche Google, parts d'audience continentales et requêtes de piratage captées par les principaux portails web et réseaux de streaming illicites.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            onClick={handleExportSemrush}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#cbd5e1] text-[#0b1c30] text-[12px] font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter Rapport (.xlsx)</span>
          </button>

          {onNavigateToImport && (
            <button
              onClick={onNavigateToImport}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-[12px] font-bold shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gérer l'Enrichissement SEMrush</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 4 KPI CARDS SEMRUSH */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 : Trafic Organique Total */}
        <div className="p-4 rounded-xl bg-linear-to-br from-[#f8fafc] to-[#eff6ff] border border-[#dbeafe] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748b] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1e40af]">
              Audience Mensuelle Drainée
            </span>
            <Globe className="w-4 h-4 text-[#1e40af]" />
          </div>
          <div className="text-[28px] font-black text-[#0b1c30] font-mono leading-none">
            3.15M
          </div>
          <p className="text-[11px] text-[#64748b] mt-2">
            Visites estimées/mois sur les portails identifiés
          </p>
          <div className="mt-3 pt-2 border-t border-[#dbeafe] flex items-center justify-between text-[11px]">
            <span className="text-[#64748b]">Équivalent abonnés</span>
            <span className="font-bold text-red-600 font-mono">~300 000 foyers</span>
          </div>
        </div>

        {/* KPI 2 : Authority Score Moyen */}
        <div className="p-4 rounded-xl bg-linear-to-br from-[#f8fafc] to-[#fff7ed] border border-orange-200 shadow-2xs">
          <div className="flex items-center justify-between text-[#64748b] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-950">
              Authority Score Moyen
            </span>
            <Sparkles className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-[28px] font-black text-orange-950 font-mono leading-none">
            37.8 <span className="text-[14px] font-medium text-gray-500">/ 100</span>
          </div>
          <p className="text-[11px] text-[#64748b] mt-2">
            Score d'autorité Google et puissance de ranking SEO
          </p>
          <div className="mt-3 pt-2 border-t border-orange-200 flex items-center justify-between text-[11px]">
            <span className="text-[#64748b]">Niveau de visibilité</span>
            <span className="font-bold text-orange-900">Élevée sur requêtes sport</span>
          </div>
        </div>

        {/* KPI 3 : Concentration Afrique */}
        <div className="p-4 rounded-xl bg-linear-to-br from-[#f8fafc] to-[#faf5ff] border border-purple-200 shadow-2xs">
          <div className="flex items-center justify-between text-[#64748b] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900">
              Part Afrique Subsaharienne
            </span>
            <TrendingUp className="w-4 h-4 text-purple-700" />
          </div>
          <div className="text-[28px] font-black text-purple-900 font-mono leading-none">
            78.4%
          </div>
          <p className="text-[11px] text-[#64748b] mt-2">
            Trafic local ciblé depuis le Sénégal, CI, CM et RDC
          </p>
          <div className="mt-3 pt-2 border-t border-purple-200 flex items-center justify-between text-[11px]">
            <span className="text-[#64748b]">Impact territorial</span>
            <span className="font-bold text-purple-800">Filiales directes</span>
          </div>
        </div>

        {/* KPI 4 : Mots-clés Indexés */}
        <div className="p-4 rounded-xl bg-linear-to-br from-[#f8fafc] to-[#f0fdf4] border border-emerald-200 shadow-2xs">
          <div className="flex items-center justify-between text-[#64748b] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">
              Mots-Clés Piratage Indexés
            </span>
            <Search className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-[28px] font-black text-emerald-900 font-mono leading-none">
            3 750
          </div>
          <p className="text-[11px] text-[#64748b] mt-2">
            Expressions captées positionnées dans le Top 10 Google
          </p>
          <div className="mt-3 pt-2 border-t border-emerald-200 flex items-center justify-between text-[11px]">
            <span className="text-[#64748b]">Taux d'intention pirate</span>
            <span className="font-bold text-emerald-800 font-mono">92.4%</span>
          </div>
        </div>
      </div>

      {/* 2 SECTIONS ANALYTIQUES DÉTAILLÉES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Volet 1: Top Domaines Pirates & Classement de Trafic */}
        <div className="p-5 rounded-xl border border-[#e2e8f0] bg-[#f8fafc]/50 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#0b1c30] uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#1e40af]" />
              Top Portails de Streaming Surveillés
            </h3>
            <span className="text-[11px] font-mono text-[#64748b]">
              Classés par volume d'audience
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#e2e8f0] bg-white">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[10px] font-bold uppercase text-[#64748b]">
                <tr>
                  <th className="py-2.5 px-3">Domaine</th>
                  <th className="py-2.5 px-3">Trafic Mensuel</th>
                  <th className="py-2.5 px-3">Authority Score</th>
                  <th className="py-2.5 px-3">Part Afrique</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {semrushItems.slice(0, 5).map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#f8fafc]">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#0b1c30]">
                      <div className="truncate max-w-[160px]" title={item.siteDomain}>
                        {item.siteDomain}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-orange-600">
                      {item.semrushTraffic || '450K / mois'}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                      <div className="flex items-center gap-1.5">
                        <span>{item.semrushAuthority ?? 38}</span>
                        <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600"
                            style={{ width: `${(item.semrushAuthority ?? 38) * 2}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-purple-700">
                      78%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Volet 2: Top Requêtes Google & Mots-Clés Interceptés */}
        <div className="p-5 rounded-xl border border-[#e2e8f0] bg-[#f8fafc]/50 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#0b1c30] uppercase tracking-wider flex items-center gap-2">
              <Search className="w-4 h-4 text-orange-600" />
              Mots-Clés & Requêtes de Piratage Interceptés
            </h3>
            <span className="text-[11px] font-mono text-[#64748b]">
              Positionnement Google
            </span>
          </div>

          <div className="space-y-2">
            {topKeywordsList.map((kw, i) => (
              <div
                key={i}
                className="p-2.5 rounded-lg bg-white border border-[#e2e8f0] flex items-center justify-between gap-2 text-[12px] hover:border-[#cbd5e1] transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded-md bg-orange-100 text-orange-950 font-bold font-mono text-[11px] flex items-center justify-center shrink-0">
                    {kw.position}
                  </span>
                  <div className="min-w-0">
                    <span className="font-bold text-[#0b1c30] truncate block">
                      "{kw.keyword}"
                    </span>
                    <span className="text-[11px] text-[#64748b] truncate block">
                      Cible : {kw.target}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-[#0b1c30] block">
                    {kw.volume}
                  </span>
                  <span className="text-[11px] font-mono text-blue-700 font-bold">
                    {kw.trafficShare} du trafic
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER CALLOUT */}
      <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12px]">
        <div className="flex items-center gap-2.5 text-orange-950">
          <Zap className="w-4 h-4 text-orange-600 shrink-0" />
          <span>
            L'intelligence de trafic SEMrush alimente directement les dossiers de notification DMCA et les requêtes judiciaires de blocage DNS transmises aux FAI locaux.
          </span>
        </div>
        {onNavigateToImport && (
          <button
            onClick={onNavigateToImport}
            className="text-[12px] font-bold text-orange-900 hover:text-orange-950 underline shrink-0 cursor-pointer self-start sm:self-auto"
          >
            Lancer un nouvel enrichissement →
          </button>
        )}
      </div>
    </div>
  );
};
