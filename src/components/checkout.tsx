'use client';
import { useRef, useState, type FormEvent } from 'react';
import { calculateTotals, money } from '@/lib/pricing';
import {
  paymentMethods,
  readCheckout,
  validateCheckout,
  type FieldName,
  type FormErrors,
  type PaymentMethod,
} from '@/lib/validation';
import { useAppSelector } from '@/store/provider';
import { Cart, Totals } from './cart';
import { DesignTool } from './design-tool';
import { PaymentIcon } from './icons';
const labels: Record<PaymentMethod, string> = {
  card: 'Credit/Debit Card',
  paypal: 'PayPal',
  apple: 'Apple Pay',
  bank: 'Bank Transfer',
};
function Field({
  name,
  label,
  errors,
  type = 'text',
  autoComplete,
  placeholder = '',
  className = '',
  maxLength,
  required = true,
}: {
  name: FieldName;
  label: string;
  errors: FormErrors;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  required?: boolean;
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <label
        htmlFor={name}
        className="flex items-baseline gap-1 text-[15px] uppercase leading-snug desktop:text-sm"
      >
        <span className="shrink-0">{label}:</span>
        <input
          id={name}
          name={name}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
          className={`min-h-8 w-full min-w-0 border-b desktop:h-5 desktop:min-h-0 desktop:py-0 desktop:text-xs desktop:leading-none bg-transparent px-1 font-body text-sm normal-case outline-none focus:border-b-2 focus:border-navy ${errors[name] ? 'border-error' : 'border-ink'}`}
        />
      </label>
      {errors[name] && (
        <p id={`${name}-error`} role="alert" className="mt-0.5 font-body text-xs text-error">
          {errors[name]}
        </p>
      )}
    </div>
  );
}
function CardField({
  name,
  label,
  placeholder,
  errors,
  autoComplete,
  maxLength,
  inputMode = 'numeric',
}: {
  name: 'cardNumber' | 'expiry' | 'cvc';
  label: string;
  placeholder: string;
  errors: FormErrors;
  autoComplete: string;
  maxLength: number;
  inputMode?: 'numeric' | 'text';
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={name} className="mb-0.5 block text-xs uppercase">
        {label}
      </label>
      <input
        id={name}
        name={name}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        placeholder={placeholder}
        required
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        className={`h-9 desktop:h-7 w-full min-w-0 rounded-sm border bg-paper px-2 font-body text-sm outline-none focus:ring-2 focus:ring-navy ${errors[name] ? 'border-error' : 'border-ink'}`}
      />
      {errors[name] && (
        <p id={`${name}-error`} role="alert" className="mt-1 font-body text-xs text-error">
          {errors[name]}
        </p>
      )}
    </div>
  );
}
export function Checkout() {
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [errors, setErrors] = useState<FormErrors>({});
  const [receipt, setReceipt] = useState<{
    total: number;
    method: PaymentMethod;
  } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const items = useAppSelector((s) => s.cart.items);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const validation = validateCheckout(readCheckout(form), method);
    setErrors(validation);
    setReceipt(null);
    const first = Object.keys(validation)[0];
    if (first) {
      (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    if (!items.length) return;
    setReceipt({ total: calculateTotals(items).total, method });
    // Card data never enters Redux, localStorage, a request or a confirmation object.
    for (const name of ['cardNumber', 'expiry', 'cvc']) {
      const input = form.elements.namedItem(name) as HTMLInputElement | null;
      if (input) input.value = '';
    }
    requestAnimationFrame(() => successRef.current?.focus());
  }
  return (
    <form
      ref={formRef}
      id="order-form"
      noValidate
      onSubmit={submit}
      onChange={() => {
        if (receipt) setReceipt(null);
      }}
      className="relative z-[1] mx-auto flex w-[calc(100%-44px)] max-w-[760px] flex-col gap-5 desktop:grid desktop:w-[calc(100%-136px)] desktop:max-w-[1500px] desktop:grid-cols-[1.26fr_1.72fr_1fr] desktop:items-start desktop:gap-7"
    >
      <Cart />
      <DesignTool />
      <aside className="contents desktop:order-3 desktop:flex desktop:min-w-0 desktop:flex-col desktop:gap-2">
        <section aria-labelledby="summary-title" className="order-1 desktop:order-1">
          <h2
            id="summary-title"
            className="mb-1 hidden border-b-2 border-ink bg-sand/55 text-[23px] uppercase leading-tight desktop:block"
          >
            <span className="inline-block rounded-t-sm border-2 border-b-0 border-ink bg-paper px-2 py-1">
              Order Summary
            </span>
          </h2>
          <div className="space-y-1 desktop:space-y-0">
            <Field
              name="name"
              label="Customer Name"
              autoComplete="name"
              maxLength={100}
              errors={errors}
            />
            <div className="grid grid-cols-2 gap-2">
              <Field
                name="phone"
                label="Phone"
                type="tel"
                autoComplete="tel"
                maxLength={25}
                errors={errors}
              />
              <Field
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
                maxLength={254}
                errors={errors}
              />
            </div>
            <Field
              name="address"
              label="Shipping Address"
              autoComplete="street-address"
              maxLength={250}
              errors={errors}
            />
          </div>
        </section>
        <div className="order-4 desktop:order-2">
          <Field
            name="notes"
            label="Project Name / Notes"
            required={false}
            maxLength={500}
            errors={errors}
          />
        </div>
        <Totals className="order-3 mb-1 mt-3 hidden space-y-0.5 border-t border-ink pt-1 text-sm desktop:block" />
        <fieldset className="order-3 min-w-0 desktop:order-4">
          <legend className="max-w-full rounded-t-sm border-2 border-b-0 border-ink bg-sand/50 px-1.5 text-xl uppercase leading-tight desktop:text-base">
            Select Payment Method:
          </legend>
          <div className="grid grid-cols-4 border-2 border-ink desktop:grid-cols-2 desktop:gap-2 desktop:border-0 desktop:pt-1">
            {paymentMethods.map((value) => (
              <label
                key={value}
                className={`relative flex min-h-[94px] min-w-0 cursor-pointer flex-col items-center justify-center gap-2 border-r border-ink p-1 text-center last:border-r-0 ${method === value ? 'bg-sand/65' : 'bg-paper/50'} ${value === 'card' || value === 'paypal' ? 'desktop:min-h-7 desktop:flex-row desktop:gap-1 desktop:border-0 desktop:bg-transparent desktop:p-0 desktop:pl-5' : 'desktop:order-3 desktop:min-h-[75px] desktop:rounded-md desktop:border-2 desktop:last:border-r-2'}`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={value}
                  checked={method === value}
                  onChange={() => {
                    setMethod(value);
                    setErrors((current) => ({
                      name: current.name,
                      phone: current.phone,
                      email: current.email,
                      address: current.address,
                    }));
                    setReceipt(null);
                  }}
                  className="absolute left-1 top-2 h-4 w-4 accent-ink desktop:h-3.5 desktop:w-3.5 desktop:left-2 desktop:top-2"
                />
                <span
                  className={`${value === 'card' || value === 'paypal' ? 'desktop:hidden' : ''}`}
                >
                  <span aria-hidden="true">
                    <PaymentIcon method={value} />
                  </span>
                </span>
                <span className="text-[11px] uppercase leading-tight desktop:text-sm">
                  {labels[value]}
                </span>
              </label>
            ))}
            {method === 'card' ? (
              <div
                data-testid="card-fields"
                className="order-4 col-span-4 m-2 rounded-md border-2 border-ink bg-sand/50 p-2 desktop:order-2 desktop:col-span-2 desktop:m-0"
              >
                <div className="mb-1 flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full border-2 border-ink bg-paper" />
                  <span className="rounded-sm border border-ink bg-white px-1 font-body text-sm font-black italic text-navy">
                    VISA
                  </span>
                  <span
                    className="flex rounded-sm border border-ink bg-white px-2 py-1"
                    aria-label="Mastercard"
                  >
                    <i className="h-4 w-4 rounded-full bg-clay" />
                    <i className="-ml-1.5 h-4 w-4 rounded-full bg-ochre" />
                  </span>
                </div>
                <CardField
                  name="cardNumber"
                  label="Card Number"
                  placeholder="1234 5678 9012 3456"
                  autoComplete="cc-number"
                  maxLength={25}
                  errors={errors}
                />
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  <CardField
                    name="expiry"
                    label="Expiration"
                    placeholder="MM/YY"
                    autoComplete="cc-exp"
                    maxLength={7}
                    errors={errors}
                    inputMode="text"
                  />
                  <CardField
                    name="cvc"
                    label="CVV"
                    placeholder="123"
                    autoComplete="cc-csc"
                    maxLength={4}
                    errors={errors}
                  />
                </div>
              </div>
            ) : (
              <p
                role="status"
                className="order-4 col-span-4 mt-2 border border-ink bg-sand/30 p-2 font-body text-xs leading-relaxed desktop:col-span-2"
              >
                {method === 'paypal'
                  ? 'PayPal selected.'
                  : method === 'apple'
                    ? 'Apple Pay selected.'
                    : 'Bank transfer selected.'}{' '}
                This demo confirms your order locally; no payment will be taken.
              </p>
            )}
          </div>
        </fieldset>
        <div className="order-5 desktop:order-5">
          <button
            type="submit"
            disabled={!items.length}
            className="mt-1 min-h-11 w-full rounded-md border-2 border-ink bg-navy px-3 py-1 text-xl uppercase text-white shadow-sm transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            Place Secure Order
          </button>
          {!items.length && (
            <p className="mt-1 font-body text-xs text-error">
              Add a tile before placing your order.
            </p>
          )}
          <p className="mt-2 text-center font-body text-[10px] text-ink/70">
            Demo checkout · No payment is processed.
          </p>
        </div>
        {receipt && (
          <div
            ref={successRef}
            tabIndex={-1}
            role="status"
            data-testid="order-success"
            className="order-6 border-2 border-fern bg-paper p-3 outline-none"
          >
            <h2 className="text-xl uppercase">Thank you for your order!</h2>
            <p className="mt-1 font-body text-sm">
              Your demo order for {money(receipt.total)} is confirmed with {labels[receipt.method]}.
              No payment has been taken.
            </p>
            <button
              type="button"
              onClick={() => setReceipt(null)}
              className="mt-2 min-h-9 underline"
            >
              Continue designing
            </button>
          </div>
        )}
      </aside>
    </form>
  );
}
