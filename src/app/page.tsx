'use client';

import { useState } from 'react';
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
  } = useGameLogic();

  // Mobile: selected animal for tap-to-move
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

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
      return;
    }

    // Check if animal is accessible
    if (currentLocation !== 'boat' && currentLocation !== boatPosition) {
      return;
    }

    setSelectedAnimal(animal);
  };

  // Handle location click (mobile friendly)
  const handleLocationClick = (location: 'left' | 'right' | 'boat') => {
    if (!selectedAnimal || gameStatus !== 'playing') return;

    if (location === 'boat') {
      handleDropInBoat();
      setSelectedAnimal(null);
    } else {
      handleDropToLand(location);
      setSelectedAnimal(null);
    }
  };

  // Render an animal component
  const renderAnimal = (animal: Animal, currentLocation: string) => {
    const inDanger = isAnimalInDanger(animal);
    const isSelected = selectedAnimal?.id === animal.id;

    return (
      <motion.div
        key={animal.id}
        draggable={gameStatus === 'playing'}
        onDragStart={() => handleDragStart(animal)}
        onClick={() => handleAnimalClick(animal, currentLocation)}
        className={cn(
          'cursor-pointer select-none relative touch-manipulation',
          gameStatus !== 'playing' && 'cursor-not-allowed opacity-50',
          isSelected && 'ring-4 ring-yellow-400 rounded-full'
        )}
        whileHover={gameStatus === 'playing' ? { scale: 1.1 } : {}}
        whileTap={gameStatus === 'playing' ? { scale: 0.95 } : {}}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: 1,
          scale: isSelected ? 1.15 : 1,
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
        {/* Selection indicator */}
        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-full bg-yellow-400 -z-10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
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
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100 flex flex-col items-center justify-center p-2 sm:p-4 overflow-x-hidden">
      {/* Title */}
      <motion.h1
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-6 text-center px-2"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        🚣 River Crossing Puzzle 🦁🐑
      </motion.h1>

      {/* Instructions */}
      <motion.p
        className="text-xs sm:text-sm md:text-base text-gray-700 mb-3 sm:mb-4 text-center max-w-3xl px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <strong>Goal:</strong> Move all animals from LEFT to RIGHT side.{' '}
        <strong>Rule:</strong> Lions can&apos;t outnumber sheep on either side!{' '}
        <strong>Boat:</strong> 1-2 animals max.
        <br />
        <span className="text-blue-600 font-semibold text-xs">
          📱 Mobile: Tap animal, then tap destination
        </span>
      </motion.p>

      {/* Warning message with danger preview */}
      <AnimatePresence mode="wait">
        {warning && (
          <motion.div
            className="bg-red-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg mb-3 sm:mb-4 shadow-lg text-sm sm:text-base mx-4 max-w-md text-center border-2 border-red-700"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
          >
            <div className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-xl"
              >
                ⚠️
              </motion.span>
              <span>{warning}</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-xl"
              >
                💀
              </motion.span>
            </div>
            {dangerPreview && (
              <motion.div
                className="mt-2 text-xs sm:text-sm bg-red-700 px-3 py-1 rounded-md"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                {dangerPreview.leftInDanger && (
                  <div>⬅️ LEFT side: Sheep in danger!</div>
                )}
                {dangerPreview.rightInDanger && (
                  <div>➡️ RIGHT side: Sheep in danger!</div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Animal Indicator */}
      {selectedAnimal && (
        <motion.div
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg mb-2 shadow-lg text-sm font-semibold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          Selected: {selectedAnimal.type === 'sheep' ? '🐑 Sheep' : '🦁 Lion'} -
          Tap destination to move
        </motion.div>
      )}

      {/* Game board */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6 px-2">
        {/* Left Side */}
        <motion.div
          className={cn(
            'bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-4 sm:p-6 min-h-[180px] sm:min-h-[280px] md:min-h-[420px] flex flex-col items-center justify-start border-4 shadow-2xl transition-all duration-300 cursor-pointer touch-manipulation',
            areSheepEaten(gameState.leftSheep, gameState.leftLions)
              ? 'border-red-600 animate-pulse'
              : dangerPreview?.leftInDanger
                ? 'border-orange-500 border-dashed'
                : 'border-green-900',
            selectedAnimal && 'ring-4 ring-yellow-400'
          )}
          onClick={() => selectedAnimal && handleLocationClick('left')}
          onDrop={() => handleDropToLand('left')}
          onDragOver={handleDragOver}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-full flex justify-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 bg-green-800 px-4 py-2 rounded-lg shadow-md">
              ⬅️ LEFT SIDE (START)
            </h2>
            {dangerPreview?.leftInDanger && (
              <motion.div
                className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, -5, 5, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                ⚠️ DANGER
              </motion.div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center items-center flex-1 w-full">
            <AnimatePresence>
              {leftAnimals.map(animal => renderAnimal(animal, 'left'))}
            </AnimatePresence>
          </div>
          <div className="mt-3 sm:mt-4 text-white text-xs sm:text-sm bg-green-800 px-4 py-2 rounded-lg shadow-md">
            <div>🐑 Sheep: {gameState.leftSheep}</div>
            <div>🦁 Lions: {gameState.leftLions}</div>
          </div>
        </motion.div>

        {/* River & Boat */}
        <motion.div
          className="bg-gradient-to-b from-blue-300 via-blue-400 to-blue-500 rounded-xl p-4 sm:p-6 min-h-[180px] sm:min-h-[280px] md:min-h-[420px] flex flex-col items-center justify-between relative overflow-hidden shadow-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* River waves animation */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-full h-6 sm:h-8 bg-blue-600 rounded-full blur-sm"
                style={{ top: `${i * 18}%` }}
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

          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white z-10 bg-blue-600 px-4 py-2 rounded-lg shadow-md">
            🌊 RIVER
          </h2>

          {/* Boat */}
          <motion.div
            className={cn(
              'bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl p-3 sm:p-4 md:p-6 border-4 border-amber-900 min-h-[120px] sm:min-h-[160px] md:min-h-[220px] w-full max-w-sm flex flex-col items-center justify-center z-10 relative shadow-2xl cursor-pointer touch-manipulation',
              boatAnimals.length === 0 && 'border-dashed border-amber-600',
              dangerPreview && 'border-red-500 border-dashed',
              selectedAnimal && 'ring-4 ring-yellow-400'
            )}
            onClick={() => selectedAnimal && handleLocationClick('boat')}
            onDrop={handleDropInBoat}
            onDragOver={handleDragOver}
            animate={{
              y: [0, -8, 0],
              rotate: [0, 2, 0, -2, 0],
              ...(dangerPreview && showDangerAnimation
                ? { scale: [1, 0.95, 1], x: [-5, 5, -5, 5, 0] }
                : {}),
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <BoatIcon className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" />
            <div className="text-white font-bold mb-2 z-10 text-sm sm:text-base bg-amber-900 px-3 py-1 rounded-md">
              🚤 BOAT
            </div>
            <div className="flex flex-wrap gap-2 justify-center z-10 min-h-[60px] sm:min-h-[80px] items-center">
              <AnimatePresence>
                {boatAnimals.map(animal => renderAnimal(animal, 'boat'))}
              </AnimatePresence>
            </div>
            <div className="mt-2 text-white text-xs sm:text-sm z-10 bg-amber-900 px-3 py-1 rounded-md">
              {boatAnimals.length}/2 animals
            </div>
            {dangerPreview && boatAnimals.length > 0 && (
              <motion.div
                className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-20"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                ⚠️ CHECK!
              </motion.div>
            )}
          </motion.div>

          {/* Boat position indicator */}
          <motion.div
            className="text-white font-bold bg-blue-600 px-3 sm:px-4 py-1 sm:py-2 rounded-full z-10 shadow-lg text-xs sm:text-sm"
            key={boatPosition}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            🚤 Boat at: {boatPosition.toUpperCase()}
          </motion.div>
        </motion.div>

        {/* Right Side */}
        <motion.div
          className={cn(
            'bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-4 sm:p-6 min-h-[180px] sm:min-h-[280px] md:min-h-[420px] flex flex-col items-center justify-start border-4 shadow-2xl transition-all duration-300 cursor-pointer touch-manipulation',
            areSheepEaten(gameState.rightSheep, gameState.rightLions)
              ? 'border-red-600 animate-pulse'
              : dangerPreview?.rightInDanger
                ? 'border-orange-500 border-dashed'
                : 'border-green-900',
            selectedAnimal && 'ring-4 ring-yellow-400'
          )}
          onClick={() => selectedAnimal && handleLocationClick('right')}
          onDrop={() => handleDropToLand('right')}
          onDragOver={handleDragOver}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-full flex justify-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 bg-green-800 px-4 py-2 rounded-lg shadow-md">
              RIGHT SIDE ➡️ (GOAL)
            </h2>
            {dangerPreview?.rightInDanger && (
              <motion.div
                className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, -5, 5, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                ⚠️ DANGER
              </motion.div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center items-center flex-1 w-full">
            <AnimatePresence>
              {rightAnimals.map(animal => renderAnimal(animal, 'right'))}
            </AnimatePresence>
          </div>
          <div className="mt-3 sm:mt-4 text-white text-xs sm:text-sm bg-green-800 px-4 py-2 rounded-lg shadow-md">
            <div>🐑 Sheep: {gameState.rightSheep}</div>
            <div>🦁 Lions: {gameState.rightLions}</div>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-xl px-4"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.button
          onClick={handleMoveBoat}
          disabled={gameStatus !== 'playing' || isPending}
          className={cn(
            'flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-xl transition-all text-sm sm:text-base relative touch-manipulation',
            (gameStatus !== 'playing' || isPending) &&
              'cursor-not-allowed opacity-50',
            dangerPreview && 'ring-4 ring-red-500 ring-opacity-50'
          )}
          whileHover={
            gameStatus === 'playing' && !isPending ? { scale: 1.05 } : {}
          }
          whileTap={
            gameStatus === 'playing' && !isPending ? { scale: 0.95 } : {}
          }
        >
          {isPending ? '🚤 Moving...' : '🚤 Move Boat →'}
          {dangerPreview && boatAnimals.length > 0 && !isPending && (
            <motion.span
              className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full"
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
            'flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-xl transition-all text-sm sm:text-base touch-manipulation',
            isPending && 'cursor-not-allowed opacity-50'
          )}
          whileHover={!isPending ? { scale: 1.05 } : {}}
          whileTap={!isPending ? { scale: 0.95 } : {}}
        >
          🔄 Reset Game
        </motion.button>
      </motion.div>

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
