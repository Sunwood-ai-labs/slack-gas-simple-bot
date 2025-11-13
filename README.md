<div align="center">

![](Whisk_8e08477062d01b09a5d49509d124cd89dr.jpeg)

# 🤖 Slack GAS Simple Bot

**Google Apps ScriptでシンプルなSlackボットを構築**

<p align="center">
  <img src="https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Apps Script">
  <img src="https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white" alt="Slack">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
</p>

</div>

---

## 📋 概要

`slack-gas-simple-bot` は、Google Apps Script (GAS) を使用して構築されたシンプルなSlackボットです。Slack Events APIと連携し、メンション（`@bot_name`）に反応して基本的なコマンドを処理します。

サーバーレスで動作し、Googleのインフラストラクチャ上でホストされるため、独自のサーバーを管理する必要がありません。

## ✨ 特徴

- 🚀 **サーバーレス**: Google Apps Scriptで動作するため、サーバー管理不要
- 💬 **メンション対応**: Slackワークスペース内でボットにメンションすると反応
- 🎯 **シンプルなコマンド**: hello, help, timeなどの基本コマンドをサポート
- 🔄 **オウム返し機能**: キーワード以外のメッセージをそのまま返す
- 🔐 **セキュアな設定**: スクリプトプロパティを使用したトークン管理
- ⚡ **簡単デプロイ**: GASのWebアプリとして簡単にデプロイ可能

## 🛠️ 技術スタック

| 技術 | 用途 |
|------|------|
| Google Apps Script | バックエンドロジック |
| Slack Events API | Slackとの連携 |
| Slack Bot Token | API認証 |

## 📦 インストール手順

### 1. Google Apps Scriptプロジェクトの作成

1. [Google Apps Script](https://script.google.com/) にアクセス
2. 「新しいプロジェクト」をクリック
3. プロジェクト名を `slack-gas-simple-bot` に設定

### 2. コードの配置

1. `code.gs` ファイルにこのリポジトリの `code.gs` の内容をコピー
2. `appsscript.json` の設定を確認・適用

### 3. Slack Appの作成と設定

#### 3.1 Slack Appの作成

1. [Slack API](https://api.slack.com/apps) にアクセス
2. 「Create New App」→「From scratch」を選択
3. App名とワークスペースを指定して作成

#### 3.2 Bot Token Scopesの設定

「OAuth & Permissions」ページで以下のスコープを追加：

- `app_mentions:read` - メンションを読み取る
- `chat:write` - メッセージを送信する

#### 3.3 Bot Tokenの取得

1. 「OAuth & Permissions」ページで「Install to Workspace」をクリック
2. 承認後、`Bot User OAuth Token`（`xoxb-` で始まる）をコピー

### 4. GASでWebアプリをデプロイ

1. GASエディタで「デプロイ」→「新しいデプロイ」を選択
2. 「種類の選択」で「ウェブアプリ」を選択
3. 以下の設定を行う：
   - **説明**: 任意の説明（例: "v1.0"）
   - **実行ユーザー**: 自分
   - **アクセスできるユーザー**: 全員
4. 「デプロイ」をクリックし、**ウェブアプリのURL**をコピー

### 5. GASのスクリプトプロパティを設定

1. GASエディタで「プロジェクトの設定」（⚙アイコン）をクリック
2. 「スクリプト プロパティ」タブで以下を追加：

| プロパティ名 | 値 |
|-------------|-----|
| `SLACK_BOT_TOKEN` | `xoxb-` で始まるBot User OAuth Token |
| `WEBHOOK_SECRET` | （任意）署名検証用のSigning Secret |

### 6. Slack Event Subscriptionsの設定

1. Slack Appの設定ページで「Event Subscriptions」を開く
2. 「Enable Events」をオンにする
3. **Request URL**にGASのウェブアプリURLを入力
4. URL検証が成功したら、「Subscribe to bot events」で以下を追加：
   - `app_mention` - ボットがメンションされたとき
5. 「Save Changes」をクリック

### 7. ワークスペースへのインストール

変更を保存した後、必要に応じてSlack Appをワークスペースに再インストールします。

## 🚀 使用方法

Slackワークスペース内で、ボットをメンションして以下のようにメッセージを送信します：

```
@bot_name hello
@bot_name help
@bot_name time
```

### 📸 動作画面

実際のSlackでの動作例：

<div align="center">

![動作スクリーンショット](https://raw.githubusercontent.com/Sunwood-ai-labs/slack-gas-simple-bot/refs/heads/main/2025-11-14-010629.png)

</div>

### 利用可能なコマンド

| コマンド | 説明 | 例 |
|---------|------|-----|
| `hello` / `hi` | 挨拶を返す | `@bot_name hello` → `Hello!` |
| `help` | 利用可能なコマンド一覧を表示 | `@bot_name help` |
| `time` | 現在時刻を返す | `@bot_name time` → `Current time is: ...` |
| その他 | キーワード以外のメッセージはオウム返し | `@bot_name こんにちは` → `こんにちは` |

## ⚙️ 環境変数

以下のスクリプトプロパティをGASで設定してください：

```
SLACK_BOT_TOKEN: xoxb-xxxxxxxxxxxx-xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx
WEBHOOK_SECRET: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (任意)
```

> **⚠️ 注意**: トークンやシークレットは絶対にGitリポジトリにコミットしないでください。

## 🔐 セキュリティ

- **トークン管理**: Slack Bot TokenはGASのスクリプトプロパティで安全に管理
- **署名検証**: `WEBHOOK_SECRET`を使用してリクエストの署名検証を実装可能（現在はコメントアウト）
- **アクセス制御**: GASのデプロイ設定で適切なアクセス権限を設定

## 📝 コードの拡張

`commands` オブジェクトに新しいキーワードと関数を追加することで、簡単に新しいコマンドを追加できます：

```javascript
// コマンドをオブジェクトとして定義
const commands = {
  'hello': () => 'Hello!',
  'hi': () => 'Hello!',
  'help': () => 'Available commands: hello, help, time, weather',
  'time': () => 'Current time is: ' + new Date(),
  'weather': () => 'Today is sunny!', // 新しいコマンドの例
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
```

この設計により、以下の利点があります：
- メンション部分を除去してからキーワード判定するため、誤認識を防ぎます
- コマンドの定義が一箇所にまとまり、追加や修正が容易です

## 🤝 コントリビューション

プルリクエストや issue の作成を歓迎します！改善提案やバグ報告があれば、お気軽にお知らせください。

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🔗 参考リンク

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Slack API Documentation](https://api.slack.com/)
- [Slack Events API](https://api.slack.com/events-api)

---

<div align="center">

Made with ❤️ using Google Apps Script

</div>
