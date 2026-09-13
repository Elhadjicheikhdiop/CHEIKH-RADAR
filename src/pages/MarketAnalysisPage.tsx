import React, { useState, useMemo } from 'react';
import {
  Download,
  Sliders,
  CheckCircle2,
  Globe2,
  TrendingUp,
  CreditCard,
  X,
  ShieldAlert,
  Users,
  Database,
  Zap,
  Sparkles,
  Tv,
  Calendar,
} from 'lucide-react';
import {
  mockCountryBusinessImpacts,
  mockCommercialCountryMetrics,
  mockMonthlyBusinessHistory,
  mockPostActionImpacts,
  PostActionImpactRecord,
} from '../data/marketData';

interface MarketAnalysisPageProps {
  onShowToast: (msg: string) => void;
  onSelectTerritory?: (countryName: string) => void;
}

export const MarketAnalysisPage: React.FC<MarketAnalysisPageProps> = ({ onShowToast, onSelectTerritory }) => {
  // Filtre Pays
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('all');
  
  // Modal fiche opération
  const [selectedOperation, setSelectedOperation] = useState<PostActionImpactRecord | null>(null);

  // Curseur du simulateur (vulgarisé & 100% mensuel)
  const [takedownEfficiency, setTakedownEfficiency] = useState<number>(70); // % de coupures réussies
  const [conversionRate, setConversionRate] = useState<number>(12); // % qui achètent un mois légal
  const [selectedFormulaPrice, setSelectedFormulaPrice] = useState<number>(10000); // 10 000 FCFA / mois

  // Filtrage des données
  const filteredCountryImpacts = useMemo(() => {
    if (selectedCountryCode === 'all') return mockCountryBusinessImpacts;
    return mockCountryBusinessImpacts.filter((c) => c.code === selectedCountryCode);
  }, [selectedCountryCode]);

  const filteredCommercialMetrics = useMemo(() => {
    if (selectedCountryCode === 'all') return mockCommercialCountryMetrics;
    return mockCommercialCountryMetrics.filter((c) => c.code === selectedCountryCode);
  }, [selectedCountryCode]);

  const filteredPostActionImpacts = useMemo(() => {
    if (selectedCountryCode === 'all') return mockPostActionImpacts;
    return mockPostActionImpacts.filter((op) => op.code === selectedCountryCode);
  }, [selectedCountryCode]);

  // Totaux Mode 1 : Ce qu'on observe sur le terrain
  const totalAudience = useMemo(() => {
    return filteredCountryImpacts.reduce((sum, c) => sum + c.pirateAudience, 0);
  }, [filteredCountryImpacts]);

  // Simulation pas-à-pas (Mensuelle)
  const peopleBlocked = Math.round(totalAudience * (takedownEfficiency / 100));
  const recoveredSubscribers = Math.round(peopleBlocked * (conversionRate / 100));
  const monthlyRecoveredFcfa = recoveredSubscribers * selectedFormulaPrice;
  const annualRecoveredFcfa = monthlyRecoveredFcfa * 12;

  // Totaux Mode 2 : Vraies ventes CANAL+
  const totalRealSubscribers = useMemo(() => {
    return filteredCommercialMetrics.reduce((sum, c) => sum + c.activeSubscribers, 0);
  }, [filteredCommercialMetrics]);

  const totalRealNewSubs = useMemo(() => {
    return filteredCommercialMetrics.reduce((sum, c) => sum + c.monthlyNewSubscriptions, 0);
  }, [filteredCommercialMetrics]);

  const totalRealRevenueFcfa = useMemo(() => {
    return filteredCommercialMetrics.reduce((sum, c) => sum + c.monthlyRevenueFcfa, 0);
  }, [filteredCommercialMetrics]);

  const totalMonthlyLiftRevenue = useMemo(() => {
    return filteredPostActionImpacts.reduce((sum, op) => sum + op.monthlyRevenueLiftFcfa, 0);
  }, [filteredPostActionImpacts]);

  const totalAdditionalRecruits = useMemo(() => {
    return filteredPostActionImpacts.reduce((sum, op) => sum + op.monthlyNewSubscribersGained, 0);
  }, [filteredPostActionImpacts]);

  const formatNumber = (num: number) => new Intl.NumberFormat('fr-FR').format(num);

  const handleExport = () => {
    onShowToast('Synthèse décisionnelle mensuelle exportée.');
  };

  return (
    <div className="flex flex-col w-full pb-12" id="market-bi-dashboard">
      
      {/* 1. EN-TÊTE DÉCISIONNEL */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#e2e8f0] mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[20px] font-bold text-[#0b1c30] tracking-tight">
              Tableau de Bord Décisionnel : Impact Commercial des Coupures
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]">
              Base Mensuelle (30 jours)
            </span>
          </div>
          <p className="text-[13px] text-[#64748b] mt-0.5">
            Évaluez l'efficacité des actions anti-piratage et observez le rebond direct sur les ventes d'abonnements mensuels CANAL+.
          </p>
        </div>

        {/* Filtre Pays */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white border border-[#cbd5e1] rounded-lg px-3 py-1.5 shadow-2xs">
            <Globe2 className="w-3.5 h-3.5 text-[#64748b]" />
            <select
              value={selectedCountryCode}
              onChange={(e) => setSelectedCountryCode(e.target.value)}
              className="text-[12px] font-semibold text-[#0b1c30] bg-transparent outline-none cursor-pointer"
            >
              <option value="all">🌍 Tous les pays réunis</option>
              <option value="SN">🇸🇳 Sénégal</option>
              <option value="CI">🇨🇮 Côte d'Ivoire</option>
              <option value="CM">🇨🇲 Cameroun</option>
              <option value="ML">🇲🇱 Mali</option>
              <option value="GA/CD">🇬🇦🇨🇩 Gabon & RDC</option>
            </select>
          </div>

          <button
            onClick={handleExport}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#f8fafc] text-[#0b1c30] border border-[#cbd5e1] text-[12px] font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#1e40af]" />
            <span>Exporter Rapport</span>
          </button>
        </div>
      </div>

      {/* CONTENU GLOBAL : TOUTES LES ANALYSES AFFICHÉES DE MANIÈRE FLUIDE SANS BOUTONS DE BASCULE */}
      <div className="space-y-8">

        {/* SECTION 1 : VRAIES VENTES COMMERCIALES ET REBONDS */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <h2 className="text-[16px] font-bold text-[#0b1c30]">
                Ventes Réelles CANAL+ & Impact des Coupures
              </h2>
            </div>
          </div>

          {/* 4 Chiffres Clés du Mois */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-2xs">
              <div className="flex items-center justify-between text-[#64748b] text-[11px] font-bold uppercase mb-1">
                <span>Parc Abonnés Actifs</span>
                <Users className="w-4 h-4 text-[#1e40af]" />
              </div>
              <div className="text-[24px] font-black text-[#0b1c30] font-mono">
                {formatNumber(totalRealSubscribers)}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                Abonnements mensuels en cours
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-2xs">
              <div className="flex items-center justify-between text-[#64748b] text-[11px] font-bold uppercase mb-1">
                <span>Ventes du Mois</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-[24px] font-black text-emerald-700 font-mono">
                +{formatNumber(totalRealNewSubs)}
              </div>
              <div className="text-[11px] text-[#64748b] mt-1">
                Abonnements souscrits ce mois
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-2xs">
              <div className="flex items-center justify-between text-[#64748b] text-[11px] font-bold uppercase mb-1">
                <span>Chiffre d'Affaires Mensuel</span>
                <CreditCard className="w-4 h-4 text-[#0b1c30]" />
              </div>
              <div className="text-[24px] font-black text-[#0b1c30] font-mono">
                {(totalRealRevenueFcfa / 1000000000).toFixed(2)} Md FCFA
              </div>
              <div className="text-[11px] text-[#64748b] mt-1">
                Revenu moyen : ~10 500 FCFA / client
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-300 bg-emerald-50/40 shadow-2xs">
              <div className="flex items-center justify-between text-emerald-800 text-[11px] font-bold uppercase mb-1">
                <span>Gain Net des Coupures</span>
                <Zap className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-[24px] font-black text-emerald-700 font-mono">
                +{Math.round(totalMonthlyLiftRevenue / 1000000)}M FCFA / mois
              </div>
              <div className="text-[11px] text-emerald-800 font-medium mt-1">
                +{formatNumber(totalAdditionalRecruits)} abonnés gagnés grâce aux actions
              </div>
            </div>

          </div>

          {/* TABLEAU DÉCISIONNEL MENSUEL (MOIS 1 À MOIS 6) : L'EXPLICATION DES REBONDS */}
          <div className="bg-white rounded-xl border border-[#0b1c30] shadow-sm p-5">
            <div className="pb-3 border-b border-[#f1f5f9] mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0b1c30]" />
                <h3 className="text-[15px] font-bold text-[#0b1c30]">
                  Chronologie Décisionnelle : L'Effet des Coupures sur les Mois de Ventes
                </h3>
              </div>
              <p className="text-[12px] text-[#64748b] mt-0.5">
                Comprenez pourquoi le chiffre d'affaires fluctue chaque mois en fonction de la pression mise sur les réseaux pirates.
              </p>
            </div>

            <div className="space-y-3">
              {mockMonthlyBusinessHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all ${
                    item.keyTakedownAction
                      ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-400/30'
                      : 'bg-[#f8fafc] border-[#e2e8f0]'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[13px] text-[#0b1c30]">{item.monthName}</span>
                      {item.keyTakedownAction ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          <span>Mois d'Action Majeure</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-[10px] font-medium">
                          Période Normale
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-[12px] font-mono">
                      <div>
                        <span className="text-[#64748b] text-[11px] mr-1">Ventes :</span>
                        <span className="font-bold text-emerald-700 font-mono">
                          {formatNumber(item.totalMonthlySubscriptions)} abonnements
                        </span>
                      </div>
                      <div>
                        <span className="text-[#64748b] text-[11px] mr-1">CA Mensuel :</span>
                        <span className="font-black text-[#0b1c30] font-mono">
                          {item.monthlyRevenueFcfaM}M FCFA
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Explication Décisionnelle du Rebond */}
                  <div className="text-[12px] text-[#334155] leading-relaxed bg-white/80 p-2.5 rounded-lg border border-[#e2e8f0]">
                    <span className="font-bold text-[#0b1c30] mr-1">💡 Explication :</span>
                    {item.decisionImpactSummary}
                  </div>

                  {/* Action spécifique si existante */}
                  {item.keyTakedownAction && (
                    <div className="mt-2 text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Action terrain réalisée : {item.keyTakedownAction}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* TABLEAU DES 4 OPÉRATIONS MAJEURES ET DE LEUR IMPACT FINANCIER MENSUEL */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-[#f1f5f9] flex items-center justify-between">
              <div>
                <h3 className="text-[13px] font-bold text-[#0b1c30]">
                  Opérations Réalisées et Chiffre d'Affaires Mensuel Additionnel Généré
                </h3>
                <p className="text-[11px] text-[#64748b] mt-0.5">
                  Chaque opération génère du chiffre d'affaires immédiat sur le mois et installe une base d'abonnés fidèles.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] font-bold text-[#64748b]">
                    <th className="py-2.5 px-4">Période & Pays</th>
                    <th className="py-2.5 px-4">Nature de l'Opération</th>
                    <th className="py-2.5 px-4">Baisse Piratage</th>
                    <th className="py-2.5 px-4">Nouveaux Abonnés / Mois</th>
                    <th className="py-2.5 px-4">CA Mensuel Gagné</th>
                    <th className="py-2.5 px-4 text-right">Détails</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {filteredPostActionImpacts.map((op) => (
                    <tr key={op.id} className="hover:bg-[#f8fafc]">
                      <td className="py-2.5 px-4 font-bold text-[#0b1c30]">
                        <div className="flex items-center gap-1.5">
                          <span>{op.flag}</span>
                          <span>{op.country}</span>
                        </div>
                        <div className="text-[10px] text-[#64748b] font-normal">{op.month}</div>
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="font-semibold text-[#0b1c30]">{op.operationTitle}</div>
                        <div className="text-[10px] text-[#64748b]">{op.takedownScope}</div>
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-[#dc2626]">
                        {op.pirateDropPercent}%
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-emerald-700">
                        +{formatNumber(op.monthlyNewSubscribersGained)} abonnés
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-emerald-700">
                        +{Math.round(op.monthlyRevenueLiftFcfa / 1000000)}M FCFA / mois
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedOperation(op)}
                          className="px-2.5 py-1 rounded bg-[#0b1c30] text-white hover:bg-[#1e40af] text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Comprendre
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SECTION 2 : SIMULATEUR DE POTENTIEL ET GISEMENT PIRATE */}
        <div className="space-y-6 pt-6 border-t border-[#e2e8f0]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#dc2626]" />
              <h2 className="text-[16px] font-bold text-[#0b1c30]">
                Gisement Pirate & Simulateur de Récupération
              </h2>
            </div>
          </div>

          {/* 3 Cartes Simples */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-2xs">
              <div className="flex items-center justify-between text-[#64748b] text-[11px] font-bold uppercase mb-1">
                <span>Audience Pirate Détectée</span>
                <Tv className="w-4 h-4 text-[#dc2626]" />
              </div>
              <div className="text-[26px] font-black text-[#dc2626] font-mono">
                {formatNumber(totalAudience)}
              </div>
              <div className="text-[11px] text-[#64748b] mt-1">
                Utilisateurs actifs sur les flux illégaux chaque mois
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-2xs">
              <div className="flex items-center justify-between text-[#64748b] text-[11px] font-bold uppercase mb-1">
                <span>Abonnements Mensuels Récupérables</span>
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-[26px] font-black text-emerald-700 font-mono">
                +{formatNumber(recoveredSubscribers)}
              </div>
              <div className="text-[11px] text-emerald-800 font-medium mt-1">
                Clients qui basculent sur un mois légal (10 000 F)
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-2xs">
              <div className="flex items-center justify-between text-emerald-800 text-[11px] font-bold uppercase mb-1">
                <span>Gain Mensuel Direct Estimé</span>
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-[26px] font-black text-emerald-700 font-mono">
                +{Math.round(monthlyRecoveredFcfa / 1000000)} Millions F / mois
              </div>
              <div className="text-[11px] text-emerald-800 mt-1">
                Soit {Math.round(annualRecoveredFcfa / 1000000)} Millions FCFA sur 12 mois
              </div>
            </div>
          </div>

          {/* SIMULATEUR MENSUEL */}
          <div className="bg-white rounded-xl border border-[#0b1c30] shadow-sm p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9] mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#0b1c30]" />
                <h3 className="text-[15px] font-bold text-[#0b1c30]">
                  Simulateur Décisionnel : Comment se crée le rebond de ventes ?
                </h3>
              </div>
              <span className="text-[11px] bg-gray-100 text-gray-700 font-semibold px-2 py-0.5 rounded">
                Abonnement mensuel : 10 000 FCFA
              </span>
            </div>

            {/* Les 3 Étapes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              
              {/* Étape 1 : Coupure */}
              <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Étape 1 : Coupure</span>
                    <span className="text-[14px] font-bold text-[#1e40af] font-mono">{takedownEfficiency}% coupés</span>
                  </div>
                  <div className="font-bold text-[13px] text-[#0b1c30] mb-1">
                    Quelle part des pirates est bloquée ?
                  </div>
                  <p className="text-[11px] text-[#64748b] mb-3">
                    En bloquant les serveurs DNS et les numéros Wave des revendeurs, les flux s'éteignent.
                  </p>
                </div>
                <div>
                  <input
                    type="range"
                    min="30"
                    max="95"
                    step="5"
                    value={takedownEfficiency}
                    onChange={(e) => setTakedownEfficiency(Number(e.target.value))}
                    className="w-full h-2 bg-[#cbd5e1] rounded-lg appearance-none cursor-pointer accent-[#0b1c30]"
                  />
                  <div className="text-[11px] font-semibold text-[#0b1c30] mt-2">
                    👉 {formatNumber(peopleBlocked)} personnes privées de match
                  </div>
                </div>
              </div>

              {/* Étape 2 : Le Rebond */}
              <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Étape 2 : Le Rebond</span>
                    <span className="text-[14px] font-bold text-emerald-700 font-mono">{conversionRate}% s'abonnent</span>
                  </div>
                  <div className="font-bold text-[13px] text-[#0b1c30] mb-1">
                    Combien achètent un mois officiel ?
                  </div>
                  <p className="text-[11px] text-[#64748b] mb-3">
                    Ne pouvant plus regarder par le pirate, ces foyers viennent en boutique payer 10 000 FCFA pour le mois.
                  </p>
                </div>
                <div>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    step="1"
                    value={conversionRate}
                    onChange={(e) => setConversionRate(Number(e.target.value))}
                    className="w-full h-2 bg-[#cbd5e1] rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="text-[11px] font-semibold text-emerald-700 mt-2">
                    👉 +{formatNumber(recoveredSubscribers)} abonnements vendus ce mois
                  </div>
                </div>
              </div>

              {/* Étape 3 : Chiffre d'Affaires Récupéré */}
              <div className="bg-[#0b1c30] text-white p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded">Gain Commercial</span>
                    <span className="text-[10px] text-gray-300">Valeur Mensuelle</span>
                  </div>
                  <div className="font-bold text-[13px] text-white mb-1">
                    Impact dans la caisse de CANAL+
                  </div>
                  <div className="text-[11px] text-gray-300 mb-3">
                    {formatNumber(recoveredSubscribers)} abonnés × 10 000 FCFA
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 space-y-1">
                  <div className="text-[11px] text-gray-400">Revenu mensuel récupéré :</div>
                  <div className="text-[22px] font-black text-emerald-400 font-mono">
                    +{Math.round(monthlyRecoveredFcfa / 1000000)} Millions FCFA / mois
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Tableau décisionnel par pays */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-[#f1f5f9]">
              <h3 className="text-[13px] font-bold text-[#0b1c30]">
                Répartition géographique du manque à gagner mensuel
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] font-bold text-[#64748b]">
                    <th className="py-2.5 px-4">Pays</th>
                    <th className="py-2.5 px-4">Audience Pirate</th>
                    <th className="py-2.5 px-4">Manque à gagner / mois</th>
                    <th className="py-2.5 px-4">Méthode de paiement pirate</th>
                    <th className="py-2.5 px-4">Action recommandée</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {filteredCountryImpacts.map((c) => (
                    <tr key={c.code} className="hover:bg-[#f8fafc]">
                      <td className="py-2.5 px-4 font-bold text-[#0b1c30]">
                        <span className="mr-1.5">{c.flag}</span>
                        {c.country}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-[#dc2626]">
                        {formatNumber(c.pirateAudience)} utilisateurs
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-[#0b1c30]">
                        {Math.round(c.estimatedLossFcfa / 1000000)}M FCFA / mois
                      </td>
                      <td className="py-2.5 px-4 text-[#475569]">
                        {c.dominantPaymentMethods[0]}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="text-[11px] font-semibold text-[#1e40af] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {c.code === 'SN' ? 'Saisies Sandaga & Gel Wave' : c.code === 'CI' ? 'Blocage FAI & Wave CI' : 'Coupure Câbles de quartier'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL DÉCISIONNEL : POURQUOI CETTE OPÉRATION A FONCTIONNÉ */}
      {selectedOperation && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#cbd5e1] shadow-2xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-start justify-between pb-2 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedOperation.flag}</span>
                <div>
                  <h3 className="text-[15px] font-bold text-[#0b1c30]">{selectedOperation.operationTitle}</h3>
                  <div className="text-[11px] text-[#64748b]">{selectedOperation.country} • {selectedOperation.month}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedOperation(null)}
                className="p-1 rounded-md text-gray-400 hover:text-[#0b1c30] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Explication Décisionnelle Limpide */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[12px] text-emerald-950 space-y-1.5">
              <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                Pourquoi le rebond s'est produit ?
              </span>
              <p className="leading-relaxed">{selectedOperation.whyItWorked}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">Abonnements Mensuels Gagnés</span>
                <span className="text-[18px] font-black text-emerald-700 font-mono">
                  +{formatNumber(selectedOperation.monthlyNewSubscribersGained)}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">Chiffre d'Affaires du Mois</span>
                <span className="text-[18px] font-black text-[#0b1c30] font-mono">
                  +{Math.round(selectedOperation.monthlyRevenueLiftFcfa / 1000000)}M FCFA
                </span>
              </div>
            </div>

            <div className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              <span className="font-semibold text-gray-700">Valeur annualisée estimée : </span>
              {Math.round(selectedOperation.annualizedValueFcfa / 1000000)} Millions FCFA avec le renouvellement régulier des clients.
            </div>

            <button
              onClick={() => setSelectedOperation(null)}
              className="w-full py-2 rounded-lg bg-[#0b1c30] hover:bg-[#1e40af] text-white font-bold text-[12px] transition-colors cursor-pointer"
            >
              Fermer la fiche
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
