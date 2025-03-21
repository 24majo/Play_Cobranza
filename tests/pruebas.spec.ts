import { test } from '@playwright/test'
import { fakerES_MX } from '@faker-js/faker'

test("Prueba", async ({ page }) => {
    var rfc = fakerES_MX.person.firstName() + fakerES_MX.person.lastName() + fakerES_MX.date.past().getFullYear().toString().slice(-2)
    console.log(rfc)
})

