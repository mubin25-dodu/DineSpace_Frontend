export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "DineSpace",
        url: "https://dinespace.mu-bin.dev",
        description:
          "Contactless restaurant ordering and management platform. Order food from your table with QR code menus and real-time order tracking.",
        applicationCategory: "FoodService",
        operatingSystem: "Web",
        browserRequirements: "Requires JavaScript",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        creator: {
          "@type": "Person",
          name: "Abdullah Al Mubin",
          url: "https://mu-bin.dev",
        },
        screenshot: "https://dinespace.mu-bin.dev/og-image.jpg",
      },
      {
        "@type": "WebSite",
        name: "DineSpace",
        url: "https://dinespace.mu-bin.dev",
        description:
          "Contactless dining platform connecting diners and restaurant teams through QR code ordering and real-time kitchen management.",
        publisher: {
          "@type": "Person",
          name: "Abdullah Al Mubin",
          url: "https://mu-bin.dev",
        },
      },
      {
        "@type": "Organization",
        name: "DineSpace",
        url: "https://dinespace.mu-bin.dev",
        logo: "https://dinespace.mu-bin.dev/DineSpace.png",
        description:
          "Platform for contactless restaurant ordering and operations management.",
        founder: {
          "@type": "Person",
          name: "Abdullah Al Mubin",
          url: "https://mu-bin.dev",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
