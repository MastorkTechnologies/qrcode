const { google } = require('googleapis');

// Load the key file from the path
const key = require('./divine-tempo-403606-938bc92213c1.json'); // Replace with your service account key file

const viewId = '296878408'; // Replace with your Google Analytics View ID

async function getAnalyticsData() {
  const jwtClient = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key,
    ['https://www.googleapis.com/auth/analytics.readonly']
  );

  try {
    await jwtClient.authorize();

    const analyticsreporting = google.analyticsreporting({ version: 'v4', auth: jwtClient });

    const response = await analyticsreporting.reports.batchGet({
      requestBody: {
        reportRequests: [
          {
            viewId,
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            metrics: [{ expression: 'ga:sessions' }],
          },
        ],
      },
    });

    const visitCount = response.data.reports[0].data.rows[0].metrics[0].values[0];
    return visitCount;
  } catch (err) {
    console.error('Error retrieving analytics data:', err);
    return null;
  }
}

module.exports = { getAnalyticsData };
