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

function updatePreviewPane(content){
  try {
    // Update preview
    let flowfunc = parseFlow(content);
    let flows = flowfunc(flow);
    console.log(flows);
    initFlowSelection(flows);
    renderFlow(flows.get("testflow") /*flows.next().value*/);    
  } catch(e) {
    console.error(e.name + ': ' + e.message);
    graph.data([]);
    graph.render();
  }
}

function renderFlow(input){
  try {
    // Update preview
    let flow = uidvisitor.visit(input);
    const data = visitor.visit(flow);
    graph.data(data!== null ? data : []);
    graph.render();

  } catch(e) {
    console.error(e.name + ': ' + e.message);
    graph.data([]);
    graph.render();
  }
}


//console.log(splitPane);
const editor = createEditor('editor-pane','',(instance) => {
  console.log('changes');
  const content = instance.getDoc().getValue();
  updatePreviewPane(content);
}); 

function initFlowSelection(flows){
  // Populate select component from list of samples
  let selectElt = document.getElementById("flow-preview-select");
  while (selectElt.firstChild) {
    selectElt.firstChild.remove();
  }

  flows.forEach((value,key) => {
    let opt = document.createElement("option");
    opt.value = key;
    opt.text = key;
    selectElt.add(opt);
  });
  // Update flow when the selection changes 
  selectElt.addEventListener('change', (event) => {
    const result = flows.get(event.target.value);
    renderFlow(result);
  });
}

editor.setContent(content);
import {samples} from "./samples.js";

(function initSampleSelection(samples,callback){
  // Populate select component from list of samples
  let selectElt = document.getElementById("flow-sample-select");
  while (selectElt.firstChild) {
    selectElt.firstChild.remove();
  }

  samples.forEach((value,index) => {
    let opt = document.createElement("option");
    opt.value = index;
    opt.text = `Sample #${index +1}`;
    selectElt.add(opt);
  });
  // Update sample when the selection changes 
  selectElt.addEventListener('change', (event) => {
    const result = samples[event.target.value];
    callback(result);
  });
})(samples,(text)=> {editor.setContent(text)});

