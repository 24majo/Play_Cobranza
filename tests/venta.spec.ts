import { test, expect } from '@playwright/test'
import { login } from './ingresar.spec'
import { faker, fakerES_MX } from '@faker-js/faker'

let page2: any
var inicio: any
var fin: any

test.beforeEach(async ({ page }) => {
    page2 = await login(page)
    var link = page2.getByRole('link', { name: 'Venta' })
    await link.waitFor({ state: 'visible' })
    await link.click()
    var titulo = page2.locator('role=heading[name="Notas de Venta"]')
    await titulo.waitFor({ state: 'visible' })
    await expect(titulo).toBeVisible()
})

test("Pay", async ({ page }) => {
    await page2.getByRole('button', { name: 'Agregar' }).click()
    var button = page2.getByRole('button', { name: '+ Abonar' })
    await Add({ page2, button })
    await page2.getByRole('button', { name: 'Pago en Efectivo' }).click()
    var modal = await page2.locator('[aria-modal="true"][role="dialog"]:visible').nth(1)
    modal.waitFor({ state: 'visible' })
    var input = modal.locator('input[placeholder=""]')
    await input.fill(faker.number.int({ min: 1, max: 200 }).toString())
    await page2.getByRole('button', { name: 'Abonar', exact: true }).click()
    await page2.pause()
    await page2.getByRole('button', { name: 'Crear' }).click()
})

test("Create", async ({ page }) => {
    await page2.getByRole('button', { name: 'Agregar' }).click()
    var button = page2.getByRole('button', { name: 'Crear' })
    await Add({ page2, button })
})


// ----------------------------------------------------------------------------

async function Random(boton) {
    var count = await boton.count()
    var random = Math.floor(Math.random() * count)
    await boton.nth(random).click({force: true })
}

async function Add({ page2, button }){
    await page2.getByRole('textbox', { name: 'Cliente' }).click()
    var opciones = page2.locator('[role="option"]:visible')
    await Random(opciones)

    for(var i = 0; i < 3; i++){
        await page2.getByRole('button', { name: 'Agregar' }).click()
        await page2.getByRole('textbox').nth(2).click()
        opciones = page2.locator('[role="option"]:visible')
        await Random(opciones)
    }
    
    await page2.getByRole('button', { name: 'Siguiente' }).click()
    await button.click()
}