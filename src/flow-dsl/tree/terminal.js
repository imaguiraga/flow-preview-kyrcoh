/**
 * Class TerminalFlowElt.
 */
export class TerminalFlowElt {
  static ID = 0;
  static RESOURCE_TYPE = "flow";
  /**
   * Create a CompositeFlowElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   * @param {string} tagName - The tagName value.
   */
  constructor(elts,ctx,tagName) {
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
    TerminalFlowElt.ID = TerminalFlowElt.ID + 1;
    self.resourceType = TerminalFlowElt.RESOURCE_TYPE;
    self.tagName = tagName || "terminal";
    self.id = self.tagName + "." + TerminalFlowElt.ID;
    
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
  return new TerminalFlowElt(elt);
}

/**
 * Class CompositeFlowElt.
 * @extends TerminalFlowElt
 */
export class CompositeFlowElt extends TerminalFlowElt {
  /**
   * Create a CompositeFlowElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   * @param {string} tagName - The tagName value.
   */
  constructor(elts,ctx,tagName) {
    super(elts,ctx,tagName);
    let self = this;
    self.elts = [];
    self.title = null;
    self.start = new TerminalFlowElt("start",null,"start");
    self.finish = new TerminalFlowElt("finish",null,"finish");

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
