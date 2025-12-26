export type AnimalType = 'sheep' | 'lion';
export type Position = 'left' | 'right';
export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameState {
  leftSheep: number;
  leftLions: number;
  rightSheep: number;
  rightLions: number;
  boatSheep: number;
  boatLions: number;
  boatPosition: Position;
  gameStatus: GameStatus;
}

export interface DragItem {
  type: AnimalType;
  from: 'left' | 'right' | 'boat';
}
