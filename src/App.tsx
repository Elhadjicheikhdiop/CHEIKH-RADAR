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
import { Threat, ThreatStatus } from './types';
import { CheckCircle2, Loader2 } from 'lucide-react';

// Lazy loading des pages secondaires pour un démarrage ultra-rapide (Code Splitting)
const ThreatsPage = lazy(() => import('./pages/ThreatsPage').then((m) => ({ default: m.ThreatsPage })));
const ThreatDetailPage = lazy(() => import('./pages/ThreatDetailPage').then((m) => ({ default: m.ThreatDetailPage })));
const TerritoryDetailPage = lazy(() => import('./pages/TerritoryDetailPage').then((m) => ({ default: m.TerritoryDetailPage })));
const ApplicationsPage = lazy(() => import('./pages/ApplicationsPage').then((m) => ({ default: m.ApplicationsPage })));
const SocialAccountsPage = lazy(() => import('./pages/SocialAccountsPage').then((m) => ({ default: m.SocialAccountsPage })));
const SitesForumsPage = lazy(() => import('./pages/SitesForumsPage').then((m) => ({ default: m.SitesForumsPage })));
const MarketAnalysisPage = lazy(() => import('./pages/MarketAnalysisPage').then((m) => ({ default: m.MarketAnalysisPage })));
const ExpertModePage = lazy(() => import('./pages/ExpertModePage').then((m) => ({ default: m.ExpertModePage })));

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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [constatThreat, setConstatThreat] = useState<Threat | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3800);
  };

  const handleNavigate = (page: NavPage, threatId?: string, expertTab?: ExpertTabType) => {
    if (threatId) {
      setSelectedThreatId(threatId);
    }
    if (expertTab) {
      setCurrentExpertTab(expertTab);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectThreat = (threatId: string) => {
    setSelectedThreatId(threatId);
    setCurrentPage('threat-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTerritory = (countryName: string) => {
    setSelectedTerritoryName(countryName);
    setCurrentPage('territory-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateStatus = (threatId: string, newStatus: ThreatStatus) => {
    setThreats((prev) =>
      prev.map((t) => {
        if (t.id === threatId) {
          const newLog = {
            id: `log-${Date.now()}`,
            time: new Date().toTimeString().split(' ')[0].substring(0, 5),
            actor: 'L. Bertrand (Analyste IP)',
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

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-[#0b1c30] flex flex-col font-sans selection:bg-[#fee2e2] selection:text-[#dc2626]">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        currentExpertTab={currentExpertTab}
        onNavigate={handleNavigate}
        threatsCount={threats.length}
      />

      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim() && currentPage !== 'threats') {
            setCurrentPage('threats');
          }
        }}
        onSearchSubmit={() => {
          if (currentPage !== 'threats') {
            setCurrentPage('threats');
          }
        }}
      />

      {/* Main Content Area */}
      <main className="pl-64 pt-[60px] min-h-screen flex flex-col flex-1">
        <div className="max-w-7xl w-full mx-auto px-6 py-7 flex-1">
          {/* 1. Vue d'ensemble (Chargement instantané synchrone) */}
          {currentPage === 'overview' && (
            <OverviewPage
              threats={threats}
              onSelectThreat={handleSelectThreat}
              onNavigateToThreats={() => handleNavigate('threats')}
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
              />
            </Suspense>
          )}

          {/* 3b. Fiche Détaillée d'un Territoire */}
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
                applications={mockApplications}
                onShowToast={showToast}
              />
            </Suspense>
          )}

          {/* 5. Comptes & Réseaux */}
          {currentPage === 'accounts' && (
            <Suspense fallback={<PageLoader />}>
              <SocialAccountsPage
                accounts={mockAccounts}
                onShowToast={showToast}
              />
            </Suspense>
          )}

          {/* 6. Sites & Forums */}
          {currentPage === 'sites-forums' && (
            <Suspense fallback={<PageLoader />}>
              <SitesForumsPage
                sitesForums={mockSitesForums}
                onShowToast={showToast}
              />
            </Suspense>
          )}

          {/* 7. Analyse Marché & Business Intelligence */}
          {currentPage === 'market' && (
            <Suspense fallback={<PageLoader />}>
              <MarketAnalysisPage
                onShowToast={showToast}
                onSelectTerritory={handleSelectTerritory}
              />
            </Suspense>
          )}

          {/* 8. Mode Expert */}
          {currentPage === 'expert' && (
            <Suspense fallback={<PageLoader />}>
              <ExpertModePage
                onShowToast={showToast}
                initialTab={currentExpertTab}
              />
            </Suspense>
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
