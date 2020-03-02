import {NonTerminalElt} from "./terminal.js"

/**
 * Class OptionalElt.
 * @extends NonTerminalElt
 */
export class OptionalElt extends NonTerminalElt{
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
      this.elts.clear();
    }
    this.elts.push(this.resolveElt(elt));
    return this;
  }
}

export function optional(elt) {
  return new OptionalElt(elt);
}

