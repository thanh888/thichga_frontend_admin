// Interface for the BettingRevenue document
export interface BettingRevenueInterface {
  // Total revenue (including fees)
  total_revenue?: number;

  // Total fees collected
  fee?: number;

  // Total amount bet by players
  total_bet_amount?: number;

  // ID of the associated betting room
  betRoomID?: string;

  // ID of the associated betting session
  betSessionID?: string;

  // ID of the associated bet option
  betOptionID?: string;

  // Timestamp when the revenue record was created
  createdAt?: Date;

  // Timestamp when the revenue record was last updated
  updatedAt?: Date;
}
