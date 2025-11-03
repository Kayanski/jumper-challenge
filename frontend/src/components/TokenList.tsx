import { TokenBalanceWithInfo } from "@/hooks/useQueryTokenBalances";
import { Button, Stack } from "@mui/material";
import { TokenRow, TokenRowMode } from "./TokenRow";
import React, { useMemo, useState } from "react";

export function TokenList({ tokens }: { tokens: TokenBalanceWithInfo[] }) {
  const [safeTokens, potentialSpamTokens] = useMemo(() => {
    // We consider spams, tokens that have a large symbol length or no name/logo
    const safe: TokenBalanceWithInfo[] = [];
    const spamList: TokenBalanceWithInfo[] = [];
    tokens.forEach((token) => {
      if (token.symbol.length > 10 || !token.name) {
        spamList.push(token);
      } else {
        safe.push(token);
      }
    });
    return [safe, spamList];
  }, [tokens]);

  const [showSpam, setShowSpam] = useState(false);

  return (
    <>
      <Stack spacing={2}>
        {safeTokens.map((token, index) => (
          <TokenRow key={index} token={token} />
        ))}
      </Stack>
      <Button
        fullWidth
        onClick={() => setShowSpam(!showSpam)}
        variant="outlined"
        sx={{
          py: 1.5,
          my: 5,
          bgcolor: "rgba(30, 41, 59, 0.5)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(100, 116, 139, 0.5)",
          color: "rgba(255, 255, 255, 0.7)",
          fontWeight: 500,
          "&:hover": {
            bgcolor: "rgba(30, 41, 59, 0.7)",
            borderColor: "rgba(239, 68, 68, 0.5)",
          },
        }}
      >
        {showSpam ? "Hide" : "Show"} Potential Spam Tokens (
        {potentialSpamTokens.length})
      </Button>

      {showSpam && (
        <Stack spacing={2}>
          {potentialSpamTokens.map((token, index) => (
            <TokenRow key={index} token={token} mode={TokenRowMode.SPAM} />
          ))}
        </Stack>
      )}
    </>
  );
}
