import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://dinespace.mu-bin.dev";

  // Core static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/user`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Dynamically fetch all restaurants and add their public pages
  let restaurantPages: MetadataRoute.Sitemap = [];

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api-dinespace.mu-bin.dev/";
    const response = await fetch(`${apiUrl}resturant/getAllResturants`, {
      next: { revalidate: 3600 }, // revalidate every hour
    });

    if (response.ok) {
      const data = await response.json();

      if (data?.Success && Array.isArray(data.Data)) {
        restaurantPages = data.Data.map(
          (restaurant: { id: string }) => ({
            url: `${baseUrl}/user/Resturant/${restaurant.id}`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.8,
          })
        );
      }
    }
  } catch (error) {
    // Sitemap generation should never fail — return static pages only
    console.error("Sitemap: Failed to fetch restaurants:", error);
  }

  return [...staticPages, ...restaurantPages];
}
