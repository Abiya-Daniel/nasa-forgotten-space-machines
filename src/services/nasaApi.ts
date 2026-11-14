import * as THREE from 'three';
import { NasaImageSearchItem, PlanetaryBody } from '../types/equipment';

/**
 * NASA Image and Video Library API
 * Official endpoint: https://images-api.nasa.gov/search
 * Public domain NASA media catalog (no API key required).
 */
export async function searchNasaMedia(
  query: string,
  mediaType: 'image' | 'video' | 'audio' = 'image',
  page = 1,
  pageSize = 18
): Promise<{ items: NasaImageSearchItem[]; totalHits: number }> {
  const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(
    query.trim() || 'Apollo lunar module'
  )}&media_type=${mediaType}&page=${page}&page_size=${pageSize}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`NASA Media Library returned HTTP ${response.status}`);
  }

  const json = await response.json();
  const collection = json?.collection;
  const rawItems = Array.isArray(collection?.items) ? collection.items : [];

  const items: NasaImageSearchItem[] = rawItems
    .map((entry: Record<string, unknown>) => {
      const dataArr = Array.isArray(entry.data) ? entry.data : [];
      const meta = (dataArr[0] || {}) as Record<string, unknown>;
      const links = Array.isArray(entry.links) ? entry.links : [];
      const preview = links.find(
        (l: Record<string, unknown>) => l.rel === 'preview' && typeof l.href === 'string'
      ) as Record<string, unknown> | undefined;

      const nasaId = String(meta.nasa_id || '');
      if (!nasaId) return null;
      if (mediaType !== 'audio' && !preview?.href) return null;

      return {
        nasaId,
        title: String(meta.title || nasaId),
        description: String(meta.description || 'NASA archival media asset.'),
        center: String(meta.center || 'NASA'),
        dateCreated: String(meta.date_created || '').slice(0, 10),
        keywords: Array.isArray(meta.keywords)
          ? meta.keywords.map((k) => String(k)).slice(0, 5)
          : [],
        previewUrl: preview?.href ? String(preview.href) : '',
        detailsUrl: `https://images.nasa.gov/details-${encodeURIComponent(nasaId)}`,
        mediaType,
      };
    })
    .filter((item: NasaImageSearchItem | null): item is NasaImageSearchItem => item !== null);

  const totalHits = Number(collection?.metadata?.total_hits || items.length);
  return { items, totalHits };
}

export async function searchNasaImages(
  query: string,
  page = 1
): Promise<{ items: NasaImageSearchItem[]; totalHits: number }> {
  return searchNasaMedia(query, 'image', page, 18);
}

/**
 * Resolves a playable MP4/MP3/M4A/WAV asset stream from NASA's official asset manifest.
 */
export async function fetchNasaMediaAssetUrl(
  nasaId: string,
  kind: 'video' | 'audio'
): Promise<string | null> {
  const res = await fetch(
    `https://images-api.nasa.gov/asset/${encodeURIComponent(nasaId)}`
  );
  if (!res.ok) return null;
  const json = await res.json();
  const items: { href?: string }[] = Array.isArray(json?.collection?.items)
    ? json.collection.items
    : [];

  const hrefs = items
    .map((i) => i.href)
    .filter((h): h is string => typeof h === 'string');

  if (kind === 'video') {
    return (
      hrefs.find((h) => h.endsWith('~medium.mp4')) ||
      hrefs.find((h) => h.endsWith('~small.mp4')) ||
      hrefs.find((h) => h.endsWith('.mp4')) ||
      null
    );
  }
  return (
    hrefs.find((h) => h.endsWith('.mp3')) ||
    hrefs.find((h) => h.endsWith('.m4a')) ||
    hrefs.find((h) => h.endsWith('.wav')) ||
    null
  );
}

/**
 * NASA Solar System Treks WMTS Configuration
 * Official endpoint: https://trek.nasa.gov/tiles/
 */
export type TrekLayerKey = 'moon-lro' | 'mars-viking' | 'mars-mola';

export interface TrekLayerConfig {
  key: TrekLayerKey;
  body: PlanetaryBody;
  label: string;
  datasetName: string;
  publisher: string;
  baseUrl: string;
  maxZoom: number;
  ext: 'jpg' | 'png';
  sourceUrl: string;
}

export const TREK_LAYERS: Record<TrekLayerKey, TrekLayerConfig> = {
  'moon-lro': {
    key: 'moon-lro',
    body: 'moon',
    label: 'LRO WAC Global Mosaic',
    datasetName: 'LRO_WAC_Mosaic_Global_303ppd_v02',
    publisher: 'NASA Moon Trek / Arizona State University / GSFC',
    baseUrl:
      'https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm',
    maxZoom: 4,
    ext: 'jpg',
    sourceUrl: 'https://trek.nasa.gov/moon/',
  },
  'mars-viking': {
    key: 'mars-viking',
    body: 'mars',
    label: 'Viking Color Global Mosaic',
    datasetName: 'Mars_Viking_MDIM21_ClrMosaic_global_232m',
    publisher: 'NASA Mars Trek / USGS Astrogeology / JPL',
    baseUrl:
      'https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm',
    maxZoom: 4,
    ext: 'jpg',
    sourceUrl: 'https://trek.nasa.gov/mars/',
  },
  'mars-mola': {
    key: 'mars-mola',
    body: 'mars',
    label: 'MGS MOLA Shaded Elevation',
    datasetName: 'Mars_MGS_MOLA_ClrShade_merge_global_463m',
    publisher: 'NASA Mars Trek / GSFC / MOLA Science Team',
    baseUrl:
      'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/default/default028mm',
    maxZoom: 4,
    ext: 'jpg',
    sourceUrl: 'https://trek.nasa.gov/mars/',
  },
};

export function getTrekTileUrl(
  layerKey: TrekLayerKey,
  z: number,
  x: number,
  y: number
): string {
  const layer = TREK_LAYERS[layerKey];
  return `${layer.baseUrl}/${z}/${y}/${x}.${layer.ext}`;
}

/**
 * Generates a deterministic procedural planetary equirectangular canvas
 * as an instant base / offline fallback before or if WMTS tiles fail.
 */
function paintProceduralPlanetBase(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  body: PlanetaryBody
) {
  const grad = ctx.createLinearGradient(0, 0, width, height);
  if (body === 'moon') {
    grad.addColorStop(0, '#6b7280');
    grad.addColorStop(0.5, '#9ca3af');
    grad.addColorStop(1, '#4b5563');
  } else {
    grad.addColorStop(0, '#9a3412');
    grad.addColorStop(0.5, '#c2410c');
    grad.addColorStop(1, '#7c2d12');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Subtle deterministic mare/basin shading & craters
  let seed = body === 'moon' ? 1969 : 1976;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let i = 0; i < 420; i++) {
    const cx = rand() * width;
    const cy = rand() * height;
    const r = 4 + rand() * (i < 24 ? 95 : 22);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    if (body === 'moon') {
      ctx.fillStyle =
        i < 24 ? 'rgba(38, 43, 52, 0.28)' : rand() > 0.5 ? 'rgba(229, 231, 235, 0.12)' : 'rgba(17, 24, 39, 0.16)';
    } else {
      ctx.fillStyle =
        i < 24 ? 'rgba(67, 20, 7, 0.24)' : rand() > 0.5 ? 'rgba(251, 146, 60, 0.14)' : 'rgba(69, 10, 10, 0.16)';
    }
    ctx.fill();
  }
}

function loadCorsImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load tile ${url}`));
    img.src = url;
  });
}

/**
 * Builds a Three.js CanvasTexture stitched directly from NASA Trek WMTS zoom-2 tiles
 * (8 columns x 4 rows = 32 tiles -> 2048 x 1024 equirectangular map).
 * Immediately returns a procedural base texture and progressively updates as tiles stream in.
 */
export function createTrekGlobeTexture(
  layerKey: TrekLayerKey,
  onTileProgress?: (loaded: number, total: number, failed: boolean) => void
): THREE.CanvasTexture {
  const layer = TREK_LAYERS[layerKey];
  const z = 2;
  const cols = 8; // 2 * 2^z
  const rows = 4; // 1 * 2^z
  const tileSize = 256;

  const canvas = document.createElement('canvas');
  canvas.width = cols * tileSize;
  canvas.height = rows * tileSize;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    paintProceduralPlanetBase(ctx, canvas.width, canvas.height, layer.body);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;

  const total = cols * rows;
  let loaded = 0;
  let failedCount = 0;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const tileUrl = getTrekTileUrl(layerKey, z, x, y);
      loadCorsImage(tileUrl)
        .then((img) => {
          if (ctx) {
            ctx.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize);
            texture.needsUpdate = true;
          }
          loaded += 1;
          onTileProgress?.(loaded, total, false);
        })
        .catch(() => {
          failedCount += 1;
          onTileProgress?.(loaded, total, failedCount === total);
        });
    }
  }

  return texture;
}
