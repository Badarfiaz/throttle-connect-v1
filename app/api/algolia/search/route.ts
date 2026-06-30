import { NextRequest, NextResponse } from "next/server";

// const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!;
const APP_ID = "BDXQ3YSOFN";
// const ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY!;
const ADMIN_KEY = "53e96ee7418fc58616b605e8c4808715";
const INDEX = "marketplace_products";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const query = searchParams.get("query") ?? "";
  const category = searchParams.get("category") ?? "";
  const page = parseInt(searchParams.get("page") ?? "0");
  const hitsPerPage = parseInt(searchParams.get("hitsPerPage") ?? "20");

  const filters = category ? `category:${category}` : "";

  const params: Record<string, string> = {
    query,
    hitsPerPage: String(hitsPerPage),
    page: String(page),
  };
  if (filters) params.filters = filters;

  const res = await fetch(
    `https://${APP_ID}-dsn.algolia.net/1/indexes/${INDEX}/query`,
    {
      method: "POST",
      headers: {
        "X-Algolia-Application-Id": APP_ID,
        "X-Algolia-API-Key": ADMIN_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ params: new URLSearchParams(params).toString() }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Algolia request failed" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
