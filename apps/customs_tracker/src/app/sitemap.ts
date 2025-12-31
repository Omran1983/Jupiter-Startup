import { MetadataRoute } from 'next';
import { carriers } from '../data/carriers';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://customs-tracker.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
    // 1. Static Pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${BASE_URL}/tools/hs-code`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/templates`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/checkout`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        }
    ];

    // 2. Dynamic Carrier Pages
    const carrierPages: MetadataRoute.Sitemap = Object.keys(carriers).map((slug) => ({
        url: `${BASE_URL}/carriers/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    return [...staticPages, ...carrierPages];
}
