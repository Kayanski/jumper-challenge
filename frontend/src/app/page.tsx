"use client"
import { Box, Button, Typography, useTheme } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSignMessage } from "wagmi";
import Loader from "../components/Loader";
import { ThemeToggle } from "../components/ThemeToggle";
import { useQueryTokenBalances } from "@/hooks/useQueryTokenBalances";
import { useCallback, useEffect, useState } from "react";
import { useOwnershipSignature } from "@/storage/signature";
import { TokenList } from "@/components/TokenList";
import { useIsConnected } from "@/hooks/useIsConnected";
import { useAccountCreation, useAccountDelete } from "@/hooks/useAccountCreation";

export default function Home() {
  const { address } = useAccount();
  const { signature, setSignature, getSignature } = useOwnershipSignature();
  const { signMessage } = useSignMessage({})

  const { data: balances } = useQueryTokenBalances();
  const { data: isConnected } = useIsConnected();

  const [isCreatingAccount, setIsCreatingAccount] = useState(false)

  const { mutateAsync: createAccount } = useAccountCreation();
  const { mutateAsync: deleteAccount } = useAccountDelete();

  const signAndCreateAccount = useCallback(async () => {
    setIsCreatingAccount(true)
    if (address) {
      const signature = getSignature(address)
      if (!signature) {
        signMessage({ message: `I am signing into Jumper Exchange` }, {
          onSuccess(data) {
            setSignature(data, address);
            createAccount({ signature: data }).finally(() => {
              setIsCreatingAccount(false)
            });
          },
          onError() {
            setIsCreatingAccount(false)
          }
        });
      } else {
        createAccount({ signature }).finally(() => {
          setIsCreatingAccount(false)
        });
      }
    }

  }, [address, signature, createAccount, setIsCreatingAccount]);

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
        <Box sx={{ display: "flex", gap: 2 }}>
          {signature && <Button onClick={() => deleteAccount({ signature })}>Delete Account</Button>}<ThemeToggle />
        </Box>
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
          {address && !isConnected && <>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              {!isCreatingAccount && <Button
                variant="contained"
                color="primary"
                onClick={() => signAndCreateAccount()}
                sx={{
                  textTransform: "none",
                  borderRadius: 3,
                  px: 4,
                  py: 1.2,
                  fontWeight: 700,
                  boxShadow: 3,
                }}
              >
                Verify Account
              </Button>
              }
              {isCreatingAccount && <Loader />}
            </Box>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              This is needed in order to fetch your account balance
            </Typography>
          </>}

          {address && isConnected &&
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
