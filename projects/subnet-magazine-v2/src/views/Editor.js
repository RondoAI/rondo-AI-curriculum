/* =================================================================
   EDITOR VIEW
   -----------------------------------------------------------------
   The standalone "about the editor" page. Renders nothing into the
   passed root — the bio markup is already in editor.html. This
   view's job is to mount the PS5-grade NodeSphere plexus into the
   data-canvas="editor" element on the page so the editor's portrait
   sits next to a working live mark.

   Lives on its own page so heavy canvas + fixed-position chrome
   never compete on the home view's compositor budget.
   ================================================================= */

import { qs } from '../lib/dom.js';
import { NodeSphere } from '../charts/NodeSphere.js';

/**
 * @param {HTMLElement} root
 * @returns {{destroy: () => void}}
 */
export function mountEditor(root){
  const canvas = qs('[data-canvas="editor"]', root);
  /* Dense plexus tuned a step richer than the hero so the mark
     reads as a centerpiece, not a background — same engine as the
     hero / brand mark, but with more nodes, a deeper neighbour
     mesh, and the atmospheric glow halo turned on. */
  const sphere = canvas ? new NodeSphere(canvas, {
    nodes:   96,
    K:       4,
    density: 0.52,
    speed:   0.26,
    atmos:   true,
  }) : null;

  return {
    destroy(){
      sphere?.destroy();
    }
  };
}
