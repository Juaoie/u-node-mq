export function sendMessage(currentWindow: Window, message: any, targetOrigin: string, transfer?: Transferable[]) {
  currentWindow.postMessage(message, targetOrigin, transfer);
}
