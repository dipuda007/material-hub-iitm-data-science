"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { isAdmin, onAuthChange } from "@/lib/auth";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = React.useState<"checking" | "ok" | "denied">(
    "checking",
  );

  React.useEffect(() => {
    const check = () => {
      if (isAdmin()) setStatus("ok");
      else setStatus("denied");
    };
    check();
    return onAuthChange(check);
  }, []);

  React.useEffect(() => {
    if (status === "denied") router.replace("/admin/login");
  }, [status, router]);

  if (status !== "ok") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
