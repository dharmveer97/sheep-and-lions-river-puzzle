import { test, expect } from '@playwright/test';

test.describe('Complete Game Playthrough', () => {
  test('should complete all 11 moves successfully', async ({ page }) => {
    test.setTimeout(120000); // 2 minutes timeout for the whole test
    // Navigate to the game (using deployed version)
    await page.goto('https://zeeree.vercel.app');
    await page.waitForLoadState('networkidle');

    // Wait for game to load
    await page.waitForTimeout(2000);

    // Take initial screenshot
    await page.screenshot({ path: 'screenshots/00-initial-state.png', fullPage: true });
    console.log('📸 Screenshot: Initial state');

    const moveBoatButton = page.getByTestId('move-boat-button');
    const boatArea = page.getByTestId('boat-area');

    // Helper function to move animals
    const moveAnimals = async (animalIds: string[], moveNumber: number, description: string) => {
      console.log(`\n🎮 Move ${moveNumber}: ${description}`);

      // Click each animal to select, then click boat to move it there
      for (const id of animalIds) {
        const animal = page.getByTestId(id);
        await animal.click({ force: true }); // Select the animal
        await page.waitForTimeout(500);
        await boatArea.click({ force: true }); // Move it to the boat (force because of animations)
        await page.waitForTimeout(800);
      }

      // Wait for state to settle
      await page.waitForTimeout(1000);

      // Take screenshot with animals in boat
      await page.screenshot({
        path: `screenshots/${String(moveNumber).padStart(2, '0')}a-animals-in-boat.png`,
        fullPage: true
      });
      console.log(`📸 Screenshot: Animals loaded in boat`);

      // Wait a bit more before clicking Move Boat
      await page.waitForTimeout(500);

      // Click Move Boat button
      await moveBoatButton.click({ force: true });
      await page.waitForTimeout(1500);

      // Take screenshot after move
      await page.screenshot({
        path: `screenshots/${String(moveNumber).padStart(2, '0')}b-after-move.png`,
        fullPage: true
      });
      console.log(`📸 Screenshot: After move completed`);

      // Check game status - should not be game over
      const pageContent = await page.content();
      expect(pageContent).not.toContain('Game Over');
      expect(pageContent).not.toContain('lost');
      console.log('✅ Move successful - game still playing');
    };

    // Move 1: Take 2 lions → RIGHT
    await moveAnimals(['lion-1', 'lion-2'], 1, '2 lions → RIGHT');

    // Move 2: Bring 1 lion ← LEFT
    await moveAnimals(['lion-1'], 2, '1 lion ← LEFT');

    // Move 3: Take 2 lions → RIGHT
    await moveAnimals(['lion-1', 'lion-2'], 3, '2 lions → RIGHT');

    // Move 4: Bring 1 lion ← LEFT
    await moveAnimals(['lion-1'], 4, '1 lion ← LEFT');

    // Move 5: Take 2 sheep → RIGHT (THE CRITICAL TEST!)
    console.log('\n🔥 MOVE 5 - CRITICAL TEST - This was previously failing!');
    await moveAnimals(['sheep-1', 'sheep-2'], 5, '2 sheep → RIGHT');
    console.log('🎉 MOVE 5 PASSED! Bug is fixed!');

    // Move 6: Bring 1 sheep + 1 lion ← LEFT
    await moveAnimals(['sheep-1', 'lion-1'], 6, '1 sheep + 1 lion ← LEFT');

    // Move 7: Take 2 sheep → RIGHT
    await moveAnimals(['sheep-1', 'sheep-2'], 7, '2 sheep → RIGHT');

    // Move 8: Bring 1 lion ← LEFT
    await moveAnimals(['lion-1'], 8, '1 lion ← LEFT');

    // Move 9: Take 2 lions → RIGHT
    await moveAnimals(['lion-1', 'lion-2'], 9, '2 lions → RIGHT');

    // Move 10: Bring 1 lion ← LEFT
    await moveAnimals(['lion-1'], 10, '1 lion ← LEFT');

    // Move 11: Take 2 lions → RIGHT
    await moveAnimals(['lion-1', 'lion-2'], 11, '2 lions → RIGHT');

    // Wait for win animation
    await page.waitForTimeout(2000);

    // Take final screenshot
    await page.screenshot({ path: 'screenshots/12-victory.png', fullPage: true });
    console.log('\n📸 Screenshot: VICTORY!');

    // Verify win condition
    const pageContent = await page.content();
    expect(pageContent).toContain('You Won');

    console.log('\n🏆 GAME COMPLETED SUCCESSFULLY!');
    console.log('All 11 moves executed without errors');
    console.log('Screenshots saved to screenshots/ directory');
  });
});
