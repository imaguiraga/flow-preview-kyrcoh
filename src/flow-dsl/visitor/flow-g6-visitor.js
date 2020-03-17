export class FlowToG6Visitor {

  visit(tree,filter){
    let result = null;
    switch(tree.tagName){
      case "choice":
        result = this._visitChoice(tree,filter);
      break;
      case "optional":
        result = this._visitOptional(tree,filter);
      break;
      case "sequence":
        result = this._visitSequence(tree,filter);
      break;
      case "repeat":
        result = this._visitRepeat(tree,filter);
      break;
      case "terminal":
        result = this._visitTerminal(tree,filter);
      break;
      default:
      break;

    }
    return result;
  }

  _visitSequence(tree,filter){
    return SequenceEltFlowToG6Visitor.visit(this,tree,filter);
  }

  _visitChoice(tree,filter){
    return ChoiceEltFlowToG6Visitor.visit(this,tree,filter);
  }

  _visitOptional(tree,filter){
    return OptionalEltFlowToG6Visitor.visit(this,tree,filter);
  }

  _visitRepeat(tree,filter){
    return RepeatEltFlowToG6Visitor.visit(this,tree,filter);
  }

  _visitTerminal(tree,filter){
    return TerminalFlowEltFlowToG6Visitor.visit(this,tree,filter);
  }
}


export class TerminalFlowEltFlowToG6Visitor{
  static visit(visitor,tree,filter) {
    const g6data = {
      nodes: [],
      edges: []
    };

    let n = {
      id: tree.id,
      label: tree.id ,
      model: { 
        tagName: 'terminal'
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

export class SequenceEltFlowToG6Visitor{
  static visit(visitor,tree,filter) {
    const g6data = {
      nodes: [],
      edges: []
    };
    if (tree.tagName !== "sequence") {
      return g6data;
    }
    // start + finish nodes
    g6data.nodes.push({
      id: tree.start.id,
      label: tree.start.id,
      model: { 
        tagName: 'sequence.start'
      }
    });
    // nodes
    if (tree.tagName === "sequence") {
      tree.elts.forEach(node => {
        // keep only terminal nodes
        if (node.tagName !== "terminal") {
          return;
        }
        let n = {
          id: node.id,
          label: node.id,
          model: { 
            tagName: 'sequence.terminal'
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
        tagName: 'sequence.finish'
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

export class ChoiceEltFlowToG6Visitor{
  static visit(visitor,tree,filter){

    const g6data = {
      nodes: [],
      edges: []
    };
    //
    if (tree.tagName !== "choice") {
      return g6data
    }
    // start + finish nodes
    g6data.nodes.push({
      id: tree.start.id,
      label: tree.start.id,
      model: { 
        tagName: 'choice.start'
      }
    });

    // nodes
    if (tree.tagName === "choice") {
      tree.elts.forEach(node => {
        // keep only terminal nodes
        if (node.tagName !== "terminal") {
          return;
        }
        let n = {
          id: node.id,
          label: node.id,
          model: { 
            tagName: 'choice.terminal'
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
        tagName: 'choice.finish'
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

export class OptionalEltFlowToG6Visitor{
  static visit(visitor,tree,filter) {
    const g6data = {
      nodes: [],
      edges: []
    };
    if (tree.tagName !== "optional") {
      return g6data;
    }
    // start + finish nodes
    g6data.nodes.push({
      id: tree.start.id,
      label: tree.start.id ,
      model: { 
        tagName: 'optional.start'
      }
    });

    // nodes
    if (tree.tagName === "optional") {
      tree.elts.forEach(node => {
        // keep only terminal nodes
        if (node.tagName !== "terminal") {
          return;
        }
        let n = {
          id: node.id,
          label: node.id ,
          model: { 
            tagName: 'optional.terminal'
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
        tagName: 'optional.finish'
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

export class RepeatEltFlowToG6Visitor{
  static visit(visitor,tree,filter) {
    const g6data = {
      nodes: [],
      edges: []
    };
    if (tree.tagName !== "repeat") {
      return g6data;
    }
    // start + finish nodes
    g6data.nodes.push({
      id: tree.start.id,
      label: tree.start.id,
      model: { 
        tagName: 'repeat.start'
      }
    });

    // nodes
    if (tree.tagName === "repeat") {
      tree.elts.forEach(node => {
        // keep only terminal nodes
        if (node.tagName !== "terminal") {
          return;
        }
        let n = {
          id: node.id,
          label: node.id ,
          model: { 
            tagName: 'repeat.terminal'
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
        tagName: 'repeat.finish'
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