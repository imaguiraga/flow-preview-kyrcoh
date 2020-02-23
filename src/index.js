import "./styles.css";
// using ES6 modules
import Split from "split.js";
let instance = null;
/*
instance = new Split(["#one", "#two"], {
  sizes: [25, 75],
  minSize: [300, 500]
});
//*/
/*
instance = Split(["#one", "#two"], {
  direction: "horizontal"
});
//*/
/*
instance = Split(["#one", "#two"], {
  snapOffset: 0
});
//*/
/*
  // "flow-diagram-kyrcoh":"https://github.com/imaguiraga/flow-diagram-kyrcoh.git"*/
Split(["#one", "#two"], {
  sizes: [75, 25],
  //direction: "vertical",
  minSize: [300, 500],
  gutter: function(index, direction) {
    var gutter = document.createElement("div");
    gutter.className = "gutter gutter-" + direction;
    //gutter.style.height = "185px";
    return gutter;
  },
  gutterSize: 8,
  elementStyle: function(dimension, size, gutterSize) {
    console.log(dimension);
    return {
      "flex-basis": "calc(" + size + "% - " + gutterSize + "px)"
    };
  },
  gutterStyle: function(dimension, gutterSize) {
    console.log(dimension);
    let style = {};
    style["flex-basis"] = gutterSize + "px";
    return style;
  }
});
console.log(instance);
