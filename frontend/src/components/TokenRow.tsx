import { Avatar, Box, Card, CardContent, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { TokenBalanceWithInfo } from '@/hooks/useQueryTokenBalances';
import { useAccount } from 'wagmi';
import { shortenAddress } from '@/utils/shorten';
import { AddressButtons } from './AddressButtons';
import { ListCard } from './styled/StyledCard';

export enum TokenRowMode {
  DEFAULT,
  SPAM,
}

export function TokenRow({ token, mode = TokenRowMode.DEFAULT }: { token: TokenBalanceWithInfo; mode?: TokenRowMode }) {
  const { chain } = useAccount();


  const formatTokenBalance = (balance: bigint, decimals = 18, maxFraction = 6) => {
    try {
      const factor = BigInt(10 ** decimals);
      const decimaledBalance = balance / factor;
      return decimaledBalance.toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumSignificantDigits: 1,
      });
    } catch {
      // fallback if BigInt fails
      const n = Number(balance) / 10 ** decimals;
      return n.toFixed(Math.min(maxFraction, 6)).replace(/\.?0+$/, '');
    }
  };

  const tokenNameDeservesSlicing = (tokenName: string) => {
    return mode == TokenRowMode.SPAM && tokenName.length > 25;
  };
  const formatTokenName = (tokenName: string) => {
    if (tokenNameDeservesSlicing(tokenName)) {
      return tokenName.slice(0, 22) + '...';
    }
    return tokenName;
  };

  const tokenSymbolDeservesSlicing = (tokenSymbol: string) => {
    return mode == TokenRowMode.SPAM && tokenSymbol.length > 10;
  };
  const formatTokenSymbol = (tokenSymbol: string) => {
    if (tokenSymbolDeservesSlicing(tokenSymbol)) {
      return tokenSymbol.slice(0, 7) + '...';
    }
    return tokenSymbol;
  };

  return (
    <ListCard>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          {/* Token Logo */}
          <Tooltip title={token.logo ? token.name : 'No logo available'}>
            <Avatar
              src={token.logo || ''}
              alt={token.name}
              sx={{
                width: 56,
                height: 56,
                bgcolor: 'rgba(51, 65, 85, 0.5)',
                border: '2px solid',
                borderColor: 'rgba(100, 116, 139, 1)',
                transition: 'border-color 0.3s ease',
                '.MuiCard-root:hover &': {
                  borderColor: 'primary.main',
                },
              }}
            />
          </Tooltip>

          {/* Token Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Tooltip title={token.name} disableHoverListener={!tokenNameDeservesSlicing(token.name)}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {formatTokenName(token.name)}
                </Typography>
              </Tooltip>
              <Tooltip title={token.symbol} disableHoverListener={!tokenSymbolDeservesSlicing(token.symbol)}>
                <Chip
                  label={formatTokenSymbol(token.symbol)}
                  size="small"
                  sx={[
                    {
                      fontSize: '0.75rem',
                      fontWeight: 500,
                    },
                    (theme) =>
                      theme.applyStyles('dark', {
                        color: '#d8b4fe',
                        bgcolor: 'rgba(168, 85, 247, 0.2)',
                      }),
                    (theme) =>
                      theme.applyStyles('light', {
                        bgcolor: 'rgba(168, 85, 247, 0.8)',
                        color: 'white',
                      }),
                  ]}
                />
              </Tooltip>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                textAlign: 'left',
              }}
            >
              {shortenAddress(token.contractAddress)}
            </Typography>
          </Box>

          {/* Balance Info and action buttons */}
          <Box sx={{ textAlign: 'right', mr: 2 }}>
            <Tooltip title={token.symbol} disableHoverListener={!tokenSymbolDeservesSlicing(token.symbol)}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {formatTokenBalance(token.tokenBalance, token.decimals)} {formatTokenSymbol(token.symbol)}
              </Typography>
            </Tooltip>
          </Box>
          <AddressButtons address={token.contractAddress} chain={chain} />
        </Box>
      </CardContent>
    </ListCard>
  );
}
