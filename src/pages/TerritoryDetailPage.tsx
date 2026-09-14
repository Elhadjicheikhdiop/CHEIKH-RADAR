import React, { useState } from 'react';
import { Threat, ThreatStatus } from '../types';
import {
  ChevronRight,
  MapPin,
  ArrowLeft,
  ShieldAlert,
  Users,
  Radio,
  Building2,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  FileDown,
  ArrowRight,
  Target,
  Sliders,
  TrendingUp,
  FileSpreadsheet,
  Globe,
  Search,
  Database,
  BarChart3,
  Calendar,
  Share2,
} from 'lucide-react';
import { mockFieldSurveys, mockBlackMarketPrices } from '../data/marketData';

export interface TerritoryDetailData {
  country: string;
  code: string;
  flag: string;
  streams: number;
  percentage: string;
  audience: string;
  providers: string;
  urgency: 'Critique' | 'Élevée' | 'Moyenne' | 'Sous surveillance';
  capitalOrMajorHub: string;
  activeTelecoms: string[];
  pirateHotspots: string[];
  dominantPaymentMethods: string[];
  averagePiratePrice: string;
  monthlyLossFcfa: string;
  activeInvestigations: number;
  // Données d'analyse & pistes soumises à la direction
  analyticalObservations: {
    theme: string;
    diagnostic: string;
    impactBusiness: string;
    suggestedTrack: string;
    department: 'Commercial' | 'Juridique / Régulation' | 'Opérations Réseau';
  }[];
}

export const territoryProfiles: Record<string, TerritoryDetailData> = {
  Sénégal: {
    country: 'Sénégal',
    code: 'SN',
    flag: '🇸🇳',
    streams: 41,
    percentage: '29%',
    audience: '~19 200 spectateurs',
    providers: 'Sonatel (Orange), Free Sénégal, Expresso',
    urgency: 'Critique',
    capitalOrMajorHub: 'Dakar & Thiès',
    activeTelecoms: ['Sonatel (Orange)', 'Free Sénégal', 'Expresso'],
    pirateHotspots: [
      'Marché Sandaga (Dakar Plateau) — Boîtiers Android flashés et clés IPTV',
      'Pikine Icotaf & Guédiawaye — Vente d\'abonnements IPTV pirate via WhatsApp',
      'Gueule Tapée / Médina — Partage de codes et comptes illégaux',
      'Marché HLM — Revente de clés IPTV configurées',
    ],
    dominantPaymentMethods: ['Wave Sénégal (79%)', 'Orange Money SN (21%)'],
    averagePiratePrice: '20 000 FCFA / an',
    monthlyLossFcfa: '295 Millions FCFA',
    activeInvestigations: 14,
    analyticalObservations: [
      {
        theme: 'Vecteur de vente physique & boîtiers flashés',
        diagnostic: 'Forte concentration d\'échoppes physiques à Sandaga et Pikine commercialisant des box Android pré-paramétrées (abonnement 1 an inclus).',
        impactBusiness: 'Érosion directe des recrutements d\'abonnés sur la région Dakar.',
        suggestedTrack: 'Rapport d\'identification transmis au service juridique pour préparation des dossiers de saisie Douane / DSC.',
        department: 'Juridique / Régulation',
      },
      {
        theme: 'Traçabilité des flux Mobile Money',
        diagnostic: '79% des transactions illicites répertoriées convergent vers 9 comptes marchands Wave SN identifiés par l\'analyse de veille.',
        impactBusiness: 'Alimente l\'économie souterraine des revendeurs sans friction de paiement.',
        suggestedTrack: 'Consolidation du listing des identifiants marchands pour demande de réquisition officielle.',
        department: 'Juridique / Régulation',
      },
      {
        theme: 'Blocage d\'accès FAI locaux lors des directs',
        diagnostic: 'Sonatel et Free concentrent plus de 88% du trafic IP acheminant les panels Xtream lors des matchs de CAN et UEFA.',
        impactBusiness: 'Pics de consommation de bande passante pirate lors des rencontres phares.',
        suggestedTrack: 'Mise à disposition aux équipes techniques des listes IP/DNS qualifiées pour les protocoles de filtrage.',
        department: 'Opérations Réseau',
      },
      {
        theme: 'Écart tarifaire perçu par le public',
        diagnostic: 'Le pack pirate à 20 000 FCFA/an est perçu comme 6 fois plus accessible que l\'offre officielle sans flexibilité mensuelle.',
        impactBusiness: 'Frein majeur à la reconversion des foyers pirates vers les formules légales.',
        suggestedTrack: 'Données transmises à l\'équipe Marketing pour étude d\'une formule d\'entrée de gamme ou d\'un pass match flexible.',
        department: 'Commercial',
      },
    ],
  },
  "Côte d'Ivoire": {
    country: "Côte d'Ivoire",
    code: 'CI',
    flag: '🇨🇮',
    streams: 36,
    percentage: '25%',
    audience: '~16 500 spectateurs',
    providers: 'Orange CI, MTN Côte d\'Ivoire, Moov Africa',
    urgency: 'Critique',
    capitalOrMajorHub: 'Abidjan & Bouaké',
    activeTelecoms: ['Orange Côte d\'Ivoire', 'MTN CI', 'Moov Africa CI'],
    pirateHotspots: [
      'Marché de Treichville (Abidjan) — Revente de serveurs IPTV Xtream',
      'Adjamé Black Market — Décodeurs satellites modifiés & clés USB IPTV',
      'Yopougon Siporex — Points de vente informels et recharges',
      'Marcory & Koumassi — Réseaux câblés pirates de quartier',
    ],
    dominantPaymentMethods: ['Wave CI (58%)', 'Orange Money CI (34%)', 'MTN MoMo (8%)'],
    averagePiratePrice: '22 000 FCFA / an',
    monthlyLossFcfa: '335 Millions FCFA',
    activeInvestigations: 19,
    analyticalObservations: [
      {
        theme: 'Câblodistribution pirate dans les quartiers populaires',
        diagnostic: 'À Yopougon et Koumassi, des opérateurs informels repiquent le signal par satellite et le redistribuent en câble coaxial moyennant 3 000 FCFA/mois.',
        impactBusiness: 'Captation massive de centaines de foyers groupés par quartier.',
        suggestedTrack: 'Cartographie géographique fournie aux équipes de direction locale pour orientation des plaintes formelles.',
        department: 'Juridique / Régulation',
      },
      {
        theme: 'Domination du streaming mobile & APK',
        diagnostic: '41% de l\'audience pirate ivoirienne passe désormais par des applications Android APK diffusées via des groupes Telegram et TikTok Live.',
        impactBusiness: 'Audience jeune et ultra-connectée 4G contournant le décodeur de salon.',
        suggestedTrack: 'Suivi statistique hebdomadaire de la viralité TikTok/Telegram pour les briefs marketing digital.',
        department: 'Commercial',
      },
      {
        theme: 'Circuits de paiement Wave & Orange Money CI',
        diagnostic: 'Recharges effectuées majoritairement par sous-agents de quartier non identifiés.',
        impactBusiness: 'Difficulté d\'identification sans réquisition formelle auprès de l\'ARTCI.',
        suggestedTrack: 'Fiche de synthèse remise au pôle conformité pour étayer les dossiers de signalement.',
        department: 'Juridique / Régulation',
      },
    ],
  },
  Cameroun: {
    country: 'Cameroun',
    code: 'CM',
    flag: '🇨🇲',
    streams: 28,
    percentage: '20%',
    audience: '~11 800 spectateurs',
    providers: 'MTN Cameroun, Orange Cameroun, Camtel',
    urgency: 'Élevée',
    capitalOrMajorHub: 'Douala & Yaoundé',
    activeTelecoms: ['MTN Cameroun', 'Orange Cameroun', 'Camtel'],
    pirateHotspots: [
      'Marché Central de Douala — Boîtiers pirates et clés pré-configurées',
      'Mokolo (Yaoundé) — Échoppes informelles et recharges pirates',
      'Akwa & Bonabéri — Petits câblo-opérateurs de quartier illégaux',
      'Bafoussam — Distribution locale par clés USB et serveurs FTP',
    ],
    dominantPaymentMethods: ['MTN Mobile Money CM (64%)', 'Orange Money CM (36%)'],
    averagePiratePrice: '18 000 FCFA / an',
    monthlyLossFcfa: '165 Millions FCFA',
    activeInvestigations: 8,
    analyticalObservations: [
      {
        theme: 'Réseaux câblés artisanaux Douala & Yaoundé',
        diagnostic: 'Recrudescence des réseaux locaux réinjectant le bouquet Sport CHEIKH + à l\'échelle de micro-quartiers.',
        impactBusiness: 'Manque à gagner récurrent estimé à 165M FCFA mensuels.',
        suggestedTrack: 'Documentation technique des boîtiers injecteurs relevés pour communication à la direction de filiale.',
        department: 'Juridique / Régulation',
      },
      {
        theme: 'Prépondérance de MTN Mobile Money',
        diagnostic: 'Près des 2/3 des transactions passent par MTN MoMo avec des intitulés de transfert anodins ("Achat matériel").',
        impactBusiness: 'Volume important de flux financiers difficilement traçables sans croisement de données.',
        suggestedTrack: 'Maintien de la base de numéros de collecte suspects pour transmission au département conformité.',
        department: 'Commercial',
      },
    ],
  },
  'Mali & Guinée': {
    country: 'Mali & Guinée',
    code: 'ML/GN',
    flag: '🇲🇱🇬🇳',
    streams: 19,
    percentage: '13%',
    audience: '~7 400 spectateurs',
    providers: 'Orange Mali, Malitel (Moov), Orange Guinée',
    urgency: 'Moyenne',
    capitalOrMajorHub: 'Bamako & Conakry',
    activeTelecoms: ['Orange Mali', 'Malitel', 'Orange Guinée', 'MTN Guinée'],
    pirateHotspots: [
      'Grand Marché de Bamako & Dabanani — Décodeurs satellites patchés',
      'Madina (Conakry) — Équipements de contournement satellite et IPTV',
      'Badalabougou (Bamako) — Boutiques informatiques flashant les box',
    ],
    dominantPaymentMethods: ['Orange Money ML (72%)', 'Moov Money (28%)'],
    averagePiratePrice: '15 000 FCFA / an',
    monthlyLossFcfa: '110 Millions FCFA',
    activeInvestigations: 6,
    analyticalObservations: [
      {
        theme: 'Décodeurs satellites modifiés (Dongles & patchs)',
        diagnostic: 'Marché dominé par des récepteurs satellite non connectés utilisant le partage de clés (IKS/SKS).',
        impactBusiness: 'Piratage hors d\'atteinte des coupures DNS internet classiques.',
        suggestedTrack: 'Rapport d\'analyse technique sur les protocoles de chiffrement transmis aux ingénieurs broadcast.',
        department: 'Opérations Réseau',
      },
      {
        theme: 'Sensibilité au prix et modèle prépayé',
        diagnostic: 'Faible taux de bancarisation, préférence exclusive pour le paiement par mobile au forfait très court.',
        impactBusiness: 'Les abonnements annuels sont jugés inaccessibles pour la majorité des prospects.',
        suggestedTrack: 'Transmission des statistiques d\'usage au Marketing pour simulation d\'une offre hebdomadaire.',
        department: 'Commercial',
      },
    ],
  },
  'RDC & Gabon': {
    country: 'RDC & Gabon',
    code: 'CD/GA',
    flag: '🇨🇩🇬🇦',
    streams: 18,
    percentage: '13%',
    audience: '~6 900 spectateurs',
    providers: 'Airtel Gabon, Vodacom RDC, Orange RDC, Gabon Telecom',
    urgency: 'Moyenne',
    capitalOrMajorHub: 'Kinshasa & Libreville',
    activeTelecoms: ['Vodacom RDC', 'Airtel Gabon', 'Orange RDC', 'Moov Gabon Telecom'],
    pirateHotspots: [
      'Marché Central de Kinshasa & Rond-point Victoire — Réseaux pirates',
      'Marché Mont-Bouët (Libreville) — Boîtiers IPTV Android chinois',
      'Lubumbashi & Goma — Réseaux câblés artisanaux repiquant le signal',
    ],
    dominantPaymentMethods: ['Airtel Money (55%)', 'M-Pesa Vodacom (35%)', 'Orange Money (10%)'],
    averagePiratePrice: '24 000 FCFA / an',
    monthlyLossFcfa: '98 Millions FCFA',
    activeInvestigations: 7,
    analyticalObservations: [
      {
        theme: 'Distribution informelle à Kinshasa (Victoire / Marché Central)',
        diagnostic: 'Réseaux de revente artisanaux très disséminés, combinant clés USB préchargées et box IPTV.',
        impactBusiness: 'Fort potentiel d\'audience captive sans alternative officielle abordable.',
        suggestedTrack: 'Production d\'un état statistique consolidé pour éclairer les décisions de distribution de la filiale RDC.',
        department: 'Commercial',
      },
      {
        theme: 'Paiements Airtel Money & M-Pesa',
        diagnostic: 'Paiement quasi-systématique par monnaie électronique avec validation par SMS.',
        impactBusiness: 'Traçabilité possible des bénéficiaires finaux par recoupement.',
        suggestedTrack: 'Alimentation continue du registre des comptes suspects pour le pôle juridique.',
        department: 'Juridique / Régulation',
      },
    ],
  },
  'Serveurs & VPN Externes': {
    country: 'Serveurs & VPN Externes',
    code: 'INT',
    flag: '',
    streams: 12,
    percentage: '8%',
    audience: '~5 100 spectateurs',
    providers: 'Cloudflare, OVHcloud, Hostinger, DigitalOcean',
    urgency: 'Sous surveillance',
    capitalOrMajorHub: 'Hébergement Hors-Zone (Europe / US / Asie)',
    activeTelecoms: ['Transit IP internationaux', 'Réseaux CDN'],
    pirateHotspots: [
      'Data Centers aux Pays-Bas, Allemagne et France',
      'Serveurs de rebond avec masquage Cloudflare',
      'Proxies et tunnels VPN contournant les géoblocages',
    ],
    dominantPaymentMethods: ['Cryptomonnaies (USDT/BTC)', 'Cartes bancaires virtuelles'],
    averagePiratePrice: '45 € / an (env. 30 000 FCFA)',
    monthlyLossFcfa: '45 Millions FCFA',
    activeInvestigations: 5,
    analyticalObservations: [
      {
        theme: 'Infrastructures d\'hébergement offshore & CDN',
        diagnostic: 'Utilisation de serveurs de relais en Europe et masquage d\'adresses par reverse-proxy Cloudflare.',
        impactBusiness: 'Difficulté technique à remonter jusqu\'à la source du flux sans analyse forensique.',
        suggestedTrack: 'Enrichissement des données de traçage et horodatage pour constitution des fiches de signalement hébergeur.',
        department: 'Opérations Réseau',
      },
    ],
  },
};

interface TerritoryDetailPageProps {
  countryName: string;
  threats: Threat[];
  onNavigateBack: () => void;
  onSelectThreat: (threatId: string) => void;
  onUpdateStatus?: (threatId: string, newStatus: ThreatStatus) => void;
  onOpenPdfExport?: (threat: Threat) => void;
  onShowToast: (msg: string) => void;
}

export const TerritoryDetailPage: React.FC<TerritoryDetailPageProps> = ({
  countryName,
  threats,
  onNavigateBack,
  onSelectThreat,
  onOpenPdfExport,
  onShowToast,
}) => {
  // Récupération des données de la filiale
  const territory = territoryProfiles[countryName] || {
    country: countryName,
    code: countryName.slice(0, 2).toUpperCase(),
    flag: '',
    streams: 15,
    percentage: '10%',
    audience: '~5 000 spectateurs',
    providers: 'Opérateurs locaux',
    urgency: 'Moyenne' as const,
    capitalOrMajorHub: 'Pôle régional',
    activeTelecoms: ['Opérateurs régionaux'],
    pirateHotspots: ['Marchés urbains informels', 'Réseaux de quartier'],
    dominantPaymentMethods: ['Mobile Money local'],
    averagePiratePrice: '20 000 FCFA / an',
    monthlyLossFcfa: '50 Millions FCFA',
    activeInvestigations: 3,
    analyticalObservations: [
      {
        theme: 'Collecte et veille continue',
        diagnostic: 'Surveillance active des sources de données locales et forums pour consolider la volumétrie.',
        impactBusiness: 'Mesure de l\'audience et de l\'exposition de la filiale.',
        suggestedTrack: 'Poursuite de la structuration des données statistiques.',
        department: 'Commercial' as const,
      },
    ],
  };

  // Menaces associées à ce pays
  const territoryThreats = threats.filter((t) => {
    if (countryName === 'Serveurs & VPN Externes') {
      return !t.country || t.country === 'International' || t.country === 'Serveurs & VPN Externes';
    }
    if (countryName === 'Mali & Guinée') {
      return t.country === 'Mali' || t.country?.includes('Guin') || t.countryCode === 'ML';
    }
    if (countryName === 'RDC & Gabon') {
      return t.country?.includes('RDC') || t.country?.includes('Gabon') || t.countryCode === 'CD' || t.countryCode === 'GA';
    }
    return t.country === countryName || t.countryCode === territory.code;
  });

  // Enquêtes terrain liées à cette filiale
  const relatedSurveys = mockFieldSurveys.filter((s) => {
    if (territory.country === 'Sénégal') return s.city.toLowerCase().includes('dakar');
    if (territory.country === "Côte d'Ivoire") return s.city.toLowerCase().includes('abidjan');
    if (territory.country === 'Cameroun') return s.city.toLowerCase().includes('douala');
    return true;
  });

  const [activeTab, setActiveTab] = useState<'threats' | 'analysis_tracks' | 'field_intelligence'>('threats');

  const handleExportData = () => {
    // Export des données statistiques structurées
    const headers = ['Filiale_Pays', 'Code', 'Flux_Recenses', 'Part_Trafic', 'Audience_Estimee', 'Manque_A_Gagner_FCFA', 'Prix_Moyen_Pirate', 'Paiements_Dominants'];
    const row = [
      `"${territory.country}"`,
      `"${territory.code}"`,
      territory.streams,
      `"${territory.percentage}"`,
      `"${territory.audience}"`,
      `"${territory.monthlyLossFcfa}"`,
      `"${territory.averagePiratePrice}"`,
      `"${territory.dominantPaymentMethods.join(' / ')}"`,
    ];
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), row.join(';')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `analyse_statistique_filiale_${territory.code}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast(`Dataset statistique de la filiale ${territory.country} exporté (format CSV structuré)`);
  };

  return (
    <div className="flex flex-col w-full pb-10" id="territory-detail-page">
      {/* 1. BREADCRUMBS & BOUTON RETOUR */}
      <div className="flex flex-col gap-2 mb-6">
        <nav className="flex items-center gap-1.5 text-[#76777d] text-[12px]">
          <button onClick={onNavigateBack} className="hover:text-[#0b1c30] transition-colors cursor-pointer">
            Surveillance
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={onNavigateBack} className="hover:text-[#0b1c30] transition-colors cursor-pointer">
            Menaces
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={onNavigateBack} className="hover:text-[#0b1c30] transition-colors cursor-pointer">
            Filiales & Pays
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-bold text-[#0b1c30] flex items-center gap-1.5">
            {territory.flag && <span>{territory.flag}</span>}
            <span>{territory.country}</span>
          </span>
        </nav>

        {/* 2. GRAND EN-TÊTE DE LA FILIALE */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2 pb-5 border-b border-[#e2e8f0]">
          <div className="flex items-start gap-3">
            <button
              onClick={onNavigateBack}
              title="Retour à la liste des menaces"
              className="mt-1 p-2 rounded-xl bg-white border border-[#cbd5e1] hover:bg-[#f1f5f9] text-[#0b1c30] transition-all cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                {territory.flag && <span className="text-3xl">{territory.flag}</span>}
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#0b1c30]">
                  Fiche Filiale : {territory.country}
                </h1>
                <span className="font-mono text-[12px] font-bold px-2.5 py-0.5 rounded bg-[#0b1c30] text-white">
                  Code : {territory.code}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                    territory.urgency === 'Critique'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : territory.urgency === 'Élevée'
                      ? 'bg-amber-100 text-amber-700 border border-amber-200'
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}
                >
                  Niveau d'exposition : {territory.urgency}
                </span>
              </div>
              <p className="text-[13px] text-[#64748b] mt-1.5 flex items-center gap-2 flex-wrap">
                <span>Pôle principal de veille : <strong className="text-[#0b1c30]">{territory.capitalOrMajorHub}</strong></span>
                <span>•</span>
                <span>Opérateurs & FAI audités : <strong className="text-[#0b1c30]">{territory.providers}</strong></span>
              </p>
            </div>
          </div>

          {/* Boutons d'export & de partage pour l'analyste */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportData}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#f8fafc] text-[#0b1c30] border border-[#cbd5e1] text-[12px] font-semibold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#1e40af]" />
              <span>Exporter les données (CSV / Excel)</span>
            </button>
            <button
              onClick={() => onShowToast(`Fiche de synthèse statistique de la filiale ${territory.country} générée en PDF`)}
              className="px-3.5 py-2 rounded-xl bg-[#0b1c30] hover:bg-[#1e40af] text-white text-[12px] font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              <span>Fiche Synthèse Décideurs (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. LES 4 INDICATEURS CLÉS CALCULÉS PAR L'ANALYSTE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* KPI 1 : Pertes estimées */}
        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748b] mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Manque à gagner mensuel</span>
            <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
          </div>
          <div className="text-[24px] font-black text-[#dc2626] font-mono leading-tight">
            {territory.monthlyLossFcfa}
          </div>
          <div className="text-[11px] text-[#64748b] mt-1.5">
            Estimation sur l'audience pirate identifiée
          </div>
        </div>

        {/* KPI 2 : Flux et spectateurs */}
        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748b] mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Flux pirates recensés</span>
            <Radio className="w-4 h-4 text-[#1e40af]" />
          </div>
          <div className="text-[24px] font-black text-[#0b1c30] font-mono leading-tight">
            {territory.streams} flux ({territory.percentage})
          </div>
          <div className="text-[11px] text-red-600 font-semibold mt-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
            <span>Audience consolidée : {territory.audience}</span>
          </div>
        </div>

        {/* KPI 3 : Prix relevé marché noir */}
        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748b] mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tarif pirate relevé</span>
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-[24px] font-black text-[#0b1c30] font-mono leading-tight">
            {territory.averagePiratePrice}
          </div>
          <div className="text-[11px] text-[#64748b] mt-1.5">
            Relevé terrain vs 120 000 FCFA / an officiel
          </div>
        </div>

        {/* KPI 4 : Dossiers d'investigation en cours */}
        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748b] mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Dossiers documentés</span>
            <ShieldAlert className="w-4 h-4 text-[#1e40af]" />
          </div>
          <div className="text-[24px] font-black text-[#1e40af] font-mono leading-tight">
            {territory.activeInvestigations} documentés
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1.5 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Preuves et constats qualifiés</span>
          </div>
        </div>
      </div>

      {/* 4. ONGLETS D'EXPLORATION DE L'ANALYSTE */}
      <div className="flex items-center gap-2 border-b border-[#e2e8f0] mb-6">
        <button
          onClick={() => setActiveTab('threats')}
          className={`pb-3 px-3 text-[13px] font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'threats'
              ? 'border-[#0b1c30] text-[#0b1c30]'
              : 'border-transparent text-[#64748b] hover:text-[#0b1c30]'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Données & Menaces Répertoriées ({territoryThreats.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analysis_tracks')}
          className={`pb-3 px-3 text-[13px] font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'analysis_tracks'
              ? 'border-[#0b1c30] text-[#0b1c30]'
              : 'border-transparent text-[#64748b] hover:text-[#0b1c30]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Synthèse Analytique & Pistes pour la Direction ({territory.analyticalObservations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('field_intelligence')}
          className={`pb-3 px-3 text-[13px] font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'field_intelligence'
              ? 'border-[#0b1c30] text-[#0b1c30]'
              : 'border-transparent text-[#64748b] hover:text-[#0b1c30]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Relevés de Terrain, Prix & Enquêtes</span>
        </button>
      </div>

      {/* 5. CONTENU DES ONGLETS */}

      {/* ONGLET A : DONNÉES ET MENACES RÉPERTORIÉES */}
      {activeTab === 'threats' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-[15px] font-bold text-[#0b1c30]">
              Flux et diffusions illégales géolocalisés sur {territory.country}
            </h3>
            <span className="text-[12px] text-[#64748b]">
              {territoryThreats.length} flux sous surveillance continue
            </span>
          </div>

          {territoryThreats.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-dashed border-[#cbd5e1] text-center">
              <ShieldAlert className="w-8 h-8 text-[#94a3b8] mx-auto mb-2" />
              <div className="text-[14px] font-bold text-[#0b1c30]">Aucun flux illégal actif rattaché</div>
              <p className="text-[12px] text-[#64748b] mt-1">
                La veille multi-sources n'a pas détecté de signalement non traité pour cette filiale.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {territoryThreats.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectThreat(item.id)}
                  className="bg-white hover:bg-[#eff4ff] transition-all p-4 rounded-xl border border-[#e2e8f0] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-start gap-3.5">
                    {item.evidenceCaptureUrl && (
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-black shrink-0 relative border border-gray-200">
                        <img
                          src={item.evidenceCaptureUrl}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[14px] font-bold text-[#0b1c30] group-hover:text-[#1e40af] transition-colors">
                          {item.name}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f1f5f9] text-[#334155]">
                          {item.platform}
                        </span>
                        <span
                          className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider ${
                            item.severity === 'critical'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {item.severity}
                        </span>
                      </div>
                      <div className="text-[12px] text-[#475569] mt-1">
                        {item.content} • {item.rightsHolder || 'CHEIKH +'}
                      </div>
                      <div className="text-[11px] text-[#64748b] mt-1 flex items-center gap-2">
                        <span>Réf : {item.id}</span>
                        {item.viewersCount && (
                          <>
                            <span>•</span>
                            <span className="text-red-600 font-semibold">{item.viewersCount}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>Détecté : {item.detectionDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {onOpenPdfExport && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenPdfExport(item);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-[#f8fafc] hover:bg-[#e2e8f0] text-[#0b1c30] border border-[#cbd5e1] text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Fiche constat</span>
                      </button>
                    )}

                    <button
                      onClick={() => onSelectThreat(item.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#0b1c30] hover:bg-[#1e40af] text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Consulter les données</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ONGLET B : SYNTHÈSE ANALYTIQUE & PISTES POUR LA DIRECTION */}
      {activeTab === 'analysis_tracks' && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#f1f5f9]">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#1e40af]" />
                <h3 className="text-[16px] font-bold text-[#0b1c30]">
                  Synthèse Analytique & Éclairage Décisionnel : {territory.country}
                </h3>
              </div>
              <p className="text-[12px] text-[#64748b] mt-1">
                Constats chiffrés et pistes d'analyse formulés par l'analyste Anti-Piratage pour orienter les arbitrages de la direction et des filiales.
              </p>
            </div>
            <button
              onClick={() => onShowToast(`Synthèse d'analyse ${territory.country} copiée pour le reporting`)}
              className="px-3 py-1.5 rounded-lg bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe] text-[12px] font-bold hover:bg-blue-100 transition-colors cursor-pointer flex items-center gap-1.5 self-start"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Partager avec la Direction</span>
            </button>
          </div>

          <div className="space-y-4">
            {territory.analyticalObservations.map((obs, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] space-y-2.5"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#0b1c30] text-white flex items-center justify-center font-bold text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="text-[14px] font-bold text-[#0b1c30]">{obs.theme}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      obs.department === 'Commercial'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : obs.department === 'Juridique / Régulation'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    Pour l'équipe : {obs.department}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[12px]">
                  <div className="p-3 bg-white rounded-lg border border-[#e2e8f0]">
                    <span className="font-bold text-[#64748b] block text-[10px] uppercase tracking-wider mb-1">
                      Diagnostic statistique / Données observées
                    </span>
                    <p className="text-[#334155] leading-relaxed">{obs.diagnostic}</p>
                    <div className="mt-2 pt-2 border-t border-gray-100 text-red-600 font-semibold text-[11px]">
                      Impact : {obs.impactBusiness}
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-[#e2e8f0]">
                    <span className="font-bold text-[#1e40af] block text-[10px] uppercase tracking-wider mb-1">
                      Piste d'éclairage soumise aux décideurs
                    </span>
                    <p className="text-[#0b1c30] font-medium leading-relaxed">{obs.suggestedTrack}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ONGLET C : RELEVÉS DE TERRAIN, PRIX & ENQUÊTES */}
      {activeTab === 'field_intelligence' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bloc 1 : Hotspots & Marchés physiques */}
            <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#f1f5f9]">
                <MapPin className="w-4 h-4 text-[#dc2626]" />
                <h3 className="text-[14px] font-bold text-[#0b1c30]">
                  Points de vente physiques identifiés sur le terrain
                </h3>
              </div>
              <div className="space-y-2.5">
                {territory.pirateHotspots.map((spot, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex items-start gap-2.5 text-[12px]"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
                    <div className="text-[#334155] font-medium leading-snug">{spot}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bloc 2 : Canaux de paiement & Opérateurs FAI */}
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#f1f5f9]">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-[14px] font-bold text-[#0b1c30]">
                    Moyens de paiement relevés (Mobile Money)
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {territory.dominantPaymentMethods.map((pm, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[12px] font-bold font-mono"
                    >
                      {pm}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-[#64748b] mt-3">
                  Données collectées via relevés de transactions et sondages clients.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#f1f5f9]">
                  <Building2 className="w-4 h-4 text-[#1e40af]" />
                  <h3 className="text-[14px] font-bold text-[#0b1c30]">
                    Opérateurs télécoms et réseaux FAI locaux
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {territory.activeTelecoms.map((op, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-[12px] font-bold"
                    >
                      {op}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-[#64748b] mt-3">
                  Infrastructures acheminant les flux analysés.
                </p>
              </div>
            </div>
          </div>

          {/* Bloc 3 : Données d'enquêtes terrain associées */}
          {relatedSurveys.length > 0 && (
            <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#f1f5f9]">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#1e40af]" />
                  <h3 className="text-[14px] font-bold text-[#0b1c30]">
                    Données d'enquêtes terrain & questionnaires revendeurs (Google Forms / terrain)
                  </h3>
                </div>
                <span className="text-[11px] text-[#64748b]">
                  {relatedSurveys.length} enquête(s) archivée(s)
                </span>
              </div>

              <div className="space-y-3">
                {relatedSurveys.map((survey) => (
                  <div
                    key={survey.id}
                    className="p-3.5 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] flex flex-col md:flex-row md:items-center justify-between gap-3 text-[12px]"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0b1c30]">{survey.city} — {survey.neighborhood}</span>
                        <span className="font-mono text-[11px] text-[#64748b]">({survey.date})</span>
                        <span className="px-2 py-0.2 rounded bg-red-100 text-red-700 font-bold text-[10px]">
                          Pénétration pirate : {survey.piracyPenetrationRate}%
                        </span>
                      </div>
                      <div className="text-[#475569] mt-1">
                        Échantillon : {survey.sampleSize} personnes auditées • Appareil privilégié : {survey.preferredPirateDevice}
                      </div>
                      <div className="text-[11px] text-[#64748b] mt-0.5">
                        Motivation déclarée : {survey.primaryMotivation} • Auditeur : {survey.auditor}
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                        {survey.mobileMoneyUsed}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
