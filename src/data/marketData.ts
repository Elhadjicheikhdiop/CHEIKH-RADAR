export interface CountryBusinessImpact {
  country: string;
  code: string;
  pirateAudience: number; // nombre estimé d'utilisateurs
  iptvAudience: number; // IPTV & Live Sport
  cableAudience: number; // Réseaux câblés de quartier
  estimatedLossFcfa: number; // en FCFA (mensuel)
  estimatedLossEur: number; // en EUR
  conversionRate: number; // % de réabonnements post-coupure
  topPirateSource: string;
  activeDistributors: number;
  flag: string;
  majorCities: string[];
  keyHotspots: string[];
  dominantPaymentMethods: string[];
  frozenMobileMoneyAccounts: number; // Nombre de comptes marchands pirates gelés
  fintechCollaborationStatus: string; // État de la collaboration avec Wave / Orange Money
  activeInvestigations: number;
  averageBlackMarketPriceFcfa: number;
  telecomPartners: string[];
  recommendedActionPlan: {
    phase: string;
    action: string;
    expectedGainFcfa: number;
    timeline: string;
    priority: 'Urgente (P1)' | 'Moyenne (P2)' | 'Continue';
  }[];
}

export interface SemrushDomainInsight {
  domain: string;
  monthlyTraffic: string;
  africaTrafficShare: string;
  topKeyword: string;
  searchVolume: string;
  domainAuthority: number;
  hostingCountry: string;
  threatLevel: 'Critique' | 'Élevé' | 'Moyen';
}

export interface BlackMarketPriceItem {
  id: string;
  type: 'IPTV Annuel' | 'IPTV Mensuel' | 'Boîtier Android physique' | 'Canal Telegram VIP';
  channelName: string;
  blackMarketPrice: string;
  officialCheikhPrice: string;
  gapPercentage: string;
  channelsIncluded: string;
  paymentMethod: string;
  cityMarket: string;
}

export interface FieldSurveyData {
  id: string;
  date: string;
  city: string;
  neighborhood: string;
  sampleSize: number;
  piracyPenetrationRate: number; // %
  preferredPirateDevice: string;
  primaryMotivation: string;
  mobileMoneyUsed: string;
  auditor: string;
}

export const mockCountryBusinessImpacts: CountryBusinessImpact[] = [
  {
    country: 'Sénégal',
    code: 'SN',
    flag: '🇸🇳',
    pirateAudience: 64500,
    iptvAudience: 46000,
    cableAudience: 18500,
    estimatedLossFcfa: 645000000, // 64 500 * 10 000 FCFA/mois
    estimatedLossEur: 983000,
    conversionRate: 14.8,
    topPirateSource: 'TikTok Live & Boîtiers Sandaga',
    activeDistributors: 2450,
    majorCities: ['Dakar', 'Thiès', 'Saint-Louis', 'Touba', 'Ziguinchor'],
    keyHotspots: ['Marché Sandaga (Plateau)', 'Pikine Icotaf', 'Gueule Tapée / Médina', 'Marché HLM'],
    dominantPaymentMethods: ['Wave Sénégal (79%)', 'Orange Money SN (21%)'],
    frozenMobileMoneyAccounts: 12,
    fintechCollaborationStatus: 'Wave Sénégal : 9 comptes gelés sous réquisition • OM SN : 3 comptes gélés',
    activeInvestigations: 14,
    averageBlackMarketPriceFcfa: 20000,
    telecomPartners: ['Sonatel (Orange)', 'Free Sénégal', 'Expresso'],
    recommendedActionPlan: [
      {
        phase: 'Opérationnelle',
        action: 'Saisies conjointes police/douanes au marché Sandaga sur les boîtiers Android flashés',
        expectedGainFcfa: 68000000,
        timeline: '15 jours',
        priority: 'Urgente (P1)',
      },
      {
        phase: 'Financière',
        action: 'Réquisition judiciaire auprès de Wave Sénégal pour geler 9 comptes marchands pirates identifiés',
        expectedGainFcfa: 45000000,
        timeline: 'Immédiat',
        priority: 'Urgente (P1)',
      },
      {
        phase: 'Commerciale',
        action: 'Opération trade-in : Ramenez votre box IPTV pirate = 1er mois Décodeur HD offert à 5 000 FCFA',
        expectedGainFcfa: 82000000,
        timeline: '30 jours',
        priority: 'Moyenne (P2)',
      },
    ],
  },
  {
    country: "Côte d'Ivoire",
    code: 'CI',
    flag: '🇨🇮',
    pirateAudience: 72000,
    iptvAudience: 54000,
    cableAudience: 18000,
    estimatedLossFcfa: 720000000,
    estimatedLossEur: 1097000,
    conversionRate: 16.2,
    topPirateSource: 'Serveurs Xtream & Facebook Live',
    activeDistributors: 3100,
    majorCities: ['Abidjan', 'Bouaké', 'Yamoussoukro', 'San Pedro', 'Korhogo'],
    keyHotspots: ['Marché de Treichville', 'Adjamé Black Market', 'Yopougon Siporex', 'Marcory'],
    dominantPaymentMethods: ['Wave CI (58%)', 'Orange Money CI (34%)', 'MTN MoMo (8%)'],
    frozenMobileMoneyAccounts: 15,
    fintechCollaborationStatus: 'Wave CI : 10 comptes marchands bloqués • Orange Money CI : 5 comptes sous ordonnance',
    activeInvestigations: 19,
    averageBlackMarketPriceFcfa: 22000,
    telecomPartners: ['Orange CI', 'MTN Côte d\'Ivoire', 'Moov Africa'],
    recommendedActionPlan: [
      {
        phase: 'Technique FAI',
        action: 'Blocage DNS/IP dynamique des panels Xtream Codes auprès de l\'ARTCI et Orange/MTN CI',
        expectedGainFcfa: 95000000,
        timeline: '7 jours',
        priority: 'Urgente (P1)',
      },
      {
        phase: 'Paiements',
        action: 'Notification formelle aux équipes conformité Wave CI & Orange Money des IBAN marchands pirates',
        expectedGainFcfa: 52000000,
        timeline: 'Immédiat',
        priority: 'Urgente (P1)',
      },
      {
        phase: 'Marketing local',
        action: 'Campagne d\'affichage Abidjan "Le vrai match est sur CANAL+" couplée à l\'offre sans engagement',
        expectedGainFcfa: 74000000,
        timeline: '3 semaines',
        priority: 'Moyenne (P2)',
      },
    ],
  },
  {
    country: 'Cameroun',
    code: 'CM',
    flag: '🇨🇲',
    pirateAudience: 36000,
    iptvAudience: 14000,
    cableAudience: 22000,
    estimatedLossFcfa: 360000000,
    estimatedLossEur: 548000,
    conversionRate: 11.4,
    topPirateSource: 'Sites Web de streaming & WhatsApp',
    activeDistributors: 1850,
    majorCities: ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Kribi'],
    keyHotspots: ['Marché Central de Douala', 'Mokolo (Yaoundé)', 'Akwa', 'Bonabéri'],
    dominantPaymentMethods: ['MTN Mobile Money CM (64%)', 'Orange Money CM (36%)'],
    frozenMobileMoneyAccounts: 6,
    fintechCollaborationStatus: 'MTN MoMo : 4 comptes sous séquestre • Orange Money CM : 2 comptes sous audit',
    activeInvestigations: 8,
    averageBlackMarketPriceFcfa: 18000,
    telecomPartners: ['MTN Cameroun', 'Orange Cameroun', 'Camtel'],
    recommendedActionPlan: [
      {
        phase: 'Juridique',
        action: 'Assignation en référé des réseaux câblés illégaux de quartier à Douala et Yaoundé',
        expectedGainFcfa: 42000000,
        timeline: '20 jours',
        priority: 'Urgente (P1)',
      },
      {
        phase: 'Distribution',
        action: 'Prime incitative aux distributeurs officiels sur les réactivations d\'anciens abonnés',
        expectedGainFcfa: 35000000,
        timeline: 'En cours',
        priority: 'Moyenne (P2)',
      },
    ],
  },
  {
    country: 'Mali',
    code: 'ML',
    flag: '🇲🇱',
    pirateAudience: 24000,
    iptvAudience: 15000,
    cableAudience: 9000,
    estimatedLossFcfa: 240000000,
    estimatedLossEur: 365000,
    conversionRate: 9.8,
    topPirateSource: 'Boîtiers satellite patchés & IPTV',
    activeDistributors: 980,
    majorCities: ['Bamako', 'Sikasso', 'Ségou', 'Mopti', 'Kayes'],
    keyHotspots: ['Grand Marché de Bamako', 'Dabanani', 'Badalabougou'],
    dominantPaymentMethods: ['Orange Money ML (72%)', 'Moov Money (28%)'],
    frozenMobileMoneyAccounts: 3,
    fintechCollaborationStatus: 'Orange Money ML : 3 comptes marchands bloqués avec la HAC',
    activeInvestigations: 6,
    averageBlackMarketPriceFcfa: 15000,
    telecomPartners: ['Orange Mali', 'Malitel (Moov)'],
    recommendedActionPlan: [
      {
        phase: 'Régulation',
        action: 'Coopération avec la HAC pour interdiction de vente des décodeurs patchés',
        expectedGainFcfa: 28000000,
        timeline: '1 mois',
        priority: 'Moyenne (P2)',
      },
      {
        phase: 'Offre prépayée',
        action: 'Lancement d\'une recharge flexible par SMS/Orange Money',
        expectedGainFcfa: 31000000,
        timeline: '45 jours',
        priority: 'Continue',
      },
    ],
  },
  {
    country: 'Gabon & RDC',
    code: 'GA/CD',
    flag: '🇬🇦🇨🇩',
    pirateAudience: 21500,
    iptvAudience: 11500,
    cableAudience: 10000,
    estimatedLossFcfa: 215000000,
    estimatedLossEur: 327000,
    conversionRate: 12.1,
    topPirateSource: 'Réseaux locaux câblés pirates & Web',
    activeDistributors: 1420,
    majorCities: ['Libreville', 'Kinshasa', 'Port-Gentil', 'Lubumbashi', 'Goma'],
    keyHotspots: ['Marché Mont-Bouët (Libreville)', 'Marché Central de Kinshasa', 'Victoire (Kinshasa)'],
    dominantPaymentMethods: ['Airtel Money (55%)', 'M-Pesa Vodacom (35%)', 'Orange Money (10%)'],
    frozenMobileMoneyAccounts: 2,
    fintechCollaborationStatus: 'M-Pesa Vodacom : 2 comptes bloqués à Kinshasa',
    activeInvestigations: 7,
    averageBlackMarketPriceFcfa: 24000,
    telecomPartners: ['Airtel Gabon', 'Vodacom RDC', 'Orange RDC', 'Moov Gabon'],
    recommendedActionPlan: [
      {
        phase: 'Interventions Terrain',
        action: 'Démantèlement des câblo-opérateurs pirates clandestins à Kinshasa et Libreville',
        expectedGainFcfa: 34000000,
        timeline: '25 jours',
        priority: 'Urgente (P1)',
      },
      {
        phase: 'Partenariats Télécoms',
        action: 'Offre groupée forfait data + bouquet mobile CANAL+ avec Airtel et Vodacom',
        expectedGainFcfa: 38000000,
        timeline: '60 jours',
        priority: 'Continue',
      },
    ],
  },
];

export const mockSemrushInsights: SemrushDomainInsight[] = [
  {
    domain: 'stream-foot-dakar.xyz',
    monthlyTraffic: '1.2M visites',
    africaTrafficShare: '78%',
    topKeyword: 'canal sport live senegal',
    searchVolume: '49 500 / mois',
    domainAuthority: 46,
    hostingCountry: 'Russie (Offshore)',
    threatLevel: 'Critique',
  },
  {
    domain: 'direct-match-afrique.net',
    monthlyTraffic: '850K visites',
    africaTrafficShare: '84%',
    topKeyword: 'regarder match direct gratuit',
    searchVolume: '33 100 / mois',
    domainAuthority: 41,
    hostingCountry: 'Belize / CDN Cloudflare',
    threatLevel: 'Critique',
  },
  {
    domain: 'iptv-afrique-premium.store',
    monthlyTraffic: '420K visites',
    africaTrafficShare: '65%',
    topKeyword: 'code iptv dakar abidjan',
    searchVolume: '18 200 / mois',
    domainAuthority: 35,
    hostingCountry: 'Pays-Bas (Serverius)',
    threatLevel: 'Élevé',
  },
  {
    domain: 'livefootball-abidjan.tv',
    monthlyTraffic: '380K visites',
    africaTrafficShare: '89%',
    topKeyword: 'canal plus foot streaming hd',
    searchVolume: '27 400 / mois',
    domainAuthority: 38,
    hostingCountry: 'Roumanie',
    threatLevel: 'Élevé',
  },
  {
    domain: 'sport24-direct.club',
    monthlyTraffic: '290K visites',
    africaTrafficShare: '54%',
    topKeyword: 'match direct afrique streaming',
    searchVolume: '14 800 / mois',
    domainAuthority: 32,
    hostingCountry: 'Seychelles / CDN',
    threatLevel: 'Moyen',
  },
];

export const mockBlackMarketPrices: BlackMarketPriceItem[] = [
  {
    id: 'BMP-01',
    type: 'IPTV Annuel',
    channelName: 'Abonnement "Mega Xtream 4K" (WhatsApp)',
    blackMarketPrice: '20 000 FCFA / an',
    officialCheikhPrice: '120 000 FCFA / an (Évasion)',
    gapPercentage: '-83%',
    channelsIncluded: '12 000 chaînes + VOD',
    paymentMethod: 'Wave / Orange Money',
    cityMarket: 'Dakar & Abidjan',
  },
  {
    id: 'BMP-02',
    type: 'IPTV Mensuel',
    channelName: 'Pack "Match Day Express" (Telegram)',
    blackMarketPrice: '2 500 FCFA / mois',
    officialCheikhPrice: '10 000 FCFA / mois (CANAL+ Évasion Sport)',
    gapPercentage: '-75%',
    channelsIncluded: 'Bouquet Sport exclusif',
    paymentMethod: 'Wave Sénégal',
    cityMarket: 'Dakar (Médina, Pikine)',
  },
  {
    id: 'BMP-03',
    type: 'Boîtier Android physique',
    channelName: 'Box Android TV "Pré-configurée 1 an VIP"',
    blackMarketPrice: '35 000 FCFA (Box + 1 an)',
    officialCheikhPrice: 'Décodeur + Abonnement officiel',
    gapPercentage: '-70%',
    channelsIncluded: 'Toutes les chaînes premium sans parabole',
    paymentMethod: 'Cash sur place / Wave',
    cityMarket: 'Marché Sandaga (Dakar) & Treichville (Abidjan)',
  },
  {
    id: 'BMP-04',
    type: 'Canal Telegram VIP',
    channelName: 'Canal privé "Foot Direct PANAF"',
    blackMarketPrice: '1 500 FCFA / match',
    officialCheikhPrice: 'Abonnement mensuel CANAL+',
    gapPercentage: '-85%',
    channelsIncluded: 'Lien direct m3u8 sans pub',
    paymentMethod: 'Orange Money Côte d\'Ivoire',
    cityMarket: 'Abidjan & Bouaké',
  },
];

export const mockFieldSurveys: FieldSurveyData[] = [
  {
    id: 'SURV-2025-01',
    date: '08/09/2026',
    city: 'Dakar',
    neighborhood: 'Médina & Gueule Tapée',
    sampleSize: 150,
    piracyPenetrationRate: 38.5,
    preferredPirateDevice: 'Boîtier Android IPTV (52%)',
    primaryMotivation: 'Tarif & Flexibilité sans engagement',
    mobileMoneyUsed: 'Wave (79%), Orange Money (21%)',
    auditor: 'Cellule Enquêtes Terrain CANAL+ SN',
  },
  {
    id: 'SURV-2025-02',
    date: '02/09/2026',
    city: 'Abidjan',
    neighborhood: 'Cocody & Yopougon',
    sampleSize: 210,
    piracyPenetrationRate: 41.2,
    preferredPirateDevice: 'Applications Mobile APK & TikTok',
    primaryMotivation: 'Consommation sur smartphone 4G',
    mobileMoneyUsed: 'Wave CI (58%), Orange Money (42%)',
    auditor: 'Équipe Terrain CANAL+ CI',
  },
  {
    id: 'SURV-2025-03',
    date: '25/08/2026',
    city: 'Douala',
    neighborhood: 'Akwa & Bonabéri',
    sampleSize: 180,
    piracyPenetrationRate: 32.0,
    preferredPirateDevice: 'Réseaux câblés pirates de quartier',
    primaryMotivation: 'Partage d\'accès collectif',
    mobileMoneyUsed: 'MTN Mobile Money (64%)',
    auditor: 'Audit Commercial CANAL+ CM',
  },
  {
    id: 'SURV-2025-04',
    date: '18/08/2026',
    city: 'Dakar',
    neighborhood: 'Pikine & Guédiawaye',
    sampleSize: 195,
    piracyPenetrationRate: 46.0,
    preferredPirateDevice: 'Boîtier IPTV Android vendu à Sandaga',
    primaryMotivation: 'Prix de l\'abonnement annuel',
    mobileMoneyUsed: 'Wave (88%)',
    auditor: 'Cellule Enquêtes Terrain CANAL+ SN',
  },
];

export interface PostActionImpactRecord {
  id: string;
  month: string; // ex: Août 2026
  country: string;
  code: string;
  flag: string;
  operationTitle: string;
  operationType: 'Blocage FAI/DNS' | 'Raid Marché & Douanes' | 'Gel Marchand Mobile Money' | 'Fermeture Panel IPTV';
  takedownScope: string;
  pirateDropPercent: number;
  monthlyNewSubscribersGained: number; // nouveaux abonnés mensuels réels
  monthlyRevenueLiftFcfa: number; // Chiffre d'affaires mensuel additionnel (Mois 1)
  ltvRetentionFcfa: number; // Valeur réelle sur le cycle de vie client (rétention 4.5 mois)
  annualizedValueFcfa: number; // Valeur sur 12 mois avec rétention
  liveReactivityMttr: string; // Temps moyen de coupure live (ex: 22 min)
  whyItWorked: string; // Explication décisionnelle simple
  executiveSummary: string;
}

export interface CommercialCountryMetric {
  country: string;
  code: string;
  flag: string;
  activeSubscribers: number;
  monthlyNewSubscriptions: number;
  monthlyRevenueFcfa: number;
  arpuFcfa: number; // 10 000 FCFA moyen
  churnRatePercent: number;
  monthlyGrowthPercent: number;
  formulaBreakdown: {
    acces: number; // %
    evasionSport: number; // %
    toutCanal: number; // %
  };
}

// Suivi d'évolution mois par mois (Mois 1 à Mois 6)
export interface MonthlyBusinessHistoryPoint {
  monthName: string; // ex: Avril, Mai, Juin, Juillet, Août, Septembre
  piratePressureScore: number; // 0 à 100 (niveau d'intensité du piratage)
  totalMonthlySubscriptions: number; // Abonnements mensuels payés
  monthlyRevenueFcfaM: number; // Chiffre d'Affaires du mois en Millions FCFA
  keyTakedownAction?: string; // Action forte menée pendant ce mois
  decisionImpactSummary: string; // Explication du résultat décisionnel
}

export const mockCommercialCountryMetrics: CommercialCountryMetric[] = [
  {
    country: 'Sénégal',
    code: 'SN',
    flag: '🇸🇳',
    activeSubscribers: 285000,
    monthlyNewSubscriptions: 34200,
    monthlyRevenueFcfa: 2850000000, // 2.85 Milliards FCFA / mois
    arpuFcfa: 10000,
    churnRatePercent: 4.8,
    monthlyGrowthPercent: 8.4,
    formulaBreakdown: {
      acces: 32,
      evasionSport: 54,
      toutCanal: 14,
    },
  },
  {
    country: "Côte d'Ivoire",
    code: 'CI',
    flag: '🇨🇮',
    activeSubscribers: 420000,
    monthlyNewSubscriptions: 48900,
    monthlyRevenueFcfa: 4620000000, // 4.62 Milliards FCFA / mois
    arpuFcfa: 11000,
    churnRatePercent: 4.2,
    monthlyGrowthPercent: 11.2,
    formulaBreakdown: {
      acces: 28,
      evasionSport: 58,
      toutCanal: 14,
    },
  },
  {
    country: 'Cameroun',
    code: 'CM',
    flag: '🇨🇲',
    activeSubscribers: 195000,
    monthlyNewSubscriptions: 18500,
    monthlyRevenueFcfa: 1852500000, // 1.85 Milliards FCFA / mois
    arpuFcfa: 9500,
    churnRatePercent: 5.4,
    monthlyGrowthPercent: 5.1,
    formulaBreakdown: {
      acces: 41,
      evasionSport: 47,
      toutCanal: 12,
    },
  },
  {
    country: 'Mali',
    code: 'ML',
    flag: '🇲🇱',
    activeSubscribers: 110000,
    monthlyNewSubscriptions: 9800,
    monthlyRevenueFcfa: 935000000, // 935 Millions FCFA / mois
    arpuFcfa: 8500,
    churnRatePercent: 6.1,
    monthlyGrowthPercent: 3.2,
    formulaBreakdown: {
      acces: 48,
      evasionSport: 42,
      toutCanal: 10,
    },
  },
  {
    country: 'Gabon & RDC',
    code: 'GA/CD',
    flag: '🇬🇦🇨🇩',
    activeSubscribers: 165000,
    monthlyNewSubscriptions: 15400,
    monthlyRevenueFcfa: 1897500000, // 1.89 Milliards FCFA / mois
    arpuFcfa: 11500,
    churnRatePercent: 4.9,
    monthlyGrowthPercent: 6.7,
    formulaBreakdown: {
      acces: 25,
      evasionSport: 59,
      toutCanal: 16,
    },
  },
];

// Historique Mensuel Décisionnel (6 Mois)
export const mockMonthlyBusinessHistory: MonthlyBusinessHistoryPoint[] = [
  {
    monthName: 'Mois 1 (Avril)',
    piratePressureScore: 88,
    totalMonthlySubscriptions: 92400,
    monthlyRevenueFcfaM: 924,
    decisionImpactSummary: 'Aucune coupure FAI majeure : le piratage est à son niveau maximal, les ventes stagnent.',
  },
  {
    monthName: 'Mois 2 (Mai)',
    piratePressureScore: 95,
    totalMonthlySubscriptions: 86500,
    monthlyRevenueFcfaM: 865,
    decisionImpactSummary: 'Prolifération des serveurs IPTV non bloqués. Baisse directe de 5 900 abonnements vendus sur le mois.',
  },
  {
    monthName: 'Mois 3 (Juin - Démarrage Opérations)',
    piratePressureScore: 48,
    totalMonthlySubscriptions: 112000,
    monthlyRevenueFcfaM: 1120,
    keyTakedownAction: 'Opération FAI : 42 serveurs coupés + Saisies Sandaga & Treichville',
    decisionImpactSummary: 'Rebond immédiat : +25 500 abonnements mensuels vendus (+255M FCFA de CA dans le mois) car les pirates étaient privés de signal.',
  },
  {
    monthName: 'Mois 4 (Juillet - Gel Paiements Wave/OM)',
    piratePressureScore: 32,
    totalMonthlySubscriptions: 126800,
    monthlyRevenueFcfaM: 1268,
    keyTakedownAction: 'Gel judiciaire des comptes Wave & Orange Money des revendeurs pirates',
    decisionImpactSummary: 'Nouveau record de vente : les utilisateurs ne peuvent plus payer leurs revendeurs pirates et souscrivent en boutique officielle.',
  },
  {
    monthName: 'Mois 5 (Août - Rétention)',
    piratePressureScore: 36,
    totalMonthlySubscriptions: 124200,
    monthlyRevenueFcfaM: 1242,
    decisionImpactSummary: 'Stabilisation haute : 84% des clients recrutés au Mois 3 ont renouvelé leur abonnement pour le mois suivant.',
  },
  {
    monthName: 'Mois 6 (Septembre - Consolidation)',
    piratePressureScore: 34,
    totalMonthlySubscriptions: 126800,
    monthlyRevenueFcfaM: 1268,
    keyTakedownAction: 'Blocage automatisé continu des flux Telegram en direct',
    decisionImpactSummary: 'Le chiffre d\'affaires mensuel se maintient à +404M FCFA par rapport au Mois 2 (avant la mise en place du dispositif).',
  },
];

export const mockPostActionImpacts: PostActionImpactRecord[] = [
  {
    id: 'IMP-01',
    month: 'Septembre 2026',
    country: 'Sénégal',
    code: 'SN',
    flag: '🇸🇳',
    operationTitle: 'Opération Foudre Sandaga & Blocage IP/DNS Orange Sonatel',
    operationType: 'Blocage FAI/DNS',
    takedownScope: '42 serveurs Xtream neutralisés + 1 200 box Android saisies',
    pirateDropPercent: -78,
    monthlyNewSubscribersGained: 11850,
    monthlyRevenueLiftFcfa: 118500000, // 118,5 Millions FCFA / mois
    ltvRetentionFcfa: 533250000, // 118.5M * 4.5 = 533.25 Millions FCFA LTV
    annualizedValueFcfa: 1422000000, // 1,42 Milliard FCFA / an
    liveReactivityMttr: '18 min',
    whyItWorked: 'Pourquoi ça a marché : Les serveurs pirates ont été coupés 18 minutes après le coup d\'envoi. Les téléspectateurs privés de match se sont rendus en boutique CANAL+ pour prendre un mois d\'abonnement à 10 000 FCFA.',
    executiveSummary: 'L\'extinction simultanée des flux a forcé 11 850 foyers dakarois à acheter un abonnement mensuel officiel, générant 118,5M FCFA immédiats et 533M FCFA de LTV rétention.',
  },
  {
    id: 'IMP-02',
    month: 'Août 2026',
    country: "Côte d'Ivoire",
    code: 'CI',
    flag: '🇨🇮',
    operationTitle: 'Fermeture Canaux Telegram & Gel des comptes Wave CI / Orange Money',
    operationType: 'Gel Marchand Mobile Money',
    takedownScope: '14 canaux Telegram fermés (82K membres) + 15 comptes Wave & OM gelés',
    pirateDropPercent: -65,
    monthlyNewSubscribersGained: 15400,
    monthlyRevenueLiftFcfa: 169400000, // 169,4 Millions FCFA / mois
    ltvRetentionFcfa: 762300000, // 169.4M * 4.5 = 762.3 Millions FCFA LTV
    annualizedValueFcfa: 2032800000, // 2,03 Milliards FCFA / an
    liveReactivityMttr: '22 min',
    whyItWorked: 'Pourquoi ça a marché : En bloquant les numéros Wave des revendeurs, les clients n\'ont pas pu renouveler leur IPTV pirate et ont dû basculer vers l\'application officielle myCANAL.',
    executiveSummary: 'Asphyxie totale de la chaîne de paiement informelle à Abidjan : 15 400 nouveaux abonnements mensuels souscrits.',
  },
  {
    id: 'IMP-03',
    month: 'Août 2026',
    country: 'Cameroun',
    code: 'CM',
    flag: '🇨🇲',
    operationTitle: 'Démantèlement Câblo-distributeurs clandestins Douala & Yaoundé',
    operationType: 'Raid Marché & Douanes',
    takedownScope: '6 régies de quartier coupées alimentant 18 000 foyers câblés illégalement',
    pirateDropPercent: -54,
    monthlyNewSubscribersGained: 5200,
    monthlyRevenueLiftFcfa: 49400000, // 49,4 Millions FCFA / mois
    ltvRetentionFcfa: 222300000, // 49.4M * 4.5 = 222.3 Millions FCFA LTV
    annualizedValueFcfa: 592800000, // 592,8 Millions FCFA / an
    liveReactivityMttr: 'N/A (Action Physique)',
    whyItWorked: 'Pourquoi ça a marché : La coupure physique des câbles pirates a été immédiatement relayée par des kiosques mobiles CANAL+ installés dans les mêmes quartiers avec l\'offre Access à 5 000 FCFA.',
    executiveSummary: 'Remplacement immédiat de l\'offre pirate par des décodeurs officiels dans 5 200 foyers de Douala.',
  },
  {
    id: 'IMP-04',
    month: 'Juillet 2026',
    country: 'Gabon & RDC',
    code: 'GA/CD',
    flag: '🇬🇦🇨🇩',
    operationTitle: 'Blocage CDN Cloudflare & Filtrage FAI Kinshasa / Libreville',
    operationType: 'Fermeture Panel IPTV',
    takedownScope: '3 domaines web de streaming direct (1.8M visites) filtrés par l\'autorité',
    pirateDropPercent: -61,
    monthlyNewSubscribersGained: 4800,
    monthlyRevenueLiftFcfa: 55200000, // 55,2 Millions FCFA / mois
    ltvRetentionFcfa: 248400000, // 55.2M * 4.5 = 248.4 Millions FCFA LTV
    annualizedValueFcfa: 662400000, // 662,4 Millions FCFA / an
    liveReactivityMttr: '26 min',
    whyItWorked: 'Pourquoi ça a marché : Les FAI locaux (Vodacom, Airtel) ont activé le blocage d\'adresses IP, rendant les sites inaccessibles sur téléphone 4G.',
    executiveSummary: 'Hausse directe de 4 800 souscriptions mobiles mensuelles pour suivre les compétitions.',
  },
];
