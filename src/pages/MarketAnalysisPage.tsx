import React, { useState, useMemo } from 'react';
import {
  Download,
  Sliders,
  Target,
  ChevronRight,
  CheckCircle2,
  Globe2,
  TrendingUp,
  MapPin,
  Building2,
  CreditCard,
  FileText,
  X,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Users,
  Smartphone,
  BarChart3,
  Layers,
  Database,
  Lock,
  Check,
  Zap,
  Activity,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import {
  mockCountryBusinessImpacts,
  mockBlackMarketPrices,
  mockSemrushInsights,
  mockCommercialCountryMetrics,
  mockBusinessCorrelationTimeline,
  mockPostActionImpacts,
  CountryBusinessImpact,
  CommercialCountryMetric,
  PostActionImpactRecord,
} from '../data/marketData';

interface MarketAnalysisPageProps {
  onShowToast: (msg: string) => void;
  onSelectTerritory?: (countryName: string) => void;
}

export const MarketAnalysisPage: React.FC<MarketAnalysisPageProps> = ({ onShowToast, onSelectTerritory }) => {
  // SÉLECTEUR DE MODE : Avec ou Sans données commerciales CANAL+
  const [dataMode, setDataMode] = useState<'without_commercial' | 'with_commercial'>('with_commercial');

  // Filtre Pays principal
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('all');
  
  // Territoire actuellement ouvert en modal détaillée (drill-down au clic)
  const [inspectedTerritory, setInspectedTerritory] = useState<CountryBusinessImpact | null>(null);

  // Focus sur une opération post-action
  const [selectedOperation, setSelectedOperation] = useState<PostActionImpactRecord | null>(null);

  // Paramètres du simulateur de gains (Mode Sans données commerciales)
  const [takedownEfficiency, setTakedownEfficiency] = useState<number>(70); // % de flux/revendeurs neutralisés
  const [conversionRate, setConversionRate] = useState<number>(12); // % d'abonnés récupérés
  const [selectedFormulaPrice, setSelectedFormulaPrice] = useState<number>(10000); // 10 000 FCFA formule Sport

  // Filtrage des données par pays sélectionné
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

  // Totaux calculés (Mode sans données commerciales)
  const totalAudience = useMemo(() => {
    return filteredCountryImpacts.reduce((sum, c) => sum + c.pirateAudience, 0);
  }, [filteredCountryImpacts]);

  const totalMonthlyLoss = useMemo(() => {
    return filteredCountryImpacts.reduce((sum, c) => sum + c.estimatedLossFcfa, 0);
  }, [filteredCountryImpacts]);

  // Simulation de gains récupérables
  const recoveredSubscribers = Math.round(
    totalAudience * (takedownEfficiency / 100) * (conversionRate / 100)
  );
  const monthlyRecoveredFcfa = recoveredSubscribers * selectedFormulaPrice;
  const annualRecoveredFcfa = monthlyRecoveredFcfa * 12;
  const monthlyCostEstimate = 15000000;
  const roiRatio = (monthlyRecoveredFcfa / monthlyCostEstimate).toFixed(1);

  // Totaux calculés (Mode avec données commerciales réelles)
  const totalRealSubscribers = useMemo(() => {
    return filteredCommercialMetrics.reduce((sum, c) => sum + c.activeSubscribers, 0);
  }, [filteredCommercialMetrics]);

  const totalRealNewSubs = useMemo(() => {
    return filteredCommercialMetrics.reduce((sum, c) => sum + c.newSubscriptionsMonth, 0);
  }, [filteredCommercialMetrics]);

  const totalRealRevenueFcfa = useMemo(() => {
    return filteredCommercialMetrics.reduce((sum, c) => sum + c.monthlyRevenueFcfa, 0);
  }, [filteredCommercialMetrics]);

  const totalMeasuredLiftRevenue = useMemo(() => {
    return filteredPostActionImpacts.reduce((sum, op) => sum + op.measuredRevenueLiftFcfa, 0);
  }, [filteredPostActionImpacts]);

  const totalAdditionalRecruits = useMemo(() => {
    return filteredPostActionImpacts.reduce((sum, op) => sum + op.additionalSubscribersRecruited, 0);
  }, [filteredPostActionImpacts]);

  // Formatter FCFA
  const formatFcfa = (val: number) => {
    return new Intl.NumberFormat('fr-FR').format(val) + ' FCFA';
  };

  const handleExportDataset = () => {
    if (dataMode === 'with_commercial') {
      const header = 'Pays,Code,AbonnesActifs,NouvellesSouscriptions,ChiffreAffaires_FCFA,ARPU_FCFA,TauxChurn_Pct,PressionPirate\n';
      const rows = mockCommercialCountryMetrics
        .map(
          (c) =>
            `"${c.country}","${c.code}",${c.activeSubscribers},${c.newSubscriptionsMonth},${c.monthlyRevenueFcfa},${c.arpuFcfa},${c.churnRatePercent},"${c.piracyPressureIndex}"`
        )
        .join('\n');

      const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'panaf_correlation_business_canalplus.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onShowToast('Données de corrélation commerciale exportées au format CSV');
    } else {
      const header = 'Pays,Code,AudiencePirate,ManqueAGagnerTheorique_FCFA,TauxConversion,CanalPirateDominant\n';
      const rows = mockCountryBusinessImpacts
        .map(
          (c) =>
            `"${c.country}","${c.code}",${c.pirateAudience},${c.estimatedLossFcfa},${c.conversionRate},"${c.topPirateSource}"`
        )
        .join('\n');

      const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'panaf_estimation_piratage_seul.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onShowToast('Dataset estimations piratage exporté avec succès');
    }
  };

  return (
    <div className="flex flex-col w-full pb-12" id="market-bi-dashboard">
      {/* 1. EN-TÊTE ANALYTIQUE MARCHÉ & CONTEXTE */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#e2e8f0] mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[22px] font-bold text-[#0b1c30] tracking-tight">
              Observatoire de Marché & Performance Business
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]">
              CANAL+ Anti-PIRACY Factory
            </span>
          </div>
          <p className="text-[13px] text-[#64748b] mt-1">
            Évaluation de l'impact des mesures anti-piratage sur les résultats commerciaux et arbitrage stratégique par filiale.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Sélecteur de pays d'analyse */}
          <div className="flex items-center gap-1.5 bg-white border border-[#cbd5e1] rounded-lg px-3 py-1.5 shadow-2xs">
            <Globe2 className="w-3.5 h-3.5 text-[#64748b]" />
            <select
              value={selectedCountryCode}
              onChange={(e) => setSelectedCountryCode(e.target.value)}
              className="text-[12px] font-semibold text-[#0b1c30] bg-transparent outline-none cursor-pointer"
            >
              <option value="all">Tous pays (Consolidé PANAF)</option>
              <option value="SN">Sénégal (Dakar)</option>
              <option value="CI">Côte d'Ivoire (Abidjan)</option>
              <option value="CM">Cameroun (Douala / Yaoundé)</option>
              <option value="ML">Mali (Bamako)</option>
              <option value="GA/CD">Gabon & RDC</option>
            </select>
          </div>

          <button
            onClick={handleExportDataset}
            className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-[#f8fafc] text-[#0b1c30] border border-[#cbd5e1] text-[12px] font-semibold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#1e40af]" />
            <span>Exporter le Dataset</span>
          </button>
        </div>
      </div>

      {/* 2. SÉLECTEUR DE MODE CRUCIAL (2 BOUTONS : AVEC vs SANS DONNÉES COMMERCIALES) */}
      <div className="bg-white rounded-xl border border-[#cbd5e1] p-2.5 mb-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-[#0b1c30] uppercase tracking-wider pl-1">
              Origine des Données :
            </span>
            <span className="text-[11px] text-[#64748b] hidden md:inline">
              (Sélectionnez le mode selon la disponibilité des flux de facturation CANAL+)
            </span>
          </div>

          <div className="inline-flex p-1 bg-[#f1f5f9] rounded-lg border border-[#e2e8f0]">
            {/* BOUTON 1 : SANS DONNÉES COMMERCIALES */}
            <button
              onClick={() => {
                setDataMode('without_commercial');
                onShowToast('Mode Autonome activé : estimations calculées uniquement à partir du piratage observé.');
              }}
              className={`px-3.5 py-2 rounded-md text-[12px] font-bold transition-all flex items-center gap-2 cursor-pointer ${
                dataMode === 'without_commercial'
                  ? 'bg-white text-[#0b1c30] shadow-xs border border-[#cbd5e1]'
                  : 'text-[#64748b] hover:text-[#0b1c30]'
              }`}
            >
              <ShieldAlert className={`w-3.5 h-3.5 ${dataMode === 'without_commercial' ? 'text-[#b91c1c]' : 'text-gray-400'}`} />
              <span>1. Sans Données Commerciales (Mode Autonome)</span>
              {dataMode === 'without_commercial' && (
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              )}
            </button>

            {/* BOUTON 2 : AVEC DONNÉES COMMERCIALES */}
            <button
              onClick={() => {
                setDataMode('with_commercial');
                onShowToast('Mode Performance Business activé : corrélation réelle avec les ventes et réabonnements CANAL+.');
              }}
              className={`px-3.5 py-2 rounded-md text-[12px] font-bold transition-all flex items-center gap-2 cursor-pointer ${
                dataMode === 'with_commercial'
                  ? 'bg-[#0b1c30] text-white shadow-xs'
                  : 'text-[#64748b] hover:text-[#0b1c30]'
              }`}
            >
              <Database className={`w-3.5 h-3.5 ${dataMode === 'with_commercial' ? 'text-emerald-400' : 'text-gray-400'}`} />
              <span>2. Avec Données Commerciales CANAL+ (Corrélation & ROI Réel)</span>
              {dataMode === 'with_commercial' && (
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              )}
            </button>
          </div>
        </div>

        {/* Bandeau d'explication de transparence méthodologique */}
        <div className={`mt-2.5 p-3 rounded-lg text-[12px] flex items-start gap-2.5 border ${
          dataMode === 'with_commercial'
            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
            : 'bg-amber-50/70 border-amber-200 text-amber-950'
        }`}>
          {dataMode === 'with_commercial' ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Flux commercial CANAL+ connecté : </span>
                <span>
                  Croisement en temps réel des actions de neutralisation de flux et saisies de box avec les réactivations réelles d'abonnements des filiales (Sénégal, Côte d'Ivoire, Cameroun, Mali, Gabon/RDC). Permet de calculer le lift commercial post-action et le retour sur investissement réel.
                </span>
              </div>
            </>
          ) : (
            <>
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Rigueur méthodologique (Mode sans données commerciales) : </span>
                <span>
                  PANAF RADAR ne prétend pas inventer vos chiffres d'affaires réels. Dans ce mode, seuls l'exposition au risque, l'audience pirate identifiée et les gains prévisionnels simulés sont affichés. Pour évaluer l'impact réel sur vos résultats, basculez sur le mode avec données commerciales.
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION A : CAS AVEC DONNÉES COMMERCIALES DE CANAL+ (CORRÉLATION RÉELLE)  */}
      {/* ========================================================================= */}
      {dataMode === 'with_commercial' && (
        <div className="space-y-6">
          {/* 4 KPIs COMMERCIAUX RÉELS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs">
              <div className="flex items-center justify-between text-[#64748b] mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Abonnés Actifs CANAL+</span>
                <Users className="w-4 h-4 text-[#1e40af]" />
              </div>
              <div className="text-[26px] font-black text-[#0b1c30] tracking-tight leading-tight font-mono">
                {new Intl.NumberFormat('fr-FR').format(totalRealSubscribers)}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+8.4% de croissance vs M-1</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs">
              <div className="flex items-center justify-between text-[#64748b] mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Nouvelles Souscriptions / Mois</span>
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-[26px] font-black text-emerald-700 tracking-tight leading-tight font-mono">
                +{new Intl.NumberFormat('fr-FR').format(totalRealNewSubs)}
              </div>
              <div className="text-[11px] text-[#64748b] mt-1">
                Dont 56% sur formule Évasion Sport
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs">
              <div className="flex items-center justify-between text-[#64748b] mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">CA Réel Mensuel</span>
                <CreditCard className="w-4 h-4 text-[#0b1c30]" />
              </div>
              <div className="text-[26px] font-black text-[#0b1c30] tracking-tight leading-tight font-mono">
                {(totalRealRevenueFcfa / 1000000000).toFixed(2)} Md FCFA
              </div>
              <div className="text-[11px] text-[#64748b] mt-1">
                ARPU moyen : 10 400 FCFA / abonné
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-emerald-300 bg-emerald-50/30 shadow-2xs">
              <div className="flex items-center justify-between text-emerald-800 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Rebond Commercial Mesuré</span>
                <Zap className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-[26px] font-black text-emerald-700 tracking-tight leading-tight font-mono">
                +{Math.round(totalMeasuredLiftRevenue / 1000000)}M FCFA
              </div>
              <div className="text-[11px] text-emerald-800 font-medium mt-1">
                +{new Intl.NumberFormat('fr-FR').format(totalAdditionalRecruits)} abonnés recrutés post-actions
              </div>
            </div>
          </div>

          {/* 1. CORRÉLATION CROISÉE : ACTIVITÉ PIRATE vs RÉABONNEMENTS OFFICIELS */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-2xs p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#f1f5f9] mb-4 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-bold text-[#0b1c30]">
                    Corrélation Temporelle : Chute du Piratage vs Hausse des Réabonnements CANAL+
                  </h3>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                    Corrélation R² = 0.91
                  </span>
                </div>
                <p className="text-[12px] text-[#64748b] mt-0.5">
                  Preuve chiffrée : lorsque les opérations anti-piratage neutralisent les réseaux informels, les réabonnements officiels augmentent immédiatement.
                </p>
              </div>

              <div className="flex items-center gap-3 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#dc2626]"></span>
                  <span className="font-semibold text-[#64748b]">Pression Pirate (Indice)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                  <span className="font-semibold text-[#64748b]">Réabonnements CANAL+</span>
                </div>
              </div>
            </div>

            {/* Visualiseur temporel par semaine */}
            <div className="space-y-3">
              {mockBusinessCorrelationTimeline.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] hover:bg-white hover:border-[#cbd5e1] transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[13px] text-[#0b1c30]">{item.weekLabel}</span>
                      {item.keyTakedownEvent && (
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-bold flex items-center gap-1">
                          <Zap className="w-3 h-3 text-blue-600" />
                          <span>{item.keyTakedownEvent}</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-[12px]">
                      <span className="text-[#dc2626] font-mono font-bold">
                        Piratage : {item.pirateActivityIndex}/100
                      </span>
                      <span className="text-emerald-700 font-mono font-bold">
                        Réactivations : +{new Intl.NumberFormat('fr-FR').format(item.officialReactivations)}
                      </span>
                      <span className="text-[#0b1c30] font-mono font-bold">
                        CA hebdo : {item.revenueFcfaM}M FCFA
                      </span>
                    </div>
                  </div>

                  {/* Doubles barres de progression comparative */}
                  <div className="space-y-1.5">
                    {/* Barre Piratage */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 w-16 font-medium">Piratage :</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#dc2626] rounded-full transition-all duration-500"
                          style={{ width: `${item.pirateActivityIndex}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-mono text-[#dc2626] w-10 text-right">
                        {item.pirateActivityIndex}%
                      </span>
                    </div>

                    {/* Barre Réabonnements officiels */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 w-16 font-medium">Ventes :</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${(item.officialReactivations / 30000) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-700 w-10 text-right">
                        +{new Intl.NumberFormat('fr-FR').format(item.officialReactivations)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. IMPACT OBSERVÉ APRÈS ACTION ANTI-PIRATAGE (LIFT ANALYSIS J-7 vs J+7) */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-[#f1f5f9] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-bold text-[#0b1c30]">
                    Mesure d'Impact Post-Action Anti-Piratage (Lift Analysis)
                  </h3>
                  <span className="text-[11px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                    4 opérations majeures documentées
                  </span>
                </div>
                <p className="text-[11px] text-[#64748b] mt-0.5">
                  Évaluation rigoureuse des souscriptions additionnelles constatées dans les 7 jours suivant chaque opération de neutralisation.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[12px]">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                    <th className="py-3 px-4">Date & Territoire</th>
                    <th className="py-3 px-4">Opération & Périmètre</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Chute Piratage</th>
                    <th className="py-3 px-4">Rebond Ventes</th>
                    <th className="py-3 px-4">Abonnés Gagnés</th>
                    <th className="py-3 px-4">CA Additionnel</th>
                    <th className="py-3 px-4 text-right">Détails</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {filteredPostActionImpacts.map((op) => (
                    <tr
                      key={op.id}
                      onClick={() => setSelectedOperation(op)}
                      className="hover:bg-[#f8fafc] transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{op.flag}</span>
                          <div>
                            <div className="font-bold text-[#0b1c30] group-hover:text-[#1e40af] transition-colors">
                              {op.country}
                            </div>
                            <div className="text-[10px] text-[#64748b]">{op.date}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#0b1c30]">{op.operationTitle}</div>
                        <div className="text-[10px] text-[#64748b] max-w-xs truncate">{op.takedownScope}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-[#334155] border border-gray-200 text-[10px] font-semibold">
                          {op.operationType}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#dc2626]">
                        {op.pirateDropPercent}%
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-600">
                        +{op.postActionSalesLiftPercent}%
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#0b1c30]">
                        +{new Intl.NumberFormat('fr-FR').format(op.additionalSubscribersRecruited)}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                        +{Math.round(op.measuredRevenueLiftFcfa / 1000000)}M FCFA
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOperation(op);
                          }}
                          className="px-2.5 py-1 rounded bg-[#0b1c30] text-white hover:bg-[#1e40af] text-[11px] font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Fiche</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. INDICATEURS COMMERCIAUX CONSOLIDÉS PAR PAYS & PAR FORMULE */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-[#f1f5f9] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-[14px] font-bold text-[#0b1c30]">
                  Indicateurs Commerciaux Consolidés par Filiale CANAL+
                </h3>
                <p className="text-[11px] text-[#64748b] mt-0.5">
                  Base d'abonnés, chiffre d'affaires, ARPU et répartition des formules par pays.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[12px]">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                    <th className="py-3 px-4">Filiale / Territoire</th>
                    <th className="py-3 px-4">Abonnés Actifs</th>
                    <th className="py-3 px-4">Recrutements M</th>
                    <th className="py-3 px-4">CA Mensuel (FCFA)</th>
                    <th className="py-3 px-4">ARPU</th>
                    <th className="py-3 px-4">Churn</th>
                    <th className="py-3 px-4">Mix Formules (Accès / Évasion / Tout)</th>
                    <th className="py-3 px-4">Pression Pirate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {filteredCommercialMetrics.map((c) => (
                    <tr key={c.code} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="py-3 px-4 font-bold text-[#0b1c30]">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{c.flag}</span>
                          <span>{c.country}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#0b1c30]">
                        {new Intl.NumberFormat('fr-FR').format(c.activeSubscribers)}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-600">
                        +{new Intl.NumberFormat('fr-FR').format(c.newSubscriptionsMonth)}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#0b1c30]">
                        {formatFcfa(c.monthlyRevenueFcfa)}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#334155]">
                        {formatFcfa(c.arpuFcfa)}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#64748b]">
                        {c.churnRatePercent}%
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-[10px] font-mono">
                          <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">{c.formulaBreakdown.acces}%</span>
                          <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">{c.formulaBreakdown.evasionSport}% Sport</span>
                          <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">{c.formulaBreakdown.toutCanal}% Tout</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.piracyPressureIndex === 'Critique'
                              ? 'bg-red-100 text-red-700 border border-red-200'
                              : 'bg-amber-100 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {c.piracyPressureIndex}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION B : CAS SANS DONNÉES COMMERCIALES (MODE AUTONOME SURVEILLANCE)   */}
      {/* ========================================================================= */}
      {dataMode === 'without_commercial' && (
        <div className="space-y-6">
          {/* 4 CHIFFRES CLÉS BASÉS SUR LE RISQUE THEORIQUE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs">
              <div className="flex items-center justify-between text-[#64748b] mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Manque à Gagner Théorique</span>
                <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
              </div>
              <div className="text-[26px] font-black text-[#dc2626] tracking-tight leading-tight font-mono">
                {Math.round(totalMonthlyLoss / 1000000)}M FCFA
              </div>
              <div className="text-[11px] text-[#64748b] mt-2">
                Calculé selon tarif officiel Formule Sport
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs">
              <div className="flex items-center justify-between text-[#64748b] mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Foyers Illicites Détectés</span>
                <Target className="w-4 h-4 text-[#1e40af]" />
              </div>
              <div className="text-[26px] font-black text-[#0b1c30] tracking-tight leading-tight font-mono">
                {new Intl.NumberFormat('fr-FR').format(totalAudience)}
              </div>
              <div className="text-[11px] text-[#64748b] mt-2">
                Audience pirate active identifiée
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
              <div className="flex items-center justify-between text-emerald-800 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">CA Récupérable Annuel</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-[26px] font-black text-emerald-700 tracking-tight leading-tight font-mono">
                +{Math.round(annualRecoveredFcfa / 1000000)}M FCFA
              </div>
              <div className="text-[11px] text-emerald-800 mt-2 font-medium">
                Simulation active (Conversion {conversionRate}%)
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs">
              <div className="flex items-center justify-between text-[#64748b] mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Rendement Cellule (ROI)</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-[26px] font-black text-[#0b1c30] tracking-tight leading-tight font-mono">
                x{roiRatio}
              </div>
              <div className="text-[11px] text-[#64748b] mt-2">
                1 FCFA investi génère {roiRatio} FCFA estimé
              </div>
            </div>
          </div>

          {/* SIMULATEUR STRATÉGIQUE DE DÉCISION */}
          <div className="bg-white rounded-xl border border-[#0b1c30] shadow-sm p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#f1f5f9] mb-5 gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0b1c30] text-white flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-[#0b1c30]">
                    Simulateur de Gains Prévisionnels (Estimation Avant Raccordement Données Ventes)
                  </h2>
                  <p className="text-[12px] text-[#64748b]">
                    Modélisation des gains potentiels selon l'effort de neutralisation et le taux de conversion.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#1e40af] bg-[#eff6ff] px-2.5 py-1 rounded border border-[#bfdbfe]">
                Modèle Prévisionnel
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="p-3.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-bold text-[#0b1c30]">
                      1. Taux de neutralisation des offres illégales
                    </span>
                    <span className="text-[14px] font-black text-[#1e40af] font-mono">
                      {takedownEfficiency}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="95"
                    step="5"
                    value={takedownEfficiency}
                    onChange={(e) => setTakedownEfficiency(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#cbd5e1] rounded-lg appearance-none cursor-pointer accent-[#0b1c30]"
                  />
                  <div className="flex justify-between text-[10px] text-[#64748b] mt-1">
                    <span>Modéré (groupes Telegram)</span>
                    <span>Offensif (coupures IP + réquisitions Wave/OM)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-bold text-[#0b1c30]">
                      2. Taux de réabonnement légal (clients privés de flux)
                    </span>
                    <span className="text-[14px] font-black text-emerald-600 font-mono">
                      {conversionRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    step="1"
                    value={conversionRate}
                    onChange={(e) => setConversionRate(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#cbd5e1] rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-[10px] text-[#64748b] mt-1">
                    <span>5% (faible frustration)</span>
                    <span>12% (constaté sur grands matchs)</span>
                    <span>25% (forte appétence)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                  <span className="text-[12px] font-bold text-[#0b1c30] block mb-2">
                    3. Formule d'abonnement ciblée
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Formule Accès', price: 5000 },
                      { label: 'Formule Évasion (Sport)', price: 10000 },
                      { label: 'Tout CANAL+', price: 20000 },
                    ].map((f) => (
                      <button
                        key={f.price}
                        onClick={() => setSelectedFormulaPrice(f.price)}
                        className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                          selectedFormulaPrice === f.price
                            ? 'bg-[#0b1c30] text-white border-[#0b1c30] font-bold shadow-xs'
                            : 'bg-white text-[#334155] border-[#cbd5e1] hover:bg-gray-50 text-[11px]'
                        }`}
                      >
                        <div className="text-[11px] font-semibold">{f.label}</div>
                        <div className="text-[12px] font-mono mt-0.5">
                          {new Intl.NumberFormat('fr-FR').format(f.price)} F
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Résultat du simulateur */}
              <div className="bg-[#0b1c30] text-white p-5 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300">
                      Objectif Stratégique
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30">
                      Modélisé
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-[11px] text-gray-400 block">Foyers récupérables estimés</span>
                      <span className="text-[22px] font-bold text-white font-mono">
                        +{new Intl.NumberFormat('fr-FR').format(recoveredSubscribers)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-gray-400 block">Gain mensuel estimé</span>
                      <span className="text-[20px] font-bold text-emerald-400 font-mono">
                        +{formatFcfa(monthlyRecoveredFcfa)}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <span className="text-[11px] text-gray-400 block">Gain annuel potentiel</span>
                      <span className="text-[24px] font-black text-emerald-300 font-mono">
                        +{Math.round(annualRecoveredFcfa / 1000000)} Millions FCFA
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() =>
                    onShowToast(
                      `Objectif sauvegardé : gain prévisionnel de +${Math.round(
                        annualRecoveredFcfa / 1000000
                      )}M FCFA pour arbitrage direction.`
                    )
                  }
                  className="mt-4 w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[12px] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enregistrer cette cible</span>
                </button>
              </div>
            </div>
          </div>

          {/* TABLEAU DES PRIORITÉS PAR FILIALE */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-[#f1f5f9] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-[14px] font-bold text-[#0b1c30]">
                  Cartographie des Risques & Actions Prioritaires par Territoire
                </h3>
                <p className="text-[11px] text-[#64748b] mt-0.5">
                  Cliquez sur une ligne pour ouvrir la fiche décisionnelle complète de la filiale.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[12px]">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                    <th className="py-3 px-4">Pays / Filiale</th>
                    <th className="py-3 px-4">Risque Perte Mensuel</th>
                    <th className="py-3 px-4">Audience Pirate</th>
                    <th className="py-3 px-4">Canal Dominant</th>
                    <th className="py-3 px-4">Points de Vente</th>
                    <th className="py-3 px-4">Action Recommandée</th>
                    <th className="py-3 px-4 text-right">Fiche</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {filteredCountryImpacts.map((item) => (
                    <tr
                      key={item.code}
                      onClick={() => {
                        if (onSelectTerritory) {
                          onSelectTerritory(item.country);
                        } else {
                          setInspectedTerritory(item);
                        }
                      }}
                      className="hover:bg-[#f1f5f9] transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{item.flag}</span>
                          <div>
                            <div className="font-bold text-[#0b1c30] group-hover:text-[#1e40af] transition-colors">
                              {item.country} ({item.code})
                            </div>
                            <div className="text-[10px] text-[#64748b]">
                              {item.majorCities?.slice(0, 2).join(', ')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#dc2626]">
                        {Math.round(item.estimatedLossFcfa / 1000000)}M FCFA
                      </td>
                      <td className="py-3 px-4 font-mono text-[#0b1c30]">
                        {new Intl.NumberFormat('fr-FR').format(item.pirateAudience)}
                      </td>
                      <td className="py-3 px-4 text-[#334155] font-medium">
                        {item.topPirateSource}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#64748b]">
                        {new Intl.NumberFormat('fr-FR').format(item.activeDistributors)} PDV
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold ${
                            item.code === 'SN' || item.code === 'CI'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {item.code === 'SN'
                            ? 'Alerte : Sandaga & Wave SN'
                            : item.code === 'CI'
                            ? 'Alerte : Xtream & Wave CI'
                            : 'Veille : Câblo-réseaux & Sat'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectTerritory) {
                              onSelectTerritory(item.country);
                            } else {
                              setInspectedTerritory(item);
                            }
                          }}
                          className="px-2.5 py-1 rounded bg-[#0b1c30] text-white hover:bg-[#1e40af] text-[11px] font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Consulter</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL POST-ACTION IMPACT DÉTAILLÉ */}
      {selectedOperation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#cbd5e1] shadow-2xl max-w-2xl w-full p-6 space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{selectedOperation.flag}</span>
                <div>
                  <h3 className="text-[17px] font-bold text-[#0b1c30]">{selectedOperation.operationTitle}</h3>
                  <div className="text-[11px] text-[#64748b]">{selectedOperation.country} • {selectedOperation.date}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedOperation(null)}
                className="text-gray-400 hover:text-[#0b1c30] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                <span className="text-[10px] text-red-700 font-bold uppercase block">Chute Piratage</span>
                <span className="text-[20px] font-black text-red-700 font-mono">{selectedOperation.pirateDropPercent}%</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] text-emerald-800 font-bold uppercase block">Rebond Ventes J+7</span>
                <span className="text-[20px] font-black text-emerald-700 font-mono">+{selectedOperation.postActionSalesLiftPercent}%</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                <span className="text-[10px] text-blue-800 font-bold uppercase block">CA Mesuré Gagné</span>
                <span className="text-[20px] font-black text-blue-800 font-mono">+{Math.round(selectedOperation.measuredRevenueLiftFcfa / 1000000)}M F</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-2 text-[12px]">
              <div className="font-bold text-[#0b1c30] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1e40af]" />
                <span>Synthèse Opérationnelle & Commerciale pour la Direction :</span>
              </div>
              <p className="text-[#334155] leading-relaxed">
                {selectedOperation.executiveSummary}
              </p>
              <div className="pt-2 border-t border-[#e2e8f0] flex items-center justify-between text-[11px] text-[#64748b]">
                <span>Périmètre neutralisé : {selectedOperation.takedownScope}</span>
                <span className="font-bold text-emerald-700">{selectedOperation.confidenceScore}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedOperation(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold text-[12px] hover:bg-gray-100 cursor-pointer"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  onShowToast(`Rapport d'impact ${selectedOperation.id} transmis au format Direction`);
                  setSelectedOperation(null);
                }}
                className="px-4 py-2 rounded-lg bg-[#0b1c30] text-white font-bold text-[12px] hover:bg-[#1e40af] flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exporter Fiche Post-Action</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL DÉTAILLÉE DU TERRITOIRE */}
      {inspectedTerritory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#cbd5e1] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="p-5 border-b border-[#e2e8f0] bg-[#0b1c30] text-white flex items-start justify-between rounded-t-2xl">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{inspectedTerritory.flag}</span>
                  <h2 className="text-[18px] font-bold tracking-tight">
                    Fiche Décisionnelle Territoire : {inspectedTerritory.country}
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-white/20 text-white font-mono">
                    {inspectedTerritory.code}
                  </span>
                </div>
                <p className="text-[12px] text-gray-300 mt-1">
                  Diagnostic approfondi et feuille de route opérationnelle pour la filiale {inspectedTerritory.country}.
                </p>
              </div>

              <button
                onClick={() => setInspectedTerritory(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                  <span className="text-[11px] text-[#64748b] block">Manque à gagner mensuel</span>
                  <span className="text-[16px] font-bold text-[#dc2626] font-mono">
                    {Math.round(inspectedTerritory.estimatedLossFcfa / 1000000)}M FCFA
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                  <span className="text-[11px] text-[#64748b] block">Foyers pirates</span>
                  <span className="text-[16px] font-bold text-[#0b1c30] font-mono">
                    {new Intl.NumberFormat('fr-FR').format(inspectedTerritory.pirateAudience)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                  <span className="text-[11px] text-[#64748b] block">Taux réabonnement</span>
                  <span className="text-[16px] font-bold text-emerald-600 font-mono">
                    {inspectedTerritory.conversionRate}%
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                  <span className="text-[11px] text-[#64748b] block">Enquêtes actives</span>
                  <span className="text-[16px] font-bold text-[#1e40af] font-mono">
                    {inspectedTerritory.activeInvestigations} dossiers
                  </span>
                </div>
              </div>

              {/* Hotspots et paiements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-[#e2e8f0] bg-white">
                  <div className="flex items-center gap-2 mb-3 text-[#0b1c30] font-bold text-[13px]">
                    <MapPin className="w-4 h-4 text-[#1e40af]" />
                    <span>Points chauds de vente illégale</span>
                  </div>
                  <div className="space-y-1.5">
                    {inspectedTerritory.keyHotspots?.map((spot, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-[12px] text-[#334155] p-1.5 rounded bg-gray-50 border border-gray-100"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        <span className="font-medium">{spot}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#e2e8f0] bg-white">
                  <div className="flex items-center gap-2 mb-3 text-[#0b1c30] font-bold text-[13px]">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Moyens de Paiement Informels</span>
                  </div>
                  <div className="space-y-2 text-[12px]">
                    <div className="flex flex-wrap gap-1.5">
                      {inspectedTerritory.dominantPaymentMethods?.map((pm, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium font-mono"
                        >
                          {pm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#e2e8f0] bg-gray-50 flex items-center justify-between rounded-b-2xl">
              <span className="text-[11px] text-[#64748b]">
                Filiale {inspectedTerritory.country}
              </span>
              <button
                onClick={() => setInspectedTerritory(null)}
                className="px-4 py-1.5 rounded-lg bg-[#0b1c30] text-white text-[12px] font-bold hover:bg-[#1e40af] cursor-pointer"
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
