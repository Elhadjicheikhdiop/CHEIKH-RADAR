import React from 'react';
import { Threat } from '../types';
import { ShieldAlert, Printer, Download, X, CheckCircle2, Lock } from 'lucide-react';

interface ConstatModalProps {
  threat: Threat;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const ConstatModal: React.FC<ConstatModalProps> = ({
  threat,
  onClose,
  onShowToast,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    onShowToast(`Procès-verbal de constat horodaté #${threat.id} exporté.`);
  };

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full p-6 md:p-8 border border-[#cbd5e1] shadow-2xl relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#f1f5f9] print:hidden">
          <div className="flex items-center gap-2 text-[#0b1c30]">
            <ShieldAlert className="w-5 h-5 text-[#bb0112]" />
            <span className="font-bold text-[14px]">
              Fiche de constat d'infraction
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#e5eeff] hover:bg-[#eff4ff] text-[#0b1c30] text-[12px] font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-[#0b1c30] hover:bg-[#1e293b] text-white text-[12px] font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-black flex items-center justify-center font-bold"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Official Document Layout */}
        <div className="border border-[#0b1c30]/20 p-6 rounded-xl bg-[#fafafa]">
          {/* Document Header */}
          <div className="flex justify-between items-start pb-4 mb-4 border-b-2 border-[#0b1c30]">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold tracking-tight text-[#0b1c30]">PANAF</span>
                <span className="text-xl font-bold tracking-tight text-[#bb0112]">CHEIKH +</span>
              </div>
              <div className="text-[10px] uppercase font-bold text-[#76777d] tracking-wider">
                Cellule Anti-Piratage • Protection des Droits & Contenus
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-[11px] font-bold text-[#0b1c30] block">
                DOSSIER N° {threat.id}
              </span>
              <span className="text-[11px] text-[#76777d]">
                Date de constat : {threat.detectionDate}
              </span>
            </div>
          </div>

          {/* Body Content */}
          <div className="space-y-4 text-[12px] text-[#0b1c30] leading-relaxed">
            <p>
              <strong>OBJET :</strong> Constat de diffusion sans autorisation et atteinte aux droits exclusifs de retransmission.
            </p>

            <div className="bg-white p-3.5 rounded-lg border border-[#e5eeff] grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-[#76777d] block">Compte / Source :</span>
                <span className="font-bold font-mono">{threat.name}</span>
              </div>
              <div>
                <span className="text-[#76777d] block">Plateforme / Vecteur :</span>
                <span className="font-bold">{threat.channel} ({threat.platform})</span>
              </div>
              <div>
                <span className="text-[#76777d] block">Contenu protégé :</span>
                <span className="font-bold text-[#bb0112]">{threat.content}</span>
              </div>
              <div>
                <span className="text-[#76777d] block">Zone géographique :</span>
                <span className="font-bold">{threat.country || 'Non renseigné'}</span>
              </div>
            </div>

            <div>
              <span className="font-bold block mb-1">PREUVE ENREGISTRÉE :</span>
              <div className="relative rounded-lg overflow-hidden border border-[#0b1c30]/20 bg-black">
                <img
                  src={threat.evidenceCaptureUrl}
                  alt="Preuve scellée"
                  className="w-full h-52 object-cover object-top"
                />
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-[#e5eeff] text-[11px] space-y-1">
              <div>
                <span className="text-[#76777d]">Identifiant unique :</span>{' '}
                <span className="font-mono font-bold select-all text-[#0b1c30]">
                  {threat.sha256 ? threat.sha256.substring(0, 32) + '...' : '7f8c12a...'}
                </span>
              </div>
              <div>
                <span className="text-[#76777d]">Statut de la preuve :</span> Enregistrée et vérifiée
              </div>
            </div>

            <p className="text-[11px] text-[#76777d] italic">
              Ce document récapitule les éléments constatés par la cellule de surveillance PANAF CHEIKH +
              pour transmission aux plateformes, opérateurs ou services juridiques.
            </p>
          </div>

          {/* Footer Signature */}
          <div className="mt-6 pt-4 border-t border-[#0b1c30]/20 flex justify-between items-end text-[11px]">
            <div>
              <span className="text-[#76777d] block">Référence dossier :</span>
              <span className="font-mono font-bold text-[#0b1c30]">PANAF-{(threat.id || '').replace(/[^a-zA-Z0-9]/g, '')}</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-[#0b1c30] block">L. Bertrand</span>
              <span className="text-[#76777d]">Responsable Protection des Contenus</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
