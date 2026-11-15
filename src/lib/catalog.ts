export const catalog = [
  { id: 'ocean', name: 'Ocean Wave', priceCents: 2800 },
  { id: 'fern', name: 'Forest Fern', priceCents: 3000 },
  { id: 'dot', name: 'Terracotta Dot', priceCents: 2600 },
  { id: 'star', name: 'Yellow Star', priceCents: 2900 },
  { id: 'arch', name: 'Terracotta Arch', priceCents: 3200 },
  { id: 'sun', name: 'Golden Curve', priceCents: 2800 },
  { id: 'midnight', name: 'Midnight Arc', priceCents: 3100 },
  { id: 'mosaic', name: 'Wildflower Mosaic', priceCents: 3400 },
  { id: 'diamond', name: 'Clay Diamond', priceCents: 3200 },
  { id: 'cross', name: 'Sage Cross', priceCents: 3000 },
  { id: 'indigo', name: 'Indigo Bloom', priceCents: 3100 },
  { id: 'herringbone', name: 'Golden Herringbone', priceCents: 2900 },
] as const;
export type TileId = (typeof catalog)[number]['id'];
export type CartItem = { tileId: TileId; quantity: number };
export function isTileId(value: string): value is TileId {
  return catalog.some((tile) => tile.id === value);
}
export function getTile(id: TileId) {
  return catalog.find((tile) => tile.id === id)!;
}
export const MAX_QUANTITY = 9999;
