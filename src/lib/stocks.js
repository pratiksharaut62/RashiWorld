// Shared stock-fetching + image-resolution helpers.
// Used by the storefront (Welcome) and the Catalog page so the mapping
// logic lives in exactly one place.
import { supabase } from './supabaseClient';

const STOCK_FIELDS =
  'id, slug, title, brand, category, description, colors, sizes, moq, fabric, photos, video_url, status, expiry_date';

const PLACEHOLDER = '/assets/placeholder.jpeg';

/** Turn a raw photos value (array | JSON string | string) into resolved public URLs. */
export function resolveMedia(item) {
  let rawPhotos = [];

  if (Array.isArray(item.photos)) {
    rawPhotos = item.photos;
  } else if (typeof item.photos === 'string') {
    try {
      rawPhotos = JSON.parse(item.photos);
    } catch {
      rawPhotos = item.photos ? [item.photos] : [];
    }
  }

  const resolvedImages = rawPhotos
    .map((photo) => {
      if (!photo) return null;
      if (photo.startsWith('http')) return photo;
      const { data } = supabase.storage.from('images').getPublicUrl(photo);
      return data.publicUrl;
    })
    .filter(Boolean);

  if (item.video_url) resolvedImages.push(item.video_url);

  const image = resolvedImages[0] || PLACEHOLDER;
  return { image, images: resolvedImages.length > 0 ? resolvedImages : [image] };
}

/** Map a raw Supabase row to the shape the UI expects. */
export function mapStock(item) {
  const { image, images } = resolveMedia(item);
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    brand: item.brand,
    category: item.category,
    description: item.description,
    colors: item.colors,
    sizes: item.sizes,
    moq: item.moq,
    fabric: item.fabric,
    videoUrl: item.video_url,
    status: item.status,
    expiry: item.expiry_date,
    image,
    images,
  };
}

/** Fetch and map all storefront stocks. Returns [] on error. */
export async function fetchStocks() {
  const { data, error } = await supabase.from('stocks').select(STOCK_FIELDS);
  if (error) {
    console.error('Database connection error:', error.message);
    return [];
  }
  return (data || []).map(mapStock);
}

/** Fetch a single stock by slug. Returns null if not found. */
export async function fetchStockBySlug(slug) {
  const { data, error } = await supabase
    .from('stocks')
    .select(STOCK_FIELDS)
    .eq('slug', slug)
    .single();
  if (error || !data) return null;
  return mapStock(data);
}

/** Lightweight list of slugs for static generation / sitemap. */
export async function fetchStockSlugs() {
  const { data, error } = await supabase.from('stocks').select('slug');
  if (error) return [];
  return (data || []).map((r) => r.slug).filter(Boolean);
}
