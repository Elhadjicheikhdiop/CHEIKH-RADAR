import React from 'react';
import {
  Shield,
  Lock,
  LogOut,
  Building,
  Scale,
} from 'lucide-react';
import { UserRole, getUserAccount } from '../utils/userAccounts';

interface AccountSwitcherProps {
  currentRole?: UserRole;
  onSelectRole?: (role: UserRole) => void;
  onLogout?: () => void;
}

export const AccountSwitcher: React.FC<AccountSwitcherProps> = ({
  currentRole = 'admin',
  onLogout,
}) => {
  const currentAccount = getUserAccount(currentRole);

  const getRoleIcon = () => {
    if (currentAccount.id === 'admin') return Shield;
    if (currentAccount.id === 'juridique') return Scale;
    return Building;
  };

  const IconComponent = getRoleIcon();

  return (
    <div className="flex items-center gap-2">
      {/* Badge du profil utilisateur actif (sans liste déroulante) */}
      <div
        className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-[#f8fafc] border border-[#cbd5e1] text-[#0b1c30] shadow-2xs"
        title={`${currentAccount.title} - ${currentAccount.accessiblePerimeterSummary}`}
      >
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-[12px] text-white shrink-0 ${
            currentAccount.canEdit
              ? 'bg-[#0b1c30]'
              : currentAccount.id === 'juridique'
              ? 'bg-[#1e293b]'
              : 'bg-[#334155]'
          }`}
        >
          <IconComponent className="w-3.5 h-3.5" />
        </div>

        <div className="text-left hidden sm:block max-w-[140px] md:max-w-[190px]">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-[12px] font-bold text-[#0b1c30] truncate block">
              {currentAccount.holderName}
            </span>
          </div>
          <span className="text-[10px] text-[#64748b] truncate block mt-0.5 font-medium">
            {currentAccount.title}
          </span>
        </div>

        {/* Badge lecture seule ou administration */}
        <span
          className={`hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${
            currentAccount.canEdit
              ? 'bg-slate-100 text-[#0b1c30] border-slate-300'
              : 'bg-slate-100 text-slate-700 border-slate-300'
          }`}
        >
          {currentAccount.canEdit ? (
            <span>Admin</span>
          ) : (
            <>
              <Lock className="w-2.5 h-2.5 text-slate-500" />
              <span>Lecture Seule</span>
            </>
          )}
        </span>
      </div>

      {/* Bouton de Déconnexion direct pour changer de compte en dehors de l'application */}
      {onLogout && (
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 hover:text-red-700 text-[11px] font-bold transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
          title="Se déconnecter et retourner à la page de sélection des comptes"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Déconnexion</span>
        </button>
      )}
    </div>
  );
};

