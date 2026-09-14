export type ThreatStatus = 'follow' | 'analyse' | 'transmit' | 'close';

export type ThreatCategory = 'social' | 'web' | 'iptv' | 'forums' | 'all';

export interface Threat {
  id: string;
  name: string;
  target: string;
  channel: string;
  platform: string;
  category: 'social' | 'web' | 'iptv' | 'forums';
  country?: string;
  countryCode?: string;
  detectionDate: string;
  detectionTimestamp: string;
  status: ThreatStatus;
  content: string;
  rightsHolder?: string;
  iconType: 'videocam' | 'language' | 'android' | 'share' | 'forum' | 'smart_display';
  severity: 'critical' | 'high' | 'medium' | 'low';
  viewersCount?: string;
  profileId?: string;
  profileUrl?: string;
  streamUrl?: string;
  resolution?: string;
  technicalDetails?: string;
  evidenceCaptureUrl?: string;
  sha256?: string;
  rawJsonMeta?: Record<string, string>;
  actionLogs?: ActionLogItem[];
}

export interface ActionLogItem {
  id: string;
  time: string;
  actor: string;
  description: string;
  type: 'system' | 'storage' | 'analyst' | 'probe';
}

export interface AppItem {
  id: string;
  name: string;
  version?: string;
  source: string;
  detectionDate: string;
  link?: string;
  captureUrl: string;
  packageId: string;
  sha256: string;
  status: ThreatStatus;
  country: string;
  affectedStreams: string[];
  downloadsCount: string;
}

export interface AccountItem {
  id: string;
  name: string;
  platform: string;
  accountUrl: string;
  captureUrl: string;
  detectionDate: string;
  linkedPosts: LinkedPost[];
  country: string;
  status: ThreatStatus;
  followers: string;
  estimatedAudience: string;
  monetizationMethod: string;
}

export interface LinkedPost {
  id: string;
  date: string;
  title: string;
  viewers: string;
  url: string;
  status: 'active' | 'ended' | 'removed';
}

export interface SiteForumItem {
  id: string;
  siteDomain: string;
  forumName?: string;
  subjectOrPage: string;
  link: string;
  captureUrl: string;
  detectionDate: string;
  type: 'site' | 'forum';
  country: string;
  status: ThreatStatus;
  hostingAsn: string;
  ipAddress: string;
  protocol: string;
  keySharedCount?: number;
}

export interface ReportData {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  period: string;
  generatedDate: string;
  totalThreats: number;
  newThreats: number;
  closedThreats: number;
  activeLiveStreams: number;
  topInfringedContent: { title: string; count: number; percentage: number }[];
  actorsIdentified: { name: string; platform: string; occurrences: number; status: string }[];
  keyProofsCount: number;
  countryDistribution: { country: string; code: string; count: number; percentage: number }[];
}

export interface ExpertSource {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'error';
  lastPing: string;
  itemsProcessed: number;
  latency: string;
  reliability: string;
  active?: boolean;
  interval?: string;
  lastRun?: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'CRIT' | 'CRITICAL' | 'DEBUG';
  probe: string;
  event: string;
  details: string;
  module?: string;
  message?: string;
}

export interface ExpertRule {
  id: string;
  name: string;
  type: string;
  threshold: string;
  action: string;
  enabled: boolean;
}

export interface ReportConfig {
  period: '24h' | '7d' | '30d' | 'custom';
  type: 'synthese' | 'complet' | 'juridique';
  format: 'pdf' | 'excel';
  includeScreenshots: boolean;
  includeForensics: boolean;
  includeActionLogs: boolean;
}

export type DataImportCategory =
  | 'threats'
  | 'applications'
  | 'accounts'
  | 'sites'
  | 'google_forms';

export interface EvidenceItem {
  id: string;
  fileName: string;
  fileSize: string;
  fileUrl: string;
  uploadedAt: string;
  type: 'stream_capture' | 'payment_receipt' | 'field_photo' | 'legal_bailiff' | 'app_screenshot';
  title: string;
  relatedEntityName?: string;
  country?: string;
  notes?: string;
}

export interface ImportHistoryRecord {
  id: string;
  fileName: string;
  category: DataImportCategory;
  rowsCount: number;
  importedAt: string;
  status: 'success' | 'warning' | 'error';
  details: string;
}
