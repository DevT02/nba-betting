type CasinoLogoMap = {
  [casinoName: string]: string;
};

export const casinoLogos: CasinoLogoMap = {
  "DraftKings": "/images/casinos/draftkings.svg",
  "FanDuel": "/images/casinos/fanduel.svg",
  "BetMGM": "/images/casinos/betmgm.svg",
  "Caesars": "/images/casinos/caesars.svg",
  "PointsBet": "/images/casinos/pointsbet.svg",
};

export function getCasinoLogo(casinoName: string): string {
  const defaultLogo = "/images/casinos/generic-casino.svg";
  const normalizedName = casinoName.toLowerCase().trim();
  const matchedCasino = Object.keys(casinoLogos).find(
    casino => casino.toLowerCase() === normalizedName
  );
  
  return matchedCasino ? casinoLogos[matchedCasino] : defaultLogo;
}