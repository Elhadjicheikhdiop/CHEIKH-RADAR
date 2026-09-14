export type UserRole =
  | 'admin'
  | 'direction'
  | 'juridique'
  // Compatibilité rétroactive pour les clés précédentes
  | 'super_admin'
  | 'dir_generale'
  | 'dir_juridique'
  | 'dir_analyse_marche'
  | 'dir_technique'
  | 'dir_sports'
  | 'dir_commerciale';

export interface UserAccount {
  id: UserRole;
  title: string;
  department: string;
  holderName: string;
  email: string;
  canEdit: boolean; // false = lecture seule stricte
  canImport: boolean; // false = pas d'import ni enrichissement
  canExport: boolean;
  canExecuteActions: boolean;
  badgeLabel: string;
  badgeColor: 'blue' | 'purple' | 'emerald' | 'amber' | 'slate';
  description: string;
  allowedPages: string[]; // Liste stricte des pages autorisées
  accessiblePerimeterSummary: string;
}

export const USER_ACCOUNTS_CONFIG: Record<'admin' | 'direction' | 'juridique', UserAccount> = {
  admin: {
    id: 'admin',
    title: 'Compte Administrateur (Admin)',
    department: 'Direction des Systèmes d’Information & Cellule Anti-Piratage',
    holderName: 'Administrateur Référent Broadcast',
    email: 'admin.broadcast@telecom-broadcast.com',
    canEdit: true,
    canImport: true,
    canExport: true,
    canExecuteActions: true,
    badgeLabel: 'Contrôle Total & Import',
    badgeColor: 'blue',
    description: 'Accès maître exclusif : droit d’importation de données Excel, enrichissement SEMrush, modification des statuts de flux et paramétrage.',
    allowedPages: [
      'overview',
      'threats',
      'threat-detail',
      'territory-detail',
      'applications',
      'accounts',
      'sites-forums',
      'market',
      'data-import',
      'expert',
    ],
    accessiblePerimeterSummary: 'Accès intégral à l’ensemble des modules, importation de données Excel et modifications.',
  },
  direction: {
    id: 'direction',
    title: 'Compte Direction (Lecture Seule Globale)',
    department: 'Comité de Direction & Direction Générale Groupe',
    holderName: 'Direction Générale Groupe',
    email: 'direction.generale@telecom-broadcast.com',
    canEdit: false,
    canImport: false,
    canExport: true,
    canExecuteActions: false,
    badgeLabel: 'Lecture Seule Globale',
    badgeColor: 'slate',
    description: 'Accès étendu à tous les modules d’analyse et de veille en lecture seule stricte : Vue d’ensemble, Menaces, Applications, Réseaux, Sites & Intelligence Marché.',
    allowedPages: [
      'overview',
      'threats',
      'threat-detail',
      'territory-detail',
      'applications',
      'accounts',
      'sites-forums',
      'market',
    ],
    accessiblePerimeterSummary: 'Consultation complète de tous les écrans d’analyse et d’intelligence marché (Lecture seule stricte, pas d’import).',
  },
  juridique: {
    id: 'juridique',
    title: 'Compte Juridique (Lecture Seule Juridique)',
    department: 'Direction des Affaires Juridiques & Propriété Intellectuelle',
    holderName: 'Direction Juridique & Contentieux',
    email: 'direction.juridique@telecom-broadcast.com',
    canEdit: false,
    canImport: false,
    canExport: true,
    canExecuteActions: false,
    badgeLabel: 'Lecture Seule Juridique',
    badgeColor: 'slate',
    description: 'Accès aux dossiers contentieux, preuves techniques, signalements pirates et export des constats d’huissier PDF horodatés. Aucun accès à l’Intelligence Marché ni à l’Import.',
    allowedPages: [
      'overview',
      'threats',
      'threat-detail',
      'applications',
      'accounts',
      'sites-forums',
    ],
    accessiblePerimeterSummary: 'Consultation des menaces, preuves techniques, applications et sites/forums pirates avec génération des constats d’huissier (Pas d’accès Intelligence Marché ni Import).',
  },
};

export const THREE_ACCOUNTS_LIST: UserAccount[] = [
  USER_ACCOUNTS_CONFIG.admin,
  USER_ACCOUNTS_CONFIG.direction,
  USER_ACCOUNTS_CONFIG.juridique,
];

export function getUserAccount(role?: UserRole | string): UserAccount {
  if (!role) return USER_ACCOUNTS_CONFIG.admin;

  if (role === 'admin' || role === 'super_admin' || role === 'dir_analyse_marche') {
    return USER_ACCOUNTS_CONFIG.admin;
  }
  if (role === 'direction' || role === 'dir_generale' || role === 'dir_technique' || role === 'dir_sports' || role === 'dir_commerciale') {
    return USER_ACCOUNTS_CONFIG.direction;
  }
  if (role === 'juridique' || role === 'dir_juridique') {
    return USER_ACCOUNTS_CONFIG.juridique;
  }

  if (role in USER_ACCOUNTS_CONFIG) {
    return USER_ACCOUNTS_CONFIG[role as keyof typeof USER_ACCOUNTS_CONFIG];
  }

  return USER_ACCOUNTS_CONFIG.admin;
}

export function isPageAllowedForRole(role: UserRole | string, page: string): boolean {
  const account = getUserAccount(role);
  return account.allowedPages.includes(page);
}


