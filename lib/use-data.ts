"use client";

import * as React from "react";
import type { AppData } from "./types";
import { getSeed, readData, onDataChange } from "./data";

export function useAppData(): { data: AppData; ready: boolean } {
  const [data, setData] = React.useState<AppData>(() => getSeed());
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setData(readData());
    setReady(true);
    return onDataChange(() => setData(readData()));
  }, []);

  return { data, ready };
}
