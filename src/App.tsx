import React, { useState, Suspense, lazy } from 'react';
import { Sidebar, NavPage, ExpertTabType } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewPage } from './pages/OverviewPage';
import { ConstatModal } from './components/ConstatModal';
import {
  mockThreats,
  mockApplications,
  mockAccounts,
  mockSitesForums,
} from './data/mockData';
import { mockFieldSurveys } from './data/marketData';
import { mockEvidenceItems } from './data/mockEvidence';
import {
  Threat,
  ThreatStatus,
  AppItem,
  AccountItem,
  SiteForumItem,
  EvidenceItem,
} from './types';
import { FieldSurveyData } from './data/marketData';
import { CheckCircle2, Loader2, ShieldAlert, Lock, ArrowLeft } from 'lucide-react';
import { UserRole, getUserAccount, isPageAllowedForRole } from './utils/userAccounts';
import { LoginPage } from './pages/LoginPage';

// Lazy loading des pages secondaires pour un démarrage ultra-rapide (Code Splitting)
const ThreatsPage = lazy(() => import('./pages/ThreatsPage').then((m) => ({ default: m.ThreatsPage })));
const ThreatDetailPage = lazy(() => import('./pages/ThreatDetailPage').then((m) => ({ default: m.ThreatDetailPage })));
const TerritoryDetailPage = lazy(() => import('./pages/TerritoryDetailPage').then((m) => ({ default: m.TerritoryDetailPage })));
const ApplicationsPage = lazy(() => import('./pages/ApplicationsPage').then((m) => ({ default: m.ApplicationsPage })));
const SocialAccountsPage = lazy(() => import('./pages/SocialAccountsPage').then((m) => ({ default: m.SocialAccountsPage })));
const SitesForumsPage = lazy(() => import('./pages/SitesForumsPage').then((m) => ({ default: m.SitesForumsPage })));
const MarketAnalysisPage = lazy(() => import('./pages/MarketAnalysisPage').then((m) => ({ default: m.MarketAnalysisPage })));
const ExpertModePage = lazy(() => import('./pages/ExpertModePage').then((m) => ({ default: m.ExpertModePage })));
const DataImportPage = lazy(() => import('./pages/DataImportPage').then((m) => ({ default: m.DataImportPage })));

// Composant de chargement fluide et léger
const PageLoader: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[420px] w-full gap-3 text-[#64748b]">
    <Loader2 className="w-7 h-7 text-[#0b1c30] animate-spin" />
    <span className="text-[12px] font-medium tracking-wide">Chargement du module...</span>
  </div>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>('overview');
  const [currentExpertTab, setCurrentExpertTab] = useState<ExpertTabType>('sources');
  const [selectedThreatId, setSelectedThreatId] = useState<string>('INC-202502-8841-TK');
  const [selectedTerritoryName, setSelectedTerritoryName] = useState<string>('Sénégal');
  const [threats, setThreats] = useState<Threat[]>(mockThreats);
  const [applications, setApplications] = useState<AppItem[]>(mockApplications);
  const [accounts, setAccounts] = useState<AccountItem[]>(mockAccounts);
  const [sitesForums, setSitesForums] = useState<SiteForumItem[]>(mockSitesForums);
  const [fieldSurveys, setFieldSurveys] = useState<FieldSurveyData[]>(mockFieldSurveys);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>(mockEvidenceItems);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [constatThreat, setConstatThreat] = useState<Threat | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('antipiracy_auth_logged_in') === 'true';
    } catch {
      return false;
    }
  });
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('antipiracy_auth_role');
      if (saved) {
        if (saved === 'super_admin' || saved === 'admin' || saved === 'dir_analyse_marche') return 'admin';
        if (saved === 'dir_generale' || saved === 'direction' || saved === 'dir_technique' || saved === 'dir_sports' || saved === 'dir_commerciale') return 'direction';
        if (saved === 'dir_juridique' || saved === 'juridique') return 'juridique';
        return saved as UserRole;
      }
    } catch {
      // ignore
    }
    return 'admin';
  });

  const handleLogin = (role: UserRole) => {
    setCurrentRole(role);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('antipiracy_auth_logged_in', 'true');
      localStorage.setItem('antipiracy_auth_role', role);
    } catch {
      // ignore
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('antipiracy_auth_logged_in');
    } catch {
      // ignore
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    try {
      localStorage.setItem('antipiracy_auth_role', role);
    } catch {
      // ignore
    }
    if (!isPageAllowedForRole(role, currentPage)) {
      setCurrentPage('overview');
      showToast(`Périmètre ${getUserAccount(role).title} : redirection vers votre vue d'ensemble.`);
    } else {
      showToast(`Profil actif : ${getUserAccount(role).title}`);
    }
  };

  const handleImportThreats = (newThreats: Threat[]) => {
    const account = getUserAccount(currentRole);
    if (!account.canImport) {
      showToast("Importation bloquée : seuls les administrateurs référents peuvent importer des données.");
      return;
    }
    setThreats((prev) => [...newThreats, ...prev]);
  };

  const handleImportApplications = (newApps: AppItem[]) => {
    const account = getUserAccount(currentRole);
    if (!account.canImport) {
      showToast("Importation bloquée : seuls les administrateurs référents peuvent importer des données.");
      return;
    }
    setApplications((prev) => [...newApps, ...prev]);
  };

  const handleImportAccounts = (newAccounts: AccountItem[]) => {
    const account = getUserAccount(currentRole);
    if (!account.canImport) {
      showToast("Importation bloquée : seuls les administrateurs référents peuvent importer des données.");
      return;
    }
    setAccounts((prev) => [...newAccounts, ...prev]);
  };

  const handleImportSitesForums = (newSites: SiteForumItem[]) => {
    const account = getUserAccount(currentRole);
    if (!account.canImport) {
      showToast("Importation bloquée : seuls les administrateurs référents peuvent importer des données.");
      return;
    }
    setSitesForums(newSites);
  };

  const handleUpdateSiteForum = (updated: SiteForumItem) => {
    const account = getUserAccount(currentRole);
    if (!account.canEdit) {
      showToast("Modification bloquée : votre direction dispose d'un accès en consultation seule.");
      return;
    }
    setSitesForums((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleImportFieldSurveys = (newSurveys: FieldSurveyData[]) => {
    const account = getUserAccount(currentRole);
    if (!account.canImport) {
      showToast("Importation bloquée : seuls les administrateurs référents peuvent importer des données.");
      return;
    }
    setFieldSurveys((prev) => [...newSurveys, ...prev]);
  };

  const handleAddEvidence = (newEvidence: EvidenceItem) => {
    const account = getUserAccount(currentRole);
    if (!account.canEdit) {
      showToast("Action bloquée : votre direction dispose d'un accès en consultation seule.");
      return;
    }
    setEvidenceList((prev) => [newEvidence, ...prev]);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3800);
  };

  const handleNavigate = (page: NavPage, threatId?: string, expertTab?: ExpertTabType) => {
    if (!isPageAllowedForRole(currentRole, page)) {
      showToast(`Accès restreint : cette rubrique n'est pas comprise dans le périmètre de votre direction.`);
      return;
    }
    if (threatId) {
      setSelectedThreatId(threatId);
    }
    if (expertTab) {
      setCurrentExpertTab(expertTab);
    }
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectThreat = (threatId: string) => {
    if (!isPageAllowedForRole(currentRole, 'threat-detail') && !isPageAllowedForRole(currentRole, 'threats')) {
      showToast(`Accès restreint : consultation des fiches menaces non comprise dans votre périmètre.`);
      return;
    }
    setSelectedThreatId(threatId);
    setCurrentPage('threat-detail');
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTerritory = (countryName: string) => {
    if (!isPageAllowedForRole(currentRole, 'territory-detail') && !isPageAllowedForRole(currentRole, 'market')) {
      showToast(`Accès restreint : fiches territoriales non comprises dans votre périmètre.`);
      return;
    }
    setSelectedTerritoryName(countryName);
    setCurrentPage('territory-detail');
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateStatus = (threatId: string, newStatus: ThreatStatus) => {
    const account = getUserAccount(currentRole);
    if (!account.canEdit) {
      showToast("Action bloquée : votre direction dispose d'un accès en consultation seule.");
      return;
    }
    setThreats((prev) =>
      prev.map((t) => {
        if (t.id === threatId) {
          const newLog = {
            id: `log-${Date.now()}`,
            time: new Date().toTimeString().split(' ')[0].substring(0, 5),
            actor: account.holderName,
            description: `Statut modifié manuellement en : ${newStatus.toUpperCase()}`,
            type: 'analyst' as const,
          };
          return {
            ...t,
            status: newStatus,
            actionLogs: [newLog, ...(t.actionLogs || [])],
          };
        }
        return t;
      })
    );
  };

  const selectedThreat =
    threats.find((t) => t.id === selectedThreatId) || threats[0];

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-[#0b1c30] flex flex-col font-sans selection:bg-[#fee2e2] selection:text-[#dc2626]">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        currentExpertTab={currentExpertTab}
        onNavigate={handleNavigate}
        threatsCount={threats.length}
        isOpenOnMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        currentRole={currentRole}
      />

      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim() && currentPage !== 'threats' && isPageAllowedForRole(currentRole, 'threats')) {
            setCurrentPage('threats');
          }
        }}
        onSearchSubmit={() => {
          if (currentPage !== 'threats' && isPageAllowedForRole(currentRole, 'threats')) {
            setCurrentPage('threats');
          }
        }}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onNavigateToImport={() => handleNavigate('data-import')}
        currentRole={currentRole}
        onSelectRole={handleRoleChange}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="lg:pl-64 pl-0 pt-[60px] min-h-screen flex flex-col flex-1 transition-all">
        <div className="max-w-7xl w-full mx-auto px-3 sm:px-5 md:px-6 py-4 sm:py-6 flex-1">
          {/* Vérification du périmètre de sécurité pour le rôle actif */}
          {!isPageAllowedForRole(currentRole, currentPage) ? (
            <div className="p-8 rounded-2xl bg-white border border-amber-200 shadow-sm flex flex-col items-center text-center max-w-xl mx-auto my-12">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-200">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h2 className="text-[18px] font-bold text-[#0b1c30]">Accès Restreint</h2>
              <p className="text-[13px] text-[#64748b] mt-2 mb-6">
                Cette rubrique n'est pas comprise dans le périmètre habilité pour la direction <strong>{getUserAccount(currentRole).title}</strong> ({getUserAccount(currentRole).accessiblePerimeterSummary}).
              </p>
              <button
                onClick={() => handleNavigate('overview')}
                className="px-4 py-2 rounded-xl bg-[#0b1c30] text-white text-[13px] font-bold flex items-center gap-2 hover:bg-[#1e3a8a] transition-all cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retourner à la Vue d'ensemble</span>
              </button>
            </div>
          ) : (
            <>
              {/* 1. Vue d'ensemble (Chargement instantané synchrone) */}
              {currentPage === 'overview' && (
                <OverviewPage
                  threats={threats}
                  sitesForums={sitesForums}
                  onSelectThreat={handleSelectThreat}
                  onNavigateToThreats={() => handleNavigate('threats')}
                  onNavigateToMarket={
                    isPageAllowedForRole(currentRole, 'market')
                      ? () => handleNavigate('market')
                      : undefined
                  }
                  onNavigateToImport={
                    getUserAccount(currentRole).canImport
                      ? () => handleNavigate('data-import')
                      : undefined
                  }
                  onShowToast={showToast}
                />
              )}

              {/* 2. Menaces */}
              {currentPage === 'threats' && (
                <Suspense fallback={<PageLoader />}>
                  <ThreatsPage
                    threats={threats}
                    onSelectThreat={handleSelectThreat}
                    onSelectTerritory={handleSelectTerritory}
                    onUpdateStatus={handleUpdateStatus}
                    onOpenPdfExport={(threat) => setConstatThreat(threat)}
                    onShowToast={showToast}
                    externalSearch={searchQuery}
                    currentRole={currentRole}
                  />
                </Suspense>
              )}

              {/* 3. Détail d'une menace */}
              {currentPage === 'threat-detail' && (
                <Suspense fallback={<PageLoader />}>
                  <ThreatDetailPage
                    threat={selectedThreat}
                    onUpdateStatus={handleUpdateStatus}
                    onNavigateBack={() => handleNavigate('threats')}
                    onShowToast={showToast}
                    onOpenPdfExport={(threat) => setConstatThreat(threat)}
                    currentRole={currentRole}
                  />
                </Suspense>
              )}

              {/* 3b. Fiche Détaillée d'une Filiale */}
              {currentPage === 'territory-detail' && (
                <Suspense fallback={<PageLoader />}>
                  <TerritoryDetailPage
                    countryName={selectedTerritoryName}
                    threats={threats}
                    onNavigateBack={() => handleNavigate('threats')}
                    onSelectThreat={handleSelectThreat}
                    onUpdateStatus={handleUpdateStatus}
                    onOpenPdfExport={(threat) => setConstatThreat(threat)}
                    onShowToast={showToast}
                  />
                </Suspense>
              )}

              {/* 4. Applications */}
              {currentPage === 'applications' && (
                <Suspense fallback={<PageLoader />}>
                  <ApplicationsPage
                    applications={applications}
                    onShowToast={showToast}
                  />
                </Suspense>
              )}

              {/* 5. Comptes & Réseaux */}
              {currentPage === 'accounts' && (
                <Suspense fallback={<PageLoader />}>
                  <SocialAccountsPage
                    accounts={accounts}
                    onShowToast={showToast}
                  />
                </Suspense>
              )}

              {/* 6. Sites & Forums */}
              {currentPage === 'sites-forums' && (
                <Suspense fallback={<PageLoader />}>
                  <SitesForumsPage
                    sitesForums={sitesForums}
                    onShowToast={showToast}
                    onUpdateSiteForum={handleUpdateSiteForum}
                    currentRole={currentRole}
                  />
                </Suspense>
              )}

              {/* 7. Intelligence Marché & Filiales */}
              {currentPage === 'market' && (
                <Suspense fallback={<PageLoader />}>
                  <MarketAnalysisPage
                    onShowToast={showToast}
                    onSelectTerritory={handleSelectTerritory}
                  />
                </Suspense>
              )}

              {/* 8. Import de Données & Modèles Excel */}
              {currentPage === 'data-import' && (
                <Suspense fallback={<PageLoader />}>
                  <DataImportPage
                    threats={threats}
                    applications={applications}
                    accounts={accounts}
                    sitesForums={sitesForums}
                    fieldSurveys={fieldSurveys}
                    evidenceList={evidenceList}
                    onImportThreats={handleImportThreats}
                    onImportApplications={handleImportApplications}
                    onImportAccounts={handleImportAccounts}
                    onImportSitesForums={handleImportSitesForums}
                    onImportFieldSurveys={handleImportFieldSurveys}
                    onAddEvidence={handleAddEvidence}
                    onShowToast={showToast}
                    onNavigateToPage={handleNavigate}
                    currentRole={currentRole}
                  />
                </Suspense>
              )}

              {/* 9. Mode Expert */}
              {currentPage === 'expert' && (
                <Suspense fallback={<PageLoader />}>
                  <ExpertModePage
                    onShowToast={showToast}
                    initialTab={currentExpertTab}
                  />
                </Suspense>
              )}
            </>
          )}
        </div>
      </main>

      {/* Legal Affidavit / Constat Huissier Modal */}
      {constatThreat && (
        <ConstatModal
          threat={constatThreat}
          onClose={() => setConstatThreat(null)}
          onShowToast={showToast}
        />
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0b1c30] text-white px-4 py-3 rounded-xl shadow-xl border border-white/10 flex items-center gap-3 animate-fade-in text-[13px] font-medium max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="leading-snug">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-auto text-gray-400 hover:text-white text-xs font-bold pl-2"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
