import { test, expect } from '@playwright/test'

test.describe('Hobbyist wizard', () => {
  test('completes full wizard flow', async ({ page }) => {
    test.setTimeout(90000)

    await page.goto('http://localhost:5173')

    await page.click('text=I\'m a hobbyist')
    await expect(page).toHaveURL('/hobbyist')

    await expect(page.locator('h2')).toContainText('Where are you installing')
    await page.selectOption('select', 'abuja')
    await page.click('text=Next')

    await expect(page.locator('h2')).toContainText('What do you want to power')
    await page.fill('input[placeholder="Appliance name"]', 'LED bulb')
    await page.fill('input[placeholder="Watts"]', '10')
    await page.fill('input[placeholder="Hours/day"]', '6')
    await page.fill('input[placeholder="Qty"]', '4')
    await page.click('text=Calculate load')

    await expect(page.locator('h2')).toContainText('Your system', { timeout: 60000 })
    await expect(page.locator('p').filter({ hasText: 'Daily load:' }).first()).toBeVisible()
    await expect(page.locator('p').filter({ hasText: 'Panels needed:' }).first()).toBeVisible()
  })

  test('mode picker shows two options', async ({ page }) => {
    await page.goto('http://localhost:5173')
    await expect(page.locator('text=I\'m a hobbyist')).toBeVisible()
    await expect(page.locator('text=I\'m a professional')).toBeVisible()
  })
})