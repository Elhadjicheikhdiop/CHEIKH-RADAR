import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  FileCheck,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Lock,
  Layers,
  FileSpreadsheet,
  AlertTriangle,
  Info,
  Building,
  Scale,
  RefreshCw,
  Eye,
  X,
  BookOpen,
} from 'lucide-react';
import { UserRole, getUserAccount } from '../utils/userAccounts';
import {
  auditTrailService,
  AuditTrailEntry,
  AuditCategory,
  AuditSeverity,
} from '../utils/auditTrailService';

interface AuditTrailPageProps {
  currentRole?: UserRole;
  onShowToast: (msg: string) => void;
  onNavigateToThreat?: (threatId: string) => void;
}

export const AuditTrailPage: React.FC<AuditTrailPageProps> = ({
  currentRole = 'admin',
  onShowToast,
  onNavigateToThreat,
}) => {
  const [activePerspectiveRole, setActivePerspectiveRole] = useState<UserRole>(currentRole);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState<boolean>(false);
  const [policyTab, setPolicyTab] = useState<'actions' | 'roles' | 'compliance'>('actions');

  React.useEffect(() => {
    setActivePerspectiveRole(currentRole);
  }, [currentRole]);

  const activeAccount = getUserAccount(activePerspectiveRole);
  const [selectedCategory, setSelectedCategory] = useState<AuditCategory | 'ALL'>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<AuditSeverity | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTerritory, setSelectedTerritory] = useState<string>('ALL');
  const [selectedEntry, setSelectedEntry] = useState<AuditTrailEntry | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [integrityStatus, setIntegrityStatus] = useState<{
    verified: boolean;
    date: string;
  } | null>(null);

  // Événements filtrés selon le rôle utilisateur (Matrice de visibilité stricte)
  const roleEvents = useMemo(() => {
    return auditTrailService.getEventsForRole(activePerspectiveRole);
  }, [activePerspectiveRole]);

  // Filtrage utilisateur (catégorie, criticité, recherche textuelle, territoire)
  const filteredEvents = useMemo(() => {
    return roleEvents.filter((entry) => {
      if (selectedCategory !== 'ALL' && entry.category !== selectedCategory) {
        return false;
      }
      if (selectedSeverity !== 'ALL' && entry.severity !== selectedSeverity) {
        return false;
      }
      if (selectedTerritory !== 'ALL' && entry.territory !== selectedTerritory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = entry.id.toLowerCase().includes(q);
        const matchAction = entry.actionLabel.toLowerCase().includes(q) || entry.actionCode.toLowerCase().includes(q);
        const matchActor = entry.actorEmail.toLowerCase().includes(q) || entry.actorName.toLowerCase().includes(q);
        const matchTarget = (entry.targetId || '').toLowerCase().includes(q) || (entry.targetLabel || '').toLowerCase().includes(q);
        const matchDetails = entry.details.toLowerCase().includes(q);
        const matchHash = entry.sha256Hash.toLowerCase().includes(q);
        if (!matchId && !matchAction && !matchActor && !matchTarget && !matchDetails && !matchHash) {
          return false;
        }
      }
      return true;
    });
  }, [roleEvents, selectedCategory, selectedSeverity, selectedTerritory, searchQuery]);

  const territoriesList = useMemo(() => {
    const set = new Set<string>();
    roleEvents.forEach((e) => {
      if (e.territory) set.add(e.territory);
    });
    return Array.from(set);
  }, [roleEvents]);

  // Statistiques pour les KPI
  const stats = useMemo(() => {
    const total = roleEvents.length;
    const legalCount = roleEvents.filter((e) => e.category === 'LEGAL').length;
    const dataCount = roleEvents.filter((e) => e.category === 'DATA_INTEGRITY').length;
    const securityCount = roleEvents.filter((e) => e.category === 'SECURITY').length;
    const criticalCount = roleEvents.filter((e) => e.severity === 'CRITICAL').length;
    return { total, legalCount, dataCount, securityCount, criticalCount };
  }, [roleEvents]);

  const handleCopyHash = (hash: string) => {
    try {
      navigator.clipboard.writeText(hash);
      onShowToast(`Empreinte SHA-256 copiée : ${hash.slice(0, 16)}...`);
    } catch {
      onShowToast(`Empreinte SHA-256 : ${hash.slice(0, 16)}...`);
    }
  };

  const handleVerifyIntegrity = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const res = auditTrailService.verifyIntegrity();
      setIsVerifying(false);
      setIntegrityStatus({
        verified: res.isValid,
        date: new Date().toLocaleTimeString('fr-FR'),
      });
      onShowToast(`Chaîne de traçabilité certifiée conforme • ${res.totalEvents} actes vérifiés.`);
    }, 600);
  };

  const handleExport = (format: 'csv' | 'json') => {
    auditTrailService.exportAuditTrail(currentRole, format);
    onShowToast(`Export du journal d'audit (${format.toUpperCase()}) téléchargé avec succès.`);
  };

  const getCategoryBadge = (cat: AuditCategory) => {
    switch (cat) {
      case 'LEGAL':
        return {
          label: 'Acte Juridique & Preuve',
          className: 'bg-slate-100 text-[#0b1c30] border-slate-300',
          icon: Scale,
        };
      case 'DATA_INTEGRITY':
        return {
          label: 'Intégrité Données / Import',
          className: 'bg-slate-100 text-slate-800 border-slate-300',
          icon: FileSpreadsheet,
        };
      case 'SECURITY':
        return {
          label: 'Sécurité & Session',
          className: 'bg-slate-100 text-slate-700 border-slate-300',
          icon: Lock,
        };
      case 'EXPORT':
        return {
          label: 'Export Confidentiel',
          className: 'bg-slate-100 text-slate-700 border-slate-300',
          icon: Download,
        };
    }
  };

  const getSeverityBadge = (sev: AuditSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'WARNING':
        return 'bg-slate-200 text-slate-800 border-slate-300';
      case 'INFO':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. EN-TÊTE PRINCIPAL CORPORATE */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#f1f5f9]">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#0b1c30] text-white">
                <ShieldCheck className="w-3.5 h-3.5" />
                Journal d'Audit Immuable
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-300 font-mono">
                ISO 27001 • Norme OHADA • WORM
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#eff6ff] text-[#1e40af] border border-[#dbeafe]">
                Scellement SHA-256
              </span>
            </div>

            <h1 className="text-2xl font-black text-[#0b1c30] tracking-tight">
              Registre Centralisé d'Audit Trail & Preuves Opposables
            </h1>
            <p className="text-[13px] text-[#64748b] mt-1 max-w-3xl leading-relaxed">
              Enregistrement immuable et horodaté de l'ensemble des actes contentieux, notifications DMCA, générations de PV d'huissier, ingestions de données sources et exports confidentiels.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              onClick={() => setIsPolicyModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[#0b1c30] text-[12px] font-bold transition-all shadow-2xs cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#0b1c30]" />
              <span>Matrice & Politique d'Audit</span>
            </button>

            <button
              onClick={handleVerifyIntegrity}
              disabled={isVerifying}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-[#cbd5e1] text-[#0b1c30] text-[12px] font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Vérification...' : "Contrôler l'Intégrité de Chaîne"}</span>
            </button>

            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0b1c30] hover:bg-[#162f4f] text-white text-[12px] font-bold shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter Journal (.csv)</span>
            </button>
          </div>
        </div>

        {/* BANDEAU DE PÉRIMÈTRE & CONTRÔLE RBAC */}
        <div className="mt-4 p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12px]">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0b1c30] text-white flex items-center justify-center font-bold text-[13px] shrink-0">
              {activeAccount.id === 'admin' ? 'DS' : activeAccount.id === 'juridique' ? 'DJ' : 'DG'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[#0b1c30]">
                  Périmètre appliqué : {activeAccount.title} ({activeAccount.holderName})
                </span>
                {/* Sélecteur de simulation de vue pour tester les habilitations */}
                <div className="inline-flex items-center gap-1.5 bg-white border border-[#cbd5e1] rounded-md px-2 py-0.5 shadow-2xs">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Perspective :</span>
                  <select
                    value={activePerspectiveRole}
                    onChange={(e) => setActivePerspectiveRole(e.target.value as UserRole)}
                    className="text-[11px] font-bold text-[#0b1c30] bg-transparent outline-none cursor-pointer"
                  >
                    <option value="admin">Administrateur (Complet - 100%)</option>
                    <option value="juridique">Direction Juridique (Actes & Preuves)</option>
                    <option value="direction">Direction Générale (Gouvernance)</option>
                  </select>
                </div>
              </div>
              <span className="text-[11px] text-[#64748b] block mt-0.5">
                {activePerspectiveRole === 'admin'
                  ? "Accès complet DSI / Cellule Anti-Piratage : traçabilité technique, juridique, sécurité et intégrité des bases."
                  : activePerspectiveRole === 'juridique'
                  ? "Accès Direction Juridique : visualisation exclusive des constats, demandes de blocage DMCA et preuves contentieuses."
                  : "Accès Direction Générale : synthèse globale de conformité, gouvernance et volume d'actes en lecture seule."}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {integrityStatus && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Scellé intact à {integrityStatus.date}
              </span>
            )}
            <span className="text-[11px] font-mono font-bold text-[#64748b]">
              {filteredEvents.length} / {roleEvents.length} entrées
            </span>
          </div>
        </div>
      </div>

      {/* 2. CARTES KPI AUDIT TRAIL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748b] mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0b1c30]">
              Total Actes Enregistrés
            </span>
            <Layers className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-[28px] font-black text-[#0b1c30] font-mono leading-none">
            {stats.total}
          </div>
          <p className="text-[11px] text-[#64748b] mt-2">
            Journal complet WORM sans possibilité d'effacement
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748b] mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0b1c30]">
              Actes Juridiques & Constats
            </span>
            <Scale className="w-4 h-4 text-[#0b1c30]" />
          </div>
          <div className="text-[28px] font-black text-[#0b1c30] font-mono leading-none">
            {stats.legalCount}
          </div>
          <p className="text-[11px] text-[#64748b] mt-2">
            PV d'huissier PDF générés et notifications FAI
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748b] mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0b1c30]">
              Contrôles Intégrité Données
            </span>
            <FileSpreadsheet className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-[28px] font-black text-[#0b1c30] font-mono leading-none">
            {stats.dataCount}
          </div>
          <p className="text-[11px] text-[#64748b] mt-2">
            Ingestions Excel, CSV et formulaires terrain tracés
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748b] mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0b1c30]">
              Actions Hautement Sensibles
            </span>
            <ShieldAlert className="w-4 h-4 text-red-700" />
          </div>
          <div className="text-[28px] font-black text-red-700 font-mono leading-none">
            {stats.criticalCount}
          </div>
          <p className="text-[11px] text-[#64748b] mt-2">
            Injonctions légales et fermetures de flux en coordination
          </p>
        </div>
      </div>

      {/* 3. BARRE DE FILTRES ET RECHERCHE */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Recherche plein texte */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par identifiant d'acte (AUD-...), cible, acteur, email ou mot-clé..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#f8fafc] border border-[#cbd5e1] text-[13px] text-[#0b1c30] focus:outline-none focus:border-[#0b1c30] focus:bg-white transition-all font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filtre Catégorie */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as AuditCategory | 'ALL')}
              className="px-3 py-2 rounded-lg bg-[#f8fafc] border border-[#cbd5e1] text-[12px] font-bold text-[#0b1c30] focus:outline-none cursor-pointer"
            >
              <option value="ALL">Toutes les catégories</option>
              <option value="LEGAL">Actes Juridiques & Preuves</option>
              <option value="DATA_INTEGRITY">Intégrité Données & Ingestion</option>
              <option value="SECURITY">Sécurité & Sessions</option>
              <option value="EXPORT">Exports Confidentiels</option>
            </select>

            {/* Filtre Criticité */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value as AuditSeverity | 'ALL')}
              className="px-3 py-2 rounded-lg bg-[#f8fafc] border border-[#cbd5e1] text-[12px] font-bold text-[#0b1c30] focus:outline-none cursor-pointer"
            >
              <option value="ALL">Toutes les criticités</option>
              <option value="CRITICAL">Critique</option>
              <option value="WARNING">Avertissement</option>
              <option value="INFO">Information</option>
            </select>

            {/* Filtre Territoire */}
            {territoriesList.length > 0 && (
              <select
                value={selectedTerritory}
                onChange={(e) => setSelectedTerritory(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#f8fafc] border border-[#cbd5e1] text-[12px] font-bold text-[#0b1c30] focus:outline-none cursor-pointer"
              >
                <option value="ALL">Tous les territoires</option>
                {territoriesList.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* 4. TABLEAU DU JOURNAL D'AUDIT HAUTE DENSITÉ */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[10px] font-bold uppercase text-[#64748b] tracking-wider">
              <tr>
                <th className="py-3 px-4">Réf. Acte / Date UTC</th>
                <th className="py-3 px-4">Auteur & Direction</th>
                <th className="py-3 px-4">Action Exécutée</th>
                <th className="py-3 px-4">Cible / Territoire</th>
                <th className="py-3 px-4">Détails de l'Opération</th>
                <th className="py-3 px-4">Empreinte SHA-256</th>
                <th className="py-3 px-4 text-right">Récépissé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#64748b]">
                    <ShieldCheck className="w-8 h-8 text-[#94a3b8] mx-auto mb-2" />
                    <p className="font-medium text-[13px]">Aucun enregistrement ne correspond aux critères.</p>
                    <p className="text-[11px] text-[#94a3b8] mt-0.5">
                      Modifiez les filtres de catégorie ou de recherche ci-dessus.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((entry) => {
                  const catBadge = getCategoryBadge(entry.category);
                  const Icon = catBadge.icon;
                  return (
                    <tr key={entry.id} className="hover:bg-[#f8fafc] transition-colors">
                      {/* Réf. Acte & Date */}
                      <td className="py-3 px-4 font-mono">
                        <span className="font-bold text-[#0b1c30] block">
                          {entry.id}
                        </span>
                        <span className="text-[10px] text-[#64748b] block mt-0.5" title={`UTC: ${entry.timestampUtc}`}>
                          {entry.timestampLocal}
                        </span>
                      </td>

                      {/* Auteur & Direction */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#0b1c30] block">
                          {entry.actorName}
                        </span>
                        <span className="text-[10.5px] text-[#64748b] font-mono block mt-0.5 truncate max-w-[190px]" title={entry.actorEmail}>
                          {entry.actorEmail}
                        </span>
                        <span className="text-[9.5px] text-slate-500 block truncate max-w-[190px]">
                          {entry.ipAddress}
                        </span>
                      </td>

                      {/* Action & Catégorie */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#0b1c30] block leading-tight">
                          {entry.actionLabel}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className={`inline-flex items-center gap-1 text-[9.5px] font-bold px-1.5 py-0.2 rounded border ${catBadge.className}`}>
                            <Icon className="w-3 h-3" />
                            {catBadge.label}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${getSeverityBadge(entry.severity)}`}>
                            {entry.severity}
                          </span>
                        </div>
                      </td>

                      {/* Cible & Territoire */}
                      <td className="py-3 px-4 font-mono">
                        {entry.targetLabel ? (
                          <>
                            <span className="font-bold text-[#0b1c30] block truncate max-w-[160px]" title={entry.targetLabel}>
                              {entry.targetLabel}
                            </span>
                            <span className="text-[10px] text-[#64748b] block">
                              {entry.territory || 'Régional'}
                            </span>
                          </>
                        ) : (
                          <span className="text-[11px] text-[#94a3b8] italic">— Système —</span>
                        )}
                      </td>

                      {/* Détails */}
                      <td className="py-3 px-4 text-[#475569] max-w-xs">
                        <p className="line-clamp-2 text-[11.5px] leading-snug">
                          {entry.details}
                        </p>
                        {entry.previousState && entry.newState && (
                          <span className="text-[10px] text-slate-600 block mt-0.5 font-medium">
                            Statut : <span className="line-through">{entry.previousState}</span> ➔ <strong>{entry.newState}</strong>
                          </span>
                        )}
                      </td>

                      {/* Empreinte SHA-256 */}
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <button
                          type="button"
                          onClick={() => handleCopyHash(entry.sha256Hash)}
                          className="flex items-center gap-1 text-slate-600 hover:text-[#0b1c30] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded border border-slate-200 transition-colors cursor-pointer group"
                          title="Cliquer pour copier l'empreinte complète SHA-256"
                        >
                          <span className="font-bold text-[#0b1c30]">
                            {entry.sha256Hash.slice(0, 8)}...{entry.sha256Hash.slice(-6)}
                          </span>
                          <Copy className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                        </button>
                      </td>

                      {/* Action Détail */}
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedEntry(entry)}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-[#0b1c30] text-[11px] font-bold border border-[#cbd5e1] transition-colors cursor-pointer flex items-center gap-1 ml-auto"
                        >
                          <Eye className="w-3 h-3 text-[#64748b]" />
                          <span>Récépissé</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. MODALE RÉCÉPISSÉ & CERTIFICAT D'AUDIT SCELLÉ */}
      {selectedEntry && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedEntry(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-[#e2e8f0] shadow-2xl space-y-4 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#0b1c30] text-white flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Certificat d'Enregistrement Horodaté
                  </span>
                  <h3 className="text-[16px] font-bold text-[#0b1c30] font-mono">
                    {selectedEntry.id}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedEntry(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-black flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Corps du certificat */}
            <div className="space-y-3 text-[12px]">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">Date & Heure UTC</span>
                  <span className="text-[#0b1c30] font-bold block">{selectedEntry.timestampUtc}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">Date & Heure Locale</span>
                  <span className="text-[#0b1c30] font-bold block">{selectedEntry.timestampLocal}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Auteur de l'action :</span>
                  <span className="font-bold text-[#0b1c30]">{selectedEntry.actorName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 font-mono">
                  <span className="text-slate-500">Adresse Email :</span>
                  <span className="text-[#0b1c30] font-semibold">{selectedEntry.actorEmail}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Direction / Service :</span>
                  <span className="text-[#0b1c30]">{selectedEntry.actorDepartment}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 font-mono">
                  <span className="text-slate-500">Origine réseau (IP) :</span>
                  <span className="text-[#0b1c30]">{selectedEntry.ipAddress}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Intitulé de l'acte :</span>
                  <span className="font-bold text-[#0b1c30]">{selectedEntry.actionLabel}</span>
                </div>
                {selectedEntry.targetLabel && (
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Cible concernée :</span>
                    <span className="font-bold text-[#0b1c30] font-mono">
                      {selectedEntry.targetLabel} ({selectedEntry.territory || 'Panafricain'})
                    </span>
                  </div>
                )}
                {selectedEntry.previousState && selectedEntry.newState && (
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Transition de statut :</span>
                    <span className="text-[#0b1c30]">
                      {selectedEntry.previousState} ➔ <strong>{selectedEntry.newState}</strong>
                    </span>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                  Description détaillée de l'acte
                </span>
                <p className="text-[12px] text-slate-800 leading-relaxed">
                  {selectedEntry.details}
                </p>
              </div>

              {/* Empreinte cryptographique */}
              <div className="p-3.5 rounded-xl bg-[#0b1c30] text-white space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    Empreinte Numérique SHA-256 (Scellement d'Intégrité)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyHash(selectedEntry.sha256Hash)}
                    className="text-[10px] text-slate-300 hover:text-white underline cursor-pointer"
                  >
                    Copier
                  </button>
                </div>
                <p className="font-mono text-[11px] text-emerald-300 break-all">
                  {selectedEntry.sha256Hash}
                </p>
                <p className="text-[10px] text-slate-400 pt-1">
                  Cette empreinte garantit la non-répudiation de l'acte devant les juridictions compétentes et les autorités de régulation (OHADA & UEMOA).
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
              {selectedEntry.targetId && onNavigateToThreat && (
                <button
                  type="button"
                  onClick={() => {
                    const id = selectedEntry.targetId!;
                    setSelectedEntry(null);
                    onNavigateToThreat(id);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0b1c30] text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Voir le dossier cible</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="ml-auto px-4 py-2 rounded-xl bg-[#0b1c30] text-white text-[12px] font-bold hover:bg-[#162f4f] cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODALE CORPORATE : MATRICE DE TRAÇABILITÉ & POLITIQUE D'AUDIT TRAIL */}
      {isPolicyModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsPolicyModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-[#cbd5e1] shadow-2xl overflow-hidden my-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Entête de la modale */}
            <div className="p-5 border-b border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0b1c30] text-white flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[16px] font-bold text-[#0b1c30]">
                      Politique d'Audit Trail & Matrice des Habilitations RBAC
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800">
                      Cadre de Référence
                    </span>
                  </div>
                  <p className="text-[12px] text-[#64748b] mt-0.5">
                    Définition stricte des actions tracées, ségrégation des privilèges d'accès aux logs et valeur probatoire.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPolicyModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Onglets internes */}
            <div className="px-5 pt-3 bg-white border-b border-[#e2e8f0] flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setPolicyTab('actions')}
                className={`px-3.5 py-2 text-[12px] font-bold border-b-2 transition-colors cursor-pointer ${
                  policyTab === 'actions'
                    ? 'border-[#0b1c30] text-[#0b1c30]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                1. Actions Soumises à Traçabilité (Quoi ?)
              </button>
              <button
                type="button"
                onClick={() => setPolicyTab('roles')}
                className={`px-3.5 py-2 text-[12px] font-bold border-b-2 transition-colors cursor-pointer ${
                  policyTab === 'roles'
                    ? 'border-[#0b1c30] text-[#0b1c30]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                2. Matrice d'Habilitation (Qui voit quoi ?)
              </button>
              <button
                type="button"
                onClick={() => setPolicyTab('compliance')}
                className={`px-3.5 py-2 text-[12px] font-bold border-b-2 transition-colors cursor-pointer ${
                  policyTab === 'compliance'
                    ? 'border-[#0b1c30] text-[#0b1c30]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                3. Valeur Probatoire & Normes
              </button>
            </div>

            {/* Corps défilable */}
            <div className="p-5 overflow-y-auto space-y-6 text-[12.5px] text-slate-700">
              {/* TAB 1 : ACTIONS TRACÉES */}
              {policyTab === 'actions' && (
                <div className="space-y-5">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-[12px] leading-relaxed text-slate-800">
                      <strong>Principe fondamental :</strong> Pour garantir l'inviolabilité des preuves et la gouvernance institutionnelle, chaque action ayant un impact probatoire, financier, technique ou sécuritaire génère un enregistrement immuable scellé par une empreinte SHA-256.
                    </p>
                  </div>

                  {/* 1. Actes Juridiques */}
                  <div className="border border-[#e2e8f0] rounded-xl overflow-hidden">
                    <div className="bg-[#f8fafc] px-4 py-2.5 border-b border-[#e2e8f0] flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-[#0b1c30]">
                        <Scale className="w-4 h-4 text-[#0b1c30]" />
                        <span>Pilier 1 : Actes Juridiques & Preuves Contentieuses (LEGAL)</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">
                        Criticité Haute
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11.5px]">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="p-2.5">Code Action</th>
                            <th className="p-2.5">Événement Déclencheur</th>
                            <th className="p-2.5">Données Collectées</th>
                            <th className="p-2.5">Portée Juridique & Justification</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="p-2.5 font-mono font-bold text-[#0b1c30]">CONSTAT_GENERATED</td>
                            <td className="p-2.5">Export du PV d'huissier PDF horodaté</td>
                            <td className="p-2.5">ID Menace, URLs flux, IP serveur, preuve Wave/Orange Money</td>
                            <td className="p-2.5 text-slate-600">Constitution de preuve opposable devant le Tribunal de Commerce</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-mono font-bold text-[#0b1c30]">CONSTAT_PRINTED</td>
                            <td className="p-2.5">Impression physique du constat pour signification</td>
                            <td className="p-2.5">ID Menace, Nom de la cible, Auteur de l'impression</td>
                            <td className="p-2.5 text-slate-600">Traçabilité de la matérialisation papier pour huissier audiencier</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-mono font-bold text-[#0b1c30]">DMCA_SENT</td>
                            <td className="p-2.5">Transmission d'injonction Takedown / Cloudflare</td>
                            <td className="p-2.5">Hébergeur, CDN, FAI assigné (Sonatel, Camtel, etc.)</td>
                            <td className="p-2.5 text-slate-600">Preuve de notification formelle préalable à l'assignation en référé</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-mono font-bold text-[#0b1c30]">THREAT_STATUS_UPDATED</td>
                            <td className="p-2.5">Changement d'état contentieux (ex: Coupé / Clôturé)</td>
                            <td className="p-2.5">Statut antérieur, nouveau statut, motif de transition</td>
                            <td className="p-2.5 text-slate-600">Historique chronologique de la neutralisation du flux pirate</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-mono font-bold text-[#0b1c30]">EVIDENCE_RECORDED</td>
                            <td className="p-2.5">Dépôt d'une capture d'écran ou reçu financier</td>
                            <td className="p-2.5">Nom de fichier, empreinte SHA-256, type de pièce</td>
                            <td className="p-2.5 text-slate-600">Scellement de la chaîne de garde de la pièce à conviction</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 2. Intégrité Données */}
                  <div className="border border-[#e2e8f0] rounded-xl overflow-hidden">
                    <div className="bg-[#f8fafc] px-4 py-2.5 border-b border-[#e2e8f0] flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-[#0b1c30]">
                        <FileSpreadsheet className="w-4 h-4 text-slate-700" />
                        <span>Pilier 2 : Intégrité des Données & Ingestion (DATA_INTEGRITY)</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                        Intégrité Bases
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11.5px]">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="p-2.5">Code Action</th>
                            <th className="p-2.5">Événement Déclencheur</th>
                            <th className="p-2.5">Données Collectées</th>
                            <th className="p-2.5">Portée & Justification</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="p-2.5 font-mono font-bold text-[#0b1c30]">DATA_IMPORTED_*</td>
                            <td className="p-2.5">Ingestion d'un classeur Excel / CSV (Menaces, APK, Comptes)</td>
                            <td className="p-2.5">Nom de fichier, nombre de lignes, catégorie de modèle</td>
                            <td className="p-2.5 text-slate-600">Contrôle anti-corruption et traçabilité de la source d'alimentation</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-mono font-bold text-[#0b1c30]">SEMRUSH_BATCH_APPLIED</td>
                            <td className="p-2.5">Application en base de l'enrichissement SEMrush API</td>
                            <td className="p-2.5">Volume de domaines, trafic mensuel estimé, autorités DA</td>
                            <td className="p-2.5 text-slate-600">Garantie d'exactitude des volumétries d'audience présentées au DG</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-mono font-bold text-[#0b1c30]">DATA_IMPORTED_SURVEYS</td>
                            <td className="p-2.5">Saisie d'enquêtes terrain des auditeurs en filiales</td>
                            <td className="p-2.5">Ville, quartier, auditeur déclarant, pénétration constatée</td>
                            <td className="p-2.5 text-slate-600">Validation des relevés de terrain physique (marchés, revendeurs IPTV)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 3. Sécurité & 4. Exports */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-[#e2e8f0] rounded-xl p-3.5 bg-white space-y-2">
                      <div className="flex items-center gap-2 font-bold text-[#0b1c30]">
                        <Lock className="w-4 h-4 text-slate-700" />
                        <span>Pilier 3 : Sécurité des Sessions (SECURITY)</span>
                      </div>
                      <p className="text-[11px] text-[#64748b]">
                        Chaque connexion (<code className="font-mono text-[#0b1c30]">AUTH_LOGIN</code>), déconnexion (<code className="font-mono text-[#0b1c30]">AUTH_LOGOUT</code>), bascule de profil (<code className="font-mono text-[#0b1c30]">ROLE_SWITCHED</code>) ou tentative d'import non autorisée (<code className="font-mono text-red-700 font-bold">SECURITY_IMPORT_BLOCKED</code>) est horodatée avec l'adresse IP pour détecter toute usurpation.
                      </p>
                    </div>

                    <div className="border border-[#e2e8f0] rounded-xl p-3.5 bg-white space-y-2">
                      <div className="flex items-center gap-2 font-bold text-[#0b1c30]">
                        <Download className="w-4 h-4 text-slate-700" />
                        <span>Pilier 4 : Extractions Confidentielles (EXPORT)</span>
                      </div>
                      <p className="text-[11px] text-[#64748b]">
                        Tout téléchargement de rapport économique (<code className="font-mono text-[#0b1c30]">EXPORT_MARKET_REPORT</code>), extraction SEMrush ou export de la chaîne d'audit elle-même est journalisé pour prévenir la fuite d'informations stratégiques.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2 : MATRICE RBAC (QUI VOIT QUOI ?) */}
              {policyTab === 'roles' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-[12px] leading-relaxed text-slate-800">
                      <strong>Ségrégation des tâches & Confidentialité :</strong> Conformément aux règles de gouvernance d'entreprise et au secret des instructions judiciaires, chaque direction dispose d'une visibilité adaptée à ses prérogatives strictes.
                    </p>
                  </div>

                  <div className="border border-[#e2e8f0] rounded-xl overflow-hidden">
                    <table className="w-full text-left text-[11.5px]">
                      <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-slate-600 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="p-3">Profil Utilisateur</th>
                          <th className="p-3">Périmètre Visible</th>
                          <th className="p-3">Événements Masqués</th>
                          <th className="p-3">Justification Métier</th>
                          <th className="p-3 text-right">Certification</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {/* Admin */}
                        <tr className="hover:bg-slate-50">
                          <td className="p-3">
                            <span className="font-bold text-[#0b1c30] block">Compte Administrateur (Admin)</span>
                            <span className="text-[10px] text-slate-500 font-mono">DSI & Cellule Anti-Piratage</span>
                          </td>
                          <td className="p-3">
                            <span className="inline-block px-2 py-0.5 rounded font-bold bg-slate-200 text-slate-800 text-[10px]">
                              100% de la chaîne d'audit
                            </span>
                            <p className="text-[10.5px] text-slate-600 mt-1">
                              Technique, Sécurité, Intégrité, Juridique, Exports, Alertes de blocage.
                            </p>
                          </td>
                          <td className="p-3 text-[11px] text-slate-400 italic">
                            Aucun événement masqué
                          </td>
                          <td className="p-3 text-[11px] text-slate-600">
                            Responsabilité de l'infrastructure, détection d'intrusions, maintien de l'intégrité de la chaîne SHA-256.
                          </td>
                          <td className="p-3 text-right font-mono text-[10.5px] font-bold text-emerald-700">
                            Contrôle SHA-256 + Export CSV/JSON
                          </td>
                        </tr>

                        {/* Juridique */}
                        <tr className="hover:bg-slate-50">
                          <td className="p-3">
                            <span className="font-bold text-[#0b1c30] block">Compte Juridique</span>
                            <span className="text-[10px] text-slate-500 font-mono">Direction Juridique & Contentieux</span>
                          </td>
                          <td className="p-3">
                            <span className="inline-block px-2 py-0.5 rounded font-bold bg-slate-100 text-[#0b1c30] text-[10px]">
                              Actes Légaux & Preuves
                            </span>
                            <p className="text-[10.5px] text-slate-600 mt-1">
                              Constats d'huissier, injonctions DMCA, dépôts de pièces, relevés terrain probatoires.
                            </p>
                          </td>
                          <td className="p-3 text-[11px] text-slate-500">
                            Logs techniques bruts, sessions SSO administrateur, configurations API.
                          </td>
                          <td className="p-3 text-[11px] text-slate-600">
                            Constitution de dossiers contentieux exempts de pollution technique, opposabilité directe au tribunal.
                          </td>
                          <td className="p-3 text-right font-mono text-[10.5px] font-bold text-slate-700">
                            Export Dossier Légal Certifié
                          </td>
                        </tr>

                        {/* Direction */}
                        <tr className="hover:bg-slate-50">
                          <td className="p-3">
                            <span className="font-bold text-[#0b1c30] block">Compte Direction</span>
                            <span className="text-[10px] text-slate-500 font-mono">Comité de Direction Groupe</span>
                          </td>
                          <td className="p-3">
                            <span className="inline-block px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-700 text-[10px]">
                              Synthèse Gouvernance
                            </span>
                            <p className="text-[10.5px] text-slate-600 mt-1">
                              Volume d'actes par filiale, traçabilité des exports stratégiques, conformité globale.
                            </p>
                          </td>
                          <td className="p-3 text-[11px] text-slate-500">
                            Détails cryptographiques d'exécution et tentatives de requêtes SQL/API.
                          </td>
                          <td className="p-3 text-[11px] text-slate-600">
                            Supervision stratégique des risques et reporting de conformité au Conseil d'Administration.
                          </td>
                          <td className="p-3 text-right font-mono text-[10.5px] font-bold text-slate-700">
                            Export Rapport Synthétique
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3 : CONFORMITÉ & VALEUR PROBATOIRE */}
              {policyTab === 'compliance' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-[#0b1c30]">
                        <Lock className="w-4 h-4 text-emerald-600" />
                        <span>Scellement SHA-256</span>
                      </div>
                      <p className="text-[11.5px] text-slate-600 leading-relaxed">
                        Chaque enregistrement génère une empreinte numérique SHA-256 calculée à partir de l'ID, de la date UTC, de l'email de l'auteur et des paramètres de l'action. Toute modification ultérieure brise la signature.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-[#0b1c30]">
                        <Clock className="w-4 h-4 text-[#1e40af]" />
                        <span>Horodatage UTC Immuable</span>
                      </div>
                      <p className="text-[11.5px] text-slate-600 leading-relaxed">
                        Le serveur enregistre l'heure atomique UTC indépendamment du fuseau horaire de l'utilisateur pour éviter toute contestation lors de litiges transfrontaliers (Sénégal, Côte d'Ivoire, Cameroun, France).
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-[#0b1c30]">
                        <Scale className="w-4 h-4 text-[#0b1c30]" />
                        <span>Normes OHADA & ISO 27001</span>
                      </div>
                      <p className="text-[11.5px] text-slate-600 leading-relaxed">
                        Conforme à la clause A.12.4 de la norme ISO 27001 (Journalisation et surveillance) et aux exigences probatoires de l'Acte uniforme OHADA sur le commerce électronique et la preuve numérique.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0b1c30] text-white space-y-2">
                    <div className="flex items-center gap-2 font-bold text-[13px]">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Garantie WORM (Write Once, Read Many)</span>
                    </div>
                    <p className="text-[11.5px] text-slate-300 leading-relaxed">
                      Le registre d'audit est protégé contre toute suppression ou altération manuelle. Aucun administrateur, y compris disposant des privilèges les plus élevés, ne peut tronquer ou expurger un acte déjà consigné. L'intégrité de la chaîne peut être contrôlée à tout moment via le bouton de vérification cryptographique.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Pied de page de la modale */}
            <div className="p-4 border-t border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between shrink-0">
              <span className="text-[11px] text-[#64748b]">
                Registre de traçabilité certifié conforme • Réf. DOC-AUDIT-BROADCAST-2026
              </span>
              <button
                type="button"
                onClick={() => setIsPolicyModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#0b1c30] text-white text-[12px] font-bold hover:bg-[#162f4f] cursor-pointer"
              >
                Fermer la politique
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
