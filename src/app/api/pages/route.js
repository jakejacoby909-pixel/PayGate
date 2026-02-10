import { NextResponse } from "next/server";

// In-memory storage for server-side (fallback when no Supabase)
// Note: This resets on server restart; client uses localStorage
let serverPages = [];

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, ...pageData } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing page ID" }, { status: 400 });
    }

    const page = {
      id,
      ...pageData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      conversions: 0,
    };

    const existingIndex = serverPages.findIndex((p) => p.id === id);
    if (existingIndex >= 0) {
      serverPages[existingIndex] = { ...serverPages[existingIndex], ...page, updatedAt: new Date().toISOString() };
    } else {
      serverPages.push(page);
    }

    return NextResponse.json({ success: true, page });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const page = serverPages.find((p) => p.id === id);
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }
    return NextResponse.json({ page });
  }

  return NextResponse.json({ pages: serverPages });
}
