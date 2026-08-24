import { SERVER_COPY_TYPE_CONFIG } from '../api/generate-copy'
import { COPY_TYPE_CONFIG } from '../shared/copyTypeConfig'

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
