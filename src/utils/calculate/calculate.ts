import { parseEther } from "viem";

export function calculateAmountsInWei(amounts: string | null | undefined): bigint[] {
    if (!amounts || amounts.trim() === '') {
        return [];
    }
    try {
        return amounts
            .split(/[,\n]+/)
            .map(amt => amt.trim())
            .filter(amt => amt !== '')
            .map(amt => {
                try {
                    return parseEther(amt);
                } catch {
                    return null; // Return null for invalid numbers
                }
            })
            .filter((amt): amt is bigint => amt !== null); // Filter out null values
    } catch (e) {
        console.error("Invalid amount input:", e);
        return [];
    }
}

export function calculateTotalInWei(amountsInWei: bigint[]): bigint {
    return amountsInWei.reduce((sum, amt) => sum + amt, BigInt(0));
}

export function parseAmounts(amounts: string | null | undefined): number[] {
    if (!amounts || amounts.trim() === '') {
        return [];
    }
    try {
        return amounts
            .split(/[,\n]+/)
            .map(amt => amt.trim())
            .filter(amt => amt !== '')
            .map(amt => {
                const num = Number(amt);
                if (isNaN(num)) {
                    return 0; // Ignore invalid numbers
                }
                return num;
            });
    } catch (e) {
        console.error("Invalid amount input:", e);
        return [];
    }
}