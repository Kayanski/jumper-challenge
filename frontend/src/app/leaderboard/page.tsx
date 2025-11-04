'use client';
import { AddressButtons } from '@/components/AddressButtons';
import { DefaultBackground } from '@/components/DefaultBackground';
import Loader from '@/components/Loader';
import { Paper } from '@/components/Paper';
import { ListCard } from '@/components/styled/StyledCard';
import { SecondaryText } from '@/components/styled/Text';
import { TokenRow, TokenRowMode } from '@/components/TokenRow';
import { useLeaderBoard } from '@/hooks/useQueryTokenBalances';
import { TokenBalancesResponse } from '@/queries/backenTokenBalance';
import { getChainById } from '@/utils/chains';
import { shortenAddress } from '@/utils/shorten';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useMemo } from 'react';

export default function LeaderBoard() {
  const { data: leaderboard, isError } = useLeaderBoard();

  const sortedLeaderboard = useMemo(() => {
    if (!leaderboard) return undefined;

    return leaderboard.reduce((acc: Record<string, TokenBalancesResponse[]>, l) => {
      const cid = String(l.chainId);
      (acc[cid] ??= []).push(l);
      return acc;
    }, {});
  }, [leaderboard]);

  return (
    <DefaultBackground>
      <Paper>
        {isError && <SecondaryText>Error loading leader board, please try again later.</SecondaryText>}
        {!isError && (
          <>
            {!sortedLeaderboard && (
              <>
                <Box sx={{ marginBottom: '2em' }}>
                  <Loader />
                  <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
                    Loading Leader Board…
                  </Typography>
                  <SecondaryText sx={{ mt: 1 }}>The backend is busy — this may take a moment.</SecondaryText>
                </Box>
              </>
            )}
            {sortedLeaderboard &&
              Object.entries(sortedLeaderboard).map(([chainId, leaders]) => (
                <Box key={`chainId-${chainId}`} sx={{ mb: 2 }}>
                  <details>
                    <summary
                      style={{
                        cursor: 'pointer',
                        listStyle: 'none',
                        outline: 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem 0',
                      }}
                    >
                      <Typography variant="h6" component="span">
                        {getChainById(parseInt(chainId))?.name ?? `Chain ${chainId}`}
                      </Typography>
                      <SecondaryText>
                        {leaders.length} account{leaders.length > 1 ? 's' : ''}
                      </SecondaryText>
                    </summary>

                    <Box sx={{ mt: 1, pl: 2 }}>
                      {leaders
                        .toSorted((l) => l.balances.length)
                        .map((l) => (
                          <Box
                            key={l.id}
                            sx={{
                              py: 1,
                              borderBottom: '1px solid rgba(0,0,0,0.06)',
                              '&:last-child': { borderBottom: 'none' },
                            }}
                          >
                            <details>
                              <summary
                                style={{
                                  cursor: 'pointer',
                                  listStyle: 'none',
                                }}
                              >
                                <ListCard>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      padding: '16px',
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: 1,
                                      }}
                                    >
                                      <Typography sx={{ fontWeight: 600 }}>{shortenAddress(l.address)}</Typography>
                                      <AddressButtons address={l.address} chain={getChainById(parseInt(chainId))} />
                                    </Box>
                                    <Typography sx={{ fontWeight: 600 }}>
                                      {l.balances.length} token{l.balances.length > 1 ? 's' : ''}
                                    </Typography>
                                  </Box>
                                </ListCard>
                              </summary>
                              {Array.isArray(l.balances) && l.balances.length > 0 ? (
                                <>
                                  {l.balances.map((b, i: number) => (
                                    <TokenRow
                                      key={`l-${l.id}-b-${b.token.id}`}
                                      token={{
                                        ...b.token,
                                        tokenBalance: BigInt(b.userBalance),
                                      }}
                                      mode={TokenRowMode.SPAM} // We are looking at all balances here by everyone, so we need to hide potential spam
                                    />
                                  ))}
                                </>
                              ) : (
                                <SecondaryText sx={{ mt: 1 }}>No balances</SecondaryText>
                              )}
                            </details>
                          </Box>
                        ))}
                    </Box>
                  </details>
                </Box>
              ))}
          </>
        )}
      </Paper>
    </DefaultBackground>
  );
}
