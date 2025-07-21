import { formatEther } from "viem";

export function formatTokenAmount(amount: bigint, decimals?: number): string {
    if (decimals === undefined || amount === undefined) {
        return "0";
    }
    // Adjust amount to 18 decimals (Ether-like) before formatting
    const adjustedAmount = amount * BigInt(10 ** (18 - decimals));
    return formatEther(adjustedAmount);
}

export function formatBalance(balance: bigint, decimals?: number): string {
    if (balance === undefined || decimals === undefined) {
        return "0";
    }
    // Adjust balance to 18 decimals (Ether-like) before formatting
    const adjustedBalance = balance * BigInt(10 ** (18 - decimals));
    return formatEther(adjustedBalance);
}