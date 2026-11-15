import type { SVGProps } from 'react';
export function CartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 36" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M2 3h6l5 22h21l4-17H10M14 19h21" />
      <circle cx="16" cy="31" r="2" />
      <circle cx="31" cy="31" r="2" />
    </svg>
  );
}
export function AddIcon() {
  return (
    <svg viewBox="0 0 30 30" className="h-6 w-6" aria-hidden="true">
      <path
        d="M3 5h20v7h5l-5 6v8H3Z"
        className="fill-fern"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M12 9v12M6 15h12" className="stroke-white" strokeWidth="3" />
    </svg>
  );
}
export function RemoveIcon() {
  return (
    <svg viewBox="0 0 30 30" className="h-6 w-6" aria-hidden="true">
      <path d="M5 9h20l-2 18H7Z" className="fill-clay" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 6h24M11 6V3h8v3M11 16h8" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
export function PaymentIcon({ method }: { method: string }) {
  if (method === 'paypal')
    return (
      <span className="font-body text-[32px] font-black italic leading-none text-navy">
        P<span className="-ml-3 text-fern">P</span>
      </span>
    );
  if (method === 'apple')
    return (
      <span className="inline-flex items-center font-body text-[23px] font-semibold leading-none">
        <svg viewBox="0 0 24 28" className="mr-0.5 h-6 w-5 fill-current" aria-hidden="true">
          <path d="M15 6c1-1 2-3 2-5-2 0-4 1-5 3-1 1-1 3-1 4 2 0 3-1 4-2ZM20 15c0-3 2-4 3-5-2-3-5-3-6-3-2 0-4 1-5 1s-3-1-5-1c-4 0-7 4-7 8 0 5 3 12 6 12 2 0 3-1 5-1s3 1 5 1c3 0 6-6 7-8-2-1-3-2-3-4Z" />
        </svg>
        Pay
      </span>
    );
  if (method === 'bank')
    return (
      <svg viewBox="0 0 60 48" className="h-9 w-12" aria-hidden="true">
        <path
          d="m3 12 27-10 27 10ZM7 16h46M8 42h44M4 47h52M12 17v24m12-24v24m12-24v24m12-24v24"
          className="fill-fern"
          stroke="currentColor"
          strokeWidth="3"
        />
      </svg>
    );
  return (
    <svg viewBox="0 0 60 44" className="h-8 w-12" aria-hidden="true">
      <rect
        x="2"
        y="2"
        width="56"
        height="40"
        rx="4"
        className="fill-sand"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M3 12h54v7H3M8 31h20" stroke="currentColor" strokeWidth="4" />
      <circle cx="44" cy="31" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
