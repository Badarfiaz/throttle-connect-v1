import { NextResponse } from "next/server";
import algoliasearch from "algoliasearch";

type Body = {
  args?: any;
};

const ALGOLIA_APP_ID =
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || process.env.ALGOLIA_APP_ID;
const ALGOLIA_ADMIN_KEY =
  process.env.ALGOLIA_ADMIN_KEY || process.env.ALGOLIA_ADMIN;

let cachedClient: ReturnType<typeof algoliasearch> | null = null;

const getClient = () => {
  if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_KEY) return null;
  if (!cachedClient)
    cachedClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
  return cachedClient;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body | null;
    if (!body?.args)
      return NextResponse.json(
        { ok: false, error: "Missing search args" },
        { status: 400 },
      );

    const client = getClient();
    if (!client)
      return NextResponse.json(
        { ok: false, error: "Algolia not configured" },
        { status: 500 },
      );

    // args should match Algolia search API parameters
    const result = await client.search(body.args);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Algolia search failed", err);
    return NextResponse.json(
      { ok: false, error: "search failed" },
      { status: 500 },
    );
  }
}
