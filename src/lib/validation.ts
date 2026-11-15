export const paymentMethods = ['card', 'paypal', 'apple', 'bank'] as const;
export type PaymentMethod = (typeof paymentMethods)[number];
export type CheckoutValues = {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};
export type FieldName = keyof CheckoutValues;
export type FormErrors = Partial<Record<FieldName, string>>;
export function validCardNumber(value: string) {
  if (!/^[\d -]+$/.test(value)) return false;
  const digits = value.replace(/[ -]/g, '');
  if (!/^\d{13,19}$/.test(digits) || /^(\d)\1+$/.test(digits)) return false;
  let sum = 0;
  for (let i = digits.length - 1, double = false; i >= 0; i--, double = !double) {
    let digit = Number(digits[i]);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}
export function validateCheckout(
  values: CheckoutValues,
  method: PaymentMethod,
  now = new Date(),
): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = 'Please enter your full name.';
  if (!values.phone.trim()) errors.phone = 'Please enter your phone number.';
  else if (
    !/^[+()\d .-]{7,25}$/.test(values.phone.trim()) ||
    values.phone.replace(/\D/g, '').length < 7
  )
    errors.phone = 'Enter a valid phone number.';
  if (!values.email.trim()) errors.email = 'Please enter your email.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = 'Enter a valid email address.';
  if (!values.address.trim()) errors.address = 'Please enter your shipping address.';
  if (method === 'card') {
    if (!validCardNumber(values.cardNumber))
      errors.cardNumber = 'Enter a valid card number (13–19 digits).';
    const match = /^(0[1-9]|1[0-2])\s*\/\s*(\d{2})$/.exec(values.expiry.trim());
    if (!match) errors.expiry = 'Use MM/YY.';
    else {
      const year = 2000 + Number(match[2]),
        month = Number(match[1]);
      if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1))
        errors.expiry = 'This card has expired.';
    }
    if (!/^\d{3,4}$/.test(values.cvc)) errors.cvc = 'Enter 3 or 4 digits.';
  }
  return errors;
}
export function readCheckout(form: HTMLFormElement): CheckoutValues {
  const data = new FormData(form);
  return Object.fromEntries(
    ['name', 'phone', 'email', 'address', 'notes', 'cardNumber', 'expiry', 'cvc'].map((key) => [
      key,
      String(data.get(key) ?? ''),
    ]),
  ) as CheckoutValues;
}
