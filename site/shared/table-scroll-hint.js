export function initializeTableScrollHints() {
  for (const table of document.querySelectorAll('table')) {
    const wrapper = table.parentElement;
    if (!['auto', 'scroll'].includes(getComputedStyle(wrapper).overflowX)) continue;
    const update = () => {
      const scrollable = wrapper.scrollWidth > wrapper.clientWidth + 2;
      wrapper.toggleAttribute('data-table-scroll-hint', scrollable);
      if (scrollable && !wrapper.hasAttribute('tabindex')) wrapper.tabIndex = 0;
    };
    new ResizeObserver(update).observe(wrapper);
    update();
  }
}
initializeTableScrollHints();
