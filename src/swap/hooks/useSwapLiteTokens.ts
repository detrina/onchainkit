import { useState } from 'react';
import type { Address } from 'viem';
import { useValue } from '../../core-react/internal/hooks/useValue';
import type { Token } from '../../token';
import { ethToken, usdcToken } from '../../token/constants';
import type { SwapLiteTokens } from '../types';
import { useSwapBalances } from './useSwapBalances';
import { useSwapLiteToken } from './useSwapLiteToken';

export const useSwapLiteTokens = (
  toToken: Token,
  fromToken?: Token,
  address?: Address,
): SwapLiteTokens => {
  const fromETH = useSwapLiteToken(toToken, ethToken, address);
  const fromUSDC = useSwapLiteToken(toToken, usdcToken, address);
  const from = useSwapLiteToken(toToken, fromToken, address);

  const [toAmount, setToAmount] = useState('');
  const [toAmountUSD, setToAmountUSD] = useState('');
  const [toLoading, setToLoading] = useState(false);

  // If the toToken is ETH, use USDC for swapQuote
  const token = toToken?.symbol === 'ETH' ? usdcToken : ethToken;

  const {
    toBalanceString: balance,
    toTokenBalanceError: error,
    toTokenResponse: balanceResponse,
  } = useSwapBalances({ address, fromToken: token, toToken });

  const to = useValue({
    balance,
    balanceResponse,
    amount: toAmount,
    setAmount: setToAmount,
    amountUSD: toAmountUSD,
    setAmountUSD: setToAmountUSD,
    token: toToken,
    loading: toLoading,
    setLoading: setToLoading,
    error,
  });

  return { fromETH, fromUSDC, from, to };
};
