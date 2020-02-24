import "./styles.css";
// using ES6 modules
import Split from "split.js";
let instance = null;

Split(["#one", "#two"], {
  sizes: [75, 25],
  //direction: "vertical",
  minSize: [300, 400],
  gutter: function(index, direction) {
    var gutter = document.createElement("div");
    gutter.className = "gutter gutter-" + direction;
    //gutter.style.height = "185px";
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
console.log(instance);
