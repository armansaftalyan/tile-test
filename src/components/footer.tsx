'use client';
import { useRef, useState } from 'react';
const info = {
  terms: {
    title: 'Terms of Service',
    text: 'The Artisan Kiln is a frontend demonstration created for the Tile.Expert developer assignment. Orders are confirmed only in this browser session. No purchase, payment or delivery takes place.',
  },
  privacy: {
    title: 'Privacy Policy',
    text: 'Order and card details are not sent to a server or saved in browser storage. Card fields are cleared after confirmation. Your cart and tile layout stay in memory until you reload this page.',
  },
  shipping: {
    title: 'Shipping Information',
    text: 'Demo shipping costs $25.00 when the merchandise subtotal is $500.00 or less. Orders above $500.00 qualify for free shipping. All prices are in US dollars per square foot.',
  },
  about: {
    title: 'About The Artisan Kiln',
    text: 'A small tribute to handcrafted ceramics. Explore the tile collections, compose a pattern in the desktop design tool, and try the local checkout. This project was built with Next.js, TypeScript, Tailwind CSS and Redux Toolkit.',
  },
};
type InfoKey = keyof typeof info;
export function Footer() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<InfoKey>('terms');
  function open(key: InfoKey) {
    setSelected(key);
    dialog.current?.showModal();
  }
  return (
    <footer className="relative mx-auto mt-auto flex min-h-[145px] w-full flex-col items-center justify-start pb-20 pt-8 desktop:min-h-[120px] desktop:justify-end desktop:pb-1">
      <div className="relative z-[1] max-w-[94%] text-center text-[10px] uppercase desktop:text-sm">
        <div className="flex flex-wrap items-center justify-center gap-x-1">
          {(['terms', 'privacy', 'shipping', 'about'] as const).map((key, index) => (
            <span key={key} id={key}>
              <button
                type="button"
                onClick={() => open(key)}
                className="min-h-8 underline-offset-2 hover:underline"
              >
                {key === 'about' ? 'Contact Us' : info[key].title}
              </button>
              {index < 3 && ' |'}
            </span>
          ))}
        </div>
        <p>© 2026 The Artisan Kiln. All Rights Reserved.</p>
      </div>
      <dialog
        ref={dialog}
        aria-labelledby="info-title"
        className="w-[calc(100%-40px)] max-w-md border-2 border-ink bg-paper bg-paper p-5 shadow-stamp backdrop:bg-ink/50"
      >
        <div className="flex items-center justify-between">
          <h2 id="info-title" className="text-2xl uppercase">
            {info[selected].title}
          </h2>
          <button
            type="button"
            aria-label="Close information"
            onClick={() => dialog.current?.close()}
            className="h-11 w-11 text-2xl"
          >
            ×
          </button>
        </div>
        <p className="mt-3 font-body text-sm leading-relaxed">{info[selected].text}</p>
      </dialog>
    </footer>
  );
}
