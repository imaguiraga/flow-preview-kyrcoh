import G6 from "@antv/g6";
import {ICONFONTNODE_CONFIG} from "./iconfont-node-config.js";
import { 
  NODE_FN, 
  EDGE_FN,
  NODE_OPTIONS, 
  CUSTOM_NODE_TYPE,
  DEFAULT_NODE, 
  DEFAULT_EDGE 
} from "./flow-g6-node-config.js";

import { VanillaDagreLayoutOpts } from './dagre-layout';
G6.registerLayout('dagre', VanillaDagreLayoutOpts);

G6.registerNode('iconfont',ICONFONTNODE_CONFIG);
G6.registerNode(
  CUSTOM_NODE_TYPE, NODE_OPTIONS, "single-node"
);

G6.Global.nodeStateStyle.selected = {
  stroke: "#d9d9d9",
  fill: "#5394ef"
};

/**
 * Create a Code.
 * @param {object} _container_ - The container.
 * @param {number} _width_ - The content.
 * @param {number} _height_ - The mode.
 * @return {object} The G6Graph object.
 */
export function createFlowDiagram(_container_,_width_,_height_){
  let containerElt = (typeof _container_ === "string") ? document.getElementById(_container_) : _container_;

  const width = _width_ || containerElt.scrollWidth || 800;
  const height = _height_ || containerElt.scrollHeight || 800;

  const graphOptions = {
    container: containerElt,
    width,
    height,
    layout: {
      type: "dagre",
      nodesepFunc: (n) => {
        return 40;
      },
      ranksepFunc: (n) => {
        return 60;
      },
      controlPoints: true
    },
    defaultNode: DEFAULT_NODE,
    defaultEdge: DEFAULT_EDGE,
    modes: {
      default: [
        "drag-canvas", {
          type: "zoom-canvas",
          minZoom: 0.002,
          maxZoom: 20
        }, 
        "drag-node"
      ]
    },
    fitView: true,
    minZoom: 0.002,
    maxZoom: 20
  };

// Override node default config based on node.tagName
  const graph = new G6.Graph(graphOptions);
  graph.node(NODE_FN);
  graph.edge(EDGE_FN);

  // Instantiate the Minimap plugin
  const minimap = new G6.Minimap();
  graph.addPlugin(minimap);
  graph.fitView(40);
  
  return graph;
}
