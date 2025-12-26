# River Crossing Game

An interactive, animated puzzle game built with Next.js, React, TypeScript, Tailwind CSS, and Framer Motion.

## Game Description

A classic river crossing puzzle where you must safely transport 3 sheep and 3 lions across a river using a boat.

## Rules

1. **Starting Position**: All animals start on the LEFT side
2. **Goal**: Move all 6 animals to the RIGHT side
3. **Boat Capacity**: The boat can carry 1-2 animals at a time
4. **Critical Rule**: Lions must NEVER outnumber sheep on either side of the river (unless there are no sheep on that side)
5. **Win Condition**: Successfully move all 6 animals to the RIGHT side
6. **Lose Condition**: If lions outnumber sheep on either side, the sheep get eaten - Game Over!

## How to Play

1. **Drag & Drop**: Drag animals from land into the boat
2. **Load Boat**: Add 1-2 animals to the boat (from the side where the boat is located)
3. **Move Boat**: Click "Move Boat" button to cross the river
4. **Unload**: Boat automatically unloads animals when it reaches the other side
5. **Plan Ahead**: Think carefully about each move to avoid the sheep being eaten!

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Custom SVG components

## Features

- Real-time drag & drop gameplay
- Smooth animations with Framer Motion
- Mobile responsive design
- Visual feedback for invalid moves
- Win/Loss modal animations
- Animated river waves
- Floating boat animation
- Custom SVG animal icons

## Project Structure

```
src/
├── app/
│   └── page.tsx          # Main game component
├── components/
│   ├── SheepIcon.tsx     # Sheep SVG component
│   ├── LionIcon.tsx      # Lion SVG component
│   └── BoatIcon.tsx      # Boat SVG component
├── types/
│   └── game.ts           # TypeScript type definitions
└── utils/
    └── gameLogic.ts      # Game logic and validation
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# Navigate to http://localhost:3000
```

## Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

## Game Strategy Tips

1. Start by moving 2 lions to the left
2. Bring 1 lion back to the right
3. Move 2 sheep to the left
4. Continue alternating to maintain balance
5. Never leave more lions than sheep on either side!

## Browser Support

- Modern browsers with HTML5 Drag & Drop support
- Mobile browsers (touch events supported)

## License

MIT

---

Built with ❤️ using Next.js and Framer Motion
