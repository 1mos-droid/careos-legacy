import { describe, it, expect } from 'vitest';
import { calculateBookingTotal } from './booking';

describe('calculateBookingTotal', () => {
  it('should return correct duration and price for a valid range', () => {
    const result = calculateBookingTotal('2026-07-03', '2026-07-07', 100);
    expect(result.days).toBe(5);
    expect(result.price).toBe(500);
  });

  it('should return 1 day for the same start and end date', () => {
    const result = calculateBookingTotal('2026-07-03', '2026-07-03', 150);
    expect(result.days).toBe(1);
    expect(result.price).toBe(150);
  });

  it('should return 0 days and price if end date is before start date', () => {
    const result = calculateBookingTotal('2026-07-07', '2026-07-03', 100);
    expect(result.days).toBe(0);
    expect(result.price).toBe(0);
  });

  it('should return 0 days and price if parameters are missing', () => {
    expect(calculateBookingTotal('', '2026-07-03', 100)).toEqual({ days: 0, price: 0 });
    expect(calculateBookingTotal('2026-07-03', '', 100)).toEqual({ days: 0, price: 0 });
    expect(calculateBookingTotal('2026-07-03', '2026-07-07', null)).toEqual({ days: 0, price: 0 });
  });

  it('should return 0 days and price for invalid date inputs', () => {
    const result = calculateBookingTotal('not-a-date', '2026-07-03', 100);
    expect(result.days).toBe(0);
    expect(result.price).toBe(0);
  });

  it('should handle zero or negative rates correctly', () => {
    const resultZero = calculateBookingTotal('2026-07-03', '2026-07-05', 0);
    expect(resultZero.days).toBe(3);
    expect(resultZero.price).toBe(0);

    const resultNegative = calculateBookingTotal('2026-07-03', '2026-07-05', -50);
    expect(resultNegative.days).toBe(3);
    expect(resultNegative.price).toBe(0);
  });
});
