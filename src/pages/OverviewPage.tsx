import React from 'react';
import { Threat } from '../types';
import {
  Shield,
  TrendingUp,
  Globe2,
  Fingerprint,
  Calendar,
  ChevronDown,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

interface OverviewPageProps {
  threats: Threat[];
  onSelectThreat: (threatId: string) => void;
  onNavigateToThreats: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  threats,
  onSelectThreat,
  onNavigateToThreats,
}) => {
  // Chart hourly volume distribution
  const hourlyData = [
    { hour: '00h', height: 18, count: 8, isPeak: false },
    { hour: '02h', height: 12, count: 5, isPeak: false },
    { hour: '04h', height: 8, count: 3, isPeak: false },
    { hour: '06h', height: 10, count: 4, isPeak: false },
    { hour: '08h', height: 15, count: 7, isPeak: false },
    { hour: '10h', height: 22, count: 11, isPeak: false },
    { hour: '12h', height: 35, count: 16, isPeak: false },
    { hour: '14h', height: 28, count: 13, isPeak: false },
    { hour: '16h', height: 48, count: 22, isPeak: false },
    { hour: '18h', height: 64, count: 29, isPeak: false },
    { hour: '20h', height: 92, count: 38, isPeak: true },
    { hour: '22h', height: 84, count: 32, isPeak: true },
  ];

  // Specific 5 items matching the reference design table
  const displayThreats = [
    {
      id: threats[0]?.id || 'INC-202502-8841-TK',
      name: '@exampletv',
      target: 'Direct Ligue 1 / Match clé',
      channel: 'TikTok',
      channelType: 'tiktok',
      country: 'Sénégal',
      timeAgo: 'Il y a 2 h',
      isCritical: true,
    },
    {
      id: threats[1]?.id || 'INC-202502-8840-WB',
      name: 'example-site.com',
      target: 'Rediffusion en direct sur site web',
      channel: 'Web',
      channelType: 'web',
      country: "Côte d'Ivoire",
      timeAgo: 'Il y a 5 h',
      isCritical: true,
    },
    {
      id: threats[2]?.id || 'INC-202502-8839-AP',
      name: 'Example IPTV',
      target: 'Chaînes TV piratées dans l\'application',
      channel: 'Application',
      channelType: 'app',
      country: 'Sénégal',
      timeAgo: 'Hier',
      isCritical: true,
    },
    {
      id: threats[3]?.id || 'INC-202502-8838-TG',
      name: 't.me/stream_panaf',
      target: 'Canal Telegram partageant des liens pirates',
      channel: 'Web / Réseaux',
      channelType: 'social',
      country: 'Cameroun',
      timeAgo: 'Hier',
      isCritical: false,
    },
    {
      id: threats[4]?.id || 'INC-202502-8837-FR',
      name: 'forum-sat-africa',
      target: 'Codes d\'accès et piratage de décodeurs',
      channel: 'Forum',
      channelType: 'forum',
      country: 'Non spécifié',
      timeAgo: 'Il y a 2 jours',
      isCritical: false,
    },
  ];

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Top Banner / Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-bold tracking-tight text-[#0b1c30]">
              Vue d'ensemble
            </h1>
          </div>
          <p className="text-[13px] text-[#64748b]">
            Surveillance des diffusions non autorisées
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#e2e8f0] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
            <span className="text-[12px] font-medium text-[#0b1c30]">Veille active</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#e2e8f0] rounded-lg shadow-2xs text-[#0b1c30] text-[12px] font-medium cursor-pointer hover:border-[#cbd5e1]">
            <Calendar className="w-3.5 h-3.5 text-[#64748b]" />
            <span>Dernières 24 heures</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* KPI 1 : Menaces Détectées */}
        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs flex flex-col justify-between hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-[#64748b] mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Diffusions détectées</span>
            <Shield className="w-4 h-4 text-[#64748b]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-[#0b1c30] tracking-tight leading-none">142</span>
            <span className="text-[12px] text-[#64748b]">Total constatés</span>
          </div>
          <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
            <span className="text-[12px] text-[#64748b]">Statut</span>
            <span className="text-[12px] text-[#dc2626] font-bold">En direct (48%)</span>
          </div>
        </div>

        {/* KPI 2 : Nouvelles Menaces */}
        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs flex flex-col justify-between hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-[#64748b] mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Nouvelles menaces</span>
            <TrendingUp className="w-4 h-4 text-[#dc2626]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-[#dc2626] tracking-tight leading-none">+18</span>
            <span className="text-[12px] text-[#64748b]">Dernières 24h</span>
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
            <Globe2 className="w-4 h-4 text-[#64748b]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-[#0b1c30] tracking-tight leading-none">6</span>
            <span className="text-[12px] text-[#64748b]">Territoires</span>
          </div>
          <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
            <span className="text-[12px] text-[#0b1c30] font-medium">
              Sénégal, Côte d'Ivoire, Cameroun...
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
            <span className="text-[32px] font-bold text-[#0b1c30] tracking-tight leading-none">29</span>
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
            <span className="text-[12px] text-[#64748b] font-mono">(142 flux actifs analysés)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-[#e2e8f0] shadow-2xs flex flex-col justify-between hover:bg-[#f8fafc] transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold text-[#0b1c30]">TikTok</span>
              <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-[#0b1c30]">46</span>
              <span className="text-[11px] font-mono text-[#dc2626] font-semibold">Élevé</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#e2e8f0] shadow-2xs flex flex-col justify-between hover:bg-[#f8fafc] transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold text-[#0b1c30]">Meta (FB/IG)</span>
              <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-[#0b1c30]">31</span>
              <span className="text-[11px] font-mono text-[#dc2626] font-semibold">Élevé</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#e2e8f0] shadow-2xs flex flex-col justify-between hover:bg-[#f8fafc] transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold text-[#0b1c30]">X (Twitter)</span>
              <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-[#0b1c30]">28</span>
              <span className="text-[11px] font-mono text-[#334155] font-semibold">Modéré</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#e2e8f0] shadow-2xs flex flex-col justify-between hover:bg-[#f8fafc] transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold text-[#0b1c30]">YouTube</span>
              <span className="w-2 h-2 rounded-full bg-[#94a3b8]"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-[#0b1c30]">14</span>
              <span className="text-[11px] font-mono text-[#64748b] font-semibold">Stable</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#e2e8f0] shadow-2xs flex flex-col justify-between hover:bg-[#f8fafc] transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold text-[#0b1c30]">Web Stream</span>
              <span className="w-2 h-2 rounded-full bg-[#94a3b8]"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-[#0b1c30]">12</span>
              <span className="text-[11px] font-mono text-[#64748b] font-semibold">Stable</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#e2e8f0] shadow-2xs flex flex-col justify-between hover:bg-[#f8fafc] transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold text-[#0b1c30]">Forums</span>
              <span className="w-2 h-2 rounded-full bg-[#94a3b8]"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-[#0b1c30]">7</span>
              <span className="text-[11px] font-mono text-[#64748b] font-semibold">Faible</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#e2e8f0] shadow-2xs flex flex-col justify-between hover:bg-[#f8fafc] transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold text-[#0b1c30]">Apps IPTV</span>
              <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-[#0b1c30]">4</span>
              <span className="text-[11px] font-mono text-[#dc2626] font-semibold">Fermé</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dernières menaces / Activité récente des menaces */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-2xs p-5 flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-[#f1f5f9]">
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-[#0b1c30]">Activité récente des menaces</span>
            <span className="text-[12px] text-[#64748b]">
              Dernières infractions signalées et analysées par le système
            </span>
          </div>
          <span className="text-[11px] text-[#64748b]">Affichage : 5 derniers incidents</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
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
              {displayThreats.map((item) => (
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
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-[#64748b]">
          <span className="text-[12px]">Dernières diffusions identifiées</span>
          <button
            onClick={onNavigateToThreats}
            className="text-[12px] text-[#0b1c30] font-bold hover:text-[#dc2626] flex items-center gap-1 cursor-pointer"
          >
            <span>Consulter l'ensemble des menaces</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
