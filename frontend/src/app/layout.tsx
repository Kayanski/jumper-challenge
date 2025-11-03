import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ContextProvider } from "./providers";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import "@rainbow-me/rainbowkit/styles.css";
import "../index.css";
import { InitColorSchemeScript } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Token Querier",
  description: "Example UI to query token balances from an Ethereum address",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme} defaultMode="dark">
            <ContextProvider>{children}</ContextProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
