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

// コマンドをオブジェクトとして定義
const commands = {
  'hello': () => 'Hello!',
  'hi': () => 'Hello!', // 'hello' と同じレスポンス
  'help': () => 'Available commands: hello, help, time',
  'time': () => 'Current time is: ' + new Date(),
};

function processMessage(text) {
  // 1. 最初にメンションを除去
  const cleanText = text.replace(/<@[A-Z0-9]+>/g, '').trim();
  const lowerText = cleanText.toLowerCase();

  // 2. コマンドオブジェクトをループしてキーワードをチェック
  for (const keyword of Object.keys(commands)) {
    if (lowerText.includes(keyword)) {
      return commands[keyword]();
    }
  }

  // 3. 一致するコマンドがなければ、クリーンなテキストをオウム返し
  return cleanText;
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
