import { test, expect } from '@playwright/test'
import { login } from './ingresar.spec'
import { faker, fakerES_MX } from '@faker-js/faker'

let page2: any
var inicio: any
var fin: any

test.beforeEach(async ({ page }) => {
    page2 = await login(page)
    var link = page2.getByRole('link', { name: 'Venta' })
    inicio = Date.now()
    await link.waitFor({ state: 'visible' })
    await expect(link).toBeVisible()
    fin = Date.now()
    console.log("Tiempo de inicio de sesión: " + (fin - inicio) + "ms")
    await link.click()
    var titulo = page2.locator('role=heading[name="Notas de Venta"]')
    await titulo.waitFor({ state: 'visible' })
    await expect(titulo).toBeVisible()
})

test("Pay", async ({ page }) => { // Crear nota de venta con abono
    await page2.pause()
    await page2.getByRole('button', { name: 'Agregar' }).click()
    var button = page2.getByRole('button', { name: '+ Abonar' })
    await Add({ page2, button })
    var option = 2
    switch(option){
        case 1: // Pago con efectivo
            for(var i = 0; i < 3; i++)
                await AbonoCash()
            break
        case 2: // Pago con tarjeta
            for(var i = 0; i < 3; i++)
                await AbonoCard()
            break
        case 3: // Ambas opciones
            await Both()
            break    
    }

    await AbonoCash()
    await page2.getByRole('button', { name: 'Crear' }).click()
    inicio = Date.now()
    await page2.getByRole('textbox', { name: 'Buscar al cliente' }).waitFor({ state: 'visible' })
    fin = Date.now()
    console.log("Tiempo de respuesta para crear nota con abono: " + (fin - inicio) + "ms")
})

test("Create", async ({ page }) => {
    await page2.getByRole('button', { name: 'Agregar' }).click()
    var button = page2.getByRole('button', { name: 'Crear' })
    await Add({ page2, button })
})

// ----------------------------------------------------------------------------

async function Both(){
    for(var i = 0; i < 3; i++){
        await AbonoCard()
        await AbonoCash()
    }
}

async function AbonoCard(){
    await page2.getByRole('button', { name: 'Pago con Tarjeta' }).click()
    Amount()
}

async function AbonoCash(){
    await page2.getByRole('button', { name: 'Pago en Efectivo' }).click()
    await Amount()
}

async function Amount() {
    var modal = await page2.locator('[aria-modal="true"][role="dialog"]:visible').nth(1)
    modal.waitFor({ state: 'visible' })
    var random = (Math.floor(Math.random() * 4)) + 1
    var button = modal.locator('button').nth(random)
    await button.waitFor({ state: 'visible' })
    await button.click()
    await page2.getByRole('button', { name: 'Abonar', exact: true }).click()
    await page2.getByRole('button', { name: '+ Abonar' }).click()
}

async function Random(boton) {
    var count = await boton.count()
    var random = Math.floor(Math.random() * count)
    await boton.nth(random).click({force: true })
    await page2.waitForTimeout(800)
}

async function Add({ page2, button }){
    await page2.getByRole('textbox', { name: 'Cliente' }).click()
    var opciones = page2.locator('[role="option"]:visible')
    await Random(opciones)

    for(var i = 0; i < 2; i++){
        await page2.getByRole('button', { name: 'Agregar' }).click()
        var random = Math.floor(1 + Math.random() * 5).toString()
        await page2.getByRole('textbox').nth(i+1).fill(random)
        await page2.locator('[aria-haspopup="listbox"]').nth(i+1).click()
        opciones = page2.locator('[role="option"]:visible')
        await Random(opciones)
    }
    
    await page2.getByRole('button', { name: 'Siguiente' }).click()
    await button.click()
}