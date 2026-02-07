export async function register() {
  // Node.js 20+ "Happy Eyeballs" algorithm gives each address family only
  // 250ms before moving on. Neon endpoints resolve to both IPv4 and IPv6,
  // and if IPv6 is slow/broken the connection fails with AggregateError
  // ETIMEDOUT before pg's connectionTimeoutMillis ever kicks in.
  // See: https://github.com/nodejs/node/issues/54359
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const net = await import("net");
    net.setDefaultAutoSelectFamilyAttemptTimeout(10000);
  }
}
