import * as XLSX from 'xlsx';

export interface SemrushEnrichedData {
  domain: string;
  monthlyTraffic: string;
  monthlyVisitsRaw: number;
  organicKeywordsCount: number;
  domainAuthority: number;
  semrushRank: number;
  africaTrafficShare: string;
  topKeyword: string;
  searchVolume: string;
  hostingCountry: string;
  serverIp?: string;
  threatLevel: 'Critique' | 'Élevé' | 'Moyen';
  topKeywordsList: Array<{
    keyword: string;
    position: number;
    searchVolume: number;
    cpc: string;
    trafficShare: string;
  }>;
  backlinksCount?: number;
  referringDomains?: number;
  source: 'semrush_live' | 'simulation';
  enrichedAt: string;
}

export interface SemrushStatusResponse {
  configured: boolean;
  mode: 'live' | 'simulation';
  provider: string;
  description: string;
}

export interface SemrushKeywordItem {
  phrase: string;
  volume: number;
  cpc: string;
  competition: string;
}

export const semrushService = {
  // Vérifier le statut de l'API SEMrush
  async getStatus(): Promise<SemrushStatusResponse> {
    try {
      const res = await fetch('/api/semrush/status');
      if (!res.ok) {
        return {
          configured: false,
          mode: 'simulation',
          provider: 'SEMrush Analytics v3',
          description: 'Serveur proxy en mode heuristique.',
        };
      }
      return await res.json();
    } catch {
      return {
        configured: false,
        mode: 'simulation',
        provider: 'SEMrush Analytics v3',
        description: 'Connexion locale / heuristique',
      };
    }
  },

  // Enrichir un domaine spécifique
  async enrichDomain(domain: string): Promise<SemrushEnrichedData> {
    const res = await fetch('/api/semrush/enrich-domain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain }),
    });
    if (!res.ok) {
      throw new Error(`Erreur API SEMrush (${res.status})`);
    }
    const json = await res.json();
    return json.data;
  },

  // Enrichir plusieurs domaines en une seule requête
  async batchEnrich(domains: string[]): Promise<SemrushEnrichedData[]> {
    const res = await fetch('/api/semrush/batch-enrich', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domains }),
    });
    if (!res.ok) {
      throw new Error(`Erreur batch SEMrush (${res.status})`);
    }
    const json = await res.json();
    return json.results;
  },

  // Rechercher des mots-clés de piratage via SEMrush
  async getPiracyKeywords(keyword: string): Promise<{ source: string; keywords: SemrushKeywordItem[] }> {
    const res = await fetch('/api/semrush/keywords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword }),
    });
    if (!res.ok) {
      throw new Error('Erreur recherche mots-clés SEMrush');
    }
    return await res.json();
  },

  // Exporter les données enrichies SEMrush au format Excel (.xlsx)
  exportToExcel(data: SemrushEnrichedData[], fileName = 'ENRICHISSEMENT_SEMRUSH_DOMAINS_PIRATES.xlsx'): void {
    const wb = XLSX.utils.book_new();

    // 1. Feuille principale : Vue d'ensemble des domaines
    const mainRows = data.map((item, idx) => ({
      'N°': idx + 1,
      'Domaine Analysé': item.domain,
      'Trafic Mensuel Estimé': item.monthlyTraffic,
      'Visites Mensuelles (Brut)': item.monthlyVisitsRaw,
      'Score d\'Autorité (Authority Score)': item.domainAuthority,
      'Rang SEMrush Mondial': item.semrushRank,
      'Nombre de Mots-Clés Organiques': item.organicKeywordsCount,
      'Part Trafic Afrique Subsaharienne': item.africaTrafficShare,
      'Top Mot-Clé de Recherche': item.topKeyword,
      'Volume de Recherche Mensuel': item.searchVolume,
      'Niveau de Gravité / Menace': item.threatLevel,
      'Hébergeur & Localisation ASN': item.hostingCountry,
      'Source des Métriques': item.source === 'semrush_live' ? 'API SEMrush Officielle (Live)' : 'Modèle Analytique Estimé (Simulation)',
      'Horodatage Analyse': new Date(item.enrichedAt).toLocaleString('fr-FR'),
    }));

    const wsMain = XLSX.utils.json_to_sheet(mainRows);
    wsMain['!cols'] = [
      { wch: 5 },
      { wch: 28 },
      { wch: 22 },
      { wch: 24 },
      { wch: 22 },
      { wch: 22 },
      { wch: 24 },
      { wch: 24 },
      { wch: 30 },
      { wch: 22 },
      { wch: 18 },
      { wch: 30 },
      { wch: 28 },
      { wch: 20 },
    ];
    XLSX.utils.book_append_sheet(wb, wsMain, 'Domaines Enrichis SEMrush');

    // 2. Feuille détaillée : Détail des mots-clés par domaine
    const kwRows: any[] = [];
    data.forEach((d) => {
      d.topKeywordsList?.forEach((k) => {
        kwRows.push({
          'Domaine Cible': d.domain,
          'Mot-Clé Pirate Détecté': k.keyword,
          'Position SEMrush Google': k.position,
          'Volume Mensuel de Recherche': k.searchVolume,
          'Coût par Clic (CPC Est.)': k.cpc,
          'Part du Trafic Capté': k.trafficShare,
        });
      });
    });

    if (kwRows.length > 0) {
      const wsKw = XLSX.utils.json_to_sheet(kwRows);
      wsKw['!cols'] = [
        { wch: 26 },
        { wch: 36 },
        { wch: 18 },
        { wch: 24 },
        { wch: 16 },
        { wch: 18 },
      ];
      XLSX.utils.book_append_sheet(wb, wsKw, 'Mots-Clés & Requêtes Pirates');
    }

    XLSX.writeFile(wb, fileName);
  },
};
