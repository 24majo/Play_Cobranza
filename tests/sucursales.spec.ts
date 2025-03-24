import { expect, test } from '@playwright/test'
import { login } from './ingresar.spec'
import { fakerES_MX } from '@faker-js/faker'

let page2: any
var inicio: any
var fin: any

test.beforeEach(async ({ page }) => {
    page2 = await login(page)
    var link = page2.getByRole('link', { name: 'Sucursales' })
    inicio = Date.now()
    await link.waitFor({ state: 'visible' })
    await expect(link).toBeVisible()
    fin = Date.now()
    console.log("Tiempo de inicio de sesión: " + (fin - inicio) + "ms")
    await link.click()
    var titulo = page2.locator('role=heading[name="Sucursales"]')
    await titulo.waitFor({ state: 'visible' })
    await expect(titulo).toBeVisible()
})

test("Add", async ({ page }) => {
    for(var i = 0; i < 5; i++) {
        await page2.getByRole('button', { name: 'Agregar' }).click()
        await Datos({ page2 })
        await page2.getByRole('button', { name: 'Registrar' }).click()
        await page2.getByRole('button', { name: 'Continuar' }).click()
        inicio = Date.now()
        await page2.locator('[aria-modal="true"][role="dialog"]:visible').nth(1).waitFor({ state: 'hidden'})
        fin = Date.now()
        console.log("Agregar sucursal: " + (fin - inicio) + "ms")
    }
    
})

test("Edit", async ({ page }) => {
    var btn_edit: number[] = []
    var edit = page2.getByRole('button', { name: 'Settings' })
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
    var edit = await page2.getByRole('button', { name: 'Settings' })
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

test("DeleteAll", async({ page }) => {
    var btn_edit: number[] = []
    var edit = await page2.getByRole('button', { name: 'Settings' })
    var count = await edit.count()
    console.log("Settings: " + count)

    for (var i = 0; i < count; i++) {
        if (i % 2 === 0) 
            btn_edit.push(i)
    }

    var random = btn_edit[Math.floor(Math.random() * btn_edit.length)]
    await edit.nth(random).click()
    await page2.getByRole('button', { name: 'Eliminar Sucursal' }).click()
    await page2.getByRole('button', { name: 'Sí, eliminarlo' }).click()
})

// -----------------------------------------------------------------------------

async function Datos({ page2 }){
    await page2.getByRole('textbox', { name: 'Nombre' }).fill(fakerES_MX.company.name())
    await page2.getByRole('textbox', { name: 'Teléfono' }).fill(fakerES_MX.number.int({ min: 1000000000, max: 9999999999 }).toString())
    await page2.getByRole('textbox', { name: 'Ubicación' }).fill(fakerES_MX.location.street())
    await page2.getByRole('textbox', { name: 'Estado' }).fill(fakerES_MX.location.state())
    await page2.getByRole('textbox', { name: 'Ciudad' }).fill(fakerES_MX.location.city())
    await page2.getByRole('textbox', { name: 'Codigo Postal' }).fill(fakerES_MX.location.zipCode())
}