import { Page } from '@playwright/test'

export const login = async (page: Page) => {
    await page.goto('http://localhost:3002/')
    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill('marijoguerrero25@prueba.com')
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345678')
    await page.getByRole('button', { name: 'Iniciar Sesión', exact: true }).click({force: true})
    const page2Promise = page.waitForEvent('popup')
    await page.getByRole('button', { name: 'Ir a Cobranza' }).click()
    const page2 = await page2Promise
    await page2.getByRole('link', { name: 'Inicio' }).isVisible()
    return page2
}
