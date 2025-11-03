"use client";
import { Box, Typography } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Loader from "../components/Loader";
import { ThemeToggle } from "../components/ThemeToggle";
import { useQueryTokenBalances } from "@/hooks/useQueryTokenBalances";
import { useOwnershipSignature } from "@/storage/signature";
import { TokenList } from "@/components/TokenList";
import { useIsConnected } from "@/hooks/useIsConnected";
import { useAccountDelete } from "@/hooks/useAccountCreation";
import { StyledButton } from "@/components/StyledButton";
import { SecondaryText } from "@/components/Text";
import { useVerifyOwnership } from "@/hooks/useVerifyOwnershipSignature";
import { useMemo } from "react";

export default function Home() {
  const { address, chainId } = useAccount();
  const { getSignature } = useOwnershipSignature();

  const signature = useMemo(() => {
    if (!address || !chainId) return null;
    return getSignature({ address, chainId });
  }, [address, chainId, getSignature]);

  const { data: balances } = useQueryTokenBalances();
  const { data: isConnected } = useIsConnected();

  const { mutateAsync: deleteAccount } = useAccountDelete();

  const { isCreatingAccount, signAndCreateAccount } = useVerifyOwnership();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          marginTop: "50px",
          marginBottom: "50px",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: 2,
        }}
      >
        <ThemeToggle />
        <Box
          sx={{
            p: 4,
            borderRadius: 3,
            minWidth: 320,
            maxWidth: 720,
            width: "100%",
            textAlign: "center",
            bgcolor: "background.paper",
            color: "text.primary",
          }}
          boxShadow={3}
        >
          {!address && (
            <>
              <Typography
                variant="h4"
                component="h1"
                sx={{ fontWeight: 700, mb: 1 }}
              >
                Welcome to the Token Explorer
              </Typography>
              <SecondaryText sx={{ mb: 3 }}>
                Connect your wallet to get started — we only need your address.
              </SecondaryText>

              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <ConnectButton />
              </Box>
            </>
          )}
          {address && !isConnected && (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <ConnectButton />
                {!isCreatingAccount && (
                  <StyledButton
                    variant="contained"
                    color="primary"
                    onClick={() => signAndCreateAccount()}
                  >
                    Verify Account
                  </StyledButton>
                )}
                {isCreatingAccount && <Loader />}
                <SecondaryText>
                  This is needed in order to fetch your account balance
                </SecondaryText>
              </Box>
            </>
          )}

          {address && isConnected && (
            <>
              {balances && (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <ConnectButton />
                    {signature && (
                      <StyledButton
                        variant="contained"
                        color="primary"
                        onClick={() => deleteAccount({ signature })}
                      >
                        Delete Account
                      </StyledButton>
                    )}
                  </Box>
                  <TokenList tokens={balances} />
                </>
              )}
              {!balances && (
                <>
                  <Box sx={{ marginBottom: "2em" }}>
                    <Loader />
                    <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
                      Loading Token List…
                    </Typography>
                    <SecondaryText sx={{ mt: 1 }}>
                      Preparing your session — this may take a moment.
                    </SecondaryText>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 2 }}
                  >
                    <ConnectButton />
                  </Box>
                  <Box>
                    <SecondaryText sx={{ mb: 3 }}>
                      Your Wallet was successfully connected.
                    </SecondaryText>
                  </Box>
                </>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
