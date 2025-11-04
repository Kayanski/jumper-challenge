'use client';
import { Box, Typography } from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Loader from '../components/Loader';
import { ThemeToggle } from '../components/ThemeToggle';
import { useQueryTokenBalances } from '@/hooks/useQueryTokenBalances';
import { useOwnershipSignature } from '@/storage/signature';
import { TokenList } from '@/components/TokenList';
import { useIsConnected } from '@/hooks/useIsConnected';
import { useAccountDelete } from '@/hooks/useAccountCreation';
import { StyledButton } from '@/components/StyledButton';
import { SecondaryText } from '@/components/Text';
import { useVerifyOwnership } from '@/hooks/useVerifyOwnershipSignature';
import { useMemo } from 'react';
import { WelcomeParagraph } from '@/components/flow/WelcomeParagraph';
import { LoadingTokenList } from '@/components/flow/LoadingTokenList';
import { DefaultBackground } from '@/components/DefaultBackground';
import { Paper } from '@/components/Paper';

export default function Home() {
  const { address, chainId } = useAccount();
  const { getSignature } = useOwnershipSignature();

  const signature = useMemo(() => {
    if (!address || !chainId) return null;
    return getSignature({ address, chainId });
  }, [address, chainId, getSignature]);

  const { data: balances } = useQueryTokenBalances();
  const { data: isConnected } = useIsConnected();

  const { mutateAsync: deleteAccount, isError } = useAccountDelete();

  const {
    mutate: signAndCreateAccount,
    isPending: isCreatingAccount,
    error: accountCreationError,
    isError: isCreatingAccountError,
  } = useVerifyOwnership();

  return (
    <DefaultBackground>
      <Paper>
        {!address && <WelcomeParagraph />}
        {address && !isConnected && (
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <ConnectButton />
              {!isCreatingAccount && (
                <StyledButton
                  variant="contained"
                  color={isCreatingAccountError ? 'error' : 'primary'}
                  onClick={() => signAndCreateAccount()}
                >
                  {isError ? 'Error verifying account' : 'Verify Account'}
                </StyledButton>
              )}
              {!isCreatingAccount && isCreatingAccountError && (
                <Box>
                  <SecondaryText color="error.light">
                    {accountCreationError.message.includes('Failed to fetch')
                      ? 'Token server is down'
                      : accountCreationError.message}
                  </SecondaryText>
                </Box>
              )}
              {isCreatingAccount && <Loader />}
              <SecondaryText>This is needed in order to fetch your account balance</SecondaryText>
            </Box>
          </>
        )}

        {address && isConnected && (
          <>
            {!balances && <LoadingTokenList />}
            {balances && (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <ConnectButton />
                  {signature && (
                    <StyledButton
                      variant="contained"
                      color={isError ? 'error' : 'primary'}
                      onClick={() => deleteAccount({ signature })}
                    >
                      {isError ? 'Error deleting account' : 'Delete Account'}
                    </StyledButton>
                  )}
                </Box>
                {balances.length !== 0 && (
                  <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 1, mt: 5, textAlign: 'left' }}>
                    All ERC-20 tokens held by your account:
                  </Typography>
                )}

                <TokenList tokens={balances} />
              </>
            )}
          </>
        )}
      </Paper>
    </DefaultBackground>
  );
}
