export function parseBooleanParam(value: string | null): boolean | undefined {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return undefined;
}

export function parsePageParam(value: string | null): number {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return 1;
  }

  return parsedValue;
}

export function buildSearchParams(
  values: Record<string, string | number | boolean | undefined | null>
): URLSearchParams {
  const nextParams = new URLSearchParams();

  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '' || value === false) {
      return;
    }

    nextParams.set(key, String(value));
  });

  return nextParams;
}
