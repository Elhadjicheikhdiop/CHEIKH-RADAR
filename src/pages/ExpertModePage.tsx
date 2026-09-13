import React, { useState } from 'react';
import {
  Radar,
  Radio,
  Sliders,
  Database,
  Terminal,
  Settings,
  RefreshCw,
  Play,
  CheckCircle,
  AlertTriangle,
  FileCode,
  Shield,
  Download,
  Plus,
  Server,
  Activity,
  Cpu,
} from 'lucide-react';
import { mockExpertSources, mockExpertRules, mockSystemLogs } from '../data/mockData';

type ExpertSubTab = 'sources' | 'collectes' | 'donnees' | 'regles' | 'logs' | 'parametres';

interface ExpertModePageProps {
  onShowToast: (msg: string) => void;
  initialTab?: ExpertSubTab;
}

export const ExpertModePage: React.FC<ExpertModePageProps> = ({ onShowToast, initialTab = 'sources' }) => {
  const [activeTab, setActiveTab] = useState<ExpertSubTab>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [sources, setSources] = useState(mockExpertSources);
  const [rules, setRules] = useState(mockExpertRules);
  const [isScanning, setIsScanning] = useState(false);

  // Scan collections mock
  const [scans, setScans] = useState([
    {
      id: 'SCAN-8842',
      target: 'TikTok Live Stream Probe #04',
      startedAt: '2025-02-16 20:40:00 UTC',
      duration: '4m 12s',
      streamsAnalyzed: 1420,
      threatsDetected: 14,
      status: 'Terminé',
    },
    {
      id: 'SCAN-8841',
      target: 'APK Mirror & Telegram IPTV Channels',
      startedAt: '2025-02-16 19:30:00 UTC',
      duration: '12m 45s',
      streamsAnalyzed: 840,
      threatsDetected: 3,
      status: 'Terminé',
    },
    {
      id: 'SCAN-8840',
      target: 'Web Crawl HLS Playlists .m3u8',
      startedAt: '2025-02-16 18:00:00 UTC',
      duration: '8m 20s',
      streamsAnalyzed: 3120,
      threatsDetected: 8,
      status: 'Terminé',
    },
  ]);

  const toggleSource = (id: string) => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
    onShowToast('Statut de la source de collecte mis à jour.');
  };

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
    onShowToast('Règle de détection modifiée.');
  };

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const newScan = {
        id: `SCAN-${Math.floor(8850 + Math.random() * 50)}`,
        target: 'Scan Global Multi-Plateformes (Live)',
        startedAt: new Date().toUTCString(),
        duration: '1m 15s',
        streamsAnalyzed: 940,
        threatsDetected: 2,
        status: 'Terminé',
      };
      setScans([newScan, ...scans]);
      onShowToast('Collecte instantanée terminée : 2 nouveaux flux identifiés.');
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-6 border-b border-[#e5eeff]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Radar className="w-5 h-5 text-[#bb0112]" />
            <h1 className="text-2xl font-bold tracking-tight text-[#0b1c30]">Mode Expert</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#e5eeff] text-[#0b1c30]">
              CONSOLE ANALYSTE IP
            </span>
          </div>
          <p className="text-[13px] text-[#45464d]">
            Gestion approfondie des sondes de captation, algorithmes de reconnaissance et journaux
          </p>
        </div>

        {/* Node Telemetry badge */}
        <div className="flex items-center gap-3 bg-white p-2 px-3 rounded-lg border border-[#e5eeff] shadow-xs text-[12px]">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#0b1c30]" />
            <span className="text-[#76777d]">Nœud :</span>
            <span className="font-mono font-bold text-[#0b1c30]">AF-WEST-01</span>
          </div>
          <div className="h-3 w-px bg-gray-200"></div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#bb0112]" />
            <span className="text-[#76777d]">CPU :</span>
            <span className="font-mono font-bold text-[#0b1c30]">18.4%</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs (6 modules requested) */}
      <div className="flex items-center gap-1 border-b border-[#e5eeff] pb-3 mb-6 overflow-x-auto">
        {[
          { id: 'sources' as ExpertSubTab, label: 'Sources', icon: Radio },
          { id: 'collectes' as ExpertSubTab, label: 'Collectes', icon: RefreshCw },
          { id: 'donnees' as ExpertSubTab, label: 'Données', icon: Database },
          { id: 'regles' as ExpertSubTab, label: 'Règles', icon: Sliders },
          { id: 'logs' as ExpertSubTab, label: 'Logs', icon: Terminal },
          { id: 'parametres' as ExpertSubTab, label: 'Paramètres', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all shrink-0 ${
                isActive
                  ? 'bg-[#0b1c30] text-white shadow-xs'
                  : 'text-[#45464d] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#bb0112]' : 'text-[#76777d]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. SOURCES */}
      {activeTab === 'sources' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-bold text-[#0b1c30]">
                Gestion des Sources Surveillées
              </h2>
              <p className="text-[12px] text-[#76777d]">
                Réseau de capteurs, connecteurs API plateformes et sondes CDN
              </p>
            </div>
            <button
              onClick={() => onShowToast('Formulaire de nouvelle source de veille affiché.')}
              className="px-3.5 py-1.5 rounded-lg bg-[#0b1c30] text-white text-[12px] font-bold flex items-center gap-1.5 shadow-xs hover:bg-[#1e293b]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter une source</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-[#e5eeff] shadow-xs overflow-hidden">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-[#eff4ff] text-[#76777d] uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Source & Plateforme</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Fréquence de scan</th>
                  <th className="py-3 px-4">Latence</th>
                  <th className="py-3 px-4">Dernier passage</th>
                  <th className="py-3 px-4 text-right">État</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {sources.map((src) => (
                  <tr key={src.id} className="hover:bg-[#eff4ff]/50">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            src.active ? 'bg-[#bb0112]' : 'bg-gray-300'
                          }`}
                        ></span>
                        <div className="flex flex-col">
                          <span className="font-bold text-[#0b1c30]">{src.name}</span>
                          <span className="font-mono text-[11px] text-[#76777d]">{src.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#45464d]">{src.type}</td>
                    <td className="py-3.5 px-4 font-mono">{src.interval}</td>
                    <td className="py-3.5 px-4 font-mono font-medium text-[#0b1c30]">{src.latency}</td>
                    <td className="py-3.5 px-4 font-mono text-[#76777d]">{src.lastRun}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => toggleSource(src.id)}
                        className={`px-3 py-1 rounded text-[11px] font-bold transition-colors ${
                          src.active
                            ? 'bg-[#ffdad6] text-[#410002] hover:bg-[#fecaca]'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {src.active ? 'Actif' : 'Désactivé'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. COLLECTES */}
      {activeTab === 'collectes' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-bold text-[#0b1c30]">
                Historique des Scans & Collectes
              </h2>
              <p className="text-[12px] text-[#76777d]">
                Sessions d'écoute automatisées, captures de paquets et télémétries
              </p>
            </div>
            <button
              onClick={handleRunScan}
              disabled={isScanning}
              className="px-4 py-2 rounded-lg bg-[#bb0112] hover:bg-[#93000b] text-white text-[12px] font-bold flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isScanning ? 'Scan en cours...' : 'Lancer un scan immédiat'}</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-[#e5eeff] shadow-xs overflow-hidden">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-[#eff4ff] text-[#76777d] uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Session Scan</th>
                  <th className="py-3 px-4">Cible de la sonde</th>
                  <th className="py-3 px-4">Début (UTC)</th>
                  <th className="py-3 px-4">Durée</th>
                  <th className="py-3 px-4">Flux analysés</th>
                  <th className="py-3 px-4">Menaces détectées</th>
                  <th className="py-3 px-4 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {scans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-[#eff4ff]/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0b1c30]">{scan.id}</td>
                    <td className="py-3.5 px-4 text-[#0b1c30] font-medium">{scan.target}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#76777d]">{scan.startedAt}</td>
                    <td className="py-3.5 px-4 font-mono">{scan.duration}</td>
                    <td className="py-3.5 px-4 font-mono font-bold">{scan.streamsAnalyzed}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#bb0112]">
                      {scan.threatsDetected}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#dce9ff] text-[#0b1c30]">
                        {scan.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. DONNÉES */}
      {activeTab === 'donnees' && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-[16px] font-bold text-[#0b1c30]">
              Exploration des Données Brutes
            </h2>
            <p className="text-[12px] text-[#76777d]">
              Inspecteur de métadonnées de flux RTMP, HLS, manifestes m3u8 et payloads déchiffrés
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#0b1c30] text-gray-200 rounded-xl p-5 font-mono text-[12px] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-white">
                <span className="font-bold flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#bb0112]" />
                  <span>Payload Télémétrique Brut (Dernier extrait capté)</span>
                </span>
                <span className="text-[11px] text-gray-400">Node: AF-WEST-01</span>
              </div>

              <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-400 bg-black/40 p-4 rounded-lg">
{`{
  "timestamp": "2025-02-16T20:45:11.042Z",
  "threat_ref": "INC-202502-8841-TK",
  "channel": "TikTok",
  "source_account": "@exampletv",
  "stream_ingest": {
    "rtmp_url": "rtmp://push.tiktokcdn.com/stage/stream-733618491",
    "video_codec": "H.264 / AVC (High@L3.1)",
    "bitrate_kbps": 2400,
    "fps": 30.0,
    "audio_channels": 2,
    "ocr_matches": [
      { "keyword": "CHEIKH + FOOT", "confidence": 0.984 },
      { "keyword": "DIRECT HD", "confidence": 0.961 },
      { "keyword": "+221 77 412", "confidence": 0.991 }
    ]
  },
  "geo_fingerprint": {
    "asn": 37196,
    "isp": "Orange Senegal",
    "country_iso": "SN",
    "client_ip_hash": "e98b042d3c90e22f7b8813a110cbff01"
  }
}`}
              </pre>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-gray-400 text-[11px]">Validé par empreinte SHA256</span>
                <button
                  onClick={() => onShowToast('Données brutes exportées au format JSON.')}
                  className="px-3 py-1 bg-white text-[#0b1c30] text-[11px] font-bold rounded hover:bg-gray-100 flex items-center gap-1.5"
                >
                  <Download className="w-3 h-3" />
                  <span>Exporter le JSON brut</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-[#e5eeff] shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-[14px] font-bold text-[#0b1c30] mb-3">Index des enregistrements</h3>
                <div className="space-y-3 text-[12px]">
                  <div className="p-3 rounded-lg bg-[#eff4ff] border border-[#dce9ff]">
                    <span className="text-[#76777d] block text-[11px]">Total enregistrements bruts</span>
                    <span className="font-mono font-bold text-lg text-[#0b1c30]">842,109</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#eff4ff] border border-[#dce9ff]">
                    <span className="text-[#76777d] block text-[11px]">Taille stockage S3 scellé</span>
                    <span className="font-mono font-bold text-lg text-[#0b1c30]">412.8 Go</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#eff4ff] border border-[#dce9ff]">
                    <span className="text-[#76777d] block text-[11px]">Rétention légale</span>
                    <span className="font-bold text-[#0b1c30]">365 jours (Norme Huissier)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onShowToast('Archive mensuelle en préparation pour archivage sécurisé.')}
                className="w-full mt-4 py-2 bg-[#0b1c30] text-white text-[12px] font-bold rounded-lg hover:bg-[#1e293b] flex items-center justify-center gap-1.5"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Créer archive de preuves</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. RÈGLES */}
      {activeTab === 'regles' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-bold text-[#0b1c30]">
                Configuration des Règles de Détection
              </h2>
              <p className="text-[12px] text-[#76777d]">
                Seuils de reconnaissance visuelle, empreintes audio et expressions régulières
              </p>
            </div>
            <button
              onClick={() => onShowToast('Module de création de règle OCR / YARA ouvert.')}
              className="px-3.5 py-1.5 rounded-lg bg-[#0b1c30] text-white text-[12px] font-bold flex items-center gap-1.5 shadow-xs hover:bg-[#1e293b]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nouvelle règle</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-[#e5eeff] shadow-xs overflow-hidden">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-[#eff4ff] text-[#76777d] uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Règle & Intitulé</th>
                  <th className="py-3 px-4">Type de reconnaissance</th>
                  <th className="py-3 px-4">Seuil de confiance</th>
                  <th className="py-3 px-4">Action automatique</th>
                  <th className="py-3 px-4 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {rules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-[#eff4ff]/50">
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0b1c30]">{rule.name}</span>
                        <span className="font-mono text-[11px] text-[#76777d]">{rule.id}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#45464d]">{rule.type}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0b1c30]">
                      {rule.threshold}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#eff4ff] text-[#0b1c30] border border-[#dce9ff]">
                        {rule.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => toggleRule(rule.id)}
                        className={`px-3 py-1 rounded text-[11px] font-bold transition-colors ${
                          rule.enabled
                            ? 'bg-[#dce9ff] text-[#0b1c30] hover:bg-[#cbd5e1]'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {rule.enabled ? 'Active' : 'Inhibée'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. LOGS */}
      {activeTab === 'logs' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-bold text-[#0b1c30]">
                Journaux Système & Alertes (Live Stream)
              </h2>
              <p className="text-[12px] text-[#76777d]">
                Événements horodatés émis en continu par les sondes AF-WEST
              </p>
            </div>
            <button
              onClick={() => onShowToast('Export complet des logs bruts .txt téléchargé.')}
              className="px-3.5 py-1.5 rounded-lg bg-[#0b1c30] text-white text-[12px] font-bold flex items-center gap-1.5 shadow-xs hover:bg-[#1e293b]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger les logs complets</span>
            </button>
          </div>

          <div className="bg-[#0b1c30] rounded-xl p-5 font-mono text-[12px] text-gray-200 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-white">
              <span className="flex items-center gap-2 font-bold">
                <Terminal className="w-4 h-4 text-[#bb0112]" />
                <span>/var/log/panaf_cheikhplus/sensor_events.log</span>
              </span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Flux actif</span>
              </span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {mockSystemLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-[11px] hover:bg-white/5 p-1 rounded">
                  <span className="text-gray-400 shrink-0 font-mono">{log.timestamp}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                      log.level === 'CRITICAL'
                        ? 'bg-[#bb0112] text-white'
                        : log.level === 'WARN'
                        ? 'bg-amber-500 text-black'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    {log.level}
                  </span>
                  <span className="text-gray-300 font-medium shrink-0">[{log.module}]</span>
                  <span className="text-gray-100 leading-snug">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. PARAMÈTRES */}
      {activeTab === 'parametres' && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-[16px] font-bold text-[#0b1c30]">Paramètres Généraux & Techniques</h2>
            <p className="text-[12px] text-[#76777d]">
              Configuration globale de l'instance PANAF CHEIKH + Intelligence Unit
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-5 border border-[#e5eeff] shadow-xs space-y-4">
              <h3 className="text-[14px] font-bold text-[#0b1c30]">Connectivité & Serveur NTP</h3>

              <div>
                <label className="text-[11px] font-bold uppercase text-[#76777d] block mb-1">
                  Nœud d'infrastructure primaire
                </label>
                <input
                  defaultValue="AF-WEST-01 (Dakar Datacenter #02)"
                  disabled
                  className="w-full p-2.5 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-[13px] font-mono text-[#0b1c30]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-[#76777d] block mb-1">
                  Serveur d'horodatage légal certifié (NTP)
                </label>
                <input
                  defaultValue="time.google.com, pool.ntp.org (Strate 1)"
                  disabled
                  className="w-full p-2.5 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-[13px] font-mono text-[#0b1c30]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-[#76777d] block mb-1">
                  SLA d'intervention d'urgence (Minutes)
                </label>
                <input
                  type="number"
                  defaultValue="15"
                  className="w-full p-2.5 rounded-lg border border-[#e5eeff] text-[13px] font-mono text-[#0b1c30]"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-[#e5eeff] shadow-xs space-y-4">
              <h3 className="text-[14px] font-bold text-[#0b1c30]">Webhooks & Canaux d'Alerte Directs</h3>

              <div>
                <label className="text-[11px] font-bold uppercase text-[#76777d] block mb-1">
                  Email du Pôle Anti-Piraterie CHEIKH +
                </label>
                <input
                  defaultValue="anti-piracy-alerts@cheikhplus-afrique.com"
                  className="w-full p-2.5 rounded-lg border border-[#e5eeff] text-[13px] text-[#0b1c30]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-[#76777d] block mb-1">
                  Canal d'alerte instantanée (Telegram / Slack)
                </label>
                <input
                  defaultValue="https://api.telegram.org/bot6128.../sendAlert"
                  className="w-full p-2.5 rounded-lg border border-[#e5eeff] text-[13px] font-mono text-[#0b1c30]"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onShowToast('Paramètres système enregistrés avec succès.')}
                  className="w-full py-2.5 bg-[#bb0112] text-white text-[13px] font-bold rounded-lg hover:bg-[#93000b] transition-colors shadow-xs"
                >
                  Enregistrer les paramètres
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
