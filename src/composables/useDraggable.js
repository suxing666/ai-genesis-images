import { onMounted, onBeforeUnmount } from 'vue';

export function useDraggable(btnRef, onClickCallback) {
  const DRAG_DELAY = 300;
  let pressTimer = null;
  let isDragReady = false;
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  function onStart(e) {
    const el = btnRef.value;
    if (!el) return;
    const touch = e.touches ? e.touches[0] : e;
    const rect = el.getBoundingClientRect();
    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;
    isDragReady = false;
    isDragging = false;

    pressTimer = setTimeout(() => {
      isDragReady = true;
      el.classList.add('dragging');
    }, DRAG_DELAY);
  }

  function onMove(e) {
    if (!isDragReady) return;
    const el = btnRef.value;
    if (!el) return;
    e.preventDefault();
    isDragging = true;
    const touch = e.touches ? e.touches[0] : e;
    const x = touch.clientX - offsetX;
    const y = touch.clientY - offsetY;

    const maxX = window.innerWidth - el.offsetWidth;
    const maxY = window.innerHeight - el.offsetHeight;
    const clampedX = Math.max(0, Math.min(x, maxX));
    const clampedY = Math.max(0, Math.min(y, maxY));

    el.style.left = clampedX + 'px';
    el.style.top = clampedY + 'px';
    el.style.right = 'auto';
    el.style.bottom = 'auto';
  }

  function onEnd() {
    const el = btnRef.value;
    clearTimeout(pressTimer);
    if (el) el.classList.remove('dragging');
    isDragReady = false;
    requestAnimationFrame(() => { isDragging = false; });
  }

  function onClick(e) {
    if (isDragging) {
      e.stopImmediatePropagation();
      return;
    }
    onClickCallback();
  }

  onMounted(() => {
    const el = btnRef.value;
    if (!el) return;

    el.addEventListener('mousedown', onStart);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);

    el.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);

    el.addEventListener('click', onClick);
  });

  onBeforeUnmount(() => {
    const el = btnRef.value;
    if (el) {
      el.removeEventListener('mousedown', onStart);
      el.removeEventListener('click', onClick);
    }
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onEnd);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onEnd);
  });
}
