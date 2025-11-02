import { useTheme } from "@mui/material";

export default function Loader() {
    const theme = useTheme();
    return (<>
        <style>{`
      @keyframes jc-spin { to { transform: rotate(360deg); } }
      .jc-spinner {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 12px solid rgba(16,24,40,0.08);
        border-top-color: ${theme.palette.info.main};
        animation: jc-spin 1s linear infinite;
        margin: 0 auto;
        box-sizing: border-box;
      }
      `}</style>
        <div className="jc-spinner" aria-hidden="true" /></>
    )
}   