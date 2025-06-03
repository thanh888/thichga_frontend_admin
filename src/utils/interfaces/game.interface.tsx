import { StatusGame } from '../enum/status-game.enum';

// Interface for the BankInteface document
export interface GameInterface {
  _id: string;
  name: string;
  image: string;
  status: StatusGame | string;
  description: string;
}
