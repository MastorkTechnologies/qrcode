const express = require('express');
const { getAnalyticsData } = require('./GoogleApi'); // Import your server-side module containing getAnalyticsData

const app = express();

app.get('/analyticsData', async (req, res) => {
  const visitCount = await getAnalyticsData();
  res.json({ visitCount });
});

// Other server configurations...

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
