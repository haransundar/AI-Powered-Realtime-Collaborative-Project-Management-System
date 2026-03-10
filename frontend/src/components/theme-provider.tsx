"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

type ThemeProviderProps = {
  children: React.ReactNode
  attribute?: "class" | "data-theme"
  defaultTheme?: string
  enableSystem?: boolean
  storageKey?: string
  disableTransitionOnChange?: boolean
  forcedTheme?: string
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "light",
  enableSystem = false,
  storageKey = "theme",
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      storageKey={storageKey}
      disableTransitionOnChange={disableTransitionOnChange}
      enableColorScheme={true}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
