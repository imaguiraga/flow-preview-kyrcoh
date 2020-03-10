export class G6Visitor {

  visit(tree,filter){
    let result = null;
    switch(tree.kind){
      case "choice":
        result = this.visitChoice(tree,filter);
      break;
      case "optional":
        result = this.visitOptional(tree,filter);
      break;
      case "sequence":
        result = this.visitSequence(tree,filter);
      break;
      case "repeat":
        result = this.visitRepeat(tree,filter);
      break;
      case "terminal":
        result = this.visitTerminal(tree,filter);
      break;
      default:
      break;

    }
    return result;
  }

  visitSequence(tree,filter){
    return SequenceEltG6Visitor.visit(this,tree,filter);
  }

  visitChoice(tree,filter){
    return ChoiceEltG6Visitor.visit(this,tree,filter);
  }

  visitOptional(tree,filter){
    return OptionalEltG6Visitor.visit(this,tree,filter);
  }

  visitRepeat(tree,filter){
    return RepeatEltG6Visitor.visit(this,tree,filter);
  }

  visitTerminal(tree,filter){
    return TerminalEltG6Visitor.visit(this,tree,filter);
  }
}


export class TerminalEltG6Visitor{
  static visit(visitor,tree,filter) {
    const g6data = {
      nodes: [],
      edges: []
    };

    let n = {
      id: tree.id,
      label: tree.id ,
      model: { 
        kind: 'terminal'
      }
    };
    if (filter) {
      if (!filter(n)) {
        g6data.nodes.push(n);
      }
    } else {
      g6data.nodes.push(n);
    }
    return g6data;
  }

}

export class SequenceEltG6Visitor{
  static visit(visitor,tree,filter) {
    const g6data = {
      nodes: [],
      edges: []
    };
    if (tree.kind !== "sequence") {
      return g6data;
    }
    // start + finish nodes
    g6data.nodes.push({
      id: tree.start.id,
      label: tree.start.id,
      model: { 
        kind: 'sequence.start'
      }
    });
    // nodes
    if (tree.kind === "sequence") {
      tree.elts.forEach(node => {
        // keep only terminal nodes
        if (node.kind !== "terminal") {
          return;
        }
        let n = {
          id: node.id,
          label: node.id,
          model: { 
            kind: 'sequence.terminal'
          }
        };
        if (filter) {
          if (!filter(n)) {
            g6data.nodes.push(n);
          }
        } else {
          g6data.nodes.push(n);
        }
      });
    }
    g6data.nodes.push({
      id: tree.finish.id,
      label: tree.finish.id ,
      model: { 
        kind: 'sequence.finish'
      }
    });
    // edges
    g6data.edges.push({
        source: tree.start.id,
        target: tree.elts[0].start.id
      });

    for (let i = 0; i < tree.elts.length - 1; i++) {
      g6data.edges.push({
        source: tree.elts[i].finish.id,
        target: tree.elts[i + 1].start.id
      });
    }

    g6data.edges.push({
      source: tree.elts[tree.elts.length - 1].finish.id,
      target: tree.finish.id
    });
    // concatenate G6 graphs

    tree.elts.forEach(elt => {
      let g6 = elt.accept(visitor,n => tree.foundElt(n));
      if(g6 !== null) {
        g6data.nodes = g6data.nodes.concat(g6.nodes);
        g6data.edges = g6data.edges.concat(g6.edges);
      }
    });

    return g6data;
  }
}

export class ChoiceEltG6Visitor{
  static visit(visitor,tree,filter){

    const g6data = {
      nodes: [],
      edges: []
    };
    //
    if (tree.kind !== "choice") {
      return g6data
    }
    // start + finish nodes
    g6data.nodes.push({
      id: tree.start.id,
      label: tree.start.id,
      model: { 
        kind: 'choice.start'
      }
    });

    // nodes
    if (tree.kind === "choice") {
      tree.elts.forEach(node => {
        // keep only terminal nodes
        if (node.kind !== "terminal") {
          return;
        }
        let n = {
          id: node.id,
          label: node.id,
          model: { 
            kind: 'choice.terminal'
          }
        };

        if (filter) {
          if (!filter(n)) {
            g6data.nodes.push(n);
          }
        } else {
          g6data.nodes.push(n);
        }
      });
    }
    g6data.nodes.push({
      id: tree.finish.id,
      label: tree.finish.id ,
      model: { 
        kind: 'choice.finish'
      }
    });
    // edges
    for (let i = 0; i < tree.elts.length; i++) {
      g6data.edges.push({
        source: tree.start.id,
        target: tree.elts[i].start.id
      });
      g6data.edges.push({
        source: tree.elts[i].finish.id,
        target: tree.finish.id
      });
    }
    // concatenate G6 graphs

    tree.elts.forEach(elt => {
      let g6 = elt.accept(visitor,n => tree.foundElt(n));
      if(g6 !== null) {
        g6data.nodes = g6data.nodes.concat(g6.nodes);
        g6data.edges = g6data.edges.concat(g6.edges);
      }
    });

    return g6data;
  }
  
}

export class OptionalEltG6Visitor{
  static visit(visitor,tree,filter) {
    const g6data = {
      nodes: [],
      edges: []
    };
    if (tree.kind !== "optional") {
      return g6data;
    }
    // start + finish nodes
    g6data.nodes.push({
      id: tree.start.id,
      label: tree.start.id ,
      model: { 
        kind: 'optional.start'
      }
    });

    // nodes
    if (tree.kind === "optional") {
      tree.elts.forEach(node => {
        // keep only terminal nodes
        if (node.kind !== "terminal") {
          return;
        }
        let n = {
          id: node.id,
          label: node.id ,
          model: { 
            kind: 'optional.terminal'
          }
        };
        if (filter) {
          if (!filter(n)) {
            g6data.nodes.push(n);
          }
        } else {
          g6data.nodes.push(n);
        }
      });
    }
    g6data.nodes.push({
      id: tree.finish.id,
      label: tree.finish.id ,
      model: { 
        kind: 'optional.finish'
      }
    });
    // edges
    for (let i = 0; i < tree.elts.length; i++) {
      g6data.edges.push({
        source: tree.start.id,
        target: tree.elts[i].start.id
      });
      g6data.edges.push({
        source: tree.elts[i].finish.id,
        target: tree.finish.id
      });
    }

    g6data.edges.push({
      source: tree.start.id,
      target: tree.finish.id
    });
    // concatenate G6 graphs

    tree.elts.forEach(elt => {
      let g6 = elt.accept(visitor,n => tree.foundElt(n));
      if(g6 !== null) {
        g6data.nodes = g6data.nodes.concat(g6.nodes);
        g6data.edges = g6data.edges.concat(g6.edges);
      }
    });

    return g6data;
  }
}

export class RepeatEltG6Visitor{
  static visit(visitor,tree,filter) {
    const g6data = {
      nodes: [],
      edges: []
    };
    if (tree.kind !== "repeat") {
      return g6data;
    }
    // start + finish nodes
    g6data.nodes.push({
      id: tree.start.id,
      label: tree.start.id,
      model: { 
        kind: 'repeat.start'
      }
    });

    // nodes
    if (tree.kind === "repeat") {
      tree.elts.forEach(node => {
        // keep only terminal nodes
        if (node.kind !== "terminal") {
          return;
        }
        let n = {
          id: node.id,
          label: node.id ,
          model: { 
            kind: 'repeat.terminal'
          }
        };
        if (filter) {
          if (!filter(n)) {
            g6data.nodes.push(n);
          }
        } else {
          g6data.nodes.push(n);
        }
      });
    }

    g6data.nodes.push({
      id: tree.finish.id,
      label: tree.finish.id,
      model: { 
        kind: 'repeat.finish'
      }
    });
    // edges
    for (let i = 0; i < tree.elts.length; i++) {
      g6data.edges.push({
        source: tree.start.id,
        target: tree.elts[i].start.id
      });
      g6data.edges.push({
        source: tree.elts[i].finish.id,
        target: tree.finish.id
      });
    }

    g6data.edges.push({
      source: tree.finish.id,
      target: tree.start.id
    });
    // concatenate G6 graphs

    tree.elts.forEach(elt => {
      let g6 = elt.accept(visitor,n => tree.foundElt(n));
      if(g6 !== null) {
        g6data.nodes = g6data.nodes.concat(g6.nodes);
        g6data.edges = g6data.edges.concat(g6.edges);
      }
    });
    return g6data;
  }
}