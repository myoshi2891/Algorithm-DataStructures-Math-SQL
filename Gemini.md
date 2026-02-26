# Gemini.md

This file provides guidance to Gemini (or other Google AI assistants) when working with code in this repository.

## プロジェクト概要

マルチ言語・マルチAIによる競技プログラミング学習リポジトリ。各問題に対して**2社 × Nモデル × 3言語 × 3ドキュメント階層**で成果物を生成することを目的としています。

## スタック

- **パッケージマネージャ**: Bun (Node.jsの代わりに `bun install` などを使用)
- **言語**: Python, TypeScript, JavaScript, SQL, HTML
- **フロントエンドライブラリ**: React 18 UMD, Babel Standalone, Tailwind CSS, Prism.js
- **テスト**: `pytest` (Python), `vitest` (JS/TS)
- **リント・フォーマット**: `ruff`, `black` (Python) / `prettier`, `eslint` (JS/TS)

## ルーティングルール（ディレクトリ構造）

基本的に以下の6階層ディレクトリ構造に従います。

```text
{Domain}/{Subcategory}/{Platform}/{Problem}/{AIProvider}/{Artifact}
```

- **Domain**: `Algorithm/`, `DataStructures/`, `Mathematics/`, `SQL/`, `Shell/`, `Concurrency/`
- **Platform**: `leetcode/`, `hackerrank/`, `atcoder/`, `codeforces/`
- **AIProvider**: `Claude Sonnet 4.5/`, `gpt-4o/`, `Gemini/` など
- **Artifact**: `*.py`, `*.ts`, `*.js`, `README.md`, `README.html`, `README_react.html`

**※例外**:

- `JavaScript/` ディレクトリは LeetCode 30-Day JS Challenge 専用であり、上記6階層に従いません。
- `SQL/` ドメインはAIプロバイダーが `gpt/` 単一フォルダで `.ipynb` 形式になる場合があります。

### ドキュメント構成（3階層）

1. `README.md`: 純粋Markdown（Overview / Algorithm / Complexity / Implementation / Optimization の5セクション構造）
2. `README.html`: Prism.js + Tailwind CSS を用いたステップコントロールUI、SVGフローチャート
3. `README_react.html`: React 18 UMD + Babel Standalone を用いたリアルタイム入力操作・AI比較用UI

## 禁止操作・制約事項

### 1. 依存関係の禁止（ビルトイン限定）

- **Algorithm / DataStructures / Mathematics**: 標準ライブラリのみ使用可能です（例: `typing`, `collections`, `itertools`, `math`, `heapq`）。サードパーティ製ライブラリのインポートは**禁止**です。
- **JS / TS実装**: Node.jsやDenoのビルトインのみ。`lodash` などの外部ライブラリの使用は**禁止**です。
- ※例外として `SQL` ドメインでのみ Pandas / NumPy の使用が許可されています（`.ipynb` 形式）。

### 2. ファイルの直接編集禁止

- `public/index.html` 等の `public/` 配下のファイルは、すべて自動生成される成果物です。手動での直接編集は**禁止**です。
- 変更が必要な場合は、必ずジェネレータである `generate_index.py` 側を修正して再生成 (`python generate_index.py`) してください。

### 3. セキュリティに係る禁止操作・必須操作

- テンプレート内JSで `innerHTML` を使用することは**禁止**です（セキュリティフックによるブロックを避けるため）。必ず `textContent` + DOM API を使用してください。
- HTML出力に動的な文字列を埋め込む際は、XSS防止のため `html.escape()` を**必須**で行ってください。

### 4. ブラウザテスト等のファイルパス制限

- `file://` URLでのアクセスはブロックされる前提で設計されています。
- テスト等で確認が必要な場合は `python -m http.server 8765 --directory public` でローカルサーバーを起動してアクセスしてください。
