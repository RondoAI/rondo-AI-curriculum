/* =================================================================
   SLIDE HINT, JS helper
   -----------------------------------------------------------------
   Apply to any horizontally-scrolling element so the page surfaces
   a "▸ swipe left" cue. The cue itself is pure CSS in
   style/components/slide-hint.css, this module just sets the
   data attribute and toggles the at-end class as the user scrolls.

   Usage:
     import { applySlideHint } from '../lib/slide-hint.js';
     applySlideHint(el);

   Returns a teardown function for clean unmounting.
   ================================================================= */

/**
 * Attach the "more →" cue to a horizontally-scrolling element.
 * The cue auto-hides when the element is scrolled to its right
 * edge AND when there is nothing to scroll (clientWidth >=
 * scrollWidth). Reacts to both user scroll and content resize.
 *
 * @param {HTMLElement} el  the scrollable element
 * @returns {() => void}    teardown
 */
export function applySlideHint(el){
  if (!el) return () => {};
  el.setAttribute('data-slide-hint', '');

  const update = () => {
    /* nothing to scroll, hide the cue */
    if (el.scrollWidth <= el.clientWidth + 1){
      el.classList.add('slide-hint--at-end');
      return;
    }
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    el.classList.toggle('slide-hint--at-end', atEnd);
  };

  el.addEventListener('scroll', update, { passive: true });

  /* Re-evaluate when content size changes (font load, new items
     rendered, viewport resize). ResizeObserver fires once on init
     too, so the initial state is set without an extra rAF. */
  let ro = null;
  if (typeof ResizeObserver !== 'undefined'){
    ro = new ResizeObserver(update);
    ro.observe(el);
    /* observe the first child too so intrinsic content changes
       trigger an update even if the container's box is stable */
    if (el.firstElementChild) ro.observe(el.firstElementChild);
  } else {
    window.addEventListener('resize', update);
    requestAnimationFrame(update);
  }

  return function teardown(){
    el.removeEventListener('scroll', update);
    if (ro) ro.disconnect();
    else window.removeEventListener('resize', update);
    el.removeAttribute('data-slide-hint');
    el.classList.remove('slide-hint--at-end');
  };
}
