import { Button, Card, styled } from '@mui/material';

export const ListCard = styled(Card)(({ theme }) => ({
  bgcolor: 'background.paper',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(100, 116, 139, 0.3)',
  '&:hover': {
    bgcolor: 'background.default',
    borderColor: 'rgba(168, 85, 247, 0.5)',
    transform: 'translateY(-2px)',
  },
})); 