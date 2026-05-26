import type { MetadataRoute } from "next";

const siteUrl = "https://www.ainexusconsulting.co.za";
const lastModified = new Date("2026-05-26");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/insights`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/insights/popia-first-ai`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
