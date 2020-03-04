
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/addon/display/panel.js";
//import "jshint/src/jshint.js";
//import * as jshint from "jshint";
import { JSHINT } from "jshint";
window.JSHINT = JSHINT;

import "codemirror/addon/lint/lint.js";
import "codemirror/addon/lint/javascript-lint.js";
import "codemirror/addon/lint/lint.css";

export function createEditor(editor, content, callback){
  return new EditorWrapper(editor, content, callback);
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

class EditorWrapper {
  constructor(editor, content, callback){
    // Initialize Editor Pane
    this._cm = CodeMirror(
      document.getElementById(editor), {
        value: content,
        mode:  "javascript",
        lineNumbers: true,
        lineWrapping: true,
        viewportMargin: 40,
        foldGutter: true,
        lint: true,
        lint: { 'esversion': '8' }, 
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter","CodeMirror-lint-markers"],
    });
    /* (instance/* @CodeMirror , changes  @array<object> {from, to, text, removed, origin} */
    if(callback){
      this._cm.on("changes",callback);
    }

    //addPanel("bottom",this._cm);
  }

  getContent(){
    return this._cm.getDoc().getValue();
  }

  setContent(content){
    this._cm.getDoc().setValue(content);
  }

}

