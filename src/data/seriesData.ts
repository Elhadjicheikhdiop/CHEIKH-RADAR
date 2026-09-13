import { ThreatStatus } from '../types';

export interface SocialExcerptPageItem {
  id: string;
  seriesTitle: string;
  seasonEpisode: string;
  pageName: string;
  platform: 'TikTok' | 'Facebook' | 'YouTube' | 'Telegram' | 'Instagram';
  platformIcon: string;
  pageUrl: string;
  excerptType: 'Extraits Longs (15-25 min)' | 'Épisode complet découpé (Parties 1-3)' | 'Live Streaming Direct' | 'Compilations Scènes Clés (10+ min)';
  excerptDurationMinutes: number;
  totalViews: number;
  followersCount: number;
  smartcardWatermarkId?: string;
  riskLevel: 'critical' | 'high' | 'medium';
  threatStatus: ThreatStatus;
  takedownStatus: 'Signalement Transmis Meta/TikTok' | 'Vidéo Clôturée' | 'Smartcard Suspendue' | 'Enquête en Cours';
  country: string;
  captureUrl: string;
  lastActiveDate: string;
}

export interface SeriesPiracyItem {
  id: string;
  title: string;
  season: string;
  genre: string;
  releaseYear: number;
  episodesCount: number;
  exclusivityWindow: string;
  telegramChannelsCount: number;
  totalPirateViews: number;
  watermarkBreachesDetected: number;
  linksRemovedCount: number;
  conversionToMyCanalCount: number;
  estimatedLtvFcfa: number;
  riskLevel: 'critical' | 'high' | 'medium';
  threatStatus: ThreatStatus;
  primaryLeakVector: string;
  status: 'active_monitoring' | 'takedown_in_progress' | 'mitigated';
  synopsis: string;
  captureUrl: string;
  country: string;
}

export const mockExcerptPages: SocialExcerptPageItem[] = [
  {
    id: 'PAG-TT-01',
    seriesTitle: 'Le Trône d\'Abon',
    seasonEpisode: 'S01E03 & S01E04',
    pageName: '@SeriesAfro_HD_Officiel',
    platform: 'TikTok',
    platformIcon: '🎵',
    pageUrl: 'https://tiktok.com/@seriesafro_hd_officiel',
    excerptType: 'Extraits Longs (15-25 min)',
    excerptDurationMinutes: 18,
    totalViews: 1450000,
    followersCount: 280000,
    smartcardWatermarkId: '029 481 048 22',
    riskLevel: 'critical',
    threatStatus: 'transmit',
    takedownStatus: 'Signalement Transmis Meta/TikTok',
    country: 'Sénégal',
    captureUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80',
    lastActiveDate: '2026-03-12'
  },
  {
    id: 'PAG-FB-01',
    seriesTitle: 'Cacao',
    seasonEpisode: 'Saison 2 - Épisode 12 (Finale)',
    pageName: 'CinéIvoire & Séries Populaire',
    platform: 'Facebook',
    platformIcon: '📘',
    pageUrl: 'https://facebook.com/cineivoire_series',
    excerptType: 'Épisode complet découpé (Parties 1-3)',
    excerptDurationMinutes: 45,
    totalViews: 980000,
    followersCount: 420000,
    smartcardWatermarkId: '041 982 103 88',
    riskLevel: 'critical',
    threatStatus: 'transmit',
    takedownStatus: 'Signalement Transmis Meta/TikTok',
    country: 'Côte d\'Ivoire',
    captureUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80',
    lastActiveDate: '2026-03-10'
  },
  {
    id: 'PAG-YT-01',
    seriesTitle: 'Spinners',
    seasonEpisode: 'S01E01 à S01E03',
    pageName: 'AfriCine Streaming TV',
    platform: 'YouTube',
    platformIcon: '🔴',
    pageUrl: 'https://youtube.com/c/AfriCineStreamingTV',
    excerptType: 'Live Streaming Direct',
    excerptDurationMinutes: 120,
    totalViews: 620000,
    followersCount: 195000,
    smartcardWatermarkId: '018 339 204 11',
    riskLevel: 'high',
    threatStatus: 'follow',
    takedownStatus: 'Smartcard Suspendue',
    country: 'Cameroun',
    captureUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
    lastActiveDate: '2026-03-08'
  },
  {
    id: 'PAG-TG-01',
    seriesTitle: 'Orisha',
    seasonEpisode: 'S01E01 & S01E02 (Fuite Pré-diffusion)',
    pageName: 'CanalSeries_VIP_Telegram',
    platform: 'Telegram',
    platformIcon: '✈️',
    pageUrl: 'https://t.me/canalseries_vip_hd',
    excerptType: 'Épisode complet découpé (Parties 1-3)',
    excerptDurationMinutes: 52,
    totalViews: 1120000,
    followersCount: 110000,
    smartcardWatermarkId: '092 110 448 30',
    riskLevel: 'critical',
    threatStatus: 'transmit',
    takedownStatus: 'Signalement Transmis Meta/TikTok',
    country: 'Bénin / Cameroun',
    captureUrl: 'https://images.unsplash.com/photo-1518676599625-581d68352b2d?auto=format&fit=crop&w=600&q=80',
    lastActiveDate: '2026-03-11'
  },
  {
    id: 'PAG-IG-01',
    seriesTitle: 'Wara',
    seasonEpisode: 'Saison 2 - Extraits Clés Climax',
    pageName: '@AfriReels_Series_Dakar',
    platform: 'Instagram',
    platformIcon: '📸',
    pageUrl: 'https://instagram.com/afrireels_series_dakar',
    excerptType: 'Compilations Scènes Clés (10+ min)',
    excerptDurationMinutes: 14,
    totalViews: 380000,
    followersCount: 88000,
    riskLevel: 'medium',
    threatStatus: 'analyse',
    takedownStatus: 'Enquête en Cours',
    country: 'Sénégal',
    captureUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80',
    lastActiveDate: '2026-03-05'
  },
  {
    id: 'PAG-TT-02',
    seriesTitle: 'Le Trône d\'Abon',
    seasonEpisode: 'S01E05 - Extraits 20 minutes',
    pageName: '@Abidjan_Buzz_Series',
    platform: 'TikTok',
    platformIcon: '🎵',
    pageUrl: 'https://tiktok.com/@abidjan_buzz_series',
    excerptType: 'Extraits Longs (15-25 min)',
    excerptDurationMinutes: 22,
    totalViews: 820000,
    followersCount: 154000,
    smartcardWatermarkId: '033 118 702 99',
    riskLevel: 'critical',
    threatStatus: 'transmit',
    takedownStatus: 'Signalement Transmis Meta/TikTok',
    country: 'Côte d\'Ivoire',
    captureUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80',
    lastActiveDate: '2026-03-13'
  }
];

export const mockSeriesPiracyList: SeriesPiracyItem[] = [
  {
    id: 'SER-01',
    title: 'Le Trône d\'Abon',
    season: 'Saison 1',
    genre: 'Drame / Pouvoir',
    releaseYear: 2026,
    episodesCount: 10,
    exclusivityWindow: 'Exclusivité Première CANAL+ POP & myCANAL',
    telegramChannelsCount: 42,
    totalPirateViews: 2270000,
    watermarkBreachesDetected: 19,
    linksRemovedCount: 480,
    conversionToMyCanalCount: 4200,
    estimatedLtvFcfa: 189000000,
    riskLevel: 'critical',
    threatStatus: 'transmit',
    primaryLeakVector: 'Pages TikTok & Facebook (Extraits longs 15-25 min) + Canaux Telegram HD',
    status: 'takedown_in_progress',
    synopsis: 'Superproduction CANAL+ Original sur les rivalités dynastiques et politiques en Afrique de l\'Ouest.',
    captureUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80',
    country: 'Sénégal / Côte d\'Ivoire'
  },
  {
    id: 'SER-02',
    title: 'Spinners',
    season: 'Saison 1',
    genre: 'Action / Jeunesse',
    releaseYear: 2025,
    episodesCount: 8,
    exclusivityWindow: 'Série CANAL+ Original & Replay myCANAL',
    telegramChannelsCount: 28,
    totalPirateViews: 620000,
    watermarkBreachesDetected: 12,
    linksRemovedCount: 310,
    conversionToMyCanalCount: 2900,
    estimatedLtvFcfa: 130500000,
    riskLevel: 'high',
    threatStatus: 'follow',
    primaryLeakVector: 'Chaines YouTube Live & Groupes WhatsApp (Rediffusions d\'épisodes)',
    status: 'active_monitoring',
    synopsis: 'L\'histoire palpitante de jeunes pilotes de spinning dans les quartiers du Cap, thriller adrénaline.',
    captureUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
    country: 'Panafricain'
  },
  {
    id: 'SER-03',
    title: 'Cacao',
    season: 'Saison 2',
    genre: 'Saga Familiale',
    releaseYear: 2025,
    episodesCount: 12,
    exclusivityWindow: 'Diffusé sur CANAL+ PREMIERE',
    telegramChannelsCount: 35,
    totalPirateViews: 980000,
    watermarkBreachesDetected: 24,
    linksRemovedCount: 520,
    conversionToMyCanalCount: 5100,
    estimatedLtvFcfa: 229500000,
    riskLevel: 'critical',
    threatStatus: 'close',
    primaryLeakVector: 'Pages Facebook (Épisodes découpés en parties 1, 2 et 3)',
    status: 'mitigated',
    synopsis: 'La guerre sans merci de deux familles rivales pour le contrôle du cacao en Côte d\'Ivoire.',
    captureUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80',
    country: 'Côte d\'Ivoire'
  },
  {
    id: 'SER-04',
    title: 'Wara',
    season: 'Saison 2',
    genre: 'Thriller Politique',
    releaseYear: 2025,
    episodesCount: 8,
    exclusivityWindow: 'Disponible en exclusivité myCANAL',
    telegramChannelsCount: 19,
    totalPirateViews: 380000,
    watermarkBreachesDetected: 8,
    linksRemovedCount: 210,
    conversionToMyCanalCount: 1850,
    estimatedLtvFcfa: 83250000,
    riskLevel: 'medium',
    threatStatus: 'analyse',
    primaryLeakVector: 'Instagram Reels & Comptes myCANAL partagés',
    status: 'mitigated',
    synopsis: 'Un professeur d\'université et ses étudiants luttent contre la corruption dans une capitale africaine.',
    captureUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80',
    country: 'Sénégal'
  },
  {
    id: 'SER-05',
    title: 'Orisha',
    season: 'Saison 1',
    genre: 'Fantastique / Aventure',
    releaseYear: 2026,
    episodesCount: 6,
    exclusivityWindow: 'Nouveauté Événement CANAL+',
    telegramChannelsCount: 51,
    totalPirateViews: 1120000,
    watermarkBreachesDetected: 31,
    linksRemovedCount: 690,
    conversionToMyCanalCount: 6400,
    estimatedLtvFcfa: 288000000,
    riskLevel: 'critical',
    threatStatus: 'transmit',
    primaryLeakVector: 'Canaux Telegram & TikTok Live (Fuites d\'épisodes complets)',
    status: 'takedown_in_progress',
    synopsis: 'Une plongée fantastique dans les mythologies africaines et les gardiens des divinités.',
    captureUrl: 'https://images.unsplash.com/photo-1518676599625-581d68352b2d?auto=format&fit=crop&w=600&q=80',
    country: 'Cameroun / Benin'
  }
];
