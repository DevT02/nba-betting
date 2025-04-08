export interface GamePreview {
  _id: string;
  home_team: string;
  away_team: string;
  commence_time: string;
}

export interface OddsRow {
  book: string;
  moneyline: string;
  probability: string;
  edge: string;
  kelly: string;
}

export interface GameDetailsProps {
  teamNames: string[];
  oddsData: {
    [teamName: string]: OddsRow[];
  };
  logos?: {
    [teamName: string]: string;
  };
  gameDetails: {
    h2h_record: string;
    over_under: string;
    player_injury: string;
    game_time: string;
    arena: string;
  };
  gameIds?: string[];
  currentGameId?: string;
  gamePreviews?: Record<string, GamePreview>;
}
