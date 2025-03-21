import { expect, test } from '@playwright/test'
import { login } from './ingresar.spec'
import { fakerES_MX, faker, da } from '@faker-js/faker'

let page2: any
var inicio: any
var fin: any

test.beforeEach(async ({ page }) => {
    page2 = await login(page)
    inicio = Date.now()
    var link = page2.getByRole('link', { name: 'Clientes' })
    await link.waitFor({ state: 'visible' })
    await expect(link).toBeVisible()
    fin = Date.now()
    console.log("Inicio de sesión: " + (fin - inicio) + "ms")
    await link.click()
})

test("Add", async ({ page }) => {
    for (var i = 0; i < 5; i++){
        await page2.getByRole('button', { name: 'Agregar' }).click()
        await Datos({page2}) 
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

test("Delete", async ({ page }) => {
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

// --------------------------------------------------------------------------------------------

async function Datos({ page2 }){
    await page2.getByRole('textbox', { name: 'Nombre' }).fill(fakerES_MX.person.firstName())
    await page2.getByRole('textbox', { name: 'Apellidos' }).fill(fakerES_MX.person.lastName())
    var rfc = await RFC({ page2 })
    await page2.getByRole('textbox', { name: 'RFC' }).fill(rfc)
    await page2.getByRole('textbox', { name: 'Domicilio' }).fill(fakerES_MX.location.street())
    await page2.getByRole('textbox', { name: 'Código Postal' }).fill(fakerES_MX.location.zipCode())
    await page2.getByRole('textbox', { name: 'Sucursal' }).click()
    await page2.waitForTimeout(1000)
    var options = await page2.locator('[role="listbox"] [role="option"]').all()
    var random = Math.floor(Math.random() * options.length)
    await options[random].click()
    await page2.getByRole('textbox', { name: 'Correo electrónico' }).fill(fakerES_MX.internet.email())
    await page2.getByRole('textbox', { name: 'Teléfono' }).fill(fakerES_MX.number.int({ min: 1000000000, max: 9999999999 }).toString())
}

async function RFC({ page2 }){
    var nombre = await page2.getByRole('textbox', { name: 'Nombre' }).inputValue()
    var apellidos = await page2.getByRole('textbox', { name: 'Apellidos' }).inputValue()
    var [paterno, materno] = apellidos.split(' ')

    var last_name1 = paterno.charAt(0) + paterno.charAt(1)
    var last_name2 = materno.charAt(0)
    var name = nombre.charAt(0)

    var date = faker.date.past({years: 20})
    var year = date.getFullYear().toString().slice(-2)
    var month = (date.getMonth() + 1).toString().padStart(2, '0')
    var day = date.getDate().toString().padStart(2, '0')
    var homoclave = faker.string.alphanumeric(3).toUpperCase()

    var rfc = `${last_name1}${last_name2}${name}${year}${month}${day}${homoclave}`
    return rfc.toUpperCase()
}