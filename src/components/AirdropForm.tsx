"use client";

import { useState, useMemo, useEffect } from "react";
import { RiAlertFill, RiInformationLine } from "react-icons/ri";
import {
  useChainId,
  useWriteContract,
  useAccount,
  useWaitForTransactionReceipt,
  useReadContracts,
} from "wagmi";
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants";
import { readContract, getTransactionCount } from "@wagmi/core";
import { useConfig } from "wagmi";
import { CgSpinner } from "react-icons/cg";
import { InputForm } from "./ui/InputField";
import { Tabs, TabsList, TabsTrigger } from "./ui/Tabs";
import { waitForTransactionReceipt } from "@wagmi/core";
import { calculateAmountsInWei, calculateTotalInWei } from "@/utils"
import { formatTokenAmount, formatBalance } from "@/utils";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AirdropFormProps {
  isUnsafeMode: boolean;
  onModeChange: (unsafe: boolean) => void;
}

export default function AirdropForm({ isUnsafeMode, onModeChange }: AirdropFormProps) {
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipients, setRecipients] = useState("");
  const [amounts, setAmounts] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const config = useConfig();
  const account = useAccount();
  const chainId = useChainId();

  const { data: tokenData, error: tokenDataError } = useReadContracts({
    contracts: [
      {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "decimals",
      },
      {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "name",
      },
      {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "balanceOf",
        args: [account.address],
      },
    ],
  });

  const [hasEnoughTokens, setHasEnoughTokens] = useState(true);
  const { data: hash, isPending, error: writeError, writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, isError } = useWaitForTransactionReceipt({
    confirmations: 1,
    hash,
  });

  const amountsInWei = useMemo(() => calculateAmountsInWei(amounts), [amounts]);
  const totalInWei = useMemo(() => calculateTotalInWei(amountsInWei), [amountsInWei]);
  const recipientList = useMemo(
    () => recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ""),
    [recipients]
  );

  const balanceInTokens = useMemo(() => {
    return formatBalance(tokenData?.[2]?.result as bigint, tokenData?.[0]?.result as number);
  }, [tokenData]);

  // Validate inputs
  const isValidAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address.trim());
  };

  const validateInputs = () => {
    setErrorMessage(null);

    if (!tokenAddress || !isValidAddress(tokenAddress)) {
      const message = "Please enter a valid token address (0x followed by 40 hex characters).";
      setErrorMessage(message);
      toast.error(message, { position: "top-center", autoClose: 5000 });
      return false;
    }

    if (recipientList.length === 0) {
      const message = "Please enter at least one recipient address.";
      setErrorMessage(message);
      toast.error(message, { position: "top-center", autoClose: 5000 });
      return false;
    }
    if (!recipientList.every(isValidAddress)) {
      const message = "All recipient addresses must be valid Ethereum addresses.";
      setErrorMessage(message);
      toast.error(message, { position: "top-center", autoClose: 5000 });
      return false;
    }

    if (amountsInWei.length === 0) {
      const message = "Please enter at least one valid, non-negative amount.";
      setErrorMessage(message);
      toast.error(message, { position: "top-center", autoClose: 5000 });
      return false;
    }
    if (amountsInWei.length !== recipientList.length) {
      const message = `The number of recipients (${recipientList.length}) must match the number of amounts (${amountsInWei.length}).`;
      setErrorMessage(message);
      toast.error(message, { position: "top-center", autoClose: 5000 });
      return false;
    }

    if (tokenDataError || tokenData?.some(result => result.status === "failure")) {
      const message = "Failed to fetch token data. Ensure the token address is valid.";
      setErrorMessage(message);
      toast.error(message, { position: "top-center", autoClose: 5000 });
      return false;
    }

    return true;
  };

  async function handleSubmit() {
    if (!validateInputs()) {
      return;
    }

    const contractType = isUnsafeMode ? "no_check" : "tsender";
    const tSenderAddress = chainsToTSender[chainId]?.[contractType];

    if (!tSenderAddress) {
      const message = "This chain only supports the safer version or is not supported.";
      setErrorMessage(message);
      toast.error(message, { position: "top-center", autoClose: 5000 });
      return;
    }

    try {
      const nonce = await getTransactionCount(config, {
        address: account.address!,
        blockTag: "pending",
      });

      const result = await getApprovedAmount(tSenderAddress);

      if (result < totalInWei) {
        const approvalHash = await writeContractAsync({
          abi: erc20Abi,
          address: tokenAddress as `0x${string}`,
          functionName: "approve",
          args: [tSenderAddress as `0x${string}`, totalInWei],
          gas: BigInt(100000),
          nonce,
        });
        const approvalReceipt = await waitForTransactionReceipt(config, {
          hash: approvalHash,
          confirmations: 1,
        });
        console.log("Approval confirmed:", approvalReceipt);
        toast.success("Token approval successful!", { position: "top-center", autoClose: 3000 });
      }

      const airdropHash = await writeContractAsync({
        abi: tsenderAbi,
        address: tSenderAddress as `0x${string}`,
        functionName: "airdropERC20",
        args: [tokenAddress, recipientList as `0x${string}`[], amountsInWei, totalInWei],
        gas: BigInt(50000 + 30000 * recipientList.length),
        nonce: nonce + (result < totalInWei ? 1 : 0),
      });

      console.log("Airdrop transaction hash:", airdropHash);
      setErrorMessage(null);
      toast.success("Airdrop transaction sent!", { position: "top-center", autoClose: 5000 });
    } catch (e: any) {
      const message = `Transaction failed: ${e.message || "Unknown error"}`;
      console.error("Transaction failed:", e);
      setErrorMessage(message);
      toast.error(message, { position: "top-center", autoClose: 5000 });
    }
  }

  async function getApprovedAmount(tSenderAddress: string | null): Promise<bigint> {
    if (!tSenderAddress) {
      const message = "This chain only has the safer version!";
      setErrorMessage(message);
      toast.error(message, { position: "top-center", autoClose: 5000 });
      return BigInt(0);
    }
    try {
      const response = await readContract(config, {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "allowance",
        args: [account.address, tSenderAddress as `0x${string}`],
      });
      return response as bigint;
    } catch (e: any) {
      const message = `Failed to fetch allowance: ${e.message || "Unknown error"}`;
      console.error("Failed to fetch allowance:", e);
      setErrorMessage(message);
      toast.error(message, { position: "top-center", autoClose: 5000 });
      return BigInt(0);
    }
  }

  function getButtonContent() {
    if (isPending) {
      return (
        <div className="flex items-center justify-center gap-2 w-full">
          <CgSpinner className="animate-spin" size={20} />
          <span>Confirming in wallet...</span>
        </div>
      );
    }
    if (isConfirming) {
      return (
        <div className="flex items-center justify-center gap-2 w-full">
          <CgSpinner className="animate-spin" size={20} />
          <span>Waiting for transaction to be included...</span>
        </div>
      );
    }
    if (writeError || isError) {
      return (
        <div className="flex items-center justify-center gap-2 w-full">
          <span>{`Error: ${writeError?.message || "See console for details"}`}</span>
        </div>
      );
    }
    return !account.isConnected
      ? "Connect Wallet"
      : !hasEnoughTokens && tokenAddress
      ? "Insufficient token balance"
      : isUnsafeMode
      ? "Send Tokens (Unsafe)"
      : "Send Tokens";
  }

  useEffect(() => {
    const savedTokenAddress = localStorage.getItem("tokenAddress");
    const savedRecipients = localStorage.getItem("recipients");
    const savedAmounts = localStorage.getItem("amounts");

    if (savedTokenAddress) setTokenAddress(savedTokenAddress);
    if (savedRecipients) setRecipients(savedRecipients);
    if (savedAmounts) setAmounts(savedAmounts);
  }, []);

  useEffect(() => {
    localStorage.setItem("tokenAddress", tokenAddress);
  }, [tokenAddress]);

  useEffect(() => {
    localStorage.setItem("recipients", recipients);
  }, [recipients]);

  useEffect(() => {
    localStorage.setItem("amounts", amounts);
  }, [amounts]);

  useEffect(() => {
    if (tokenAddress && totalInWei > 0 && tokenData?.[2]?.result !== undefined) {
      const userBalance = tokenData?.[2].result as bigint;
      setHasEnoughTokens(userBalance >= totalInWei);
    } else {
      setHasEnoughTokens(true);
    }
  }, [tokenAddress, totalInWei, tokenData]);

  const isTokenDataLoaded = tokenData?.[0]?.result !== undefined && tokenData?.[1]?.result !== undefined && tokenData?.[2]?.result !== undefined;

  return (
    <div
      className={`max-w-2xl min-w-full xl:min-w-lg w-full lg:mx-auto p-6 flex flex-col gap-6 bg-white rounded-xl ring-[4px] border-2 ${
        isUnsafeMode ? "border-red-500 ring-red-500/25" : "border-blue-500 ring-blue-500/25"
      }`}
    >
      <ToastContainer />
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-zinc-900">T-Sender</h2>
        <Tabs defaultValue="false">
          <TabsList>
            <TabsTrigger value="false" onClick={() => onModeChange(false)}>
              Safe Mode
            </TabsTrigger>
            <TabsTrigger value="true" onClick={() => onModeChange(true)}>
              Unsafe Mode
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-6">
        {errorMessage && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-3">
            <RiAlertFill size={20} />
            <span>{errorMessage}</span>
          </div>
        )}
        <InputForm
          label="Token Address"
          placeholder="0x (ERC20 contract address)"
          value={tokenAddress}
          onChange={e => setTokenAddress(e.target.value)}
        />
        <InputForm
          label={`Recipients (comma or new line separated, ${recipientList.length} entered)`}
          placeholder="0x123..., 0x456... (one per amount)"
          value={recipients}
          onChange={e => setRecipients(e.target.value)}
          large={true}
        />
        <InputForm
          label={`Amounts (Tokens; comma or new line separated, ${amountsInWei.length} entered)`}
          placeholder="1.5, 2.0, 0.5 (must match number of recipients)"
          value={amounts}
          onChange={e => setAmounts(e.target.value)}
          large={true}
        />

        <div className="bg-white border border-zinc-300 rounded-lg p-4">
          <h3 className="text-sm font-medium text-zinc-900 mb-3">Transaction Details</h3>
          {isTokenDataLoaded ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-600">Token Name:</span>
                <span className="font-mono text-zinc-900">{tokenData?.[1]?.result as string}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-600">Sender Balance (Tokens):</span>
                <span className="font-mono text-zinc-900">{balanceInTokens}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-600">Amount (Wei):</span>
                <span className="font-mono text-zinc-900">{totalInWei.toString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-600">Amount (Tokens):</span>
                <span className="font-mono text-zinc-900">
                  {formatTokenAmount(totalInWei, tokenData?.[0]?.result as number)}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-zinc-600">
              {tokenDataError ? "Error loading token data" : "Loading token data..."}
            </div>
          )}
        </div>

        {isConfirmed && hash && (
          <div className="bg-white border border-zinc-300 rounded-lg p-4">
            <h3 className="text-sm font-medium text-zinc-900 mb-3">Transaction Hash</h3>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-600">Hash:</span>
              <span className="font-mono text-zinc-900 break-all">{hash}</span>
            </div>
          </div>
        )}

        {isUnsafeMode && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RiAlertFill size={20} />
              <span>
                Using <span className="font-medium underline underline-offset-2 decoration-2 decoration-red-300">unsafe</span> super gas optimized mode
              </span>
            </div>
            <div className="relative group">
              <RiInformationLine className="cursor-help w-5 h-5 opacity-45" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-64">
                This mode skips certain safety checks to optimize for gas. Do not use this mode unless you know how to verify the calldata of your transaction.
                <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1 border-8 border-transparent border-t-zinc-900"></div>
              </div>
            </div>
          </div>
        )}

        <button
          className={`cursor-pointer flex items-center justify-center w-full py-3 rounded-[9px] text-white transition-colors font-semibold relative border ${
            isUnsafeMode ? "bg-red-500 hover:bg-red-600 border-red-500" : "bg-blue-500 hover:bg-blue-600 border-blue-500"
          } ${!hasEnoughTokens && tokenAddress ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleSubmit}
          disabled={isPending || (!hasEnoughTokens && tokenAddress !== "") || !account.isConnected}
        >
          <div className="absolute w-full inset-0 bg-gradient-to-b from-white/25 via-80% to-transparent mix-blend-overlay z-10 rounded-lg" />
          <div className="absolute w-full inset-0 mix-blend-overlay z-10 inner-shadow rounded-lg" />
          <div className="absolute w-full inset-0 mix-blend-overlay z-10 border-[1.5px] border-white/20 rounded-lg" />
          {getButtonContent()}
        </button>
      </div>
    </div>
  );
}