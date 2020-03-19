import {
    TerminalResource,
    CompositeResource
} from './base/resource-base.js';

const FLOW_RESOURCE_TYPE = "flow";
/**
 * Class TerminalFlowElt.
 */
export class TerminalFlowElt extends TerminalResource{

  /**
   * Create a TerminalFlowElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   * @param {string} tagName - The tagName value.
   */
  constructor(elts,ctx,tagName) {
    super(elts,ctx,tagName,FLOW_RESOURCE_TYPE);
  }

}

export function terminal(elt) {
  return new TerminalFlowElt(elt);
}

/**
 * Class CompositeFlowElt.
 * @extends CompositeResource
 */
export class CompositeFlowElt extends CompositeResource {
  /**
   * Create a CompositeFlowElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   * @param {string} tagName - The tagName value.
   */
  constructor(elts,ctx,tagName) {
    super(elts,ctx,tagName,FLOW_RESOURCE_TYPE);
  }
}