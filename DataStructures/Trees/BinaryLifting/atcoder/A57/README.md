了解しました。以下にこの問題を **TypeScript** で解く方法と、各処理の**図解つきの解説**を行います。

---

## 🔁 問題の本質：移動先が固定された「写像の繰り返し」

---

## 🌱 問題設定の図解

### 🔢 入力例

```
N = 7
A = [2, 4, 1, 7, 6, 5, 3]   // Ai：穴 i にいる翌日どの穴へ行くか（1-indexed）

クエリ:
1 1   → 穴 1 から1日後
1 5   → 穴 1 から5日後
2 13  → 穴 2 から13日後
5 999999999
```

### 🕳️ 穴の遷移図（1-indexed）

```
1 → 2 → 4 → 7 → 3 → 1 (サイクル)
5 → 6 → 5 (別のサイクル)
```

---

## 🧠 解法：**ダブリング法（Binary Lifting）**

### ❓目的：

`Y` 日後の位置を、2進数に分解して高速にジャンプ。

> Y = 13 = 2⁰ + 2² + 2³ →
> x → A⁽¹⁾(x) → A⁽⁴⁾(x) → A⁽⁸⁾(x)

---

## 🔧 TypeScript 実装

```ts
import * as fs from 'fs';

// 入力処理
const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\s+/);
let idx = 0;

const N = parseInt(input[idx++]);
const Q = parseInt(input[idx++]);
const A = input.slice(idx, idx + N).map((v) => parseInt(v) - 1); // 0-indexed
idx += N;

// 定数：最大ビット数（2^30 > 10^9）
const LOG = 30;

// doubling[k][i] := i番の穴から2^k日後にいる穴の番号
const doubling: number[][] = Array.from({ length: LOG }, () => Array(N).fill(0));

// 初期（1日後）
for (let i = 0; i < N; i++) {
    doubling[0][i] = A[i];
}

// ダブリング表作成：2^k 日後をすべて事前計算
for (let k = 1; k < LOG; k++) {
    for (let i = 0; i < N; i++) {
        doubling[k][i] = doubling[k - 1][doubling[k - 1][i]];
    }
}

const result: number[] = [];

for (let q = 0; q < Q; q++) {
    let x = parseInt(input[idx++]) - 1; // 0-indexed
    let y = parseInt(input[idx++]);

    for (let k = 0; k < LOG; k++) {
        if ((y >> k) & 1) {
            x = doubling[k][x];
        }
    }
    result.push(x + 1); // 1-indexedで戻す
}

console.log(result.join('\n'));
```

---

## 🔍 図で理解する「ダブリング表」

### `doubling[k][i]`: 「穴 i から 2^k 日後にいる穴」

```
k = 0 (1日後):     doubling[0][i] = A[i]
k = 1 (2日後):     doubling[1][i] = doubling[0][doubling[0][i]]
k = 2 (4日後):     doubling[2][i] = doubling[1][doubling[1][i]]
...
```

### 例）穴1の遷移

```
doubling[0][0] = 1   // A[1] = 2
doubling[1][0] = A[ A[1] ] = A[2] = 4 → index = 3
doubling[2][0] = A[ A[ A[ A[1] ] ] ] = ?
```

---

## ⚡ クエリ処理の図解：Y=13 を例に

Y = 13 = 1101₂ → 1×2⁰ + 0×2¹ + 1×2² + 1×2³

```
現在地 x = 2

1. k = 0 → 2^0日後 → x = doubling[0][x]
2. k = 2 → 2^2日後 → x = doubling[2][x]
3. k = 3 → 2^3日後 → x = doubling[3][x]
```

---

## 🧮 計算量（オーダー）

| 処理             | 時間計算量                     |
| ---------------- | ------------------------------ |
| 前処理（表作成） | O(N logY)                      |
| クエリ処理       | O(Q logY)                      |
| **全体**         | O((N + Q) × logY) → 約 3 × 10⁶ |

---

## ✅ 出力例（入力例1）

```
2
1
3
6
```

---

## 💡 補足

この手法は、「f(f(f(...f(x)...))) を高速に求めたい」ような繰り返し写像の問題に有効です。

---

## 📌 前提理解：「ある穴 `i` にいるアリが、Y日後にどこにいるか？」

---

## 🧠 ポイント：ダブリング表の構築と利用

---

## ✅ 1. `const LOG = 30;`

- 最大で **10⁹日後**（Y ≦ 1e9）を処理する必要がある。
- 2^30 ≈ 10億 ⇒ 30ステップあれば最大日数を **2進数で全表現**できる。

📌 例：

```
Y = 13 → 1101 (2進数) → 2^3 + 2^2 + 2^0
```

---

## ✅ 2. `doubling[k][i]` の定義

```ts
const doubling: number[][] = Array.from({ length: LOG }, () => Array(N).fill(0));
```

- `doubling[k][i]` は「穴 `i` から **2^k 日後** にいる穴の番号（0-indexed）」

📌 例：

```
doubling[0][i] → A[i]         // 1日後
doubling[1][i] → A[A[i]]      // 2日後
doubling[2][i] → A[A[A[A[i]]]] // 4日後
...
```

> 結果として、全ての「2^k日後の位置」が事前に分かっていれば、任意の日数も2進数で分解して飛び石のように移動できる！

---

## ✅ 3. 初期化（1日後）

```ts
for (let i = 0; i < N; i++) {
    doubling[0][i] = A[i]; // 1日後 = A[i]そのもの
}
```

📌 例：A = \[2, 4, 1, 7, 6, 5, 3] (1-indexed)

```
0-indexed変換: A = [1, 3, 0, 6, 5, 4, 2]

doubling[0] = [1, 3, 0, 6, 5, 4, 2]
```

---

## ✅ 4. ダブリング表の構築

```ts
for (let k = 1; k < LOG; k++) {
    for (let i = 0; i < N; i++) {
        doubling[k][i] = doubling[k - 1][doubling[k - 1][i]];
    }
}
```

### 🧱 意味：

- 「2^k日後にいる穴」は、「2^(k-1)日後に行った先から、さらに2^(k-1)日後に行った先」

### 📌 例：穴 i=0（0-indexed）に注目

```ts
k = 1:
doubling[1][0] = doubling[0][doubling[0][0]]
               = doubling[0][1]
               = 3

k = 2:
doubling[2][0] = doubling[1][doubling[1][0]]
               = doubling[1][3]
               = doubling[0][doubling[0][3]]
               = doubling[0][6] = 2
```

図で見ると：

```
i=0 → doubling[0][0]=1 → doubling[0][1]=3 → doubling[0][3]=6 → ...
     └── 1日   ──┘      └── 2日  ──┘      └── 4日 ──┘
```

---

## ✅ 5. クエリ処理：Y日後をジャンプ！

```ts
for (let q = 0; q < Q; q++) {
    let x = parseInt(input[idx++]) - 1;
    let y = parseInt(input[idx++]);

    for (let k = 0; k < LOG; k++) {
        if ((y >> k) & 1) {
            x = doubling[k][x];
        }
    }

    result.push(x + 1);
}
```

### 📌 処理内容：

- `Y` を2進数で見て、`k` ビットが立っていれば `2^k` 日ジャンプする。
- 結果を x にどんどん更新していく。

---

### 🔍 例：クエリ `x=1`, `y=13`（→0-indexed: x=0）

```
y = 13 = 1101 (2進数)
       → k = 0, 2, 3 にビットが立っている

処理:
- k=0 → doubling[0][x] = 1 → x = 1
- k=2 → doubling[2][1] = 0 → x = 0
- k=3 → doubling[3][0] = 2 → x = 2

最終的に x = 2 → 出力は x+1 = 3
```

---

## 🧮 まとめ：ダブリング法の要点

| ステップ      | 内容                                                   |
| ------------- | ------------------------------------------------------ |
| 1. LOG 定義   | 最大日数に対して必要なビット数（2^30 > 10^9）          |
| 2. 表初期化   | 1日後の状態（doubling\[0]\[i] = A\[i]）                |
| 3. 表構築     | doubling\[k]\[i] = doubling\[k-1]\[doubling\[k-1]\[i]] |
| 4. クエリ処理 | Y を2進数に分解し、bitが立っている部分だけジャンプ     |

---

## 👀 補足図（ジャンプのイメージ）

```text
i = 0
Y = 13 = 2^3 + 2^2 + 2^0

x → doubling[0][x] → doubling[2][x] → doubling[3][x]

     └─1d────┘       └─4d────┘       └─8d────┘
```

---

もちろんです。ここでは「**ダブリング法（Binary Lifting）**」を、**概念・目的・仕組み・適用例・実装方法**に分けて、図や具体例を交えながらわかりやすく詳しく解説します。

---

## 🧠 概念：ダブリング法（Binary Lifting）とは？

### 🔷 一言で：

> **「f(f(f(...f(x)...))) のような繰り返し処理を高速に求めるためのテクニック」**

- ある要素 `x` に関数 `f` を **Y回** 適用した結果 `f^Y(x)` を求めたい。
- 単純に1回ずつ適用すると O(Y) かかる。
- ダブリング法では、O(logY) に高速化できる！

---

## 🧩 目的：繰り返し操作の高速化

| 課題例                         | ダブリングの適用シーン          |
| ------------------------------ | ------------------------------- |
| `f(x)` を Y 回適用             | アリの移動、関数反復            |
| 木構造での LCA（最小共通祖先） | 距離を 2⁰, 2¹, 2²… ずつジャンプ |
| グラフ上のジャンプ             | ワープ、親ノードの検索など      |

---

## 🏗️ 仕組み：2進数の考え方を活用

### 例：

`f^13(x)` を求めたい場合

```
13 = 1101 (2進数)
   = 2^3 + 2^2 + 2^0

つまり:
f^13(x) = f^8(f^4(f^1(x)))
```

これにより、事前に `f^(2^k)(x)` を保存しておけば、
任意の Y に対して logY 回の操作で `f^Y(x)` を計算できる。

---

## 📊 データ構造（テーブル）

作るのは次のようなテーブル `doubling[k][i]`：

| k   | 内容                        |
| --- | --------------------------- |
| 0   | `f(x)`                      |
| 1   | `f(f(x))`                   |
| 2   | `f(f(f(f(x))))`             |
| k   | `f` を `2^k` 回適用した結果 |

---

## 💻 具体例：アリの穴移動問題

### 問題設定（再掲）：

アリが穴 `i` に入ると翌日は穴 `A[i]` に移動する。今いる穴から Y 日後にはどこにいる？

---

### 🔧 ステップで解説

#### ステップ 1: 初期状態（1日後）

```ts
doubling[0][i] = A[i]; // A: i番の穴 → 次の日どこへ行くか
```

#### ステップ 2: 2^k 日後を計算

```ts
doubling[k][i] = doubling[k - 1][doubling[k - 1][i]];
```

図示すると：

```
i -[2^(k-1)]→ A1 -[2^(k-1)]→ A2 = 2^k日後の穴
```

#### ステップ 3: クエリ処理

```ts
for (let k = 0; k < LOG; k++) {
    if ((Y >> k) & 1) {
        x = doubling[k][x];
    }
}
```

Y の 2進数のビットが 1 になっているところだけ適用していく。

---

## 📈 時間計算量の比較

| 方法         | 時間    |
| ------------ | ------- |
| 1日ずつ適用  | O(Y)    |
| ダブリング法 | O(logY) |

たとえば Y = 10^9 でも、log₂10⁹ ≈ 30 回のジャンプで済む！

---

## 🌳 応用：LCA（二分木の最小共通祖先）

- 木構造において、ノード `u` と `v` の最も近い共通祖先を見つけたい
- まず `u` と `v` を高さを揃えるまで 2^k ステップで持ち上げる
- その後2^k単位で一緒に上がっていき、祖先が一致したところで止める

この操作にも Binary Lifting が使われます。

---

## ✅ メリット

- 任意回数の繰り返しに対して効率が良い（logYで対応）
- 一度構築すれば、複数クエリにも高速対応可能（O(1)\~O(logY)）

---

## ❌ デメリット

- `O(N logY)` のメモリと前処理時間が必要
- 状態空間が大きすぎるとメモリが厳しいことも（特に2次元配列）

---

## 💡 まとめ

| 項目       | 内容                                              |
| ---------- | ------------------------------------------------- |
| 名前       | ダブリング法（Binary Lifting）                    |
| 用途       | 関数の繰り返し、LCA、ワープジャンプ、高速移動など |
| 技術の核   | 2進数 + 再帰関係を事前計算して高速参照            |
| 時間計算量 | O(logY)                                           |
| 典型問題   | アリの移動、LCA、ワープ空間探索                   |

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                             | ユーザ                                            | 言語                                                                                                        | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果   | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-06-11 14:26:13                                                                           | [A57 - Doubling](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_be) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)                  | 1000                                                                                    | 923 Byte                                                                                  | **AC** | 453 ms                                                                                       | 73592 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66657860) |
| 2025-06-11 14:23:59                                                                           | [A57 - Doubling](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_be) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002)                   | 1000                                                                                    | 1182 Byte                                                                                 | **AC** | 189 ms                                                                                       | 27508 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66657835) |
| 2025-06-11 14:22:38                                                                           | [A57 - Doubling](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_be) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)          | 1000                                                                                    | 1054 Byte                                                                                 | **AC** | 689 ms                                                                                       | 59588 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66657815) |
| 2025-06-11 14:00:49                                                                           | [A57 - Doubling](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_be) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000                                                                                    | 1140 Byte                                                                                 | **AC** | 317 ms                                                                                       | 106652 KiB                                                                                   | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66657511) |
| 2025-06-11 13:55:23                                                                           | [A57 - Doubling](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_be) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009)     | 1000                                                                                    | 1043 Byte                                                                                 | **AC** | 254 ms                                                                                       | 106580 KiB                                                                                   | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66657444) |
