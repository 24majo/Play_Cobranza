import { test } from '@playwright/test'
import { login } from './ingresar.spec'

test.beforeEach(async ({ page }) => {
    await login(page)
})

test("Ingreso", async ({ page }) => {

})
