
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/addon/display/panel.js";
import "codemirror/addon/lint/lint.js";
import "codemirror/addon/lint/javascript-lint.js";
import "codemirror/addon/lint/lint.css";
//import "jshint/src/jshint.js";
//import * as jshint from "jshint";
import { JSHINT } from "jshint";
window.JSHINT = JSHINT;

export function createEditor(container, content){
  // Initialize Editor Pane
    let editor = CodeMirror(
      document.getElementById(container), {
        value: content,
        mode:  "javascript",
        lineNumbers: true,
        lineWrapping: true,
        viewportMargin: 40,
        foldGutter: true,
        lint: { 'esversion': '8' }, 
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter","CodeMirror-lint-markers"],
    });

  return editor;
}

const panels = {};
let numPanels = 0;
function makePanel(where) {
  var node = document.createElement("div");
  var id = ++numPanels;
  var widget, close, label;

  node.id = "panel-" + id;
  node.className = "panel " + where;
  close = node.appendChild(document.createElement("a"));
  close.setAttribute("title", "Remove me!");
  close.setAttribute("class", "remove-panel");
  close.textContent = "✖";
  CodeMirror.on(close, "mousedown", function(e) {
    e.preventDefault()
    panels[node.id].clear();
  });
  label = node.appendChild(document.createElement("span"));
  label.textContent = "I'm panel n°" + id;
  return node;
}

function addPanel(where,editor) {
  var node = makePanel(where);
  panels[node.id] = editor.addPanel(node, {position: where, stable: true});
}
