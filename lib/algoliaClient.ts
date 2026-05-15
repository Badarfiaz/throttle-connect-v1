type Meta = { trigger?: string; source?: string } | undefined;

export async function searchWithTracking<T = any>(
  args: any,
  meta?: Meta,
  signal?: AbortSignal,
) {
  const endpoint = "/api/algolia-search";
  const payload = { args, meta };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });

  if (!res.ok) return { results: [] } as T;
  return (await res.json()) as T;
}
