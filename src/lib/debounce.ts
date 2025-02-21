export function __debounce<F extends (...args: any[]) => any>(
  func: F,
  wait: number
) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debouncedFn = (...args: Parameters<F>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };

  debouncedFn.cancel = () => {
    if (timeout) clearTimeout(timeout);
    timeout = null;
  };

  return debouncedFn;
}
