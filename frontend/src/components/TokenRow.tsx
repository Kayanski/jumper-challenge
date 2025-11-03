import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { TokenBalanceWithInfo } from "@/hooks/useQueryTokenBalances";
import { useState } from "react";

export enum TokenRowMode {
  DEFAULT,
  SPAM,
}

export function TokenRow({
  token,
  mode = TokenRowMode.DEFAULT,
}: {
  token: TokenBalanceWithInfo;
  mode?: TokenRowMode;
}) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyToClipboard = (address: `0x${string}`) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const shortenAddress = (address: `0x${string}`) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTokenBalance = (
    balance: bigint,
    decimals = 18,
    maxFraction = 6,
  ) => {
    try {
      const factor = BigInt(10 ** decimals);
      const decimaledBalance = balance / factor;
      decimaledBalance.toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumSignificantDigits: 1,
      });
    } catch {
      // fallback if BigInt fails
      const n = Number(balance) / 10 ** decimals;
      return n.toFixed(Math.min(maxFraction, 6)).replace(/\.?0+$/, "");
    }
  };

  const tokenNameDeservesSlicing = (tokenName: string) => {
    return mode == TokenRowMode.SPAM && tokenName.length > 25;
  };
  const formatTokenName = (tokenName: string) => {
    if (tokenNameDeservesSlicing(tokenName)) {
      return tokenName.slice(0, 22) + "...";
    }
    return tokenName;
  };

  const tokenSymbolDeservesSlicing = (tokenSymbol: string) => {
    return mode == TokenRowMode.SPAM && tokenSymbol.length > 10;
  };
  const formatTokenSymbol = (tokenSymbol: string) => {
    if (tokenSymbolDeservesSlicing(tokenSymbol)) {
      return tokenSymbol.slice(0, 7) + "...";
    }
    return tokenSymbol;
  };

  return (
    <Card
      sx={{
        bgcolor: "rgba(30, 41, 59, 0.5)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(100, 116, 139, 0.3)",
        transition: "all 0.3s ease",
        "&:hover": {
          bgcolor: "rgba(30, 41, 59, 0.7)",
          borderColor: "rgba(168, 85, 247, 0.5)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* Token Logo */}
          <Tooltip title={token.logo ? token.name : "No logo available"}>
            <Avatar
              src={token.logo || ""}
              alt={token.name}
              sx={{
                width: 56,
                height: 56,
                bgcolor: "rgba(51, 65, 85, 0.5)",
                border: "2px solid",
                borderColor: "rgba(100, 116, 139, 1)",
                transition: "border-color 0.3s ease",
                ".MuiCard-root:hover &": {
                  borderColor: "primary.main",
                },
              }}
            />
          </Tooltip>

          {/* Token Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
            >
              <Tooltip
                title={token.name}
                disableHoverListener={!tokenNameDeservesSlicing(token.name)}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "white" }}
                >
                  {formatTokenName(token.name)}
                </Typography>
              </Tooltip>
              <Tooltip
                title={token.symbol}
                disableHoverListener={!tokenSymbolDeservesSlicing(token.symbol)}
              >
                <Chip
                  label={formatTokenSymbol(token.symbol)}
                  size="small"
                  sx={{
                    bgcolor: "rgba(168, 85, 247, 0.2)",
                    color: "#d8b4fe",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  }}
                />
              </Tooltip>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                fontFamily: "monospace",
                fontSize: "0.875rem",
                textAlign: "left",
              }}
            >
              {shortenAddress(token.contractAddress)}
            </Typography>
          </Box>

          {/* Balance Info and action buttons */}
          <Box sx={{ textAlign: "right", mr: 2 }}>
            <Tooltip
              title={token.symbol}
              disableHoverListener={!tokenSymbolDeservesSlicing(token.symbol)}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "white", mb: 0.5 }}
              >
                {formatTokenBalance(token.tokenBalance, token.decimals)}{" "}
                {formatTokenSymbol(token.symbol)}
              </Typography>
            </Tooltip>

            {/* <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                            ${token.usdValue}
                                        </Typography> */}
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Copy address">
              <IconButton
                onClick={() => copyToClipboard(token.contractAddress)}
                sx={{
                  bgcolor: "rgba(51, 65, 85, 0.5)",
                  color: "rgba(255, 255, 255, 0.7)",
                  "&:hover": {
                    bgcolor: "rgba(51, 65, 85, 1)",
                    color: "white",
                  },
                }}
              >
                {copiedAddress === token.contractAddress ? (
                  <CheckIcon sx={{ fontSize: 20, color: "#4ade80" }} />
                ) : (
                  <ContentCopyIcon sx={{ fontSize: 20 }} />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="View on Etherscan">
              <IconButton
                component="a"
                href={`https://etherscan.io/address/${token.contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  bgcolor: "rgba(51, 65, 85, 0.5)",
                  color: "rgba(255, 255, 255, 0.7)",
                  "&:hover": {
                    bgcolor: "rgba(51, 65, 85, 1)",
                    color: "white",
                  },
                }}
              >
                <OpenInNewIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
