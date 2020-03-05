import * as diagram from "../preview/flow-diagram";
import {
  CommandRegistry
} from '@lumino/commands';

import {
  Message
} from '@lumino/messaging';

import {
  BoxPanel, CommandPalette, ContextMenu, DockPanel, Menu, MenuBar, Widget
} from '@lumino/widgets';

/**
 * A widget which hosts a G6 Graph renderer.
 */
export default class G6GraphWidget extends Widget {

  constructor(config?: any) {
    super();
    this._graph = diagram.createFlowGraph(this.node);
  }

  get graph(): any {
    return this._graph;
  }

  loadTarget(target: string): void {
    this._graph.data(target);
    this._graph.render();

  }

  protected onAfterAttach(msg: Message): void {
    this._graph.refresh();
  }

  protected onResize(msg: Widget.ResizeMessage): void {
    if (msg.width < 0 || msg.height < 0) {
      this._graph.refresh();
    } else {
      this._graph.setSize(msg.width, msg.height);
    }
  }

  private _graph: any;
}