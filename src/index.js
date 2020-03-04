import "./styles.css";
// using ES6 modules
import Split from "split.js";
import {content,parseFlow,createEditor} from "./editor";

import * as flow from "./preview/flow-element";
import * as diagram from "./preview/flow-diagram";

// Initialize Split Pane
const splitPane = Split(["#one", "#two"], {
  sizes: [40, 60],
  minSize: [200, 300],
  gutter: function(index, direction) {
    var gutter = document.createElement("div");
    gutter.className = "gutter gutter-" + direction;
    return gutter;
  },
  gutterSize: 2,
  elementStyle: (dimension, size, gutterSize) => ({
        'flex-basis': `calc(${size}% - ${gutterSize}px)`,
    }),
    gutterStyle: (dimension, gutterSize) => ({
        'flex-basis':  `${gutterSize}px`,
    })
});


const {
  repeat,
  sequence,
  optional,
  choice,
  zeroOrMore,
  terminal,
  TerminalElt
} = flow;

const {
  G6Visitor,
  UIDVisitor
} = diagram;

const visitor = new G6Visitor();
const uidvisitor = new UIDVisitor();

const graph = diagram.createFlowGraph("preview-pane");

//console.log(splitPane);
const editor = createEditor('editor-pane','',(instance) => {
  console.log('changes');
  
  try {
    // Update preview
    let flowfunc = parseFlow(instance.getDoc().getValue());
    let flowMap = flowfunc(flow);
    if(flowMap.size > 0){
      if(flowMap.has("testflow")){
        let testflow = flowMap.get("testflow");
        testflow = uidvisitor.visit(testflow);
        const data = visitor.visit(testflow);
        graph.data(data!== null ? data : []);
        graph.render();
      }
    } else {
      graph.data([]);
      graph.render();
    }

    console.log(flowMap);
  }catch(e){
    console.error(e.name + ': ' + e.message);
    graph.data([]);
    graph.render();
  }
  
}); 
editor.setContent(content);
