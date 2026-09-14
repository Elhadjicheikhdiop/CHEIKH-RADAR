import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  FileSpreadsheet,
  UploadCloud,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Image as ImageIcon,
  HelpCircle,
  Clock,
  Eye,
  Trash2,
  Layers,
  Sparkles,
  Smartphone,
  Share2,
  Globe,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Plus,
  X,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import {
  Threat,
  AppItem,
  AccountItem,
  SiteForumItem,
  DataImportCategory,
  EvidenceItem,
  ImportHistoryRecord,
} from '../types';
import { FieldSurveyData } from '../data/marketData';
import {
  IMPORT_TEMPLATES,
  downloadExcelTemplate,
  downloadCsvTemplate,
  downloadAllTemplatesMasterWorkbook,
} from '../utils/excelTemplates';

interface DataImportPageProps {
  threats: Threat[];
  applications: AppItem[];
  accounts: AccountItem[];
  sitesForums: SiteForumItem[];
  fieldSurveys: FieldSurveyData[];
  evidenceList: EvidenceItem[];
  onImportThreats: (newThreats: Threat[]) => void;
  onImportApplications: (newApps: AppItem[]) => void;
  onImportAccounts: (newAccounts: AccountItem[]) => void;
  onImportSitesForums: (newSites: SiteForumItem[]) => void;
  onImportFieldSurveys: (newSurveys: FieldSurveyData[]) => void;
  onAddEvidence: (newEvidence: EvidenceItem) => void;
  onShowToast: (message: string) => void;
  onNavigateToPage: (page: any) => void;
}

type TabType = 'import' | 'templates' | 'google-forms' | 'captures' | 'history';

export const DataImportPage: React.FC<DataImportPageProps> = ({
  threats,
  applications,
  accounts,
  sitesForums,
  fieldSurveys,
  evidenceList,
  onImportThreats,
  onImportApplications,
  onImportAccounts,
  onImportSitesForums,
  onImportFieldSurveys,
  onAddEvidence,
  onShowToast,
  onNavigateToPage,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('import');
  const [selectedCategory, setSelectedCategory] = useState<DataImportCategory>('threats');

  // État du fichier en cours d'analyse
  const [parsedFileName, setParsedFileName] = useState<string | null>(null);
  const [parsedFileSize, setParsedFileSize] = useState<string | null>(null);
  const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
  const [parsedRows, setParsedRows] = useState<Record<string, any>[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [previewModalEvidence, setPreviewModalEvidence] = useState<EvidenceItem | null>(null);

  // Historique des imports
  const [importHistory, setImportHistory] = useState<ImportHistoryRecord[]>([
    {
      id: 'HIST-001',
      fileName: 'remontees_terrain_dakar_septembre.xlsx',
      category: 'google_forms',
      rowsCount: 14,
      importedAt: '14/09/2026 08:30',
      status: 'success',
      details: '14 signalements d\'enquêtes terrain Dakar & Thiès intégrés',
    },
    {
      id: 'HIST-002',
      fileName: 'flux_pirates_afcon_tiktok.csv',
      category: 'threats',
      rowsCount: 8,
      importedAt: '13/09/2026 19:12',
      status: 'success',
      details: '8 flux directs TikTok & IPTV détectés et transmis pour blocage',
    },
    {
      id: 'HIST-003',
      fileName: 'apks_pirates_abidjan_stores.xlsx',
      category: 'applications',
      rowsCount: 5,
      importedAt: '11/09/2026 14:05',
      status: 'success',
      details: '5 applications pirates Android signalées pour notification hébergeur',
    },
  ]);

  // Formulaire pour nouvelle capture d'écran
  const [newEvidenceTitle, setNewEvidenceTitle] = useState('');
  const [newEvidenceType, setNewEvidenceType] = useState<EvidenceItem['type']>('stream_capture');
  const [newEvidenceCountry, setNewEvidenceCountry] = useState('Sénégal');
  const [newEvidenceNotes, setNewEvidenceNotes] = useState('');
  const [newEvidenceFile, setNewEvidenceFile] = useState<File | null>(null);
  const [newEvidencePreviewUrl, setNewEvidencePreviewUrl] = useState<string | null>(null);

  // Formulaire rapide pour signalement direct Google Forms
  const [gfAgent, setGfAgent] = useState('');
  const [gfCountry, setGfCountry] = useState('Sénégal');
  const [gfCity, setGfCity] = useState('Dakar');
  const [gfZone, setGfZone] = useState('');
  const [gfVendor, setGfVendor] = useState('');
  const [gfPayment, setGfPayment] = useState('');
  const [gfType, setGfType] = useState('Revente de boîtiers IPTV préconfigurés');
  const [gfSampleSize, setGfSampleSize] = useState('150');
  const [gfMaterial, setGfMaterial] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Détection automatique de la catégorie selon les colonnes du classeur
  const detectCategoryFromHeaders = (headers: string[]): DataImportCategory => {
    const normalized = headers.map((h) => h.toLowerCase().trim());
    if (normalized.some((h) => h.includes('horodateur') || h.includes('enqueteur') || h.includes('revendeur'))) {
      return 'google_forms';
    }
    if (normalized.some((h) => h.includes('package') || h.includes('apk') || h.includes('version'))) {
      return 'applications';
    }
    if (normalized.some((h) => h.includes('plateforme') || h.includes('abonnes') || h.includes('wave') || h.includes('followers'))) {
      return 'accounts';
    }
    if (normalized.some((h) => h.includes('domaine') || h.includes('asn') || h.includes('ip_serveur'))) {
      return 'sites';
    }
    return 'threats';
  };

  // Traitement d'un fichier Excel / CSV déposé
  const handleFileUpload = (file: File) => {
    setIsProcessing(true);
    setParsedFileName(file.name);
    setParsedFileSize(`${(file.size / 1024).toFixed(1)} Ko`);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });

        if (json.length === 0) {
          onShowToast('Attention : Le fichier sélectionné est vide.');
          setIsProcessing(false);
          return;
        }

        const headers = Object.keys(json[0] || {});
        setParsedHeaders(headers);
        setParsedRows(json);

        // Auto-sélection intelligente de la catégorie si non déjà forcée
        const detected = detectCategoryFromHeaders(headers);
        setSelectedCategory(detected);

        onShowToast(`Fichier analysé avec succès : ${json.length} lignes détectées (Catégorie : ${IMPORT_TEMPLATES[detected].badge}).`);
      } catch (err) {
        console.error('Erreur lors de la lecture du fichier Excel:', err);
        onShowToast('Erreur : Impossible de lire ce fichier. Veuillez utiliser un format .xlsx ou .csv.');
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Glisser-déposer de fichier
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Chargement rapide d'un jeu de données d'essai
  const handleLoadSampleData = () => {
    const tpl = IMPORT_TEMPLATES[selectedCategory];
    setParsedFileName(`echantillon_${tpl.fileName}`);
    setParsedFileSize('32.5 Ko');
    setParsedHeaders(tpl.columns.map((c) => c.key));
    setParsedRows(tpl.sampleRows);
    onShowToast(`Jeu de données de test chargé : ${tpl.sampleRows.length} lignes pour "${tpl.title}".`);
  };

  // Réinitialisation de la prévisualisation
  const handleClearParsed = () => {
    setParsedFileName(null);
    setParsedFileSize(null);
    setParsedHeaders([]);
    setParsedRows([]);
  };

  // Validation finale et injection dans l'application
  const handleCommitImport = () => {
    if (!parsedRows.length) return;

    const count = parsedRows.length;

    if (selectedCategory === 'threats') {
      const newThreats: Threat[] = parsedRows.map((row, idx) => {
        const id = row.identifiant || `INC-IMP-${Date.now()}-${idx + 1}`;
        const name = row.nom_menace || row.nom || `Flux Pirate #${idx + 1}`;
        const channel = row.plateforme_vecteur || row.vecteur_plateforme || row.plateforme || 'IPTV / Web';
        const target = row.cible_programme || 'CHEIKH + Afrique';
        const country = row.filiale_pays || 'Sénégal';
        const countryCode = row.code_pays || (country === "Côte d'Ivoire" ? 'CI' : 'SN');
        const severity = (row.severite || 'high') as any;
        const status = (row.statut || 'analyse') as any;
        const viewers = row.spectateurs_estimes ? `${Number(row.spectateurs_estimes).toLocaleString()} spectateurs` : '5 000 spectateurs';

        return {
          id,
          name,
          target,
          channel,
          platform: channel,
          category: channel.toLowerCase().includes('tiktok') || channel.toLowerCase().includes('facebook') ? 'social' : 'iptv',
          country,
          countryCode,
          detectionDate: "Aujourd'hui, " + new Date().toLocaleTimeString().slice(0, 5),
          detectionTimestamp: new Date().toISOString(),
          status,
          content: target,
          rightsHolder: 'CHEIKH + AFRIQUE',
          iconType: 'videocam',
          severity,
          viewersCount: viewers,
          streamUrl: row.url_flux || '',
          technicalDetails: row.details_techniques || 'Importé via classeur Excel',
          evidenceCaptureUrl: row.url_capture_preuve || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
          sha256: `imp_${Math.random().toString(36).substring(2, 15)}`,
          actionLogs: [
            {
              id: `log-${Date.now()}-${idx}`,
              time: new Date().toLocaleTimeString().slice(0, 5),
              actor: 'Import Excel CHEIKH +',
              description: `Enregistrement automatique suite à l'importation du fichier ${parsedFileName}`,
              type: 'system',
            },
          ],
        };
      });

      onImportThreats(newThreats);
    } else if (selectedCategory === 'applications') {
      const newApps: AppItem[] = parsedRows.map((row, idx) => ({
        id: row.identifiant || `APK-IMP-${Date.now()}-${idx + 1}`,
        name: row.nom_application || `App Pirate #${idx + 1}`,
        version: row.version || 'v1.0',
        source: row.source_hebergeur || 'Telegram / MediaFire',
        detectionDate: 'Aujourd\'hui',
        link: row.lien_telechargement || '#',
        captureUrl: row.url_capture_icone || 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
        packageId: row.package_id || `com.pirate.stream${idx + 1}`,
        sha256: row.sha256_hash || '7f8c12a89df50e90c9b0e1a87c12f45037d04e21a8c039fb8c1a890412e0b9d',
        status: (row.statut || 'analyse') as any,
        country: row.filiale_cible || 'Côte d\'Ivoire',
        affectedStreams: (row.chaines_impactees || 'CHEIKH + Sport 1').split(','),
        downloadsCount: row.nb_telechargements || '10 000+',
      }));
      onImportApplications(newApps);
    } else if (selectedCategory === 'accounts') {
      const newAccounts: AccountItem[] = parsedRows.map((row, idx) => ({
        id: row.identifiant || `ACC-IMP-${Date.now()}-${idx + 1}`,
        name: row.nom_compte_ou_page || `@compte_pirate_${idx + 1}`,
        platform: row.plateforme || 'TikTok',
        accountUrl: row.url_compte || 'https://tiktok.com',
        captureUrl: row.url_capture || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800',
        detectionDate: 'Aujourd\'hui',
        linkedPosts: [],
        country: row.filiale_pays || 'Sénégal',
        status: (row.statut || 'analyse') as any,
        followers: row.abonnes_membres || '25 000 abonnés',
        estimatedAudience: row.audience_estimee || '8 000 spectateurs',
        monetizationMethod: row.moyen_paiement || 'Wave Sénégal',
      }));
      onImportAccounts(newAccounts);
    } else if (selectedCategory === 'sites') {
      const newSites: SiteForumItem[] = parsedRows.map((row, idx) => ({
        id: row.identifiant || `SITE-IMP-${Date.now()}-${idx + 1}`,
        siteDomain: row.nom_domaine || 'stream-afrique.org',
        forumName: row.nom_forum_ou_portail,
        subjectOrPage: 'Diffusion non autorisée bouquets sport',
        link: row.lien_acces || 'https://stream-afrique.org',
        captureUrl: row.url_capture || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
        detectionDate: 'Aujourd\'hui',
        type: (row.type === 'forum' ? 'forum' : 'site') as any,
        country: row.filiale_pays_cible || 'Panafrique',
        status: (row.statut || 'analyse') as any,
        hostingAsn: row.asn_hebergeur || 'Cloudflare Inc. (AS13335)',
        ipAddress: row.ip_serveur || '104.21.44.82',
        protocol: row.protocole || 'HTTPS / HLS',
      }));
      onImportSitesForums(newSites);
    } else if (selectedCategory === 'google_forms') {
      const newSurveys: FieldSurveyData[] = parsedRows.map((row, idx) => ({
        id: `SURV-IMP-${Date.now()}-${idx + 1}`,
        date: row.Horodateur?.slice(0, 10) || new Date().toLocaleDateString('fr-FR'),
        city: row.Ville || 'Dakar',
        neighborhood: row.Quartier_Zone || 'Centre-ville',
        sampleSize: Number(row.Foyers_Clients_Estimes) || 120,
        piracyPenetrationRate: 35.0,
        preferredPirateDevice: row.Type_Piratage_Constate || 'Boîtier Android IPTV',
        primaryMotivation: 'Tarif & Revente clandestine',
        mobileMoneyUsed: row.Numero_Paiement_Wave_OrangeMoney || 'Wave / Orange Money',
        auditor: row.Nom_Enqueteur_Agent || 'Inspecteur Terrain CHEIKH +',
      }));
      onImportFieldSurveys(newSurveys);
    }

    // Ajout à l'historique
    const newRecord: ImportHistoryRecord = {
      id: `HIST-${Date.now()}`,
      fileName: parsedFileName || 'import_manuel.xlsx',
      category: selectedCategory,
      rowsCount: count,
      importedAt: new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
      status: 'success',
      details: `${count} entrées intégrées avec succès dans la base de données.`,
    };
    setImportHistory([newRecord, ...importHistory]);

    onShowToast(`Félicitations ! ${count} entrées intégrées avec succès dans le module "${IMPORT_TEMPLATES[selectedCategory].title}".`);
    handleClearParsed();
  };

  // Téléversement d'une nouvelle capture d'écran / image de preuve
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewEvidenceFile(file);
      const url = URL.createObjectURL(file);
      setNewEvidencePreviewUrl(url);
      if (!newEvidenceTitle) {
        setNewEvidenceTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSaveEvidence = () => {
    if (!newEvidenceTitle) {
      onShowToast('Veuillez indiquer un titre pour cette capture ou pièce justificative.');
      return;
    }

    const defaultUrl = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800';
    const evidenceItem: EvidenceItem = {
      id: `EVID-${Date.now()}`,
      fileName: newEvidenceFile ? newEvidenceFile.name : `capture_${Date.now()}.png`,
      fileSize: newEvidenceFile ? `${(newEvidenceFile.size / 1024).toFixed(0)} Ko` : '850 Ko',
      fileUrl: newEvidencePreviewUrl || defaultUrl,
      uploadedAt: new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
      type: newEvidenceType,
      title: newEvidenceTitle,
      country: newEvidenceCountry,
      notes: newEvidenceNotes || 'Preuve enregistrée manuellement dans le dossier juridique.',
    };

    onAddEvidence(evidenceItem);
    onShowToast(`Capture de preuve "${newEvidenceTitle}" enregistrée avec succès.`);

    // Reset
    setNewEvidenceTitle('');
    setNewEvidenceNotes('');
    setNewEvidenceFile(null);
    setNewEvidencePreviewUrl(null);
  };

  // Soumission manuelle d'un rapport Google Forms rapide
  const handleQuickGoogleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gfAgent || !gfCity) {
      onShowToast('Veuillez renseigner le nom de l\'agent et la ville.');
      return;
    }

    const survey: FieldSurveyData = {
      id: `SURV-GF-${Date.now()}`,
      date: new Date().toLocaleDateString('fr-FR'),
      city: gfCity,
      neighborhood: gfZone || 'Centre-ville',
      sampleSize: Number(gfSampleSize) || 150,
      piracyPenetrationRate: 36.5,
      preferredPirateDevice: gfType,
      primaryMotivation: gfVendor ? `Revendeur: ${gfVendor}` : 'Revente clandestine',
      mobileMoneyUsed: gfPayment || 'Wave / Orange Money',
      auditor: gfAgent,
    };

    onImportFieldSurveys([survey]);

    // Également créer une menace de type terrain si un revendeur est identifié
    if (gfVendor) {
      const threatFromGf: Threat = {
        id: `INC-TERRAIN-${Date.now()}`,
        name: `Revendeur ${gfVendor} (${gfCity})`,
        target: 'Bouquet CHEIKH + Afrique',
        channel: 'Enquête Terrain',
        platform: 'Point de vente physique',
        category: 'iptv',
        country: gfCountry,
        countryCode: gfCountry === "Côte d'Ivoire" ? 'CI' : 'SN',
        detectionDate: "Aujourd'hui, " + new Date().toLocaleTimeString().slice(0, 5),
        detectionTimestamp: new Date().toISOString(),
        status: 'analyse',
        content: `Infraction constatée: ${gfType}. ${gfMaterial ? `Matériel: ${gfMaterial}` : ''}`,
        rightsHolder: 'CHEIKH + AFRIQUE',
        iconType: 'smart_display',
        severity: 'high',
        viewersCount: `${gfSampleSize} foyers raccordés`,
        technicalDetails: `Agent rapporteur: ${gfAgent}. Contact Wave/OM: ${gfPayment || 'Non spécifié'}`,
        evidenceCaptureUrl: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800',
        sha256: `gf_field_${Date.now()}`,
      };
      onImportThreats([threatFromGf]);
    }

    onShowToast(`Rapport d'enquête terrain pour ${gfCity} (${gfCountry}) enregistré et injecté avec succès !`);

    // Reset formulaire
    setGfZone('');
    setGfVendor('');
    setGfPayment('');
    setGfMaterial('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER SECTION */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0b1c30] text-white tracking-wide uppercase">
                Alimentation & Ingestion
              </span>
              <span className="flex items-center gap-1 text-[12px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Moteur Excel / Google Forms Actif
              </span>
            </div>
            <h1 className="text-[24px] font-bold text-[#0b1c30] tracking-tight flex items-center gap-2.5">
              <FileSpreadsheet className="w-7 h-7 text-[#0b1c30]" />
              Import de Données & Modèles Excel
            </h1>
            <p className="text-[13px] text-[#64748b] max-w-3xl">
              Alimentez l'ensemble de l'application via des fichiers Excel (.xlsx), CSV, des rapports de formulaires Google Forms d'enquêteurs terrain, ainsi que des captures d'écran et pièces justificatives.
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={downloadAllTemplatesMasterWorkbook}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#cbd5e1] text-[#0b1c30] text-[12px] font-bold shadow-2xs transition-all cursor-pointer"
              title="Télécharger un classeur Excel complet avec tous les modèles"
            >
              <Download className="w-4 h-4 text-[#0b1c30]" />
              Pack Tous les Modèles (.xlsx)
            </button>
            <button
              onClick={() => setActiveTab('captures')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0b1c30] hover:bg-[#1a365d] text-white text-[12px] font-bold shadow-sm transition-all cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              Ajouter une Capture / Preuve
            </button>
          </div>
        </div>

        {/* METRICS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#f1f5f9]">
          <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
            <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block">
              Menaces & Flux Actifs
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[20px] font-bold text-[#0b1c30] font-mono">{threats.length}</span>
              <span className="text-[11px] text-emerald-600 font-medium">Synchronisées</span>
            </div>
          </div>

          <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
            <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block">
              Applications & Stores
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[20px] font-bold text-[#0b1c30] font-mono">{applications.length}</span>
              <span className="text-[11px] text-[#64748b]">APKs recensées</span>
            </div>
          </div>

          <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
            <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block">
              Enquêtes & Rapports Terrain
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[20px] font-bold text-[#0b1c30] font-mono">{fieldSurveys.length}</span>
              <span className="text-[11px] text-[#0284c7] font-medium">Google Forms</span>
            </div>
          </div>

          <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
            <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block">
              Captures & Pièces Jointes
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[20px] font-bold text-[#0b1c30] font-mono">{evidenceList.length}</span>
              <span className="text-[11px] text-[#64748b]">Preuves visuelles</span>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION BAR */}
        <div className="flex items-center gap-1.5 mt-5 pt-3 border-t border-[#e2e8f0] overflow-x-auto">
          <button
            onClick={() => setActiveTab('import')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'import'
                ? 'bg-[#0b1c30] text-white shadow-xs'
                : 'text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0b1c30]'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            1. Importer Fichier (Excel / CSV)
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'templates'
                ? 'bg-[#0b1c30] text-white shadow-xs'
                : 'text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0b1c30]'
            }`}
          >
            <Download className="w-4 h-4" />
            2. Modèles Téléchargeables (.xlsx & .csv)
          </button>

          <button
            onClick={() => setActiveTab('google-forms')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'google-forms'
                ? 'bg-[#0b1c30] text-white shadow-xs'
                : 'text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0b1c30]'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            3. Rapports Google Forms & Terrain
          </button>

          <button
            onClick={() => setActiveTab('captures')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'captures'
                ? 'bg-[#0b1c30] text-white shadow-xs'
                : 'text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0b1c30]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            4. Captures d'Écran & Preuves ({evidenceList.length})
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#0b1c30] text-white shadow-xs'
                : 'text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0b1c30]'
            }`}
          >
            <Clock className="w-4 h-4" />
            5. Historique des Ingestions ({importHistory.length})
          </button>
        </div>
      </div>

      {/* TAB 1: IMPORT FICHIER EXCEL / CSV */}
      {activeTab === 'import' && (
        <div className="space-y-6">
          {/* Sélection du Type de Données Cible */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-xs">
            <label className="text-[12px] font-bold text-[#0b1c30] uppercase tracking-wider block mb-3">
              Étape 1 : Choisissez le type de données à importer dans l'application
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {(Object.keys(IMPORT_TEMPLATES) as DataImportCategory[]).map((cat) => {
                const tpl = IMPORT_TEMPLATES[cat];
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      if (parsedRows.length) handleClearParsed();
                    }}
                    className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#0b1c30] bg-[#0b1c30]/5 ring-2 ring-[#0b1c30]'
                        : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-[#f8fafc]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#e2e8f0] text-[#0b1c30]">
                          {tpl.badge}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0b1c30]" />}
                      </div>
                      <h4 className="text-[13px] font-bold text-[#0b1c30] leading-tight">{tpl.title}</h4>
                    </div>
                    <span className="text-[11px] text-[#64748b] mt-2 block">
                      {tpl.columns.length} colonnes standard
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Zone de Drag and Drop et Téléversement */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <label className="text-[12px] font-bold text-[#0b1c30] uppercase tracking-wider">
                Étape 2 : Déposez votre classeur Excel ou fichier CSV
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadExcelTemplate(selectedCategory)}
                  className="text-[11px] font-bold text-[#0b1c30] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Télécharger le modèle vierge ({IMPORT_TEMPLATES[selectedCategory].badge})
                </button>
              </div>
            </div>

            {/* Drag & drop box */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#cbd5e1] hover:border-[#0b1c30] bg-[#f8fafc] hover:bg-white rounded-2xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[220px]"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv, .tsv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="w-14 h-14 rounded-2xl bg-[#0b1c30]/10 flex items-center justify-center text-[#0b1c30] mb-3">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h3 className="text-[15px] font-bold text-[#0b1c30]">
                Glissez votre fichier ici ou cliquez pour parcourir vos dossiers
              </h3>
              <p className="text-[12px] text-[#64748b] mt-1 max-w-md">
                Formats acceptés : <span className="font-semibold text-[#0b1c30]">.xlsx (Excel), .xls, .csv</span>. Le système détectera automatiquement la structure des colonnes.
              </p>

              <div className="flex items-center gap-3 mt-4">
                <span className="text-[11px] text-[#64748b]">Pas de fichier sous la main ?</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadSampleData();
                  }}
                  className="px-3 py-1 rounded-lg bg-white border border-[#cbd5e1] hover:border-[#0b1c30] text-[#0b1c30] text-[11px] font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Charger un jeu d'essai CHEIKH + Afrique
                </button>
              </div>
            </div>
          </div>

          {/* TABLEAU DE PRÉVISUALISATION ET VALIDATION */}
          {parsedRows.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 sm:p-6 shadow-xs space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f1f5f9]">
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-[16px] font-bold text-[#0b1c30]">
                      Aperçu avant intégration : {parsedFileName}
                    </h3>
                  </div>
                  <p className="text-[12px] text-[#64748b] mt-0.5">
                    {parsedRows.length} lignes prêtes pour la catégorie : <strong className="text-[#0b1c30]">{IMPORT_TEMPLATES[selectedCategory].title}</strong> ({parsedFileSize})
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleClearParsed}
                    className="px-3 py-1.5 rounded-xl border border-[#cbd5e1] text-[#64748b] hover:text-[#dc2626] hover:bg-rose-50 text-[12px] font-medium transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Annuler
                  </button>
                  <button
                    onClick={handleCommitImport}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold shadow-sm transition-all cursor-pointer flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Valider et intégrer {parsedRows.length} lignes dans l'app
                  </button>
                </div>
              </div>

              {/* Tableau de prévisualisation avec scroll horizontal */}
              <div className="overflow-x-auto rounded-xl border border-[#e2e8f0] max-h-[380px]">
                <table className="w-full text-left text-[12px] border-collapse">
                  <thead className="bg-[#f8fafc] sticky top-0 border-b border-[#e2e8f0] z-10">
                    <tr>
                      <th className="py-2.5 px-3 font-bold text-[#64748b] uppercase text-[10px] w-12 text-center">#</th>
                      {parsedHeaders.slice(0, 8).map((header, idx) => (
                        <th key={idx} className="py-2.5 px-3 font-bold text-[#0b1c30] uppercase text-[10px] tracking-wider whitespace-nowrap">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9]">
                    {parsedRows.slice(0, 15).map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-[#f8fafc]/80 transition-colors">
                        <td className="py-2 px-3 font-mono text-[11px] text-[#64748b] text-center">{rowIdx + 1}</td>
                        {parsedHeaders.slice(0, 8).map((h, colIdx) => (
                          <td key={colIdx} className="py-2 px-3 text-[#0b1c30] max-w-[220px] truncate" title={String(row[h] || '')}>
                            {String(row[h] || '—')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedRows.length > 15 && (
                <p className="text-[11px] text-[#64748b] text-right italic">
                  Affichage des 15 premières lignes sur {parsedRows.length} lignes détectées.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MODÈLES D'IMPORT TÉLÉCHARGEABLES */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f1f5f9]">
              <div>
                <h2 className="text-[18px] font-bold text-[#0b1c30] flex items-center gap-2">
                  <Download className="w-5 h-5 text-[#0b1c30]" />
                  Modèles d'Import Excel & CSV Spécifiques
                </h2>
                <p className="text-[13px] text-[#64748b] mt-0.5">
                  Téléchargez les modèles pré-formatés avec en-têtes officiels, exemples réels CHEIKH + Afrique et guide de saisie intégré.
                </p>
              </div>

              <button
                onClick={downloadAllTemplatesMasterWorkbook}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0b1c30] hover:bg-[#1a365d] text-white text-[12px] font-bold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
              >
                <Download className="w-4 h-4" />
                Télécharger le Pack Complet (Classeur 5 Onglets)
              </button>
            </div>

            {/* GRID DES 5 MODÈLES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              {(Object.keys(IMPORT_TEMPLATES) as DataImportCategory[]).map((cat) => {
                const tpl = IMPORT_TEMPLATES[cat];
                return (
                  <div
                    key={cat}
                    className="p-5 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] hover:bg-white hover:border-[#cbd5e1] transition-all flex flex-col justify-between shadow-2xs space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0b1c30] text-white">
                          {tpl.badge}
                        </span>
                        <span className="text-[11px] font-mono text-[#64748b]">
                          {tpl.columns.length} colonnes
                        </span>
                      </div>
                      <h3 className="text-[15px] font-bold text-[#0b1c30]">{tpl.title}</h3>
                      <p className="text-[12px] text-[#64748b] mt-1 line-clamp-2">{tpl.subtitle}</p>

                      {/* Exemples de colonnes clés */}
                      <div className="mt-3 pt-3 border-t border-[#e2e8f0]/60">
                        <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block mb-1.5">
                          Colonnes clés incluses :
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {tpl.columns.slice(0, 5).map((col) => (
                            <span
                              key={col.key}
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-white border border-[#e2e8f0] text-[#0b1c30]"
                            >
                              {col.label}
                            </span>
                          ))}
                          {tpl.columns.length > 5 && (
                            <span className="px-1.5 py-0.5 text-[10px] text-[#64748b]">
                              +{tpl.columns.length - 5} autres...
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions de téléchargement */}
                    <div className="flex items-center gap-2 pt-3 border-t border-[#e2e8f0]">
                      <button
                        onClick={() => downloadExcelTemplate(cat)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold shadow-2xs transition-all cursor-pointer"
                        title="Télécharger classeur Excel avec feuille de guide"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        Excel (.xlsx)
                      </button>
                      <button
                        onClick={() => downloadCsvTemplate(cat)}
                        className="px-3 py-2 rounded-xl bg-white hover:bg-[#f1f5f9] border border-[#cbd5e1] text-[#0b1c30] text-[12px] font-bold transition-all cursor-pointer"
                        title="Télécharger fichier CSV UTF-8"
                      >
                        CSV (.csv)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RAPPORTS GOOGLE FORMS & TERRAIN */}
      {activeTab === 'google-forms' && (
        <div className="space-y-6">
          {/* Guide Google Forms */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-3 pb-3 border-b border-[#f1f5f9]">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-[17px] font-bold text-[#0b1c30]">
                  Intégration directe des Rapports Google Forms (Enquêtes Terrain)
                </h2>
                <p className="text-[12px] text-[#64748b]">
                  Comment relier les formulaires mobiles remplis par vos auditeurs et inspecteurs en Afrique (Dakar, Abidjan, Douala, Yaoundé, Bamako, etc.).
                </p>
              </div>
            </div>

            {/* 3 Steps visual workflow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              <div className="p-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc]">
                <div className="w-7 h-7 rounded-full bg-[#0b1c30] text-white flex items-center justify-center text-[12px] font-bold mb-2">
                  1
                </div>
                <h4 className="text-[13px] font-bold text-[#0b1c30]">Saisie Terrain sur Google Forms</h4>
                <p className="text-[11px] text-[#64748b] mt-1">
                  Les agents CHEIKH + remplissent le formulaire standard lors de leurs rondes : nom du revendeur, quartier, compte Wave / Orange Money, nombre de boîtiers saisis.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc]">
                <div className="w-7 h-7 rounded-full bg-[#0b1c30] text-white flex items-center justify-center text-[12px] font-bold mb-2">
                  2
                </div>
                <h4 className="text-[13px] font-bold text-[#0b1c30]">Export Google Sheets en 1 Clic</h4>
                <p className="text-[11px] text-[#64748b] mt-1">
                  Dans le Google Sheet lié aux réponses : cliquez sur <strong className="text-[#0b1c30]">Fichier &gt; Télécharger &gt; Microsoft Excel (.xlsx)</strong> ou <strong className="text-[#0b1c30]">CSV</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc]">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[12px] font-bold mb-2">
                  3
                </div>
                <h4 className="text-[13px] font-bold text-[#0b1c30]">Dépôt automatique dans l'App</h4>
                <p className="text-[11px] text-[#64748b] mt-1">
                  Glissez le fichier exporté dans l'onglet <strong className="text-[#0b1c30]">Importer Fichier</strong>. Les données alimentent immédiatement les fiches filiales et le simulateur de rebond commercial !
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[#f1f5f9]">
              <button
                onClick={() => downloadExcelTemplate('google_forms')}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                Télécharger le Modèle Google Forms Recommandé (.xlsx)
              </button>
            </div>
          </div>

          {/* Formulaire de signalement direct Google Forms / Terrain */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9] mb-4">
              <div>
                <h3 className="text-[16px] font-bold text-[#0b1c30] flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#0b1c30]" />
                  Simulateur / Saisie Rapide de Rapport de Terrain
                </h3>
                <p className="text-[12px] text-[#64748b]">
                  Permet de consigner directement un constat d'enquêteur sans attendre l'export d'un fichier.
                </p>
              </div>
            </div>

            <form onSubmit={handleQuickGoogleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block mb-1">
                    Agent / Enquêteur CHEIKH + *
                  </label>
                  <input
                    type="text"
                    required
                    value={gfAgent}
                    onChange={(e) => setGfAgent(e.target.value)}
                    placeholder="ex: Ibrahima Sow (Inspecteur SN)"
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3 py-2 text-[12px] text-[#0b1c30] outline-hidden focus:border-[#0b1c30]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block mb-1">
                    Filiale / Pays *
                  </label>
                  <select
                    value={gfCountry}
                    onChange={(e) => setGfCountry(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3 py-2 text-[12px] text-[#0b1c30] outline-hidden focus:border-[#0b1c30] cursor-pointer"
                  >
                    <option value="Sénégal">Sénégal</option>
                    <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                    <option value="Cameroun">Cameroun</option>
                    <option value="Mali">Mali</option>
                    <option value="Gabon">Gabon</option>
                    <option value="RDC">RDC</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block mb-1">
                    Ville *
                  </label>
                  <input
                    type="text"
                    required
                    value={gfCity}
                    onChange={(e) => setGfCity(e.target.value)}
                    placeholder="ex: Dakar, Abidjan, Douala..."
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3 py-2 text-[12px] text-[#0b1c30] outline-hidden focus:border-[#0b1c30]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block mb-1">
                    Quartier / Zone
                  </label>
                  <input
                    type="text"
                    value={gfZone}
                    onChange={(e) => setGfZone(e.target.value)}
                    placeholder="ex: Médina, Yopougon, Akwa..."
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3 py-2 text-[12px] text-[#0b1c30] outline-hidden focus:border-[#0b1c30]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block mb-1">
                    Nom Revendeur / Établissement
                  </label>
                  <input
                    type="text"
                    value={gfVendor}
                    onChange={(e) => setGfVendor(e.target.value)}
                    placeholder="ex: Boutique Électro Médina"
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3 py-2 text-[12px] text-[#0b1c30] outline-hidden focus:border-[#0b1c30]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block mb-1">
                    Numéro Wave / Orange Money
                  </label>
                  <input
                    type="text"
                    value={gfPayment}
                    onChange={(e) => setGfPayment(e.target.value)}
                    placeholder="ex: +221 77 123 45 67 (Wave)"
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3 py-2 text-[12px] text-[#0b1c30] outline-hidden focus:border-[#0b1c30]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block mb-1">
                    Type d'infraction constatée
                  </label>
                  <select
                    value={gfType}
                    onChange={(e) => setGfType(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3 py-2 text-[12px] text-[#0b1c30] outline-hidden focus:border-[#0b1c30] cursor-pointer"
                  >
                    <option value="Revente de boîtiers IPTV préconfigurés">Revente de boîtiers IPTV préconfigurés</option>
                    <option value="Partage de flux en réseau câblé clandestin">Partage de flux en réseau câblé clandestin</option>
                    <option value="Revente de codes et abonnements M3U via Mobile Money">Revente de codes M3U via Mobile Money</option>
                    <option value="Écran public ou maquis non autorisé">Écran public ou maquis non autorisé</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block mb-1">
                    Foyers raccordés estimés
                  </label>
                  <input
                    type="number"
                    value={gfSampleSize}
                    onChange={(e) => setGfSampleSize(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3 py-2 text-[12px] text-[#0b1c30] outline-hidden focus:border-[#0b1c30]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block mb-1">
                    Matériel saisi / photographié
                  </label>
                  <input
                    type="text"
                    value={gfMaterial}
                    onChange={(e) => setGfMaterial(e.target.value)}
                    placeholder="ex: 12 boîtiers TV, 2 paraboles..."
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3 py-2 text-[12px] text-[#0b1c30] outline-hidden focus:border-[#0b1c30]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#0b1c30] hover:bg-[#1a365d] text-white text-[12px] font-bold shadow-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Enregistrer le Rapport dans la Plateforme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: CAPTURES D'ÉCRAN & PREUVES VISUELLES */}
      {activeTab === 'captures' && (
        <div className="space-y-6">
          {/* Formulaire d'upload de capture */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9] mb-4">
              <div>
                <h3 className="text-[16px] font-bold text-[#0b1c30] flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#0b1c30]" />
                  Ajouter une Capture d'Écran ou Preuve Visuelle
                </h3>
                <p className="text-[12px] text-[#64748b]">
                  Téléversez des captures de direct illégal, photos de saisies sur le terrain, reçus Wave/OM ou constats d'huissier.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Zone de glisser-déposer de l'image */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block">
                  Fichier image (JPG, PNG, WebP) *
                </label>
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="border-2 border-dashed border-[#cbd5e1] hover:border-[#0b1c30] bg-[#f8fafc] rounded-2xl p-4 text-center cursor-pointer min-h-[170px] flex flex-col items-center justify-center overflow-hidden transition-all"
                >
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageFileChange}
                  />
                  {newEvidencePreviewUrl ? (
                    <div className="relative w-full h-[150px] rounded-xl overflow-hidden">
                      <img
                        src={newEvidencePreviewUrl}
                        alt="Aperçu"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white text-[11px] font-bold bg-black/60 px-2 py-1 rounded">Changer l'image</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-[#64748b] mb-2" />
                      <span className="text-[12px] font-bold text-[#0b1c30]">Cliquez pour sélectionner l'image</span>
                      <span className="text-[11px] text-[#64748b] mt-0.5">ou glissez-déposez ici</span>
                    </>
                  )}
                </div>
              </div>

              {/* Champs de métadonnées */}
              <div className="lg:col-span-2 space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block mb-1">
                      Titre de la preuve *
                    </label>
                    <input
                      type="text"
                      value={newEvidenceTitle}
                      onChange={(e) => setNewEvidenceTitle(e.target.value)}
                      placeholder="ex: Capture du direct TikTok Live CHEIKH + Sport 1"
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3 py-2 text-[12px] text-[#0b1c30] outline-hidden focus:border-[#0b1c30]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block mb-1">
                      Catégorie de la preuve *
                    </label>
                    <select
                      value={newEvidenceType}
                      onChange={(e) => setNewEvidenceType(e.target.value as any)}
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3 py-2 text-[12px] text-[#0b1c30] outline-hidden focus:border-[#0b1c30] cursor-pointer"
                    >
                      <option value="stream_capture">Capture de Stream / Direct Piraté</option>
                      <option value="payment_receipt">Reçu Mobile Money (Wave / Orange Money)</option>
                      <option value="field_photo">Photo Saisie Terrain / Boîtiers IPTV</option>
                      <option value="legal_bailiff">Constat d'Huissier / PV Légal</option>
                      <option value="app_screenshot">Capture Application Mobile / APK</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block mb-1">
                      Filiale / Pays associé
                    </label>
                    <select
                      value={newEvidenceCountry}
                      onChange={(e) => setNewEvidenceCountry(e.target.value)}
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3 py-2 text-[12px] text-[#0b1c30] outline-hidden focus:border-[#0b1c30] cursor-pointer"
                    >
                      <option value="Sénégal">Sénégal</option>
                      <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                      <option value="Cameroun">Cameroun</option>
                      <option value="Mali">Mali</option>
                      <option value="Gabon">Gabon</option>
                      <option value="Panafrique">Panafrique</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block mb-1">
                      Notes juridiques & Horodatage
                    </label>
                    <input
                      type="text"
                      value={newEvidenceNotes}
                      onChange={(e) => setNewEvidenceNotes(e.target.value)}
                      placeholder="ex: Relevé d'adresse IP et logo pirate visible..."
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3 py-2 text-[12px] text-[#0b1c30] outline-hidden focus:border-[#0b1c30]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleSaveEvidence}
                    className="px-4 py-2.5 rounded-xl bg-[#0b1c30] hover:bg-[#1a365d] text-white text-[12px] font-bold shadow-sm transition-all cursor-pointer flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Enregistrer la Capture dans le Répertoire de Preuves
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Galerie des preuves existantes */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9] mb-4">
              <div>
                <h3 className="text-[16px] font-bold text-[#0b1c30]">
                  Répertoire des Preuves & Captures d'Écran ({evidenceList.length})
                </h3>
                <p className="text-[12px] text-[#64748b]">
                  Dossier probatoire pour constats d'huissier, plaintes pénales et notifications DMCA.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {evidenceList.map((item) => {
                const badgeLabel =
                  item.type === 'stream_capture'
                    ? 'Capture Stream'
                    : item.type === 'payment_receipt'
                    ? 'Reçu Mobile Money'
                    : item.type === 'field_photo'
                    ? 'Descente Terrain'
                    : item.type === 'legal_bailiff'
                    ? 'Constat d\'Huissier'
                    : 'Capture APK';

                return (
                  <div
                    key={item.id}
                    className="group rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] hover:bg-white overflow-hidden shadow-2xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative h-44 w-full bg-black/5 overflow-hidden">
                        <img
                          src={item.fileUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#0b1c30]/90 text-white backdrop-blur-xs">
                            {badgeLabel}
                          </span>
                          {item.country && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 text-[#0b1c30] border border-[#e2e8f0]">
                              {item.country}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => setPreviewModalEvidence(item)}
                          className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-[#0b1c30] transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                          title="Agrandir la capture"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Aperçu
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-1.5">
                        <h4 className="text-[13px] font-bold text-[#0b1c30] line-clamp-2 leading-snug">
                          {item.title}
                        </h4>
                        {item.relatedEntityName && (
                          <span className="text-[11px] font-medium text-[#0b1c30] block">
                            Lié à : {item.relatedEntityName}
                          </span>
                        )}
                        {item.notes && (
                          <p className="text-[11px] text-[#64748b] line-clamp-2">{item.notes}</p>
                        )}
                      </div>
                    </div>

                    <div className="px-4 py-2.5 bg-white border-t border-[#e2e8f0] flex items-center justify-between text-[11px] text-[#64748b]">
                      <span className="font-mono">{item.fileSize}</span>
                      <span>{item.uploadedAt}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: HISTORIQUE DES IMPORTS */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9] mb-4">
            <div>
              <h3 className="text-[16px] font-bold text-[#0b1c30] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0b1c30]" />
                Journal d'Ingestion & Historique des Imports
              </h3>
              <p className="text-[12px] text-[#64748b]">
                Traçabilité des classeurs Excel, exports Google Forms et jeux de données injectés dans le système.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#e2e8f0]">
            <table className="w-full text-left text-[12px] border-collapse">
              <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                <tr>
                  <th className="py-2.5 px-4 font-bold text-[#64748b] uppercase text-[10px]">ID</th>
                  <th className="py-2.5 px-4 font-bold text-[#64748b] uppercase text-[10px]">Nom du Fichier</th>
                  <th className="py-2.5 px-4 font-bold text-[#64748b] uppercase text-[10px]">Catégorie Cible</th>
                  <th className="py-2.5 px-4 font-bold text-[#64748b] uppercase text-[10px]">Lignes Importées</th>
                  <th className="py-2.5 px-4 font-bold text-[#64748b] uppercase text-[10px]">Date & Heure</th>
                  <th className="py-2.5 px-4 font-bold text-[#64748b] uppercase text-[10px]">Statut</th>
                  <th className="py-2.5 px-4 font-bold text-[#64748b] uppercase text-[10px]">Détails</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {importHistory.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#f8fafc]/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-[#64748b]">{rec.id}</td>
                    <td className="py-3 px-4 font-medium text-[#0b1c30] flex items-center gap-2">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate max-w-[220px]">{rec.fileName}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f1f5f9] text-[#0b1c30] border border-[#cbd5e1]">
                        {IMPORT_TEMPLATES[rec.category]?.badge || rec.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#0b1c30]">
                      {rec.rowsCount} lignes
                    </td>
                    <td className="py-3 px-4 text-[#64748b]">{rec.importedAt}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Succès
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#64748b] max-w-[280px] truncate" title={rec.details}>
                      {rec.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL PRÉVISUALISATION PLEIN ÉCRAN D'UNE CAPTURE */}
      {previewModalEvidence && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#cbd5e1]">
            <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
                  Dossier de Preuve Numérique
                </span>
                <h3 className="text-[15px] font-bold text-[#0b1c30]">{previewModalEvidence.title}</h3>
              </div>
              <button
                onClick={() => setPreviewModalEvidence(null)}
                className="p-1.5 rounded-lg text-[#64748b] hover:text-[#0b1c30] hover:bg-[#e2e8f0] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-black/5 flex items-center justify-center max-h-[500px] overflow-hidden">
              <img
                src={previewModalEvidence.fileUrl}
                alt={previewModalEvidence.title}
                className="max-h-[460px] max-w-full rounded-lg object-contain shadow-md"
              />
            </div>

            <div className="p-4 bg-white border-t border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12px]">
              <div>
                <span className="text-[#64748b] block">Nom du fichier : <strong className="text-[#0b1c30]">{previewModalEvidence.fileName}</strong> ({previewModalEvidence.fileSize})</span>
                <span className="text-[#64748b] block">Filiale / Territoire : <strong className="text-[#0b1c30]">{previewModalEvidence.country || 'Panafrique'}</strong> • {previewModalEvidence.uploadedAt}</span>
              </div>
              <button
                onClick={() => {
                  window.open(previewModalEvidence.fileUrl, '_blank');
                }}
                className="px-3.5 py-2 rounded-xl bg-[#0b1c30] hover:bg-[#1a365d] text-white font-bold text-[11px] shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Ouvrir en Haute Définition
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
