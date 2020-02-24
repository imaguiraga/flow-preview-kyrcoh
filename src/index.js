import "./styles.css";
// using ES6 modules
import Split from "split.js";
import {content} from "./data-index.js";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";

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
//console.log(content);

// Initialize Editor Pane
const codeMirrorEditor = CodeMirror(document.getElementById('editor-pane'), {
  value: content,
  mode:  "javascript",
  lineNumbers: true,
  lineWrapping: true,
  viewportMargin: 40,
  foldGutter: true,
  gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
});
