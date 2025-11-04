import { Box, keyframes, useTheme } from '@mui/material';

export default function Loader() {
  const spin = keyframes`
    to { transform: rotate(360deg); }
  `;
  return (
    <Box
      aria-hidden="true"
      sx={{
        width: 120,
        height: 120,
        borderRadius: '50%',
        border: '12px solid rgba(16,24,40,0.08)',
        borderTopColor: 'info.main',
        animation: `${spin} 1s linear infinite`,
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    />
  );
}
