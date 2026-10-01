import { test, expect } from '@playwright/test'

test('shows and updates the manseryeok chart', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: '출생 정보 입력' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '나의 만세력' })).toBeVisible()

  await page.getByLabel('생년월일 *').fill('2000-01-01')
  await page.getByRole('button', { name: '만세력 보기' }).click()

  await expect(page.locator('#result')).toContainText('2000년 1월 1일')
  await expect(page.locator('.pillar')).toHaveCount(4)
})
