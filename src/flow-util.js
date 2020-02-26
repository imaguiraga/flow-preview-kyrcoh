var esprima = require('esprima');
var escodegen = require("escodegen");

export function parseFlow(input){
  // Parse text
  var tree = esprima.parseScript(input);
  // Modify AST
  //tree.body.push(rtree);
  let ids = tree.body.filter(
    (elt) => {return elt.type === 'VariableDeclaration'})
      .map((elt) => {
        let decl = elt.declarations[0];
        let name = decl.id.name;
        let value = name;
        if(decl.init.type === "ArrowFunctionExpression" || decl.init.type === "FunctionExpression"){
            value = name+"()";
        }
        return `result.set('${name}',${value});`;
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