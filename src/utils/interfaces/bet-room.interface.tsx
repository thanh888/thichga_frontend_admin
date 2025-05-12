import { TypeBetRoomEnum } from '../enum/type-bet-room.enum';
import { UrlTypeEnum } from '../enum/url-type.enum';

// Interface for the BettingRoom document
export interface BettingRoomInterface {
  roomName?: string;
  thumbnail?: string;
  urlLive?: string;
  urlType?: UrlTypeEnum;
  fee?: number; // in %

  chattingJframe?: string;
  marquee?: string;

  redName?: string;
  blueName?: string;
  centerText?: string;
  leftText?: string;
  rightText?: string;

  redOdds?: number; // in %
  blueOdds?: number; // in %

  typeRoom?: TypeBetRoomEnum;
  isOpened?: boolean;
  isAcceptBetting?: boolean;

  secondsEnding?: number;
  endingAt?: string;

  latestSessionID?: string;

  // Timestamp when the betting room was created
  createdAt?: Date | string;

  // Timestamp when the betting room was last updated
  updatedAt?: Date;
}
