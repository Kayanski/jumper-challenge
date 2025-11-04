import { Button, styled } from '@mui/material';

export const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: 3,
  px: 4,
  py: 1.2,
  fontWeight: 700,
  boxShadow: theme.shadows[3],
}));
