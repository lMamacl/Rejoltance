// A card as data (DSL). Field names mirror prototype/game/cards.js so the JSON stays copy-compatible.
// Fields the engine does not read yet are kept as they are (index signatures).

/** A DSL number: fixed (`Amount: 3`) or counted when the effect resolves (`Amount: { Count: "Blood", Max: 5 }`). */
export type DslNumber = number | { Count: string; Div?: number; Min?: number; Max?: number };

export interface ConditionDefinition {
  Condition: string;
  TargetParam?: string;
  SubConditions?: ConditionDefinition[];
  [field: string]: unknown;
}

export interface ActionDefinition {
  Type: string;
  Target?: string;
  Amount?: DslNumber;
  BuffAtk?: DslNumber;
  BuffHp?: DslNumber;
  StatusKeyword?: string;
  [field: string]: unknown;
}

export interface EffectDefinition {
  Trigger: string;
  /** One zone as a string or several as an array, exactly as the prototype writes it. */
  Zone?: string | string[];
  Targeting?: string;
  ChoiceLabels?: string[];
  Condition?: ConditionDefinition;
  Actions: ActionDefinition[];
  [field: string]: unknown;
}

export interface CardDefinition {
  Id: number;
  Name: string;
  Type: string;
  Cost: number;
  Attack?: number;
  Health?: number;
  Description: string;
  Subtypes?: string[];
  Keywords?: string[];
  KeywordParams?: Record<string, number>;
  Effects?: EffectDefinition[];
  [field: string]: unknown;
}

export interface DeckDefinition {
  name: string;
  cards: number[];
}

export const CardRules = {
  DeckSize: 30,
  MaxCopies: 3,
  /** Tokens (id >= 900) are created by effects and cannot be put in a deck. */
  FirstTokenId: 900,
} as const;

export const isToken = (card: CardDefinition): boolean => card.Id >= CardRules.FirstTokenId;
export const isUnit = (card: CardDefinition): boolean => card.Type === 'Unit';
