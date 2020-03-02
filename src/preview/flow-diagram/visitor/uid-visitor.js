export class UIDVisitor {

  constructor(prefix){
    this._prefix = prefix || "UID";
  }

  visit(tree,filter){
    // Non terminal nodes have start and finish
    if( tree.kind !== "terminal"){
      tree.start.id = this._prefix + ":" + tree.kind + ".start";
      tree.finish.id = this._prefix + ":" + tree.kind + ".finish";
    }
    
    tree.elts.filter(elt => elt instanceof Object).forEach(
      (elt,index) =>  {
        // keep only terminal nodes
        let p = this._prefix.concat("."+index);
        elt.id = p + ":" + elt.kind;
        elt.accept(new UIDVisitor(p),null);
      });
    return tree;
  }

}
