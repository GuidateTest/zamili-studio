/** Shared Cursor API key helpers — Node scripts only */

export const isPlaceholderKey = (key) =>
  !key ||
  key.includes("your_") ||
  key.includes("_here") ||
  key === "sk-" ||
  key.trim().length < 12;

export const isAuthError = (message) =>
  /invalid.*(user\s*)?api\s*key|unauthorized|401|403|authentication failed|invalid api key/i.test(
    message,
  );

export const validateCursorKey = (key) => {
  if (isPlaceholderKey(key)) {
    return { valid: false, reason: "missing_or_placeholder" };
  }
  if (key.length < 20) {
    return { valid: false, reason: "too_short" };
  }
  return { valid: true, reason: null };
};

/** Live check against Cursor API — returns true/false, null if unreachable */
export const verifyCursorKey = async (key) => {
  const trimmed = key?.trim();
  if (!validateCursorKey(trimmed).valid) return false;

  const auth = `Basic ${Buffer.from(`${trimmed}:`).toString("base64")}`;
  try {
    const res = await fetch("https://api.cursor.com/v1/me", {
      headers: { Authorization: auth },
      signal: AbortSignal.timeout(8000),
    });
    if (res.status === 401 || res.status === 403) return false;
    return res.ok;
  } catch {
    return null;
  }
};

let verifyCache = { at: 0, valid: null };

export const verifyCursorKeyCached = async (key) => {
  const now = Date.now();
  if (now - verifyCache.at < 60_000 && verifyCache.valid !== null) {
    return verifyCache.valid;
  }
  const valid = await verifyCursorKey(key);
  verifyCache = { at: now, valid };
  return valid;
};

export const clearCursorKeyCache = () => {
  verifyCache = { at: 0, valid: null };
};
