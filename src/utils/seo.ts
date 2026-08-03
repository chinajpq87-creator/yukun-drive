/** Central SEO/GEO configuration — single source of truth for all components */

export const SITE = {
  name: 'Yukun',
  legalName: 'Yukun (Shenzhen) Supply Chain Technology Co., Ltd.',
  url: 'https://yukun-drive.com',
  ogImage: '/images/og-default.jpg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  locale: 'en_US',
  twitterHandle: '',
  description:
    'Global Manufacturing Integration Partner (GMIP). Helping overseas hardware teams bring products from prototype to mass production in China — motion system engineering, supplier coordination, and hardware NPI management.',
  sameAs: [],
  themeColor: '#0066cc',
} as const;

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/** Build a breadcrumb list for JSON-LD from path segments. */
export function buildBreadcrumbList(items: BreadcrumbItem[]) {
  return items.map((item, i) => ({
    '@type': 'ListItem' as const,
    position: i + 1,
    name: item.name,
    item: item.url,
  }));
}
