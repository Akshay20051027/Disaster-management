// Lightweight entrypoint so platforms that run `node server.js` from the repo root
// will start the backend located in ./backend/server.js
try {
  require('./backend/server');
} catch (err) {
  console.error('Failed to start backend from root server.js:', err);
  process.exit(1);
}
