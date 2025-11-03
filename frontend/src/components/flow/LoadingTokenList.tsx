import { Box, Typography } from "@mui/material";
import Loader from "../Loader";
import { SecondaryText } from "../Text";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function LoadingTokenList() {
    return (<>
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
    </>)
}