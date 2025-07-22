import { formatUnits } from "viem";

export function formatTokenAmount(amount: bigint | undefined, decimals: number | undefined): string {
    if (decimals === undefined || amount === undefined) {
        return "0";
    }
    return formatUnits(amount, decimals);
}

export function formatBalance(balance: bigint | undefined, decimals: number | undefined): string {
    if (balance === undefined || decimals === undefined) {
        return "0";
    }
    return formatUnits(balance, decimals);
}