const express = require('express');
const path = require('path');

const app = express();
const PORT = 4005;

app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Bubo Hub Phase 5 running on port ${PORT}`);
});
