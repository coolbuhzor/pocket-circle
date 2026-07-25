"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

interface UseAdminListSearchOptions {
  basePath: string;
}

export function useAdminListSearch({ basePath }: UseAdminListSearchOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page") || "1") || 1);
  const searchFromUrl = searchParams.get("search") ?? "";

  const [search, setSearch] = useState(searchFromUrl);
  const [prevSearchFromUrl, setPrevSearchFromUrl] = useState(searchFromUrl);

  // Keep the input in sync when the URL changes (back/forward).
  if (searchFromUrl !== prevSearchFromUrl) {
    setPrevSearchFromUrl(searchFromUrl);
    setSearch(searchFromUrl);
  }

  const debounced = useDebouncedValue(search, 250);

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
