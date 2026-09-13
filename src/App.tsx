import React, { useState } from 'react';
import { Sidebar, NavPage, ExpertTabType } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewPage } from './pages/OverviewPage';
import { ThreatsPage } from './pages/ThreatsPage';
import { ThreatDetailPage } from './pages/ThreatDetailPage';
import { TerritoryDetailPage } from './pages/TerritoryDetailPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { SocialAccountsPage } from './pages/SocialAccountsPage';
import { SitesForumsPage } from './pages/SitesForumsPage';
import { MarketAnalysisPage } from './pages/MarketAnalysisPage';
import { ExpertModePage } from './pages/ExpertModePage';
import { ConstatModal } from './components/ConstatModal';
import {
  mockThreats,
  mockApplications,
  mockAccounts,
  mockSitesForums,
} from './data/mockData';
import { Threat, ThreatStatus } from './types';
import { CheckCircle2, AlertCircle } from 'lucide-react';

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
          {/* 1. Vue d'ensemble */}
          {currentPage === 'overview' && (
            <OverviewPage
              threats={threats}
              onSelectThreat={handleSelectThreat}
              onNavigateToThreats={() => handleNavigate('threats')}
            />
          )}

          {/* 2. Menaces */}
          {currentPage === 'threats' && (
            <ThreatsPage
              threats={threats}
              onSelectThreat={handleSelectThreat}
              onSelectTerritory={handleSelectTerritory}
              onUpdateStatus={handleUpdateStatus}
              onOpenPdfExport={(threat) => setConstatThreat(threat)}
              onShowToast={showToast}
              externalSearch={searchQuery}
            />
          )}

          {/* 3. Détail d'une menace */}
          {currentPage === 'threat-detail' && (
            <ThreatDetailPage
              threat={selectedThreat}
              onUpdateStatus={handleUpdateStatus}
              onNavigateBack={() => handleNavigate('threats')}
              onShowToast={showToast}
              onOpenPdfExport={(threat) => setConstatThreat(threat)}
            />
          )}

          {/* 3b. Fiche Détaillée d'un Territoire */}
          {currentPage === 'territory-detail' && (
            <TerritoryDetailPage
              countryName={selectedTerritoryName}
              threats={threats}
              onNavigateBack={() => handleNavigate('threats')}
              onSelectThreat={handleSelectThreat}
              onUpdateStatus={handleUpdateStatus}
              onOpenPdfExport={(threat) => setConstatThreat(threat)}
              onShowToast={showToast}
            />
          )}

          {/* 4. Applications */}
          {currentPage === 'applications' && (
            <ApplicationsPage
              applications={mockApplications}
              onShowToast={showToast}
            />
          )}

          {/* 5. Comptes & Réseaux */}
          {currentPage === 'accounts' && (
            <SocialAccountsPage
              accounts={mockAccounts}
              onShowToast={showToast}
            />
          )}

          {/* 6. Sites & Forums */}
          {currentPage === 'sites-forums' && (
            <SitesForumsPage
              sitesForums={mockSitesForums}
              onShowToast={showToast}
            />
          )}

          {/* 7. Analyse Marché & Business Intelligence */}
          {currentPage === 'market' && (
            <MarketAnalysisPage
              onShowToast={showToast}
              onSelectTerritory={handleSelectTerritory}
            />
          )}

          {/* 8. Mode Expert */}
          {currentPage === 'expert' && (
            <ExpertModePage
              onShowToast={showToast}
              initialTab={currentExpertTab}
            />
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
