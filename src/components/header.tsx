'use client';
import { useAppSelector } from '@/store/provider';
import { Tile } from './tile';
import { CartIcon } from './icons';
export function Header() {
  const count = useAppSelector((s) => s.cart.items.length);
  return (
    <>
      <a
        href="#order-form"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-paper focus:p-3"
      >
        Skip to order form
      </a>
      <nav
        aria-label="Main navigation"
        className="relative z-10 flex h-10 items-center justify-between border-2 border-ink bg-sand/50 px-2 desktop:h-9 desktop:px-4"
      >
        <span className="flex gap-1.5" aria-hidden="true">
          {['bg-clay', 'bg-ochre', 'bg-fern'].map((c) => (
            <span key={c} className={`h-3 w-3 rounded-full border border-ink ${c}`} />
          ))}
        </span>
        <div className="flex gap-5 text-[16px] desktop:gap-6 desktop:text-lg">
          <a href="#cart" className="hidden desktop:block">
            HOME
          </a>
          <a href="#cart">SHOP</a>
          <a href="#cart">COLLECTIONS</a>
          <a href="#about">ABOUT US</a>
          <a href="#shipping" className="hidden desktop:block">
            FAQ
          </a>
          <a href="#design" className="hidden desktop:block">
            GALLERY
          </a>
          <a href="#about" className="hidden desktop:block">
            BLOG
          </a>
        </div>
        <a
          href="#cart"
          aria-label={`Shopping cart, ${count} collections`}
          className="relative flex items-center gap-3"
        >
          <CartIcon className="h-7 w-8" />
          <span
            data-testid="cart-count"
            className="absolute -top-1 left-5 flex h-4 min-w-4 items-center justify-center rounded-full border border-ink bg-ochre text-xs"
          >
            {count}
          </span>
          <span
            aria-hidden="true"
            className="hidden h-6 w-6 rounded-full border-2 border-ink bg-navy text-center text-white desktop:block"
          >
            ●
          </span>
          <span className="hidden rounded border border-ink bg-navy px-2 text-sm text-white desktop:block">
            A. Smith
          </span>
        </a>
      </nav>
      <header className="relative z-[1] mx-auto mb-7 mt-5 text-center desktop:mb-2 desktop:mt-4">
        <div className="flex items-center justify-center gap-6">
          <img
            src="/art/temple.webp"
            alt=""
            className="hidden h-[75px] w-16 object-contain desktop:block"
          />
          <div>
            <h1 className="text-[clamp(23px,4.9vw,42px)] font-semibold uppercase leading-tight tracking-wide">
              Ceramic Tile Order Form
            </h1>
            <div className="mt-1.5 flex items-center justify-center gap-2 desktop:gap-4">
              <div className="flex gap-1">
                {(['midnight', 'dot', 'cross'] as const).map((id) => (
                  <span key={id} className="h-6 w-6 border border-ink desktop:h-8 desktop:w-8">
                    <Tile id={id} />
                  </span>
                ))}
              </div>
              <p className="text-[clamp(15px,3.1vw,26px)] uppercase leading-none">
                The Artisan Kiln
              </p>
              <div className="flex gap-1">
                {(['indigo', 'dot', 'star'] as const).map((id) => (
                  <span key={id} className="h-6 w-6 border border-ink desktop:h-8 desktop:w-8">
                    <Tile id={id} />
                  </span>
                ))}
              </div>
            </div>
          </div>
          <img
            src="/art/kiln.webp"
            alt=""
            className="hidden h-[75px] w-16 object-contain desktop:block"
          />
        </div>
      </header>
    </>
  );
}
