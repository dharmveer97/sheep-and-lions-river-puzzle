'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SheepIcon from '@/components/SheepIcon';
import LionIcon from '@/components/LionIcon';
import BoatIcon from '@/components/BoatIcon';
import { areSheepEaten } from '@/utils/gameLogic';
import { cn } from '@/lib/utils';
import { useGameLogic, type Animal } from '@/hooks/useGameLogic';

export default function RiverCrossingGame() {
  const {
    gameState,
    boatPosition,
    gameStatus,
    warning,
    dangerPreview,
    showDangerAnimation,
    isPending,
    getAnimalsAt,
    isAnimalInDanger,
    handleDragStart,
    handleDropInBoat,
    handleDropToLand,
    handleMoveBoat,
    handleReset,
    setDraggedAnimal,
  } = useGameLogic();

  // Mobile: selected animal for tap-to-move
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [selectedAnimalLocation, setSelectedAnimalLocation] = useState<
    string | null
  >(null);

  // Prevent default drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle animal click/tap (mobile friendly)
  const handleAnimalClick = (animal: Animal, currentLocation: string) => {
    if (gameStatus !== 'playing') return;

    // If already selected, deselect
    if (selectedAnimal?.id === animal.id) {
      setSelectedAnimal(null);
      setSelectedAnimalLocation(null);
      setDraggedAnimal(null); // Clear draggedAnimal too
      return;
    }

    // Check if animal is accessible
    if (currentLocation !== 'boat' && currentLocation !== boatPosition) {
      return;
    }

    setSelectedAnimal(animal);
    setSelectedAnimalLocation(currentLocation);
    setDraggedAnimal(animal); // Sync with hook's draggedAnimal
  };

  // Handle location click (mobile friendly)
  const handleLocationClick = (
    location: 'left' | 'right' | 'boat',
    e: React.MouseEvent
  ) => {
    // Stop propagation to prevent conflicts
    e.stopPropagation();

    if (!selectedAnimal || gameStatus !== 'playing') return;

    let success = false;
    if (location === 'boat') {
      success = handleDropInBoat();
    } else {
      success = handleDropToLand(location);
    }

    // Only clear selection if drop succeeded
    if (success) {
      setSelectedAnimal(null);
      setSelectedAnimalLocation(null);
    }
  };

  // Calculate what color outline to show based on selection
  const getLocationOutlineColor = useMemo(() => {
    if (!selectedAnimal || !selectedAnimalLocation) {
      return { left: '', right: '', boat: '' };
    }

    const colors = { left: '', right: '', boat: '' };

    // Animal selected from boat → can go to left or right (where boat is)
    if (selectedAnimalLocation === 'boat') {
      if (boatPosition === 'left') {
        colors.left = 'ring-4 ring-green-500'; // Can drop to left
      } else {
        colors.right = 'ring-4 ring-green-500'; // Can drop to right
      }
    }
    // Animal selected from left or right → can go to boat
    else {
      colors.boat = 'ring-4 ring-green-500'; // Can drop to boat
    }

    return colors;
  }, [selectedAnimal, selectedAnimalLocation, boatPosition]);

  // Render an animal component
  const renderAnimal = (animal: Animal, currentLocation: string) => {
    const inDanger = isAnimalInDanger(animal);
    const isSelected = selectedAnimal?.id === animal.id;

    return (
      <motion.div
        key={animal.id}
        draggable={gameStatus === 'playing'}
        onDragStart={() => handleDragStart(animal)}
        onClick={e => {
          e.stopPropagation();
          handleAnimalClick(animal, currentLocation);
        }}
        className={cn(
          'cursor-pointer select-none relative touch-manipulation',
          gameStatus !== 'playing' && 'cursor-not-allowed opacity-50',
          isSelected && 'ring-4 ring-blue-500 rounded-full'
        )}
        whileHover={gameStatus === 'playing' ? { scale: 1.1 } : {}}
        whileTap={gameStatus === 'playing' ? { scale: 0.95 } : {}}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: 1,
          scale: isSelected ? 1.2 : 1,
          ...(inDanger && showDangerAnimation
            ? {
                rotate: [0, -5, 5, -5, 5, 0],
                y: [0, -5, 0],
              }
            : {}),
        }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{
          duration: inDanger && showDangerAnimation ? 0.5 : 0.2,
          repeat: inDanger && showDangerAnimation ? 2 : 0,
        }}
      >
        {/* Selection indicator - BLUE pulse for selected */}
        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-full bg-blue-500 -z-10"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Danger indicator */}
        <AnimatePresence>
          {inDanger && (
            <motion.div
              className="absolute -top-2 -right-2 z-20 bg-red-600 rounded-full p-1 shadow-lg"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring' }}
            >
              <span className="text-white text-xs font-bold">💀</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Red glow effect when in danger */}
        {inDanger && (
          <motion.div
            className="absolute inset-0 rounded-full bg-red-500 -z-10"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Animal icon */}
        <div className={cn(inDanger && 'animate-pulse')}>
          {animal.type === 'sheep' ? (
            <SheepIcon className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 drop-shadow-lg" />
          ) : (
            <LionIcon className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 drop-shadow-lg" />
          )}
        </div>
      </motion.div>
    );
  };

  const boatAnimals = getAnimalsAt('boat');
  const leftAnimals = getAnimalsAt('left');
  const rightAnimals = getAnimalsAt('right');

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100 flex flex-col overflow-hidden">
      {/* Top HUD */}
      <div className="flex-shrink-0 bg-gradient-to-r from-blue-900/90 to-blue-800/90 backdrop-blur-sm px-3 py-2 shadow-lg z-20">
        <motion.h1
          className="text-lg sm:text-2xl font-bold text-white text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          🚣 River Crossing Puzzle
        </motion.h1>
      </div>

      {/* Status HUD */}
      <div className="flex-shrink-0 px-3 py-2 bg-black/20 backdrop-blur-sm z-20">
        <div className="flex items-center justify-between gap-2">
          <AnimatePresence mode="wait">
            {warning ? (
              <motion.div
                key="warning"
                className="flex-1 bg-red-500 text-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-semibold flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <span>⚠️</span>
                <span className="flex-1">{warning}</span>
              </motion.div>
            ) : selectedAnimal ? (
              <motion.div
                key="selected"
                className="flex-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-semibold"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                {selectedAnimal.type === 'sheep' ? '🐑' : '🦁'} Selected - Tap
                GREEN area
              </motion.div>
            ) : (
              <motion.div
                key="hint"
                className="flex-1 bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                👆 Tap animals, move to boat, cross river →
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Game World - Responsive Layout */}
      <div className="flex-1 relative overflow-x-auto overflow-y-hidden lg:overflow-hidden">
        <motion.div
          className="h-full flex items-center justify-center px-4 gap-4 lg:gap-6 min-w-max lg:min-w-0 lg:max-w-7xl lg:mx-auto"
          drag="x"
          dragConstraints={{ left: -600, right: 0 }}
          dragElastic={0.1}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
        >
          {/* Left Side */}
          <motion.div
            className={cn(
              'w-72 lg:w-96 lg:flex-1 h-full bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-4 lg:p-6 flex flex-col items-center justify-between border-4 shadow-2xl transition-all duration-300 cursor-pointer touch-manipulation',
              areSheepEaten(gameState.leftSheep, gameState.leftLions)
                ? 'border-red-600 animate-pulse'
                : dangerPreview?.leftInDanger
                  ? 'border-orange-500 border-dashed'
                  : 'border-green-900',
              getLocationOutlineColor.left
            )}
            onClick={e => selectedAnimal && handleLocationClick('left', e)}
            onDrop={() => handleDropToLand('left')}
            onDragOver={handleDragOver}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-full flex justify-center">
              <h2 className="text-xl font-bold text-white bg-green-800 px-4 py-2 rounded-lg shadow-md">
                ⬅️ START
              </h2>
              {dangerPreview?.leftInDanger && (
                <motion.div
                  className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, -5, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  ⚠️
                </motion.div>
              )}
            </div>
            <div className="flex flex-wrap gap-3 justify-center items-center flex-1 w-full p-4">
              <AnimatePresence>
                {leftAnimals.map(animal => renderAnimal(animal, 'left'))}
              </AnimatePresence>
            </div>
            <div className="text-white text-sm bg-green-800 px-4 py-2 rounded-lg shadow-md">
              <div>🐑 {gameState.leftSheep}</div>
              <div>🦁 {gameState.leftLions}</div>
            </div>
          </motion.div>

          {/* River & Boat */}
          <motion.div
            className="w-64 lg:w-80 lg:flex-1 h-full bg-gradient-to-b from-blue-300 via-blue-400 to-blue-500 rounded-xl p-4 lg:p-6 flex flex-col items-center justify-between relative overflow-hidden shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* River waves animation */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-full h-8 bg-blue-600 rounded-full blur-sm"
                  style={{ top: `${i * 13}%` }}
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              ))}
            </div>

            <h2 className="text-xl font-bold text-white z-10 bg-blue-600 px-4 py-2 rounded-lg shadow-md">
              🌊 RIVER
            </h2>

            {/* Boat */}
            <motion.div
              className={cn(
                'bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl p-6 border-4 border-amber-900 w-full flex flex-col items-center justify-center z-10 relative shadow-2xl cursor-pointer touch-manipulation min-h-[250px]',
                boatAnimals.length === 0 && 'border-dashed border-amber-600',
                dangerPreview && 'border-red-500 border-dashed',
                getLocationOutlineColor.boat
              )}
              onClick={e => selectedAnimal && handleLocationClick('boat', e)}
              onDrop={handleDropInBoat}
              onDragOver={handleDragOver}
              animate={{
                y: [0, -8, 0],
                rotate: [0, 2, 0, -2, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <BoatIcon className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" />
              <div className="text-white font-bold mb-3 z-10 text-lg bg-amber-900 px-4 py-2 rounded-md">
                🚤 BOAT
              </div>
              <div className="flex flex-wrap gap-3 justify-center z-10 min-h-[90px] items-center w-full">
                <AnimatePresence>
                  {boatAnimals.map(animal => renderAnimal(animal, 'boat'))}
                </AnimatePresence>
                {boatAnimals.length === 0 && (
                  <div className="text-amber-200 text-sm opacity-70">Empty</div>
                )}
              </div>
              <div className="mt-3 text-white text-sm z-10 bg-amber-900 px-4 py-2 rounded-md font-semibold">
                {boatAnimals.length}/2
              </div>
              {dangerPreview && boatAnimals.length > 0 && (
                <motion.div
                  className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-20"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  ⚠️
                </motion.div>
              )}
            </motion.div>

            {/* Boat position */}
            <motion.div
              className="text-white font-bold bg-blue-600 px-4 py-2 rounded-full z-10 shadow-lg text-sm"
              key={boatPosition}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              At: {boatPosition.toUpperCase()}
            </motion.div>
          </motion.div>

          {/* Right Side */}
          <motion.div
            className={cn(
              'w-72 lg:w-96 lg:flex-1 h-full bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-4 lg:p-6 flex flex-col items-center justify-between border-4 shadow-2xl transition-all duration-300 cursor-pointer touch-manipulation',
              areSheepEaten(gameState.rightSheep, gameState.rightLions)
                ? 'border-red-600 animate-pulse'
                : dangerPreview?.rightInDanger
                  ? 'border-orange-500 border-dashed'
                  : 'border-green-900',
              getLocationOutlineColor.right
            )}
            onClick={e => selectedAnimal && handleLocationClick('right', e)}
            onDrop={() => handleDropToLand('right')}
            onDragOver={handleDragOver}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative w-full flex justify-center">
              <h2 className="text-xl font-bold text-white bg-green-800 px-4 py-2 rounded-lg shadow-md">
                GOAL ➡️
              </h2>
              {dangerPreview?.rightInDanger && (
                <motion.div
                  className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, -5, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  ⚠️
                </motion.div>
              )}
            </div>
            <div className="flex flex-wrap gap-3 justify-center items-center flex-1 w-full p-4">
              <AnimatePresence>
                {rightAnimals.map(animal => renderAnimal(animal, 'right'))}
              </AnimatePresence>
            </div>
            <div className="text-white text-sm bg-green-800 px-4 py-2 rounded-lg shadow-md">
              <div>🐑 {gameState.rightSheep}</div>
              <div>🦁 {gameState.rightLions}</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Controls HUD */}
      <div className="flex-shrink-0 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm px-3 py-3 shadow-lg z-20">
        <motion.div
          className="flex gap-3 justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <motion.button
            onClick={handleMoveBoat}
            disabled={gameStatus !== 'playing' || isPending}
            className={cn(
              'flex-1 max-w-xs bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-xl shadow-xl transition-all text-sm relative touch-manipulation',
              (gameStatus !== 'playing' || isPending) &&
                'cursor-not-allowed opacity-50',
              dangerPreview && 'ring-2 ring-red-500'
            )}
            whileHover={
              gameStatus === 'playing' && !isPending ? { scale: 1.05 } : {}
            }
            whileTap={
              gameStatus === 'playing' && !isPending ? { scale: 0.95 } : {}
            }
          >
            {isPending ? (
              '🚤 Moving...'
            ) : (
              <>🚤 Move Boat {boatPosition === 'left' ? '→ RIGHT' : '← LEFT'}</>
            )}
            {dangerPreview && boatAnimals.length > 0 && !isPending && (
              <motion.span
                className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                ⚠️
              </motion.span>
            )}
          </motion.button>
          <motion.button
            onClick={handleReset}
            disabled={isPending}
            className={cn(
              'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-xl shadow-xl transition-all text-sm touch-manipulation',
              isPending && 'cursor-not-allowed opacity-50'
            )}
            whileHover={!isPending ? { scale: 1.05 } : {}}
            whileTap={!isPending ? { scale: 0.95 } : {}}
          >
            🔄 Reset
          </motion.button>
        </motion.div>
      </div>

      {/* Win/Loss Modals */}
      <AnimatePresence>
        {gameStatus === 'won' && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-6 sm:p-10 text-center shadow-2xl max-w-md w-full border-4 border-green-600"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', duration: 0.8 }}
            >
              <motion.div
                className="text-6xl sm:text-7xl md:text-8xl mb-4"
                animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              >
                🎉
              </motion.div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-700 mb-4">
                🏆 You Won! 🏆
              </h2>
              <p className="text-gray-700 mb-6 text-sm sm:text-base md:text-lg">
                Congratulations! All animals crossed safely to the right side!
                <br />
                <span className="text-green-600 font-semibold">
                  Perfect strategy! 🎯
                </span>
              </p>
              <motion.button
                onClick={handleReset}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-8 rounded-xl shadow-lg text-sm sm:text-base touch-manipulation"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                🎮 Play Again
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {gameStatus === 'lost' && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-6 sm:p-10 text-center shadow-2xl max-w-md w-full border-4 border-red-600"
              initial={{ scale: 0, y: -100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 100 }}
              transition={{ type: 'spring', duration: 0.8 }}
            >
              <motion.div
                className="text-6xl sm:text-7xl md:text-8xl mb-4"
                animate={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.4, repeat: Infinity }}
              >
                😱
              </motion.div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-red-700 mb-4">
                💀 Game Over! 💀
              </h2>
              <p className="text-gray-700 mb-6 text-sm sm:text-base md:text-lg">
                Oh no! The sheep were eaten by the lions!
                <br />
                <span className="text-red-600 font-semibold">
                  Try a different strategy! 🤔
                </span>
              </p>
              <motion.button
                onClick={handleReset}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-8 rounded-xl shadow-lg text-sm sm:text-base touch-manipulation"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                🔄 Try Again
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
