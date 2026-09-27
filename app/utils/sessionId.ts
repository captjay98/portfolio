// One browser = one session: a random UUID cached in localStorage.
//
// The previous scheme hashed navigator.userAgent + screen data and truncated
// the base64 to 32 chars — but the first 32 base64 chars encode only the UA
// prefix, so every visitor with a similar user agent shared one id. Those
// legacy ids are kept out of v2 metrics via the visitors.scheme column, and
// any old id still sitting in a visitor's localStorage is replaced here.
const SESSION_KEY = "visitor_session_id";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const getOrCreateSessionId = (): string => {
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing && UUID_RE.test(existing)) {
    return existing;
  }

  const id = crypto.randomUUID();
  localStorage.setItem(SESSION_KEY, id);
  return id;
};
