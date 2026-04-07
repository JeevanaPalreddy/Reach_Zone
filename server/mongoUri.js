/**
 * Builds a safe MongoDB Atlas URI. Passwords with @, #, etc. must not be
 * pasted raw into mongodb+srv://user:PASSWORD@host — the @ in the password
 * breaks parsing. Prefer MONGO_USER + MONGO_PASSWORD + MONGO_HOST, or
 * URL-encode the password in MONGO_URI (%40 for @).
 */
function getMongoUri() {
  const user = process.env.MONGO_USER;
  const password = process.env.MONGO_PASSWORD;
  const host = process.env.MONGO_HOST;

  if (user && password && host) {
    const u = encodeURIComponent(user);
    const p = encodeURIComponent(password);
    const appName = process.env.MONGO_APP_NAME || 'Cluster0';
    return `mongodb+srv://${u}:${p}@${host}/?retryWrites=true&w=majority&appName=${encodeURIComponent(appName)}`;
  }

  const uri = process.env.MONGO_URI;
  if (uri) return uri;

  throw new Error(
    'MongoDB: set MONGO_USER, MONGO_PASSWORD, and MONGO_HOST (recommended), or set MONGO_URI with a URL-encoded password.'
  );
}

module.exports = { getMongoUri };
