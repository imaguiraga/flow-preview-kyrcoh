import 'es6-promise/auto';  // polyfill Promise on IE

import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/addon/display/panel.js";
import "codemirror/addon/lint/lint.js";
import "codemirror/addon/lint/javascript-lint.js";
import "codemirror/addon/lint/lint.css";

import {parseFlow,createEditor} from "../editor";
import * as flow from "../preview/flow-element";

//import "jshint/src/jshint.js";
//import * as jshint from "jshint";
import { JSHINT } from "jshint";
globalThis.JSHINT = JSHINT;

import {
  CommandRegistry
} from '@lumino/commands';

import {
  Message
} from '@lumino/messaging';

import {
  BoxPanel, CommandPalette, ContextMenu, DockPanel, Menu, MenuBar, Widget
} from '@lumino/widgets';

import './style.css';


/**
 * A widget which hosts a CodeMirror editor.
 */
export default class CodeMirrorWidget extends Widget {
  static createNode() {
    /*
<div style="margin:2px;font-size:12px">
				<select id="flow-sample-select" class="flow-select">
          <option value="-1">Select a sample</option>
        </select>
			</div>
			<div class="separator"></div>
			<div id="editor-pane" class="content-pane"></div>
//*/

    return null;
  }

  constructor(content) {
    super();
    this.addClass('CodeMirrorWidget');

    this.node.setAttribute("style","margin:2px;font-size:12px");

    this.selectElt = document.createElement('select');
    this.selectElt.setAttribute("id","flow-sample-select");
    this.selectElt.setAttribute("class","flow-select");

    let separator = document.createElement('div');
    separator.setAttribute("class","separator");

    this.paneElt = document.createElement('div');
    this.paneElt.setAttribute("id","editor-pane");
    this.paneElt.setAttribute("class","content-pane");

    this.node.appendChild(this.selectElt);
    this.node.appendChild(separator);
    this.node.appendChild(this.paneElt);

    this._editor = CodeMirror(
        this.paneElt, {
        value: content,
        mode:  "javascript",
        lineNumbers: true,
        lineWrapping: true,
        viewportMargin: 40,
        foldGutter: true,
        lint: { 'esversion': '8' }, 
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter","CodeMirror-lint-markers"],
    });

  }

  get editor() {
    return this._editor;
  }

  setContent(content) {
    var doc = this._editor.getDoc();
    doc.setValue(content);

  }

  onAfterAttach(msg) {
    this._editor.refresh();
  }

  onResize(msg) {
    if (msg.width < 0 || msg.height < 0) {
      this._editor.refresh();
    } else {
      this._editor.setSize(msg.width, msg.height-this.selectElt.height);
    }
  }

}