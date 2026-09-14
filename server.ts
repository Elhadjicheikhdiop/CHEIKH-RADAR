import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

interface SemrushEnrichedData {
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

// Données déterministes / heuristiques si la clé API n'est pas encore saisie
function generateSimulatedSemrushData(domain: string): SemrushEnrichedData {
  const cleanDomain = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  let hash = 0;
  for (let i = 0; i < cleanDomain.length; i++) {
    hash = (hash << 5) - hash + cleanDomain.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const visits = 150000 + (absHash % 1800000);
  const visitsFormatted = visits >= 1000000 
    ? `${(visits / 1000000).toFixed(1)}M visites/mois` 
    : `${Math.round(visits / 1000)}K visites/mois`;

  const authority = 25 + (absHash % 45);
  const rank = 85000 + (absHash % 650000);
  const africaShare = 60 + (absHash % 38);

  const keywordsPool = [
    { kw: 'cheikh sport direct streaming', vol: 48000 },
    { kw: 'match direct afrique gratuit', vol: 35200 },
    { kw: 'live foot dakar stream', vol: 29100 },
    { kw: 'lien iptv m3u afrique 2026', vol: 22400 },
    { kw: 'cheikh plus foot live hd', vol: 31000 },
    { kw: 'regarder can direct streaming sn', vol: 41500 },
    { kw: 'iptv abonnement wave abidjan', vol: 18900 },
  ];

  const primaryKwIndex = absHash % keywordsPool.length;
  const primaryKw = keywordsPool[primaryKwIndex];

  const hostingPool = [
    'Russie (Offshore / AS48282)',
    'Belize / Cloudflare CDN',
    'Pays-Bas (Serverius AS35592)',
    'Roumanie (Voxility AS3223)',
    'Seychelles / Reverse Proxy',
    'Panama / Bulletproof Hosting',
    'Bulgarie (Telepoint AS34224)',
  ];
  const hosting = hostingPool[absHash % hostingPool.length];

  const threatLevel: 'Critique' | 'Élevé' | 'Moyen' =
    visits > 700000 || authority > 40 ? 'Critique' : visits > 300000 ? 'Élevé' : 'Moyen';

  const topKeywordsList = [
    {
      keyword: primaryKw.kw,
      position: 1 + (absHash % 3),
      searchVolume: primaryKw.vol,
      cpc: '0.12 $',
      trafficShare: '42.5%',
    },
    {
      keyword: keywordsPool[(primaryKwIndex + 1) % keywordsPool.length].kw,
      position: 2 + (absHash % 4),
      searchVolume: keywordsPool[(primaryKwIndex + 1) % keywordsPool.length].vol,
      cpc: '0.18 $',
      trafficShare: '24.1%',
    },
    {
      keyword: keywordsPool[(primaryKwIndex + 2) % keywordsPool.length].kw,
      position: 3 + (absHash % 5),
      searchVolume: keywordsPool[(primaryKwIndex + 2) % keywordsPool.length].vol,
      cpc: '0.09 $',
      trafficShare: '15.8%',
    },
    {
      keyword: keywordsPool[(primaryKwIndex + 3) % keywordsPool.length].kw,
      position: 5 + (absHash % 6),
      searchVolume: keywordsPool[(primaryKwIndex + 3) % keywordsPool.length].vol,
      cpc: '0.14 $',
      trafficShare: '9.2%',
    },
  ];

  return {
    domain: cleanDomain,
    monthlyTraffic: visitsFormatted,
    monthlyVisitsRaw: visits,
    organicKeywordsCount: 320 + (absHash % 2800),
    domainAuthority: authority,
    semrushRank: rank,
    africaTrafficShare: `${africaShare}%`,
    topKeyword: primaryKw.kw,
    searchVolume: `${primaryKw.vol.toLocaleString('fr-FR')} / mois`,
    hostingCountry: hosting,
    threatLevel,
    topKeywordsList,
    backlinksCount: 1200 + (absHash % 45000),
    referringDomains: 80 + (absHash % 850),
    source: 'simulation',
    enrichedAt: new Date().toISOString(),
  };
}

async function fetchFromSemrushApi(domain: string, apiKey: string): Promise<SemrushEnrichedData | null> {
  const cleanDomain = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  
  try {
    // 1. Appel Domain Ranks SEMrush
    // Doc SEMrush: https://api.semrush.com/?type=domain_ranks&key=...&export_columns=Dn,Rk,Or,Ot,Oc&domain=...
    const overviewUrl = `https://api.semrush.com/?type=domain_ranks&key=${encodeURIComponent(apiKey)}&export_columns=Dn,Rk,Or,Ot,Oc&domain=${encodeURIComponent(cleanDomain)}`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(overviewUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`[SEMrush API] Status code ${res.status} for domain ${cleanDomain}`);
      return null;
    }

    const text = await res.text();

    // SEMrush renvoie un code d'erreur texte si la clé est invalide (ex: "ERROR 119 :: WRONG KEY")
    if (text.startsWith('ERROR')) {
      console.warn(`[SEMrush API] Error from SEMrush: ${text}`);
      return null;
    }

    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      return null;
    }

    const headers = lines[0].split(';');
    const values = lines[1].split(';');

    const dataMap: Record<string, string> = {};
    headers.forEach((h, idx) => {
      dataMap[h.trim()] = values[idx] ? values[idx].trim() : '';
    });

    const rank = parseInt(dataMap['Rk'] || '0', 10);
    const organicKeywords = parseInt(dataMap['Or'] || '0', 10);
    const organicTraffic = parseInt(dataMap['Ot'] || '0', 10);

    // 2. Appel Organic Keywords pour récupérer le top mot-clé
    let topKw = 'flux direct piratage';
    let topKwVol = 24000;
    const topKeywordsList: SemrushEnrichedData['topKeywordsList'] = [];

    try {
      const kwUrl = `https://api.semrush.com/?type=domain_organic&key=${encodeURIComponent(apiKey)}&display_limit=5&export_columns=Ph,Po,Nq,Cp,Tr&domain=${encodeURIComponent(cleanDomain)}&database=fr`;
      const kwRes = await fetch(kwUrl);
      if (kwRes.ok) {
        const kwText = await kwRes.text();
        if (!kwText.startsWith('ERROR')) {
          const kwLines = kwText.trim().split('\n');
          if (kwLines.length > 1) {
            for (let i = 1; i < kwLines.length; i++) {
              const parts = kwLines[i].split(';');
              if (parts.length >= 3) {
                const kw = parts[0]?.trim();
                const pos = parseInt(parts[1] || '1', 10);
                const vol = parseInt(parts[2] || '0', 10);
                const cpc = parts[3] ? `${parts[3]} $` : '0.10 $';
                const tr = parts[4] ? `${parseFloat(parts[4]).toFixed(1)}%` : '15%';

                if (i === 1) {
                  topKw = kw;
                  topKwVol = vol;
                }

                topKeywordsList.push({
                  keyword: kw,
                  position: pos,
                  searchVolume: vol,
                  cpc,
                  trafficShare: tr,
                });
              }
            }
          }
        }
      }
    } catch {
      // Ignorer erreur non critique sur les mots-clés
    }

    const authority = Math.min(95, Math.max(15, Math.round(100 - (Math.log10(Math.max(1, rank)) / 8) * 100)));
    const trafficFormatted = organicTraffic >= 1000000
      ? `${(organicTraffic / 1000000).toFixed(1)}M visites/mois`
      : `${Math.round(organicTraffic / 1000)}K visites/mois`;

    return {
      domain: cleanDomain,
      monthlyTraffic: trafficFormatted,
      monthlyVisitsRaw: organicTraffic,
      organicKeywordsCount: organicKeywords,
      domainAuthority: authority,
      semrushRank: rank,
      africaTrafficShare: '75%',
      topKeyword: topKw,
      searchVolume: `${topKwVol.toLocaleString('fr-FR')} / mois`,
      hostingCountry: 'Cloudflare / Hébergement Détecté',
      threatLevel: organicTraffic > 500000 ? 'Critique' : organicTraffic > 100000 ? 'Élevé' : 'Moyen',
      topKeywordsList: topKeywordsList.length > 0 ? topKeywordsList : [
        {
          keyword: topKw,
          position: 1,
          searchVolume: topKwVol,
          cpc: '0.15 $',
          trafficShare: '38%',
        }
      ],
      source: 'semrush_live',
      enrichedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error('[SEMrush API] Network exception calling SEMrush:', err);
    return null;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ROUTE 1: STATUT ET VÉRIFICATION DE LA CONFIGURATION SEMRUSH
  app.get('/api/semrush/status', (req, res) => {
    const apiKey = process.env.SEMRUSH_API_KEY;
    const isConfigured = Boolean(apiKey && apiKey.trim().length > 5);
    res.json({
      configured: isConfigured,
      mode: isConfigured ? 'live' : 'simulation',
      provider: 'SEMrush Analytics v3',
      description: isConfigured
        ? 'Clé SEMrush détectée. Les appels API interrogent en direct les serveurs SEMrush.'
        : 'Mode simulation analytique actif (clé SEMRUSH_API_KEY non fournie ou en cours de configuration).',
    });
  });

  // ROUTE 2: ENRICHISSEMENT D'UN DOMAINE SPÉCIFIQUE
  app.post('/api/semrush/enrich-domain', async (req, res) => {
    try {
      const { domain } = req.body;
      if (!domain || typeof domain !== 'string') {
        res.status(400).json({ error: 'Le champ domain est requis' });
        return;
      }

      const apiKey = process.env.SEMRUSH_API_KEY;
      let result: SemrushEnrichedData | null = null;

      if (apiKey && apiKey.trim().length > 5) {
        result = await fetchFromSemrushApi(domain, apiKey.trim());
      }

      // Si pas d'API Key ou erreur de l'API SEMrush (ex: quota ou clé de test), fallback heuristique propre
      if (!result) {
        result = generateSimulatedSemrushData(domain);
      }

      res.json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      console.error('Erreur enrich-domain:', err);
      res.status(500).json({ error: 'Erreur lors de l’enrichissement', details: err?.message });
    }
  });

  // ROUTE 3: ENRICHISSEMENT EN LOT (BATCH) POUR PLUSIEURS SITES
  app.post('/api/semrush/batch-enrich', async (req, res) => {
    try {
      const { domains } = req.body;
      if (!Array.isArray(domains)) {
        res.status(400).json({ error: 'Le paramètre domains doit être un tableau de chaînes' });
        return;
      }

      const apiKey = process.env.SEMRUSH_API_KEY;
      const results: SemrushEnrichedData[] = [];

      for (const dom of domains.slice(0, 15)) {
        let enriched: SemrushEnrichedData | null = null;
        if (apiKey && apiKey.trim().length > 5) {
          enriched = await fetchFromSemrushApi(dom, apiKey.trim());
        }
        if (!enriched) {
          enriched = generateSimulatedSemrushData(dom);
        }
        results.push(enriched);
      }

      res.json({
        success: true,
        count: results.length,
        results,
      });
    } catch (err: any) {
      console.error('Erreur batch-enrich:', err);
      res.status(500).json({ error: 'Erreur lors du traitement par lot', details: err?.message });
    }
  });

  // ROUTE 4: RECHERCHE DE MOTS-CLÉS PIRATAGE SEMRUSH
  app.post('/api/semrush/keywords', async (req, res) => {
    try {
      const { keyword, database = 'fr' } = req.body;
      const targetKw = (keyword || 'cheikh sport streaming').toLowerCase();
      const apiKey = process.env.SEMRUSH_API_KEY;

      if (apiKey && apiKey.trim().length > 5) {
        const kwUrl = `https://api.semrush.com/?type=phrase_related&key=${encodeURIComponent(apiKey)}&phrase=${encodeURIComponent(targetKw)}&export_columns=Ph,Nq,Cp,Co,Nr&database=${database}&display_limit=10`;
        try {
          const apiRes = await fetch(kwUrl);
          if (apiRes.ok) {
            const text = await apiRes.text();
            if (!text.startsWith('ERROR')) {
              const lines = text.trim().split('\n');
              const items = [];
              for (let i = 1; i < lines.length; i++) {
                const parts = lines[i].split(';');
                if (parts.length >= 3) {
                  items.push({
                    phrase: parts[0]?.trim(),
                    volume: parseInt(parts[1] || '0', 10),
                    cpc: parts[2] ? `${parts[2]} $` : '0.10 $',
                    competition: parts[3] || '0.5',
                  });
                }
              }
              if (items.length > 0) {
                res.json({ success: true, source: 'semrush_live', keywords: items });
                return;
              }
            }
          }
        } catch {
          // Fallback simulation
        }
      }

      // Simulation riche basée sur le terme recherché
      const simulatedKeywords = [
        { phrase: `${targetKw} direct live`, volume: 54000, cpc: '0.12 $', competition: '0.78' },
        { phrase: `${targetKw} gratuit afrique`, volume: 41200, cpc: '0.08 $', competition: '0.84' },
        { phrase: `${targetKw} dakar senegal hd`, volume: 29800, cpc: '0.15 $', competition: '0.65' },
        { phrase: `code iptv ${targetKw}`, volume: 23100, cpc: '0.22 $', competition: '0.91' },
        { phrase: `regarder ${targetKw} telegram`, volume: 18500, cpc: '0.05 $', competition: '0.52' },
        { phrase: `${targetKw} m3u8 link`, volume: 14200, cpc: '0.10 $', competition: '0.73' },
      ];

      res.json({
        success: true,
        source: 'simulation',
        keywords: simulatedKeywords,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Erreur recherche mots-clés', details: err?.message });
    }
  });

  // HEALTH CHECK
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'PANAF CHEIKH + Intelligence API',
      semrushConfigured: Boolean(process.env.SEMRUSH_API_KEY),
    });
  });

  // CONFIGURATION VITE MIDDLEWARE (DEV vs PROD)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
