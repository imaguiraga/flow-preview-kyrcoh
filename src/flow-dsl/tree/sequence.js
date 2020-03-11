import {NonTerminalElt} from "./terminal.js"

/**
 * Class SequenceElt.
 * @extends NonTerminalElt
 */
export class SequenceElt extends NonTerminalElt {
  /**
   * Create a SequenceElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   * @param {string} kind - The kind value.
   */
  constructor(elts,ctx,kind) {
    super(elts,ctx,kind ||"sequence");
  }

}

export function sequence(...elts) {
  return new SequenceElt([...elts]);
}
