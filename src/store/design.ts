import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { isTileId, type TileId } from '../lib/catalog';
const rows: (TileId | null)[][] = [
  ['sun', 'midnight', 'arch', 'arch', null, null, null],
  ['midnight', 'dot', 'star', 'midnight', null, null, null],
  ['dot', 'fern', 'cross', 'fern', null, null, null],
  ['dot', 'dot', 'fern', 'fern', null, null, null],
  ['arch', 'dot', 'ocean', 'star', null, null, null],
  ['ocean', 'star', 'fern', null, null, null, null],
  [null, null, null, null, null, null, null],
];
const initialState: { cells: (TileId | null)[]; selected: TileId } = {
  cells: rows.flat(),
  selected: 'ocean',
};
const design = createSlice({
  name: 'design',
  initialState,
  reducers: {
    selectTile(state, action: PayloadAction<TileId>) {
      if (isTileId(action.payload)) state.selected = action.payload;
    },
    placeTile(state, action: PayloadAction<{ index: number; tileId: TileId }>) {
      const { index, tileId } = action.payload;
      if (Number.isInteger(index) && index >= 0 && index < 49 && isTileId(tileId))
        state.cells[index] = tileId;
    },
    clearDesign(state) {
      state.cells = Array<TileId | null>(49).fill(null);
    },
  },
});
export const { selectTile, placeTile, clearDesign } = design.actions;
export default design.reducer;
