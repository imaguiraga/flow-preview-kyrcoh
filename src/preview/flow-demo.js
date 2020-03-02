import * as flow from "./flow-element";
import * as diagram from "./flow-diagram";
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
/*
let selectClause = () => {
  return sequence(a, b, repeat(optional("c")), ZeroOrMore("d"));
};
//*/

/*
let selectClause = function() {
  return sequence(a, b, repeat(optional("c")));
};
//*/

function a() {
  return new TerminalElt("a");
}

function b() {
  return new TerminalElt("b");
}

let testf = new Function('return choice("1", "2", selectClause, "4");');
//let testflow = choice(terminal("a"), choice("e", "d"));
//let testflow = choice("e", "d");
//let testflow = sequence("b", "c");
// testflow = repeat(terminal("b"));
// testflow = fromClause();
console.log(testflow);
const visitor = new G6Visitor();
const uidvisitor = new UIDVisitor();
testflow = uidvisitor.visit(testflow);
const data = visitor.visit(testflow);
console.log(JSON.stringify(data));

let graph = diagram.createFlowGraph("container");
graph.data(data);
console.log(graph);
graph.render();
