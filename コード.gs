// Slack Bot - Google Apps Script

// プロパティから値を読み込む
const props = PropertiesService.getScriptProperties();
const SLACK_BOT_TOKEN = props.getProperty('SLACK_BOT_TOKEN');
const WEBHOOK_SECRET  = props.getProperty('WEBHOOK_SECRET'); // 署名検証で使う予定

function doPost(e) {
  try {
    const body = e.postData.contents;
    const payload = JSON.parse(body);

    // （任意だけど本当はやった方がいい）署名検証にWEBHOOK_SECRETを使う

    // URL verification
    if (payload.type === 'url_verification') {
      return ContentService.createTextOutput(payload.challenge);
    }

    // app_mention に反応
    if (payload.event && payload.event.type === 'app_mention') {
      const userId   = payload.event.user;
      const channelId = payload.event.channel;
      const text     = payload.event.text;

      const response = processMessage(text);
      sendMessage(channelId, '<@' + userId + '> ' + response);
    }

    return ContentService.createTextOutput('ok');
  } catch (error) {
    console.error('doPost error:', error.toString());
    return ContentService
      .createTextOutput('error: ' + error.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

function processMessage(text) {
  const lowerText = text.toLowerCase();

  if (lowerText.includes('hello') || lowerText.includes('hi')) {
    return 'Hello!';
  } else if (lowerText.includes('help')) {
    return 'Available commands: hello, help, time';
  } else if (lowerText.includes('time')) {
    return 'Current time is: ' + new Date();
  }

  return 'Sorry, I do not understand that command.';
}

function sendMessage(channelId, message) {
  const url = 'https://slack.com/api/chat.postMessage';

  const payload = {
    channel: channelId,
    text: message,
  };

  const options = {
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + SLACK_BOT_TOKEN,
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(url, options);
  console.log(response.getContentText());
}
