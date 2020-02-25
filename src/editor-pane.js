import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";

export function createEditor(editor,content){
  return new EditorWrapper(editor, content);
}

class EditorWrapper {
  constructor(editor, content){
    // Initialize Editor Pane
    this.codeMirrorEditor = CodeMirror(
      document.getElementById(editor), {
        value: content,
        mode:  "javascript",
        lineNumbers: true,
        lineWrapping: true,
        viewportMargin: 40,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    });

  }

  getContent(){

  }

  setContent(content){

  }
}

