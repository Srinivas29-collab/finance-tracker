const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Home route working');
});

app.get('/test', (req, res) => {
  res.send('Test route working');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});