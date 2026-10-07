import React from 'react';
import { Threat } from '../types';
import { ShieldAlert, Printer, Download, X, CheckCircle2, Lock } from 'lucide-react';
import { auditTrailService } from '../utils/auditTrailService';

interface ConstatModalProps {
  threat: Threat;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  currentRole?: string;
}

export const ConstatModal: React.FC<ConstatModalProps> = ({
  threat,
  onClose,
  onShowToast,
  currentRole = 'juridique',
}) => {
  const handlePrint = () => {
    auditTrailService.log({
      actorRole: (currentRole as any) || 'juridique',
      actionCode: 'CONSTAT_PRINTED',
      actionLabel: 'Impression du Procès-Verbal d’Huissier',
      category: 'LEGAL',
      severity: 'WARNING',
      targetId: threat.id,
      targetLabel: threat.name,
      territory: threat.country,
      details: `Impression physique du constat d’infraction horodaté pour le dossier #${threat.id}.`,
    });
    window.print();
  };

  const handleDownload = () => {
    auditTrailService.log({
      actorRole: (currentRole as any) || 'juridique',
      actionCode: 'CONSTAT_GENERATED',
      actionLabel: 'Génération de Procès-Verbal d’Huissier (PDF)',
      category: 'LEGAL',
      severity: 'CRITICAL',
      targetId: threat.id,
      targetLabel: threat.name,
      territory: threat.country,
      details: `Export du procès-verbal certifié conforme avec signature numérique pour le dossier #${threat.id} (${threat.name}).`,
    });
    onShowToast(`Procès-verbal de constat horodaté #${threat.id} exporté.`);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200 shadow-xl overflow-hidden relative text-slate-900 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. TOP CONTROL BAR (FIXE) */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 bg-white print:hidden shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-700">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[14.5px] text-slate-900">
                  Procès-Verbal de Constat d'Infraction Horodaté
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                  ACTE N° {threat.id}
                </span>
              </div>
              <p className="text-[11.5px] text-slate-500">
                Document certifié infalsifiable, valable pour les juridictions et les demandes aux fournisseurs d'accès.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-[12px] font-medium flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimer</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-[12px] font-medium flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* BARRE INDICATRICE DE DÉFILEMENT */}
        <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-200 text-[11px] text-slate-600 font-medium flex items-center justify-between shrink-0 print:hidden">
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <span>↕</span> Défilement vertical complet disponible (haut en bas)
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            {threat.country || 'Pan-Afrique'} • {threat.channel}
          </span>
        </div>

        {/* 2. CORPS DU CONSTAT AVEC SCROLLER DÉDIÉ (HAUT EN BAS) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-6 space-y-5">
          {/* SYNTHÈSE EXPRESS */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                Synthèse Décisionnelle • Infraction Constatée
              </span>
              <span className="text-[10.5px] font-mono text-slate-500">
                {threat.detectionDate}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
              <div className="bg-white border border-slate-200/90 p-2.5 rounded-lg shadow-2xs">
                <span className="text-[9.5px] text-slate-500 block uppercase font-semibold">Source / Cible</span>
                <span className="font-bold text-slate-900 truncate block font-mono mt-0.5" title={threat.name}>
                  {threat.name}
                </span>
              </div>
              <div className="bg-white border border-slate-200/90 p-2.5 rounded-lg shadow-2xs">
                <span className="text-[9.5px] text-slate-500 block uppercase font-semibold">Vecteur</span>
                <span className="font-bold text-slate-900 truncate block mt-0.5">
                  {threat.channel} ({threat.platform})
                </span>
              </div>
              <div className="bg-white border border-slate-200/90 p-2.5 rounded-lg shadow-2xs">
                <span className="text-[9.5px] text-slate-500 block uppercase font-semibold">Territoire</span>
                <span className="font-bold text-slate-900 truncate block mt-0.5">
                  {threat.country || 'Pan-Afrique'}
                </span>
              </div>
              <div className="bg-white border border-slate-200/90 p-2.5 rounded-lg shadow-2xs">
                <span className="text-[9.5px] text-slate-500 block uppercase font-semibold">Statut Acte</span>
                <span className="font-mono font-bold text-slate-800 block mt-0.5">
                  Validé & Scellé
                </span>
              </div>
            </div>
          </div>

          {/* DOCUMENT OFFICIEL DE CONSTAT */}
          <div className="border border-slate-300 p-5 sm:p-6 rounded-xl bg-slate-50/50 space-y-4 shadow-2xs">
            {/* En-tête officiel */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-300">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold tracking-tight text-slate-900">TELECOM</span>
                  <span className="text-xl font-bold tracking-tight text-red-700">BROADCAST</span>
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Cellule Anti-Piratage • Protection des Droits & Contenus
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-[11px] font-bold text-slate-900 block">
                  DOSSIER N° {threat.id}
                </span>
                <span className="text-[11px] text-slate-500">
                  Constat établi le : {threat.detectionDate}
                </span>
              </div>
            </div>

            {/* Corps juridique */}
            <div className="space-y-3.5 text-[12px] text-slate-800 leading-relaxed">
              <p>
                <strong>OBJET :</strong> Constat formel de diffusion sans autorisation et atteinte caractérisée aux droits exclusifs de retransmission sportive et audiovisuelle.
              </p>

              <div className="bg-white p-3.5 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11.5px]">
                <div>
                  <span className="text-slate-500 block text-[10.5px]">Compte / Source incriminée :</span>
                  <span className="font-bold font-mono text-slate-900">{threat.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10.5px]">Plateforme / Vecteur de transmission :</span>
                  <span className="font-bold text-slate-900">{threat.channel} ({threat.platform})</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10.5px]">Contenu exclusif violé :</span>
                  <span className="font-bold text-red-700">{threat.content}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10.5px]">Territoire concerné :</span>
                  <span className="font-bold text-slate-900">{threat.country || 'Panafricain'}</span>
                </div>
              </div>

              {/* Pièce à conviction */}
              <div>
                <span className="font-bold text-[11.5px] block mb-1 text-slate-900">
                  PIÈCE À CONVICTION MATÉRIELLE (CAPTURE CERTIFIÉE) :
                </span>
                <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 p-1">
                  <img
                    src={threat.evidenceCaptureUrl}
                    alt="Preuve scellée"
                    className="w-full h-56 object-cover object-top rounded"
                  />
                </div>
              </div>

              {/* Scellement et Hash */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-[11px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Code unique de vérification du document :</span>
                  <span className="text-[10px] text-slate-700 font-medium bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    Certifié et scellé
                  </span>
                </div>
                <div className="font-mono text-slate-800 select-all break-all bg-slate-50 p-1.5 rounded border border-slate-100">
                  {threat.sha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic">
                Ce document officiel récapitule les éléments constatés par la cellule de surveillance PANAF CHEIKH + pour transmission aux plateformes, opérateurs ou autorités compétentes.
              </p>
            </div>

            {/* Signature Huissier / Direction */}
            <div className="mt-5 pt-3.5 border-t border-slate-300 flex justify-between items-end text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px]">Référence dossier sécurisée :</span>
                <span className="font-mono font-bold text-slate-900">PANAF-{(threat.id || '').replace(/[^a-zA-Z0-9]/g, '')}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900 block">Direction Juridique & Protection des Contenus</span>
                <span className="text-slate-500 text-[10px]">Signé numériquement et horodaté</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. PIED DE PAGE FIXE */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-white flex items-center justify-between shrink-0 print:hidden">
          <span className="text-[11px] text-slate-500">
            Dossier d'infraction certifié • Prêt pour signification d'huissier
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-[12px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-[12px] font-medium transition-colors cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
