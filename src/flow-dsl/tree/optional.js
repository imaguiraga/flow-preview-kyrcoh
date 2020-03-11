import {CompositeFlowElt} from "./terminal.js"

/**
 * Class OptionalElt.
 * @extends CompositeFlowElt
 */
export class OptionalElt extends CompositeFlowElt{
  /**
   * Create a OptionalElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   * @param {string} kind - The kind value.
   */
  constructor(elts,ctx,kind)  {
    super(elts,ctx,kind || "optional");
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

export function optional(elt) {
  return new OptionalElt(elt);
}

