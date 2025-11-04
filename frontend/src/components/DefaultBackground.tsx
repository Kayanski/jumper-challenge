import { Box } from "@mui/material";
import { ThemeToggle } from "./ThemeToggle";
import { ReactNode } from "react";
import { PageToggle } from "./PageToggle";

export function DefaultBackground({ children }: { children: ReactNode }) {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                px: 2,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    marginTop: '50px',
                    marginBottom: '50px',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center', justifyContent: "space-between"
                }}> <PageToggle />
                    <ThemeToggle /></Box>

                {children}
            </Box>
        </Box>);
}