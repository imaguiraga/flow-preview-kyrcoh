import {optional} from "./flow-optional.js"
import {repeat} from "./flow-repeat.js"

export function zeroOrMore(elt) {
  return optional(repeat(elt));
}