
---

# 💼 問題の本質

会社の社員構造は **「木構造（根付き木）」** です。

* 社員1が社長（根ノード）
* 社員iの直属の上司A\[i]が与えられ、木が形成されます。
* **各社員の部下数**（直属＋間接のすべて）を求める問題です。

---

# 🧩 例を使って解説

例:

```
入力:
7
1 1 3 2 4 4
```

### 🌱 ステップ①：上司→部下関係から木構造を作る

社員 `i` の直属の上司が `A[i - 2]` です（i は 2 から始まる）。

| i (社員番号) | A\[i-2] (上司) |
| -------- | ------------ |
| 2        | 1            |
| 3        | 1            |
| 4        | 3            |
| 5        | 2            |
| 6        | 4            |
| 7        | 4            |

これを「木構造」として描くと次のようになります：

```
          1
        /   \
       2     3
      /       \
     5         4
              / \
             6   7
```

* 社員1の部下: 2,3,5,4,6,7（6人）
* 社員2の部下: 5（1人）
* 社員3の部下: 4,6,7（3人）
* 社員4の部下: 6,7（2人）
* 社員5,6,7 は部下なし（0人）

---

# 🔧 ステップ②：ツリー構築（コード）

```ts
const tree: number[][] = Array.from({ length: N + 1 }, () => []);
for (let i = 0; i < A.length; i++) {
    const parent = A[i];      // 上司
    const child = i + 2;      // 社員番号（2 から N）
    tree[parent].push(child); // 上司の子リストに追加
}
```

### 🧱 `tree` の中身（隣接リスト）

```
tree[1] = [2, 3]
tree[2] = [5]
tree[3] = [4]
tree[4] = [6, 7]
tree[5] = []
tree[6] = []
tree[7] = []
```

---

# 🔁 ステップ③：DFSで部下数を計算

再帰的に木をたどって、各社員の部下数を計算します。

```ts
const dfs = (node: number): number => {
    let count = 0;
    for (const child of tree[node]) {
        count += 1 + dfs(child); // 自分の部下＋その子の部下たち
    }
    subordinates[node] = count;
    return count;
};
```

### ✨ `dfs(1)` の計算フロー（再帰呼び出しの図）

```
dfs(1)
 ├ dfs(2)
 │  └ dfs(5) → 0（部下なし）
 │     → count = 1（5だけ）
 ├ dfs(3)
 │  └ dfs(4)
 │     ├ dfs(6) → 0
 │     └ dfs(7) → 0
 │     → count = 2（6,7）
 │  → count = 3（4,6,7）
→ count = 6（2,3,4,5,6,7）
```

---

# 🧾 ステップ④：結果出力

```ts
console.log(subordinates.slice(1).join(' '));
```

### 🧮 結果配列の中身

| 社員番号 | 部下数 |
| ---- | --- |
| 1    | 6   |
| 2    | 1   |
| 3    | 3   |
| 4    | 2   |
| 5    | 0   |
| 6    | 0   |
| 7    | 0   |

出力（空白区切り）：

```
6 1 3 2 0 0 0
```

---

# 🧠 全体の処理フローまとめ

```plaintext
【入力】
    N, A[2..N]

【処理】
    1. 木構造を構築（tree[親] に 子を追加）
    2. DFS で各ノードの子孫数（部下数）を計算
    3. 結果を出力

【アルゴリズム】
    時間計算量：O(N)
    空間計算量：O(N)
```

---

# 📌 補足：実行時の注意点

* Node.jsで動作させる際は、`fs.readFileSync('/dev/stdin')` を使います（AtCoderなど）。
* 木構造は必ず acyclic（ループなし）なので無限再帰の心配はありません。
* `N`が最大10万でも、O(N)なので1秒以内に収まります。

---

# 🧩 対象の処理の目的

```ts
// 部下数を格納する配列（1-indexed）
const subordinates: number[] = Array(N + 1).fill(0);

// DFSで部下数を計算
const dfs = (node: number): number => {
    let count = 0;
    for (const child of tree[node]) {
        count += 1 + dfs(child); // 1（直属） + その子の部下数
    }
    subordinates[node] = count;
    return count;
};

dfs(1); // 社長からスタート
```

この処理の目的は：
✅ **社員1を起点に全社員の部下数をDFSで計算して、`subordinates[社員番号]` に記録すること**です。

---

# 🧱 変数の役割

```ts
const subordinates: number[] = Array(N + 1).fill(0);
```

* 社員の部下数を格納する配列（1-indexed）
* `subordinates[1]` に社員1の部下数
* `subordinates[2]` に社員2の部下数
* …というように使います。
* `N + 1` とすることで、インデックス1〜Nを直接使えるようにしています。

---

# 🔁 DFS関数の詳細

```ts
const dfs = (node: number): number => {
    let count = 0;
    for (const child of tree[node]) {
        count += 1 + dfs(child);
    }
    subordinates[node] = count;
    return count;
};
```

### 🔍 分解して解説

#### ① `let count = 0;`

* 現在の社員 `node` に関する部下の合計カウンタを初期化。

#### ② `for (const child of tree[node])`

* 現在の社員 `node` の **直属の部下たち** を走査。

#### ③ `count += 1 + dfs(child)`

* `1` は直属の部下 `child` 自体。
* `dfs(child)` は `child` にぶら下がっている間接部下（子孫全員）の数。
* 合わせて `count` に加えることで、**直属+間接すべての部下数**を再帰的に求めている。

#### ④ `subordinates[node] = count;`

* 計算が終わったら、その社員 `node` の部下数として配列に格納。

#### ⑤ `return count;`

* 上位のDFS呼び出しにこの部下数を返す。

---

# 🔁 DFS 再帰の例（図つき）

入力例：

```
7
1 1 3 2 4 4
```

木構造：

```
    1
   / \
  2   3
 /     \
5       4
       / \
      6   7
```

DFSの呼び出しはこのように展開されます：

```
dfs(1)
 ├─ dfs(2)
 │    └─ dfs(5) → return 0
 │    → count = 1（直属1人：5）
 ├─ dfs(3)
      └─ dfs(4)
           ├─ dfs(6) → return 0
           └─ dfs(7) → return 0
      → count = 2（直属2人：6,7）
 → count = 3（直属1人：4 + 間接2人）

最終的に：
subordinates[1] = 6
subordinates[2] = 1
subordinates[3] = 3
subordinates[4] = 2
subordinates[5] = 0
subordinates[6] = 0
subordinates[7] = 0
```

---

# ✅ 処理のポイント

| ステップ  | 処理内容                                     |
| ----- | ---------------------------------------- |
| 初期化   | `subordinates` に 0 を代入しておく               |
| DFS再帰 | 葉ノードから帰りながら部下数を合計                        |
| 重要    | `1 + dfs(child)` で「直属 + 間接の部下」を同時に加算     |
| 出力    | 最後に `subordinates[1:]` を出力すれば全社員の部下数がわかる |

---

# 🧠 なぜ DFS で正しく求まるのか？

* 木構造はループがなく、**下から上に情報を集約する再帰処理（DFS）** が最適。
* 葉ノード（末端）は `0` を返し、親がそれを `1 +` していくことで自然に「自分の部下数」が形成される。

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-06-19 11:43:05 | [A65 - Road to Promotion](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bm) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 1000 | 852 Byte | **AC** | 64 ms | 76328 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66875197) |
| 2025-06-19 11:30:12 | [A65 - Road to Promotion](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bm) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 1000 | 852 Byte | **AC** | 239 ms | 20404 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66874981) |
| 2025-06-19 11:28:49 | [A65 - Road to Promotion](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bm) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 1000 | 687 Byte | **AC** | 111 ms | 45764 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66874965) |
| 2025-06-19 11:19:29 | [A65 - Road to Promotion](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bm) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000 | 1080 Byte | **AC** | 168 ms | 131228 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66874778) |
| 2025-06-19 11:16:49 | [A65 - Road to Promotion](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bm) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 935 Byte | **AC** | 149 ms | 131440 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66874729) |