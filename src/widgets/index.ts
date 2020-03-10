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

function createMenu(commands:any): Menu {
  let sub1 = new Menu({ commands });
  sub1.title.label = 'More...';
  sub1.title.mnemonic = 0;
  sub1.addItem({ command: 'example:one' });
  sub1.addItem({ command: 'example:two' });
  sub1.addItem({ command: 'example:three' });
  sub1.addItem({ command: 'example:four' });

  let sub2 = new Menu({ commands });
  sub2.title.label = 'More...';
  sub2.title.mnemonic = 0;
  sub2.addItem({ command: 'example:one' });
  sub2.addItem({ command: 'example:two' });
  sub2.addItem({ command: 'example:three' });
  sub2.addItem({ command: 'example:four' });
  sub2.addItem({ type: 'submenu', submenu: sub1 });

  let root = new Menu({ commands });
  root.addItem({ command: 'example:copy' });
  root.addItem({ command: 'example:cut' });
  root.addItem({ command: 'example:paste' });
  root.addItem({ type: 'separator' });
  root.addItem({ command: 'example:new-tab' });
  root.addItem({ command: 'example:close-tab' });
  root.addItem({ command: 'example:save-on-exit' });
  root.addItem({ type: 'separator' });
  root.addItem({ command: 'example:open-task-manager' });
  root.addItem({ type: 'separator' });
  root.addItem({ type: 'submenu', submenu: sub2 });
  root.addItem({ type: 'separator' });
  root.addItem({ command: 'example:close' });

  return root;
}

function createPalette(commands:any){
  let palette = new CommandPalette({ commands });
  palette.addItem({ command: 'example:cut', category: 'Edit' });
  palette.addItem({ command: 'example:copy', category: 'Edit' });
  palette.addItem({ command: 'example:paste', category: 'Edit' });
  palette.addItem({ command: 'example:one', category: 'Number' });
  palette.addItem({ command: 'example:two', category: 'Number' });
  palette.addItem({ command: 'example:three', category: 'Number' });
  palette.addItem({ command: 'example:four', category: 'Number' });
  palette.addItem({ command: 'example:black', category: 'Number' });
  palette.addItem({ command: 'example:new-tab', category: 'File' });
  palette.addItem({ command: 'example:close-tab', category: 'File' });
  palette.addItem({ command: 'example:save-on-exit', category: 'File' });
  palette.addItem({ command: 'example:open-task-manager', category: 'File' });
  palette.addItem({ command: 'example:close', category: 'File' });
  palette.addItem({ command: 'example:clear-cell', category: 'Notebook Cell Operations' });
  palette.addItem({ command: 'example:cut-cells', category: 'Notebook Cell Operations' });
  palette.addItem({ command: 'example:run-cell', category: 'Notebook Cell Operations' });
  palette.addItem({ command: 'example:cell-test', category: 'Console' });
  palette.addItem({ command: 'notebook:new', category: 'Notebook' });
  palette.id = 'palette';

  return palette;
}

function createBarWidget(commands:any){
   
  commands.addCommand('example:cut', {
    label: 'Cut',
    mnemonic: 1,
    iconClass: 'fa fa-cut',
    execute: () => {
      console.log('Cut');
    }
  });

  commands.addCommand('example:copy', {
    label: 'Copy File',
    mnemonic: 0,
    iconClass: 'fa fa-copy',
    execute: () => {
      console.log('Copy');
    }
  });

  commands.addCommand('example:paste', {
    label: 'Paste',
    mnemonic: 0,
    iconClass: 'fa fa-paste',
    execute: () => {
      console.log('Paste');
    }
  });

  commands.addCommand('example:new-tab', {
    label: 'New Tab',
    mnemonic: 0,
    caption: 'Open a new tab',
    execute: () => {
      console.log('New Tab');
    }
  });

  commands.addCommand('example:close-tab', {
    label: 'Close Tab',
    mnemonic: 2,
    caption: 'Close the current tab',
    execute: () => {
      console.log('Close Tab');
    }
  });

  commands.addCommand('example:save-on-exit', {
    label: 'Save on Exit',
    mnemonic: 0,
    caption: 'Toggle the save on exit flag',
    execute: () => {
      console.log('Save on Exit');
    }
  });

  commands.addCommand('example:open-task-manager', {
    label: 'Task Manager',
    mnemonic: 5,
    isEnabled: () => false,
    execute: () => { }
  });

  commands.addCommand('example:close', {
    label: 'Close',
    mnemonic: 0,
    iconClass: 'fa fa-close',
    execute: () => {
      console.log('Close');
    }
  });

  commands.addCommand('example:one', {
    label: 'One',
    execute: () => {
      console.log('One');
    }
  });

  commands.addCommand('example:two', {
    label: 'Two',
    execute: () => {
      console.log('Two');
    }
  });

  commands.addCommand('example:three', {
    label: 'Three',
    execute: () => {
      console.log('Three');
    }
  });

  commands.addCommand('example:four', {
    label: 'Four',
    execute: () => {
      console.log('Four');
    }
  });

  commands.addCommand('example:black', {
    label: 'Black',
    execute: () => {
      console.log('Black');
    }
  });

  commands.addCommand('example:clear-cell', {
    label: 'Clear Cell',
    execute: () => {
      console.log('Clear Cell');
    }
  });

  commands.addCommand('example:cut-cells', {
    label: 'Cut Cell(s)',
    execute: () => {
      console.log('Cut Cell(s)');
    }
  });

  commands.addCommand('example:run-cell', {
    label: 'Run Cell',
    execute: () => {
      console.log('Run Cell');
    }
  });

  commands.addCommand('example:cell-test', {
    label: 'Cell Test',
    execute: () => {
      console.log('Cell Test');
    }
  });

  commands.addCommand('notebook:new', {
    label: 'New Notebook',
    execute: () => {
      console.log('New Notebook');
    }
  });

  commands.addKeyBinding({
    keys: ['Accel X'],
    selector: 'body',
    command: 'example:cut'
  });

  commands.addKeyBinding({
    keys: ['Accel C'],
    selector: 'body',
    command: 'example:copy'
  });

  commands.addKeyBinding({
    keys: ['Accel V'],
    selector: 'body',
    command: 'example:paste'
  });

  commands.addKeyBinding({
    keys: ['Accel J', 'Accel J'],
    selector: 'body',
    command: 'example:new-tab'
  });

  commands.addKeyBinding({
    keys: ['Accel M'],
    selector: 'body',
    command: 'example:open-task-manager'
  });

  let menu1 = createMenu(commands);
  menu1.title.label = 'File';
  menu1.title.mnemonic = 0;

  let menu2 = createMenu(commands);
  menu2.title.label = 'Edit';
  menu2.title.mnemonic = 0;

  let menu3 = createMenu(commands);
  menu3.title.label = 'View';
  menu3.title.mnemonic = 0;

  let bar = new MenuBar();
  bar.addMenu(menu1);
  bar.addMenu(menu2);
  bar.addMenu(menu3);
  bar.id = 'menuBar';

  let contextMenu = new ContextMenu({ commands });

  document.addEventListener('contextmenu', (event: MouseEvent) => {
    if (contextMenu.open(event)) {
      event.preventDefault();
    }
  });

  contextMenu.addItem({ command: 'example:cut', selector: '.content' });
  contextMenu.addItem({ command: 'example:copy', selector: '.content' });
  contextMenu.addItem({ command: 'example:paste', selector: '.content' });

  contextMenu.addItem({ command: 'example:one', selector: '.lm-CommandPalette' });
  contextMenu.addItem({ command: 'example:two', selector: '.lm-CommandPalette' });
  contextMenu.addItem({ command: 'example:three', selector: '.lm-CommandPalette' });
  contextMenu.addItem({ command: 'example:four', selector: '.lm-CommandPalette' });
  contextMenu.addItem({ command: 'example:black', selector: '.lm-CommandPalette' });

  contextMenu.addItem({ command: 'notebook:new', selector: '.lm-CommandPalette-input' });
  contextMenu.addItem({ command: 'example:save-on-exit', selector: '.lm-CommandPalette-input' });
  contextMenu.addItem({ command: 'example:open-task-manager', selector: '.lm-CommandPalette-input' });
  contextMenu.addItem({ type: 'separator', selector: '.lm-CommandPalette-input' });

  document.addEventListener('keydown', (event: KeyboardEvent) => {
    commands.processKeydownEvent(event);
  });
  return bar;
 }
window.onload = main;
