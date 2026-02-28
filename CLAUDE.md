# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

マルチ言語・マルチAIによる競技プログラミング学習リポジトリ。各問題に対して**2社 × Nモデル × 3言語 × 3ドキュメント階層**で成果物を生成する。

## 開発コマンド

```bash
# セットアップ
make setup          # venv + Jupyterカーネル設定
make install        # pip + bun install

# テスト
make test           # pytest + vitest 両方実行
bunx vitest run     # JS/TSテストのみ
bunx vitest run path/to/file.test.ts  # 単一テスト

# リント・フォーマット
make lint           # ruff + black + prettier + eslint
make fmt            # ruff --fix + black + prettier
bunx prettier -c .  # prettier チェックのみ
bunx prettier -w .  # prettier 修正

# 実行
bunx tsx path/to/file.ts   # TypeScript実行
make lab                   # JupyterLab起動
python generate_index.py   # public/index.html 再生成
```

パッケージマネージャは**Bun**。`npm`ではなく`bun install`を使用。

## アーキテクチャ

### 6階層ディレクトリ構造

```
{Domain}/{Subcategory}/{Platform}/{Problem}/{AIProvider}/{Artifact}
```

- **Domain**: `Algorithm/`, `DataStructures/`, `Mathematics/`, `SQL/`, `Shell/`, `Concurrency/`
- **Platform**: `leetcode/`, `hackerrank/`, `atcoder/`, `codeforces/`
- **AIProvider**: `Claude Sonnet 4.5/`, `Claude Code Sonnet 4.6 extended/`, `gpt-4o/` など
- **Artifact**: `*.py`, `*.ts`, `*.js`, `README.md`, `README.html`, `README_react.html`

**例外**: `JavaScript/` ディレクトリは LeetCode 30-Day JS Challenge 専用で、上記6階層に従わない。`SQL/` ドメインはAIプロバイダーが`gpt/`単一フォルダで`.ipynb`形式。

### デュアルAI実装哲学

- **Claude実装**: 競技最適化、型アノテーション信頼、単一メソッド、50-150 LOC
- **GPT実装**: 本番堅牢性、ランタイム検証、複数メソッド、80-200 LOC

### 3階層ドキュメントシステム

| ファイル            | スタック                        | 用途                                                                                 |
| ------------------- | ------------------------------- | ------------------------------------------------------------------------------------ |
| `README.md`         | 純粋Markdown                    | 5セクション構造（Overview / Algorithm / Complexity / Implementation / Optimization） |
| `README.html`       | Prism.js + Tailwind CSS         | ステップコントロールUI、SVGフローチャート                                            |
| `README_react.html` | React 18 UMD + Babel Standalone | リアルタイム入力操作、AI比較                                                         |

### コード構造パターン

**Python** (Claude): `class Solution: def methodName(self, ...) -> ReturnType:`
**TypeScript**: `function functionName(...): ReturnType { ... }`
**JavaScript**: `var functionName = function(...) { ... }; module.exports = { functionName };`

## 依存関係ポリシー

- **Algorithm/DataStructures/Mathematics**: 標準ライブラリのみ（`typing`, `collections`, `itertools`, `math`, `heapq`）。外部ライブラリ禁止
- **JS/TS実装**: ビルトインのみ。lodash等の外部ライブラリ禁止
- **SQLドメインのみ**: Pandas/NumPy許可（`.ipynb`形式）

## コードスタイル

- **TypeScript**: `strict: true`, `noImplicitAny: true`, target ES2022
- **Prettier**: semi, singleQuote, tabWidth: 4, printWidth: 100
- **Python**: ruff + black

### インデックスページ生成

- `public/index.html` は `python generate_index.py` で自動生成。直接編集禁止
- テンプレートは `generate_index.py` 内に埋め込み（Python `.format()` 使用、`{{`/`}}` でブレースエスケープ）
- `public/` 配下の全ファイルは生成物。変更は必ずジェネレータ側で行う
- テンプレート内JS で `innerHTML` 禁止（セキュリティフックがブロック）→ `textContent` + DOM API を使用
- HTML出力に埋め込む文字列は `html.escape()` 必須（XSS防止）

### ブラウザテスト（Playwright MCP）

- `file://` URLはブロックされる → `python -m http.server 8765 --directory public` でローカルサーバー起動
- `ruff` / `black` はグローバル未インストールの場合あり → `python -c "import py_compile; ..."` でシンタックスチェック代替

### 定性・定量評価のガイドライン

- 実装手法（例: `in` 演算子と `??=` 演算子など）を比較する際、「Aの方がBよりも確実に軽量/高速である」といった絶対的なパフォーマンスの断言は**避ける**こと。
- その代わり、セマンティクスの違い（例: `Object.create(null)` 等）を解説するか、V8エンジンのインラインキャッシュ（IC）などによって「実行環境に依存してパフォーマンスが逆転・変化する」といった中立的な補足を必ず含めること。

## SVGフローチャートガイドライン

`.agent/workflows/svg_flowchart_guidelines.md` に詳細あり。主要ポイント:

- `refX` はarrowhead長未満に設定（arrowheadがノードに隠れる問題を防止）
- viewBoxに30-50pxのpadding追加
- Prism.jsコピーボタンはTailwindのpreflightで消えるため `!important` オーバーライドが必要
