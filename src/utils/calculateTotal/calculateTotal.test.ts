import { describe, it, expect } from 'vitest';
import {calculateTotal}  from './calculateTotal';

describe('calculateTotal', () => {
  describe('empty and null inputs', () => {
    it('should return 0 for empty string', () => {
      expect(calculateTotal('')).toBe(0);
    });

    it('should return 0 for whitespace-only string', () => {
      expect(calculateTotal('   ')).toBe(0);
      expect(calculateTotal('\n\n')).toBe(0);
      expect(calculateTotal('\t')).toBe(0);
    });

    it('should return 0 for null/undefined-like inputs', () => {
      expect(calculateTotal(null as any)).toBe(0);
      expect(calculateTotal(undefined as any)).toBe(0);
    });
  });

  describe('single values', () => {
    it('should handle single positive number', () => {
      expect(calculateTotal('10')).toBe(10);
    });

    it('should handle single negative number', () => {
      expect(calculateTotal('-5')).toBe(-5);
    });

    it('should handle single decimal number', () => {
      expect(calculateTotal('3.14')).toBe(3.14);
    });

    it('should handle single zero', () => {
      expect(calculateTotal('0')).toBe(0);
    });
  });

  describe('comma-separated values', () => {
    it('should sum comma-separated integers', () => {
      expect(calculateTotal('1,2,3,4')).toBe(10);
    });

    it('should sum comma-separated decimals', () => {
      expect(calculateTotal('1.5,2.5,3.0')).toBe(7);
    });

    it('should handle mixed positive and negative numbers', () => {
      expect(calculateTotal('10,-5,3')).toBe(8);
    });

    it('should handle comma-separated with spaces', () => {
      expect(calculateTotal('1 , 2 , 3')).toBe(6);
    });
  });

  describe('newline-separated values', () => {
    it('should sum newline-separated integers', () => {
      expect(calculateTotal('1\n2\n3')).toBe(6);
    });

    it('should sum newline-separated decimals', () => {
      expect(calculateTotal('1.5\n2.5\n1')).toBe(5);
    });

    it('should handle mixed positive and negative numbers', () => {
      expect(calculateTotal('10\n-3\n2')).toBe(9);
    });
  });

  describe('mixed separators', () => {
    it('should handle both commas and newlines', () => {
      expect(calculateTotal('1,2\n3,4')).toBe(10);
    });

    it('should handle complex mixed format', () => {
      expect(calculateTotal('1.5,2\n3.5\n4,5.5')).toBe(16.5);
    });
  });

  describe('edge cases and invalid inputs', () => {
    it('should ignore invalid number strings', () => {
      expect(calculateTotal('1,abc,3')).toBe(4);
    });

    it('should ignore empty values between separators', () => {
      expect(calculateTotal('1,,3')).toBe(4);
      expect(calculateTotal('1,\n,3')).toBe(4);
    });

    it('should handle trailing separators', () => {
      expect(calculateTotal('1,2,3,')).toBe(6);
      expect(calculateTotal('1\n2\n3\n')).toBe(6);
    });

    it('should handle leading separators', () => {
      expect(calculateTotal(',1,2,3')).toBe(6);
      expect(calculateTotal('\n1\n2\n3')).toBe(6);
    });

    it('should handle multiple consecutive separators', () => {
      expect(calculateTotal('1,,,2\n\n\n3')).toBe(6);
    });

    it('should handle only invalid inputs', () => {
      expect(calculateTotal('abc,def,xyz')).toBe(0);
    });

    it('should handle scientific notation', () => {
      expect(calculateTotal('1e2,2e1')).toBe(120); // 100 + 20
    });
  });

  describe('real-world scenarios', () => {
    it('should handle invoice amounts', () => {
      const invoiceAmounts = `125.50
        87.25
        200.00
        45.75`;
      expect(calculateTotal(invoiceAmounts)).toBe(458.5);
    });

    it('should handle expense report with commas', () => {
      expect(calculateTotal('12.50, 8.75, 25.00, 6.25')).toBe(52.5);
    });

    it('should handle mixed format expense list', () => {
      const expenses = `15.25, 8.50
        12.75
        22.00, 5.50`;
      expect(calculateTotal(expenses)).toBe(64);
    });
  });
});