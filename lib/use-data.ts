"use client";

import * as React from "react";
import type { AppData } from "./types";
import { getSeed, fetchData, onDataChange } from "./data";

export function useAppData(): {
  data: AppData;
  ready: boolean;
  refresh: () => Promise<void>;
  setData: (d: AppData) => void;
} {
  const [data, setData] = React.useState<AppData>(() => getSeed());
  const [ready, setReady] = React.useState(false);

  const refresh = React.useCallback(async () => {
    const d = await fetchData();
    setData(d);
    setReady(true);
  }, []);

  React.useEffect(() => {
    void refresh();
    return onDataChange(() => {
      void refresh();
    });
  }, [refresh]);

  return { data, ready, refresh, setData };
}
