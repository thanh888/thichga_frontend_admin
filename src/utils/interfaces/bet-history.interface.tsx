import { BetHistoryStatusEnum } from '../enum/bet-history-status.enum';
import { BetResultEnum } from '../enum/bet-result.enum';
import { TeamEnum } from '../enum/team.enum';

// Interface for the BettingHistory document
export interface BettingHistoryInterface {
  _id: string;
  // ID of the betting session associated with this history
  betSessionID?: string;

  // ID of the user who created the bet
  creatorID?: any;

  // Amount of money bet
  money?: number;

  // Revenue from the bet
  revenue?: number;

  // Selected team for the bet (e.g., RED, BLUE)
  selectedTeam?: TeamEnum;

  // Status of the bet (e.g., MATCHED, PENDING)
  status?: BetHistoryStatusEnum;

  // Odds for the red team
  red_odds?: number;

  // Odds for the blue team
  blue_odds?: number;

  // Odds for the red team
  win?: number;

  // Odds for the blue team
  lost?: number;

  // ID of the user matched with this bet
  matchedUserId?: any;

  // Code for the bet
  code?: string;

  // ID of the associated bet option
  betOptionID?: any;

  // Result of the bet (e.g., WIN, LOSS)
  result?: BetResultEnum;

  // Timestamp when the bet history was created
  createdAt?: Date;

  // Timestamp when the bet history was last updated
  updatedAt?: Date;

  userResult?: BetResultEnum;

  systemProfit?: number;

  userProfit?: number;

  systemRevenue?: number;

  userRevenue?: number;
}
