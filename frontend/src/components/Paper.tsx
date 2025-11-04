import { Box } from '@mui/material';
import { ReactNode } from 'react';

export function Paper({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        p: 4,
        borderRadius: 3,
        minWidth: 320,
        maxWidth: 720,
        width: '100%',
        textAlign: 'center',
        bgcolor: 'background.paper',
        color: 'text.primary',
      }}
      boxShadow={3}
    >
      {children}{' '}
    </Box>
  );
}
