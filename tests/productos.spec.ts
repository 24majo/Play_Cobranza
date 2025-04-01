import { test, expect } from '@playwright/test'
import { login } from './ingresar.spec'
import { faker, fakerES_MX } from '@faker-js/faker'
let page2: any
var inicio: any
var fin: any
test.beforeEach(async ({ page }) => {
    page2 = await login(page)
    inicio = Date.now()
    var link = page2.getByRole('link', { name: 'Productos/Servicios' })
    await link.waitFor({ state: 'visible' })
    await expect(link).toBeVisible()
    fin = Date.now()
    console.log("Inicio de sesión: " + (fin - inicio) + "ms")
    await link.click()
    var titulo = page2.locator('role=heading[name="Productos y Servicios"]')
    await titulo.waitFor({ state: 'visible' })
    await expect(titulo).toBeVisible()
})
test("Add", async ({ page }) => {
    for(var i = 0; i < 3; i++){
        await page2.getByRole('button', { name: 'Agregar' }).click()
        await Datos({ page2 })
        await page2.getByRole('button', { name: 'Registrar' }).click()
        await page2.getByRole('button', { name: 'Continuar' }).click()
    }
})

test("Update", async ({ page }) => {
    var btn_edit: number[] = []
    var edit = page2.getByLabel('Settings')
    await edit.first().waitFor({ state: 'visible' })
    var count = await edit.count()
    console.log("Settings: " + count)

    for (var i = 0; i < count; i++) {
        if (i % 2 === 0) 
            btn_edit.push(i)
    }

    var random = btn_edit[Math.floor(Math.random() * btn_edit.length)]
    await edit.nth(random).click()
    await Datos({page2})
    await page2.getByRole('button', { name: 'Guardar Cambios' }).click()
    await page2.getByRole('button', { name: 'Continuar' }).click()
    inicio = Date.now()
    await page2.locator('[aria-modal="true"][role="dialog"]:visible').nth(1).waitFor({ state: 'hidden'})
    fin = Date.now()
    console.log("Editar sucursal: " + (fin - inicio) + "ms")
})

test("DeleteOut", async ({ page }) => {
    var btn_edit: number[] = []
    var edit = page2.getByLabel('Settings')
    var count = await edit.count()
    console.log("Settings: " + count)

    for (var i = 0; i < count; i++) {
        if (i % 2 != 0) 
            btn_edit.push(i)
    }

    var random = btn_edit[Math.floor(Math.random() * btn_edit.length)]
    await edit.nth(random).click()
    await page2.getByRole('button', { name: 'Sí, eliminarlo' }).click()
})

// ---------------------------------------------------------------------

async function Random(boton) {
    var count = await boton.count()
    var random = Math.floor(Math.random() * count)
    await boton.nth(random).click({force: true })
}

async function Datos({ page2 }){
    await page2.getByRole('textbox', { name: 'Nombre' }).fill(fakerES_MX.commerce.productName())
    await page2.getByRole('textbox', { name: 'Categoria' }).fill(fakerES_MX.commerce.department())
    await page2.getByRole('textbox', { name: 'Tipo' }).click()
    var opciones = page2.locator('[role="option"]:visible')
    await Random(opciones)
    await page2.getByRole('textbox', { name: 'SkU' }).fill(faker.hacker.ingverb()+faker.number.int({ min: 1, max: 1000 }))
    await page2.getByRole('textbox', { name: 'Precio' }).fill(faker.number.int({ min: 1, max: 9999 }).toString())
    await page2.getByRole('textbox', { name: 'Imagen' }).fill(fakerES_MX.internet.url())
    await page2.getByRole('textbox', { name: 'Descripción' }).fill(fakerES_MX.lorem.paragraph())
    await page2.getByRole('textbox', { name: 'Sucursal' }).click()
    opciones = page2.locator('[role="option"]:visible')
    await Random(opciones)
}