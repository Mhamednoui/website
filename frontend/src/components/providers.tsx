"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

const PUBLIC_PATHS = ["/login", "/register"];

export function Providers({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);
  const pathname = usePathname();

  useEffect(() => {
    if (!PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
      hydrate();
    } else {
      // Mark as hydrated immediately on public pages so nothing waits
      useAuthStore.setState({ isHydrated: true });
    }
  }, []); // run once on mount only

  return <>{children}</>;
}
