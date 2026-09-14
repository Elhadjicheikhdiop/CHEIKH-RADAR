import React, { useState } from 'react';
import {
  Shield,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Building,
  Key,
  Scale,
  ShieldCheck,
  Globe2,
  Check,
  Radio,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { UserRole, USER_ACCOUNTS_CONFIG, THREE_ACCOUNTS_LIST } from '../utils/userAccounts';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rememberSession, setRememberSession] = useState<boolean>(true);

  const currentAccount =
    USER_ACCOUNTS_CONFIG[selectedRole as 'admin' | 'direction' | 'juridique'] ||
    USER_ACCOUNTS_CONFIG.admin;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
      case 'super_admin':
        return Shield;
      case 'juridique':
      case 'dir_juridique':
        return Scale;
      case 'direction':
      case 'dir_generale':
      default:
        return Building;
    }
  };

  const getClearanceLevel = (role: string) => {
    switch (role) {
      case 'admin':
      case 'super_admin':
        return {
          level: 'Niveau 3',
          label: 'Administration & Import',
          badge: 'bg-blue-50 text-blue-800 border-blue-200',
        };
      case 'direction':
      case 'dir_generale':
        return {
          level: 'Niveau 2',
          label: 'Direction & Intelligence',
          badge: 'bg-slate-100 text-slate-800 border-slate-300',
        };
      case 'juridique':
      case 'dir_juridique':
      default:
        return {
          level: 'Niveau 1',
          label: 'Contentieux & Constats',
          badge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        };
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLogin(selectedRole);
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0b1c30] flex flex-col justify-between font-sans selection:bg-[#0b1c30] selection:text-white">
      {/* Top Corporate Bar */}
      <header className="w-full bg-white border-b border-[#e2e8f0] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-4">
          <Logo showSubtitle={false} />
          <div className="hidden sm:block h-5 w-[1px] bg-[#cbd5e1]" />
          <div className="hidden sm:flex flex-col">
            <span className="text-[12px] font-bold text-[#0b1c30] tracking-tight">
              Portail Central de Surveillance & Contentieux Anti-Piratage
            </span>
            <span className="text-[10px] text-[#64748b]">
              Cellule Analyse de Données & Direction des Affaires Juridiques
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f1f5f9] border border-[#e2e8f0] text-[11px] font-medium text-[#475569]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Réseau Opérationnel Sécurisé</span>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#f1f5f9] text-[#64748b] border border-[#e2e8f0]">
            TLS 1.3 • EAL4+
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Corporate Overview & Strategic Pillars */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Système d'Information & Protection Audiovisuelle</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0b1c30] tracking-tight leading-[1.18]">
                Gestion Centralisée de la Veille & des Contentieux Anti-Piratage
              </h1>
              <p className="text-[14px] sm:text-[15px] text-[#475569] mt-3 leading-relaxed">
                Environnement d’aide à la décision et d’intervention opérationnelle dédié à la détection des flux IPTV illicites, au monitoring des applications mobiles, à la mesure des pertes d’abonnés et à la constitution de constats d’huissier opposables.
              </p>
            </div>

            {/* Strategic Pillars Cards */}
            <div className="space-y-3 pt-1">
              <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-2xs flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-[#0b1c30]">
                    Surveillance Multi-Canaux & Détection Live
                  </h3>
                  <p className="text-[12px] text-[#64748b] mt-0.5 leading-snug">
                    Suivi continu des serveurs Xtream, flux m3u8, applications APK et réseaux de distribution pirates (Telegram, Facebook, Web).
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-2xs flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  <Globe2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-[#0b1c30]">
                    Intelligence Marché & 12 Territoires Filiales
                  </h3>
                  <p className="text-[12px] text-[#64748b] mt-0.5 leading-snug">
                    Consolidation des données tarifaires, audits terrain des revendeurs et modélisation de l'érosion du parc abonnés par pays.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-2xs flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-[#0b1c30]">
                    Chaîne de Preuves Juridiques & Constats Horodatés
                  </h3>
                  <p className="text-[12px] text-[#64748b] mt-0.5 leading-snug">
                    Génération instantanée de constats d'huissier PDF conformes aux exigences contentieuses et notifications DMCA / Takedown.
                  </p>
                </div>
              </div>
            </div>

            {/* Compliance Guarantee Badges */}
            <div className="pt-1 flex items-center gap-5 text-[11px] text-[#64748b] flex-wrap">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Conformité OHADA & RGPD
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Audit Trail Horodaté
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Contrôle RBAC Strict
              </span>
            </div>
          </div>

          {/* Right Column: Corporate Sign-In Form */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-[#cbd5e1] shadow-xl p-6 sm:p-7">
            <div className="border-b border-[#f1f5f9] pb-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] block">
                    Authentification Sécurisée
                  </span>
                  <h2 className="text-xl font-black text-[#0b1c30] tracking-tight mt-0.5">
                    Sélectionnez votre Compte
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0]">
                    3 Profils Habilités
                  </span>
                </div>
              </div>
              <p className="text-[12px] text-[#64748b] mt-1.5">
                Chaque profil applique automatiquement le périmètre de droits et les règles de confidentialité de votre direction.
              </p>
            </div>

            {/* 3 Corporate Accounts Cards */}
            <div className="space-y-2.5 mb-5">
              {THREE_ACCOUNTS_LIST.map((acc) => {
                const isSelected =
                  acc.id === selectedRole ||
                  (selectedRole === 'super_admin' && acc.id === 'admin') ||
                  (selectedRole === 'dir_generale' && acc.id === 'direction') ||
                  (selectedRole === 'dir_juridique' && acc.id === 'juridique');

                const IconComponent = getRoleIcon(acc.id);
                const clearance = getClearanceLevel(acc.id);

                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => {
                      setSelectedRole(acc.id);
                      setPassword('••••••••••••');
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-500 shadow-xs ring-1 ring-blue-400/50'
                        : 'bg-[#f8fafc] hover:bg-[#f1f5f9] border-[#e2e8f0]'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-white shadow-2xs ${
                          acc.id === 'admin'
                            ? 'bg-[#0b1c30]'
                            : acc.id === 'juridique'
                            ? 'bg-purple-700'
                            : 'bg-slate-700'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[13px] font-bold text-[#0b1c30]">
                            {acc.title}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#475569] font-mono block mt-0.5">
                          {acc.email}
                        </span>
                        <p className="text-[11px] text-[#64748b] mt-1 leading-tight line-clamp-2">
                          {acc.description}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right flex flex-col items-end gap-1.5">
                      <span
                        className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border ${clearance.badge}`}
                      >
                        {clearance.level}
                      </span>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center mt-1 shadow-2xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-[#cbd5e1] mt-1" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Login Credentials Form */}
            <form onSubmit={handleFormSubmit} className="space-y-3.5 pt-2 border-t border-[#f1f5f9]">
              <div>
                <label className="block text-[11.5px] font-bold text-[#0b1c30] mb-1">
                  Identifiant Professionnel
                </label>
                <div className="relative">
                  <input
                    type="email"
                    readOnly
                    value={currentAccount.email}
                    className="w-full pl-3.5 pr-8 py-2 rounded-lg bg-[#f1f5f9] border border-[#cbd5e1] text-[#0b1c30] font-mono text-[12px] font-semibold focus:outline-none cursor-not-allowed"
                  />
                  <Key className="w-3.5 h-3.5 text-[#94a3b8] absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11.5px] font-bold text-[#0b1c30]">
                    Mot de passe de session
                  </label>
                  <span className="text-[10px] text-[#64748b] font-medium">
                    SSO Active Directory
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Saisissez votre mot de passe"
                    required
                    className="w-full pl-3.5 pr-10 py-2 rounded-lg bg-white border border-[#cbd5e1] text-[#0b1c30] text-[12px] focus:outline-none focus:ring-2 focus:ring-[#0b1c30]/20 focus:border-[#0b1c30] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#0b1c30] p-1 cursor-pointer"
                    title={showPassword ? 'Masquer' : 'Afficher'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-[11.5px] text-[#475569]">
                  <input
                    type="checkbox"
                    checked={rememberSession}
                    onChange={(e) => setRememberSession(e.target.checked)}
                    className="rounded border-[#cbd5e1] text-[#0b1c30] focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>Mémoriser cette session sur ce poste</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#0b1c30] hover:bg-[#162f4f] active:bg-[#071322] text-white font-bold text-[13px] flex items-center justify-center gap-2 shadow-md shadow-[#0b1c30]/20 transition-all cursor-pointer disabled:opacity-75"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Vérification des habilitations...</span>
                  </>
                ) : (
                  <>
                    <span>Accéder au Portail Sécurisé</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-3.5 pt-2.5 border-t border-[#f1f5f9] flex items-center justify-between text-[10.5px] text-[#64748b]">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                Session chiffrée SSL / TLS 256-bit
              </span>
              <span>Audit interne actif</span>
            </div>
          </div>

        </div>
      </main>

      {/* Corporate Footer */}
      <footer className="w-full bg-white border-t border-[#e2e8f0] px-4 sm:px-8 py-3.5 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#64748b] gap-2">
        <span>
          © 2025-2026 Cellule Analyse de Données & Marché Anti-Piratage • Direction Juridique Groupe.
        </span>
        <span className="text-[#64748b]">
          Usage confidentiel et professionnel strict • Propriété Intellectuelle & Protection des Contenus
        </span>
      </footer>
    </div>
  );
};
