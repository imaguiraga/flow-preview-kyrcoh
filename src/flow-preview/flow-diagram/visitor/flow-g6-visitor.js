/**
 * Class FlowToG6Visitor.
 */
export class FlowToG6Visitor {
  /**
   * Convert a dsl tree to g6 Graph data.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} g6 Graph data.
   */
  visit(tree,filterFn){
    let result = null;
    if( typeof tree === "undefined"){
      return result;
    }
    switch(tree.tagName){
      case "choice":
        result = this._visitChoice(tree,filterFn);
      break;
      case "optional":
        result = this._visitOptional(tree,filterFn);
      break;
      case "sequence":
        result = this._visitSequence(tree,filterFn);
      break;
      case "repeat":
        result = this._visitRepeat(tree,filterFn);
      break;
      case "parallel":
        result = this._visitParallel(tree,filterFn);
      break;
      case "terminal":
        result = this._visitTerminal(tree,filterFn);
      break;
      default:
      break;

    }
    // TODO this.updateWdith(result);
    return result;
  }

  updateWdith(result) {
    if( result && result.nodes) {
      result.nodes.forEach((n) => {
        n.width = (n.label.length + 4) * 8;
      });
    }

  }

  _visitSequence(tree,filterFn){
    return SequenceEltFlowToG6Visitor.visit(this,tree,filterFn);
  }

  _visitChoice(tree,filterFn){
    return MutltiPathEltFlowToG6Visitor.visit(this,tree,filterFn,"choice");
  }

  _visitParallel(tree,filterFn){
    return MutltiPathEltFlowToG6Visitor.visit(this,tree,filterFn,"parallel");
  }

  _visitOptional(tree,filterFn){
    return OptionalEltFlowToG6Visitor.visit(this,tree,filterFn);
  }

  _visitRepeat(tree,filterFn){
    return RepeatEltFlowToG6Visitor.visit(this,tree,filterFn);
  }

  _visitTerminal(tree,filterFn){
    return TerminalFlowEltFlowToG6Visitor.visit(this,tree,filterFn);
  }
}

/**
 * Class TerminalFlowEltFlowToG6Visitor.
 */
class TerminalFlowEltFlowToG6Visitor{
  /**
   * Convert a dsl tree to g6 Graph data.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} g6 Graph data.
   */
  static visit(visitor,tree,filterFn) {
    const g6data = {
      nodes: [],
      edges: []
    };

    let n = {
      id: tree.id,
      label: tree.id ,
      model: { 
        resourceType: tree.resourceType,  
        tagName: 'terminal'
      }
    };
    if (filterFn) {
      if (!filterFn(n)) {
        g6data.nodes.push(n);
      }
    } else {
      g6data.nodes.push(n);
    }
    return g6data;
  }

}

/**
 * Class SequenceEltFlowToG6Visitor.
 */
class SequenceEltFlowToG6Visitor{
  /**
   * Convert a dsl tree to g6 Graph data.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} g6 Graph data.
   */  
  static visit(visitor,tree,filterFn) {
    const SEQUENCE = "sequence";
    const g6data = {
      nodes: [],
      edges: []
    };
    if (tree.tagName !== SEQUENCE) {
      return g6data;
    }
    // start + finish nodes
    g6data.nodes.push({
      id: tree.start.id,
      label: tree.start.id,
      model: { 
        resourceType: tree.resourceType,  
        tagName: SEQUENCE+'.start'
      }
    });
    // nodes
    if (tree.tagName === SEQUENCE) {
      tree.elts.forEach(node => {
        // keep only terminal nodes
        if (!node.isTerminal()) {
          return;
        }
        let n = {
          id: node.id,
          label: node.id,
          model: { 
            resourceType: node.resourceType,  
            tagName: SEQUENCE+'.terminal'
          }
        };
        if (filterFn) {
          if (!filterFn(n)) {
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
        resourceType: tree.resourceType,  
        tagName: SEQUENCE+'.finish'
      }
    });
    // edges
    g6data.edges.push({
        source: tree.start.id,
        target: tree.elts[0].start.id,
        model: { 
          resourceType: tree.resourceType,
          tagName: SEQUENCE
        },
      });

    for (let i = 0; i < tree.elts.length - 1; i++) {
      g6data.edges.push({
        source: tree.elts[i].finish.id,
        target: tree.elts[i + 1].start.id,
        model: { 
          resourceType: tree.resourceType,
          tagName: SEQUENCE
        },
      });
    }

    g6data.edges.push({
      source: tree.elts[tree.elts.length - 1].finish.id,
      target: tree.finish.id,
      model: { 
        resourceType: tree.resourceType,
        tagName: SEQUENCE
      },
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

/**
 * Class MutltiPathEltFlowToG6Visitor.
 */
class MutltiPathEltFlowToG6Visitor{
  /**
   * Convert a dsl tree to g6 Graph data.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} g6 Graph data.
   */  
  static visit(visitor,tree,filterFn,type){
    //const type = "choice" | "parallel";
    const g6data = {
      nodes: [],
      edges: []
    };
    //
    if (tree.tagName !== type) {
      return g6data;
    }
    // start + finish nodes
    g6data.nodes.push({
      id: tree.start.id,
      label: tree.start.id,
      model: { 
        resourceType: tree.resourceType,  
        tagName: type+'.start'
      }
    });

    // nodes
    if (tree.tagName === type) {
      tree.elts.forEach(node => {
        // keep only terminal nodes
        if (!node.isTerminal()) {
          return;
        }
        let n = {
          id: node.id,
          label: node.id,
          model: {
            resourceType: node.resourceType,   
            tagName: type+'.terminal'
          }
        };

        if (filterFn) {
          if (!filterFn(n)) {
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
        resourceType: tree.resourceType,   
        tagName: type+'.finish'
      }
    });
    // edges
    for (let i = 0; i < tree.elts.length; i++) {
      g6data.edges.push({
        source: tree.start.id,
        target: tree.elts[i].start.id,
        model: { 
          resourceType: tree.resourceType,
          tagName: type
        },
      });
      g6data.edges.push({
        source: tree.elts[i].finish.id,
        target: tree.finish.id,
        model: { 
          resourceType: tree.resourceType,
          tagName: type
        },
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

/**
 * Class OptionalEltFlowToG6Visitor.
 */
class OptionalEltFlowToG6Visitor{
  /**
   * Convert a dsl tree to g6 Graph data.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} g6 Graph data.
   */  
  static visit(visitor,tree,filterFn) {
    const OPTIONAL = "optional";
    const g6data = {
      nodes: [],
      edges: []
    };
    if (tree.tagName !== OPTIONAL) {
      return g6data;
    }
    // start node
    g6data.nodes.push({
      id: tree.start.id,
      label: tree.start.id ,
      model: {
        resourceType: tree.resourceType,   
        tagName: OPTIONAL+'.start'
      }
    });

    // skip node
    if(tree.skip) {
      g6data.nodes.push({
        id: tree.skip.id,
        model: {
          resourceType: tree.resourceType,   
          tagName: OPTIONAL+'.skip'
        }
      });
    }

    // nodes
    if (tree.tagName === OPTIONAL) {
      tree.elts.forEach(node => {
        // keep only terminal nodes
        if (!node.isTerminal()) {
          return;
        }
        let n = {
          id: node.id,
          label: node.id ,
          model: { 
            resourceType: node.resourceType,  
            tagName: OPTIONAL+'.terminal'
          }
        };
        if (filterFn) {
          if (!filterFn(n)) {
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
        resourceType: tree.resourceType,  
        tagName: OPTIONAL+'.finish'
      }
    });
    // edges

    if(tree.elts.length > 0) {
      g6data.edges.push({
        source: tree.start.id,
        target: tree.elts[0].start.id,
        model: { 
          resourceType: tree.resourceType,
          tagName: OPTIONAL
        },
      });
      g6data.edges.push({
        source: tree.elts[tree.elts.length-1].finish.id,
        target: tree.finish.id,
        model: { 
          resourceType: tree.resourceType,
          tagName: OPTIONAL
        },
      });
    }

    // start -> skip? -> finish
    if(typeof(tree.skip) !== "undefined"){
      g6data.edges.push({
        source: tree.start.id,
        target: tree.skip.id,
        model: { 
          resourceType: tree.resourceType,
          tagName: OPTIONAL
        },
      });
      g6data.edges.push({
        source: tree.skip.id,
        target: tree.finish.id,
        model: { 
          resourceType: tree.resourceType,
          tagName: OPTIONAL
        },
      });
    } else {
      g6data.edges.push({
        source: tree.start.id,
        target: tree.finish.id,
        model: { 
          resourceType: tree.resourceType,
          tagName: OPTIONAL
        },
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

/**
 * Class RepeatEltFlowToG6Visitor.
 */
class RepeatEltFlowToG6Visitor {
  /**
   * Convert a dsl tree to g6 Graph data.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} g6 Graph data.
   */
  static visit(visitor,tree,filterFn) {
    const REPEAT = "repeat";
    const g6data = {
      nodes: [],
      edges: []
    };
    if (tree.tagName !== REPEAT) {
      return g6data;
    }
    // start node
    g6data.nodes.push({
      id: tree.start.id,
      label: tree.start.id,
      model: { 
        resourceType: tree.resourceType,  
        tagName: REPEAT+'.start'
      }
    });

    // loop node
    if(tree.loop) {
      g6data.nodes.push({
        id: tree.loop.id,
        model: {
          resourceType: tree.resourceType,   
          tagName: REPEAT+'.loop'
        }
      });
    }
    // nodes
    if (tree.tagName === REPEAT) {
      tree.elts.forEach(node => {
        // keep only terminal nodes
        if (!node.isTerminal()) {
          return;
        }
        let n = {
          id: node.id,
          label: node.id ,
          model: {
            resourceType: node.resourceType,   
            tagName: REPEAT+'.terminal'
          }
        };
        if (filterFn) {
          if (!filterFn(n)) {
            g6data.nodes.push(n);
          }
        } else {
          g6data.nodes.push(n);
        }
      });
    }

    // finish node
    g6data.nodes.push({
      id: tree.finish.id,
      label: tree.finish.id,
      model: { 
        resourceType: tree.resourceType,  
        tagName: REPEAT+'.finish'
      }
    });
    // edges
    if(tree.elts.length > 0) {
      g6data.edges.push({
        source: tree.start.id,
        target: tree.elts[0].start.id,
        model: { 
          resourceType: tree.resourceType,
          tagName: REPEAT
        },
      });
      g6data.edges.push({
        source: tree.elts[tree.elts.length-1].finish.id,
        target: tree.finish.id,
        model: { 
          resourceType: tree.resourceType,
          tagName: REPEAT
        },
      });
    }

    // start <- loop <- finish
    // reverse the arrow direction
    if(typeof(tree.loop) !== "undefined"){
      g6data.edges.push({
        source: tree.start.id,
        target: tree.loop.id,
        style: {
          startArrow: true,
          endArrow: false,
          lineWidth: 2,
          stroke: "#555555"
        },
        model: { 
          resourceType: tree.resourceType,
          tagName: REPEAT
        },
      });
      g6data.edges.push({
        source: tree.loop.id,
        target: tree.finish.id,
        style: {
          startArrow: true,
          endArrow: false,
          lineWidth: 2,
          stroke: "#555555"
        },
        model: { 
          resourceType: tree.resourceType,
          tagName: REPEAT
        },
      });
    } else {
      g6data.edges.push({
        source: tree.finish.id,
        target: tree.start.id,
        model: { 
          resourceType: tree.resourceType,
          tagName: REPEAT
        },
      });
    }
    //*/
    
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