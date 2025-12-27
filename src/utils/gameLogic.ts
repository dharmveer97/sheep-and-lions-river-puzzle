import { z } from 'zod';
import { GameState, Position } from '@/types/game';

// Zod schema for game state validation
export const GameStateSchema = z.object({
  leftSheep: z.number().min(0).max(3),
  leftLions: z.number().min(0).max(3),
  rightSheep: z.number().min(0).max(3),
  rightLions: z.number().min(0).max(3),
  boatSheep: z.number().min(0).max(2),
  boatLions: z.number().min(0).max(2),
  boatPosition: z.enum(['left', 'right']),
  gameStatus: z.enum(['playing', 'won', 'lost']),
});

// Validate total animals don't exceed 3 of each type
export const validateTotalAnimals = (state: GameState): boolean => {
  const totalSheep = state.leftSheep + state.rightSheep + state.boatSheep;
  const totalLions = state.leftLions + state.rightLions + state.boatLions;
  return totalSheep === 3 && totalLions === 3;
};

/**
 * Check if sheep are eaten on a specific side
 * Sheep are eaten if: Lions > Sheep AND Sheep > 0
 */
export const areSheepEaten = (sheep: number, lions: number): boolean => {
  return sheep > 0 && lions > sheep;
};

/**
 * Check if the current game state results in sheep being eaten
 */
export const checkGameOver = (state: GameState): boolean => {
  // Check left side
  if (areSheepEaten(state.leftSheep, state.leftLions)) {
    return true;
  }

  // Check right side
  if (areSheepEaten(state.rightSheep, state.rightLions)) {
    return true;
  }

  return false;
};

/**
 * Check if all animals have been moved to the RIGHT side (win condition)
 * CHANGED: Now starting from LEFT, winning on RIGHT
 */
export const checkWinCondition = (state: GameState): boolean => {
  return (
    state.rightSheep === 3 &&
    state.rightLions === 3 &&
    state.leftSheep === 0 &&
    state.leftLions === 0 &&
    state.boatSheep === 0 &&
    state.boatLions === 0
  );
};

/**
 * Check if the boat has valid passengers (1-2 animals)
 */
export const isBoatValid = (boatSheep: number, boatLions: number): boolean => {
  const total = boatSheep + boatLions;
  return total >= 1 && total <= 2;
};

/**
 * Simulate moving the boat and check if it would cause game over
 */
export const wouldMoveBeValid = (
  state: GameState
): {
  valid: boolean;
  reason?: string;
} => {
  // Check if boat has valid number of passengers
  if (!isBoatValid(state.boatSheep, state.boatLions)) {
    return {
      valid: false,
      reason: 'Boat must have 1-2 animals',
    };
  }

  // Simulate the move
  const newState = { ...state };

  if (state.boatPosition === 'right') {
    // Moving from right to left
    newState.leftSheep += state.boatSheep;
    newState.leftLions += state.boatLions;
    newState.boatPosition = 'left' as Position;
  } else {
    // Moving from left to right
    newState.rightSheep += state.boatSheep;
    newState.rightLions += state.boatLions;
    newState.boatPosition = 'right' as Position;
  }

  // Clear the boat after moving animals
  newState.boatSheep = 0;
  newState.boatLions = 0;

  // Check if this move would cause sheep to be eaten
  if (checkGameOver(newState)) {
    return {
      valid: false,
      reason: 'This move would cause sheep to be eaten!',
    };
  }

  return { valid: true };
};

/**
 * Get initial game state
 * CHANGED: Start with all animals on LEFT side, boat on LEFT
 */
export const getInitialState = (): GameState => ({
  leftSheep: 3,
  leftLions: 3,
  rightSheep: 0,
  rightLions: 0,
  boatSheep: 0,
  boatLions: 0,
  boatPosition: 'left',
  gameStatus: 'playing',
});
