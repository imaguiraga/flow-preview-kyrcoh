import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";

export function createEditor(editor,content){
  return new EditorWrapper(editor, content);
}

class EditorWrapper {
  constructor(editor, content){
    // Initialize Editor Pane
    this._cm = CodeMirror(
      document.getElementById(editor), {
        value: content,
        mode:  "javascript",
        lineNumbers: true,
        lineWrapping: true,
        viewportMargin: 40,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    });
    //debugger
    this._cm.on("change",this.onContentChange);
  }

  getContent(){
    return this._cm.getDoc().getValue();
  }

  setContent(content){
    this._cm.getDoc().setValue(content);
  }

  onContentChange(instance/* @CodeMirror */, changes /* @array<object> {from, to, text, removed, origin}*/){
    console.log("on-change");

  }
}

