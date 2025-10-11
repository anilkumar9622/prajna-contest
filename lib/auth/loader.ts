// lib/loaderManager.ts
let setLoadingFn: ((loading: boolean) => void) | null = null;

export const registerLoader = (fn: (loading: boolean) => void) => {
  setLoadingFn = fn;
};

export const startLoading = () => setLoadingFn?.(true);
export const stopLoading = () => setLoadingFn?.(false);
