import { test, expect } from '@playwright/test';

test.describe('Move 5 Bug Test', () => {
  test.beforeEach(async ({ page }) => {
    // Start dev server and navigate
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('should allow Move 5: 2 sheep to RIGHT', async ({ page }) => {
    console.log('=== STARTING 11-STEP SOLUTION TEST ===\n');

    // Helper to get animal by type and index
    const getAnimal = (type: 'sheep' | 'lion', index: number) => {
      return page.locator(`[data-animal-id="${type}-${index}"]`);
    };

    const boat = page.locator('[data-testid="boat"]');
    const moveButton = page.getByRole('button', { name: /move boat/i });

    // MOVE 1: Take 2 lions (lion-1, lion-2) to RIGHT
    console.log('Move 1: 2 lions → RIGHT');
    await getAnimal('lion', 1).dragTo(boat);
    await getAnimal('lion', 2).dragTo(boat);
    await moveButton.click();
    await page.waitForTimeout(1000);

    // Check game status
    let gameStatus = await page
      .locator('[data-testid="game-status"]')
      .textContent();
    console.log('  Game status:', gameStatus);
    expect(gameStatus).not.toContain('Game Over');

    // MOVE 2: Bring 1 lion (lion-1) back to LEFT
    console.log('Move 2: 1 lion ← LEFT');
    await getAnimal('lion', 1).dragTo(boat);
    await moveButton.click();
    await page.waitForTimeout(1000);

    gameStatus = await page
      .locator('[data-testid="game-status"]')
      .textContent();
    console.log('  Game status:', gameStatus);
    expect(gameStatus).not.toContain('Game Over');

    // MOVE 3: Take 2 lions (lion-1, lion-2) to RIGHT
    console.log('Move 3: 2 lions → RIGHT');
    await getAnimal('lion', 1).dragTo(boat);
    await getAnimal('lion', 2).dragTo(boat);
    await moveButton.click();
    await page.waitForTimeout(1000);

    gameStatus = await page
      .locator('[data-testid="game-status"]')
      .textContent();
    console.log('  Game status:', gameStatus);
    expect(gameStatus).not.toContain('Game Over');

    // MOVE 4: Bring 1 lion (lion-1) back to LEFT
    console.log('Move 4: 1 lion ← LEFT');
    await getAnimal('lion', 1).dragTo(boat);
    await moveButton.click();
    await page.waitForTimeout(1000);

    gameStatus = await page
      .locator('[data-testid="game-status"]')
      .textContent();
    console.log('  Game status:', gameStatus);
    expect(gameStatus).not.toContain('Game Over');

    // MOVE 5: Take 2 sheep (sheep-1, sheep-2) to RIGHT - THE CRITICAL TEST
    console.log('\n=== MOVE 5: 2 sheep → RIGHT (CRITICAL TEST) ===');

    // Listen to console for debug info
    page.on('console', msg => {
      if (msg.type() === 'log') {
        console.log('  Browser console:', msg.text());
      }
    });

    await getAnimal('sheep', 1).dragTo(boat);
    await getAnimal('sheep', 2).dragTo(boat);

    // Check state before moving
    console.log('  Before clicking Move Boat...');

    await moveButton.click();
    await page.waitForTimeout(1000);

    // Check game status after Move 5
    gameStatus = await page
      .locator('[data-testid="game-status"]')
      .textContent();
    console.log('  Game status after Move 5:', gameStatus);

    // THIS SHOULD NOT BE GAME OVER!
    expect(gameStatus).not.toContain('Game Over');
    expect(gameStatus).not.toContain('lost');

    console.log('\n✅ Move 5 completed successfully!');
  });
});
