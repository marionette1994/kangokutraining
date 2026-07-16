# 鍛帳 (Tanchō)

**監獄トレーニング(Convict Conditioning)ビッグ6 を段位で記録する、和の稽古録 PWA**

---

## ⚠️ 「開帳中...」で固まる問題について(修正済み)

**原因:** 旧版は React / Recharts / Tailwind を **unpkg.com・cdn.tailwindcss.com から読み込んでいました**。
社内プロキシ等でこれらが遮断されると `React is not defined` で起動スクリプトが即死し、
起動スプラッシュ(開帳中...)が永久に残ります。和紙の背景と文字だけはインラインCSSなので表示され続ける、
という今回の症状と完全に一致します。

**対策:** 依存ライブラリを **すべてリポジトリに同梱(`vendor/`)** し、外部CDNへの依存を撤廃しました。

| | 旧版 | 新版 |
|---|---|---|
| React / ReactDOM | unpkg.com | `vendor/`(同梱) |
| Recharts | unpkg.com | `vendor/`(同梱) |
| Tailwind | CDN の JIT コンパイラ(約400KB+実行時コンパイル) | 事前ビルド済み静的CSS **7KB** |
| Webフォント | 同期読込(ブロックで停止) | 非同期・任意(未取得でも游明朝にフォールバック) |
| 失敗時 | 無言で永久スプラッシュ | **原因を画面に表示** |

これで**完全オフライン動作**にもなりました(PWAとして本来あるべき姿)。

---

## デプロイ手順(重要)

リポジトリ `kangokutraining` の**直下**に、この `dist/` の中身を配置してください。

```
kangokutraining/
├── .nojekyll
├── index.html
├── app.js
├── sw.js
├── manifest.json
├── vendor/          ← ★ これを入れ忘れると起動しません
│   ├── react.min.js
│   ├── react-dom.min.js
│   ├── prop-types.min.js
│   ├── recharts.min.js
│   └── tailwind.css
├── icons/
└── src/app.jsx      ← 編集用ソース(配信には不要)
```

```bash
git add -A
git commit -m "self-host dependencies: fix boot hang behind proxy"
git push
```

### 反映されない場合(Service Worker のキャッシュ)

旧版の Service Worker が古い `index.html` をキャッシュしているため、
**1〜2回リロードするか、ハードリロード(Ctrl+Shift+R)** してください。
新しい SW(`tancho-v2`)が旧キャッシュを自動削除します。

それでも直らない場合:
F12 → Application → Service Workers → **Unregister** → リロード。

---

## デザイン方針

- **和紙 (washi)** `#EFE5CB` — 繊維テクスチャ付きの紙地
- **墨 (sumi)** `#1F1B15` — 温かみのある黒
- **朱 (shu)** `#B0322B` — 印章・強調
- **書体** — 見出し: Yuji Syuku(筆) / 本文: Shippori Mincho B1(明朝)
  - フォントが読めない環境では **游明朝 / ヒラギノ明朝** に自動フォールバック(意匠は保たれます)

## 用語対応表

| 一般 | 鍛帳 |
| --- | --- |
| Step | 段(漢数字表記) |
| 現在のステップ | 現段 |
| マスターステップ | 極 |
| 初級 / 中級 / 上級基準 | 初伝 / 中伝 / 皆伝 |
| セッション | 稽古 |
| セット | 組 |
| メモ | 覚書 |
| 履歴 | 帳面 |
| Markdown 出力 | 写し |

## データ保管

`localStorage` キー: `tancho-state-v1`。端末内のみ・同期なし。
Markdown「写し」で Obsidian Daily Note に貼り付ける運用を想定。

```markdown
## 鍛帳 — 2026年7月15日

### プッシュアップ ・ 第五段
**フルプッシュアップ** _(Full Pushup)_
- 稽古: 10 / 10 / 8 → 計 28 回
- 皆伝: 2×20
- 覚書: 呼吸が浅い
```

## 再ビルド

`src/app.jsx` を編集したら:

```bash
npm install -D @babel/core @babel/cli @babel/preset-react @babel/preset-env tailwindcss@3
npx babel src/app.jsx -o app.js
npx tailwindcss -c tailwind.config.js -i tw-input.css -o vendor/tailwind.css --minify
```

Tailwind は `src/app.jsx` を走査して**使用クラスのみ**出力します。
新しいクラスを追加したら必ず CSS を再ビルドしてください。

## キャッシュ更新

配信内容を変えたら `sw.js` の `CACHE_NAME` を `tancho-v3` … と上げてください。
