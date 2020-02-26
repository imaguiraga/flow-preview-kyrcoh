var esprima = require('esprima');
var escodegen = require("escodegen");

export function parseFlow(input){
  // Parse text
  var tree = esprima.parseScript(input);
  var rtree = esprima.parseScript(r);
  // Modify AST
  tree.body.push(rtree);
  let ids = tree.body.filter(
    (elt) => {return elt.type === 'VariableDeclaration'})
      .map((elt) => {
          let id = elt.declarations[0].id.name;
          return `result.set('${id}',${id});`;
      });
      
  let text =
    `const {
      repeat,
      sequence,
      optional,
      choice,
      zeroOrMore,
      terminal
    } = module;
    ${input}
    let result = new Map();
    ${ids.join("\n")}
    return result;
  `;
  console.log(text);
  //let f = new Function("module",text);
  //return f();
}