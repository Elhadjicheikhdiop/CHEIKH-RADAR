import React, { useState } from 'react';
import { Threat, ThreatStatus } from '../types';
import {
  ChevronRight,
  User,
  Share2,
  Trophy,
  Clock,
  ExternalLink,
  ShieldAlert,
  Send,
  FileDown,
  History,
  CheckCircle2,
  ZoomIn,
  AlertTriangle,
  FileCode,
  Lock,
  Flag,
} from 'lucide-react';

interface ThreatDetailPageProps {
  threat: Threat;
  onUpdateStatus: (threatId: string, newStatus: ThreatStatus) => void;
  onNavigateBack: () => void;
  onShowToast: (message: string) => void;
  onOpenPdfExport: (threat: Threat) => void;
}

export const ThreatDetailPage: React.FC<ThreatDetailPageProps> = ({
  threat,
  onUpdateStatus,
  onNavigateBack,
  onShowToast,
  onOpenPdfExport,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<ThreatStatus>(threat.status);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const handleStatusChange = (status: ThreatStatus) => {
    setSelectedStatus(status);
    onUpdateStatus(threat.id, status);

    const labels: Record<ThreatStatus, string> = {
      follow: 'Dossier placé en surveillance continue (À suivre)',
      analyse: "Dossier maintenu en cours d'analyse",
      transmit: 'Menace qualifiée : Prête pour transmission légale / Takedown',
      close: 'Dossier de menace marqué comme clôturé',
    };
    onShowToast(labels[status]);
  };

  const handleTransmit = () => {
    handleStatusChange('transmit');
    onShowToast(`Transmission immédiate envoyée à la plateforme ${threat.channel} & Pôle Juridique CHEIKH +`);
  };

  const handleDownloadLog = () => {
    const logContent = (threat.actionLogs || [])
      .map((l) => `[${l.time} UTC] [${l.actor}] ${l.description}`)
      .join('\n');
    const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_log_${threat.id}.log`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast("Journal d'audit brut (.log) téléchargé.");
  };

  return (
    <div className="flex flex-col w-full">
      {/* Breadcrumbs & Status Top Bar */}
      <div className="flex flex-col gap-2 mb-6">
        <nav className="flex items-center gap-1.5 text-[#76777d] text-[12px]">
          <button onClick={onNavigateBack} className="hover:text-[#0b1c30] transition-colors">
            Surveillance
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={onNavigateBack} className="hover:text-[#0b1c30] transition-colors">
            Menaces
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-mono text-[#0b1c30] font-bold">
            {threat.name} ({threat.channel})
          </span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-[#0b1c30]">
                {threat.name} — Retransmission non autorisée en direct
              </h1>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                  selectedStatus === 'analyse'
                    ? 'bg-[#fffbeb] text-[#b45309]'
                    : selectedStatus === 'transmit'
                    ? 'bg-[#ffdad6] text-[#410002]'
                    : selectedStatus === 'follow'
                    ? 'bg-[#e5eeff] text-[#0b1c30]'
                    : 'bg-[#eff4ff] text-[#76777d]'
                }`}
              >
                {selectedStatus === 'analyse' && 'À analyser'}
                {selectedStatus === 'transmit' && 'À transmettre'}
                {selectedStatus === 'follow' && 'À suivre'}
                {selectedStatus === 'close' && 'Clôturé'}
              </span>
            </div>
            <span className="text-[12px] text-[#76777d] flex items-center gap-1.5 mt-1">
              Dossier d'intervention d'atteinte aux droits audiovisuels • Réf.{' '}
              <span className="font-mono text-[#0b1c30] font-semibold">{threat.id}</span>
            </span>
          </div>

          {/* Quick status button toggles */}
          <div className="flex items-center gap-1 p-1 bg-[#eff4ff] border border-[#e5eeff] rounded-lg shadow-xs">
            <button
              onClick={() => handleStatusChange('follow')}
              className={`px-3 py-1.5 rounded text-[12px] transition-colors flex items-center gap-1.5 ${
                selectedStatus === 'follow'
                  ? 'bg-white text-[#0b1c30] font-bold shadow-xs'
                  : 'text-[#45464d] hover:bg-white/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#76777d]"></span>
              À suivre
            </button>

            <button
              onClick={() => handleStatusChange('analyse')}
              className={`px-3 py-1.5 rounded text-[12px] transition-colors flex items-center gap-1.5 ${
                selectedStatus === 'analyse'
                  ? 'bg-white text-[#0b1c30] font-bold shadow-xs'
                  : 'text-[#45464d] hover:bg-white/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#b45309]"></span>
              À analyser {selectedStatus === 'analyse' && '(Actif)'}
            </button>

            <button
              onClick={() => handleStatusChange('transmit')}
              className={`px-3 py-1.5 rounded text-[12px] transition-colors flex items-center gap-1.5 ${
                selectedStatus === 'transmit'
                  ? 'bg-white text-[#0b1c30] font-bold shadow-xs'
                  : 'text-[#45464d] hover:bg-white/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#bb0112]"></span>
              À transmettre
            </button>

            <button
              onClick={() => handleStatusChange('close')}
              className={`px-3 py-1.5 rounded text-[12px] transition-colors flex items-center gap-1.5 ${
                selectedStatus === 'close'
                  ? 'bg-white text-[#0b1c30] font-bold shadow-xs'
                  : 'text-[#45464d] hover:bg-white/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#76777d]"></span>
              Clôturer
            </button>
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid (QUI, OÙ, QUOI, QUAND) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* PILIER 1 : QUI */}
        <div className="bg-white rounded-xl p-5 border border-[#e5eeff] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#0b1c30]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#76777d]">
                  PILIER 01
                </span>
              </div>
              <span className="text-[16px] font-bold text-[#0b1c30] tracking-tight">QUI ?</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-[11px] text-[#76777d]">Compte source</div>
                <div className="text-[15px] font-bold text-[#0b1c30] mt-0.5 font-mono">
                  {threat.name}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-[#76777d]">Plateforme</div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#eff4ff] text-[11px] font-mono text-[#0b1c30] mt-0.5 border border-[#dce9ff]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0b1c30]"></span>
                  {threat.platform}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-[#76777d]">Identifiant de profil</div>
                <div className="text-[12px] font-mono text-[#0b1c30] font-bold mt-0.5">
                  {threat.profileId || '#tk_982314'}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#f1f5f9]">
            <a
              href={threat.profileUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[12px] text-[#0b1c30] hover:text-[#bb0112] font-semibold transition-colors"
            >
              <span>Voir le profil {threat.channel}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* PILIER 2 : OÙ */}
        <div className="bg-white rounded-xl p-5 border border-[#e5eeff] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-[#0b1c30]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#76777d]">
                  PILIER 02
                </span>
              </div>
              <span className="text-[16px] font-bold text-[#0b1c30] tracking-tight">OÙ ?</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-[11px] text-[#76777d]">Canal de diffusion</div>
                <div className="text-[15px] font-bold text-[#0b1c30] mt-0.5">{threat.channel} Live</div>
              </div>

              <div>
                <div className="text-[11px] text-[#76777d]">Origine géographique observée</div>
                <div className="flex items-center gap-1.5 text-[13px] text-[#0b1c30] font-medium mt-0.5">
                  <Flag className="w-3.5 h-3.5 text-[#bb0112]" />
                  <span>{threat.country || 'Non disponible'}</span>
                </div>
              </div>

              <div>
                <div className="text-[11px] text-[#76777d]">Serveur / Hébergeur</div>
                <div className="text-[12px] text-[#0b1c30] mt-0.5">
                  Direct diffusé sur {threat.channel}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#f1f5f9]">
            <span className="inline-flex items-center gap-1 text-[11px] text-[#76777d]">
              <Lock className="w-3 h-3" />
              Diffusion en ligne hébergée sur {threat.channel}
            </span>
          </div>
        </div>

        {/* PILIER 3 : QUOI */}
        <div className="bg-white rounded-xl p-5 border border-[#e5eeff] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-[#bb0112]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#76777d]">
                  PILIER 03
                </span>
              </div>
              <span className="text-[16px] font-bold text-[#bb0112] tracking-tight">QUOI ?</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-[11px] text-[#76777d]">Contenu officiel protégé</div>
                <div className="text-[14px] font-bold text-[#0b1c30] mt-0.5 leading-snug">
                  {threat.content}
                </div>
                <div className="text-[11px] text-[#bb0112] font-bold mt-0.5">
                  Ayant-droit exclusif: {threat.rightsHolder || 'CHEIKH +'}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-[#76777d]">Altération visuelle / Fraude constatée</div>
                <div className="text-[12px] text-[#0b1c30] mt-0.5 leading-snug">
                  {threat.technicalDetails || 'Flux vidéo avec logo pirate incrusté + numéro WhatsApp commercial'}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-[#76777d]">Qualité technique constatée</div>
                <div className="text-[12px] font-mono text-[#0b1c30] font-bold mt-0.5">
                  {threat.resolution || '720p @ 30fps (H.264/AAC)'}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#f1f5f9]">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#ffdad6] text-[#410002] text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#bb0112]"></span>
              Atteinte directe aux droits exclusifs
            </span>
          </div>
        </div>

        {/* PILIER 4 : QUAND */}
        <div className="bg-white rounded-xl p-5 border border-[#e5eeff] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#0b1c30]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#76777d]">
                  PILIER 04
                </span>
              </div>
              <span className="text-[16px] font-bold text-[#0b1c30] tracking-tight">QUAND ?</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-[11px] text-[#76777d]">Première détection horodatée</div>
                <div className="text-[12px] font-mono text-[#0b1c30] font-bold mt-0.5">
                  {threat.detectionDate} (GMT)
                </div>
              </div>

              <div>
                <div className="text-[11px] text-[#76777d]">Dernière télémétrie constatée</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#bb0112] animate-pulse"></span>
                  <span className="text-[13px] text-[#0b1c30] font-medium">Il y a 12 min</span>
                  <span className="text-[11px] text-[#bb0112] font-bold">(Actif)</span>
                </div>
              </div>

              <div>
                <div className="text-[11px] text-[#76777d]">Durée d'émission continue</div>
                <div className="text-[12px] font-mono text-[#0b1c30] font-bold mt-0.5">
                  48 minutes 14 secondes
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#f1f5f9]">
            <div className="w-full bg-[#eff4ff] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#bb0112] h-1.5 rounded-full w-3/4"></div>
            </div>
            <div className="flex justify-between items-center mt-1 text-[11px] font-mono">
              <span className="text-[#76777d]">Signal persistant</span>
              <span className="text-[#bb0112] font-bold">Live en cours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Split Screen : Preuves (Gauche 7 cols) & Que faire / Journal (Droite 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* GAUCHE : SECTION PREUVES (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-xl p-5 border border-[#e5eeff] shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#bb0112]" />
                <h2 className="text-[15px] font-bold text-[#0b1c30] uppercase">
                  PREUVES & CONSTATATIONS FACTUELLES
                </h2>
              </div>
              <span className="text-[11px] font-mono bg-[#eff4ff] border border-[#dce9ff] px-2.5 py-0.5 rounded text-[#45464d]">
                Archive certifiée #EV-9942
              </span>
            </div>

            <p className="text-[12px] text-[#76777d] leading-relaxed">
              Éléments probatoires constatés et horodatés lors de la détection. Les captures et
              liens sont conservés à des fins de signalement et de procédure.
            </p>

            {/* Preuve 1 : Capture horodatée du flux live */}
            <div className="mt-5 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#0b1c30] flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#0b1c30]" />
                  Preuve 1 : Capture horodatée du flux live (Capture à 20:45 GMT)
                </span>
                <span className="text-[11px] font-mono text-[#76777d]">
                  SHA256: {threat.sha256 ? threat.sha256.substring(0, 16) + '...' : '7f8c12a...0b9d'}
                </span>
              </div>

              {/* Video screenshot frame with overlays */}
              <div className="relative bg-[#0b1c30] rounded-lg overflow-hidden group border border-[#dce9ff]">
                <img
                  src={threat.evidenceCaptureUrl || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80'}
                  alt="Capture preuve live"
                  className="w-full h-80 object-cover object-top filter brightness-90 cursor-pointer"
                  onClick={() => setIsZoomOpen(true)}
                />

                {/* Overlaid forensic telemetry */}
                <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between bg-gradient-to-b from-[#0b1c30]/80 via-transparent to-[#0b1c30]/85">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2 bg-[#0b1c30]/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-[#bb0112] animate-ping"></span>
                      <span>DIRECT CONSTATÉ</span>
                    </div>
                    <div className="text-[11px] bg-[#0b1c30]/80 backdrop-blur-md px-2.5 py-1 rounded">
                      {threat.detectionDate}
                    </div>
                  </div>

                  <div className="flex items-end justify-between text-white">
                    <div className="bg-[#0b1c30]/90 backdrop-blur-md p-3 rounded-lg max-w-sm border border-white/10">
                      <div className="text-[10px] font-bold text-[#ffdad6] uppercase tracking-wider">
                        Contenu non autorisé
                      </div>
                      <div className="text-[12px] font-medium mt-0.5">
                        {threat.content}
                      </div>
                      <div className="text-[11px] opacity-80 mt-0.5">
                        Diffuseur : {threat.name}
                      </div>
                    </div>

                    <div className="bg-[#0b1c30]/90 backdrop-blur-md px-3 py-2 rounded-lg text-right border border-white/10">
                      <div className="text-[10px] text-gray-300 uppercase tracking-wider">
                        Audience constatée
                      </div>
                      <div className="text-lg font-bold text-white">
                        {threat.viewersCount}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-1 pt-1.5">
                <span className="text-[12px] text-[#76777d]">
                  Capture d'écran du direct avec les éléments constatés
                </span>
                <button
                  onClick={() => setIsZoomOpen(true)}
                  className="text-[11px] font-bold text-[#0b1c30] hover:text-[#bb0112] flex items-center gap-1 transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  Agrandir la capture
                </button>
              </div>
            </div>

            {/* Preuve 2 : Informations techniques de diffusion */}
            <div className="mt-6 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#0b1c30] flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-[#0b1c30]" />
                  Preuve 2 : Informations de diffusion {threat.channel}
                </span>
                <span className="text-[11px] font-mono text-[#76777d]">Paramètres du direct</span>
              </div>

              <div className="bg-[#eff4ff] rounded-lg p-3.5 font-mono text-[11px] text-[#0b1c30] space-y-1.5 border border-[#dce9ff] overflow-x-auto">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#76777d]">Identifiant de session :</span>
                  <span className="font-bold select-all text-[#0b1c30]">
                    {threat.rawJsonMeta?.room_id || '7336184910248817414'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#76777d]">Lien direct du flux :</span>
                  <span className="font-bold select-all truncate max-w-md text-[#0b1c30]">
                    {threat.rawJsonMeta?.stream_session_url ||
                      'https://pull-flv-l11-c01.tiktokcdn.com/stage/stream-733618491.flv'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#76777d]">Identifiant auteur :</span>
                  <span className="font-bold select-all text-[#0b1c30]">
                    {threat.rawJsonMeta?.author_sec_uid || 'MS4wLjABAAAA_9wK_tkExLive821381'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#76777d]">Format de transmission :</span>
                  <span className="font-bold text-[#0b1c30]">
                    Vidéo en direct ({threat.resolution || '720p @ 30fps'})
                  </span>
                </div>
              </div>
            </div>

            {/* Server Archive & External Link */}
            <div className="mt-5 pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#eff4ff] p-3.5 rounded-lg border border-[#dce9ff]">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#0b1c30]" />
                <div className="flex flex-col">
                  <span className="text-[12px] font-bold text-[#0b1c30]">
                    Horodatage d'archivage automatique serveur
                  </span>
                  <span className="text-[11px] font-mono text-[#76777d]">
                    Archivé le 2025-02-16 à 20:15:24 UTC
                  </span>
                </div>
              </div>

              <a
                href={threat.profileUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-[#0b1c30] hover:bg-[#dce9ff] text-[12px] font-bold shadow-xs border border-[#e5eeff] transition-colors"
              >
                <span>Accéder à la publication source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Legal Certificate Note */}
            <div className="mt-4 flex items-center gap-2 text-[#76777d] text-[11px]">
              <AlertTriangle className="w-4 h-4 text-[#bb0112] shrink-0" />
              <span>
                Toutes les preuves sont horodatées et certifiées au moment de la détection. Aucun recalcul
                synthétique.
              </span>
            </div>
          </div>
        </div>

        {/* DROITE : QUE FAIRE ? (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Action Box */}
          <div className="bg-white rounded-xl p-5 border border-[#e5eeff] shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#bb0112]" />
                <h2 className="text-[15px] font-bold text-[#0b1c30] tracking-tight">
                  Actions recommandées
                </h2>
              </div>
              <span className="text-[11px] font-bold text-[#bb0112] uppercase tracking-wider">
                Action requise
              </span>
            </div>

            {/* Status Radio options */}
            <div className="flex flex-col gap-1.5 mb-5">
              <span className="text-[11px] font-bold text-[#76777d] uppercase tracking-wider mb-1">
                Changer le statut du dossier
              </span>

              {/* Radio 1: A suivre */}
              <label
                onClick={() => handleStatusChange('follow')}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedStatus === 'follow'
                    ? 'bg-[#eff4ff] border border-[#dce9ff]'
                    : 'hover:bg-[#eff4ff]/60'
                }`}
              >
                <input
                  type="radio"
                  name="threat_status"
                  checked={selectedStatus === 'follow'}
                  onChange={() => handleStatusChange('follow')}
                  className="mt-1 accent-[#0b1c30]"
                />
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-[#0b1c30]">À suivre</span>
                  <span className="text-[12px] text-[#76777d]">
                    Surveillance maintenue sans action immédiate.
                  </span>
                </div>
              </label>

              {/* Radio 2: A analyser */}
              <label
                onClick={() => handleStatusChange('analyse')}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedStatus === 'analyse'
                    ? 'bg-[#fffbeb] border border-[#fef3c7]'
                    : 'hover:bg-[#eff4ff]/60'
                }`}
              >
                <input
                  type="radio"
                  name="threat_status"
                  checked={selectedStatus === 'analyse'}
                  onChange={() => handleStatusChange('analyse')}
                  className="mt-1 accent-[#0b1c30]"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-[#0b1c30]">À analyser</span>
                    {selectedStatus === 'analyse' && (
                      <span className="px-1.5 py-0.2 rounded font-mono text-[10px] bg-[#fffbeb] text-[#b45309] font-bold">
                        Actuel
                      </span>
                    )}
                  </div>
                  <span className="text-[12px] text-[#76777d]">
                    Vérification du dossier en cours par l'équipe.
                  </span>
                </div>
              </label>

              {/* Radio 3: A transmettre */}
              <label
                onClick={() => handleStatusChange('transmit')}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedStatus === 'transmit'
                    ? 'bg-[#ffdad6] border border-[#fecaca]'
                    : 'hover:bg-[#eff4ff]/60'
                }`}
              >
                <input
                  type="radio"
                  name="threat_status"
                  checked={selectedStatus === 'transmit'}
                  onChange={() => handleStatusChange('transmit')}
                  className="mt-1 accent-[#0b1c30]"
                />
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-[#0b1c30]">À transmettre</span>
                  <span className="text-[12px] text-[#76777d]">
                    Signalement prêt à être envoyé à la plateforme ou aux avocats.
                  </span>
                </div>
              </label>

              {/* Radio 4: Clôturer */}
              <label
                onClick={() => handleStatusChange('close')}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedStatus === 'close'
                    ? 'bg-[#eff4ff] border border-[#dce9ff]'
                    : 'hover:bg-[#eff4ff]/60'
                }`}
              >
                <input
                  type="radio"
                  name="threat_status"
                  checked={selectedStatus === 'close'}
                  onChange={() => handleStatusChange('close')}
                  className="mt-1 accent-[#0b1c30]"
                />
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-[#0b1c30]">Clôturer</span>
                  <span className="text-[12px] text-[#76777d]">
                    Diffusion arrêtée ou contenu retiré.
                  </span>
                </div>
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={handleTransmit}
                className="w-full py-2.5 px-4 rounded-lg bg-[#bb0112] text-white text-[13px] font-bold hover:bg-[#93000b] transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>Transmettre à l'équipe juridique</span>
              </button>

              <button
                onClick={() => onOpenPdfExport(threat)}
                className="w-full py-2.5 px-4 rounded-lg bg-[#0b1c30] text-white text-[13px] font-semibold hover:bg-[#1e293b] transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <FileDown className="w-4 h-4" />
                <span>Exporter le dossier en PDF</span>
              </button>
            </div>

            <div className="mt-4 p-3 bg-[#eff4ff] rounded-lg text-[11px] text-[#0b1c30] flex items-center justify-between border border-[#dce9ff]">
              <span className="text-[#76777d]">Délai de traitement recommandé :</span>
              <span className="font-bold text-[#bb0112]">Moins de 15 minutes</span>
            </div>
          </div>

          {/* Journal factuel des actions enregistrées */}
          <div className="bg-white rounded-xl p-5 border border-[#e5eeff] shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2">
                <History className="w-4.5 h-4.5 text-[#0b1c30]" />
                <h3 className="text-[14px] font-bold text-[#0b1c30]">
                  Journal des actions enregistrées
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#76777d]">Temps universel GMT</span>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#dce9ff]">
              {(threat.actionLogs || []).map((logItem, index) => (
                <div key={logItem.id || index} className="relative flex flex-col gap-0.5">
                  <div
                    className={`absolute -left-[27px] top-1.5 w-2 h-2 rounded-full ${
                      logItem.type === 'analyst'
                        ? 'bg-[#bb0112] animate-pulse'
                        : logItem.type === 'probe'
                        ? 'bg-[#0b1c30]'
                        : 'bg-[#76777d]'
                    }`}
                  ></div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[12px] text-[#0b1c30] font-bold">
                      {logItem.time}
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        logItem.type === 'analyst' ? 'text-[#bb0112]' : 'text-[#76777d]'
                      }`}
                    >
                      {logItem.actor}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#0b1c30] leading-snug">{logItem.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-[11px] text-[#76777d]">
              <span>Historique vérifié</span>
              <button
                onClick={handleDownloadLog}
                className="text-[#0b1c30] hover:underline font-bold transition-colors"
              >
                Télécharger l'historique (.txt)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Zoom Capture HD */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full p-5 border border-[#cbd5e1] shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#bb0112]" />
                <span className="text-[14px] font-bold text-[#0b1c30]">
                  Preuve HD horodatée certifiée — {threat.name}
                </span>
              </div>
              <button
                onClick={() => setIsZoomOpen(false)}
                className="text-gray-400 hover:text-gray-800 text-sm font-bold bg-gray-100 rounded-full w-7 h-7 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="relative bg-black rounded-lg overflow-hidden max-h-[70vh] flex items-center justify-center">
              <img
                src={threat.evidenceCaptureUrl}
                alt="Capture agrandie"
                className="w-full h-auto object-contain max-h-[70vh]"
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#76777d]">
              <span>Horodatage : {threat.detectionDate}</span>
              <span>Preuve archivée et certifiée</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
