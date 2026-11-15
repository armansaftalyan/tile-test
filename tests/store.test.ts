import { describe, expect, it } from 'vitest';
import { makeStore } from '../src/store';
import { addTile, decreaseQuantity, removeTile, setQuantity } from '../src/store/cart';
import { clearDesign, placeTile, selectTile } from '../src/store/design';
import { calculateTotals } from '../src/lib/pricing';
describe('Redux cart', () => {
  it('updates quantity, removes and re-adds a collection without duplicating it', () => {
    const store = makeStore();
    store.dispatch(setQuantity({ tileId: 'ocean', quantity: 1 }));
    expect(calculateTotals(store.getState().cart.items).total).toBe(892800);
    store.dispatch(removeTile('ocean'));
    expect(store.getState().cart.items).toHaveLength(3);
    store.dispatch(addTile('ocean'));
    store.dispatch(addTile('ocean'));
    expect(store.getState().cart.items.filter((i) => i.tileId === 'ocean')).toEqual([
      { tileId: 'ocean', quantity: 2 },
    ]);
  });
  it('decreases 150 to 149 and increases back to 150 with updated totals', () => {
    const store = makeStore();
    store.dispatch(decreaseQuantity('ocean'));
    expect(store.getState().cart.items[0].quantity).toBe(149);
    expect(calculateTotals(store.getState().cart.items).total).toBe(1307200);
    store.dispatch(addTile('ocean'));
    expect(store.getState().cart.items[0].quantity).toBe(150);
    expect(calculateTotals(store.getState().cart.items).total).toBe(1310000);
  });
  it('decreases two to one, then removes the row at zero', () => {
    const store = makeStore();
    store.dispatch(setQuantity({ tileId: 'ocean', quantity: 2 }));
    store.dispatch(decreaseQuantity('ocean'));
    expect(store.getState().cart.items[0]).toEqual({ tileId: 'ocean', quantity: 1 });
    expect(calculateTotals(store.getState().cart.items).total).toBe(892800);
    store.dispatch(decreaseQuantity('ocean'));
    expect(store.getState().cart.items.some((item) => item.tileId === 'ocean')).toBe(false);
    expect(calculateTotals(store.getState().cart.items).total).toBe(890000);
    const before = store.getState();
    store.dispatch(decreaseQuantity('ocean'));
    expect(store.getState()).toBe(before);
  });
  it('ignores decrement for an unknown tile', () => {
    const store = makeStore();
    const before = store.getState();
    store.dispatch({ type: decreaseQuantity.type, payload: 'unknown' });
    expect(store.getState()).toBe(before);
  });
  it('updates shipping when decrement crosses the free-shipping threshold', () => {
    const store = makeStore();
    for (const id of ['fern', 'dot', 'star'] as const) store.dispatch(removeTile(id));
    store.dispatch(setQuantity({ tileId: 'ocean', quantity: 18 }));
    store.dispatch(decreaseQuantity('ocean'));
    expect(calculateTotals(store.getState().cart.items)).toEqual({
      subtotal: 47600,
      shipping: 2500,
      total: 50100,
    });
    store.dispatch(addTile('ocean'));
    expect(calculateTotals(store.getState().cart.items)).toEqual({
      subtotal: 50400,
      shipping: 0,
      total: 50400,
    });
  });
  it.each([0, -1, 1.5, NaN, Infinity, 10000])(
    'rejects invalid quantity %s at the reducer boundary',
    (quantity) => {
      const store = makeStore();
      store.dispatch(setQuantity({ tileId: 'ocean', quantity }));
      expect(store.getState().cart.items[0].quantity).toBe(150);
    },
  );
  it('caps repeated additions and isolates stores', () => {
    const first = makeStore();
    const second = makeStore();
    first.dispatch(setQuantity({ tileId: 'ocean', quantity: 9999 }));
    first.dispatch(addTile('ocean'));
    expect(first.getState().cart.items[0].quantity).toBe(9999);
    expect(second.getState().cart.items[0].quantity).toBe(150);
  });
});
describe('Redux tile layout', () => {
  it('keeps exactly 49 cells and places selected tiles', () => {
    const store = makeStore();
    expect(store.getState().design.cells).toHaveLength(49);
    store.dispatch(selectTile('fern'));
    store.dispatch(placeTile({ index: 48, tileId: store.getState().design.selected }));
    expect(store.getState().design.cells[48]).toBe('fern');
    store.dispatch(clearDesign());
    expect(store.getState().design.cells).toEqual(Array(49).fill(null));
  });
  it.each([-1, 49, 2.5])('rejects invalid cell index %s', (index) => {
    const store = makeStore();
    const before = store.getState().design.cells;
    store.dispatch(placeTile({ index, tileId: 'fern' }));
    expect(store.getState().design.cells).toEqual(before);
  });
});
