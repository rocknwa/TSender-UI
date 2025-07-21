import { describe, it, expect } from "vitest";
import { calculateAmountsInWei, calculateTotalInWei, parseAmounts } from "./calculate";

describe("calculateAmountsInWei", () => {
    describe("empty and null inputs", () => {
        it("should return empty array for empty string", () => {
            expect(calculateAmountsInWei("")).toEqual([]);
        });

        it("should return empty array for whitespace-only string", () => {
            expect(calculateAmountsInWei("   ")).toEqual([]);
            expect(calculateAmountsInWei("\n\n")).toEqual([]);
            expect(calculateAmountsInWei("\t")).toEqual([]);
        });

        it("should return empty array for null/undefined inputs", () => {
            expect(calculateAmountsInWei(null)).toEqual([]);
            expect(calculateAmountsInWei(undefined)).toEqual([]);
        });
    });

    describe("single values", () => {
        it("should handle single positive number", () => {
            expect(calculateAmountsInWei("10")).toEqual([BigInt("10000000000000000000")]);
        });

        it("should handle single decimal number", () => {
            expect(calculateAmountsInWei("3.14")).toEqual([BigInt("3140000000000000000")]);
        });

        it("should handle single zero", () => {
            expect(calculateAmountsInWei("0")).toEqual([BigInt("0")]);
        });
    });

    describe("comma-separated values", () => {
        it("should parse comma-separated numbers", () => {
            expect(calculateAmountsInWei("1,2,3")).toEqual([
                BigInt("1000000000000000000"),
                BigInt("2000000000000000000"),
                BigInt("3000000000000000000"),
            ]);
        });

        it("should parse comma-separated decimals", () => {
            expect(calculateAmountsInWei("1.5,2.5,3.0")).toEqual([
                BigInt("1500000000000000000"),
                BigInt("2500000000000000000"),
                BigInt("3000000000000000000"),
            ]);
        });

        it("should handle comma-separated with spaces", () => {
            expect(calculateAmountsInWei("1 , 2 , 3")).toEqual([
                BigInt("1000000000000000000"),
                BigInt("2000000000000000000"),
                BigInt("3000000000000000000"),
            ]);
        });
    });

    describe("newline-separated values", () => {
        it("should parse newline-separated numbers", () => {
            expect(calculateAmountsInWei("1\n2\n3")).toEqual([
                BigInt("1000000000000000000"),
                BigInt("2000000000000000000"),
                BigInt("3000000000000000000"),
            ]);
        });

        it("should parse newline-separated decimals", () => {
            expect(calculateAmountsInWei("1.5\n2.5\n1")).toEqual([
                BigInt("1500000000000000000"),
                BigInt("2500000000000000000"),
                BigInt("1000000000000000000"),
            ]);
        });
    });

    describe("mixed separators", () => {
        it("should handle both commas and newlines", () => {
            expect(calculateAmountsInWei("1,2\n3")).toEqual([
                BigInt("1000000000000000000"),
                BigInt("2000000000000000000"),
                BigInt("3000000000000000000"),
            ]);
        });

        it("should handle complex mixed format", () => {
            expect(calculateAmountsInWei("1.5,2\n3.5")).toEqual([
                BigInt("1500000000000000000"),
                BigInt("2000000000000000000"),
                BigInt("3500000000000000000"),
            ]);
        });
    });

    describe("edge cases and invalid inputs", () => {
        it("should handle invalid number strings", () => {
            expect(calculateAmountsInWei("1,abc,3")).toEqual([
                BigInt("1000000000000000000"),
                BigInt("3000000000000000000"),
            ]);
        });

        it("should handle empty values between separators", () => {
            expect(calculateAmountsInWei("1,,3")).toEqual([
                BigInt("1000000000000000000"),
                BigInt("3000000000000000000"),
            ]);
            expect(calculateAmountsInWei("1,\n,3")).toEqual([
                BigInt("1000000000000000000"),
                BigInt("3000000000000000000"),
            ]);
        });

        it("should handle trailing separators", () => {
            expect(calculateAmountsInWei("1,2,3,")).toEqual([
                BigInt("1000000000000000000"),
                BigInt("2000000000000000000"),
                BigInt("3000000000000000000"),
            ]);
            expect(calculateAmountsInWei("1\n2\n3\n")).toEqual([
                BigInt("1000000000000000000"),
                BigInt("2000000000000000000"),
                BigInt("3000000000000000000"),
            ]);
        });

        it("should handle leading separators", () => {
            expect(calculateAmountsInWei(",1,2,3")).toEqual([
                BigInt("1000000000000000000"),
                BigInt("2000000000000000000"),
                BigInt("3000000000000000000"),
            ]);
            expect(calculateAmountsInWei("\n1\n2\n3")).toEqual([
                BigInt("1000000000000000000"),
                BigInt("2000000000000000000"),
                BigInt("3000000000000000000"),
            ]);
        });

        it("should handle multiple consecutive separators", () => {
            expect(calculateAmountsInWei("1,,,2\n\n\n3")).toEqual([
                BigInt("1000000000000000000"),
                BigInt("2000000000000000000"),
                BigInt("3000000000000000000"),
            ]);
        });

        it("should handle only invalid inputs", () => {
            expect(calculateAmountsInWei("abc,def,xyz")).toEqual([]);
        });
    });
});

describe("calculateTotalInWei", () => {
    it("should sum bigint array correctly", () => {
        expect(
            calculateTotalInWei([
                BigInt("1000000000000000000"),
                BigInt("2000000000000000000"),
                BigInt("3000000000000000000"),
            ])
        ).toBe(BigInt("6000000000000000000"));
    });

    it("should handle empty array", () => {
        expect(calculateTotalInWei([])).toBe(BigInt(0));
    });

    it("should handle single value", () => {
        expect(calculateTotalInWei([BigInt("1000000000000000000")])).toBe(
            BigInt("1000000000000000000")
        );
    });

    it("should handle zero values", () => {
        expect(calculateTotalInWei([BigInt(0), BigInt(0)])).toBe(BigInt(0));
    });
});

describe("parseAmounts", () => {
    describe("empty and null inputs", () => {
        it("should return empty array for empty string", () => {
            expect(parseAmounts("")).toEqual([]);
        });

        it("should return empty array for whitespace-only string", () => {
            expect(parseAmounts("   ")).toEqual([]);
            expect(parseAmounts("\n\n")).toEqual([]);
            expect(parseAmounts("\t")).toEqual([]);
        });

        it("should return empty array for null/undefined inputs", () => {
            expect(parseAmounts(null)).toEqual([]);
            expect(parseAmounts(undefined)).toEqual([]);
        });
    });

    describe("single values", () => {
        it("should handle single positive number", () => {
            expect(parseAmounts("10")).toEqual([10]);
        });

        it("should handle single negative number", () => {
            expect(parseAmounts("-5")).toEqual([-5]);
        });

        it("should handle single decimal number", () => {
            expect(parseAmounts("3.14")).toEqual([3.14]);
        });

        it("should handle single zero", () => {
            expect(parseAmounts("0")).toEqual([0]);
        });
    });

    describe("comma-separated values", () => {
        it("should parse comma-separated integers", () => {
            expect(parseAmounts("1,2,3,4")).toEqual([1, 2, 3, 4]);
        });

        it("should parse comma-separated decimals", () => {
            expect(parseAmounts("1.5,2.5,3.0")).toEqual([1.5, 2.5, 3.0]);
        });

        it("should handle mixed positive and negative numbers", () => {
            expect(parseAmounts("10,-5,3")).toEqual([10, -5, 3]);
        });

        it("should handle comma-separated with spaces", () => {
            expect(parseAmounts("1 , 2 , 3")).toEqual([1, 2, 3]);
        });
    });

    describe("newline-separated values", () => {
        it("should parse newline-separated integers", () => {
            expect(parseAmounts("1\n2\n3")).toEqual([1, 2, 3]);
        });

        it("should parse newline-separated decimals", () => {
            expect(parseAmounts("1.5\n2.5\n1")).toEqual([1.5, 2.5, 1]);
        });

        it("should handle mixed positive and negative numbers", () => {
            expect(parseAmounts("10\n-3\n2")).toEqual([10, -3, 2]);
        });
    });

    describe("mixed separators", () => {
        it("should handle both commas and newlines", () => {
            expect(parseAmounts("1,2\n3,4")).toEqual([1, 2, 3, 4]);
        });

        it("should handle complex mixed format", () => {
            expect(parseAmounts("1.5,2\n3.5\n4,5.5")).toEqual([1.5, 2, 3.5, 4, 5.5]);
        });
    });

    describe("edge cases and invalid inputs", () => {
        it("should ignore invalid number strings", () => {
            expect(parseAmounts("1,abc,3")).toEqual([1, 0, 3]);
        });

        it("should ignore empty values between separators", () => {
            expect(parseAmounts("1,,3")).toEqual([1, 3]);
            expect(parseAmounts("1,\n,3")).toEqual([1, 3]);
        });

        it("should handle trailing separators", () => {
            expect(parseAmounts("1,2,3,")).toEqual([1, 2, 3]);
            expect(parseAmounts("1\n2\n3\n")).toEqual([1, 2, 3]);
        });

        it("should handle leading separators", () => {
            expect(parseAmounts(",1,2,3")).toEqual([1, 2, 3]);
            expect(parseAmounts("\n1\n2\n3")).toEqual([1, 2, 3]);
        });

        it("should handle multiple consecutive separators", () => {
            expect(parseAmounts("1,,,2\n\n\n3")).toEqual([1, 2, 3]);
        });

        it("should handle only invalid inputs", () => {
            expect(parseAmounts("abc,def,xyz")).toEqual([0, 0, 0]);
        });

        it("should handle scientific notation", () => {
            expect(parseAmounts("1e2,2e1")).toEqual([100, 20]);
        });
    });

    describe("real-world scenarios", () => {
        it("should handle invoice amounts", () => {
            const invoiceAmounts = `125.50
                87.25
                200.00
                45.75`;
            expect(parseAmounts(invoiceAmounts)).toEqual([125.5, 87.25, 200, 45.75]);
        });

        it("should handle expense report with commas", () => {
            expect(parseAmounts("12.50, 8.75, 25.00, 6.25")).toEqual([12.5, 8.75, 25, 6.25]);
        });

        it("should handle mixed format expense list", () => {
            const expenses = `15.25, 8.50
                12.75
                22.00, 5.50`;
            expect(parseAmounts(expenses)).toEqual([15.25, 8.5, 12.75, 22, 5.5]);
        });
    });
});