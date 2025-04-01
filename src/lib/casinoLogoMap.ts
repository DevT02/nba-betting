type CasinoLogoMap = {
  [casinoName: string]: string;
};

export const casinoLogos: CasinoLogoMap = {
  "DraftKings": "/images/casinos/draftkings.svg",
  "FanDuel": "/images/casinos/fanduel.svg",
  "BetMGM": "/images/casinos/betmgm.svg",
  "Caesars": "/images/casinos/caesars.svg",
  "PointsBet": "/images/casinos/pointsbet.svg",
  // Add more casinos as needed
};

export function getCasinoLogo(casinoName: string): string {
  // Default fallback logo if casino isn't in our map
  const defaultLogo = "/images/casinos/generic-casino.svg";
  
  // Try to match regardless of case and spacing differences
  const normalizedName = casinoName.toLowerCase().trim();
  
  const matchedCasino = Object.keys(casinoLogos).find(
    casino => casino.toLowerCase() === normalizedName
  );
  
  return matchedCasino ? casinoLogos[matchedCasino] : defaultLogo;
}