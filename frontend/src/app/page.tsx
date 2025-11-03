"use client"
import { Box, Typography, useTheme } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useAccount, useSignMessage } from "wagmi";
import Loader from "../components/Loader";
import { ThemeToggle } from "../components/ThemeToggle";
import { useQueryTokenBalances } from "@/hooks/useQueryTokenBalances";
import { useEffect, useState } from "react";
import { useOwnershipSignature } from "@/storage/signature";
import { TokenList } from "@/components/TokenList";

export default function Home() {
  const { address } = useAccount();
  const { signature, setSignature, getSignature } = useOwnershipSignature();
  const { signMessage } = useSignMessage({})

  const { data: balances } = useQueryTokenBalances();

  useEffect(() => {
    const verifyFunc = async () => {
      if (address) {
        if (!getSignature(address)) {
          // We use this sign function for simplicity here, you might want to use other typed solutions in actual apps
          signMessage({ message: `I am signing into Jumper Exchange` }, {
            onSuccess(data, variables, onMutateResult, context) {
              setSignature(data, address)
            },
          });
        }
      }
      // Action to execute right when the user is logged in
      verifyFunc()
    }
  }, [address, setSignature, getSignature]);

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
      <Box sx={{
        display: "flex",
        marginTop: "50px",
        marginBottom: "50px",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-end",
        gap: 2
      }}>
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
            color: "text.primary"
          }}
          boxShadow={3}
        >

          {!address && <><Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome to the Token Explorer
          </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
              Connect your wallet to get started — we only need your address.
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <ConnectButton />
            </Box></>
          }

          {address &&
            <>{
              balances && <>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <ConnectButton />
                </Box>
                <TokenList tokens={balances} />
              </>
            }
              {
                !balances && <><Box sx={{ marginBottom: "2em" }}>
                  <Loader />
                  <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
                    Loading Token List…
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                    Preparing your session — this may take a moment.
                  </Typography>
                </Box>
                  <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                    <ConnectButton />
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
                      Your Wallet was successfully connected.
                    </Typography>
                  </Box></>
              }

            </>
          }
        </Box></Box>
    </Box>
  );
}
