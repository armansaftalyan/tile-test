import { describe, expect, it } from 'vitest';
import { makeStore } from '../src/store';
import { addTile, decreaseQuantity, removeTile, setQuantity } from '../src/store/cart';
import { clearDesign, placeTile, selectTile } from '../src/store/design';
import { calculateTotals } from '../src/lib/pricing';

describe('independent cart and mosaic state', () => {
  it('initializes the four reference quantities independently of the populated grid', () => {
    const store = makeStore();
    expect(store.getState().cart.items).toEqual([
      { tileId: 'ocean', quantity: 150 },
      { tileId: 'fern', quantity: 75 },
      { tileId: 'dot', quantity: 200 },
      { tileId: 'star', quantity: 50 },
    ]);
    expect(calculateTotals(store.getState().cart.items)).toEqual({
      subtotal: 1310000,
      shipping: 0,
      total: 1310000,
    });
    expect(store.getState().design.cells).toHaveLength(49);
    expect(store.getState().design.cells.some((cell) => cell !== null)).toBe(true);
  });

  it('changes only the selection when choosing a palette tile', () => {
    const store = makeStore();
    const before = store.getState();
    store.dispatch(selectTile('mosaic'));
    expect(store.getState().cart).toBe(before.cart);
    expect(store.getState().design.cells).toBe(before.design.cells);
    expect(store.getState().design.selected).toBe('mosaic');
  });

  it('does not add cart rows or area when placing the same pattern in multiple cells', () => {
    const store = makeStore();
    const cart = store.getState().cart;
    for (const index of [46, 47, 48]) store.dispatch(placeTile({ index, tileId: 'mosaic' }));
    expect(store.getState().design.cells.slice(46)).toEqual(['mosaic', 'mosaic', 'mosaic']);
    expect(store.getState().cart).toBe(cart);
    const beforeRepeat = store.getState();
    store.dispatch(placeTile({ index: 47, tileId: 'mosaic' }));
    expect(store.getState()).toBe(beforeRepeat);
    expect(calculateTotals(store.getState().cart.items).total).toBe(1310000);
  });

  it('changes only the grid when replacing an existing tile', () => {
    const store = makeStore();
    const cart = store.getState().cart;
    store.dispatch(placeTile({ index: 0, tileId: 'mosaic' }));
    store.dispatch(placeTile({ index: 0, tileId: 'fern' }));
    expect(store.getState().design.cells[0]).toBe('fern');
    expect(store.getState().cart).toBe(cart);
  });

  it('allows a populated mosaic with an empty cart and still permits placement', () => {
    const store = makeStore();
    const design = store.getState().design;
    for (const item of store.getState().cart.items) store.dispatch(removeTile(item.tileId));
    expect(store.getState().cart.items).toEqual([]);
    expect(store.getState().design).toBe(design);
    const cart = store.getState().cart;
    store.dispatch(placeTile({ index: 48, tileId: 'mosaic' }));
    expect(store.getState().design.cells[48]).toBe('mosaic');
    expect(store.getState().cart).toBe(cart);
    store.dispatch(clearDesign());
    expect(store.getState().cart).toBe(cart);
    expect(store.getState().design.cells.every((cell) => cell === null)).toBe(true);
  });

  it('does not change the mosaic when adding, changing quantity or removing an item', () => {
    const store = makeStore();
    const design = store.getState().design;
    store.dispatch(addTile('mosaic'));
    expect(store.getState().design).toBe(design);
    store.dispatch(setQuantity({ tileId: 'mosaic', quantity: 7 }));
    expect(store.getState().design).toBe(design);
    store.dispatch(decreaseQuantity('mosaic'));
    expect(store.getState().design).toBe(design);
    store.dispatch(removeTile('mosaic'));
    expect(store.getState().design).toBe(design);
  });

  it('allows placement even when the matching cart item is at its quantity limit', () => {
    const store = makeStore();
    store.dispatch(setQuantity({ tileId: 'ocean', quantity: 9999 }));
    const cart = store.getState().cart;
    store.dispatch(placeTile({ index: 48, tileId: 'ocean' }));
    expect(store.getState().design.cells[48]).toBe('ocean');
    expect(store.getState().cart).toBe(cart);
  });

  it.each([-1, 49, 1.5])('ignores an invalid cell index %s in both slices', (index) => {
    const store = makeStore();
    const before = store.getState();
    store.dispatch(placeTile({ index, tileId: 'mosaic' }));
    expect(store.getState()).toBe(before);
  });

  it('ignores an unknown tile ID in both slices', () => {
    const store = makeStore();
    const before = store.getState();
    store.dispatch({ type: placeTile.type, payload: { index: 48, tileId: 'unknown' } });
    expect(store.getState()).toBe(before);
  });

  it('clears the grid without changing quantities, prices or shipping in a populated cart', () => {
    const store = makeStore();
    const cart = store.getState().cart;
    const totals = calculateTotals(cart.items);
    store.dispatch(clearDesign());
    expect(store.getState().cart).toBe(cart);
    expect(calculateTotals(store.getState().cart.items)).toEqual(totals);
    expect(store.getState().design.cells).toEqual(Array(49).fill(null));
  });
});
