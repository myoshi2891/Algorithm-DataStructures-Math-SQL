K番目順列アルゴリズムの技術解説用HTMLページが完成しました！

## 主な特徴

**📊 4つのタブ構成**
- **アルゴリズム**: TypeScriptコード + 概要解説
- **視覚化**: ステップバイステップのアニメーション
- **解析**: 時間・空間計算量の詳細分析
- **デモ**: インタラクティブな実行環境

**🎨 プレゼンテーション品質のデザイン**
- グラデーション背景とモダンなUI
- カスタムCSSによる統合スタイリング
- スムーズなアニメーションとホバー効果
- レスポンシブ対応

**💻 高機能コードブロック**
- 行番号付きシンタックスハイライト
- ワンクリックコピー機能
- monospaceフォントによる正確な表示
- 演算子の適切なレンダリング

**🔄 インタラクティブ機能**
- リアルタイム視覚化（n=3-5, k可変）
- ステップ実行トレース
- 配列状態のアニメーション表示
- パフォーマンス比較表

**📈 詳細な解析内容**
- O(n²) vs O(n!×n) の比較
- メモリ使用量の最適化説明
- 数学的計算過程の可視化
- アルゴリズムフローチャート

このページは技術プレゼンテーションや教育目的に最適で、複雑なアルゴリズムを直感的に理解できるよう設計されています。各処理ステップが図解と共に詳細に説明され、実際の動作を体験できます。

修正完了しました！`@apply`ディレクティブを全て削除し、標準的なCSSプロパティに変換しました。

## 修正内容

**❌ 問題**: `@apply`はTailwind CSS CDN版では利用できない  
**✅ 解決**: 全てのTailwindクラスを対応するCSSプロパティに変換

### 主な変換例

```css
/* 修正前 */
@apply bg-gradient-to-br from-slate-900 to-slate-800;

/* 修正後 */
background: linear-gradient(135deg, #0f172a, #1e293b);
```

### 変換された要素
1. **`.card-container`** - グラデーション背景、影、ボーダー
2. **`.tab-button`** - パディング、ボーダー半径、トランジション
3. **`.tab-active/.tab-inactive`** - 背景色、テキスト色、ホバー効果
4. **`.step-card`** - 背景、ボーダー、アニメーション
5. **`.array-item`** - 配列要素のスタイリング
6. **`.flow-node`** - フローチャートノードのグラデーション
7. **`.math-formula`** - 数式表示の背景とフォント

これで`@apply`エラーが解消され、全ての視覚効果が正常に動作します。Tailwind CDN版との完全な互換性を保ちながら、洗練されたデザインを維持しています。


HTMLで行番号が表示されない理由を分析します。コードを確認すると、いくつかの問題が考えられます。

## 主な原因と解決策

### 1. **CSSの位置指定の問題**

現在のCSSでは、`.line-numbers`が`position: absolute`で配置されていますが、親要素に`position: relative`が設定されていない可能性があります。

```css
/* File: /Users/mitsuruyoshizumi/workspace/ProgrammingStudy/Algorithm/Mathematics/Permutation Sequence/leetcode/Claude/README.html */
.line-numbers {
    position: absolute;
    left: 0;
    top: 20px;
    width: 40px;
    background: #0f1419;
    border-right: 1px solid #2d3748;
    padding: 0 8px;
    color: white;
    font-size: 0.875rem;
    line-height: 1.6;
    user-select: none;
}

/* 親要素に relative を追加 */
pre {
    padding: 20px;
    background: #1a1b26 !important;
    border-radius: 12px;
    border: 1px solid #2d3748;
    position: relative; /* これが重要 */
}
```

### 2. **z-indexの問題**

行番号が他の要素の後ろに隠れている可能性があります。

```css
/* File: /Users/mitsuruyoshizumi/workspace/ProgrammingStudy/Algorithm/Mathematics/Permutation Sequence/leetcode/Claude/README.html */
.line-numbers {
    position: absolute;
    left: 0;
    top: 20px;
    width: 40px;
    background: #0f1419;
    border-right: 1px solid #2d3748;
    padding: 0 8px;
    color: white;
    font-size: 0.875rem;
    line-height: 1.6;
    user-select: none;
    z-index: 10; /* z-indexを追加 */
}
```

### 3. **HTMLの構造を改善**

現在の構造では、行番号とコードの行の高さが一致しない可能性があります。以下のような改善案があります：

```html
<!-- File: /Users/mitsuruyoshizumi/workspace/ProgrammingStudy/Algorithm/Mathematics/Permutation Sequence/leetcode/Claude/README.html -->
<div class="relative">
    <div class="line-numbers">
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <!-- ... 他の行番号 ... -->
        <div>33</div>
    </div>
    <button class="copy-button" onclick="copyCode('main-code')">Copy</button>
    <pre id="main-code" class="code-with-lines">
        <code class="language-typescript code-content">function getPermutation(n: number, k: number): string {
    // 階乗を事前計算
    const factorial: number[] = [1];
    // ... コードの続き ...
}</code>
    </pre>
</div>
```

### 4. **完全な修正版CSS**

```css
/* File: /Users/mitsuruyoshizumi/workspace/ProgrammingStudy/Algorithm/Mathematics/Permutation Sequence/leetcode/Claude/README.html */
pre {
    padding: 20px;
    padding-left: 60px; /* 行番号のスペースを確保 */
    background: #1a1b26 !important;
    border-radius: 12px;
    border: 1px solid #2d3748;
    position: relative;
    overflow-x: auto;
}

.line-numbers {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 50px;
    background: #0f1419;
    border-right: 1px solid #2d3748;
    padding: 20px 8px;
    color: #6b7280;
    font-size: 0.875rem;
    line-height: 1.6;
    user-select: none;
    z-index: 10;
    display: flex;
    flex-direction: column;
}

.line-numbers div {
    height: 1.6em; /* line-heightと同じ値 */
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 8px;
}

.code-content {
    margin-left: 0; /* padding-leftで調整済み */
}
```

### 5. **デバッグ用の確認方法**

ブラウザの開発者ツールで以下を確認してください：

1. **要素の表示状態**: `.line-numbers`要素が存在するか
2. **CSSの適用**: 計算されたスタイルで`display: none`や`visibility: hidden`になっていないか
3. **位置**: `position`、`left`、`top`の値が正しく適用されているか
4. **重なり**: 他の要素に隠れていないか

最も可能性が高いのは、親要素の`position: relative`が設定されていないことです。この修正により行番号が正しく表示されるはずです。

画像を見ると、行番号は表示されているものの、コードの最初の部分が切れてしまっている問題が確認できます。これは**行番号の幅とコードコンテンツの左パディングの調整**が必要です。

## 問題の原因と解決策

### 1. **行番号の幅とパディングの不一致**

現在の設定では、行番号の幅（50px）とコードの左パディング（60px）に10pxの差がありますが、これが不十分です。

```css
/* File: /Users/mitsuruyoshizumi/workspace/ProgrammingStudy/Algorithm/Mathematics/Permutation Sequence/leetcode/Claude/README.html */
.line-numbers {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 60px; /* 50px → 60px に増加 */
    background: #0f1419;
    border-right: 1px solid #2d3748;
    padding: 20px 8px;
    color: #6b7280;
    font-size: 0.875rem;
    line-height: 1.6;
    user-select: none;
    z-index: 10;
    display: flex;
    flex-direction: column;
}

pre {
    padding: 20px;
    padding-left: 80px; /* 60px → 80px に増加 */
    background: #1a1b26 !important;
    border-radius: 12px;
    border: 1px solid #2d3748;
    position: relative;
    overflow-x: auto;
}
```

### 2. **行番号の右寄せ調整**

行番号をより見やすくするため、右寄せのパディングを調整します。

```css
/* File: /Users/mitsuruyoshizumi/workspace/ProgrammingStudy/Algorithm/Mathematics/Permutation Sequence/leetcode/Claude/README.html */
.line-numbers div {
    height: 1.6em;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 12px; /* 8px → 12px に増加 */
    min-width: 100%; /* 幅を確保 */
}
```

### 3. **完全な修正版CSS**

以下が完全な修正版です：

```css
/* File: /Users/mitsuruyoshizumi/workspace/ProgrammingStudy/Algorithm/Mathematics/Permutation Sequence/leetcode/Claude/README.html */
pre {
    padding: 20px;
    padding-left: 80px; /* 行番号のスペースを十分確保 */
    background: #1a1b26 !important;
    border-radius: 12px;
    border: 1px solid #2d3748;
    position: relative;
    overflow-x: auto;
}

.line-numbers {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 60px; /* 幅を60pxに設定 */
    background: #0f1419;
    border-right: 1px solid #2d3748;
    padding: 20px 0; /* 左右のパディングを0に */
    color: #6b7280;
    font-size: 0.875rem;
    line-height: 1.6;
    user-select: none;
    z-index: 10;
    display: flex;
    flex-direction: column;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
}

.line-numbers div {
    height: 1.6em;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 12px; /* 右側に余白を確保 */
    padding-left: 8px; /* 左側にも少し余白 */
    font-family: 'Courier New', Consolas, 'Liberation Mono', Menlo, monospace;
}

.code-content {
    margin-left: 0;
    display: block;
    width: 100%;
}
```

### 4. **追加の改善案**

より確実に表示するため、以下の追加修正も推奨します：

```css
/* File: /Users/mitsuruyoshizumi/workspace/ProgrammingStudy/Algorithm/Mathematics/Permutation Sequence/leetcode/Claude/README.html */
/* コードブロック全体のコンテナ */
.relative {
    position: relative;
    display: block;
    width: 100%;
}

/* コードの可視性を確保 */
code.language-typescript {
    display: block;
    padding: 0;
    margin: 0;
    background: transparent !important;
}

/* 行番号とコードの同期 */
pre code {
    line-height: 1.6 !important;
    font-size: 0.875rem !important;
}
```

これらの修正により、行番号が正しく表示され、コードの最初の部分が切れる問題も解決されるはずです。

画像を確認すると、確かにコードの左端が切れてしまっています。問題は**行番号の幅とコードのパディングの設定**にあります。以下の修正を適用してください：

## 完全な修正版CSS

```css
/* File: /Users/mitsuruyoshizumi/workspace/ProgrammingStudy/Algorithm/Mathematics/Permutation Sequence/leetcode/Claude/README.html */

/* コードブロック全体 */
pre {
    padding: 20px;
    padding-left: 90px; /* 80px → 90px に増加 */
    background: #1a1b26 !important;
    border-radius: 12px;
    border: 1px solid #2d3748;
    position: relative;
    overflow-x: auto;
    margin: 0;
}

/* 行番号コンテナ */
.line-numbers {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 70px; /* 60px → 70px に増加 */
    background: #0f1419;
    border-right: 1px solid #2d3748;
    padding: 20px 0;
    color: #6b7280;
    font-size: 0.875rem;
    line-height: 1.6;
    user-select: none;
    z-index: 10;
    display: flex;
    flex-direction: column;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
}

/* 行番号の各行 */
.line-numbers div {
    height: 1.6em;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 15px; /* 12px → 15px に増加 */
    padding-left: 5px;
    font-family: 'Courier New', Consolas, 'Liberation Mono', Menlo, monospace;
    min-height: 1.6em; /* 高さを確実に確保 */
}

/* コードコンテンツ */
code.language-typescript {
    display: block;
    padding: 0;
    margin: 0;
    background: transparent !important;
    font-family: 'Courier New', Consolas, 'Liberation Mono', Menlo, monospace !important;
    line-height: 1.6 !important;
    font-size: 0.875rem !important;
    white-space: pre !important;
}

/* コードコンテナ */
.code-content {
    margin-left: 0;
    display: block;
    width: 100%;
    position: relative;
    z-index: 1;
}

/* 追加：コードの左マージンを確実に確保 */
pre code {
    line-height: 1.6 !important;
    font-size: 0.875rem !important;
    display: block;
    margin: 0;
    padding: 0;
}
```

## さらに確実な解決策（代替案）

もし上記でも問題が解決しない場合は、以下のより確実な方法を試してください：

```css
/* File: /Users/mitsuruyoshizumi/workspace/ProgrammingStudy/Algorithm/Mathematics/Permutation Sequence/leetcode/Claude/README.html */

/* より確実な修正版 */
pre {
    padding: 20px 20px 20px 100px; /* 左パディングを100pxに大幅増加 */
    background: #1a1b26 !important;
    border-radius: 12px;
    border: 1px solid #2d3748;
    position: relative;
    overflow-x: auto;
    margin: 0;
}

.line-numbers {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 80px; /* 幅を80pxに増加 */
    background: #0f1419;
    border-right: 1px solid #2d3748;
    padding: 20px 0;
    color: #6b7280;
    font-size: 0.875rem;
    line-height: 1.6;
    user-select: none;
    z-index: 10;
    display: flex;
    flex-direction: column;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
}

.line-numbers div {
    height: 1.6em;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 20px; /* 右パディングを20pxに増加 */
    padding-left: 10px;
    font-family: 'Courier New', Consolas, 'Liberation Mono', Menlo, monospace;
    box-sizing: border-box;
}
```

## 修正のポイント

1. **左パディングを大幅増加**: `80px` → `100px`
2. **行番号の幅を拡大**: `60px` → `80px`
3. **行番号の右パディング増加**: `12px` → `20px`
4. **box-sizing: border-box** を追加して確実な幅計算

これらの修正により、コードの左端が切れる問題が解決されるはずです

コードの左側が切れている問題とコピーボタンが表示されない問題を解決するために、選択されたHTMLセクションを完全に修正します。

```html
<!-- File: /Users/mitsuruyoshizumi/workspace/ProgrammingStudy/Algorithm/Mathematics/Permutation Sequence/leetcode/Claude/README.html -->
                        <div class="card-container fade-in-up">
                            <h2 class="text-2xl font-bold mb-4 text-blue-400">TypeScript実装</h2>
                            <div class="code-block-container">
                                <button class="copy-button" onclick="copyCode('main-code')">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="m5 15-4-4 4-4"></path>
                                    </svg>
                                    Copy
                                </button>
                                <div class="code-wrapper">
                                    <div class="line-numbers-container">
                                        <div class="line-number">1</div>
                                        <div class="line-number">2</div>
                                        <div class="line-number">3</div>
                                        <div class="line-number">4</div>
                                        <div class="line-number">5</div>
                                        <div class="line-number">6</div>
                                        <div class="line-number">7</div>
                                        <div class="line-number">8</div>
                                        <div class="line-number">9</div>
                                        <div class="line-number">10</div>
                                        <div class="line-number">11</div>
                                        <div class="line-number">12</div>
                                        <div class="line-number">13</div>
                                        <div class="line-number">14</div>
                                        <div class="line-number">15</div>
                                        <div class="line-number">16</div>
                                        <div class="line-number">17</div>
                                        <div class="line-number">18</div>
                                        <div class="line-number">19</div>
                                        <div class="line-number">20</div>
                                        <div class="line-number">21</div>
                                        <div class="line-number">22</div>
                                        <div class="line-number">23</div>
                                        <div class="line-number">24</div>
                                        <div class="line-number">25</div>
                                        <div class="line-number">26</div>
                                        <div class="line-number">27</div>
                                        <div class="line-number">28</div>
                                        <div class="line-number">29</div>
                                        <div class="line-number">30</div>
                                        <div class="line-number">31</div>
                                        <div class="line-number">32</div>
                                        <div class="line-number">33</div>
                                    </div>
                                    <pre class="code-pre"><code id="main-code" class="language-typescript">function getPermutation(n: number, k: number): string {
    // 階乗を事前計算
    const factorial: number[] = [1];
    for (let i = 1; i < n; i++) {
        factorial[i] = factorial[i - 1] * i;
    }
    
    // 使用可能な数字のリスト
    const numbers: number[] = [];
    for (let i = 1; i <= n; i++) {
        numbers.push(i);
    }
    
    // k を 0-indexed に変換
    k--;
    
    let result: string = '';
    
    // 各桁を順番に決定
    for (let i = 0; i < n; i++) {
        // インデックス計算
        const index: number = Math.floor(k / factorial[n - 1 - i]);
        
        // 数字を結果に追加
        result += numbers[index];
        
        // 使用済み数字を削除
        numbers.splice(index, 1);
        
        // k を更新
        k %= factorial[n - 1 - i];
    }
    
    return result;
}</code></pre>
                                </div>
                            </div>
                        </div>
```

そして、対応するCSSスタイルを追加してください：

```css
/* File: /Users/mitsuruyoshizumi/workspace/ProgrammingStudy/Algorithm/Mathematics/Permutation Sequence/leetcode/Claude/README.html */

/* コードブロック全体のコンテナ */
.code-block-container {
    position: relative;
    background: #1a1b26;
    border-radius: 12px;
    border: 1px solid #2d3748;
    overflow: hidden;
}

/* コピーボタン */
.copy-button {
    position: absolute;
    top: 12px;
    right: 12px;
    background: #374151;
    color: #d1d5db;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.75rem;
    transition: all 0.2s;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 500;
}

.copy-button:hover {
    background: #4b5563;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.copy-button svg {
    width: 14px;
    height: 14px;
}

/* コードラッパー */
.code-wrapper {
    display: flex;
    min-height: 100%;
}

/* 行番号コンテナ */
.line-numbers-container {
    background: #0f1419;
    border-right: 1px solid #2d3748;
    padding: 20px 0;
    min-width: 60px;
    flex-shrink: 0;
}

.line-number {
    height: 1.6em;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 16px;
    padding-left: 8px;
    color: #6b7280;
    font-size: 0.875rem;
    font-family: 'Courier New', Consolas, 'Liberation Mono', Menlo, monospace;
    line-height: 1.6;
    user-select: none;
}

/* コードプリ要素 */
.code-pre {
    flex: 1;
    margin: 0;
    padding: 20px;
    background: transparent;
    border: none;
    overflow-x: auto;
}

/* コード要素 */
.language-typescript {
    display: block;
    padding: 0;
    margin: 0;
    background: transparent !important;
    font-family: 'Courier New', Consolas, 'Liberation Mono', Menlo, monospace !important;
    line-height: 1.6 !important;
    font-size: 0.875rem !important;
    white-space: pre !important;
    color: #e2e8f0 !important;
    border: none;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
    .line-numbers-container {
        min-width: 50px;
    }
    
    .line-number {
        padding-right: 12px;
        font-size: 0.75rem;
    }
    
    .code-pre {
        padding: 16px;
    }
    
    .language-typescript {
        font-size: 0.75rem !important;
    }
}
```

この修正により：

1. **コードの左側が切れる問題を解決**：新しいflexboxレイアウトでコードが確実に表示されます
2. **コピーボタンが表示されない問題を解決**：z-indexを100に設定し、確実に最前面に表示されます
3. **レスポンシブ対応**：モバイルデバイスでも適切に表示されます
4. **視覚的改善**：アイコン付きのコピーボタンとより良いスタイリング

コードが正しく表示されていないようですね。CSSの重複とレイアウトの問題を修正します。以下の修正されたHTMLセクションに置き換えてください：

```html
<!-- File: /Users/mitsuruyoshizumi/workspace/ProgrammingStudy/Algorithm/Mathematics/Permutation Sequence/leetcode/Claude/README.html -->
                        <div class="card-container fade-in-up">
                            <h2 class="text-2xl font-bold mb-4 text-blue-400">TypeScript実装</h2>
                            <div class="code-block-container">
                                <button class="copy-button" onclick="copyCode('main-code')">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="m5 15-4-4 4-4"></path>
                                    </svg>
                                    Copy
                                </button>
                                <div class="code-wrapper">
                                    <div class="line-numbers-container">
                                        <div class="line-number">1</div>
                                        <div class="line-number">2</div>
                                        <div class="line-number">3</div>
                                        <div class="line-number">4</div>
                                        <div class="line-number">5</div>
                                        <div class="line-number">6</div>
                                        <div class="line-number">7</div>
                                        <div class="line-number">8</div>
                                        <div class="line-number">9</div>
                                        <div class="line-number">10</div>
                                        <div class="line-number">11</div>
                                        <div class="line-number">12</div>
                                        <div class="line-number">13</div>
                                        <div class="line-number">14</div>
                                        <div class="line-number">15</div>
                                        <div class="line-number">16</div>
                                        <div class="line-number">17</div>
                                        <div class="line-number">18</div>
                                        <div class="line-number">19</div>
                                        <div class="line-number">20</div>
                                        <div class="line-number">21</div>
                                        <div class="line-number">22</div>
                                        <div class="line-number">23</div>
                                        <div class="line-number">24</div>
                                        <div class="line-number">25</div>
                                        <div class="line-number">26</div>
                                        <div class="line-number">27</div>
                                        <div class="line-number">28</div>
                                        <div class="line-number">29</div>
                                        <div class="line-number">30</div>
                                        <div class="line-number">31</div>
                                        <div class="line-number">32</div>
                                        <div class="line-number">33</div>
                                    </div>
                                    <pre class="code-pre"><code id="main-code" class="language-typescript">function getPermutation(n: number, k: number): string {
    // 階乗を事前計算
    const factorial: number[] = [1];
    for (let i = 1; i < n; i++) {
        factorial[i] = factorial[i - 1] * i;
    }
    
    // 使用可能な数字のリスト
    const numbers: number[] = [];
    for (let i = 1; i <= n; i++) {
        numbers.push(i);
    }
    
    // k を 0-indexed に変換
    k--;
    
    let result: string = '';
    
    // 各桁を順番に決定
    for (let i = 0; i < n; i++) {
        // インデックス計算
        const index: number = Math.floor(k / factorial[n - 1 - i]);
        
        // 数字を結果に追加
        result += numbers[index];
        
        // 使用済み数字を削除
        numbers.splice(index, 1);
        
        // k を更新
        k %= factorial[n - 1 - i];
    }
    
    return result;
}</code></pre>
                                </div>
                            </div>
                        </div>
```

また、CSSの重複部分を削除する必要があります。以下のCSSセクションを削除してください：

```css
/* 削除する重複CSS */
.copy-button {
    position: absolute;
    top: 12px;
    right: 12px;
    background: #374151;
    color: #d1d5db;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.75rem;
    transition: all 0.2s;
}

.copy-button:hover {
    background: #4b5563;
    transform: translateY(-1px);
}
```

この修正により：

1. **コードの表示が正しく整列**されます
2. **行番号とコードが同期**します
3. **コピーボタンが正しく表示**されます
4. **レスポンシブデザイン**が適用されます
5. **CSS重複が解消**されます

修正後は、TypeScriptコードが適切にフォーマットされ、行番号と共に表示されるはずです。