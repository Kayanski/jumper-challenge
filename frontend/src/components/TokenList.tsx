import { TokenBalanceWithInfo } from '@/hooks/useQueryTokenBalances';
import { Button, Stack } from '@mui/material';
import { TokenRow, TokenRowMode } from './TokenRow';
import React, { useMemo, useState } from 'react';
import { SecondaryText } from './Text';

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

        {safeTokens.length === 0 && <SecondaryText>No tokens found in your account.</SecondaryText>}
      </Stack>
      {potentialSpamTokens.length !== 0 && (
        <Button
          fullWidth
          onClick={() => setShowSpam(!showSpam)}
          variant="outlined"
          sx={{
            py: 1.5,
            my: 5,
            bgcolor: 'background.default',
            backdropFilter: 'blur(10px)',
            border: '1px solid background.paper',
            color: 'text.primary',
            fontWeight: 500,
            '&:hover': {
              borderColor: 'error.main',
            },
          }}
        >
          {showSpam ? 'Hide' : 'Show'} Potential Spam Tokens ({potentialSpamTokens.length})
        </Button>
      )}

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
