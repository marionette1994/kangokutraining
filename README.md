# 鍛帳 (Tanchō)

**監獄トレーニング(Convict Conditioning)ビッグ6 を段位で記録する、和の稽古録アプリ**

帖シリーズと同じ和紙・墨・朱色の設計言語で構成された PWA。React 18 + Recharts、localStorage、Service Worker によるオフライン動作。

## デザイン方針

- **和紙 (washi)** — 温かいクリーム色 `#EFE5CB` の紙地に繊維テクスチャ
- **墨 (sumi)** — 温かみのある黒 `#1F1B15` を本文に
- **朱 (shu)** — 印・強調色に `#B0322B` の日本伝統朱色
- **書体** — 見出し: Yuji Syuku(筆書き) / 本文: Shippori Mincho B1(明朝)
- **用語** — 「段」「稽古」「初伝/中伝/皆伝」「極」など武道・伝統流儀の語彙

## 帖シリーズとの整合

同じ命名規則(◯帖/◯帳)、同じ和紙アセット系、同じアーキテクチャ(pre-compiled JSX + React UMD + localStorage + SW + Pillow icons)。

## GitHub Pages へのデプロイ

### 1. リポジトリを作成

```
marionette1994/tancho
```

`dist/` の中身(index.html, app.js, sw.js, manifest.json, icons/)をリポジトリ直下に配置。

### 2. サブディレクトリで公開する場合

`manifest.json` の `start_url` と `scope` を調整:

```json
"start_url": "/tancho/",
"scope": "/tancho/"
```

### 3. Push & Pages 有効化

```bash
git add .
git commit -m "initial commit"
git push
```

Settings → Pages で source を main branch / root に設定。数分後に `https://marionette1994.github.io/tancho/` で公開。

### 4. インストール

- **iOS Safari**: 共有 → 「ホーム画面に追加」
- **Android Chrome**: メニュー → 「アプリをインストール」
- **PC**: アドレスバーのインストールアイコン

## ファイル構成

```
dist/
├── index.html               # エントリ(和紙 CSS 変数 + フォント読込)
├── app.js                   # コンパイル済み React アプリ
├── sw.js                    # Service Worker
├── manifest.json            # PWA マニフェスト
├── src/app.jsx              # 編集用ソース
└── icons/
    ├── icon-192.png          # 鍛(墨)+ 帳(朱印)
    ├── icon-512.png
    ├── icon-180.png          # Apple touch
    ├── icon-maskable-512.png
    └── favicon.png
```

## 用語対応表

| 一般 | 鍛帳 |
| --- | --- |
| Step / ステップ | 段 |
| 現在のステップ | 現段 |
| 全10ステップ | 十段の型 |
| マスターステップ | 極 |
| 初級基準 | 初伝 (SHODEN) |
| 中級基準 | 中伝 (CHŪDEN) |
| 上級基準 | 皆伝 (KAIDEN) |
| セッション | 稽古 |
| セット | 組 |
| メモ | 覚書 |
| 履歴 | 帳面 |
| Markdown 出力 | 写し |

## データ保管

`localStorage` キー: `tancho-state-v1`。他端末同期なし。Markdown 写し機能で Obsidian Daily Note に貼付する運用を想定。

## Markdown 写しの形式

```markdown
## 鍛帳 — 2026年7月15日

### プッシュアップ ・ 第五段
**フルプッシュアップ** _(Full Pushup)_
- 稽古: 10 / 10 / 8 → 計 28 回
- 皆伝: 2×20
- 覚書: 呼吸が浅い
```

## ソースの再ビルド

```bash
npm install --save-dev @babel/core @babel/cli @babel/preset-react @babel/preset-env
npx babel src/app.jsx -o dist/app.js
```

## キャッシュ更新

`sw.js` の `CACHE_NAME` を `tancho-v2` のように上げると次回訪問時に旧キャッシュが破棄される。
