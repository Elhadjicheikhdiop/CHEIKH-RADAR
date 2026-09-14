import * as XLSX from 'xlsx';
import { DataImportCategory } from '../types';

export interface TemplateColumnDef {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'enum';
  required: boolean;
  description: string;
  example: string | number;
}

export interface TemplateDefinition {
  id: DataImportCategory;
  title: string;
  subtitle: string;
  badge: string;
  fileName: string;
  sheetName: string;
  columns: TemplateColumnDef[];
  sampleRows: Record<string, any>[];
}

export const IMPORT_TEMPLATES: Record<DataImportCategory, TemplateDefinition> = {
  threats: {
    id: 'threats',
    title: 'Menaces & Flux Pirates Directs',
    subtitle: 'IPTV, diffusions en direct sur les réseaux sociaux, flux M3U8 et retransmissions web illégales de programmes CHEIKH +.',
    badge: 'Flux & Menaces',
    fileName: 'modele_import_menaces_flux_cheikh_plus.xlsx',
    sheetName: 'Menaces_Flux',
    columns: [
      { key: 'identifiant', label: 'ID Menace', type: 'text', required: true, description: 'Code unique (ex: INC-2026-001)', example: 'INC-2026-001' },
      { key: 'nom_menace', label: 'Nom de la menace / Compte', type: 'text', required: true, description: 'Pseudo, titre du stream ou nom du portail', example: '@direct_foot_dakar' },
      { key: 'plateforme_vecteur', label: 'Plateforme / Vecteur', type: 'enum', required: true, description: 'TikTok, IPTV, Facebook, Telegram, Web Streaming, etc.', example: 'TikTok Live' },
      { key: 'cible_programme', label: 'Cible / Programme violé', type: 'text', required: true, description: 'Chaîne ou match CHEIKH + (ex: CHEIKH + Sport 1 / Champions League)', example: 'CHEIKH + Sport 1 / Ligue des Champions' },
      { key: 'filiale_pays', label: 'Filiale / Pays', type: 'text', required: true, description: 'Sénégal, Côte d\'Ivoire, Cameroun, Mali, Gabon, RDC, etc.', example: 'Sénégal' },
      { key: 'code_pays', label: 'Code Pays (ISO)', type: 'text', required: false, description: 'SN, CI, CM, ML, GA, CD', example: 'SN' },
      { key: 'severite', label: 'Sévérité', type: 'enum', required: true, description: 'critical, high, medium, low', example: 'critical' },
      { key: 'statut', label: 'Statut de traitement', type: 'enum', required: true, description: 'analyse, follow, transmit, close', example: 'analyse' },
      { key: 'url_flux', label: 'URL du Flux ou Profil', type: 'text', required: false, description: 'Lien direct vers la diffusion ou le compte', example: 'https://tiktok.com/@direct_foot_dakar/live' },
      { key: 'spectateurs_estimes', label: 'Spectateurs constatés', type: 'number', required: false, description: 'Audience en direct ou abonnés connectés', example: 14200 },
      { key: 'perte_estimee_fcfa', label: 'Manque à gagner estimé (FCFA)', type: 'number', required: false, description: 'Impact financier mensuel estimé', example: 850000 },
      { key: 'details_techniques', label: 'Détails techniques & constat', type: 'text', required: false, description: 'Résolution, logo pirate incrusté, numéro de contact Wave', example: 'Diffusion 720p avec numéro Wave marchand +221 77 123 45 67 affiché' },
      { key: 'url_capture_preuve', label: 'URL Capture / Preuve', type: 'text', required: false, description: 'Lien vers l\'image de preuve ou constat', example: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800' },
    ],
    sampleRows: [
      {
        identifiant: 'INC-2026-SN-101',
        nom_menace: '@foot_direct_dakar',
        plateforme_vecteur: 'TikTok Live',
        cible_programme: 'CHEIKH + Sport 1 / Champions League PSG-Bayern',
        filiale_pays: 'Sénégal',
        code_pays: 'SN',
        severite: 'critical',
        statut: 'analyse',
        url_flux: 'https://tiktok.com/@foot_direct_dakar/live',
        spectateurs_estimes: 16500,
        perte_estimee_fcfa: 990000,
        details_techniques: 'Logo pirate incrusté en bas à droite, incitation au don Wave (+221 77 412 88 19)',
        url_capture_preuve: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQelV8tMxRqB9rnA6rAwzGFKutzfGjczM3r77RSxrcOs3IiPsZ_8BbYlyI48N_tB_x1VACXV20HDTC9kmKPK6D6Zjzfvn2MUaZBfutchSPsD-hU-5Vp6oNLKIAR8iKPuiaB1qS81GJ5FZ2-hXqhiqb5HxUeubUr_ymBMEguCb6uzbiCh8uafp4wxHcjYo7iLTBcAuVzVfrHqbNwosg4vm2mflHlLLPDeKpR3SvF22Qa7CuutwCJ-Fs',
      },
      {
        identifiant: 'INC-2026-CI-102',
        nom_menace: 'Serveur IPTV "Abidjan Gold TV"',
        plateforme_vecteur: 'IPTV M3U8',
        cible_programme: 'Bouquet CHEIKH + Afrique complet (24 chaînes)',
        filiale_pays: 'Côte d\'Ivoire',
        code_pays: 'CI',
        severite: 'critical',
        statut: 'transmit',
        url_flux: 'http://iptv-abidjan-gold.stream:8080/live/user/pass/flux1.m3u8',
        spectateurs_estimes: 42000,
        perte_estimee_fcfa: 3500000,
        details_techniques: 'Flux HLS re-streamé depuis serveur OVH Roubaix via CDN Cloudflare. Vente via Orange Money CI',
        url_capture_preuve: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800',
      },
      {
        identifiant: 'INC-2026-CM-103',
        nom_menace: 'Groupe Telegram "Cameroun Foot HD"',
        plateforme_vecteur: 'Telegram',
        cible_programme: 'CHEIKH + Première & Événements Sportifs',
        filiale_pays: 'Cameroun',
        code_pays: 'CM',
        severite: 'high',
        statut: 'follow',
        url_flux: 'https://t.me/cameroun_foot_hd',
        spectateurs_estimes: 8900,
        perte_estimee_fcfa: 520000,
        details_techniques: 'Partage de liens m3u8 périodiques protégés par mot de passe. Paiement MTN Mobile Money',
        url_capture_preuve: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800',
      },
    ],
  },

  applications: {
    id: 'applications',
    title: 'Applications Mobiles & APKs Android',
    subtitle: 'Applications piratées diffusant les chaînes CHEIKH + sur Android, boîtiers TV et stores alternatifs.',
    badge: 'Applications APK',
    fileName: 'modele_import_applications_apk_cheikh_plus.xlsx',
    sheetName: 'Applications_APK',
    columns: [
      { key: 'identifiant', label: 'ID Application', type: 'text', required: true, description: 'Code unique (ex: APK-2026-01)', example: 'APK-2026-01' },
      { key: 'nom_application', label: 'Nom de l\'application', type: 'text', required: true, description: 'Nom affiché (ex: Direct Foot Africa APK)', example: 'Direct Foot Africa APK' },
      { key: 'package_id', label: 'Package Name Android', type: 'text', required: true, description: 'Format com.editeur.app', example: 'com.africastream.livefoot' },
      { key: 'version', label: 'Version de l\'APK', type: 'text', required: false, description: 'v3.2, v4.0.1, etc.', example: 'v3.2' },
      { key: 'source_hebergeur', label: 'Source d\'hébergement', type: 'text', required: true, description: 'MediaFire, APKPure, Telegram, Site web dédié', example: 'MediaFire / Telegram' },
      { key: 'lien_telechargement', label: 'Lien de téléchargement', type: 'text', required: false, description: 'URL de l\'APK ou page de téléchargement', example: 'https://mediafire.com/file/directfoot_v32.apk' },
      { key: 'statut', label: 'Statut juridique / store', type: 'enum', required: true, description: 'analyse, follow, transmit, close', example: 'analyse' },
      { key: 'filiale_cible', label: 'Filiale / Pays ciblée', type: 'text', required: true, description: 'Côte d\'Ivoire, Sénégal, Cameroun, etc.', example: 'Côte d\'Ivoire' },
      { key: 'nb_telechargements', label: 'Téléchargements estimés', type: 'text', required: false, description: 'Volume de téléchargements constatés', example: '45 000+' },
      { key: 'chaines_impactees', label: 'Chaînes CHEIKH + impactées', type: 'text', required: false, description: 'Liste des flux intégrés dans l\'APK', example: 'CHEIKH + Sport 1, 2, 3, 4, CHEIKH + Action' },
      { key: 'sha256_hash', label: 'Empreinte SHA-256 de l\'APK', type: 'text', required: false, description: 'Hash cryptographique pour preuve juridique', example: 'a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8' },
      { key: 'url_capture_icone', label: 'URL Capture / Icône', type: 'text', required: false, description: 'Lien vers capture d\'écran de l\'application', example: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800' },
    ],
    sampleRows: [
      {
        identifiant: 'APK-2026-01',
        nom_application: 'Live Foot Africa Pro',
        package_id: 'com.livefoot.africapro',
        version: 'v4.1.0',
        source_hebergeur: 'Telegram & MediaFire',
        lien_telechargement: 'https://t.me/livefoot_apk/129',
        statut: 'transmit',
        filiale_cible: 'Côte d\'Ivoire',
        nb_telechargements: '68 000+',
        chaines_impactees: 'CHEIKH + Sport 1, 2, 3, CHEIKH + Action',
        sha256_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        url_capture_icone: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
      },
      {
        identifiant: 'APK-2026-02',
        nom_application: 'Dakar Stream TV Boîtier',
        package_id: 'com.dakarstream.androidbox',
        version: 'v2.8',
        source_hebergeur: 'Site vitrine revendeur local',
        lien_telechargement: 'http://dakar-stream-tv.com/install.apk',
        statut: 'analyse',
        filiale_cible: 'Sénégal',
        nb_telechargements: '25 000+',
        chaines_impactees: 'Bouquet CHEIKH + complet, Novelas, Cinéma',
        sha256_hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        url_capture_icone: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800',
      },
    ],
  },

  accounts: {
    id: 'accounts',
    title: 'Comptes & Réseaux Sociaux',
    subtitle: 'Pages, comptes et groupes diffusant ou revendant des accès pirates sur TikTok, Telegram, Facebook, WhatsApp et YouTube.',
    badge: 'Réseaux Sociaux',
    fileName: 'modele_import_comptes_reseaux_sociaux.xlsx',
    sheetName: 'Comptes_Reseaux',
    columns: [
      { key: 'identifiant', label: 'ID Compte', type: 'text', required: true, description: 'Code unique (ex: ACC-2026-01)', example: 'ACC-2026-01' },
      { key: 'nom_compte_ou_page', label: 'Nom du compte / pseudo', type: 'text', required: true, description: 'Nom de la page ou handle officiel', example: '@senegal_foot_live' },
      { key: 'plateforme', label: 'Plateforme', type: 'enum', required: true, description: 'TikTok, Telegram, Facebook, WhatsApp, YouTube', example: 'TikTok' },
      { key: 'url_compte', label: 'URL du compte ou profil', type: 'text', required: true, description: 'Lien web vers le profil public', example: 'https://tiktok.com/@senegal_foot_live' },
      { key: 'filiale_pays', label: 'Filiale / Pays', type: 'text', required: true, description: 'Sénégal, Côte d\'Ivoire, Cameroun, etc.', example: 'Sénégal' },
      { key: 'abonnes_membres', label: 'Nombre d\'abonnés / membres', type: 'text', required: false, description: 'ex: 85 000 abonnés', example: '85 000 abonnés' },
      { key: 'audience_estimee', label: 'Audience moyenne par match', type: 'text', required: false, description: 'ex: 12 000 spectateurs en direct', example: '12 000 spectateurs' },
      { key: 'moyen_paiement', label: 'Moyen de monétisation Wave/OM', type: 'text', required: false, description: 'Wave, Orange Money, MoMo + numéro', example: 'Wave Sénégal (+221 77 987 65 43)' },
      { key: 'statut', label: 'Statut de suivi', type: 'enum', required: true, description: 'analyse, follow, transmit, close', example: 'transmit' },
      { key: 'url_capture', label: 'URL Capture d\'écran', type: 'text', required: false, description: 'Lien vers capture d\'écran du profil', example: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800' },
    ],
    sampleRows: [
      {
        identifiant: 'ACC-2026-01',
        nom_compte_ou_page: 'Dakar Live Match VIP',
        plateforme: 'TikTok',
        url_compte: 'https://tiktok.com/@dakarlivematch',
        filiale_pays: 'Sénégal',
        abonnes_membres: '92 000 abonnés',
        audience_estimee: '18 500 spectateurs',
        moyen_paiement: 'Wave Sénégal (+221 77 345 88 12)',
        statut: 'transmit',
        url_capture: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800',
      },
      {
        identifiant: 'ACC-2026-02',
        nom_compte_ou_page: 'VIP Foot Panafrique Abidjan',
        plateforme: 'Telegram',
        url_compte: 'https://t.me/abidjan_foot_vip',
        filiale_pays: 'Côte d\'Ivoire',
        abonnes_membres: '34 000 membres',
        audience_estimee: '14 000 spectateurs',
        moyen_paiement: 'Orange Money CI (+225 07 48 99 11 22)',
        statut: 'analyse',
        url_capture: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
      },
    ],
  },

  sites: {
    id: 'sites',
    title: 'Sites Web, Portails de Streaming & Forums',
    subtitle: 'Noms de domaine, blogs sportifs illégaux, annuaires de clés IPTV et forums de partage pirate.',
    badge: 'Sites & Forums',
    fileName: 'modele_import_sites_web_forums.xlsx',
    sheetName: 'Sites_Forums',
    columns: [
      { key: 'identifiant', label: 'ID Site/Forum', type: 'text', required: true, description: 'Code unique (ex: SITE-2026-01)', example: 'SITE-2026-01' },
      { key: 'nom_domaine', label: 'Nom de domaine', type: 'text', required: true, description: 'Domaine principal (ex: africastream-direct.net)', example: 'africastream-direct.net' },
      { key: 'nom_forum_ou_portail', label: 'Nom du portail / forum', type: 'text', required: false, description: 'Titre de la plateforme', example: 'Portail Africa Sport Live' },
      { key: 'type', label: 'Type de plateforme', type: 'enum', required: true, description: 'site ou forum', example: 'site' },
      { key: 'filiale_pays_cible', label: 'Filiale / Pays ciblée', type: 'text', required: true, description: 'Panafrique, Sénégal, Côte d\'Ivoire, Cameroun', example: 'Panafrique' },
      { key: 'statut', label: 'Statut de traitement', type: 'enum', required: true, description: 'analyse, follow, transmit, close', example: 'analyse' },
      { key: 'ip_serveur', label: 'Adresse IP du serveur', type: 'text', required: false, description: 'IP hôte (ex: 104.21.44.82)', example: '104.21.44.82' },
      { key: 'asn_hebergeur', label: 'Hébergeur / ASN', type: 'text', required: false, description: 'Cloudflare Inc. (AS13335), OVH, Hetzner, etc.', example: 'Cloudflare Inc. (AS13335)' },
      { key: 'protocole', label: 'Protocole de diffusion', type: 'text', required: false, description: 'HTTPS / HLS / WebRTC', example: 'HTTPS / HLS' },
      { key: 'lien_acces', label: 'Lien direct', type: 'text', required: false, description: 'URL complète de visionnage', example: 'https://africastream-direct.net/cheikh-sport-1' },
      { key: 'url_capture', label: 'URL Capture d\'écran', type: 'text', required: false, description: 'Preuve horodatée de visionnage', example: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800' },
    ],
    sampleRows: [
      {
        identifiant: 'SITE-2026-01',
        nom_domaine: 'africastream-live.net',
        nom_forum_ou_portail: 'Portail Africa Stream Live',
        type: 'site',
        filiale_pays_cible: 'Panafrique',
        statut: 'transmit',
        ip_serveur: '104.21.44.82',
        asn_hebergeur: 'Cloudflare Inc. (AS13335)',
        protocole: 'HTTPS / HLS m3u8',
        lien_acces: 'https://africastream-live.net/live/cheikh-plus-sport-1',
        url_capture: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      },
      {
        identifiant: 'SITE-2026-02',
        nom_domaine: 'forum-iptv-dakar.com',
        nom_forum_ou_portail: 'Communauté IPTV Dakar Sharing',
        type: 'forum',
        filiale_pays_cible: 'Sénégal',
        statut: 'follow',
        ip_serveur: '185.190.140.33',
        asn_hebergeur: 'Alexhost SRL',
        protocole: 'HTTPS / PHPBB',
        lien_acces: 'https://forum-iptv-dakar.com/viewtopic.php?id=941',
        url_capture: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
      },
    ],
  },

  google_forms: {
    id: 'google_forms',
    title: 'Rapports Google Forms / Enquêtes Terrain CHEIKH +',
    subtitle: 'Remontées directes des enquêteurs terrain, contrôleurs d\'établissements, descentes de police et signalements des revendeurs illégaux.',
    badge: 'Google Forms & Terrain',
    fileName: 'modele_import_rapports_google_forms_terrain.xlsx',
    sheetName: 'Enquetes_Google_Forms',
    columns: [
      { key: 'Horodateur', label: 'Horodateur (Timestamp)', type: 'date', required: true, description: 'Date et heure de soumission du formulaire', example: '14/09/2026 10:15:00' },
      { key: 'Nom_Enqueteur_Agent', label: 'Nom de l\'enquêteur / Agent', type: 'text', required: true, description: 'Prénom et nom de l\'agent CHEIKH + ou juriste', example: 'Mamadou Diallo - Inspecteur Commercial' },
      { key: 'Filiale_Pays', label: 'Filiale / Pays', type: 'text', required: true, description: 'Sénégal, Côte d\'Ivoire, Cameroun, Mali, Gabon, RDC', example: 'Sénégal' },
      { key: 'Ville', label: 'Ville', type: 'text', required: true, description: 'Dakar, Abidjan, Douala, Bamako, etc.', example: 'Dakar' },
      { key: 'Quartier_Zone', label: 'Quartier / Marché / Zone', type: 'text', required: true, description: 'Préciser la zone (ex: Médina, Cocody, Akwa)', example: 'Médina - Marché Tilène' },
      { key: 'Type_Piratage_Constate', label: 'Type d\'infraction constatée', type: 'enum', required: true, description: 'Revente boîtiers IPTV, Câblage clandestin, Revente codes Wave, Visionnage public commercial non payé', example: 'Revente de boîtiers IPTV préconfigurés' },
      { key: 'Nom_Revendeur_Etablissement', label: 'Nom du revendeur / Établissement', type: 'text', required: true, description: 'Nom commercial ou identité du contrevenant', example: 'Boutique "Électro Flash Médina"' },
      { key: 'Numero_Paiement_Wave_OrangeMoney', label: 'Numéro Mobile Money (Wave / OM)', type: 'text', required: false, description: 'Numéro utilisé pour encaisser les paiements pirates', example: '+221 77 555 44 33 (Wave)' },
      { key: 'Tarif_Pratique_FCFA', label: 'Tarif pirate proposé (FCFA)', type: 'text', required: false, description: 'ex: 2 500 FCFA / mois', example: '3 000 FCFA / mois' },
      { key: 'Foyers_Clients_Estimes', label: 'Nombre de foyers / clients estimés', type: 'number', required: false, description: 'Estimation de l\'audience locale raccordée', example: 180 },
      { key: 'Materiel_Saisi_Constate', label: 'Matériel saisi ou photographié', type: 'text', required: false, description: '12 boîtiers Android TV, 2 paraboles, câbles splitters', example: '8 boîtiers Android TV box saisis, 1 carte bancaire prépayée' },
      { key: 'Statut_Action_Menee', label: 'Action menée / Procédure judiciaire', type: 'text', required: false, description: 'Constat d\'huissier, Plainte gendarmerie, Mise en demeure', example: 'Constat d\'huissier rédigé et transmission gendarmerie' },
      { key: 'Lien_Photo_Preuve', label: 'Lien photo / capture de preuve', type: 'text', required: false, description: 'Lien URL ou référence de l\'image de preuve', example: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800' },
    ],
    sampleRows: [
      {
        Horodateur: '14/09/2026 09:30:00',
        Nom_Enqueteur_Agent: 'Abdoulaye Ndiaye (CHEIKH + SN)',
        Filiale_Pays: 'Sénégal',
        Ville: 'Dakar',
        Quartier_Zone: 'Parcelles Assainies Unité 17',
        Type_Piratage_Constate: 'Revente de boîtiers IPTV avec abonnement illégal 1 an',
        Nom_Revendeur_Etablissement: 'Boutique HighTech PA',
        Numero_Paiement_Wave_OrangeMoney: '+221 78 123 45 67 (Wave)',
        Tarif_Pratique_FCFA: '25 000 FCFA / an',
        Foyers_Clients_Estimes: 350,
        Materiel_Saisi_Constate: '18 boîtiers Xiaomi TV Box flashés avec application pirate préinstallée',
        Statut_Action_Menee: 'Plainte déposée auprès de la Division Spéciale de Cybersécurité (DSC)',
        Lien_Photo_Preuve: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800',
      },
      {
        Horodateur: '13/09/2026 15:45:00',
        Nom_Enqueteur_Agent: 'Kouamé Konan (CHEIKH + CI)',
        Filiale_Pays: 'Côte d\'Ivoire',
        Ville: 'Abidjan',
        Quartier_Zone: 'Yopougon - Rue Princesse',
        Type_Piratage_Constate: 'Maquis et bars raccordés à un décodeur pirate unique partagé',
        Nom_Revendeur_Etablissement: 'Réseau Câblé Privé Yop',
        Numero_Paiement_Wave_OrangeMoney: '+225 07 88 12 34 56 (Orange Money)',
        Tarif_Pratique_FCFA: '2 000 FCFA / mois par écran',
        Foyers_Clients_Estimes: 120,
        Materiel_Saisi_Constate: 'Modulateurs RF HDMI, 4 amplificateurs coaxiaux',
        Statut_Action_Menee: 'Mise en demeure délivrée par Me Traoré (Huissier)',
        Lien_Photo_Preuve: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      },
      {
        Horodateur: '11/09/2026 11:10:00',
        Nom_Enqueteur_Agent: 'Jean-Paul Mbarga (CHEIKH + CM)',
        Filiale_Pays: 'Cameroun',
        Ville: 'Douala',
        Quartier_Zone: 'Akwa - Carrefour Idéal',
        Type_Piratage_Constate: 'Revente de codes IPTV M3U sur stand de rue',
        Nom_Revendeur_Etablissement: 'Stand "Foot Direct Douala"',
        Numero_Paiement_Wave_OrangeMoney: '+237 6 77 12 34 56 (MTN MoMo)',
        Tarif_Pratique_FCFA: '1 500 FCFA / mois',
        Foyers_Clients_Estimes: 220,
        Materiel_Saisi_Constate: 'Disques durs externes avec 450 APKs de streaming préchargées',
        Statut_Action_Menee: 'Saisie conjointe avec brigade de gendarmerie d\'Akwa',
        Lien_Photo_Preuve: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
      },
    ],
  },
};

/**
 * Génère et déclenche le téléchargement d'un classeur Excel (.xlsx) stylisé
 */
export function downloadExcelTemplate(category: DataImportCategory) {
  const tpl = IMPORT_TEMPLATES[category];
  if (!tpl) return;

  // Création de la feuille avec les lignes d'exemple
  const worksheet = XLSX.utils.json_to_sheet(tpl.sampleRows);

  // Largeur optimale des colonnes
  const colWidths = tpl.columns.map((col) => ({
    wch: Math.max(col.label.length, 16),
  }));
  worksheet['!cols'] = colWidths;

  // Création du classeur
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, tpl.sheetName);

  // Feuille de documentation / dictionnaire des champs
  const docRows = tpl.columns.map((col) => ({
    'Colonne / Champ': col.key,
    'Libellé En-tête': col.label,
    'Type attendu': col.type,
    'Obligatoire ?': col.required ? 'OUI' : 'Facultatif',
    'Description & Instructions': col.description,
    'Exemple type': String(col.example),
  }));
  const docWorksheet = XLSX.utils.json_to_sheet(docRows);
  docWorksheet['!cols'] = [{ wch: 22 }, { wch: 28 }, { wch: 14 }, { wch: 14 }, { wch: 45 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(workbook, docWorksheet, 'Guide_des_Colonnes');

  // Téléchargement
  XLSX.writeFile(workbook, tpl.fileName);
}

/**
 * Télécharge un modèle au format CSV UTF-8
 */
export function downloadCsvTemplate(category: DataImportCategory) {
  const tpl = IMPORT_TEMPLATES[category];
  if (!tpl) return;

  const worksheet = XLSX.utils.json_to_sheet(tpl.sampleRows);
  const csvContent = XLSX.utils.sheet_to_csv(worksheet, { FS: ';' });
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', tpl.fileName.replace('.xlsx', '.csv'));
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Télécharge un classeur Excel complet multi-onglets regroupant TOUS les modèles
 */
export function downloadAllTemplatesMasterWorkbook() {
  const masterWorkbook = XLSX.utils.book_new();

  (Object.keys(IMPORT_TEMPLATES) as DataImportCategory[]).forEach((cat) => {
    const tpl = IMPORT_TEMPLATES[cat];
    const ws = XLSX.utils.json_to_sheet(tpl.sampleRows);
    ws['!cols'] = tpl.columns.map((col) => ({ wch: Math.max(col.label.length, 16) }));
    XLSX.utils.book_append_sheet(masterWorkbook, ws, tpl.sheetName);
  });

  XLSX.writeFile(masterWorkbook, 'PACK_COMPLET_MODELES_IMPORT_CHEIKH_AFRIQUE.xlsx');
}
