# Algorithm-DataStructures-Math-SQL — リポジトリ概要

[![GitHub Stars](https://img.shields.io/github/stars/myoshi2891/Algorithm-DataStructures-Math-SQL?style=flat-square)](https://github.com/myoshi2891/Algorithm-DataStructures-Math-SQL/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/myoshi2891/Algorithm-DataStructures-Math-SQL?style=flat-square)](https://github.com/myoshi2891/Algorithm-DataStructures-Math-SQL/network/members)
![Languages](https://img.shields.io/badge/Languages-Python%20|%20TypeScript%20|%20JavaScript-blue?style=flat-square)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/myoshi2891/Algorithm-DataStructures-Math-SQL)

> **関連ドキュメント**: [2×3×3 アーティファクト生成マトリクス](./2.1-the-233-artifact-generation-matrix) | [デュアル AI 実装哲学](./2.2-dual-ai-implementation-philosophy) | [3 層ドキュメントシステム](./2.3-three-tier-progressive-documentation-system) | [開発環境とツール](./3-development-environment-and-tooling)

このリポジトリは、**決定論的なマルチ言語・マルチ AI 問題解決ドキュメントシステム**を実装しています。LeetCode・HackerRank・AtCoder に掲載された各競技プログラミング問題に対し、**2×3×3 マトリクス乗算**（2 AI × 3 言語 × 3 ドキュメント層）によって正確に **18 個のアーティファクト**を生成します。

---

## 📋 目次

- [目的とスコープ](#目的とスコープ)
- [リポジトリ構造：2×3×3×6 アーキテクチャ](#リポジトリ構造2336-アーキテクチャ)
- [デュアル AI 実装哲学](#デュアル-ai-実装哲学コードレベルの差別化)
- [3 層プログレッシブドキュメントシステム](#3-層プログレッシブドキュメントシステム)
- [ビルドと公開インフラ](#ビルドと公開インフラ)
- [技術スタックと依存関係管理](#技術スタックと依存関係管理)
- [ナビゲーションとファイル検索](#ナビゲーションとファイル検索)
- [リポジトリのメトリクスと規模](#リポジトリのメトリクスと規模)
- [ファイル命名規則とコード構造](#ファイル命名規則とコード構造)
- [クイックスタートガイド](#クイックスタートガイド)

---

## 目的とスコープ

```mermaid
graph TD
    PROB["競技プログラミング問題<br>LeetCode / HackerRank / AtCoder"]

    PROB --> AI["2 AI プロバイダー"]
    AI --> C["Claude Sonnet 4.5"]
    AI --> G["GPT 5.1 Thinking Customized"]

    C --> LANG_C["3 言語"]
    G --> LANG_G["3 言語"]

    LANG_C --> PY_C["Python<br>.py"]
    LANG_C --> TS_C["TypeScript<br>.ts"]
    LANG_C --> JS_C["JavaScript<br>.js"]

    LANG_G --> PY_G["Python<br>_py.ipynb"]
    LANG_G --> TS_G["TypeScript<br>_ts.ipynb"]
    LANG_G --> JS_G["JavaScript<br>_js.ipynb"]

    PY_C & TS_C & JS_C & PY_G & TS_G & JS_G --> DOC["3 ドキュメント層 × 2 AI = 6 ファイル"]
    DOC --> D1["README.md<br>静的マークダウン"]
    DOC --> D2["README.html<br>インタラクティブ HTML"]
    DOC --> D3["README_react.html<br>Dynamic React"]

    style PROB fill:#4A90D9,color:#fff
    style DOC fill:#27AE60,color:#fff
```

---

## リポジトリ構造：2×3×3×6 アーキテクチャ

### 決定論的アーティファクト生成マトリクス

問題ごとに 3 つの乗算次元を通じて、厳密な **18 ファイル生成パターン**を強制します。

```mermaid
graph LR
    subgraph MATRIX["2×3×3 マトリクス = 18 アーティファクト / 問題"]
        AI_DIM["AI 次元 ×2<br>Claude / GPT"]
        LANG_DIM["言語次元 ×3<br>Py / TS / JS"]
        DOC_DIM["ドキュメント次元 ×3<br>md / html / react.html"]
    end

    AI_DIM --> LANG_DIM --> DOC_DIM
```

| 次元                | 数  | 例                                                   | コードパターン                        |
| ------------------- | --- | ---------------------------------------------------- | ------------------------------------- |
| **AI プロバイダー** | 2   | `claude sonnet 4.5/`、`gpt 5.1 thinking customized/` | レベル 5 のサブディレクトリ名         |
| **言語**            | 3   | `*.py`、`*.ts`、`*.js` + Jupyter バリアント          | ファイル拡張子 + Jupyter ノートブック |
| **ドキュメント**    | 3   | `README.md`、`README.html`、`README_react.html`      | 固定ファイル名パターン                |

---

### O(1) 参照のための 6 層ファイル階層

決定論的なパス構造により、検索なしに直接ファイルを特定できます。

```mermaid
graph TD
    L1["Level 1: ドメイン<br>Algorithm / DataStructures<br>Mathematics / SQL"]
    L2["Level 2: アルゴリズム手法<br>DynamicProgramming / BinarySearch / Map"]
    L3["Level 3: 問題ソース<br>leetcode / hackerrank / atcoder"]
    L4["Level 4: 具体的な問題<br>97. Interleaving String"]
    L5["Level 5: AI 実装<br>claude sonnet 4.5<br>gpt 5.1 thinking customized"]
    L6["Level 6: ファイルアーティファクト<br>Interleaving_String.py<br>README.md etc."]

    L1 --> L2 --> L3 --> L4 --> L5 --> L6

    style L1 fill:#E74C3C,color:#fff
    style L2 fill:#E67E22,color:#fff
    style L3 fill:#F1C40F,color:#000
    style L4 fill:#27AE60,color:#fff
    style L5 fill:#2980B9,color:#fff
    style L6 fill:#8E44AD,color:#fff
```

**パスパターン**:

```
{Domain}/{Subcategory}/{Platform}/{Problem}/{AI}/{Artifact}
```

**具体的なパス例**:

```
Algorithm/DynamicProgramming/leetcode/97. Interleaving String/Claude Sonnet 4.5/
├── Interleaving_String.py
├── Interleaving_String.ts
├── Interleaving_String.js
├── README.md
├── README.html
└── README_react.html
```

| レベル | 目的                     | 抽出方法   | 値の例                                              |
| ------ | ------------------------ | ---------- | --------------------------------------------------- |
| 1      | ドメイン分類             | `parts[0]` | `Algorithm`, `DataStructures`, `Mathematics`, `SQL` |
| 2      | アルゴリズム手法         | `parts[1]` | `DynamicProgramming`, `BinarySearch`, `Map`         |
| 3      | 問題ソース               | `parts[2]` | `leetcode`, `hackerrank`, `atcoder`                 |
| 4      | 具体的な問題             | `parts[3]` | `97. Interleaving String`                           |
| 5      | AI 実装                  | `parts[4]` | `claude sonnet 4.5`, `gpt 5.1 thinking customized`  |
| 6      | ファイルアーティファクト | ファイル名 | `Interleaving_String.py`, `README.md`               |

> **SQL ドメインの例外**: レベル 5 では単一の `gpt/` ディレクトリを使用し、レベル 6 でプラットフォーム固有のサフィックスを付与

```
SQL/Leetcode/Basic select/1141. User Activity/gpt/
├── User_Activity_*_mysql.ipynb     # MySQL 8.0.40
├── User_Activity_*_postgre.ipynb   # PostgreSQL 16.6+
└── User_Activity_*_pandas.ipynb    # Pandas 2.2.2
```

---

## デュアル AI 実装哲学：コードレベルの差別化

### 対照的な実装パターン

```mermaid
graph LR
    subgraph CLAUDE["Claude Sonnet 4.5<br>競技プログラミング志向"]
        C1["メソッド数: 1<br>(isInterleave のみ)"]
        C2["型チェック: アノテーションを信頼"]
        C3["制約検証: なし"]
        C4["コード量: 50〜150 行"]
        C5["実行時間: 44ms (60.43%)"]
        C6["メモリ: 91.38 パーセンタイル"]
    end

    subgraph GPT["GPT 5.1 Thinking Customized<br>プロダクション志向"]
        G1["メソッド数: 2+<br>(競技版 + プロダクション版)"]
        G2["型チェック: isinstance() 実行時検証"]
        G3["制約検証: 明示的な ValueError"]
        G4["コード量: 80〜200 行"]
        G5["実行時間: 42ms (70.90%)"]
        G6["メモリ: 66.05 パーセンタイル"]
    end

    PROB["同一問題"] --> CLAUDE
    PROB --> GPT
```

### コード比較

**Claude パターン**（シンプル・直接実装）:

```python
class Solution:
    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:
        # 型アノテーションを信頼 — バリデーションなし
        n1, n2, n3 = len(s1), len(s2), len(s3)
        if n1 + n2 != n3:
            return False
        # 単一メソッド、直接実装
```

**GPT パターン**（バリデーション付き・プロダクション対応）:

```python
class Solution:
    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:
        # 競技版（高速パス）
        ...

    def isInterleave_production(self, s1: Any, s2: Any, s3: Any) -> bool:
        # 実行時バリデーション
        if not isinstance(s1, str):
            raise TypeError("s1 must be str")
        if len(s1) > 100:
            raise ValueError("Exceeds constraint: len(s1) <= 100")
        # 検証付きプロダクション版
```

| 観点                   | Claude 実装          | GPT 実装                                        |
| ---------------------- | -------------------- | ----------------------------------------------- |
| **メソッド数**         | 1（`isInterleave`）  | 2+（`isInterleave`、`isInterleave_production`） |
| **型チェック**         | アノテーションを信頼 | `isinstance()` 実行時チェック                   |
| **制約バリデーション** | なし                 | 明示的な `if len(s1) > 100: raise ValueError`   |
| **コード長**           | 50〜150 行           | 80〜200 行                                      |
| **実行時間（Python）** | 44ms（60.43%）       | 42ms（70.90%）                                  |
| **メモリ（Python）**   | 91.38 パーセンタイル | 66.05 パーセンタイル                            |

---

## 3 層プログレッシブドキュメントシステム

```mermaid
graph TD
    subgraph TIER1["Tier 1: 静的マークダウン (README.md)<br>初学者向け"]
        T1A["Section 1: 問題概要・制約・例"]
        T1B["Section 2: アルゴリズム戦略・データ構造"]
        T1C["Section 3: 時間 O(...) / 空間 O(...) 計算量"]
        T1D["Section 4: コードウォークスルー"]
        T1E["Section 5: 言語別最適化・パフォーマンスチューニング"]
        T1A --> T1B --> T1C --> T1D --> T1E
    end

    subgraph TIER2["Tier 2: インタラクティブ HTML (README.html)<br>中級者向け"]
        T2A["Prism.js 1.29.0<br>構文ハイライト"]
        T2B["Tailwind CSS<br>スタイリング"]
        T2C["Play/Pause/Step<br>インタラクティブ制御"]
        T2D["SVG フローチャート"]
    end

    subgraph TIER3["Tier 3: Dynamic React (README_react.html)<br>上級者向け"]
        T3A["React 18.3.1<br>リアルタイム実行"]
        T3B["useState<br>ライブ入力変更"]
        T3C["useEffect<br>アルゴリズム再実行"]
        T3D["AI 実装の<br>並列比較"]
    end

    TIER1 -->|"スキルアップ"| TIER2 -->|"スキルアップ"| TIER3
```

### Tier 1: 静的マークダウン（`README.md`）

**標準 5 セクション構成**:

| セクション ID | ヘッダー               | コンテンツの目的                             |
| ------------- | ---------------------- | -------------------------------------------- |
| 1             | `<h2 id="overview">`   | 問題文・制約・例                             |
| 2             | `<h2 id="tldr">`       | アルゴリズム戦略・データ構造・状態遷移       |
| 3             | `<h2 id="complexity">` | 時間 O(...)・空間 O(...)・導出               |
| 4             | `<h2 id="impl">`       | コードウォークスルー・行ごとの説明           |
| 5             | `<h2 id="cpython">`    | 言語固有の最適化・パフォーマンスチューニング |

### Tier 2: インタラクティブ HTML（`README.html`）

**技術スタック**:

- **構文ハイライト**: Prism.js 1.29.0（`/vendor/prismjs/prism.js`）
- **スタイリング**: Tailwind CSS（`/vendor/tailwindcss/script.js`）
- **インタラクティブ制御**: JavaScript 状態管理付きの Play/Pause/Step ボタン

**主な機能**:

- ステップバイステップのアルゴリズム可視化
- SVG フローチャートレンダリング
- 行番号付きコードブロックハイライト
- 外部 CDN 依存なし（すべてローカルにベンダリング）

### Tier 3: Dynamic React（`README_react.html`）

**技術スタック**:

- **React**: 18.3.1（`/vendor/react/react.development.js`）
- **React DOM**: 18.3.1（`/vendor/react-dom/react-dom.development.js`）
- **Babel Standalone**: 7.26.10（`/vendor/babel/babel.min.js`）

**React コンポーネントパターン**:

```jsx
<script type="text/babel">
    function AlgorithmDemo() {
        const [input, setInput] = React.useState("default");
        const [result, setResult] = React.useState(null);

        // リアルタイムアルゴリズム実行
        React.useEffect(() => {
            const output = runAlgorithm(input);
            setResult(output);
        }, [input]);

        return (
            <div>
                <input onChange={(e) => setInput(e.target.value)} />
                <ResultDisplay data={result} />
            </div>
        );
    }
</script>
```

**主な機能**:

- `useState` によるライブ入力変更
- `useEffect` によるリアルタイムアルゴリズム再実行
- AI 実装の並列比較
- インタラクティブな可視化コンポーネント

---

## ビルドと公開インフラ

### インデックス生成パイプライン

```mermaid
flowchart TD
    START["./update_index.sh<br>起動"] --> PY["python3 generate_index.py"]

    PY --> FUNC1["get_html_title()<br><title>タグを正規表現で抽出"]
    PY --> FUNC2["copy_vendor_files()<br>node_modules → public/vendor へコピー"]
    PY --> FUNC3["rewrite_html_content()<br>CDN URL をローカルパスに置換"]
    PY --> FUNC4["generate_index()<br>メインオーケストレーション関数"]

    FUNC2 --> VENDOR["Vendor ファイルマッピング"]
    VENDOR --> V1["react/umd/*.js → /vendor/react/"]
    VENDOR --> V2["react-dom/umd/*.js → /vendor/react-dom/"]
    VENDOR --> V3["@babel/standalone → /vendor/babel/"]
    VENDOR --> V4["prismjs → /vendor/prismjs/"]
    VENDOR --> V5["fontawesome → /vendor/fontawesome/"]

    FUNC3 --> REWRITE["URL 書き換えパターン"]
    REWRITE --> R1["https://unpkg.com/react@18/...<br>→ /vendor/react/react.development.js"]
    REWRITE --> R2["https://cdn.tailwindcss.com<br>→ /vendor/tailwindcss/script.js"]

    FUNC4 --> INDEX["public/index.html 生成<br>152 問題リンク + カテゴリータブ"]

    FUNC1 & FUNC2 & FUNC3 & FUNC4 --> INDEX

    style START fill:#E74C3C,color:#fff
    style INDEX fill:#27AE60,color:#fff
```

### `generate_index.py` の主要関数

| 関数                     | 行      | 目的                                   | コードエンティティ                      |
| ------------------------ | ------- | -------------------------------------- | --------------------------------------- |
| `get_html_title()`       | 11-17   | `<title>` タグを正規表現で抽出         | `re.search(r'<title>(.*?)</title>')`    |
| `copy_vendor_files()`    | 19-77   | node_modules を public/vendor にコピー | `shutil.copy2()`, `shutil.copytree()`   |
| `rewrite_html_content()` | 78-111  | CDN URL をローカルパスに置換           | 文字列置換マッピング                    |
| `generate_index()`       | 113-617 | メインオーケストレーション関数         | `os.walk()`, `defaultdict()`, HTML 生成 |

### CI/CD パイプライン

```mermaid
flowchart LR
    DEV["開発者<br>コード追加"] -->|git commit| HOOK["Pre-commit Hook<br>update_index.sh 自動実行"]
    HOOK --> BUILD["generate_index.py<br>インデックス再生成"]
    BUILD --> AUTO["git-auto-commit-action<br>生成ファイルを自動コミット"]
    AUTO -->|push/PR| GA["GitHub Actions<br>ビルド・検証"]
    GA --> DEPLOY["public/index.html<br>公開サイト更新"]

    style DEV fill:#3498DB,color:#fff
    style DEPLOY fill:#27AE60,color:#fff
```

---

## 技術スタックと依存関係管理

### コアランタイム環境

| コンポーネント | バージョン           | 設定ファイル      | 目的                                 |
| -------------- | -------------------- | ----------------- | ------------------------------------ |
| **Python**     | CPython 3.12.11      | `.python-version` | アルゴリズム実装・ビルドスクリプト   |
| **Node.js**    | v22.14.0             | `package.json`    | TypeScript/JavaScript ランタイム     |
| **TypeScript** | 5.9.3                | `package.json`    | 型安全な実装                         |
| **Bun**        | 1.3.5（Lockfile v1） | `bun.lock`        | パッケージマネージャー（npm の代替） |

### フロントエンド依存関係（ベンダリング済み）

```mermaid
graph LR
    subgraph VENDOR["public/vendor/ (~5MB)"]
        R["React 18.3.1<br>react.development.js"]
        RD["React DOM 18.3.1<br>react-dom.development.js"]
        B["Babel 7.26.10<br>babel.min.js"]
        P["Prism.js 1.29.0<br>prism.js + plugins"]
        T["Tailwind CSS<br>standalone"]
        FA["FontAwesome 6.7.2<br>CSS + webfonts"]
    end
```

### SQL ドメインの依存関係（例外）

| ライブラリ     | バージョン | 設定                    | 目的                            |
| -------------- | ---------- | ----------------------- | ------------------------------- |
| **Pandas**     | 2.2.2      | `requirements.lock.txt` | SQL 問題の代替 DataFrame 操作   |
| **NumPy**      | 2.3.4      | `requirements.lock.txt` | Pandas ソリューションの数値演算 |
| **SQLAlchemy** | Latest     | `requirements.lock.txt` | データベース対話レイヤー        |

### コード品質ツール

| ツール           | バージョン | 設定                 | 目的                             |
| ---------------- | ---------- | -------------------- | -------------------------------- |
| **Prettier**     | 3.4.2      | `package.json`       | コードフォーマット（JS/TS）      |
| **ESLint**       | 9.18.0     | `package.json`       | リンティング（JS/TS）            |
| **Ruff**         | Latest     | Python config        | Python リンティング/フォーマット |
| **Markdownlint** | N/A        | `.markdownlint.json` | Markdown バリデーション          |

**Markdownlint 設定** (`.markdownlint.json`):

```json
{
    "MD013": {
        "line_length": 1000,
        "code_blocks": false
    },
    "MD033": {
        "allowed_elements": ["h1", "h2", "p", "i", "footer", "br", "div"]
    }
}
```

---

## ナビゲーションとファイル検索

### カテゴリーベースのナビゲーション

生成された `public/index.html` は、カテゴリーフィルタリング付きのタブインターフェースを実装しています。

```mermaid
graph TD
    INDEX["public/index.html<br>メインナビゲーション"]

    INDEX --> TAB_ALL["🌍 All<br>(152 問題)"]
    INDEX --> TAB_ALGO["🧩 Algorithm<br>(84 問題)"]
    INDEX --> TAB_DS["🏗 DataStructures<br>(35 問題)"]
    INDEX --> TAB_MATH["📐 Mathematics<br>(13 問題)"]
    INDEX --> TAB_JS["⚡ JavaScript<br>(11 問題)"]
    INDEX --> TAB_CC["🔄 Concurrency<br>(6 問題)"]
    INDEX --> TAB_SQL["🗄 SQL<br>(3 問題)"]

    TAB_ALGO --> CARD["問題カード<br>├── カードタイトル<br>└── ファイルパス"]
```

---

## リポジトリのメトリクスと規模

### 問題ドメイン分布

```mermaid
pie title 問題ドメイン分布（全 152 問題）
    "Algorithm (84問)" : 84
    "DataStructures (35問)" : 35
    "Mathematics (13問)" : 13
    "JavaScript (11問)" : 11
    "Concurrency (6問)" : 6
    "SQL (3問)" : 3
```

| ドメイン           | 問題数  | ファイル数（18×N） | 割合  |
| ------------------ | ------- | ------------------ | ----- |
| **Algorithm**      | 84      | 1,512              | 55.3% |
| **DataStructures** | 35      | 630                | 23.0% |
| **Mathematics**    | 13      | 234                | 8.6%  |
| **JavaScript**     | 11      | 198                | 7.2%  |
| **Concurrency**    | 6       | 108                | 3.9%  |
| **SQL**            | 3       | 54                 | 2.0%  |
| **合計**           | **152** | **2,736**          | 100%  |

### 問題ごとのファイルタイプ内訳

| ファイルタイプ        | 数     | 目的                             | 命名パターン         |
| --------------------- | ------ | -------------------------------- | -------------------- |
| Python 実装           | 2      | `class Solution`（アルゴリズム） | `*.py`、`*_py.ipynb` |
| TypeScript 実装       | 2      | 型安全な関数実装                 | `*.ts`、`*_ts.ipynb` |
| JavaScript 実装       | 2      | CommonJS `module.exports`        | `*.js`、`*_js.ipynb` |
| 静的ドキュメント      | 2      | 5 セクションの Markdown          | `README.md`          |
| インタラクティブ HTML | 2      | Prism.js + Tailwind              | `README.html`        |
| React 可視化          | 2      | React 18 + Babel                 | `README_react.html`  |
| **問題ごとの合計**    | **18** | 完全な学習アーティファクトセット | -                    |

### 生成サイト構造

```
public/
├── index.html                 # メインナビゲーション（152 リンク、カテゴリータブ）
├── vendor/                    # ベンダリング済み依存関係（合計 ~5MB）
│   ├── react/                 # React 18.3.1 UMD
│   ├── react-dom/             # React DOM 18.3.1
│   ├── babel/                 # Babel Standalone 7.26.10
│   ├── prismjs/               # Prism.js 1.29.0 + プラグイン
│   ├── tailwindcss/           # Tailwind CSS スタンドアロン
│   └── fontawesome/           # FontAwesome 6.7.2 + webfonts
├── Algorithm/                 # 84 問題 × 18 ファイル = 1,512 ファイル
├── DataStructures/            # 35 問題 × 18 ファイル = 630 ファイル
├── Mathematics/               # 13 問題 × 18 ファイル = 234 ファイル
├── JavaScript/                # 11 問題 × 18 ファイル = 198 ファイル
├── Concurrency/               # 6 問題 × 18 ファイル = 108 ファイル
└── SQL/                       # 3 問題 × 18 ファイル = 54 ファイル
```

---

## ファイル命名規則とコード構造

### 言語固有のパターン

```mermaid
graph LR
    subgraph CLAUDE_FILES["Claude Sonnet 4.5 ファイル"]
        CF1["Problem.py<br>class Solution"]
        CF2["Problem.ts<br>function solution()"]
        CF3["Problem.js<br>module.exports"]
        CF4["README.md"]
        CF5["README.html"]
        CF6["README_react.html"]
    end

    subgraph GPT_FILES["GPT 5.1 Thinking ファイル（Jupyter）"]
        GF1["Problem_py.ipynb<br>4 セルのノートブック"]
        GF2["Problem_ts.ipynb"]
        GF3["Problem_js.ipynb"]
        GF4["README.md"]
        GF5["README.html"]
        GF6["README_react.html"]
    end
```

**Python**:

```python
class Solution:
    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:
        """
        Docstring with Time/Space complexity
        """
        # Implementation
```

**TypeScript**:

```typescript
function isInterleave(s1: string, s2: string, s3: string): boolean {
    // 型安全な実装
}
```

**JavaScript**:

```javascript
var isInterleave = function (s1, s2, s3) {
    // Implementation
};
module.exports = { isInterleave };
```

### Jupyter ノートブックの構造

GPT 実装は以下のセル構造の Jupyter ノートブックを使用します：

```mermaid
flowchart TD
    CELL1["セル 1: 問題分析<br>(Markdown)<br>問題文・制約・例の分析"]
    CELL2["セル 2: 競技版コード<br>(Python/TS/JS)<br>高速パス実装"]
    CELL3["セル 3: プロダクション版コード<br>(バリデーション付き)<br>isinstance() チェック・ValueError"]
    CELL4["セル 4: 最適化ディスカッション<br>(Markdown)<br>トレードオフ・改善案"]

    CELL1 --> CELL2 --> CELL3 --> CELL4
```

---

## クイックスタートガイド

### クローンとセットアップ

```bash
# 1. リポジトリをクローン
git clone https://github.com/myoshi2891/Algorithm-DataStructures-Math-SQL.git
cd Algorithm-DataStructures-Math-SQL

# 2. 依存関係をインストール（Bun を使用）
bun install

# 3. 公開サイトを生成
./update_index.sh

# 4. ローカルで配信
bun run serve
# http://127.0.0.1:8080 で開く
```

### 新しい問題の追加

新しい問題を追加する際は、2×3×3 マトリクス構造を必ず守ってください：

```
{Domain}/{Subcategory}/{Platform}/{Problem}/
├── claude sonnet 4.5/
│   ├── {Problem}.py
│   ├── {Problem}.ts
│   ├── {Problem}.js
│   ├── README.md
│   ├── README.html
│   └── README_react.html
└── gpt 5.1 thinking customized/
    ├── {Problem}_py.ipynb
    ├── {Problem}_ts.ipynb
    ├── {Problem}_js.ipynb
    ├── README.md
    ├── README.html
    └── README_react.html
```

ファイルを追加後、`./update_index.sh` を実行して `public/index.html` を再生成してください。

---

> このリポジトリは、自動ビルドプロセスと厳密なファイル組織パターンを持つ、マルチ言語アルゴリズムドキュメントのための**決定論的・スケーラブルなアーキテクチャ**を実装しており、O(1) ファイル参照と体系的な知識ナビゲーションを実現しています。

**⭐ このプロジェクトが役立ちましたら、ぜひスターを付けてください！**

[![Made with ❤️ by myoshi2891](https://img.shields.io/badge/Made%20with%20❤️%20by-myoshi2891-red?style=flat-square)](https://github.com/myoshi2891)

> このリポジトリは、自動ビルドプロセスと厳密なファイル組織パターンを持つ、マルチ言語アルゴリズムドキュメントのための**決定論的・スケーラブルなアーキテクチャ**を実装しており、O(1) ファイル参照と体系的な知識ナビゲーションを実現しています。
