import { describe, expect, it } from 'vitest';
import { calculateTotals, money, shippingCents } from '../src/lib/pricing';
import { initialCart } from '../src/store/cart';
describe('shipping: only subtotals strictly above $500 qualify', () => {
  it.each([
    [49_999, 2500],
    [50_000, 2500],
    [50_001, 0],
  ])('subtotal %i cents gives %i cents shipping', (subtotal, shipping) => {
    expect(shippingCents(subtotal)).toBe(shipping);
  });
});
describe('cart pricing in integer cents', () => {
  it('matches all four reference items and the corrected initial total', () => {
    expect(calculateTotals(initialCart)).toEqual({
      subtotal: 1_310_000,
      shipping: 0,
      total: 1_310_000,
    });
    expect(money(calculateTotals(initialCart).total)).toBe('$13,100.00');
  });
  it('applies shipping after reducing quantity below the threshold', () => {
    expect(calculateTotals([{ tileId: 'ocean', quantity: 1 }])).toEqual({
      subtotal: 2800,
      shipping: 2500,
      total: 5300,
    });
  });
  it('adds all quantities without float rounding', () => {
    expect(
      calculateTotals([
        { tileId: 'fern', quantity: 3 },
        { tileId: 'star', quantity: 2 },
      ]).subtotal,
    ).toBe(14800);
  });
  it('follows the shipping rule for an empty cart; checkout separately prevents ordering it', () => {
    expect(calculateTotals([])).toEqual({
      subtotal: 0,
      shipping: 2500,
      total: 2500,
    });
  });
});
