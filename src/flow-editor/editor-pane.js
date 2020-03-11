
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
    let containerElt = (typeof container === "string") ? document.getElementById(container) : container;
  // Initialize Editor Pane
    let editor = CodeMirror(
    containerElt, {
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