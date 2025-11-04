import { Box, IconButton, Tooltip } from "@mui/material";
import { useState } from "react";
import { Chain } from "viem";

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export function AddressButtons({ address, chain }: { address: `0x${string}`, chain: Chain | undefined }) {

    const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
    const copyToClipboard = (address: `0x${string}`) => {
        navigator.clipboard.writeText(address);
        setCopiedAddress(address);
        setTimeout(() => setCopiedAddress(null), 2000);
    };
    return (<Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title="Copy address">
            <IconButton
                onClick={() => copyToClipboard(address)}
                sx={{
                    bgcolor: 'background.paper',
                    color: 'text.secondary',
                    '&:hover': {
                        bgcolor: 'rgba(51, 65, 85, 1)',
                        color: 'white',
                    },
                }}
            >
                {copiedAddress === address ? (
                    <CheckIcon sx={{ fontSize: 20, color: '#4ade80' }} />
                ) : (
                    <ContentCopyIcon sx={{ fontSize: 20 }} />
                )}
            </IconButton>
        </Tooltip>
        <Tooltip title={`View on ${chain?.blockExplorers?.default.name}`}>
            <IconButton
                component="a"
                href={`${chain?.blockExplorers?.default.url}/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                    bgcolor: 'background.paper',
                    color: 'text.secondary',
                    '&:hover': {
                        bgcolor: 'rgba(51, 65, 85, 1)',
                        color: 'white',
                    },
                }}
            >
                <OpenInNewIcon sx={{ fontSize: 20 }} />
            </IconButton>
        </Tooltip> </Box>)
}