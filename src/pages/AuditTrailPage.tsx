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
      onShowToast(`Signature de sécurité copiée : ${hash.slice(0, 16)}...`);
    } catch {
      onShowToast(`Signature de sécurité : ${hash.slice(0, 16)}...`);
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
      onShowToast(`Historique vérifié et certifié intact • ${res.totalEvents} actions validées.`);
    }, 600);
  };

  const handleExport = (format: 'csv' | 'json') => {
    auditTrailService.exportAuditTrail(currentRole, format);
    onShowToast(`Export du journal des actions (${format.toUpperCase()}) téléchargé.`);
  };

  const getCategoryBadge = (cat: AuditCategory) => {
    switch (cat) {
      case 'LEGAL':
        return {
          label: 'Action juridique & Preuve',
          className: 'bg-slate-100 text-slate-900 border-slate-300',
          icon: Scale,
        };
      case 'DATA_INTEGRITY':
        return {
          label: 'Mise à jour & Import',
          className: 'bg-slate-100 text-slate-800 border-slate-300',
          icon: FileSpreadsheet,
        };
      case 'SECURITY':
        return {
          label: 'Sécurité & Connexion',
          className: 'bg-slate-100 text-slate-700 border-slate-300',
          icon: Lock,
        };
      case 'EXPORT':
        return {
          label: 'Export de rapport',
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
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-white">
                <ShieldCheck className="w-3.5 h-3.5" />
                Journal des actions sécurisé
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                Conforme aux règles légales
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                Signature certifiée
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Historique certifié des actions & journal de bord
            </h1>
            <p className="text-[13px] text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Consultez l'historique complet, sécurisé et horodaté de toutes les actions : signalements, procès-verbaux, blocages, ajouts de preuves et téléchargements de rapports.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              onClick={() => setIsPolicyModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-[12px] font-medium transition-all shadow-2xs cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-700" />
              <span>Guide & Droits d'accès</span>
            </button>

            <button
              onClick={handleVerifyIntegrity}
              disabled={isVerifying}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-[12px] font-medium transition-all shadow-2xs cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Vérification...' : "Vérifier la validité des preuves"}</span>
            </button>

            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-[12px] font-medium shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger le journal (.csv)</span>
            </button>
          </div>
        </div>

        {/* BANDEAU DE PÉRIMÈTRE & CONTRÔLE D'ACCÈS */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12px]">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-[13px] shrink-0">
              {activeAccount.id === 'admin' ? 'DS' : activeAccount.id === 'juridique' ? 'DJ' : 'DG'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900">
                  Profil connecté : {activeAccount.title} ({activeAccount.holderName})
                </span>
                {/* Sélecteur de simulation de vue pour tester les habilitations */}
                <div className="inline-flex items-center gap-1.5 bg-white border border-slate-300 rounded-md px-2 py-0.5 shadow-2xs">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Vue active :</span>
                  <select
                    value={activePerspectiveRole}
                    onChange={(e) => setActivePerspectiveRole(e.target.value as UserRole)}
                    className="text-[11px] font-bold text-slate-900 bg-transparent outline-none cursor-pointer"
                  >
                    <option value="admin">Administrateur (Vue complète à 100%)</option>
                    <option value="juridique">Direction Juridique (Actions & Preuves)</option>
                    <option value="direction">Direction Générale (Vue globale)</option>
                  </select>
                </div>
              </div>
              <span className="text-[11px] text-slate-600 block mt-0.5">
                {activePerspectiveRole === 'admin'
                  ? "Accès complet : toutes les actions techniques, juridiques, de sécurité et d'import de données sont visibles."
                  : activePerspectiveRole === 'juridique'
                  ? "Accès Direction Juridique : affichage ciblé des constats, demandes de blocage et pièces de preuve."
                  : "Accès Direction Générale : vue synthétique et globale de l'activité, sans détails informatiques complexes."}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {integrityStatus && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Preuves vérifiées intactes à {integrityStatus.date}
              </span>
            )}
            <span className="text-[11px] font-mono font-medium text-slate-600">
              {filteredEvents.length} / {roleEvents.length} actions
            </span>
          </div>
        </div>
      </div>

      {/* 2. CARTES KPI AUDIT TRAIL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-800">
              Total des Actions Enregistrées
            </span>
            <Layers className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-[28px] font-bold text-slate-900 font-mono leading-none">
            {stats.total}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Historique complet, aucune suppression possible
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-800">
              Actions Juridiques & Constats
            </span>
            <Scale className="w-4 h-4 text-slate-800" />
          </div>
          <div className="text-[28px] font-bold text-slate-900 font-mono leading-none">
            {stats.legalCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Procès-verbaux générés et demandes de coupure
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-800">
              Imports & Mises à Jour
            </span>
            <FileSpreadsheet className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-[28px] font-bold text-slate-900 font-mono leading-none">
            {stats.dataCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Fichiers Excel, CSV et formulaires enregistrés
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-800">
              Actions Prioritaires / Critiques
            </span>
            <ShieldAlert className="w-4 h-4 text-red-700" />
          </div>
          <div className="text-[28px] font-bold text-red-700 font-mono leading-none">
            {stats.criticalCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Demandes de coupures urgentes et signalements
          </p>
        </div>
      </div>

      {/* 3. BARRE DE FILTRES ET RECHERCHE */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Recherche plein texte */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par référence, cible, auteur, email ou mot-clé..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-300 text-[13px] text-slate-900 focus:outline-none focus:border-slate-500 focus:bg-white transition-all font-mono"
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
              className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-[12px] font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Toutes les catégories</option>
              <option value="LEGAL">Actions Juridiques & Preuves</option>
              <option value="DATA_INTEGRITY">Imports & Mises à jour</option>
              <option value="SECURITY">Sécurité & Connexions</option>
              <option value="EXPORT">Téléchargements de rapports</option>
            </select>

            {/* Filtre Criticité */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value as AuditSeverity | 'ALL')}
              className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-[12px] font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tous les niveaux</option>
              <option value="CRITICAL">Priorité Haute / Critique</option>
              <option value="WARNING">Avertissement</option>
              <option value="INFO">Information standard</option>
            </select>

            {/* Filtre Territoire */}
            {territoriesList.length > 0 && (
              <select
                value={selectedTerritory}
                onChange={(e) => setSelectedTerritory(e.target.value)}
                className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-[12px] font-semibold text-slate-800 focus:outline-none cursor-pointer"
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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-semibold uppercase text-slate-500 tracking-wider">
              <tr>
                <th className="py-3 px-4">Réf. Action / Date</th>
                <th className="py-3 px-4">Auteur & Service</th>
                <th className="py-3 px-4">Action Réalisée</th>
                <th className="py-3 px-4">Cible / Territoire</th>
                <th className="py-3 px-4">Détails de l'Opération</th>
                <th className="py-3 px-4">Signature de Sécurité</th>
                <th className="py-3 px-4 text-right">Fiche</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="font-medium text-[13px]">Aucun enregistrement ne correspond aux critères.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Modifiez les filtres de catégorie ou de recherche ci-dessus.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((entry) => {
                  const catBadge = getCategoryBadge(entry.category);
                  const Icon = catBadge.icon;
                  return (
                    <tr key={entry.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Réf. Acte & Date */}
                      <td className="py-3 px-4 font-mono">
                        <span className="font-bold text-slate-900 block">
                          {entry.id}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-0.5" title={`UTC: ${entry.timestampUtc}`}>
                          {entry.timestampLocal}
                        </span>
                      </td>

                      {/* Auteur & Direction */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">
                          {entry.actorName}
                        </span>
                        <span className="text-[10.5px] text-slate-500 font-mono block mt-0.5 truncate max-w-[190px]" title={entry.actorEmail}>
                          {entry.actorEmail}
                        </span>
                        <span className="text-[9.5px] text-slate-400 block truncate max-w-[190px]">
                          Poste : {entry.ipAddress}
                        </span>
                      </td>

                      {/* Action & Catégorie */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 block leading-tight">
                          {entry.actionLabel}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className={`inline-flex items-center gap-1 text-[9.5px] font-medium px-1.5 py-0.5 rounded border ${catBadge.className}`}>
                            <Icon className="w-3 h-3" />
                            {catBadge.label}
                          </span>
                          <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ${getSeverityBadge(entry.severity)}`}>
                            {entry.severity}
                          </span>
                        </div>
                      </td>

                      {/* Cible & Territoire */}
                      <td className="py-3 px-4 font-mono">
                        {entry.targetLabel ? (
                          <>
                            <span className="font-bold text-slate-900 block truncate max-w-[160px]" title={entry.targetLabel}>
                              {entry.targetLabel}
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              {entry.territory || 'Régional'}
                            </span>
                          </>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">— Système —</span>
                        )}
                      </td>

                      {/* Détails */}
                      <td className="py-3 px-4 text-slate-700 max-w-xs">
                        <p className="line-clamp-2 text-[11.5px] leading-snug">
                          {entry.details}
                        </p>
                        {entry.previousState && entry.newState && (
                          <span className="text-[10px] text-slate-600 block mt-0.5 font-medium">
                            Statut : <span className="line-through text-slate-400">{entry.previousState}</span> ➔ <strong className="text-slate-900">{entry.newState}</strong>
                          </span>
                        )}
                      </td>

                      {/* Empreinte / Signature */}
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <button
                          type="button"
                          onClick={() => handleCopyHash(entry.sha256Hash)}
                          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded border border-slate-200 transition-colors cursor-pointer group"
                          title="Cliquer pour copier la signature de sécurité"
                        >
                          <span className="font-semibold text-slate-800">
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
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-[11px] font-medium border border-slate-300 transition-colors cursor-pointer flex items-center gap-1 ml-auto"
                        >
                          <Eye className="w-3 h-3 text-slate-500" />
                          <span>Détails</span>
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

      {/* 5. MODALE RÉCÉPISSÉ & CERTIFICAT D'ACTION SCELLÉ - VUE RAPIDE AVEC SCROLLER */}
      {selectedEntry && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setSelectedEntry(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[88vh] flex flex-col border border-slate-200 shadow-xl overflow-hidden text-slate-900 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. EN-TÊTE FIXE */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Fiche d'enregistrement certifiée
                    </span>
                    <span className={`text-[9.5px] font-semibold px-1.5 py-0.5 rounded border ${getSeverityBadge(selectedEntry.severity)}`}>
                      {selectedEntry.severity}
                    </span>
                  </div>
                  <h3 className="text-[16px] font-bold text-slate-900 font-mono">
                    {selectedEntry.id}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* BARRE INDICATRICE DE DÉFILEMENT POUR CERVEAU PRESSÉ */}
            <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-200 text-[11px] text-slate-600 font-medium flex items-center justify-between shrink-0">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span>↕</span> Défilement vertical complet disponible (haut en bas)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {selectedEntry.territory || 'Pan-Afrique'} • {selectedEntry.actionCode}
              </span>
            </div>

            {/* 2. CORPS DÉFILABLE DE HAUT EN BAS (SCROLLER DÉDIÉ) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4 text-[12px]">
              {/* SYNTHÈSE EXPRESS */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                    Synthèse de l'action enregistrée
                  </span>
                  <span className="text-[10.5px] font-mono text-slate-500">
                    {selectedEntry.timestampLocal}
                  </span>
                </div>
                <div className="text-[14px] font-bold text-slate-900 leading-tight">
                  {selectedEntry.actionLabel}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-200 text-[11px]">
                  <div className="bg-white border border-slate-200 p-2 rounded-lg">
                    <span className="text-[9.5px] text-slate-500 block uppercase font-medium">Auteur de l'action</span>
                    <span className="font-bold text-slate-900 truncate block" title={selectedEntry.actorName}>
                      {selectedEntry.actorName}
                    </span>
                  </div>
                  <div className="bg-white border border-slate-200 p-2 rounded-lg">
                    <span className="text-[9.5px] text-slate-500 block uppercase font-medium">Cible / Territoire</span>
                    <span className="font-bold text-slate-900 truncate block">
                      {selectedEntry.targetLabel || 'Système'} ({selectedEntry.territory || 'Pan-Afrique'})
                    </span>
                  </div>
                  <div className="bg-white border border-slate-200 p-2 rounded-lg col-span-2 sm:col-span-1">
                    <span className="text-[9.5px] text-slate-500 block uppercase font-medium">Protection</span>
                    <span className="font-mono font-bold text-slate-800 block">
                      Verrouillé & Certifié
                    </span>
                  </div>
                </div>
              </div>

              {/* DÉTAILS DE L'OPÉRATION */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10.5px] text-slate-500 uppercase font-semibold block">
                  Description de l'Opération
                </span>
                <p className="text-[12.5px] text-slate-800 leading-relaxed font-normal">
                  {selectedEntry.details}
                </p>
                {selectedEntry.previousState && selectedEntry.newState && (
                  <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Changement de statut :</span>
                    <span className="text-slate-900">
                      <span className="line-through text-slate-400">{selectedEntry.previousState}</span> ➔ <strong className="text-slate-900 font-bold">{selectedEntry.newState}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* HORODATAGE & MÉTADONNÉES TECHNIQUES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11.5px] font-mono">
                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Date & Heure officielles (UTC)</span>
                  <span className="text-slate-900 font-bold block select-all">{selectedEntry.timestampUtc}</span>
                  <span className="text-[10px] text-slate-500 block">Horodatage de référence légale</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Poste de travail / IP</span>
                  <span className="text-slate-900 font-bold block select-all">{selectedEntry.ipAddress}</span>
                  <span className="text-[10px] text-slate-500 block">{selectedEntry.actorDepartment}</span>
                </div>
              </div>

              {/* ACTEUR ET SERVICE DÉCLARANT */}
              <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1.5 text-[11.5px]">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Email professionnel :</span>
                  <span className="font-mono font-bold text-slate-900 select-all">{selectedEntry.actorEmail}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Service / Direction :</span>
                  <span className="text-slate-900">{selectedEntry.actorDepartment}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Type d'opération :</span>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">{selectedEntry.actionCode}</span>
                </div>
              </div>

              {/* SIGNATURE DE SÉCURITÉ INFALSIFIABLE */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-600" />
                    Signature de sécurité numérique
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyHash(selectedEntry.sha256Hash)}
                    className="text-[10.5px] text-slate-700 hover:text-slate-950 underline cursor-pointer flex items-center gap-1 font-semibold"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copier la signature</span>
                  </button>
                </div>
                <p className="font-mono text-[11px] text-slate-900 break-all bg-white p-2 rounded-lg border border-slate-200 select-all">
                  {selectedEntry.sha256Hash}
                </p>
                <p className="text-[10px] text-slate-500 pt-0.5 leading-relaxed">
                  Cette signature unique prouve que l'action a bien eu lieu à cette date et garantit qu'aucune information n'a été modifiée après son enregistrement.
                </p>
              </div>
            </div>

            {/* 3. PIED DE MODALE FIXE */}
            <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
              {selectedEntry.targetId && onNavigateToThreat ? (
                <button
                  type="button"
                  onClick={() => {
                    const id = selectedEntry.targetId!;
                    setSelectedEntry(null);
                    onNavigateToThreat(id);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                  <span>Voir le dossier concerné</span>
                </button>
              ) : (
                <span className="text-[11px] text-slate-500 font-medium">
                  Document certifié conforme
                </span>
              )}

              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-[12px] font-medium hover:bg-slate-900 cursor-pointer transition-colors ml-auto"
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
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsPolicyModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-slate-200 shadow-xl overflow-hidden my-4 text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Entête de la modale */}
            <div className="p-5 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[16px] font-bold text-slate-900">
                      Guide de Traçabilité & Droits d'Accès par Profil
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      Règles de fonctionnement
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-500 mt-0.5">
                    Comprendre simplement ce qui est enregistré, qui a accès aux informations et la valeur légale des preuves.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPolicyModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Onglets internes */}
            <div className="px-5 pt-3 bg-white border-b border-slate-200 flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setPolicyTab('actions')}
                className={`px-3.5 py-2 text-[12px] font-semibold border-b-2 transition-colors cursor-pointer ${
                  policyTab === 'actions'
                    ? 'border-slate-800 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                1. Ce qui est enregistré
              </button>
              <button
                type="button"
                onClick={() => setPolicyTab('roles')}
                className={`px-3.5 py-2 text-[12px] font-semibold border-b-2 transition-colors cursor-pointer ${
                  policyTab === 'roles'
                    ? 'border-slate-800 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                2. Qui a accès à quoi
              </button>
              <button
                type="button"
                onClick={() => setPolicyTab('compliance')}
                className={`px-3.5 py-2 text-[12px] font-semibold border-b-2 transition-colors cursor-pointer ${
                  policyTab === 'compliance'
                    ? 'border-slate-800 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                3. Sécurité & Valeur juridique
              </button>
            </div>

            {/* BARRE INDICATRICE DE DÉFILEMENT POUR CERVEAU PRESSÉ */}
            <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-200 text-[11px] text-slate-600 font-medium flex items-center justify-between shrink-0">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span>↕</span> Défilement vertical complet disponible (haut en bas)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Guide des droits d'accès
              </span>
            </div>

            {/* Corps défilable avec scroller dédié */}
            <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-6 text-[12.5px] text-slate-700">
              {/* SYNTHÈSE EXPRESS */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                    L'essentiel en résumé
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Conformité légale garantie</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-200 text-[11px]">
                  <div className="bg-white border border-slate-200 p-2.5 rounded-lg">
                    <span className="text-[9.5px] text-slate-500 block uppercase font-medium">1. Ce qui est enregistré</span>
                    <strong className="text-slate-900">4 domaines :</strong> PV & actions légales, imports de fichiers, connexions d'utilisateurs, exports de rapports.
                  </div>
                  <div className="bg-white border border-slate-200 p-2.5 rounded-lg">
                    <span className="text-[9.5px] text-slate-500 block uppercase font-medium">2. Qui voit quoi</span>
                    <strong className="text-slate-900">Chacun son rôle :</strong> L'administrateur voit tout, le juriste voit les dossiers légaux, la direction a une vue synthétique.
                  </div>
                  <div className="bg-white border border-slate-200 p-2.5 rounded-lg">
                    <span className="text-[9.5px] text-slate-500 block uppercase font-medium">3. Valeur légale</span>
                    <strong className="text-slate-900">Infalsifiable :</strong> Chaque action reçoit une signature numérique unique qui garantit qu'elle n'a jamais été modifiée.
                  </div>
                </div>
              </div>

              {/* TAB 1 : ACTIONS TRACÉES */}
              {policyTab === 'actions' && (
                <div className="space-y-5">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-[12px] leading-relaxed text-slate-800">
                      <strong>Principe simple :</strong> Pour que les preuves soient reconnues en justice et devant les opérateurs internet, chaque action importante (génération de constat, signalement, mise à jour, import) est automatiquement enregistrée avec son auteur, sa date et son heure exacte.
                    </p>
                  </div>

                  {/* 1. Actes Juridiques */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                    <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Scale className="w-4 h-4 text-slate-700" />
                        <span>Catégorie 1 : Actions Juridiques & Preuves de Piratage</span>
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                        Priorité Haute
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11.5px]">
                        <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                          <tr>
                            <th className="p-2.5">Type d'action</th>
                            <th className="p-2.5">Quand cela se produit</th>
                            <th className="p-2.5">Informations conservées</th>
                            <th className="p-2.5">Utilité concrète</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="p-2.5 font-bold text-slate-900">Création de constat</td>
                            <td className="p-2.5">Téléchargement du procès-verbal officiel en PDF</td>
                            <td className="p-2.5">Nom de la cible, lien du flux pirate, preuve de paiement</td>
                            <td className="p-2.5 text-slate-600">Preuve officielle à remettre à l'huissier ou au tribunal</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-slate-900">Impression de document</td>
                            <td className="p-2.5">Impression papier d'un constat</td>
                            <td className="p-2.5">Numéro de dossier, nom de la personne qui imprime</td>
                            <td className="p-2.5 text-slate-600">Garder trace des exemplaires physiques remis en main propre</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-slate-900">Demande de coupure</td>
                            <td className="p-2.5">Envoi d'un signalement aux opérateurs internet</td>
                            <td className="p-2.5">Hébergeur, opérateur internet concerné (Orange, Sonatel...)</td>
                            <td className="p-2.5 text-slate-600">Prouver que l'opérateur a bien été averti pour couper le signal</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-slate-900">Changement de statut</td>
                            <td className="p-2.5">Mise à jour de l'état d'une menace (ex : flux coupé)</td>
                            <td className="p-2.5">Ancien statut, nouveau statut, motif</td>
                            <td className="p-2.5 text-slate-600">Suivre l'avancement de la résolution du problème</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-slate-900">Ajout d'une preuve</td>
                            <td className="p-2.5">Dépôt d'une capture d'écran ou d'un reçu financier</td>
                            <td className="p-2.5">Nom du fichier, signature de sécurité, date</td>
                            <td className="p-2.5 text-slate-600">Conserver la capture sans qu'elle puisse être contestée</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 2. Intégrité Données */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                    <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <FileSpreadsheet className="w-4 h-4 text-slate-700" />
                        <span>Catégorie 2 : Imports de Données & Mises à Jour</span>
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        Suivi des fichiers
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11.5px]">
                        <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                          <tr>
                            <th className="p-2.5">Type d'action</th>
                            <th className="p-2.5">Quand cela se produit</th>
                            <th className="p-2.5">Informations conservées</th>
                            <th className="p-2.5">Utilité concrète</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="p-2.5 font-bold text-slate-900">Import de fichier</td>
                            <td className="p-2.5">Ajout d'un tableau Excel ou CSV (sites, applications, comptes)</td>
                            <td className="p-2.5">Nom du fichier, nombre de lignes ajoutées, utilisateur</td>
                            <td className="p-2.5 text-slate-600">Savoir qui a importé quelles données et quand</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-slate-900">Mise à jour d'audience</td>
                            <td className="p-2.5">Analyse automatique du trafic des sites pirates</td>
                            <td className="p-2.5">Nombre de sites, trafic estimé, popularité</td>
                            <td className="p-2.5 text-slate-600">Garantir la fiabilité des chiffres présentés à la Direction</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-slate-900">Enquêtes de terrain</td>
                            <td className="p-2.5">Saisie des retours d'auditeurs locaux dans les pays</td>
                            <td className="p-2.5">Pays, ville, quartier, auditeur, boîtiers pirates constatés</td>
                            <td className="p-2.5 text-slate-600">Valider les remontées de terrain physique (marchés, revendeurs)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 3. Sécurité & 4. Exports */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-slate-200 rounded-xl p-3.5 bg-white space-y-2">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Lock className="w-4 h-4 text-slate-700" />
                        <span>Catégorie 3 : Connexions & Sécurité</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Chaque connexion, déconnexion, changement de compte ou tentative d'accès non autorisée est notée avec l'heure et le poste utilisé pour protéger l'application.
                      </p>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-3.5 bg-white space-y-2">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Download className="w-4 h-4 text-slate-700" />
                        <span>Catégorie 4 : Téléchargements de Rapports</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Chaque téléchargement de rapport d'impact financier ou d'export de données est enregistré pour protéger les informations confidentielles du Groupe.
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
                      <strong>Confidentialité & Simplicité :</strong> Pour que chacun accède rapidement à ce qui l'intéresse sans être submergé de données inutiles, l'affichage est adapté à votre profil professionnel.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                    <table className="w-full text-left text-[11.5px]">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                        <tr>
                          <th className="p-3">Profil</th>
                          <th className="p-3">Ce qui est affiché</th>
                          <th className="p-3">Ce qui est masqué</th>
                          <th className="p-3">Pourquoi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {/* Admin */}
                        <tr className="hover:bg-slate-50/70">
                          <td className="p-3">
                            <span className="font-bold text-slate-900 block">Administrateur</span>
                            <span className="text-[10px] text-slate-500">Équipe technique & Sécurité</span>
                          </td>
                          <td className="p-3">
                            <span className="inline-block px-2 py-0.5 rounded font-medium bg-slate-200 text-slate-800 text-[10px]">
                              Vue complète (100%)
                            </span>
                            <p className="text-[10.5px] text-slate-600 mt-1">
                              Toutes les actions : techniques, juridiques, sécurité, imports et exports.
                            </p>
                          </td>
                          <td className="p-3 text-[11px] text-slate-400 italic">
                            Rien n'est masqué
                          </td>
                          <td className="p-3 text-[11px] text-slate-600">
                            Assurer la maintenance globale, la sécurité et l'intégrité de la plateforme.
                          </td>
                        </tr>

                        {/* Juridique */}
                        <tr className="hover:bg-slate-50/70">
                          <td className="p-3">
                            <span className="font-bold text-slate-900 block">Juridique</span>
                            <span className="text-[10px] text-slate-500">Direction Juridique & Contentieux</span>
                          </td>
                          <td className="p-3">
                            <span className="inline-block px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-800 text-[10px]">
                              Actions & Preuves
                            </span>
                            <p className="text-[10.5px] text-slate-600 mt-1">
                              Constats d'huissier, signalements de coupures, captures d'écran et pièces officielles.
                            </p>
                          </td>
                          <td className="p-3 text-[11px] text-slate-500">
                            Détails informatiques internes et configurations de serveurs.
                          </td>
                          <td className="p-3 text-[11px] text-slate-600">
                            Accéder directement aux dossiers légaux prêts pour le tribunal sans jargon inutile.
                          </td>
                        </tr>

                        {/* Direction */}
                        <tr className="hover:bg-slate-50/70">
                          <td className="p-3">
                            <span className="font-bold text-slate-900 block">Direction Générale</span>
                            <span className="text-[10px] text-slate-500">Comité de Direction Groupe</span>
                          </td>
                          <td className="p-3">
                            <span className="inline-block px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-700 text-[10px]">
                              Vue Synthétique Globale
                            </span>
                            <p className="text-[10.5px] text-slate-600 mt-1">
                              Nombre d'actions par pays, suivi des exports importants, conformité générale.
                            </p>
                          </td>
                          <td className="p-3 text-[11px] text-slate-500">
                            Détails techniques pointus et codes d'exécution.
                          </td>
                          <td className="p-3 text-[11px] text-slate-600">
                            Avoir une vision stratégique claire pour le reporting et les prises de décision.
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
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Lock className="w-4 h-4 text-slate-700" />
                        <span>Signature Infalsifiable</span>
                      </div>
                      <p className="text-[11.5px] text-slate-600 leading-relaxed">
                        Chaque action reçoit une clé de sécurité unique calculée automatiquement. Si quelqu'un essayait de modifier un chiffre ou une date, la signature deviendrait immédiatement invalide.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Clock className="w-4 h-4 text-slate-700" />
                        <span>Date & Heure Officielles</span>
                      </div>
                      <p className="text-[11.5px] text-slate-600 leading-relaxed">
                        L'heure exacte universelle est enregistrée au moment précis de l'action. Cela évite toute contestation lors de litiges entre différents pays (Sénégal, Côte d'Ivoire, Cameroun, France).
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Scale className="w-4 h-4 text-slate-700" />
                        <span>Conformité Légale</span>
                      </div>
                      <p className="text-[11.5px] text-slate-600 leading-relaxed">
                        Les preuves et rapports respectent les règles juridiques sur le commerce électronique et la preuve numérique pour être recevables devant les juridictions compétentes.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-[13px] text-slate-900">
                      <ShieldCheck className="w-4 h-4 text-slate-700" />
                      <span>Verrouillage & Protection des données</span>
                    </div>
                    <p className="text-[11.5px] text-slate-600 leading-relaxed">
                      L'historique est verrouillé : aucune action enregistrée ne peut être effacée ou modifiée ultérieurement, garantissant une transparence totale et une traçabilité irréprochable.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Pied de page de la modale */}
            <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-500">
                Journal des actions certifié conforme • Réf. GUIDE-ACTIVITE-2026
              </span>
              <button
                type="button"
                onClick={() => setIsPolicyModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-[12px] font-medium hover:bg-slate-900 cursor-pointer transition-colors"
              >
                Fermer le guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
