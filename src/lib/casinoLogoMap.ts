type CasinoLogoMap = {
  [casinoName: string]: string;
};

export const casinoLogos: CasinoLogoMap = {
  "betonlineag": "/casinos/betonlineag-logo-small.svg",
  "hardrockbet": "/casinos/hardrockbet-logo-small.svg",
  "fliff": "/casinos/fliff-logo-small.jpeg",
  "betmgm": "/casinos/betmgm-logo-small.svg",
  "betrivers": "/casinos/betrivers-logo-small.svg",
  "espnbet": "/casinos/espnbet-logo-small.svg",
  "draftkings": "/casinos/draftkings-logo-small.svg",
};

export function getCasinoLogo(casinoName: string): string {
  const defaultLogo = "/images/casinos/generic-casino.svg";
  const normalizedName = casinoName.toLowerCase().trim();
  const matchedCasino = Object.keys(casinoLogos).find(
    casino => casino.toLowerCase() === normalizedName
  );
  
  return matchedCasino ? casinoLogos[matchedCasino] : defaultLogo;
}