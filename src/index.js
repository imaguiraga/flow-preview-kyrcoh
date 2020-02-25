import "./styles.css";
// using ES6 modules
import Split from "split.js";
import {content} from "./data-index.js";
import {createEditor} from "./editor-pane.js";

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
const editor = createEditor('editor-pane',content,() => {
  console.log('changes');
}); 

//console.log(editor.getContent());