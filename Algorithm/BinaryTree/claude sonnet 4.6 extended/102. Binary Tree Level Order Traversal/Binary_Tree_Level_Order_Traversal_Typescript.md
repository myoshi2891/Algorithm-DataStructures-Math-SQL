> 🎯 **[algo-beginner スキル発火]**
> 言語/カテゴリ: TypeScript
> 適用ルールセット: 共通5ルール + TS固有5ルール
> 参照ファイル: references/common.md + references/typescript.md

---

# LeetCode 102 · Binary Tree Level Order Traversal — TypeScript版

---

## 目次（Table of Contents）

- [1. Overview](#overview)
- [2. Algorithm](#algorithm)
- [3. Complexity](#complexity)
- [4. Implementation](#implementation)
- [5. Optimization](#optimization)

---

<h2 id="overview">1. Overview</h2>

> 💡 **この問題は一言で言うと「木を上から下へ、同じ高さのノードをまとめてグループ化する問題」です。**
> 木の「同じ深さ（階層）」にあるすべての値をひとつの配列にまとめ、その配列を深さ順に並べた2次元配列を返します。

```
        3          ← 深さ0: [3]
       / \
      9  20        ← 深さ1: [9, 20]
         / \
        15   7     ← 深さ2: [15, 7]

出力: [[3], [9, 20], [15, 7]]
```

### 競技プログラミング・業務開発視点

- **ノード数**: 最大 2000 なので O(n) が必須。
- **型安全性**: `TreeNode | null` という **Union型** を安全に扱う必要がある。
- **JSの特性**: `Array.shift()` は $O(n)$ のため、キューとして使う場合はポインタ管理（$O(1)$）を行う必要がある。

> 📖 **このセクションで登場した用語**
>
> - **Union型**：`A | B` のように「AまたはB」を表す TypeScript の型
> - **null安全性**：`null` や `undefined` によるクラッシュをコンパイル時に防ぐ仕組み
> - **型ガード**：`if (node !== null)` のような条件で、その後のコードブロック内の型を自動的に絞り込む仕組み

---

<h2 id="algorithm">2. Algorithm</h2>

### アプローチ比較

| アプローチ                 | 時間計算量 | 空間計算量 | 備考                             |
| -------------------------- | ---------- | ---------- | -------------------------------- |
| **BFS（幅優先探索）**      | O(n)       | O(n)       | ✅ 今回の選択                    |
| DFS（深さ優先探索）        | O(n)       | O(n)       | 再帰でも実装可能だが直感的でない |
| 総当たり（各深さでループ） | O(n²)      | O(n)       | 非推奨                           |

### BFS（幅優先探索）の仕組み

BFS は「同じ階のすべての部屋を開けてから、次の階に進むエレベーター」のようなものです。
これを実現するのが **キュー（FIFO: First In, First Out）** です。

- **核心テクニック**: キューから「今の階のノード数分だけ」取り出すことで、自然に「1階ぶんのグループ」が作れる。
- **TypeScript特有の工夫**: キューの型を `TreeNode[]` と明示することで、取り出した要素が必ず `TreeNode` 型になりコンパイル時に安全を保証。

---

<h2 id="complexity">3. Complexity</h2>

| 項目           | 値   | 理由                                                                                         |
| -------------- | ---- | -------------------------------------------------------------------------------------------- |
| **時間計算量** | O(n) | 各ノードをキューへの追加・取り出しでちょうど1回ずつ処理するため（ポインタ管理で各操作 O(1)） |
| **空間計算量** | O(n) | キューに最大で「木の最も広い階のノード数」が入る。最悪ケースは全ノード数 n に比例            |

---

<h2 id="implementation">4. Implementation</h2>

### 業務開発版（型安全・パフォーマンス最適化）

```typescript
function levelOrder(root: TreeNode | null): number[][] {
    if (root === null) return [];

    const result: number[][] = [];
    const queue: TreeNode[] = [root];
    let head = 0; // shift() の O(n) を避けるための先頭ポインタ

    while (head < queue.length) {
        // ── 今この瞬間のキューの長さ = 「現在の階のノード数」 ──
        // 未処理分（queue.length - head）を変数に保存して固定する。
        const levelSize: number = queue.length - head;
        const levelValues: number[] = [];

        for (let i = 0; i < levelSize; i++) {
            // head インデックスでポインタを進めることで O(1) で取り出す
            const node = queue[head++]!;
            levelValues.push(node.val);

            // 次の階の準備
            if (node.left !== null) queue.push(node.left);
            if (node.right !== null) queue.push(node.right);
        }

        result.push(levelValues);
    }

    return result;
}
```

### 🔍 動作トレース（`root = [3, 9, 20, null, null, 15, 7]`）

```
━━━━━━━━━━ while ループ 1回目（深さ0） ━━━━━━━━━━
  levelSize  = 1          ← queue.length(1) - head(0) = 1
  i=0: node = queue[head++] → Node(3)   queue = [3], head = 1
       node.left = 9, node.right = 20 を queue に追加
  result.push([3])

━━━━━━━━━━ while ループ 2回目（深さ1） ━━━━━━━━━━
  levelSize  = 2          ← queue.length(3) - head(1) = 2
  i=0, 1: Node(9), Node(20) を処理
  result.push([9, 20])
```

---

<h2 id="optimization">5. Optimization</h2>

### パフォーマンス最適化：`Array.shift()` の回避

JavaScript の `Array.shift()` は、先頭要素を削除した後に残り全要素のインデックスを 1 つずつ前にずらすため、**$O(n)$ の計算量**がかかります。
キュー操作を伴う BFS で `shift()` をループ内で使用すると、全体の計算量が **$O(n^2)$** に悪化してしまいます。

**解決策：**
`head` 変数を用いて現在の先頭位置を指し示し、要素を取り出すたびに `head++` する方式を採用します。これにより、実質的な削除操作を伴わずに $O(1)$ で先頭要素を取得できます。

> 📖 **このセクションで登場した用語**
>
> - **`head` インデックス**：配列の先頭を指すポインタ。
> - **FIFO**：First In First Out。先に入れたものを先に取り出す順序。
> - **`!`（非null断言）**：TypeScriptに「この値は絶対 null でない」と伝える記号。
