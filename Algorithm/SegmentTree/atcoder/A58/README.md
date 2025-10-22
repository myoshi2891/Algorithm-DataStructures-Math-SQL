---

## ✅ 問題の概要

* 数列 `A`（長さ N）を操作する2種類のクエリを高速に処理します：

  1. `1 pos x` → A\[pos] を x に更新
  2. `2 l r` → A\[l], A\[l+1], ..., A\[r-1] の最大値を出力

---

## ✅ TypeScript 実装（Node.js環境向け）

```ts
class SegmentTree {
    private size: number;
    private tree: number[];

    constructor(n: number) {
        this.size = 1;
        while (this.size < n) this.size <<= 1;
        this.tree = Array(this.size * 2).fill(0);
    }

    // 更新処理: A[pos] = value
    update(pos: number, value: number): void {
        pos += this.size;
        this.tree[pos] = value;
        while (pos > 1) {
            pos >>= 1;
            this.tree[pos] = Math.max(this.tree[pos * 2], this.tree[pos * 2 + 1]);
        }
    }

    // クエリ処理: 区間 [l, r) の最大値を取得
    query(l: number, r: number): number {
        l += this.size;
        r += this.size;
        let res = 0;
        while (l < r) {
            if (l % 2 === 1) res = Math.max(res, this.tree[l++]);
            if (r % 2 === 1) res = Math.max(res, this.tree[--r]);
            l >>= 1;
            r >>= 1;
        }
        return res;
    }
}
```

---

## ✅ データ構造の図解

`SegmentTree` は次のような**完全二分木**で構成されます（例：N = 4）：

```
Index:     1
        ┌─────┐
        │Max(0..3)│
        └─────┘
       /         \
Index: 2           3
     ┌───┐       ┌───┐
     │0..1│       │2..3│
     └───┘       └───┘
    /     \     /     \
Index: 4   5   6       7
      [0] [1] [2]     [3]  ← Aの要素（葉）
```

- セグメントツリーは `2N` サイズの配列で管理され、インデックス `N` から `2N-1` までが実データ（Aの値）に対応。
- 内部ノードは、子の最大値を保持。

---

## ✅ 各処理の図解と流れ

### 🔁 1. 更新クエリ `1 pos x`

**目的：** `A[pos] = x` に変更し、上のノードも再計算。

#### 例：

```txt
1 2 8  ← A[2] を 8 に
```

#### 図の変化：

```
更新対象: pos = 2 → 配列上では index = 2 + size

（再帰的に上のノードを更新）

         [Max(0..3)=?]
         /         \
    [Max(0..1)=?]   ...
     /       \
 [0]         [8] ← 更新
```

### 🔍 2. 区間クエリ `2 l r`

**目的：** `A[l], A[l+1], ..., A[r-1]` の最大値を O(log N) で取得

#### 例：

```txt
2 1 4  ← A[1]～A[3] の最大値
```

#### 図の探索の流れ（必要な区間だけ探索）：

```
対象範囲: [1, 4) → 木上の複数ノードをまたぐ

（必要な部分だけ比較）

         [0..3]
         /     \
   [0..1]     [2..3]
    /  \       /  \
  0    8     3    5
```

→ `8` が最大値なので出力。

---

## ✅ 使用例（標準入力処理）

Node.js の `readline` モジュールで以下のように利用できます：

```ts
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let n = 0,
    q = 0,
    count = 0;
const queries: string[] = [];

rl.on('line', (line) => {
    if (count === 0) {
        [n, q] = line.split(' ').map(Number);
    } else {
        queries.push(line);
        if (queries.length === q) rl.close();
    }
    count++;
});

rl.on('close', () => {
    const seg = new SegmentTree(n);
    const result: number[] = [];

    for (const query of queries) {
        const parts = query.split(' ').map(Number);
        if (parts[0] === 1) {
            const [, pos, x] = parts;
            seg.update(pos - 1, x); // 0-based
        } else {
            const [, l, r] = parts;
            result.push(seg.query(l - 1, r - 1));
        }
    }

    console.log(result.join('\n'));
});
```

---

上の図は、数列 A = [5, 3, 8, 6, 2, 7, 4, 9] に対する セグメントツリー（区間最大値用） を可視化したものです。

## ✅ まとめ

| 操作       | 処理時間 | 説明                     |
| ---------- | -------- | ------------------------ |
| 更新       | O(log N) | 値の変更と親ノードの更新 |
| 区間最大値 | O(log N) | 木をまたいで探索         |

---

### 🔍 説明

- 一番下の段（葉ノード）が `A` の要素に対応しています。
- 上のノードは、**子ノードの最大値**を保持しています。
- ルートノード（頂点）は全体の最大値 `9` を表します。

---

### 💡 例：`query(2, 6)`（A\[2]～A\[5] の最大値）

このクエリに対応するインデックスは 0-based で `[2, 6)`、つまり `[8, 6, 2, 7]` → 最大値は `8`。

セグメントツリーでは、次のような部分ノードを使って効率よく求めます（図中で下位にある該当ノードを確認）：

- 範囲 `[2, 3]`（8）
- 範囲 `[4, 5]`（7）
- それぞれの最大値を比較して答えを得ます。

---

### ✅ セグメントツリーの利点

- **高速な更新**と\*\*部分区間の集約（最大値、和、最小値など）\*\*に強い。
- 1回の更新・クエリあたり **O(log N)**。

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                                                | ユーザ                                            | 言語                                                                                                        | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果   | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-06-12 13:54:08                                                                           | [A58 - RMQ (Range Maximum Queries)](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bf) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)                  | 1000                                                                                    | 1569 Byte                                                                                 | **AC** | 248 ms                                                                                       | 25376 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66675703) |
| 2025-06-12 13:51:48                                                                           | [A58 - RMQ (Range Maximum Queries)](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bf) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002)                   | 1000                                                                                    | 1986 Byte                                                                                 | **AC** | 41 ms                                                                                        | 12716 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66675668) |
| 2025-06-12 13:50:10                                                                           | [A58 - RMQ (Range Maximum Queries)](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bf) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)          | 1000                                                                                    | 1413 Byte                                                                                 | **AC** | 474 ms                                                                                       | 34664 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66675653) |
| 2025-06-12 13:19:27                                                                           | [A58 - RMQ (Range Maximum Queries)](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bf) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000                                                                                    | 1678 Byte                                                                                 | **AC** | 220 ms                                                                                       | 80220 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66675265) |
| 2025-06-12 13:13:59                                                                           | [A58 - RMQ (Range Maximum Queries)](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bf) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009)     | 1000                                                                                    | 1316 Byte                                                                                 | **AC** | 188 ms                                                                                       | 81496 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66675217) |
