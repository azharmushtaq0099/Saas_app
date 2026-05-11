export const MOCK_SESSION_COOKIE = "mock_session";
export const MOCK_SESSION_VALUE = "1";

export const MOCK_PRO_COOKIE = "mock_pro";
export const MOCK_PRO_VALUE = "1";

export const MOCK_USAGE_COOKIE = "mock_usage";

export function isMockSessionCookie(value: string | undefined) {
  return value === MOCK_SESSION_VALUE;
}

export function isMockProCookie(value: string | undefined) {
  return value === MOCK_PRO_VALUE;
}
