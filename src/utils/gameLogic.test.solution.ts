import { GameState } from '@/types/game';
import { wouldMoveBeValid, areSheepEaten } from './gameLogic';

describe('11-Step Solution Test', () => {
  it('should complete the full 11-step solution', () => {
    console.log('=== TESTING 11-STEP SOLUTION ===\n');

    // Initial state
    const state: GameState = {
      leftSheep: 3,
      leftLions: 3,
      rightSheep: 0,
      rightLions: 0,
      boatSheep: 0,
      boatLions: 0,
      boatPosition: 'left',
      gameStatus: 'playing',
    };

    console.log('INITIAL STATE:');
    console.log(`LEFT: ${state.leftSheep}🐑 ${state.leftLions}🦁`);
    console.log(`BOAT: ${state.boatSheep}🐑 ${state.boatLions}🦁`);
    console.log(`RIGHT: ${state.rightSheep}🐑 ${state.rightLions}🦁`);
    console.log(`Boat position: ${state.boatPosition}\n`);

    // Move 1: Take 2 lions to RIGHT
    console.log('=== MOVE 1: Take 2 lions → RIGHT ===');
    state.boatLions = 2;
    state.leftLions = 1;
    console.log('After loading boat:');
    console.log(`LEFT: ${state.leftSheep}🐑 ${state.leftLions}🦁`);
    console.log(`BOAT: ${state.boatSheep}🐑 ${state.boatLions}🦁`);
    console.log(`RIGHT: ${state.rightSheep}🐑 ${state.rightLions}🦁`);

    const move1Valid = wouldMoveBeValid(state);
    console.log(`Validation: ${move1Valid.valid ? '✅ VALID' : '❌ INVALID'}`);
    if (!move1Valid.valid) console.log(`Reason: ${move1Valid.reason}`);

    state.rightLions = 2;
    state.boatLions = 0;
    state.boatPosition = 'right';
    console.log('After move:');
    console.log(
      `LEFT: ${state.leftSheep}🐑 ${state.leftLions}🦁 - Safe: ${!areSheepEaten(state.leftSheep, state.leftLions)}`
    );
    console.log(
      `RIGHT: ${state.rightSheep}🐑 ${state.rightLions}🦁 - Safe: ${!areSheepEaten(state.rightSheep, state.rightLions)}\n`
    );

    // Move 2: Bring 1 lion back to LEFT
    console.log('=== MOVE 2: Bring 1 lion ← LEFT ===');
    state.boatLions = 1;
    state.rightLions = 1;

    const move2Valid = wouldMoveBeValid(state);
    console.log(`Validation: ${move2Valid.valid ? '✅ VALID' : '❌ INVALID'}`);
    if (!move2Valid.valid) console.log(`Reason: ${move2Valid.reason}`);

    state.leftLions = 2;
    state.boatLions = 0;
    state.boatPosition = 'left';
    console.log('After move:');
    console.log(
      `LEFT: ${state.leftSheep}🐑 ${state.leftLions}🦁 - Safe: ${!areSheepEaten(state.leftSheep, state.leftLions)}`
    );
    console.log(
      `RIGHT: ${state.rightSheep}🐑 ${state.rightLions}🦁 - Safe: ${!areSheepEaten(state.rightSheep, state.rightLions)}\n`
    );

    // Move 3: Take 2 lions to RIGHT
    console.log('=== MOVE 3: Take 2 lions → RIGHT ===');
    state.boatLions = 2;
    state.leftLions = 0;

    const move3Valid = wouldMoveBeValid(state);
    console.log(`Validation: ${move3Valid.valid ? '✅ VALID' : '❌ INVALID'}`);
    if (!move3Valid.valid) console.log(`Reason: ${move3Valid.reason}`);

    state.rightLions = 3;
    state.boatLions = 0;
    state.boatPosition = 'right';
    console.log('After move:');
    console.log(
      `LEFT: ${state.leftSheep}🐑 ${state.leftLions}🦁 - Safe: ${!areSheepEaten(state.leftSheep, state.leftLions)}`
    );
    console.log(
      `RIGHT: ${state.rightSheep}🐑 ${state.rightLions}🦁 - Safe: ${!areSheepEaten(state.rightSheep, state.rightLions)}\n`
    );

    // Move 4: Bring 1 lion back to LEFT
    console.log('=== MOVE 4: Bring 1 lion ← LEFT ===');
    state.boatLions = 1;
    state.rightLions = 2;

    const move4Valid = wouldMoveBeValid(state);
    console.log(`Validation: ${move4Valid.valid ? '✅ VALID' : '❌ INVALID'}`);
    if (!move4Valid.valid) console.log(`Reason: ${move4Valid.reason}`);

    state.leftLions = 1;
    state.boatLions = 0;
    state.boatPosition = 'left';
    console.log('After move:');
    console.log(
      `LEFT: ${state.leftSheep}🐑 ${state.leftLions}🦁 - Safe: ${!areSheepEaten(state.leftSheep, state.leftLions)}`
    );
    console.log(
      `RIGHT: ${state.rightSheep}🐑 ${state.rightLions}🦁 - Safe: ${!areSheepEaten(state.rightSheep, state.rightLions)}\n`
    );

    // Move 5: Take 2 sheep to RIGHT - THE PROBLEMATIC MOVE
    console.log('=== MOVE 5: Take 2 sheep → RIGHT (CRITICAL TEST) ===');
    state.boatSheep = 2;
    state.leftSheep = 1;
    console.log('After loading boat:');
    console.log(`LEFT: ${state.leftSheep}🐑 ${state.leftLions}🦁`);
    console.log(`BOAT: ${state.boatSheep}🐑 ${state.boatLions}🦁`);
    console.log(`RIGHT: ${state.rightSheep}🐑 ${state.rightLions}🦁`);
    console.log(`Boat position: ${state.boatPosition}`);

    console.log('\nDETAILED VALIDATION:');
    console.log(
      `LEFT after move would be: ${state.leftSheep}🐑 ${state.leftLions}🦁`
    );
    console.log(
      `LEFT safe? ${state.leftSheep} > 0 && ${state.leftLions} > ${state.leftSheep} = ${state.leftSheep > 0 && state.leftLions > state.leftSheep}`
    );
    console.log(
      `RIGHT after move would be: ${state.rightSheep + state.boatSheep}🐑 ${state.rightLions + state.boatLions}🦁`
    );
    console.log(
      `RIGHT safe? ${state.rightSheep + state.boatSheep} > 0 && ${state.rightLions + state.boatLions} > ${state.rightSheep + state.boatSheep} = ${state.rightSheep + state.boatSheep > 0 && state.rightLions + state.boatLions > state.rightSheep + state.boatSheep}`
    );

    const move5Valid = wouldMoveBeValid(state);
    console.log(
      `\nValidation result: ${move5Valid.valid ? '✅ VALID' : '❌ INVALID'}`
    );
    if (!move5Valid.valid) {
      console.log(`❌ FAILURE REASON: ${move5Valid.reason}`);
      console.log('\n⚠️  MOVE 5 FAILED - THIS IS THE BUG!\n');
    }

    expect(move5Valid.valid).toBe(true);

    state.rightSheep = 2;
    state.boatSheep = 0;
    state.boatPosition = 'right';
    console.log('After move:');
    console.log(
      `LEFT: ${state.leftSheep}🐑 ${state.leftLions}🦁 - Safe: ${!areSheepEaten(state.leftSheep, state.leftLions)}`
    );
    console.log(
      `RIGHT: ${state.rightSheep}🐑 ${state.rightLions}🦁 - Safe: ${!areSheepEaten(state.rightSheep, state.rightLions)}\n`
    );

    console.log('=== TEST COMPLETE ===');
  });
});
