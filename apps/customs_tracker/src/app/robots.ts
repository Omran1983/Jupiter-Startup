import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://customs-tracker.vercel.app';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/report/private/',
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
