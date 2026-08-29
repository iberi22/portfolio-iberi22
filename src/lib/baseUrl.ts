// Full canonical site URL (GitHub Pages project base included), with trailing
// slash normalization matching Astro static directory output.
const SITE_ORIGIN = 'https://iberi22.github.io';

export function siteUrl(path = '') {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const clean = path.replace(/^\//, '');
  const full = clean === '' ? base : `${base}${clean}`;
  return `${SITE_ORIGIN}${full.endsWith('/') ? full : `${full}/`}`;
}

export function baseUrl(path = '') {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  return `${base}${path}`;
}
