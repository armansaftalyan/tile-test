import { test, expect } from '@playwright/test';
test.beforeEach(async ({ page }) => {
  await page.goto('/');
});
test('updates quantities, removes a tile and adds it back', async ({ page }) => {
  await expect(page.getByTestId('grand-total').first()).toContainText('$13,100.00');
  await page.getByRole('spinbutton', { name: 'Ocean Wave quantity' }).fill('1');
  await expect(page.getByTestId('grand-total').first()).toContainText('$8,928.00');
  await page
    .getByRole('button', { name: 'Remove one square foot of Ocean Wave', exact: true })
    .click();
  await expect(page.getByTestId('cart-row-ocean')).toHaveCount(0);
  await page.getByRole('button', { name: /Add New Tile to Cart/i }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: /Ocean Wave/ })
    .click();
  await expect(page.getByRole('spinbutton', { name: 'Ocean Wave quantity' })).toHaveValue('1');
  await page
    .getByRole('button', { name: 'Add one square foot of Ocean Wave', exact: true })
    .click();
  await expect(page.getByRole('spinbutton', { name: 'Ocean Wave quantity' })).toHaveValue('2');
});
test('original Add and Remove controls fit at 375px and support keyboard decrement to removal', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 844 });
  const add = page.getByRole('button', { name: 'Add one square foot of Ocean Wave', exact: true });
  const remove = page.getByRole('button', {
    name: 'Remove one square foot of Ocean Wave',
    exact: true,
  });
  const quantity = page.getByRole('spinbutton', { name: 'Ocean Wave quantity', exact: true });
  const actions = page.getByTestId('cart-row-ocean').locator('td').last();
  await expect(actions.getByRole('button')).toHaveCount(2);
  await expect(add).toHaveText('Add');
  await expect(remove).toHaveText('Remove');
  const cell = await actions.boundingBox();
  for (const button of [add, remove]) {
    const box = await button.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(cell!.x);
    expect(box!.x + box!.width).toBeLessThanOrEqual(cell!.x + cell!.width + 0.5);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await remove.focus();
  await page.keyboard.press('Enter');
  await expect(quantity).toHaveValue('149');
  for (const total of await page.getByTestId('grand-total').all())
    await expect(total).toContainText('$13,072.00');
  await page.keyboard.press('Shift+Tab');
  await expect(add).toBeFocused();
  await page.keyboard.press('Space');
  await expect(quantity).toHaveValue('150');
  for (const total of await page.getByTestId('grand-total').all())
    await expect(total).toContainText('$13,100.00');
  await page.keyboard.press('Tab');
  await expect(remove).toBeFocused();
  await quantity.fill('2');
  for (const total of await page.getByTestId('grand-total').all())
    await expect(total).toContainText('$8,956.00');
  await remove.focus();
  await page.keyboard.press('Enter');
  await expect(quantity).toHaveValue('1');
  await expect(remove).toBeEnabled();
  for (const total of await page.getByTestId('grand-total').all())
    await expect(total).toContainText('$8,928.00');
  await page.keyboard.press('Space');
  await expect(page.getByTestId('cart-row-ocean')).toHaveCount(0);
  for (const total of await page.getByTestId('grand-total').all())
    await expect(total).toContainText('$8,900.00');
});
test('validates fields and switches every payment method', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (r) => {
    if (r.method() === 'POST') requests.push(r.url());
  });
  await page.getByRole('button', { name: 'Place Secure Order', exact: true }).click();
  await expect(page.getByText('Please enter your full name.')).toBeVisible();
  await expect(page.getByText('Enter a valid card number (13–19 digits).')).toBeVisible();
  await page.getByLabel('Customer Name:', { exact: true }).fill('Alex Smith');
  await page.getByLabel('Phone:', { exact: true }).fill('+1 202 555 0100');
  await page.getByLabel('Email:', { exact: true }).fill('invalid@');
  await page.getByLabel('Shipping Address:', { exact: true }).fill('123 Clay Street');
  await page.getByRole('radio', { name: 'PayPal', exact: true }).check();
  await expect(page.getByTestId('card-fields')).toHaveCount(0);
  await page.getByRole('button', { name: 'Place Secure Order', exact: true }).click();
  await expect(page.getByText('Enter a valid email address.')).toBeVisible();
  await page.getByLabel('Email:', { exact: true }).fill('alex@example.com');
  for (const method of ['PayPal', 'Apple Pay', 'Bank Transfer']) {
    await page.getByRole('radio', { name: method, exact: true }).check();
    await expect(page.getByTestId('card-fields')).toHaveCount(0);
    await page.getByRole('button', { name: 'Place Secure Order', exact: true }).click();
    await expect(page.getByTestId('order-success')).toContainText('$13,100.00');
  }
  await page.getByRole('radio', { name: 'Credit/Debit Card', exact: true }).check();
  await page.getByLabel('Card Number', { exact: true }).fill('4242 4242 4242 4242');
  await page.getByLabel('Expiration', { exact: true }).fill('12/39');
  await page.getByLabel('CVV', { exact: true }).fill('123');
  await page.getByRole('button', { name: 'Place Secure Order', exact: true }).click();
  await expect(page.getByTestId('order-success')).toContainText('Credit/Debit Card');
  await expect(page.getByLabel('Card Number', { exact: true })).toHaveValue('');
  expect(requests).toEqual([]);
});
test('places tiles by click and drag on a 7×7 desktop grid', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Visualizer is intentionally hidden on mobile.');
  await expect(page.locator('[data-testid^="cell-"]')).toHaveCount(49);
  await page.getByRole('button', { name: 'Select Ocean Wave', exact: true }).click();
  await page.getByTestId('cell-48').click();
  await expect(page.getByTestId('cell-48')).toHaveAccessibleName('Row 7, column 7: Ocean Wave');
  // Browser-generated HTML drag events exercise the actual dataTransfer handlers.
  await page
    .getByRole('button', { name: 'Select Forest Fern', exact: true })
    .dragTo(page.getByTestId('cell-47'));
  await expect(page.getByTestId('cell-47')).toHaveAccessibleName('Row 7, column 6: Forest Fern');
  await page.getByRole('button', { name: 'Clear grid', exact: true }).click();
  await expect(page.getByTestId('cell-48')).toHaveAccessibleName('Row 7, column 7: empty');
});
test('keeps cart and mosaic independent across click, keyboard, drag and clear', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Visualizer is desktop-only.');
  const cartSnapshot = () => page.locator('#cart tbody').innerText();
  const gridSnapshot = () =>
    page
      .locator('[data-testid^="cell-"]')
      .evaluateAll((cells) => cells.map((cell) => cell.getAttribute('aria-label')));
  const initialCart = await cartSnapshot();
  await expect(page.getByTestId('grand-total').first()).toContainText('$13,100.00');
  const palette = page.getByRole('button', { name: 'Select Wildflower Mosaic', exact: true });
  await palette.click();
  await page.getByTestId('cell-46').click();
  await page.getByTestId('cell-47').focus();
  await page.keyboard.press('Enter');
  await palette.dragTo(page.getByTestId('cell-48'));
  for (const index of [46, 47, 48])
    await expect(page.getByTestId(`cell-${index}`)).toHaveAccessibleName(
      new RegExp('Wildflower Mosaic'),
    );
  await expect(page.getByTestId('cart-row-mosaic')).toHaveCount(0);
  expect(await cartSnapshot()).toBe(initialCart);
  await expect(page.getByTestId('grand-total').first()).toContainText('$13,100.00');
  const placedGrid = await gridSnapshot();
  await page.getByRole('spinbutton', { name: 'Ocean Wave quantity', exact: true }).fill('1');
  expect(await gridSnapshot()).toEqual(placedGrid);
  for (const name of ['Ocean Wave', 'Forest Fern', 'Terracotta Dot', 'Yellow Star']) {
    await page.getByRole('spinbutton', { name: `${name} quantity`, exact: true }).fill('1');
    await page
      .getByRole('button', { name: `Remove one square foot of ${name}`, exact: true })
      .click();
  }
  expect(await gridSnapshot()).toEqual(placedGrid);
  await expect(page.locator('#cart tbody tr[data-testid]')).toHaveCount(0);
  const emptyCart = await cartSnapshot();
  const emptyTotal = await page.getByTestId('grand-total').first().innerText();
  await page.getByRole('button', { name: 'Clear grid', exact: true }).click();
  await expect(page.locator('[data-testid^="cell-"][aria-label$="empty"]')).toHaveCount(49);
  expect(await cartSnapshot()).toBe(emptyCart);
  expect(await page.getByTestId('grand-total').first().innerText()).toBe(emptyTotal);
  await page.getByRole('button', { name: /Add New Tile to Cart/i }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: /Ocean Wave/ })
    .click();
  const cartAfterAdd = await cartSnapshot();
  await page.getByTestId('cell-48').click();
  await page.getByRole('button', { name: 'Clear grid', exact: true }).click();
  expect(await cartSnapshot()).toBe(cartAfterAdd);
});
test('empty cart prevents checkout', async ({ page }) => {
  for (const name of ['Ocean Wave', 'Forest Fern', 'Terracotta Dot', 'Yellow Star']) {
    await page.getByRole('spinbutton', { name: `${name} quantity`, exact: true }).fill('1');
    await page
      .getByRole('button', { name: `Remove one square foot of ${name}`, exact: true })
      .click();
  }
  await expect(
    page.getByRole('button', { name: 'Place Secure Order', exact: true }),
  ).toBeDisabled();
  await expect(page.getByText('Your cart is empty.', { exact: false })).toBeVisible();
});
test('responsive layout has no page overflow; captures reference screenshots', async ({
  page,
}, testInfo) => {
  const sizes = testInfo.project.name === 'mobile' ? [375, 390] : [1376, 1600];
  for (const width of sizes) {
    await page.setViewportSize({
      width,
      height: testInfo.project.name === 'mobile' ? 844 : 900,
    });
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (width < 1100) {
      await expect(page.locator('#design')).toBeHidden();
      for (const input of await page.getByRole('spinbutton').all())
        expect((await input.boundingBox())!.width).toBeGreaterThan(25);
    }
    await page.screenshot({
      path: `test-results/screenshots/${testInfo.project.name}-${width}.png`,
      fullPage: true,
    });
  }
});
