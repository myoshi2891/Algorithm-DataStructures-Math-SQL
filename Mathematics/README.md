# 「LaTeX（ラテフ）」と「KaTeX（ケイテフ）」についての要点

- **LaTeX** = 組版システム（TeX エンジン＋マクロ）。論文・書籍・スライドなど**文書全体**を美しく組むためのツール。
- **KaTeX** = ブラウザ用 JS ライブラリ。**数式（TeX 記法）だけ**を超高速にレンダリングして HTML に表示するためのもの。
- 使い分け：**PDF を作るなら LaTeX**、**Web で数式を表示するなら KaTeX**（or MathJax）。

---

## LaTeX（ラテフ）

### 何者？

- **TeX（ドナルド・クヌースの低レベル組版）**をベースに、文書作成を簡潔にする**高級マクロ群**が LaTeX。
- 数式・段組・相互参照・目次・参考文献など、**学術文書の王道**。

### エンジン・ディストリビューション

- **エンジン**：`pdfLaTeX`（古典・安定）、`XeLaTeX`（Unicode & OS フォント簡単）、`LuaLaTeX`（拡張性・制御性高い）。
- **配布**：TeX Live（クロスプラットフォーム）、MiKTeX（Windows 寄り）、MacTeX（macOS 向け）。
- **エディタ**：VS Code ＋ LaTeX Workshop、Texmaker、TeXstudio、Overleaf（クラウド）。

### 最小サンプル（PDF 生成）

```tex
\documentclass[a4paper,12pt]{article}
\usepackage{amsmath,amssymb}
\usepackage{hyperref}
\title{Minimal LaTeX}
\author{Author}
\date{}
\begin{document}
\maketitle

微分方程式の解は
\begin{equation}
  y(x) = C e^{\lambda x}, \quad \lambda \in \mathbb{R}.
\end{equation}

参照：式~\eqref{eq:gauss} はガウス積分。
\begin{equation}
  \int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}.
  \label{eq:gauss}
\end{equation}

\end{document}
```

### よく使う数式環境（`amsmath`）

- `equation`（番号つき）
- `align`（整列・複数行）
- `gather`（中央寄せ）
- `cases`（場合分け）
- `pmatrix`（丸かっこ行列）

### 典型的な書き心地の良い設定

- `hyperref`（PDF 内リンク/しおり）
- `cleveref`（式・図表の賢い参照）
- `biblatex` + `biber`（文献管理）
- 日本語：`xeCJK`（XeLaTeX）や `luatexja`（LuaLaTeX）

### LaTeX の強み

- 組版品質（ハイフネーション、余白、禁則、相互参照）。
- 巨大文書の管理に強い（章立て、図表、索引）。

---

## KaTeX（ケイテフ）

### 何者か？

- **クライアント/サーバ側で動く JS レンダラ**。TeX（主に LaTeX の**数学**記法）を HTML+CSS（＋一部フォント）に変換。
- **超高速・軽量**、オフラインでも動作可能、SSG/SSR にも相性 ◎。

### 使いどころ

- ブログ/ドキュメント/学習サイトに**インライン数式**や**ディスプレイ数式**をサクッと表示。
- SPA/SSR（Next.js, Nuxt, Astro など）や Markdown エンジンと組み合わせる。

### 基本導入（CDN 例）

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css"
/>
<script
  defer
  src="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.js"
></script>
<script
  defer
  src="https://cdn.jsdelivr.net/npm/katex/dist/contrib/auto-render.min.js"
></script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false },
      ],
      throwOnError: false,
    });
  });
</script>
```

- **`auto-render`**で、`$...$`（インライン）・`$$...$$`（ブロック）を自動検出して描画。
- **サニタイズ**は別途考慮（ユーザー入力を直描画する場合）。

### React などで使う（直レンダリング）

```jsx
import "katex/dist/katex.min.css";
import katex from "katex";

export function Formula({ expr }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current)
      katex.render(expr, ref.current, {
        displayMode: false,
        throwOnError: false,
      });
  }, [expr]);
  return <span ref={ref} />;
}
```

### KaTeX の対応範囲

- **LaTeX 全機能ではなく「数学マクロ中心のサブセット」**。文書クラス、図表、参考文献、ページレイアウト等は対象外。
- `amsmath`の多くのコマンドは対応。`align`, `cases`, `matrix` など OK。
- 一部のマクロは**未対応**や**挙動差**あり（拡張パッケージのニッチ機能など）。

### KaTeX の強み

- **レンダリングが非常に速い**（大量の式でも軽い）。
- **サーバサイドレンダリング**可能（Node で文字列 → HTML 化）。

### MathJax との違い・選び方

- **KaTeX**：速度最優先・軽量・対応コマンドはやや少なめ。
- **MathJax**：互換性広い・機能豊富・やや重め。
- 「高速ブログや学習サイト」→ KaTeX、「互換性を最優先」→ MathJax、が目安。

---

## 記法チートシート（共通 TeX 系）

> **右列はすべて KaTeX で描画されるよう `$...$` で囲っています。**

| 目的          | 記法                                         | 例                                             |
| ------------- | -------------------------------------------- | ---------------------------------------------- |
| 上付き/下付き | x^2, a\_{ij}                                 | $x^2,\ a_{ij}$                                 |
| 分数          | \frac{a}{b}                                  | $\frac{a}{b}$                                  |
| ルート        | \sqrt{x}, \sqrt[n]{x}                        | $\sqrt{x},\ \sqrt[n]{x}$                       |
| ギリシャ文字  | \alpha, \beta, \Gamma                        | $\alpha,\ \beta,\ \Gamma$                      |
| 微分          | \frac{d f}{d x}, f'                          | $\frac{d f}{dx},\ f'$                          |
| 積分          | \int_a^b f(x)\,dx                            | $\int_a^b f(x)\,dx$                            |
| 極限          | \lim\_{x\to 0} f(x)                          | $\lim_{x\to 0} f(x)$                           |
| 総和/総積     | \sum*{i=1}^n, \prod*{k=1}^m                  | $\sum_{i=1}^n,\ \prod_{k=1}^m$                 |
| 行列          | \begin{pmatrix} a & b \\ c & d \end{pmatrix} | $\begin{pmatrix} a & b \\ c & d \end{pmatrix}$ |
| 場合分け      | \begin{cases} ... \end{cases}                | $\begin{cases} \text{case} \end{cases}$        |
| 省略記号      | \cdots, \ldots                               | $\cdots,\ \ldots$                              |
| 矢印          | \to, \Rightarrow                             | $\to,\ \Rightarrow$                            |

**スペース**：\, \; \quad で可読性 UP。例：$f(x)\,dx$。

---

## Markdown での使い方

- 多くの MD ツールは**インライン** `$...$`、**ブロック** `$$...$$` をサポート（ビルダー側設定や拡張が必要）。
- Docusaurus, VitePress, Gatsby, Next.js Docs などは、**KaTeX プラグイン**を ON にすると `$` 記法で数式を描画可能。
- `\(` `\)` や `\[` `\]` を区切りに使う場合、Markdown のエスケープと干渉しないよう注意。

---

## よくあるハマりどころ

- **LaTeX → KaTeX へ丸ごと貼る**：NG。KaTeX は**数式部分だけ**。文書構造や図表は落ちる。
- **制御綴りのバックスラッシュ**：`\\` が必要な文脈（JS 文字列や MD コードブロック内）に注意。
- **未対応マクロ**：KaTeX でエラーになったら、同等の別記法に置換。`throwOnError:false` で回避しつつ、なるべく正しい置換を。
- **フォント崩れ**：CSS や外部フォント読み込みの順番を見直し。KaTeX の CSS は必ず読み込む。
- **数式中のテキスト**：`\text{...}` 推奨（amsmath）。KaTeX でもサポート。

---

## 変換・ワークフローのヒント

- **LaTeX 原稿を Web 化**：本文は Markdown に移し、**式だけ TeX 記法**で残す。ビルダー側で KaTeX を有効化。
- **Pandoc**：LaTeX → Docx/HTML/MD に変換。`--katex` オプションで KaTeX 向け HTML を生成可能（ビルド環境に応じて）。
- **SSR**：Node 側で KaTeX レンダリングしてから配信すると、初回描画が速く SEO にも良い。

---

## どっちを選ぶ？

- **PDF や印刷品質が必要**：LaTeX（XeLaTeX/LuaLaTeX を優先、フォント周りが楽）
- **Web で軽く速く**：KaTeX（大量式でも快適）
- **互換性最優先の Web**：MathJax（ただし重め）

---

## もう少し踏み込んだコツ

- **`align` で整列**（LaTeX／KaTeX）

  ```tex
  \begin{align}
    f(x) &= x^2 + 1 \\
         &= x^2 + 2x + 1 - 2x
  \end{align}
  ```

  `&` 位置で縦に揃う。KaTeX でも OK。

- **番号の制御**（LaTeX）

  - `\tag{*}` で手動番号、`\numberwithin{equation}{section}` で節ごと番号。

- **テキスト混在**：`\text{argmin over x}` のように文章を式に入れると読みやすい。

---

## まとめ（決め台詞）

- **LaTeX** は **文書全体の組版** の覇者、**KaTeX** は **Web 数式表示** の俊足ランナー。
- 目的に合わせて併用すると最強です。
- まずは「PDF が要るか？」「Web 表示か？」で分けて、必要なら **LaTeX（文書）＋ KaTeX（Web 式）** の二刀流にしましょう。
