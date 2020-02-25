import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";

export function createEditor(editor, content, callback){
  return new EditorWrapper(editor, content, callback);
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
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    });
    /* (instance/* @CodeMirror , changes  @array<object> {from, to, text, removed, origin} */
    if(callback){
      this._cm.on("changes",callback);
    }
  }

  getContent(){
    return this._cm.getDoc().getValue();
  }

  setContent(content){
    this._cm.getDoc().setValue(content);
  }

}

