const attempts = new Map<string, number[]>();
const windowMs = 10 * 60 * 1000;
const maxAttempts = 5;

export function isInquiryRateLimited(ip: string) {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < windowMs,
  );
  if (recent.length >= maxAttempts) {
    attempts.set(ip, recent);
    return true;
  }
  recent.push(now);
  attempts.set(ip, recent);
  return false;
}
