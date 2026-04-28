import { test, expect } from '@playwright/test';

test.describe('People Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for initial data to load (skeleton to disappear)
    await page.waitForSelector('table', { timeout: 10_000 });
  });

  test('page loads with people data', async ({ page }) => {
    // Title renders
    await expect(page.getByTestId('page-title')).toHaveText('People');

    // Table has rows
    const rows = page.locator('tbody tr');
    await expect(rows.first()).toBeVisible({ timeout: 8_000 });
  });

  test('search filters results', async ({ page }) => {
    const searchInput = page.getByLabel('Search people');
    await searchInput.fill('a');

    // Wait for debounce + re-fetch
    await page.waitForTimeout(400);
    await page.waitForLoadState('networkidle');

    // Table should update — just verify it re-renders without crashing
    await expect(page.locator('table')).toBeVisible();
  });

  test('filter by Active status', async ({ page }) => {
    // Click Active checkbox
    await page.getByText('Active', { exact: true }).first().click();

    await page.waitForTimeout(300);
    await page.waitForLoadState('networkidle');

    // Filter chip should appear
    await expect(page.getByLabel('Remove filter: Active')).toBeVisible();

    // Table still renders
    await expect(page.locator('table')).toBeVisible();
  });

  test('multiple status filters combine', async ({ page }) => {
    await page.getByText('Active', { exact: true }).first().click();
    await page.getByText('Onboarding').first().click();

    await page.waitForTimeout(300);

    await expect(page.getByLabel('Remove filter: Active')).toBeVisible();
    await expect(page.getByLabel('Remove filter: Onboarding')).toBeVisible();
  });

  test('clear all filters removes chips', async ({ page }) => {
    await page.getByText('Active', { exact: true }).first().click();
    await page.waitForTimeout(200);

    await expect(page.getByLabel('Remove filter: Active')).toBeVisible();

    await page.getByText('Clear all').click();

    await expect(page.getByLabel('Remove filter: Active')).not.toBeVisible();
  });

  test('sort by name column', async ({ page }) => {
    await page.waitForSelector('tbody tr', { timeout: 8_000 });

    // Click Name sort header
    await page.getByRole('button', { name: 'Sort by Name' }).click();

    await page.waitForTimeout(300);
    await page.waitForLoadState('networkidle');

    // URL should contain sortBy=name
    expect(page.url()).toContain('sortBy=name');
    expect(page.url()).toContain('order=asc');
  });

  test('sort toggles asc → desc → none', async ({ page }) => {
    await page.waitForSelector('tbody tr', { timeout: 8_000 });
    const sortBtn = page.getByRole('button', { name: 'Sort by Name' });

    await sortBtn.click();
    expect(page.url()).toContain('order=asc');

    await sortBtn.click();
    expect(page.url()).toContain('order=desc');

    await sortBtn.click();
    expect(page.url()).not.toContain('sortBy=name');
  });

  test('pagination next page loads', async ({ page }) => {
    await page.waitForSelector('tbody tr', { timeout: 8_000 });

    // Use chevron right nav button
    const navButtons = page.locator('button').filter({ has: page.locator('svg') });
    await navButtons.nth(1).click();

    await page.waitForTimeout(300);
    await page.waitForLoadState('networkidle');

    // Page should update in URL
    expect(page.url()).toContain('page=2');
  });

  test('switch to infinite scroll mode', async ({ page }) => {
    await page.getByRole('button', { name: 'Infinite Scroll', exact: true }).click();

    // URL updates
    expect(page.url()).toContain('viewMode=infinite');

    // Table still renders
    await expect(page.locator('table')).toBeVisible();
  });

  test('add member modal opens and validates', async ({ page }) => {
    await page.getByText('+ Add member').click();

    // Modal appears
    await expect(page.getByRole('dialog', { name: 'Add member' })).toBeVisible();

    // Submit empty form
    await page.getByRole('button', { name: 'Add member' }).last().click();

    // Validation errors appear
    await expect(page.getByRole('alert').first()).toBeVisible();
  });

  test('add member modal closes on cancel', async ({ page }) => {
    await page.getByText('+ Add member').click();
    await expect(page.getByRole('dialog', { name: 'Add member' })).toBeVisible();

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('dialog', { name: 'Add member' })).not.toBeVisible();
  });

  test('person drawer opens on row click', async ({ page }) => {
    await page.waitForSelector('tbody tr', { timeout: 8_000 });

    const firstRow = page.locator('tbody tr').first();
    await firstRow.click();

    await expect(page.getByText('Member details')).toBeVisible({ timeout: 2_000 });
  });

  test('save and load filter preset', async ({ page }) => {
    // Apply a filter
    await page.getByText('Active', { exact: true }).first().click();
    await page.waitForTimeout(200);

    // Open save input
    await page.getByText('+ Save current').click();

    // Type preset name
    await page.getByLabel('Saved filter name').fill('My preset');
    await page.keyboard.press('Enter');

    // Preset chip appears
    await expect(page.getByTitle('Load filter: My preset')).toBeVisible();

    // Reload and verify it persists (localStorage)
    await page.reload();
    await page.waitForSelector('table', { timeout: 10_000 });

    await expect(page.getByTitle('Load filter: My preset')).toBeVisible();
  });

  test('group by country shows section headers', async ({ page }) => {
    await page.waitForSelector('tbody tr', { timeout: 8_000 });

    await page.getByLabel('Group by').selectOption('country');

    await page.waitForTimeout(300);

    // Group headers appear (uppercase country labels in the table)
    const groupRows = page.locator('tr td[colspan="6"]');
    await expect(groupRows.first()).toBeVisible();
  });
});
