import { getTile, type CartItem } from './catalog';
// All monetary values are integer US cents, including the threshold.
export const FREE_SHIPPING_THRESHOLD_CENTS = 50_000;
export function shippingCents(subtotalCents: number): number {
  return subtotalCents > FREE_SHIPPING_THRESHOLD_CENTS ? 0 : 2500;
}
export function calculateTotals(items: readonly CartItem[]) {
  const subtotal = items.reduce(
    (sum, item) => sum + getTile(item.tileId).priceCents * item.quantity,
    0,
  );
  const shipping = shippingCents(subtotal);
  return { subtotal, shipping, total: subtotal + shipping };
}
export const money = (cents: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
