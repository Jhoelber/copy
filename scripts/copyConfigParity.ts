import {
  SERVER_COPY_TYPE_CONFIG,
  SERVER_MAX_GENERATED_CHARACTERS_PER_REQUEST,
  SERVER_NARRATION_DURATION_CONFIG,
} from '../api/generate-copy'
import { COPY_TYPE_CONFIG } from '../shared/copyTypeConfig'
import {
  MAX_GENERATED_CHARACTERS_PER_REQUEST,
  NARRATION_DURATION_CONFIG,
} from '../shared/narrationConfig'

type ExactlyEqual<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends <Value>() => Value extends Right ? 1 : 2
    ? (<Value>() => Value extends Right ? 1 : 2) extends <Value>() => Value extends Left ? 1 : 2
      ? true
      : false
    : false

type Assert<Condition extends true> = Condition

export type CopyTypeConfigParity = Assert<
  ExactlyEqual<typeof COPY_TYPE_CONFIG, typeof SERVER_COPY_TYPE_CONFIG>
>

export type NarrationDurationConfigParity = Assert<
  ExactlyEqual<typeof NARRATION_DURATION_CONFIG, typeof SERVER_NARRATION_DURATION_CONFIG>
>

export type GenerationLimitParity = Assert<
  ExactlyEqual<
    typeof MAX_GENERATED_CHARACTERS_PER_REQUEST,
    typeof SERVER_MAX_GENERATED_CHARACTERS_PER_REQUEST
  >
>
