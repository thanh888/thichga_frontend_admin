import { TeamEnum } from '../enum/team.enum';

// Interface for the BettingSession document
export interface BettingSessionInterface {
  _id: string;
  // ID of the betting room associated with this session
  betRoomID?: string;

  // Profit from the betting session
  profit?: number;

  // Revenue from the betting session
  revenue?: number;

  // Unique code for the betting session
  code?: string;

  fee?: string;

  // Seconds until the session ends
  secondsEnding?: number;

  // Date/time when the session ends
  endingAt?: string;

  // Whether the session is open
  isOpened?: boolean;

  // Winning team or option (e.g., RED, BLUE)
  winner?: TeamEnum;

  // Timestamp when the betting session was created
  createdAt?: Date;

  // Timestamp when the betting session was last updated
  updatedAt?: Date;
}
