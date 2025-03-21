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

test("Agregar", async ({ page }) => {
    await page2.getByRole('button', { name: 'Agregar' }).click()
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
    await page2.getByRole('button', { name: 'Registrar' }).click()
    await page2.getByRole('button', { name: 'Continuar' }).click()
})

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
    // console.log(rfc)
    return rfc.toUpperCase()
}