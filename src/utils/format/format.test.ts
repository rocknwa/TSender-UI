import { describe, it, expect } from "vitest";
import { formatTokenAmount, formatBalance } from "./format";

describe("formatTokenAmount", () => {
    it("formats whole numbers correctly with 18 decimals", () => {
        expect(formatTokenAmount(BigInt("1000000000000000000"), 18)).toBe("1");
    });

    it("handles different decimal places (e.g., 6 decimals like USDC)", () => {
        expect(formatTokenAmount(BigInt("1234000000"), 6)).toBe("1234");
    });

    it("handles small numbers with 18 decimals", () => {
        expect(formatTokenAmount(BigInt("100"), 18)).toBe("0.0000000000000001");
    });

    it("handles small numbers with 6 decimals", () => {
        expect(formatTokenAmount(BigInt("123"), 6)).toBe("0.000123");
    });

    it("handles zero", () => {
        expect(formatTokenAmount(BigInt(0), 18)).toBe("0");
    });

    it("handles large numbers with 18 decimals", () => {
        expect(formatTokenAmount(BigInt("1234000000000000000000"), 18)).toBe("1234");
    });

    it("respects decimal precision for 6 decimal token", () => {
        expect(formatTokenAmount(BigInt("1234567"), 6)).toBe("1.234567");
    });

    it("handles undefined decimals", () => {
        expect(formatTokenAmount(BigInt("1000000000000000000"), undefined)).toBe("0");
    });

    it("handles undefined amount", () => {
        expect(formatTokenAmount(undefined as any, 18)).toBe("0");
    });

    it("handles high precision with 6 decimals", () => {
        expect(formatTokenAmount(BigInt("123456789"), 6)).toBe("123.456789");
    });
});

describe("formatBalance", () => {
    it("formats balance correctly with 18 decimals", () => {
        expect(formatBalance(BigInt("1000000000000000000"), 18)).toBe("1");
    });

    it("handles different decimal places (e.g., 6 decimals like USDC)", () => {
        expect(formatBalance(BigInt("1234000000"), 6)).toBe("1234");
    });

    it("handles small balance with 18 decimals", () => {
        expect(formatBalance(BigInt("100"), 18)).toBe("0.0000000000000001");
    });

    it("handles small balance with 6 decimals", () => {
        expect(formatBalance(BigInt("123"), 6)).toBe("0.000123");
    });

    it("handles zero balance", () => {
        expect(formatBalance(BigInt(0), 18)).toBe("0");
    });

    it("handles undefined balance or decimals", () => {
        expect(formatBalance(undefined as any, 18)).toBe("0");
        expect(formatBalance(BigInt("1000000000000000000"), undefined)).toBe("0");
    });

    it("handles high precision with 6 decimals", () => {
        expect(formatBalance(BigInt("123456789"), 6)).toBe("123.456789");
    });
});