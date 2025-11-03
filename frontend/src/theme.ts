"use client";
import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "class",
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    h1: {
      fontSize: "2rem",
    },
  },
  colorSchemes: {
    dark: {
      palette: {
        background: {
          default: "#0F172A",
          paper: "#1E293B",
        },
      },
    },
    light: {
      palette: {
        background: {
          default: "#e3e3e3ff",
          paper: "white",
        },
      },
    }
  },
});

export default theme;
