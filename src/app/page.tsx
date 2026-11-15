import { StoreProvider } from '@/store/provider';
import { Header } from '@/components/header';
import { Checkout } from '@/components/checkout';
import { Footer } from '@/components/footer';
export default function Home() {
  return (
    <StoreProvider>
      <div className="relative isolate flex min-h-screen flex-col overflow-clip border-x border-ink bg-paper bg-paper">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          <img
            src="/art/top-left.webp"
            alt=""
            className="absolute left-0 top-10 w-[100px] desktop:top-9 desktop:w-[275px]"
          />
          <img
            src="/art/top-right.webp"
            alt=""
            className="absolute right-0 top-10 w-[100px] desktop:top-9 desktop:w-[272px]"
          />
          <img
            src="/art/side-left.webp"
            alt=""
            className="absolute left-0 top-[145px] hidden h-[490px] w-12 desktop:block"
          />
          <img
            src="/art/side-right.webp"
            alt=""
            className="absolute right-0 top-[145px] hidden h-[490px] w-12 desktop:block"
          />
          <img
            src="/art/bottom-left.webp"
            alt=""
            className="absolute bottom-0 left-0 hidden w-[35%] desktop:block"
          />
          <img
            src="/art/bottom-right.webp"
            alt=""
            className="absolute bottom-0 right-0 hidden w-[35%] desktop:block"
          />
          <img
            src="/art/mobile-footer.webp"
            alt=""
            className="absolute bottom-0 left-0 w-full desktop:hidden"
          />
          <img
            src="/art/mobile-hand.webp"
            alt=""
            className="absolute bottom-0 right-0 w-[90px] desktop:hidden"
          />
        </div>
        <Header />
        <main className="relative flex-1">
          <Checkout />
        </main>
        <Footer />
      </div>
    </StoreProvider>
  );
}
