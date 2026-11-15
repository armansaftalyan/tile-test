import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { MAX_QUANTITY, isTileId, type CartItem, type TileId } from '../lib/catalog';
export const initialCart: CartItem[] = [
  { tileId: 'ocean', quantity: 150 },
  { tileId: 'fern', quantity: 75 },
  { tileId: 'dot', quantity: 200 },
  { tileId: 'star', quantity: 50 },
];
const cart = createSlice({
  name: 'cart',
  initialState: { items: initialCart },
  reducers: {
    setQuantity(state, action: PayloadAction<{ tileId: TileId; quantity: number }>) {
      const { tileId, quantity } = action.payload;
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) return;
      const item = state.items.find((item) => item.tileId === tileId);
      if (item) item.quantity = quantity;
    },
    removeTile(state, action: PayloadAction<TileId>) {
      state.items = state.items.filter((item) => item.tileId !== action.payload);
    },
    decreaseQuantity(state, action: PayloadAction<TileId>) {
      const index = state.items.findIndex((item) => item.tileId === action.payload);
      if (index === -1) return;
      if (state.items[index].quantity > 1) state.items[index].quantity -= 1;
      else state.items.splice(index, 1);
    },
    addTile(state, action: PayloadAction<TileId>) {
      if (!isTileId(action.payload)) return;
      const item = state.items.find((item) => item.tileId === action.payload);
      if (item) item.quantity = Math.min(MAX_QUANTITY, item.quantity + 1);
      else state.items.push({ tileId: action.payload, quantity: 1 });
    },
  },
});
export const { setQuantity, removeTile, addTile, decreaseQuantity } = cart.actions;
export default cart.reducer;
