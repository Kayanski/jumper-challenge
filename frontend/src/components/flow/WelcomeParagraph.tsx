import { Box, Typography } from "@mui/material";
import { SecondaryText } from "../Text";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function WelcomeParagraph() {
    return (<>
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
    </>)

}