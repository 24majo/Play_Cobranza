import { test, expect } from '@playwright/test'
import { login } from './ingresar.spec'
import { faker, fakerES_MX } from '@faker-js/faker'

let page2: any
var inicio: any
var fin: any

test.beforeEach(async ({ page }) => {
    page2 = await login(page)
    var link = page2.getByRole('link', { name: 'Abono' })
    await link.waitFor({ state: 'visible' })
    await link.click()
    var titulo = page2.locator('role=heading[name="Abonos"]')
    await titulo.waitFor({ state: 'visible' })
    await expect(titulo).toBeVisible()
})

test("Add", async ({ page }) => {
    await page2.getByRole('button', { name: 'Agregar' }).click()
    var titulo = page2.locator('role=heading[name="Notas de Venta"]')
    await titulo.waitFor({ state: 'visible' })
    await expect(titulo).toBeVisible()
    var op = page2.locator('input[type="checkbox"]')
    await op.nth(0).waitFor({ state: 'visible' })
    var count = await op.count()
    console.log(count)
    var random = Math.floor(Math.random() * 5)
    await op.nth(random).check()
    await page2.getByRole('button', { name: 'Siguiente' }).click()
    var total = page2.locator('text=Total pendiente: $')
    var text = await total.textContent()
    var num = text?.match(/Total pendiente: \$(\d[\d,]*)/)
    if (num) {
        var pen = num[1].replace(/,/g, '')
        console.log(pen)
    } 
    else {
        console.log('No se encontró el número')
        process.exit(0)
    }

    await page2.getByRole('button', { name: 'Abonar' }).click()
    await page2.getByRole('button', { name: 'Pago en Efectivo' }).click()
    var modal = await page2.locator('[aria-modal="true"][role="dialog"]:visible').nth(1)
    modal.waitFor({ state: 'visible' })
    var input = modal.locator('input[placeholder=""]')
    await input.fill(faker.number.int({ min: 1, max: pen }).toString())
    await page2.getByLabel('Abonar').getByRole('button', { name: 'Abonar' }).click()
    await page2.getByRole('button', { name: 'Finalizar' }).click()
    await page2.pause()
})