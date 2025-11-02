import { useColorScheme, useTheme } from "@mui/material";
import { useCallback } from "react";


export function ThemeToggle() {
    const { mode, setMode } = useColorScheme();
    const theme = useTheme();

    const toggleMode = useCallback(() => {
        // determine current effective mode (take system into account)
        const current = mode === "system" ? theme.palette.mode : mode;
        setMode(current === "dark" ? "light" : "dark");
    }, [mode, setMode, theme.palette.mode]);

    const isDark =
        mode === "system" ? theme.palette.mode === "dark" : mode === "dark";

    return (
        <button
            onClick={toggleMode}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
            style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {/* Track */}
            <div
                style={{
                    width: 62,
                    height: 34,
                    padding: 4,
                    borderRadius: 999,
                    background: isDark ? "#374151" : "#e6e6e6",
                    position: "relative",
                    transition: "background 200ms ease",
                    boxSizing: "border-box",
                }}
            >
                {/* Knob */}
                <span
                    style={{
                        position: "absolute",
                        top: 4,
                        left: isDark ? 34 : 4,
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition:
                            "left 220ms cubic-bezier(.2,.9,.3,1), background 220ms",
                        background: isDark ? "#ffdd57" : "#0f172a",
                        color: isDark ? "#0f172a" : "#ffedd5",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                        fontSize: 14,
                        userSelect: "none",
                    }}
                >
                    {isDark ? "☀️" : "🌙"}
                </span>
            </div>
        </button>
    );
}

