import { describe, expect, it } from 'vitest';
import { validateCheckout, validCardNumber, type CheckoutValues } from '../src/lib/validation';
const values: CheckoutValues = {
  name: 'Alex Smith',
  phone: '+1 202 555 0100',
  email: 'alex@example.com',
  address: '123 Clay Street',
  notes: '',
  cardNumber: '4242 4242 4242 4242',
  expiry: '12/39',
  cvc: '123',
};
const now = new Date(2026, 10, 15);
describe('checkout validation', () => {
  it('accepts a valid card order', () => {
    expect(validateCheckout(values, 'card', now)).toEqual({});
  });
  it('reports each required contact field', () => {
    const errors = validateCheckout(
      { ...values, name: ' ', phone: '', email: '', address: '' },
      'bank',
      now,
    );
    expect(Object.keys(errors)).toEqual(['name', 'phone', 'email', 'address']);
  });
  it('validates email, phone, card Luhn checksum, expiry and CVV', () => {
    expect(
      Object.keys(
        validateCheckout(
          {
            ...values,
            email: 'bad@',
            phone: 'abc',
            cardNumber: '1234',
            expiry: '01/20',
            cvc: 'xx',
          },
          'card',
          now,
        ),
      ),
    ).toEqual(['phone', 'email', 'cardNumber', 'expiry', 'cvc']);
  });
  it.each(['paypal', 'apple', 'bank'] as const)(
    'does not require or validate card data for %s',
    (method) => {
      expect(
        validateCheckout({ ...values, cardNumber: '', expiry: '', cvc: '' }, method, now),
      ).toEqual({});
    },
  );
  it('accepts current-month expiry and rejects an earlier month', () => {
    expect(validateCheckout({ ...values, expiry: '11/26' }, 'card', now).expiry).toBeUndefined();
    expect(validateCheckout({ ...values, expiry: '10/26' }, 'card', now).expiry).toBeDefined();
    expect(validateCheckout({ ...values, expiry: '13/26' }, 'card', now).expiry).toBeDefined();
  });
  it.each(['0000000000000000', '4242424242424241', '4242x424242424242', '123'])(
    'rejects invalid card %s',
    (card) => {
      expect(validCardNumber(card)).toBe(false);
    },
  );
});
