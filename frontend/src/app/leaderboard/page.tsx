"use client"
import { DefaultBackground } from "@/components/DefaultBackground";
import { LoadingTokenList } from "@/components/flow/LoadingTokenList";
import Loader from "@/components/Loader";
import { Paper } from "@/components/Paper";
import { SecondaryText } from "@/components/Text";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TokenRow, TokenRowMode } from "@/components/TokenRow";
import { useLeaderBoard } from "@/hooks/useQueryTokenBalances";
import { TokenBalancesResponse } from "@/queries/backenTokenBalance";
import { shortenAddress } from "@/utils/shorten";
import { Box, Typography } from "@mui/material";

export default function LeaderBoard() {

    const { data: leaderboard, isError } = useLeaderBoard();
    console.log(leaderboard && Object.entries(
        leaderboard.reduce((acc: Record<string, any[]>, l: any) => {
            const cid = String(l.chainId ?? "unknown");
            ; (acc[cid] ??= []).push(l)
            return acc
        }, {})
    ))
    return (<DefaultBackground>
        <Paper>
            {isError && <SecondaryText>Error loading leader board, please try again later.</SecondaryText>}
            {!isError && <>
                {!leaderboard &&
                    <>
                        <Box sx={{ marginBottom: '2em' }}>
                            <Loader />
                            <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
                                Loading Leader Board…
                            </Typography>
                            <SecondaryText sx={{ mt: 1 }}>The backend is busy — this may take a moment.</SecondaryText>
                        </Box>
                    </>}
                {leaderboard && leaderboard.map((leader) => {
                    return (
                        <Box key={`leaderboard-groups-${leader.id}`}>{
                            // Render the grouped, collapsible list once (only for the first mapped item)
                            leaderboard[0] && leaderboard[0].id === leader.id ? (
                                <Box key={`leaderboard-groups-${leader.id}`}>
                                    {Object.entries(
                                        leaderboard.reduce((acc: Record<string, TokenBalancesResponse[]>, l: any) => {
                                            const cid = String(l.chainId ?? "unknown");
                                            ; (acc[cid] ??= []).push(l)
                                            return acc
                                        }, {})
                                    ).map(([chainId, leaders]) => (
                                        <Box key={`chainId-${chainId}`} sx={{ mb: 2 }}>
                                            <details>
                                                <summary
                                                    style={{
                                                        cursor: "pointer",
                                                        listStyle: "none",
                                                        outline: "none",
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        padding: "0.5rem 0",
                                                    }}
                                                >
                                                    <Typography variant="h6" component="span">
                                                        Chain {chainId}
                                                    </Typography>
                                                    <SecondaryText component="span">
                                                        {leaders.length} leader{leaders.length > 1 ? "s" : ""}
                                                    </SecondaryText>
                                                </summary>

                                                <Box sx={{ mt: 1, pl: 2 }}>
                                                    {leaders.toSorted((l) => l.balances.length).map((l) => (
                                                        <Box
                                                            key={l.id}
                                                            sx={{
                                                                py: 1,
                                                                borderBottom: "1px solid rgba(0,0,0,0.06)",
                                                                "&:last-child": { borderBottom: "none" },
                                                            }}
                                                        >
                                                            <Typography sx={{ fontWeight: 600 }}>{shortenAddress(l.address)}</Typography>

                                                            {Array.isArray(l.balances) && l.balances.length > 0 ? (<details>{
                                                                l.balances.map((b, i: number) => (
                                                                    <TokenRow key={`l-${l.id}-b-${b.token.id}`} token={{
                                                                        ...b.token,
                                                                        tokenBalance: BigInt(b.userBalance)
                                                                    }} mode={TokenRowMode.DEFAULT} />
                                                                ))}
                                                            </details>) : (
                                                                <SecondaryText>No balances</SecondaryText>
                                                            )}
                                                        </Box>
                                                    ))}
                                                </Box>
                                            </details>
                                        </Box >
                                    ))}
                                </Box>
                            ) : null
                        }</Box>
                    )
                })}
            </>}



        </Paper >
    </DefaultBackground >
    );
}
