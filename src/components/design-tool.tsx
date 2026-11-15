'use client';
import { useState } from 'react';
import { catalog, getTile, isTileId, type TileId } from '@/lib/catalog';
import { useAppDispatch, useAppSelector } from '@/store/provider';
import { selectTile, placeTile, clearDesign } from '@/store/design';
import { Tile } from './tile';
const paletteOrder = [
  'mosaic',
  'diamond',
  'cross',
  'star',
  'midnight',
  'herringbone',
  'fern',
  'indigo',
  'arch',
  'ocean',
] as const;
export function DesignTool() {
  const { cells, selected } = useAppSelector((s) => s.design);
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState('Select a tile, then click a square.');
  function place(index: number, tileId: TileId) {
    dispatch(placeTile({ index, tileId }));
    if (cells[index] === tileId) {
      setMessage('This tile is already in this square.');
    } else {
      setMessage(
        `${getTile(tileId).name} placed in row ${Math.floor(index / 7) + 1}, column ${(index % 7) + 1}.`,
      );
    }
  }
  return (
    <section
      id="design"
      aria-labelledby="design-title"
      className="order-2 mt-9 hidden min-w-0 desktop:block"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_122px] overflow-hidden rounded-sm border-2 border-ink bg-sand/30">
        <div className="flex min-h-[73px] flex-col items-center justify-center border-b-2 border-r-2 border-ink px-2 text-center">
          <h2 id="design-title" className="text-xl uppercase">
            Visualize Your Order:
          </h2>
          <p className="text-sm">Drag and drop tiles here to create patterns.</p>
        </div>
        <h3 className="flex items-start justify-center border-b-2 border-ink bg-sand/60 p-2 text-base uppercase leading-tight whitespace-nowrap">
          Design Palette
        </h3>
        <div className="border-r-2 border-ink">
          <div className="grid grid-cols-7" role="group" aria-label="7 by 7 tile layout">
            {cells.map((id, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Row ${Math.floor(index / 7) + 1}, column ${(index % 7) + 1}: ${id ? getTile(id).name : 'empty'}`}
                data-testid={`cell-${index}`}
                onClick={() => place(index, selected)}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = 'copy';
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  const tileId = event.dataTransfer.getData('text/plain');
                  if (isTileId(tileId)) {
                    place(index, tileId);
                  }
                }}
                className="aspect-square min-w-0 border-b border-r border-ink bg-sand/30 transition hover:bg-ochre/40 focus-visible:relative focus-visible:z-10 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-navy"
              >
                {id && <Tile id={id} />}
              </button>
            ))}
          </div>
          <div className="flex min-h-9 items-center justify-between gap-2 px-2 text-xs">
            <span className="truncate">Selected: {getTile(selected).name}</span>
            <button
              type="button"
              onClick={() => {
                dispatch(clearDesign());
                setMessage('All 49 squares cleared.');
              }}
              className="min-h-9 underline underline-offset-2 hover:text-navy"
            >
              Clear grid
            </button>
          </div>
        </div>
        <div className="grid content-start grid-cols-2 gap-2 p-2">
          {paletteOrder.map((id) => (
            <button
              key={id}
              type="button"
              draggable
              aria-label={`Select ${getTile(id).name}`}
              aria-pressed={selected === id}
              onClick={() => dispatch(selectTile(id))}
              onDragStart={(event) => {
                dispatch(selectTile(id));
                event.dataTransfer.setData('text/plain', id);
                event.dataTransfer.effectAllowed = 'copy';
              }}
              className={`aspect-square overflow-hidden rounded-sm border-2 transition hover:scale-105 ${selected === id ? 'border-navy outline outline-2 outline-offset-2 outline-navy' : 'border-ink'}`}
            >
              <Tile id={id} />
            </button>
          ))}
        </div>
      </div>
      <p className="mt-2 text-center text-xs" aria-live="polite">
        {message}
      </p>
      <p className="sr-only">
        {catalog.length} tile collections available. Use Tab and Enter to select and place a tile.
      </p>
    </section>
  );
}
