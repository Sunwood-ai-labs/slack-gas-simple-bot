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
      const threadTs = payload.event.thread_ts || payload.event.ts; // スレッドのタイムスタンプを取得

      const response = processMessage(text);

      // メンションを追加
      const messageData = {
        ...response,
        text: (response.text ? '<@' + userId + '> ' + response.text : '<@' + userId + '>')
      };

      sendMessage(channelId, messageData, threadTs);
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
  'hello': () => ({ text: 'Hello!' }),
  'hi': () => ({ text: 'Hello!' }), // 'hello' と同じレスポンス
  'help': () => createHelpMessage(),
  'time': () => createTimeMessage(),
};

// おしゃれなHelp表示
function createHelpMessage() {
  return {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🤖 Available Commands',
          emoji: true
        }
      },
      {
        type: 'divider'
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*👋 hello / hi*\n挨拶を返します'
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*❓ help*\n利用可能なコマンドを表示します'
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*🕐 time*\n現在の時刻を表示します'
        }
      },
      {
        type: 'divider'
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: '💡 _Tip: メンション付きでコマンドを送信してください_'
          }
        ]
      }
    ]
  };
}

// おしゃれな時間表示
function createTimeMessage() {
  const now = new Date();
  const formatter = Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy年MM月dd日 HH:mm:ss');
  const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][now.getDay()];

  return {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🕐 Current Time',
          emoji: true
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*日時:*\n${formatter} (${dayOfWeek})`
          },
          {
            type: 'mrkdwn',
            text: `*タイムゾーン:*\nAsia/Tokyo (JST)`
          }
        ]
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `⏰ Unix Timestamp: \`${now.getTime()}\``
          }
        ]
      }
    ]
  };
}

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
  return { text: cleanText };
}

function sendMessage(channelId, messageData, threadTs) {
  const url = 'https://slack.com/api/chat.postMessage';

  // メッセージデータの構築
  const payload = {
    channel: channelId,
    thread_ts: threadTs, // スレッドのタイムスタンプを追加
  };

  // messageDataがオブジェクトの場合、そのプロパティをマージ
  if (typeof messageData === 'object' && messageData !== null) {
    Object.assign(payload, messageData);
  } else {
    // 文字列の場合はtextとして設定
    payload.text = messageData;
  }

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
