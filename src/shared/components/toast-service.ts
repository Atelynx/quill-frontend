export type ToastType = 'success' | 'error';

type ShowToastHandler = (message: string, type?: ToastType) => void;

let showToastHandler: ShowToastHandler | null = null;

export function setShowToastHandler(handler: ShowToastHandler | null) {
  showToastHandler = handler;
}

export function showToast(message: string, type: ToastType = 'success') {
  showToastHandler?.(message, type);
}
