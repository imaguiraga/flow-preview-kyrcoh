import {
  repeat,
  sequence,
  optional,
  choice,
  zeroOrMore,
  terminal,
  flowgraph,
  G6Visitor
} from "../src/flow.js";

let testflow = choice(terminal("a"), choice("e", "d"));

const visitor = new G6Visitor();
const data = visitor.visit(testflow);

let graph = flowgraph("container");
graph.data(data);
graph.render();
