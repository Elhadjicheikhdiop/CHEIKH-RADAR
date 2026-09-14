import React, { useState, useMemo } from 'react';
import {
  Download,
  Sliders,
  CheckCircle2,
  MapPin,
  TrendingUp,
  X,
  ShieldAlert,
  Users,
  Database,
  Zap,
  Coins,
  Tv2,
  Lock,
  Clock,
  Wallet,
  Smartphone,
  ChevronRight,
} from 'lucide-react';
import {
  mockCountryBusinessImpacts,
  mockCommercialCountryMetrics,
  mockPostActionImpacts,
  PostActionImpactRecord,
} from '../data/marketData';

interface MarketAnalysisPageProps {
  onShowToast: (msg: string) => void;
  onSelectTerritory?: (countryName: string) => void;
}

export const MarketAnalysisPage: React.FC<MarketAnalysisPageProps> = ({ onShowToast, onSelectTerritory }) => {
  // Filtre Pays / Filiale
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('all');
  
  // Modal fiche opération
  const [selectedOperation, setSelectedOperation] = useState<PostActionImpactRecord | null>(null);

  // Curseur du simulateur (vulgarisé & 100% mensuel)
  const [takedownEfficiency, setTakedownEfficiency] = useState<number>(70); // % de coupures réussies
  const [conversionRate, setConversionRate] = useState<number>(12); // % qui s'abonnent
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

  // Totaux : Audience pirate observée
  const totalAudience = useMemo(() => {
    return filteredCountryImpacts.reduce((sum, c) => sum + c.pirateAudience, 0);
  }, [filteredCountryImpacts]);

  const totalIptvAudience = useMemo(() => {
    return filteredCountryImpacts.reduce((sum, c) => sum + (c.iptvAudience || 0), 0);
  }, [filteredCountryImpacts]);

  // Simulation pas-à-pas
  const peopleBlocked = Math.round(totalAudience * (takedownEfficiency / 100));
  const recoveredSubscribers = Math.round(peopleBlocked * (conversionRate / 100));
  const monthlyRecoveredFcfa = recoveredSubscribers * selectedFormulaPrice;
  const ltvRecoveredFcfa = monthlyRecoveredFcfa * 4.5; // Rétention moyenne de 4,5 mois

  // Vrais chiffres commerciaux CHEIKH +
  const totalRealSubscribers = useMemo(() => {
    return filteredCommercialMetrics.reduce((sum, c) => sum + c.activeSubscribers, 0);
  }, [filteredCommercialMetrics]);

  const totalRealNewSubs = useMemo(() => {
    return filteredCommercialMetrics.reduce((sum, c) => sum + c.monthlyNewSubscriptions, 0);
  }, [filteredCommercialMetrics]);

  const totalMonthlyLiftRevenue = useMemo(() => {
    return filteredPostActionImpacts.reduce((sum, op) => sum + op.monthlyRevenueLiftFcfa, 0);
  }, [filteredPostActionImpacts]);

  const totalLtvRevenueLift = useMemo(() => {
    return filteredPostActionImpacts.reduce((sum, op) => sum + (op.ltvRetentionFcfa || op.monthlyRevenueLiftFcfa * 4.5), 0);
  }, [filteredPostActionImpacts]);

  const totalAdditionalRecruits = useMemo(() => {
    return filteredPostActionImpacts.reduce((sum, op) => sum + op.monthlyNewSubscribersGained, 0);
  }, [filteredPostActionImpacts]);

  const formatNumber = (num: number) => new Intl.NumberFormat('fr-FR').format(num);

  const handleExport = () => {
    onShowToast('Rapport d\'impact business exporté.');
  };

  return (
    <div className="flex flex-col w-full pb-12" id="market-bi-dashboard">
      
      {/* 1. EN-TÊTE DE LA PAGE */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#e2e8f0] mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[20px] font-bold text-[#0b1c30] tracking-tight">
              Intelligence Marché & Filiales
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Performance Commerciale & Monétisation
            </span>
          </div>
          <p className="text-[13px] text-[#64748b] mt-0.5">
            Mesure des abonnements gagnés, du chiffre d'affaires généré par le blocage des flux pirates et du gel des paiements illégaux (Wave & Orange Money) par filiale.
          </p>
        </div>

        {/* Filtre Filiale & Export */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white border border-[#cbd5e1] rounded-lg px-3 py-1.5 shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-[#64748b]" />
            <select
              value={selectedCountryCode}
              onChange={(e) => setSelectedCountryCode(e.target.value)}
              className="text-[12px] font-semibold text-[#0b1c30] bg-transparent outline-none cursor-pointer"
            >
              <option value="all">Toutes les filiales (Panafrique)</option>
              <option value="SN">Sénégal (SN)</option>
              <option value="CI">Côte d'Ivoire (CI)</option>
              <option value="CM">Cameroun (CM)</option>
              <option value="ML">Mali (ML)</option>
              <option value="GA/CD">Gabon & RDC (GA/CD)</option>
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

      {/* CONTENU GLOBAL */}
      <div className="space-y-8">

        {/* SECTION 1 : CHIFFRES CLÉS ET IMPACTS DIRECTS */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <h2 className="text-[16px] font-bold text-[#0b1c30]">
                Indicateurs Commerciaux & Abonnements Récupérés
              </h2>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
              <span>Conversion observée : ~11% des foyers coupés s'abonnent</span>
            </span>
          </div>

          {/* 4 Cartes d'Impact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            
            <div className="bg-white p-3.5 rounded-xl border border-[#e2e8f0] shadow-2xs">
              <div className="flex items-center justify-between text-[#64748b] text-[11px] font-bold uppercase mb-1">
                <span>Abonnés Actifs</span>
                <Users className="w-3.5 h-3.5 text-[#1e40af]" />
              </div>
              <div className="text-[20px] font-black text-[#0b1c30] font-mono">
                {formatNumber(totalRealSubscribers)}
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                Parc souscriptions officielles
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#e2e8f0] shadow-2xs">
              <div className="flex items-center justify-between text-[#64748b] text-[11px] font-bold uppercase mb-1">
                <span>Nouvelles Ventes / Mois</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-[20px] font-black text-emerald-700 font-mono">
                +{formatNumber(totalRealNewSubs)}
              </div>
              <div className="text-[10px] text-[#64748b] mt-1">
                Recrutements mensuels
              </div>
            </div>

            {/* Gain Cash Mensuel (Mois 1) */}
            <div className="bg-white p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/40 shadow-2xs">
              <div className="flex items-center justify-between text-emerald-800 text-[11px] font-bold uppercase mb-1">
                <span>Gain Mois 1</span>
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-[20px] font-black text-emerald-700 font-mono">
                +{Math.round(totalMonthlyLiftRevenue / 1000000)}M FCFA
              </div>
              <div className="text-[10px] text-emerald-800 font-medium mt-1">
                +{formatNumber(totalAdditionalRecruits)} clients gagnés
              </div>
            </div>

            {/* Revenu Estimé sur 4.5 mois */}
            <div className="bg-white p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/20 shadow-2xs">
              <div className="flex items-center justify-between text-emerald-800 text-[11px] font-bold uppercase mb-1">
                <span>Revenu Cumulé (4,5 mois)</span>
                <Coins className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <div className="text-[20px] font-black text-emerald-800 font-mono">
                +{(totalLtvRevenueLift / 1000000).toFixed(0)}M FCFA
              </div>
              <div className="text-[10px] text-emerald-700 font-medium mt-1 truncate">
                Durée moyenne d'abonnement
              </div>
            </div>

          </div>

          {/* TABLEAU DES OPÉRATIONS DE BLOCAGE */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-[#f1f5f9] flex items-center justify-between">
              <div>
                <h3 className="text-[13px] font-bold text-[#0b1c30]">
                  Bilan Synthétique des Opérations de Blocage & Gains Financiers
                </h3>
                <p className="text-[11px] text-[#64748b] mt-0.5">
                  Chaque abonné récupéré génère environ 45 000 FCFA sur sa durée moyenne de réabonnement (4,5 mois).
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] font-bold text-[#64748b]">
                    <th className="py-2.5 px-4">Filiale / Pays</th>
                    <th className="py-2.5 px-4">Opération</th>
                    <th className="py-2.5 px-4">Vitesse d'Intervention</th>
                    <th className="py-2.5 px-4">Clients Gagnés</th>
                    <th className="py-2.5 px-4">Gain Mois 1</th>
                    <th className="py-2.5 px-4">Revenu sur 4,5 mois</th>
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
                      <td className="py-2.5 px-4 font-bold text-[#1e40af]">
                        <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-[11px]">
                          ⚡ {op.liveReactivityMttr}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-emerald-700">
                        +{formatNumber(op.monthlyNewSubscribersGained)}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-emerald-700">
                        +{Math.round(op.monthlyRevenueLiftFcfa / 1000000)}M FCFA
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-[#0b1c30]">
                        <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          +{(op.ltvRetentionFcfa / 1000000).toFixed(1)}M FCFA
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedOperation(op)}
                          className="px-2.5 py-1 rounded bg-[#0b1c30] text-white hover:bg-[#1e40af] text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Voir la fiche
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SECTION 2 : AUDIENCE PIRATE & SIMULATEUR DE CONVERSION */}
        <div className="space-y-6 pt-6 border-t border-[#e2e8f0]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#dc2626]" />
              <h2 className="text-[16px] font-bold text-[#0b1c30]">
                Volume de Piratage & Potentiel de Conversion
              </h2>
            </div>
          </div>

          {/* Cartouche d'audience IPTV */}
          <div className="bg-white p-4.5 rounded-xl border border-red-200 shadow-2xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-red-50 text-red-600">
                  <Tv2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[14px] text-[#0b1c30]">Streaming & IPTV (Applications, Web, Réseaux Sociaux)</h3>
                  <div className="text-[11px] text-[#64748b]">Diffusion illégale de chaînes & événements sportifs en direct</div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-red-100 text-red-800 rounded">
                Gisement Principal
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-3 pt-3 border-t border-gray-100 text-[12px]">
              <div>
                <span className="text-[#64748b] text-[11px] block">Utilisateurs Pirates Détectés :</span>
                <span className="font-mono font-bold text-[18px] text-[#dc2626]">
                  {formatNumber(totalIptvAudience)} foyers
                </span>
              </div>
              <div>
                <span className="text-[#64748b] text-[11px] block">Offre Recommandée :</span>
                <span className="font-bold text-[#0b1c30]">Formule Évasion Sport (10 000 FCFA)</span>
              </div>
              <div>
                <span className="text-[#64748b] text-[11px] block">Taux de Conversion Estimé :</span>
                <span className="font-bold text-emerald-700">8% à 12% après blocage</span>
              </div>
              <div>
                <span className="text-[#64748b] text-[11px] block">Manque à Gagner Mensuel :</span>
                <span className="font-mono font-bold text-[#0b1c30]">
                  ~{Math.round(totalIptvAudience * 10000 / 1000000)}M FCFA / mois
                </span>
              </div>
            </div>
          </div>

          {/* SIMULATEUR SIMPLE DE REBOND COMMERCIAL */}
          <div className="bg-white rounded-xl border border-[#0b1c30] shadow-sm p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#f1f5f9] mb-4 gap-2.5">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#0b1c30]" />
                <h3 className="text-[15px] font-bold text-[#0b1c30]">
                  Simulateur de Rebond Commercial & Gains Financiers
                </h3>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedFormulaPrice(10000)}
                  className={`px-3 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                    selectedFormulaPrice === 10000
                      ? 'bg-[#0b1c30] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Formule Évasion Sport (10 000 FCFA)
                </button>
                <button
                  onClick={() => setSelectedFormulaPrice(5000)}
                  className={`px-3 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                    selectedFormulaPrice === 5000
                      ? 'bg-[#0b1c30] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Formule Access (5 000 FCFA)
                </button>
              </div>
            </div>

            {/* 3 Étapes du Simulateur */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              
              {/* Étape 1 : Coupure */}
              <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Étape 1 : Taux de Blocage</span>
                    <span className="text-[14px] font-bold text-[#1e40af] font-mono">{takedownEfficiency}% coupés</span>
                  </div>
                  <div className="font-bold text-[13px] text-[#0b1c30] mb-1">
                    Part des flux pirates effectivement neutralisés
                  </div>
                  <p className="text-[11px] text-[#64748b] mb-3">
                    Inaccessibilité des liens Web, applications et diffusions sociales.
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
                  <div className="text-[11px] font-semibold text-[#0b1c30] mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0b1c30]"></span>
                    <span>{formatNumber(peopleBlocked)} personnes privées de signal</span>
                  </div>
                </div>
              </div>

              {/* Étape 2 : Conversion */}
              <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Étape 2 : Conversion Légale</span>
                    <span className="text-[14px] font-bold text-emerald-700 font-mono">{conversionRate}% convertis</span>
                  </div>
                  <div className="font-bold text-[13px] text-[#0b1c30] mb-1">
                    Clients qui souscrivent un abonnement officiel
                  </div>
                  <p className="text-[11px] text-[#64748b] mb-3">
                    Abonnements souscrits suite à l'interruption du piratage.
                  </p>
                </div>
                <div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={conversionRate}
                    onChange={(e) => setConversionRate(Number(e.target.value))}
                    className="w-full h-2 bg-[#cbd5e1] rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="text-[11px] font-semibold text-emerald-700 mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>+{formatNumber(recoveredSubscribers)} nouveaux abonnés CHEIKH +</span>
                  </div>
                </div>
              </div>

              {/* Étape 3 : Chiffre d'Affaires */}
              <div className="bg-white border border-emerald-300 p-4 rounded-xl flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      Chiffre d'Affaires Généré
                    </span>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Rétention 4,5 mois
                    </span>
                  </div>
                  <div className="font-bold text-[13px] text-[#0b1c30] mb-1">
                    Revenu Immédiat vs Revenu Cumulé
                  </div>
                  <div className="text-[11px] text-[#64748b] mb-2">
                    {formatNumber(recoveredSubscribers)} abonnés × {formatNumber(selectedFormulaPrice)} FCFA
                  </div>
                </div>

                <div className="pt-2 border-t border-[#f1f5f9] space-y-2">
                  <div>
                    <div className="text-[10px] text-[#64748b]">Gain direct Mois 1 :</div>
                    <div className="text-[18px] font-black text-emerald-700 font-mono">
                      +{Math.round(monthlyRecoveredFcfa / 1000000)} Millions FCFA / mois
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200 text-[11px]">
                    <div className="text-emerald-900 font-bold flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Revenu cumulé estimé sur 4,5 mois :</span>
                    </div>
                    <div className="text-[16px] font-black text-emerald-800 font-mono mt-0.5">
                      +{(ltvRecoveredFcfa / 1000000).toFixed(1)} Millions FCFA
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* TABLEAU DES FILIALES & COLLABORATION MOBILE MONEY */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-[#f1f5f9] flex items-center justify-between">
              <div>
                <h3 className="text-[13px] font-bold text-[#0b1c30]">
                  Répartition par Filiale & Gel des Flux Mobile Money (Wave / Orange Money)
                </h3>
                <p className="text-[11px] text-[#64748b] mt-0.5">
                  Principaux moyens de paiement interceptés et statut du blocage judiciaire des comptes marchands pirates.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] font-bold text-[#64748b]">
                    <th className="py-2.5 px-4">Filiale / Pays</th>
                    <th className="py-2.5 px-4">Foyers Pirates Estimés</th>
                    <th className="py-2.5 px-4">Manque à Gagner Mensuel</th>
                    <th className="py-2.5 px-4">Moyen de Paiement Intercepté</th>
                    <th className="py-2.5 px-4">Statut Gel FinTech</th>
                    <th className="py-2.5 px-4 text-right">Fiche Filiale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {filteredCountryImpacts.map((c) => (
                    <tr key={c.code} className="hover:bg-[#f8fafc]">
                      <td className="py-2.5 px-4 font-bold text-[#0b1c30]">
                        <div className="flex items-center gap-1.5">
                          <span>{c.flag}</span>
                          <span>{c.country}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-[#dc2626]">
                        {formatNumber(c.pirateAudience)} foyers
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-[#0b1c30]">
                        {Math.round(c.estimatedLossFcfa / 1000000)}M FCFA / mois
                      </td>
                      <td className="py-2.5 px-4 text-[#334155]">
                        <div className="font-semibold flex items-center gap-1">
                          <Smartphone className="w-3.5 h-3.5 text-blue-700" />
                          <span>{c.dominantPaymentMethods[0]}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-1.5 text-[11px] text-blue-900 font-semibold bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                          <Lock className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                          <span>{c.fintechCollaborationStatus}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        {onSelectTerritory && (
                          <button
                            onClick={() => onSelectTerritory(c.country)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#f8fafc] hover:bg-[#0b1c30] text-[#0b1c30] hover:text-white border border-[#cbd5e1] text-[11px] font-bold transition-all cursor-pointer"
                          >
                            <span>Détails</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL FICHE D'OPÉRATION */}
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

            {/* Explication Simple */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[12px] text-emerald-950 space-y-1.5">
              <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                Pourquoi le rebond commercial a eu lieu :
              </span>
              <p className="leading-relaxed">{selectedOperation.whyItWorked}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">Abonnés Récupérés</span>
                <span className="text-[18px] font-black text-emerald-700 font-mono">
                  +{formatNumber(selectedOperation.monthlyNewSubscribersGained)}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">Gain Mois 1</span>
                <span className="text-[18px] font-black text-[#0b1c30] font-mono">
                  +{Math.round(selectedOperation.monthlyRevenueLiftFcfa / 1000000)}M FCFA
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-950">
              <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-0.5">
                <Wallet className="w-3.5 h-3.5 text-amber-700" />
                <span>Revenu estimé sur 4,5 mois (durée moyenne de réabonnement) :</span>
              </div>
              <div className="text-[16px] font-black text-amber-900 font-mono">
                +{(selectedOperation.ltvRetentionFcfa / 1000000).toFixed(1)} Millions FCFA
              </div>
              <p className="text-[10px] text-amber-800 mt-1">
                Calculé d'après la réabonnement moyen de 4,5 mois constaté sur les clients recrutés.
              </p>
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
