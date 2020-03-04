//var esprima = require('esprima');
//var escodegen = require("escodegen");
import * as esprima from 'esprima';
import * as escodegen from 'escodegen';
//import * as flowModule from './flow-module.js'
export function parseFlow(input){
  // Parse text
  let flowfunc = new Function("module","return new Map();");
  try {
    let tree = esprima.parseScript(input);
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
    
    flowfunc = new Function("module",text);
  }catch(e){
    console.error(e.name + ': ' + e.message);
  }
  
  return flowfunc;
}