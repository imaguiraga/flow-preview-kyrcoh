import {CompositeFlowElt} from "./terminal.js"

/**
 * Class ChoiceElt.
 * @extends CompositeFlowElt
 */
export class ChoiceElt extends CompositeFlowElt {
  /**
   * Create a ChoiceElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   * @param {string} kind - The kind value.
   */
  constructor(elts,ctx,kind)  {
    super(elts,ctx,kind || "choice");
  }

}

export function choice(...elts) {
  return new ChoiceElt([...elts]);
}

