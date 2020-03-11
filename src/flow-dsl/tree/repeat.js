import {CompositeFlowElt} from "./terminal.js"

/**
 * Class RepeatElt.
 * @extends CompositeFlowElt
 */
export class RepeatElt extends CompositeFlowElt {
  /**
   * Create a RepeatElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   * @param {string} kind - The kind value.
   */
  constructor(elts,ctx,kind) {
    super(elts,ctx,kind ||"repeat");
  }

  add(elt){
    // only one elt can be added
    if(this.elts.length > 0){
      this.elts.splice(0,this.elts.length);
    }
    this.elts.push(this.resolveElt(elt));
    return this;
  }
}

export function repeat(elt) {
  return new RepeatElt(elt);
}
