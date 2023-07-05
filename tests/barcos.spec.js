import { test, expect } from '@playwright/test';


test('Test creación partida', async ({ page }) => 
{
  await page.goto('http://localhost:3000/');
  await page.getByPlaceholder('Introduce tu nick (max 6 letras)').click();
  await page.getByPlaceholder('Introduce tu nick (max 6 letras)').fill('J');
  await page.getByPlaceholder('Introduce tu nick (max 6 letras)').press('CapsLock');
  await page.getByPlaceholder('Introduce tu nick (max 6 letras)').fill('Juan');
  await page.getByRole('button', { name: 'Accede con nick' }).click();
  await page.getByRole('button', { name: 'Crear Partida' }).click();
  await page.getByRole('button', { name: 'Abandonar partida' }).click();
  await page.getByRole('button', { name: 'Cerrar' }).click();
  await page.getByRole('button', { name: 'Salir' }).click();
});


test('Test creación partida y unirse', async ({ browser }) => {

    const pepeContext = await browser.newContext();
    const juanContext = await browser.newContext();

    const page = await pepeContext.newPage();
    const page1 = await juanContext.newPage();

    await page.goto('http://localhost:3000/');
    await page1.goto('http://localhost:3000/');

  await page.getByPlaceholder('Introduce tu nick (max 6 letras)').click();
  await page.getByPlaceholder('Introduce tu nick (max 6 letras)').fill('pepe');
  await page.getByRole('button', { name: 'Accede con nick' }).click();
  await page.getByRole('button', { name: 'Crear Partida' }).click();
  await page1.getByPlaceholder('Introduce tu nick (max 6 letras)').click();
  await page1.getByPlaceholder('Introduce tu nick (max 6 letras)').fill('juan');
  await page1.getByRole('button', { name: 'Accede con nick' }).click();
});


test('Test partida 2 usuarios', async ({ browser }) => {

    const pepeContext = await browser.newContext();
    const juanContext = await browser.newContext();

    const page = await pepeContext.newPage();
    const page1 = await juanContext.newPage();

    await page.goto('http://localhost:3000/');
    await page1.goto('http://localhost:3000/');

  await page.getByPlaceholder('Introduce tu nick (max 6 letras)').click();
  await page.getByPlaceholder('Introduce tu nick (max 6 letras)').fill('ines');
  await page.getByRole('button', { name: 'Accede con nick' }).click();
  await page1.getByPlaceholder('Introduce tu nick (max 6 letras)').click();
  await page1.getByPlaceholder('Introduce tu nick (max 6 letras)').fill('clara');
  await page1.getByRole('button', { name: 'Accede con nick' }).click();
  await page.getByRole('button', { name: 'Crear Partida' }).click();
  await page1.getByRole('link', { name: 'Partida creada por ines' }).click();
  //COLOCAR BARCOS
  //CLARA
  await page1.getByText('p1').click();
  await page1.locator('.grid-cell').first().click();
  await page1.getByText('p2').click();
  await page1.locator('div:nth-child(11)').first().click();
  await page1.getByText('p3').click();
  await page1.locator('div:nth-child(21)').first().click();
  await page1.getByText('p4').click();
  await page1.locator('div:nth-child(31)').first().click();
  //COLOCAR BARCOS
  //INES
  await page.getByText('p1').click();
  await page.locator('.grid-cell').first().click();
  await page.getByText('p2').click();
  await page.locator('div:nth-child(11)').first().click();
  await page.getByText('p3').click();
  await page.locator('div:nth-child(21)').first().click();
  await page.getByText('p4').click();
  await page.locator('div:nth-child(31)').first().click();

  //CERRAR MODAL PARA EMPEZAR A JUGAR

  await page.getByRole('button', { name: 'Cerrar' }).click();
  await page1.getByRole('button', { name: 'Cerrar' }).click();

  //DISPARAR
  await page.locator('div:nth-child(3) > .grid > div').first().click();
  await page.locator('div:nth-child(3) > .grid > div:nth-child(11)').click();
  await page.locator('div:nth-child(3) > .grid > div:nth-child(12)').click();
  await page.locator('div:nth-child(3) > .grid > div:nth-child(21)').click();
  await page.locator('div:nth-child(3) > .grid > div:nth-child(22)').click();
  await page.locator('div:nth-child(3) > .grid > div:nth-child(23)').click();
  await page.locator('div:nth-child(3) > .grid > div:nth-child(31)').click();
  await page.locator('div:nth-child(3) > .grid > div:nth-child(32)').click();
  await page.locator('div:nth-child(3) > .grid > div:nth-child(33)').click();
  await page.locator('div:nth-child(3) > .grid > div:nth-child(35)').click();
  await page1.locator('div:nth-child(3) > .grid > div').first().click();
  await page1.locator('div:nth-child(3) > .grid > div:nth-child(2)').click();
  await page.locator('div:nth-child(3) > .grid > div:nth-child(34)').click();

  //CERRAR MODAL FINAL PARTIDA
  await page.getByRole('button', { name: 'Cerrar' }).click();
  await page.getByRole('button', { name: 'Salir' }).click();
  await page1.getByRole('button', { name: 'Cerrar' }).click();
  await page1.getByRole('button', { name: 'Salir' }).click();
});



test('Test error 401', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.goto('http://localhost:3000/a');
  await page.getByRole('link', { name: 'Volver' }).click();
  await page.getByPlaceholder('Introduce tu nick (max 6 letras)').click();
  await page.getByPlaceholder('Introduce tu nick (max 6 letras)').fill('rebe');
  await page.getByRole('button', { name: 'Accede con nick' }).click();
  await page.goto('http://localhost:3000/b');
  await page.getByRole('link', { name: 'Volver' }).click();
  await page.getByRole('button', { name: 'Salir' }).click();
});
