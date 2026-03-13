"use client"

import { usePathname } from "next/navigation"

export function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === "/"

  return (
    <main className={isHome ? "" : "pt-[72px]"}>
      {children}
    </main>
  )
}
