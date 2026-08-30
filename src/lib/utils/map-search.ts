export type MapSearchSuggestion = {
  id: string;
  label: string;
  query: string;
};

type PhotonProperties = {
  name?: string;
  street?: string;
  housenumber?: string;
  postcode?: string;
  city?: string;
  state?: string;
  country?: string;
};

type PhotonFeature = {
  properties?: PhotonProperties;
};

type PhotonResponse = {
  features?: PhotonFeature[];
};

function formatSuggestionLabel(properties: PhotonProperties): string {
  const streetLine = [properties.housenumber, properties.street].filter(Boolean).join(" ").trim();
  const parts = [properties.name, streetLine, properties.city, properties.state, properties.country].filter(
    Boolean,
  );

  return [...new Set(parts)].join(", ");
}

export async function fetchMapSearchSuggestions(
  query: string,
  signal?: AbortSignal,
): Promise<MapSearchSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return [];
  }

  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(trimmed)}&limit=6`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as PhotonResponse;

  return (data.features ?? [])
    .map((feature, index) => {
      const properties = feature.properties ?? {};
      const label = formatSuggestionLabel(properties);

      if (!label) {
        return null;
      }

      return {
        id: `${label}-${index}`,
        label,
        query: label,
      };
    })
    .filter((item): item is MapSearchSuggestion => Boolean(item));
}
