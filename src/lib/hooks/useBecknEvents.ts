"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useBecknEvents() {
  const { data, error, isLoading } = useSWR("/api/beckn/events", fetcher, {
    refreshInterval: 4000,
  });

  return {
    events: data?.events ?? [],
    error,
    isLoading,
  };
}
