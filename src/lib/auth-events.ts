const unauthorizedEventName = 'fnr:unauthorized';

export function emitUnauthorized(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event(unauthorizedEventName));
}

export function subscribeToUnauthorized(handler: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  window.addEventListener(unauthorizedEventName, handler);

  return () => {
    window.removeEventListener(unauthorizedEventName, handler);
  };
}
