// Lookup values shared across multiple entity types

export const TRADE_DIRECTIONS = ['India → Poland', 'Poland → India'] as const;
export type TradeDirection = (typeof TRADE_DIRECTIONS)[number];

export const LANGUAGES = ['English', 'Polish', 'Hindi', 'Other'] as const;
export type Language = (typeof LANGUAGES)[number];
