// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2017, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
/* tslint:disable */ 
import 'es6-promise/auto';  // polyfill Promise on IE

import {
  CommandRegistry
} from '@lumino/commands';

import {
  BoxPanel, CommandPalette, ContextMenu, DockPanel, Menu, MenuBar, Widget
} from '@lumino/widgets';

import {
  createMenu, createBarWidget, createPalette
} from './menu-util';

import { CodeMirrorWidget } from "./codemirror-widget";
import { G6GraphWidget } from "./g6graph-widget";

import '../style/index.css';
import {samples} from "../../samples.js";
import {content,parseFlow,createEditor} from "../editor";

import * as flow from "../preview/flow-element";
import * as diagram from "../preview/flow-diagram";

const {
  repeat,
  sequence,
  optional,
  choice,
  zeroOrMore,
  terminal,
  TerminalElt
} = flow;

const {
  G6Visitor,
  UIDVisitor
} = diagram;

const visitor = new G6Visitor();
const uidvisitor = new UIDVisitor();

function main(): void {
  const commands = new CommandRegistry();
  createMenu(commands);
  let bar = createBarWidget(commands);
  let palette = createPalette(commands);
  let main = createMainWidget(palette,commands);

  Widget.attach(bar, document.body);
  Widget.attach(main, document.body);

}

function createMainWidget(palette:any,commands:any){
  const g6graph: G6GraphWidget = new G6GraphWidget();

  const cmSource: CodeMirrorWidget = new CodeMirrorWidget({
    mode: 'text/typescript',
    lineNumbers: true,
    tabSize: 2,
  });
  
  cmSource.title.label = 'Flow EDITOR';
  cmSource.editor.on("changes",(instance: any) => {
    //if(DEBUG) 
    console.log('changes');
    try {
      // Update preview
      let content = instance.getDoc().getValue();
      let flowfunc = parseFlow(content);
      let flows = flowfunc(flow);
      // Convert flows to node data
      for (let key of flows.keys()) {
        let flow = uidvisitor.visit(flows.get(key));
        let value = visitor.visit(flow);
        flows.set(key,value);
        console.log(key)
      }
      // Update graph flows
      g6graph.flows = flows;

    } catch(e) {
      console.error(e.name + ': ' + e.message);
    }

  }); 

  cmSource.valueChanged.connect(
    function logger(sender: any, value: string): void {
      console.log("valueChanged");
      try {
          // Update preview
          let flowfunc = parseFlow(value);
          let flows = flowfunc(flow);
          // Convert flows to node data
          for (let key of flows.keys()) {
            let flow = uidvisitor.visit(flows.get(key));
            let value = visitor.visit(flow);
            flows.set(key,value);
            console.log(key)
          }
          // Update graph flows
          g6graph.flows = flows;

        } catch(e) {
          console.error(e.name + ': ' + e.message);
        }
    }
  );
  
  // set default samples
  cmSource.samples = samples;

  let dock = new DockPanel();

  dock.addWidget(cmSource);
  dock.addWidget(g6graph, { mode: 'split-right', ref: cmSource });

  dock.id = 'dock';

  let savedLayouts: DockPanel.ILayoutConfig[] = [];

  commands.addCommand('save-dock-layout', {
    label: 'Save Layout',
    caption: 'Save the current dock layout',
    execute: () => {
      savedLayouts.push(dock.saveLayout());
      palette.addItem({
        command: 'restore-dock-layout',
        category: 'Dock Layout',
        args: { index: savedLayouts.length - 1 }
      });
    }
  });

  commands.addCommand('restore-dock-layout', {
    label: (args:any) => {
      return `Restore Layout ${args.index as number}`;
    },
    execute: (args:any) => {
      dock.restoreLayout(savedLayouts[args.index as number]);
    }
  });

  palette.addItem({
    command: 'save-dock-layout',
    category: 'Dock Layout',
    rank: 0
  });

  BoxPanel.setStretch(dock, 1);

  let main = new BoxPanel({ direction: 'left-to-right', spacing: 0 });
  main.id = 'main';

  main.addWidget(dock);
  window.onresize = () => { main.update(); };
  return main;
}

window.onload = main;
