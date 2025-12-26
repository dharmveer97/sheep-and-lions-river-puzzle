import { describe, it, expect } from '@jest/globals';
import {
  areSheepEaten,
  checkGameOver,
  checkWinCondition,
  wouldMoveBeValid,
  validateTotalAnimals,
  isBoatValid,
  getInitialState,
  GameStateSchema,
} from './gameLogic';
import type { GameState } from '@/types/game';

describe('Game Logic Tests', () => {
  describe('areSheepEaten', () => {
    it('should return false when sheep = 0 (no sheep to eat)', () => {
      expect(areSheepEaten(0, 3)).toBe(false);
    });

    it('should return false when lions <= sheep', () => {
      expect(areSheepEaten(3, 3)).toBe(false);
      expect(areSheepEaten(3, 2)).toBe(false);
      expect(areSheepEaten(3, 1)).toBe(false);
      expect(areSheepEaten(2, 1)).toBe(false);
    });

    it('should return true when lions > sheep AND sheep > 0', () => {
      expect(areSheepEaten(1, 2)).toBe(true);
      expect(areSheepEaten(1, 3)).toBe(true);
      expect(areSheepEaten(2, 3)).toBe(true);
    });

    it('should return false when no lions', () => {
      expect(areSheepEaten(3, 0)).toBe(false);
    });
  });

  describe('checkGameOver', () => {
    it('should return false for initial state', () => {
      const state = getInitialState();
      expect(checkGameOver(state)).toBe(false);
    });

    it('should return true when sheep are eaten on left side', () => {
      const state: GameState = {
        leftSheep: 1,
        leftLions: 2,
        rightSheep: 2,
        rightLions: 1,
        boatSheep: 0,
        boatLions: 0,
        boatPosition: 'right',
        gameStatus: 'playing',
      };
      expect(checkGameOver(state)).toBe(true);
    });

    it('should return true when sheep are eaten on right side', () => {
      const state: GameState = {
        leftSheep: 2,
        leftLions: 1,
        rightSheep: 1,
        rightLions: 2,
        boatSheep: 0,
        boatLions: 0,
        boatPosition: 'left',
        gameStatus: 'playing',
      };
      expect(checkGameOver(state)).toBe(true);
    });

    it('should return false when balanced on both sides', () => {
      const state: GameState = {
        leftSheep: 2,
        leftLions: 2,
        rightSheep: 1,
        rightLions: 1,
        boatSheep: 0,
        boatLions: 0,
        boatPosition: 'left',
        gameStatus: 'playing',
      };
      expect(checkGameOver(state)).toBe(false);
    });
  });

  describe('checkWinCondition', () => {
    it('should return false for initial state', () => {
      const state = getInitialState();
      expect(checkWinCondition(state)).toBe(false);
    });

    it('should return true when all animals are on right side', () => {
      const state: GameState = {
        leftSheep: 0,
        leftLions: 0,
        rightSheep: 3,
        rightLions: 3,
        boatSheep: 0,
        boatLions: 0,
        boatPosition: 'right',
        gameStatus: 'playing',
      };
      expect(checkWinCondition(state)).toBe(true);
    });

    it('should return false when some animals still on left', () => {
      const state: GameState = {
        leftSheep: 1,
        leftLions: 0,
        rightSheep: 2,
        rightLions: 3,
        boatSheep: 0,
        boatLions: 0,
        boatPosition: 'right',
        gameStatus: 'playing',
      };
      expect(checkWinCondition(state)).toBe(false);
    });

    it('should return false when animals in boat', () => {
      const state: GameState = {
        leftSheep: 0,
        leftLions: 0,
        rightSheep: 2,
        rightLions: 3,
        boatSheep: 1,
        boatLions: 0,
        boatPosition: 'right',
        gameStatus: 'playing',
      };
      expect(checkWinCondition(state)).toBe(false);
    });
  });

  describe('isBoatValid', () => {
    it('should return false when boat is empty', () => {
      expect(isBoatValid(0, 0)).toBe(false);
    });

    it('should return true when boat has 1 animal', () => {
      expect(isBoatValid(1, 0)).toBe(true);
      expect(isBoatValid(0, 1)).toBe(true);
    });

    it('should return true when boat has 2 animals', () => {
      expect(isBoatValid(2, 0)).toBe(true);
      expect(isBoatValid(0, 2)).toBe(true);
      expect(isBoatValid(1, 1)).toBe(true);
    });

    it('should return false when boat has more than 2 animals', () => {
      expect(isBoatValid(3, 0)).toBe(false);
      expect(isBoatValid(0, 3)).toBe(false);
      expect(isBoatValid(2, 1)).toBe(false);
    });
  });

  describe('validateTotalAnimals', () => {
    it('should return true for correct total (3 sheep, 3 lions)', () => {
      const state = getInitialState();
      expect(validateTotalAnimals(state)).toBe(true);
    });

    it('should return false when sheep total is incorrect', () => {
      const state: GameState = {
        leftSheep: 2,
        leftLions: 3,
        rightSheep: 0,
        rightLions: 0,
        boatSheep: 0,
        boatLions: 0,
        boatPosition: 'left',
        gameStatus: 'playing',
      };
      expect(validateTotalAnimals(state)).toBe(false);
    });

    it('should return false when lion total is incorrect', () => {
      const state: GameState = {
        leftSheep: 3,
        leftLions: 2,
        rightSheep: 0,
        rightLions: 0,
        boatSheep: 0,
        boatLions: 0,
        boatPosition: 'left',
        gameStatus: 'playing',
      };
      expect(validateTotalAnimals(state)).toBe(false);
    });

    it('should return true when animals are distributed across locations', () => {
      const state: GameState = {
        leftSheep: 1,
        leftLions: 1,
        rightSheep: 1,
        rightLions: 1,
        boatSheep: 1,
        boatLions: 1,
        boatPosition: 'left',
        gameStatus: 'playing',
      };
      expect(validateTotalAnimals(state)).toBe(true);
    });
  });

  describe('wouldMoveBeValid', () => {
    it('should return invalid when boat is empty', () => {
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
      const result = wouldMoveBeValid(state);
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Boat must have 1-2 animals');
    });

    it('should return invalid when boat has too many animals', () => {
      const state: GameState = {
        leftSheep: 1,
        leftLions: 1,
        rightSheep: 0,
        rightLions: 0,
        boatSheep: 2,
        boatLions: 1,
        boatPosition: 'left',
        gameStatus: 'playing',
      };
      const result = wouldMoveBeValid(state);
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Boat must have 1-2 animals');
    });

    it('should return invalid when move would cause sheep to be eaten', () => {
      // Moving 1 sheep from left to right, leaving 1 sheep with 3 lions on left (EATEN!)
      const state: GameState = {
        leftSheep: 2,
        leftLions: 3,
        rightSheep: 1,
        rightLions: 0,
        boatSheep: 1,
        boatLions: 0,
        boatPosition: 'left',
        gameStatus: 'playing',
      };
      const result = wouldMoveBeValid(state);
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('This move would cause sheep to be eaten!');
    });

    it('should return valid for safe move (2 lions from left to right)', () => {
      const state: GameState = {
        leftSheep: 3,
        leftLions: 1,
        rightSheep: 0,
        rightLions: 0,
        boatSheep: 0,
        boatLions: 2,
        boatPosition: 'left',
        gameStatus: 'playing',
      };
      const result = wouldMoveBeValid(state);
      expect(result.valid).toBe(true);
    });

    it('should return valid for balanced move', () => {
      const state: GameState = {
        leftSheep: 2,
        leftLions: 2,
        rightSheep: 0,
        rightLions: 0,
        boatSheep: 1,
        boatLions: 1,
        boatPosition: 'left',
        gameStatus: 'playing',
      };
      const result = wouldMoveBeValid(state);
      expect(result.valid).toBe(true);
    });
  });

  describe('GameStateSchema', () => {
    it('should validate correct game state', () => {
      const state = getInitialState();
      expect(() => GameStateSchema.parse(state)).not.toThrow();
    });

    it('should reject negative values', () => {
      const state: GameState = {
        leftSheep: -1,
        leftLions: 3,
        rightSheep: 0,
        rightLions: 0,
        boatSheep: 0,
        boatLions: 0,
        boatPosition: 'left',
        gameStatus: 'playing',
      };
      expect(() => GameStateSchema.parse(state)).toThrow();
    });

    it('should reject values exceeding maximum', () => {
      const state: GameState = {
        leftSheep: 4,
        leftLions: 3,
        rightSheep: 0,
        rightLions: 0,
        boatSheep: 0,
        boatLions: 0,
        boatPosition: 'left',
        gameStatus: 'playing',
      };
      expect(() => GameStateSchema.parse(state)).toThrow();
    });

    it('should reject invalid boat position', () => {
      const state = {
        leftSheep: 3,
        leftLions: 3,
        rightSheep: 0,
        rightLions: 0,
        boatSheep: 0,
        boatLions: 0,
        boatPosition: 'middle',
        gameStatus: 'playing',
      };
      expect(() => GameStateSchema.parse(state)).toThrow();
    });
  });

  describe('Integration: Complete Game Scenario', () => {
    it('should follow a complete winning game path', () => {
      // Step 1: Start
      let state = getInitialState();
      expect(checkGameOver(state)).toBe(false);
      expect(checkWinCondition(state)).toBe(false);

      // Step 2: Move 2 lions to right
      state = {
        leftSheep: 3,
        leftLions: 1,
        rightSheep: 0,
        rightLions: 2,
        boatSheep: 0,
        boatLions: 0,
        boatPosition: 'right',
        gameStatus: 'playing',
      };
      expect(checkGameOver(state)).toBe(false);

      // Step 3: Bring 1 lion back to left
      state = {
        leftSheep: 3,
        leftLions: 2,
        rightSheep: 0,
        rightLions: 1,
        boatSheep: 0,
        boatLions: 0,
        boatPosition: 'left',
        gameStatus: 'playing',
      };
      expect(checkGameOver(state)).toBe(false);

      // Step 4: Move 2 lions to right (leaving 3 sheep, 0 lions on left)
      state = {
        leftSheep: 3,
        leftLions: 0,
        rightSheep: 0,
        rightLions: 3,
        boatSheep: 0,
        boatLions: 0,
        boatPosition: 'right',
        gameStatus: 'playing',
      };
      expect(checkGameOver(state)).toBe(false);

      // Continue with valid moves...
      // Final step: All animals on right
      state = {
        leftSheep: 0,
        leftLions: 0,
        rightSheep: 3,
        rightLions: 3,
        boatSheep: 0,
        boatLions: 0,
        boatPosition: 'right',
        gameStatus: 'won',
      };
      expect(checkWinCondition(state)).toBe(true);
      expect(checkGameOver(state)).toBe(false);
    });

    it('should detect game over in losing scenario', () => {
      // Invalid state: 1 sheep with 2 lions on right
      const state: GameState = {
        leftSheep: 2,
        leftLions: 1,
        rightSheep: 1,
        rightLions: 2,
        boatSheep: 0,
        boatLions: 0,
        boatPosition: 'right',
        gameStatus: 'playing',
      };
      expect(checkGameOver(state)).toBe(true);
      expect(checkWinCondition(state)).toBe(false);
    });
  });
});
