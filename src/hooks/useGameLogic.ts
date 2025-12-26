import { useState, useMemo, useTransition, useCallback } from 'react';
import { GameState, AnimalType } from '@/types/game';
import {
  checkGameOver,
  checkWinCondition,
  wouldMoveBeValid,
  areSheepEaten,
  validateTotalAnimals,
  GameStateSchema,
} from '@/utils/gameLogic';

// Animal interface with unique ID
export interface Animal {
  id: string;
  type: AnimalType;
}

// Location type
export type Location = 'left' | 'right' | 'boat';

// Danger preview type
export interface DangerPreview {
  leftInDanger: boolean;
  rightInDanger: boolean;
  reason?: string;
}

const initialAnimals: Animal[] = [
  { id: 'sheep-1', type: 'sheep' },
  { id: 'sheep-2', type: 'sheep' },
  { id: 'sheep-3', type: 'sheep' },
  { id: 'lion-1', type: 'lion' },
  { id: 'lion-2', type: 'lion' },
  { id: 'lion-3', type: 'lion' },
];

export function useGameLogic() {
  // State
  const [animalLocations, setAnimalLocations] = useState<
    Record<string, Location>
  >(() => {
    const locations: Record<string, Location> = {};
    initialAnimals.forEach(animal => {
      locations[animal.id] = 'left';
    });
    return locations;
  });

  const [boatPosition, setBoatPosition] = useState<'left' | 'right'>('left');
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>(
    'playing'
  );
  const [warning, setWarning] = useState<string>('');
  const [draggedAnimal, setDraggedAnimal] = useState<Animal | null>(null);
  const [showDangerAnimation, setShowDangerAnimation] = useState(false);

  // Use transition for smooth state updates
  const [isPending, startTransition] = useTransition();

  // Get animals at a specific location
  const getAnimalsAt = useCallback(
    (location: Location): Animal[] => {
      return initialAnimals.filter(
        animal => animalLocations[animal.id] === location
      );
    },
    [animalLocations]
  );

  // Calculate current game state from animal locations  - memoized
  const gameState = useMemo((): GameState => {
    const state: GameState = {
      leftSheep: 0,
      leftLions: 0,
      rightSheep: 0,
      rightLions: 0,
      boatSheep: 0,
      boatLions: 0,
      boatPosition,
      gameStatus,
    };

    initialAnimals.forEach(animal => {
      const location = animalLocations[animal.id];
      if (location === 'left') {
        if (animal.type === 'sheep') state.leftSheep++;
        else state.leftLions++;
      } else if (location === 'right') {
        if (animal.type === 'sheep') state.rightSheep++;
        else state.rightLions++;
      } else if (location === 'boat') {
        if (animal.type === 'sheep') state.boatSheep++;
        else state.boatLions++;
      }
    });

    return state;
  }, [animalLocations, boatPosition, gameStatus]);

  // Calculate danger preview - memoized
  const dangerPreview = useMemo((): DangerPreview | null => {
    const boatAnimals = getAnimalsAt('boat');

    if (boatAnimals.length === 0) return null;

    // Simulate the move
    const newState = { ...gameState };
    const destination = boatPosition === 'left' ? 'right' : 'left';

    if (destination === 'left') {
      newState.leftSheep += gameState.boatSheep;
      newState.leftLions += gameState.boatLions;
    } else {
      newState.rightSheep += gameState.boatSheep;
      newState.rightLions += gameState.boatLions;
    }

    newState.boatSheep = 0;
    newState.boatLions = 0;

    const leftDanger = areSheepEaten(newState.leftSheep, newState.leftLions);
    const rightDanger = areSheepEaten(newState.rightSheep, newState.rightLions);

    if (leftDanger || rightDanger) {
      return {
        leftInDanger: leftDanger,
        rightInDanger: rightDanger,
        reason: 'Sheep would be eaten on this side!',
      };
    }

    return null;
  }, [gameState, boatPosition, getAnimalsAt]);

  // Check if an animal would be in danger - memoized
  const isAnimalInDanger = useCallback(
    (animal: Animal): boolean => {
      if (!dangerPreview) return false;

      const location = animalLocations[animal.id];

      if (animal.type === 'sheep') {
        if (location === 'left' && dangerPreview.leftInDanger) return true;
        if (location === 'right' && dangerPreview.rightInDanger) return true;

        if (location === 'boat') {
          const destination = boatPosition === 'left' ? 'right' : 'left';
          if (destination === 'left' && dangerPreview.leftInDanger) return true;
          if (destination === 'right' && dangerPreview.rightInDanger)
            return true;
        }
      }

      return false;
    },
    [dangerPreview, animalLocations, boatPosition]
  );

  // Check win/loss after every move - memoized
  useMemo(() => {
    if (gameStatus !== 'playing') return;

    if (checkWinCondition(gameState)) {
      console.log('🎉 WIN DETECTED!', gameState);
      startTransition(() => {
        setGameStatus('won');
      });
    } else if (checkGameOver(gameState)) {
      console.log('💀 LOSS DETECTED!', gameState);
      startTransition(() => {
        setGameStatus('lost');
      });
    }
  }, [gameState, gameStatus]);

  // Handle drag start
  const handleDragStart = useCallback(
    (animal: Animal) => {
      const animalLocation = animalLocations[animal.id];

      if (animalLocation !== 'boat' && animalLocation !== boatPosition) {
        setWarning(`Boat is on the ${boatPosition} side!`);
        return;
      }

      setDraggedAnimal(animal);
      setWarning('');
    },
    [animalLocations, boatPosition]
  );

  // Handle drop into boat
  const handleDropInBoat = useCallback(() => {
    if (!draggedAnimal) return;

    const boatAnimals = getAnimalsAt('boat');

    if (boatAnimals.length >= 2) {
      setWarning('Boat is full! Maximum 2 animals.');
      setDraggedAnimal(null);
      return;
    }

    startTransition(() => {
      setAnimalLocations(prev => ({
        ...prev,
        [draggedAnimal.id]: 'boat',
      }));
    });

    setDraggedAnimal(null);
  }, [draggedAnimal, getAnimalsAt]);

  // Handle drop to land
  const handleDropToLand = useCallback(
    (side: 'left' | 'right') => {
      if (!draggedAnimal) return;

      const animalLocation = animalLocations[draggedAnimal.id];

      if (animalLocation === 'boat' && side !== boatPosition) {
        setWarning(`Boat is on the ${boatPosition} side!`);
        setDraggedAnimal(null);
        return;
      }

      startTransition(() => {
        setAnimalLocations(prev => ({
          ...prev,
          [draggedAnimal.id]: side,
        }));
      });

      setDraggedAnimal(null);
    },
    [draggedAnimal, animalLocations, boatPosition]
  );

  // Handle boat movement
  const handleMoveBoat = useCallback(() => {
    // Validate state with Zod
    try {
      GameStateSchema.parse(gameState);
    } catch {
      setWarning('Invalid game state!');
      return;
    }

    if (!validateTotalAnimals(gameState)) {
      setWarning('Invalid number of animals!');
      return;
    }

    const validationResult = wouldMoveBeValid(gameState);

    if (!validationResult.valid) {
      setWarning(validationResult.reason || 'Invalid move!');
      setShowDangerAnimation(true);
      setTimeout(() => setShowDangerAnimation(false), 2000);
      return;
    }

    const newPosition = boatPosition === 'left' ? 'right' : 'left';
    const boatAnimals = getAnimalsAt('boat');

    startTransition(() => {
      setAnimalLocations(prev => {
        const newLocations = { ...prev };
        boatAnimals.forEach(animal => {
          newLocations[animal.id] = newPosition;
        });
        return newLocations;
      });

      setBoatPosition(newPosition);
      setWarning('');
    });
  }, [gameState, boatPosition, getAnimalsAt]);

  // Reset game
  const handleReset = useCallback(() => {
    startTransition(() => {
      setAnimalLocations(() => {
        const locations: Record<string, Location> = {};
        initialAnimals.forEach(animal => {
          locations[animal.id] = 'left';
        });
        return locations;
      });
      setBoatPosition('left');
      setGameStatus('playing');
      setWarning('');
      setDraggedAnimal(null);
      setShowDangerAnimation(false);
    });
  }, []);

  return {
    // State
    gameState,
    boatPosition,
    gameStatus,
    warning,
    draggedAnimal,
    dangerPreview,
    showDangerAnimation,
    isPending,
    initialAnimals,
    animalLocations,

    // Computed
    getAnimalsAt,
    isAnimalInDanger,

    // Actions
    handleDragStart,
    handleDropInBoat,
    handleDropToLand,
    handleMoveBoat,
    handleReset,
    setDraggedAnimal,
  };
}
