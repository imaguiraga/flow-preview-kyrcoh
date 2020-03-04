import {optional} from "./optional.js"
import {repeat} from "./repeat.js"

export function zeroOrMore(elt) {
  return optional(repeat(elt));
}