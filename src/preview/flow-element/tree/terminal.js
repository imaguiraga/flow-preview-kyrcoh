/**
 * Class TerminalElt.
 */
export class TerminalElt {
  static ID = 0;
  /**
   * Create a NonTerminalElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   * @param {string} kind - The kind value.
   */
  constructor(elts,ctx,kind) {
    let self = this;
    self.title = "title";
    self.elts = [];

    let r = self.resolveElt(elts); 
    if( r !== null) {
      // only one elt can be added
      self.elts.push(r);
      self.title = r;
    }
    
    //get new id
    TerminalElt.ID = TerminalElt.ID + 1;
    self.kind = kind || "terminal";
    self.id = self.kind + "." + TerminalElt.ID;
    
    self.start = this;
    self.finish = this;
    self.ctx = ctx;
  }
  
  resolveElt(elt){
    // Only accept primitive types as Terminal Element 
    let result = null;
    if( typeof elt !== "undefined") {
      try {
        if (typeof elt === "function") {
          result = elt.call();
        }        
        result = elt.toString();

      } catch(err){
        console.error(err.message + " - " +err);
      }
    }
    return result;
  }

  add(elt){  
    debugger
    let r = this.resolveElt(elt); 
    if( r !== null) {
      // only one elt can be added
      if(this.elts.length > 0){
        this.elts.splice(0,this.elts.length);
      }
      this.elts.push(r);
    }
    
    return this;
  }

  foundElt(elt) {
    return this.id === elt.id;
  }

  accept(visitor,filter){
    return visitor.visit(this,filter);
  }

  _ctx_(_ctx){
    this.ctx = _ctx;
    return this;
  }

  _title_(_title){
    this.title = _title;
    return this;
  }

  _id_(_id){
    debugger
    this.id = _id;
    return this;
  }

}

export function terminal(elt) {
  return new TerminalElt(elt);
}

/**
 * Class NonTerminalElt.
 * @extends TerminalElt
 */
export class NonTerminalElt extends TerminalElt {
  /**
   * Create a NonTerminalElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   * @param {string} kind - The kind value.
   */
  constructor(elts,ctx,kind) {
    super(elts,ctx,kind);
    let self = this;
    self.elts = [];
    self.title = null;
    self.start = new TerminalElt("start",null,"start");
    self.finish = new TerminalElt("finish",null,"finish");

    if(Array.isArray(elts)) {
      self.elts = elts.map(self.resolveElt).filter( e => { return e!= null});
    } else {
      let r = self.resolveElt(elts);
      if( r != null) {
        self.elts.push(r);
      }
    }

    if (self.title === null) {
      self.title = "" + self.id;
    }
  }

  resolveElt(elt){
    if (typeof elt === "function") {
      return elt.call();
    } else if (typeof elt !== "object") {
      // very likely a primitive type
      return terminal(elt);
    }
    // default to object
    return elt;
  }

  foundElt(elt) {
    return this.elts.filter(e => e.id === elt.id).length > 0;
  }

  add(elt){
    let self = this;
    if(Array.isArray(elt)){
      elt.forEach((e) => {
        let r = self.resolveElt(e);
        if( r != null) {
          self.elts.push(r);
        }
      });

    } else {
      let r = self.resolveElt(elt);
      if( r != null) {
        self.elts.push(r);
      }
    }
    
    return this;
  }
}
