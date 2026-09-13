export interface CountryBusinessImpact {
  country: string;
  code: string;
  pirateAudience: number; // nombre estimé d'utilisateurs
  estimatedLossFcfa: number; // en FCFA
  estimatedLossEur: number; // en EUR
  conversionRate: number; // % de réabonnements post-coupure
  topPirateSource: string;
  activeDistributors: number;
  // Détails approfondis par territoire
  flag: string;
  majorCities: string[];
  keyHotspots: string[];
  dominantPaymentMethods: string[];
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
  mobileMoneyUsed: string; // Wave, Orange Money, etc.
  auditor: string;
}

export const mockCountryBusinessImpacts: CountryBusinessImpact[] = [
  {
    country: 'Sénégal',
    code: 'SN',
    flag: '🇸🇳',
    pirateAudience: 64500,
    estimatedLossFcfa: 295000000,
    estimatedLossEur: 450000,
    conversionRate: 14.8,
    topPirateSource: 'TikTok Live & Boîtiers Sandaga',
    activeDistributors: 2450,
    majorCities: ['Dakar', 'Thiès', 'Saint-Louis', 'Touba', 'Ziguinchor'],
    keyHotspots: ['Marché Sandaga (Plateau)', 'Pikine Icotaf', 'Gueule Tapée / Médina', 'Marché HLM'],
    dominantPaymentMethods: ['Wave Sénégal (79%)', 'Orange Money SN (21%)'],
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
    estimatedLossFcfa: 335000000,
    estimatedLossEur: 510000,
    conversionRate: 16.2,
    topPirateSource: 'Serveurs Xtream & Facebook Live',
    activeDistributors: 3100,
    majorCities: ['Abidjan', 'Bouaké', 'Yamoussoukro', 'San Pedro', 'Korhogo'],
    keyHotspots: ['Marché de Treichville', 'Adjamé Black Market', 'Yopougon Siporex', 'Marcory'],
    dominantPaymentMethods: ['Wave CI (58%)', 'Orange Money CI (34%)', 'MTN MoMo (8%)'],
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
        action: 'Campagne d\'affichage Abidjan "Le vrai match est sur CHEIKH +" couplée à l\'offre sans engagement',
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
    estimatedLossFcfa: 165000000,
    estimatedLossEur: 251000,
    conversionRate: 11.4,
    topPirateSource: 'Sites Web de streaming & WhatsApp',
    activeDistributors: 1850,
    majorCities: ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Kribi'],
    keyHotspots: ['Marché Central de Douala', 'Mokolo (Yaoundé)', 'Akwa', 'Bonabéri'],
    dominantPaymentMethods: ['MTN Mobile Money CM (64%)', 'Orange Money CM (36%)'],
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
    estimatedLossFcfa: 110000000,
    estimatedLossEur: 167000,
    conversionRate: 9.8,
    topPirateSource: 'Boîtiers satellite patchés & IPTV',
    activeDistributors: 980,
    majorCities: ['Bamako', 'Sikasso', 'Ségou', 'Mopti', 'Kayes'],
    keyHotspots: ['Grand Marché de Bamako', 'Dabanani', 'Badalabougou'],
    dominantPaymentMethods: ['Orange Money ML (72%)', 'Moov Money (28%)'],
    activeInvestigations: 6,
    averageBlackMarketPriceFcfa: 15000,
    telecomPartners: ['Orange Mali', 'Malitel (Moov)'],
    recommendedActionPlan: [
      {
        phase: 'Régulation',
        action: 'Coopération avec la HAC (Haute Autorité de la Communication) pour interdiction de vente des décodeurs patchés',
        expectedGainFcfa: 28000000,
        timeline: '1 mois',
        priority: 'Moyenne (P2)',
      },
      {
        phase: 'Offre prépayée',
        action: 'Lancement d\'une recharge flexible par SMS/Orange Money adaptée au pouvoir d\'achat',
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
    estimatedLossFcfa: 98000000,
    estimatedLossEur: 149000,
    conversionRate: 12.1,
    topPirateSource: 'Réseaux locaux câblés pirates & Web',
    activeDistributors: 1420,
    majorCities: ['Libreville', 'Kinshasa', 'Port-Gentil', 'Lubumbashi', 'Goma'],
    keyHotspots: ['Marché Mont-Bouët (Libreville)', 'Marché Central de Kinshasa', 'Victoire (Kinshasa)'],
    dominantPaymentMethods: ['Airtel Money (55%)', 'M-Pesa Vodacom (35%)', 'Orange Money (10%)'],
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
        action: 'Offre groupée forfait data + bouquet mobile CHEIKH + avec Airtel et Vodacom',
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
    topKeyword: 'regarder can direct gratuit',
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
    topKeyword: 'chelsea psg direct afrique',
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
    officialCheikhPrice: '10 000 FCFA / mois (CHEIKH + Sport)',
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
    officialCheikhPrice: 'Abonnement mensuel CHEIKH +',
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
    auditor: 'Cellule Enquêtes Terrain CHEIKH + SN',
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
    auditor: 'Équipe Terrain CHEIKH + CI',
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
    auditor: 'Audit Commercial CHEIKH + CM',
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
    auditor: 'Cellule Enquêtes Terrain CHEIKH + SN',
  },
];

export interface PostActionImpactRecord {
  id: string;
  date: string;
  country: string;
  code: string;
  flag: string;
  operationTitle: string;
  operationType: 'Blocage FAI/DNS' | 'Raid Marché & Douanes' | 'Gel Marchand Mobile Money' | 'Fermeture Panel IPTV';
  takedownScope: string;
  pirateDropPercent: number; // e.g. -74%
  postActionSalesLiftPercent: number; // e.g. +18.5%
  additionalSubscribersRecruited: number;
  measuredRevenueLiftFcfa: number;
  confidenceScore: 'Élevée (Corrélation 94%)' | 'Forte (Corrélation 88%)' | 'Moyenne';
  executiveSummary: string;
}

export interface CommercialCountryMetric {
  country: string;
  code: string;
  flag: string;
  activeSubscribers: number;
  newSubscriptionsMonth: number;
  monthlyRevenueFcfa: number;
  arpuFcfa: number;
  churnRatePercent: number;
  growthVsPreviousMonthPercent: number;
  formulaBreakdown: {
    acces: number; // %
    evasionSport: number; // %
    toutCanal: number; // %
  };
  piracyPressureIndex: 'Critique' | 'Élevée' | 'Modérée';
}

export interface BusinessCorrelationPoint {
  weekLabel: string;
  pirateActivityIndex: number; // 0 à 100
  officialReactivations: number; // Nombre d'abonnements/réabonnements
  revenueFcfaM: number; // Millions FCFA
  keyTakedownEvent?: string;
}

export const mockCommercialCountryMetrics: CommercialCountryMetric[] = [
  {
    country: 'Sénégal',
    code: 'SN',
    flag: '🇸🇳',
    activeSubscribers: 285000,
    newSubscriptionsMonth: 34200,
    monthlyRevenueFcfa: 2850000000, // 2.85 Milliards FCFA
    arpuFcfa: 10000,
    churnRatePercent: 4.8,
    growthVsPreviousMonthPercent: 8.4,
    formulaBreakdown: {
      acces: 32,
      evasionSport: 54,
      toutCanal: 14,
    },
    piracyPressureIndex: 'Critique',
  },
  {
    country: "Côte d'Ivoire",
    code: 'CI',
    flag: '🇨🇮',
    activeSubscribers: 420000,
    newSubscriptionsMonth: 48900,
    monthlyRevenueFcfa: 4620000000, // 4.62 Milliards FCFA
    arpuFcfa: 11000,
    churnRatePercent: 4.2,
    growthVsPreviousMonthPercent: 11.2,
    formulaBreakdown: {
      acces: 28,
      evasionSport: 58,
      toutCanal: 14,
    },
    piracyPressureIndex: 'Critique',
  },
  {
    country: 'Cameroun',
    code: 'CM',
    flag: '🇨🇲',
    activeSubscribers: 195000,
    newSubscriptionsMonth: 18500,
    monthlyRevenueFcfa: 1852500000, // 1.85 Milliards FCFA
    arpuFcfa: 9500,
    churnRatePercent: 5.4,
    growthVsPreviousMonthPercent: 5.1,
    formulaBreakdown: {
      acces: 41,
      evasionSport: 47,
      toutCanal: 12,
    },
    piracyPressureIndex: 'Élevée',
  },
  {
    country: 'Mali',
    code: 'ML',
    flag: '🇲🇱',
    activeSubscribers: 110000,
    newSubscriptionsMonth: 9800,
    monthlyRevenueFcfa: 935000000, // 935 Millions FCFA
    arpuFcfa: 8500,
    churnRatePercent: 6.1,
    growthVsPreviousMonthPercent: 3.2,
    formulaBreakdown: {
      acces: 48,
      evasionSport: 42,
      toutCanal: 10,
    },
    piracyPressureIndex: 'Modérée',
  },
  {
    country: 'Gabon & RDC',
    code: 'GA/CD',
    flag: '🇬🇦🇨🇩',
    activeSubscribers: 165000,
    newSubscriptionsMonth: 15400,
    monthlyRevenueFcfa: 1897500000, // 1.89 Milliards FCFA
    arpuFcfa: 11500,
    churnRatePercent: 4.9,
    growthVsPreviousMonthPercent: 6.7,
    formulaBreakdown: {
      acces: 25,
      evasionSport: 59,
      toutCanal: 16,
    },
    piracyPressureIndex: 'Élevée',
  },
];

export const mockBusinessCorrelationTimeline: BusinessCorrelationPoint[] = [
  { weekLabel: 'Sem 1 (Avant action)', pirateActivityIndex: 88, officialReactivations: 14200, revenueFcfaM: 142 },
  { weekLabel: 'Sem 2 (Pic piratage)', pirateActivityIndex: 96, officialReactivations: 11800, revenueFcfaM: 118 },
  { weekLabel: 'Sem 3 (Action FAI + Takedowns)', pirateActivityIndex: 42, officialReactivations: 19400, revenueFcfaM: 194, keyTakedownEvent: 'Blocage DNS 42 serveurs + Saisies Sandaga' },
  { weekLabel: 'Sem 4 (Post-action J+7)', pirateActivityIndex: 28, officialReactivations: 25600, revenueFcfaM: 256, keyTakedownEvent: 'Gel Wave 9 marchands IPTV' },
  { weekLabel: 'Sem 5 (Stabilisation)', pirateActivityIndex: 34, officialReactivations: 23100, revenueFcfaM: 231 },
  { weekLabel: 'Sem 6 (Maintien)', pirateActivityIndex: 38, officialReactivations: 22400, revenueFcfaM: 224 },
];

export const mockPostActionImpacts: PostActionImpactRecord[] = [
  {
    id: 'IMP-01',
    date: '02/09/2026',
    country: 'Sénégal',
    code: 'SN',
    flag: '🇸🇳',
    operationTitle: 'Opération Foudre Sandaga & Blocage IP/DNS Orange Sonatel',
    operationType: 'Blocage FAI/DNS',
    takedownScope: '42 serveurs Xtream neutralisés + 1 200 box Android saisies',
    pirateDropPercent: -78,
    postActionSalesLiftPercent: 18.4,
    additionalSubscribersRecruited: 11850,
    measuredRevenueLiftFcfa: 118500000,
    confidenceScore: 'Élevée (Corrélation 94%)',
    executiveSummary: 'Suite à l\'extinction simultanée des flux pirates majeurs 48h avant la journée de championnat, la filiale Sénégal a enregistré +11 850 réactivations directes sur la Formule Évasion Sport (10 000 FCFA).',
  },
  {
    id: 'IMP-02',
    date: '28/08/2026',
    country: "Côte d'Ivoire",
    code: 'CI',
    flag: '🇨🇮',
    operationTitle: 'Fermeture Réseau Telegram VIP & Gel Wave CI des comptes marchands',
    operationType: 'Gel Marchand Mobile Money',
    takedownScope: '14 canaux Telegram (82K abonnés) fermés + 8 comptes Wave gelés',
    pirateDropPercent: -65,
    postActionSalesLiftPercent: 22.1,
    additionalSubscribersRecruited: 15400,
    measuredRevenueLiftFcfa: 169400000,
    confidenceScore: 'Élevée (Corrélation 94%)',
    executiveSummary: 'L\'interruption de la chaîne de paiement Mobile Money a asphyxié les revendeurs informels d\'Abidjan, forçant 15 400 foyers à souscrire à l\'offre officielle décodeur / myCANAL.',
  },
  {
    id: 'IMP-03',
    date: '15/08/2026',
    country: 'Cameroun',
    code: 'CM',
    flag: '🇨🇲',
    operationTitle: 'Démantèlement Câblo-distributeurs clandestins Akwa & Douala',
    operationType: 'Raid Marché & Douanes',
    takedownScope: '6 régies clandestines coupées alimentant 18 000 foyers câblés',
    pirateDropPercent: -54,
    postActionSalesLiftPercent: 12.6,
    additionalSubscribersRecruited: 5200,
    measuredRevenueLiftFcfa: 49400000,
    confidenceScore: 'Forte (Corrélation 88%)',
    executiveSummary: 'Coupure physique des amplificateurs coaxiaux pirates dans 3 quartiers de Douala avec présence d\'équipes commerciales CANAL+ de proximité.',
  },
  {
    id: 'IMP-04',
    date: '04/08/2026',
    country: 'Gabon & RDC',
    code: 'GA/CD',
    flag: '🇬🇦🇨🇩',
    operationTitle: 'Blocage CDN Cloudflare & Filtrage FAI Kinshasa / Libreville',
    operationType: 'Fermeture Panel IPTV',
    takedownScope: '3 domaines web de streaming direct (1.8M visites) bloqués par l\'autorité',
    pirateDropPercent: -61,
    postActionSalesLiftPercent: 14.2,
    additionalSubscribersRecruited: 4800,
    measuredRevenueLiftFcfa: 55200000,
    confidenceScore: 'Forte (Corrélation 88%)',
    executiveSummary: 'Réduction de 61% de la bande passante pirate sur les réseaux Vodacom & Airtel, accompagnée d\'une hausse des activations via application mobile.',
  },
];

