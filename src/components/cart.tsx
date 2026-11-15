'use client';
import { useRef, useState } from 'react';
import { catalog, getTile, MAX_QUANTITY, type CartItem } from '@/lib/catalog';
import { money } from '@/lib/pricing';
import { addTile, decreaseQuantity, setQuantity } from '@/store/cart';
import { useAppDispatch, useAppSelector } from '@/store/provider';
import { Tile } from './tile';
import { AddIcon, RemoveIcon } from './icons';
export function Totals({ className = '' }: { className?: string }) {
  const items = useAppSelector((s) => s.cart.items);
  // Kept in one pure domain function; both summaries consume the same calculation.
  const { subtotal, shipping, total } = calculateTotals(items);
  return (
    <dl className={`text-right uppercase ${className}`} aria-live="polite" aria-atomic="true">
      <div className="flex items-center justify-end gap-1">
        <dt className="whitespace-nowrap">Subtotal:</dt>
        <dd className="min-w-[106px] border border-ink px-1 text-right">[ {money(subtotal)} ]</dd>
      </div>
      <div className="flex items-center justify-end gap-1">
        <dt className="whitespace-nowrap">Shipping:</dt>
        <dd className="min-w-[106px] border border-ink px-1">[ {money(shipping)} ]</dd>
      </div>
      <div className="flex items-center justify-end gap-1">
        <dt className="whitespace-nowrap">Grand Total:</dt>
        <dd data-testid="grand-total" className="min-w-[106px] border border-ink px-1">
          [ {money(total)} ]
        </dd>
      </div>
    </dl>
  );
}
import { calculateTotals } from '@/lib/pricing';
function Quantity({ item }: { item: CartItem }) {
  const dispatch = useAppDispatch();
  const [draft, setDraft] = useState<string | null>(null);
  const invalid =
    draft !== null && (!/^\d+$/.test(draft) || Number(draft) < 1 || Number(draft) > MAX_QUANTITY);
  return (
    <div className="relative">
      <div className="flex items-center justify-center">
        <span aria-hidden="true">[</span>
        <input
          aria-label={`${getTile(item.tileId).name} quantity`}
          type="number"
          inputMode="numeric"
          min="1"
          max={MAX_QUANTITY}
          step="1"
          value={draft ?? item.quantity}
          aria-invalid={invalid}
          aria-describedby={invalid ? `quantity-${item.tileId}-error` : undefined}
          className="h-11 w-full min-w-0 appearance-none bg-transparent px-0 text-center text-[15px] outline-none focus:bg-sand/60 desktop:text-lg"
          onChange={(event) => {
            const value = event.target.value;
            setDraft(value);
            if (/^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= MAX_QUANTITY)
              dispatch(setQuantity({ tileId: item.tileId, quantity: Number(value) }));
          }}
          onBlur={() => setDraft(null)}
        />
        <span aria-hidden="true">]</span>
      </div>
      {invalid && (
        <span
          id={`quantity-${item.tileId}-error`}
          role="alert"
          className="absolute left-1/2 top-full z-10 w-24 -translate-x-1/2 border border-error bg-paper p-1 font-body text-[10px] text-error"
        >
          Use 1–{MAX_QUANTITY}.
        </span>
      )}
    </div>
  );
}
export function Cart() {
  const items = useAppSelector((s) => s.cart.items);
  const dispatch = useAppDispatch();
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <section
      id="cart"
      aria-labelledby="cart-title"
      className="order-2 min-w-0 scroll-mt-4 desktop:order-1"
    >
      <h2 id="cart-title" className="mb-1 hidden text-[27px] uppercase leading-tight desktop:block">
        Shopping Cart &amp; Design Tool
      </h2>
      <table className="w-full table-fixed border-collapse border-2 border-ink text-center uppercase">
        <colgroup>
          <col className="w-[26%]" />
          <col className="w-[18%]" />
          <col className="w-[17%]" />
          <col className="w-[18%]" />
          <col className="w-[21%]" />
        </colgroup>
        <thead className="bg-sand/55 text-[11px] leading-[1.25] desktop:text-[13px]">
          <tr>
            <th className="whitespace-nowrap border border-ink p-1 font-medium">Tile Collection</th>
            <th className="border border-ink p-1 font-medium">Item</th>
            <th className="border border-ink p-1 font-medium">
              Quantity
              <br />
              <span className="normal-case">(sq. ft.)</span>
            </th>
            <th className="whitespace-nowrap border border-ink p-1 font-medium">
              Unit Price
              <br />
              ($)
            </th>
            <th className="border border-ink p-1 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.tileId}
              data-testid={`cart-row-${item.tileId}`}
              className="h-[82px] desktop:h-[68px]"
            >
              <th scope="row" className="border border-ink px-0.5 py-1 font-medium">
                <span className="mx-auto block h-9 w-9 border-2 border-ink desktop:h-10 desktop:w-10">
                  <Tile id={item.tileId} icon />
                </span>
                <span className="mt-0.5 block text-[11px] leading-tight desktop:text-[13px]">
                  {getTile(item.tileId).name}
                </span>
              </th>
              <td className="border border-ink p-1">
                <span className="mx-auto block aspect-square w-full max-w-[65px]">
                  <Tile id={item.tileId} />
                </span>
              </td>
              <td className="border border-ink px-0.5">
                <Quantity item={item} />
              </td>
              <td className="whitespace-nowrap border border-ink text-[11px] desktop:text-[15px]">
                [ {money(getTile(item.tileId).priceCents)} ]
              </td>
              <td className="border border-ink p-0">
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    aria-label={`Add one square foot of ${getTile(item.tileId).name}`}
                    disabled={item.quantity >= MAX_QUANTITY}
                    onClick={() => dispatch(addTile(item.tileId))}
                    className="flex min-h-11 min-w-8 flex-col items-center justify-center text-[9px] uppercase leading-tight hover:bg-fern/20 disabled:cursor-not-allowed disabled:opacity-40 desktop:min-w-7 desktop:text-[10px]"
                  >
                    <AddIcon />
                    Add
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove one square foot of ${getTile(item.tileId).name}`}
                    onClick={() => dispatch(decreaseQuantity(item.tileId))}
                    className="flex min-h-11 min-w-8 flex-col items-center justify-center text-[9px] uppercase leading-tight hover:bg-clay/20 desktop:min-w-7 desktop:text-[10px]"
                  >
                    <RemoveIcon />
                    Remove
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {!items.length && (
            <tr>
              <td colSpan={5} className="px-4 py-9 text-base normal-case">
                Your cart is empty. Add a tile to start your project.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="mt-1.5 flex items-start justify-between gap-1">
        <div className="flex flex-1 items-start">
          <img
            src="/art/hand-tile.webp"
            alt=""
            className="hidden h-[75px] w-[55px] shrink-0 object-contain desktop:block"
          />
          <button
            type="button"
            onClick={() => dialog.current?.showModal()}
            className="flex min-h-11 shrink-0 items-center gap-1 rounded-sm border-2 border-ink bg-sand px-1 whitespace-nowrap text-left text-[13px] uppercase leading-tight shadow-sm transition hover:bg-ochre/30 desktop:text-sm"
          >
            <span className="text-2xl">+</span>
            <span className="h-6 w-6 shrink-0 border border-ink">
              <Tile id="arch" />
            </span>
            <span>
              Add New Tile
              <br />
              to Cart
            </span>
          </button>
        </div>
        <Totals className="space-y-0.5 text-[13px] desktop:text-sm" />
      </div>
      <p className="sr-only" aria-live="polite">
        {items.length} tile collections in your cart.
      </p>
      <dialog
        ref={dialog}
        aria-labelledby="add-tile-title"
        className="fixed max-h-[85vh] w-[calc(100%-32px)] max-w-xl overflow-y-auto border-2 border-ink bg-paper bg-paper p-5 shadow-stamp backdrop:bg-ink/50"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="add-tile-title" className="text-2xl uppercase">
            Choose a tile collection
          </h2>
          <button
            type="button"
            aria-label="Close tile selector"
            onClick={() => dialog.current?.close()}
            className="h-11 w-11 border border-ink text-2xl"
          >
            ×
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {catalog.map((tile) => (
            <button
              key={tile.id}
              type="button"
              onClick={() => {
                dispatch(addTile(tile.id));
                dialog.current?.close();
              }}
              className="flex flex-col items-center border border-ink p-2 transition hover:bg-sand focus-visible:bg-sand"
            >
              <span className="mb-2 h-20 w-20 border border-ink">
                <Tile id={tile.id} />
              </span>
              <span className="uppercase">{tile.name}</span>
              <span className="font-body text-xs">{money(tile.priceCents)} / sq. ft.</span>
              <span className="mt-2 text-sm">+ ADD TO CART</span>
            </button>
          ))}
        </div>
      </dialog>
    </section>
  );
}
