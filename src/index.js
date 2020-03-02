import "./styles.css";
// using ES6 modules
import Split from "split.js";
import {content,parseFlow,createEditor} from "./editor";


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
//console.log(splitPane);
const editor = createEditor('editor-pane','',(instance) => {
  console.log('changes');
  let flowfunc = parseFlow(instance.getDoc().getValue());
}); 
editor.setContent(content);
//console.log(editor.getContent());

////////////////////
import * as flow from "./preview/flow-element";
import * as diagram from "./preview/flow-diagram";
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

let selectClause = () => sequence(a, b, repeat(optional("c")), zeroOrMore("d"));
let fromClause = () => choice("1", "2", selectClause, "4");

let testflow = choice(
  terminal("a"),
  choice("e", "d"),
  sequence(terminal("b"), terminal("c"),sequence("c","d")),
  sequence("c","d")
);
//*/
// Generate flow by parsing javascript text
let func = new Function("module",`const {
    repeat,
    sequence,
    optional,
    choice,
    zeroOrMore,
    terminal
  } = module;
  let f = choice(
    "a",
    choice("e", "d"),
    sequence(terminal("b"), terminal("c"),choice("c","d")),
    sequence("c","d")
  );
  return f;`);
try {
  testflow = func(flow);
}catch(e){
  console.error(e.name + ': ' + e.message);
}

const visitor = new G6Visitor();
const uidvisitor = new UIDVisitor();
testflow = uidvisitor.visit(testflow);
const data = visitor.visit(testflow);

let graph = diagram.createFlowGraph("preview-pane");
graph.data(data);
graph.render();