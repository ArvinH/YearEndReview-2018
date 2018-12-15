const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
const CalendarMapCount = {};
const CalendarMapData = {};
const CalendarColorIdMap = {
  3: 'English',
  5: 'Entertainment',
  6: 'Sick-rehabilitation',
  7: 'HackDay',
  10: 'Exercise',
  11: 'Training',
  default: 'Work'
};

const YEAR = '2017';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
  authorize(JSON.parse(content), listEvents);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth, pageToken) {
  const calendar = google.calendar({version: 'v3', auth});
  const queryOptions = {
    auth: auth,
    calendarId: 'primary',
    timeMax: (new Date()).toISOString(),
    singleEvents: true,
    orderBy: 'startTime'
  };
  if (pageToken) {
    queryOptions.pageToken = pageToken;
  }
  calendar.events.list(queryOptions, function (err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    const resData = response.data || {};
    const events = resData.items;
    if (events.length == 0) {
      console.log('No upcoming events found.');
    } else {
      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const start = event.start.date || event.start.dateTime;
        const dateString = start.split('T')[0];
        const colorId = event.colorId || 'default';
        CalendarMapCount[colorId] = CalendarMapCount[colorId] || {};
        CalendarMapData[colorId] = CalendarMapData[colorId] || {};
        CalendarMapCount[colorId][dateString] = (CalendarMapCount[colorId][dateString] || 0) + 1;
        CalendarMapData[colorId][dateString] = event.summary;
      }
      if (!resData.nextSyncToken && !!resData.nextPageToken) {
        // means we have more data, query again!
        return listEvents(auth, resData.nextPageToken);
      }
      const headerColors = Object.keys(CalendarMapCount);
      const categoryDataArray = [];
      headerColors.forEach((colorId) => {
        const headerDate = Object.keys(CalendarMapCount[colorId]);
        const resultDataArray = [];
        // fetch JS file
        headerDate.forEach((date) => {
          resultDataArray.push({
            day: date,
            value: CalendarMapCount[colorId][date],
            // summary: CalendarMapData[colorId][date],
            category: CalendarColorIdMap[colorId]
          });
        });
        const categorySummary = resultDataArray
          .filter(data => data.day.split('-')[0] === YEAR)
          .reduce((acc, data) => {
            acc.id = data.category;
            acc.label = data.category;
            acc.value = (acc.value || 0) + data.value;
            return acc;
          }, {});
        // write data to separate js file by category for Calendar DataViz
        fs.appendFile(`calendarData-${CalendarColorIdMap[colorId]}.js`, `module.exports = ${JSON.stringify(resultDataArray, null, 2)}`, 'utf8', (err) => {
          if (err) throw err;
        });
        if (Object.keys(categorySummary).length) {
          categoryDataArray.push(categorySummary);
        }
      });
      // write data to a single js file for Waffle DataViz
      // calculate the percentage
      /*
      const sumValue = categoryDataArray.reduce((acc, data) => {
        return acc + data.value;
      }, 0);
      categoryDataArray.forEach(data => {
        data.value = (data.value / sumValue).toFixed(2) * 100;
      });
      fs.appendFile(`calendarData-Waffle-${YEAR}.js`, `export default ${JSON.stringify(categoryDataArray, null, 2)}`, 'utf8', (err) => {
        if (err) throw err;
      });
      */
      return;
    }
  });
}