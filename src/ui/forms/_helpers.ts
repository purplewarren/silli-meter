// Tiny DOM and utility helpers for forms
export function el<K extends keyof HTMLElementTagNameMap>(tag: K, opts?: { className?: string; id?: string; text?: string }): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (opts) {
    if (opts.className) e.className = opts.className;
    if (opts.id) e.id = opts.id;
    if (opts.text) e.textContent = opts.text;
  }
  return e;
}

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function withCounter(textarea: HTMLTextAreaElement, max: number, counterEl: HTMLElement): void {
  function update() {
    const len = textarea.value.length;
    counterEl.textContent = `${len}/${max}`;
    if (len > max) textarea.value = textarea.value.slice(0, max);
  }
  textarea.addEventListener('input', update);
  update();
}

export function checkboxGroupValues(root: HTMLElement, selector: string): string[] {
  return Array.from(root.querySelectorAll<HTMLInputElement>(selector))
    .filter(cb => cb.checked)
    .map(cb => cb.value);
}