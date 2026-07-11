/** Central SEO/GEO configuration — single source of truth for all components */

export const SITE = {
  name: 'Yukun',
  legalName: 'Yukun (Shenzhen) Supply Chain Technology Co., Ltd.',
  url: 'https://yukun-drive.com',
  ogImage: '/images/og-default.jpg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  locale: 'en_US',
  twitterHandle: '@YukunDrive',
  description:
    'Precision micro drives from concept to production. Gear motors, BLDC motors, micro pumps, and switches. Engineer-first selection, 1-week samples. FOB Shenzhen.',
  sameAs: [
    'https://linkedin.com/company/yukun-drive',
    'https://youtube.com/@YukunDrive',
    'https://x.com/YukunDrive',
    'https://tiktok.com/@yukundrive',
  ],
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
