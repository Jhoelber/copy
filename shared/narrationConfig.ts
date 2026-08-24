export interface NarrationDurationConfigEntry {
  minutes: number
  minimumCharacters: number
  maximumCharacters: number
}

export const NARRATION_DURATION_CONFIG = {
  '1': { minutes: 1, minimumCharacters: 750, maximumCharacters: 1300 },
  '2': { minutes: 2, minimumCharacters: 1300, maximumCharacters: 2000 },
  '3': { minutes: 3, minimumCharacters: 2100, maximumCharacters: 3500 },
  '4': { minutes: 4, minimumCharacters: 3600, maximumCharacters: 4500 },
  '5': { minutes: 5, minimumCharacters: 4600, maximumCharacters: 5600 },
  '7': { minutes: 7, minimumCharacters: 6000, maximumCharacters: 7500 },
  '10': { minutes: 10, minimumCharacters: 9000, maximumCharacters: 11000 },
  '15': { minutes: 15, minimumCharacters: 13000, maximumCharacters: 16000 },
  '20': { minutes: 20, minimumCharacters: 18000, maximumCharacters: 22000 },
  '25': { minutes: 25, minimumCharacters: 23000, maximumCharacters: 28000 },
  '30': { minutes: 30, minimumCharacters: 30000, maximumCharacters: 34000 },
  '35': { minutes: 35, minimumCharacters: 35000, maximumCharacters: 39000 },
  '40': { minutes: 40, minimumCharacters: 40000, maximumCharacters: 44000 },
  '45': { minutes: 45, minimumCharacters: 45000, maximumCharacters: 49000 },
  '50': { minutes: 50, minimumCharacters: 50000, maximumCharacters: 54000 },
  '55': { minutes: 55, minimumCharacters: 55000, maximumCharacters: 59000 },
  '60': { minutes: 60, minimumCharacters: 60000, maximumCharacters: 64000 },
} as const satisfies Record<string, NarrationDurationConfigEntry>

export type NarrationDuration = keyof typeof NARRATION_DURATION_CONFIG

export const NARRATION_DURATIONS = Object.keys(NARRATION_DURATION_CONFIG) as [
  NarrationDuration,
  ...NarrationDuration[],
]

export const MAX_GENERATED_CHARACTERS_PER_REQUEST = 220_000
