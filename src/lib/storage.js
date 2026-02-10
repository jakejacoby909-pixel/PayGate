import { getSupabaseBrowser } from "./supabase";

const STORAGE_KEY = "paygate_pages";

export function getAllPages() {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getPage(id) {
  const pages = getAllPages();
  return pages.find((p) => p.id === id) || null;
}

export function savePage(page) {
  const pages = getAllPages();
  const index = pages.findIndex((p) => p.id === page.id);
  if (index >= 0) {
    pages[index] = { ...pages[index], ...page, updatedAt: new Date().toISOString() };
  } else {
    pages.push({ ...page, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), views: 0, conversions: 0 });
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
  return page;
}

export function deletePage(id) {
  const pages = getAllPages().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
}

export function duplicatePage(id, newId) {
  const page = getPage(id);
  if (!page) return null;
  const dup = { ...page, id: newId, productName: `${page.productName} (Copy)`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), views: 0, conversions: 0 };
  const pages = getAllPages();
  pages.push(dup);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
  return dup;
}

export function incrementViews(id) {
  const pages = getAllPages();
  const page = pages.find((p) => p.id === id);
  if (page) {
    page.views = (page.views || 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
  }
}

export function incrementConversions(id) {
  const pages = getAllPages();
  const page = pages.find((p) => p.id === id);
  if (page) {
    page.conversions = (page.conversions || 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
  }
}

export function exportPages() {
  return JSON.stringify(getAllPages(), null, 2);
}

export function importPages(jsonString) {
  try {
    const imported = JSON.parse(jsonString);
    if (!Array.isArray(imported)) return false;
    const existing = getAllPages();
    const merged = [...existing];
    for (const page of imported) {
      if (page.id && !merged.find((p) => p.id === page.id)) {
        merged.push(page);
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return true;
  } catch {
    return false;
  }
}

export async function syncPageToSupabase(page, userId) {
  const supabase = getSupabaseBrowser();
  if (!supabase || !userId) return null;

  try {
    const { data, error } = await supabase
      .from("pages")
      .upsert({
        id: page.id,
        user_id: userId,
        config: page,
        updated_at: new Date().toISOString(),
      }, { onConflict: "id" });

    if (error) console.error("Supabase sync error:", error);
    return data;
  } catch (err) {
    console.error("Supabase sync failed:", err);
    return null;
  }
}

export async function fetchPagesFromSupabase(userId) {
  const supabase = getSupabaseBrowser();
  if (!supabase || !userId) return null;

  try {
    const { data, error } = await supabase
      .from("pages")
      .select("config")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return null;
    }

    return data ? data.map((row) => row.config) : null;
  } catch (err) {
    console.error("Supabase fetch failed:", err);
    return null;
  }
}
