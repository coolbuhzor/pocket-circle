"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface UseAdminListSearchOptions {
  basePath: string;
}

export function useAdminListSearch({ basePath }: UseAdminListSearchOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page") || "1") || 1);
  const searchFromUrl = searchParams.get("search") ?? "";

  const [search, setSearch] = useState(searchFromUrl);
  const [debounced, setDebounced] = useState(searchFromUrl);

  useEffect(() => {
    setSearch(searchFromUrl);
  }, [searchFromUrl]);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (debounced === searchFromUrl) return;
    const params = new URLSearchParams();
    if (debounced) params.set("search", debounced);
    params.set("page", "1");
    router.replace(`${basePath}?${params.toString()}`);
  }, [debounced, searchFromUrl, router, basePath]);

  function setPage(next: number) {
    const params = new URLSearchParams();
    if (debounced) params.set("search", debounced);
    params.set("page", String(next));
    router.push(`${basePath}?${params.toString()}`);
  }

  return { page, search, setSearch, debounced, setPage, router };
}
