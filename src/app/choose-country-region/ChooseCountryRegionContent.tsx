"use client";

import { useEffect, useMemo, useState } from "react";
import { worldRegions } from "@/legacy/utils/worldRegions";

type City = { code: string; name: string };
type Country = { code: string; name: string; defaultRegion: string; cities: City[] };
type ContinentBlock = { continent: string; countries: Country[] };

const continentMeta: Record<string, { tagline: string; icon: string; description: string }> = {
  Europe: {
    tagline: "World-class software training in Europe's tech capitals",
    icon: "🏰",
    description: "Expert-led IT courses in London, Berlin, Paris, Amsterdam and 40+ European cities",
  },
  "Asia Pacific": {
    tagline: "Professional IT training across Asia-Pacific's innovation hubs",
    icon: "🌏",
    description: "Software development courses in Bangalore, Singapore, Tokyo, Sydney and major APAC cities",
  },
  "North America": {
    tagline: "Premium software courses in North America's tech centers",
    icon: "🗽",
    description: "Instructor-led training in New York, Toronto, San Francisco, Chicago and top US/Canada cities",
  },
  "South America": {
    tagline: "Expert software training in South America's emerging tech markets",
    icon: "🌄",
    description: "Professional IT courses in São Paulo, Buenos Aires, Santiago and leading Latin American cities",
  },
  "Africa / Middle East": {
    tagline: "Leading software training in Africa & Middle East's tech hubs",
    icon: "🌍",
    description: "Corporate IT training in Dubai, Riyadh, Johannesburg, Cairo and regional centers",
  },
};

function CityLink({ city, country }: { city: City; country: Country }) {
  const url = `/${country.code}/${country.defaultRegion}/${city.code}`;
  return (
    <a
      href={url}
      className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm transition-all hover:border-blue-500 hover:bg-blue-600 hover:text-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
      title={`Software training courses in ${city.name}, ${country.name}`}
      aria-label={`View IT training courses in ${city.name}`}
    >
      {city.name}
    </a>
  );
}

function CountrySection({ country, userCountry }: { country: Country; userCountry: string | null }) {
  const isUserCountry = userCountry === country.code;

  return (
    <article
      className={`rounded-xl border p-4 transition-all ${
        isUserCountry ? "border-blue-400 bg-blue-50 ring-2 ring-blue-200" : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
      itemScope
      itemType="https://schema.org/Place"
    >
      <div className="mb-3 flex items-center gap-2">
        <h3 className="font-semibold text-gray-900" itemProp="name">
          {country.name}
        </h3>
        {isUserCountry && (
          <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">📍 Your location</span>
        )}
      </div>

      <nav aria-label={`Cities in ${country.name}`}>
        <div className="flex flex-wrap gap-2">
          {country.cities?.length > 0 ? (
            country.cities.map((city) => <CityLink key={city.code} city={city} country={country} />)
          ) : (
            <span className="text-sm italic text-gray-400">New cities coming soon</span>
          )}
        </div>
      </nav>
    </article>
  );
}

function ContinentSection({
  continent,
  countries,
  userCountry,
}: {
  continent: string;
  countries: Country[];
  userCountry: string | null;
}) {
  const meta = continentMeta[continent] || {
    tagline: "Expert software training courses worldwide",
    icon: "🌐",
    description: "Professional IT training in major global cities",
  };

  return (
    <section className="mb-10" aria-labelledby={`continent-${continent.replace(/\s+/g, "-")}`}>
      <header className="mb-4 border-b border-gray-200 pb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-label={continent}>
            {meta.icon}
          </span>
          <div>
            <h2 id={`continent-${continent.replace(/\s+/g, "-")}`} className="text-xl font-bold text-gray-900">
              {continent}
            </h2>
            <p className="text-sm font-medium text-blue-600">{meta.tagline}</p>
            <p className="mt-1 text-xs text-gray-500">{meta.description}</p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {countries.map((country) => (
          <CountrySection key={country.code} country={country} userCountry={userCountry} />
        ))}
      </div>
    </section>
  );
}

function generateStructuredData(continents: ContinentBlock[]) {
  const locations = continents.flatMap((block) =>
    block.countries.flatMap((country) =>
      country.cities.map((city) => ({
        "@type": "Place",
        name: `${city.name}, ${country.name}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: city.name,
          addressCountry: country.code.toUpperCase(),
        },
      })),
    ),
  );

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Software Training Locations",
    description: "Professional software training courses available in 200+ cities worldwide",
    numberOfItems: locations.length,
    itemListElement: locations.slice(0, 50).map((loc, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: loc,
    })),
  };
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Your Training Company",
  description: "Professional software training courses worldwide",
  url: "https://aimtutor.co",
  areaServed: ["Europe", "Asia Pacific", "North America", "South America", "Africa", "Middle East"],
  courseMode: ["onsite", "online", "hybrid"],
};

export default function ChooseCountryRegionContent() {
  const [userCountry, setUserCountry] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/detect-location")
      .then((r) => r.json())
      .then((d) => setUserCountry(String(d.country || "").toLowerCase()))
      .catch(() => {});
  }, []);

  const continents = useMemo(() => worldRegions as ContinentBlock[], []);
  const structuredData = useMemo(() => generateStructuredData(continents), [continents]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">🌍 Professional Software Training Courses in 200+ Cities Worldwide</h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-700">
            Expert-led IT training courses delivered in your city. From Python to Cloud Computing, Machine Learning to DevOps - choose your location for local schedules,
            pricing, and online training.
          </p>
          <p className="mt-2 text-sm text-gray-600">⭐ Trusted by 50,000+ professionals • 🏆 Corporate training solutions • 📍 Instructor-led courses</p>
        </header>

        <nav aria-label="Training locations by continent">
          {continents.map((block) => (
            <ContinentSection key={block.continent} continent={block.continent} countries={block.countries} userCountry={userCountry} />
          ))}
        </nav>
      </div>
    </div>
  );
}

