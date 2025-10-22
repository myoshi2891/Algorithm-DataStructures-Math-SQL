---
## 🧩 問題の概要（再掲）

与えられた `N × N` の盤面には、1〜Nの整数が1つずつ配置されており、各行・各列に1つだけあります。
この状態から、**以下の条件を満たす状態にするための最小操作回数**を求めます。

> すべての整数 `k` が「**行 `k`（上からk行目）**、**列 `k`（左からk列目）**」にある状態にする。

操作として許されるのは：

* 隣接する **行**の交換
* 隣接する **列**の交換
---

## ✅ 入力例

```plaintext
N = 4
盤面:
0 0 2 0
3 0 0 0
0 0 0 4
0 1 0 0
```

### 🟦 図示（元の配置）

```
   0  1  2  3   ← 列
0 [ .  . ②  . ]
1 [ ③  .  .  . ]
2 [ .  .  . ④ ]
3 [ . ①  .  . ]
↑ 行
```

- ② (2) は (0,2)
- ③ (3) は (1,0)
- ④ (4) は (2,3)
- ① (1) は (3,1)

---

## 🎯 最終的に目指すべき配置

「整数 `k` が `(k-1, k-1)` に存在」

つまり：

```
   0  1  2  3
0 [ ①  .  .  . ]
1 [ . ②  .  . ]
2 [ .  . ③  . ]
3 [ .  .  . ④ ]
```

---

## 🔁 どうやって操作を最小化するか？

行と列の順番を入れ替えることで、上の目標の形にしたい。
このとき、以下を考えます：

- **現在の各数値の行・列番号をリストにする**
- 行の順序・列の順序をそれぞれ目標に合わせるために必要な **隣接スワップの回数（=転倒数）** を求める

---

## 🧮 各数値の現在位置

| 数字 k | 行  | 列  |
| ------ | --- | --- |
| 1      | 3   | 1   |
| 2      | 0   | 2   |
| 3      | 1   | 0   |
| 4      | 2   | 3   |

それぞれ `(行,列)` の配列にすると：

```ts
rowPerm = [3, 0, 1, 2]; // k=1〜4 の行の現在位置
colPerm = [1, 2, 0, 3]; // k=1〜4 の列の現在位置
```

---

## 🔃 目標：rowPerm, colPerm を \[0,1,2,3] にしたい

この並びを `[0, 1, 2, 3]` にするには「何回隣接要素をスワップすればよいか？」

---

## 🔢 転倒数（図で説明）

### `rowPerm = [3, 0, 1, 2]`

これを図でスワップして整列：

```
[3, 0, 1, 2]
→ swap(0,1): [0,3,1,2]  (1回)
→ swap(1,2): [0,1,3,2]  (2回目)
→ swap(2,3): [0,1,2,3]  (3回目)
```

✔️ 転倒数 = 3

---

### `colPerm = [1, 2, 0, 3]`

```
[1, 2, 0, 3]
→ swap(1,2): [1,0,2,3]
→ swap(0,1): [0,1,2,3]
→ 計 2回
```

✔️ 転倒数 = 2

---

## ✅ 結果

最小操作回数（=最小スワップ回数）
\= `行の転倒数 3 + 列の転倒数 2 = 5`

---

## 💡 図まとめ

| ステップ | 配列       | 操作内容                |
| -------- | ---------- | ----------------------- |
| rowPerm  | \[3,0,1,2] | swap 3↔0 → 0↔1 → 1↔2 |
| colPerm  | \[1,2,0,3] | swap 2↔0 → 1↔0        |

---

## 📌 補足：なぜ転倒数でOK？

隣接スワップだけで順列を並び替えるときの**最小操作回数は転倒数と等しい**からです。

- たとえば `[3, 1, 2]` → `[1, 2, 3]` にするには
    - `3 ↔ 1`（1回）
    - `3 ↔ 2`（2回）
    - 計 2回（= 転倒数）

---

## 🔚 最後に

この問題は一見難しそうですが、本質は **行・列の並びを目標順列にする** こと。
そしてそれを**最小スワップ回数（=転倒数）で変換するだけ**です。

---

この `countInversions` 関数は、**Fenwick Tree（BIT = Binary Indexed Tree）** を使って **転倒数（inversion count）** を効率的に数える方法を実装しています。
ここでは、次の3点に絞って **図とともに詳しく解説**します。

---

## 🔍 目次

1. **転倒数とは？（定義と例）**
2. **Fenwick Tree（BIT）とは？（図解付き）**
3. **コード解説：`countInversions`の処理ステップ**

---

## ① 転倒数とは？

配列の中で、**左側にある要素が右側の要素より大きい**とき、それを **転倒（inversion）** と呼びます。

### 例

```ts
arr = [3, 1, 2];
```

- `(3, 1)` → 転倒
- `(3, 2)` → 転倒

➡️ 転倒数 = **2**

---

## ② Fenwick Tree（BIT）とは？

### ✔ 目的

- \*\*区間和（部分和）\*\*を高速に更新・取得できるデータ構造
- ここでは、\*\*「自分より小さい数が、これまでに何個出てきたか？」\*\*を高速に数える用途で使います。

---

### ✔ 仕組み（図で解説）

Fenwick Treeは配列に木構造を埋め込んだような構造で、以下の2操作が O(log N) で行えます。

| 操作        | 内容                                               |
| ----------- | -------------------------------------------------- |
| `update(i)` | 位置 `i` に 1 を加算（=要素iが登場したことを記録） |
| `query(i)`  | 位置 `0~i` までの合計（=登場済みの要素数）         |

---

### 🧠 使用目的（このコードにおいて）

- 配列を後ろから見ていき、
    - 「**今見ている要素 `arr[i]` より小さい数（= すでに出現済みの要素）の個数**」を `query(arr[i] - 1)` で取得
    - それを転倒数に加算

- そして、自分自身 `arr[i]` を `update(arr[i])` で記録しておく

---

## ③ コードステップでの解説

```ts
function countInversions(arr: number[]): number {
  const BIT: number[] = Array(N + 2).fill(0);
  let res = 0;
```

- `BIT` = Fenwick Tree。サイズは N+2（安全のため+2）
- `res` = 転倒数を格納する変数

---

### `update(i)`

```ts
const update = (i: number) => {
    i++;
    while (i <= N + 1) {
        BIT[i]++;
        i += i & -i;
    }
};
```

- BITのインデックスは1-basedにするため `i++`。
- `BIT[i]++` でカウント増やす。
- `i += i & -i` は「親ノード」へ移動。

---

### `query(i)`

```ts
const query = (i: number): number => {
    i++;
    let sum = 0;
    while (i > 0) {
        sum += BIT[i];
        i -= i & -i;
    }
    return sum;
};
```

- 1〜iまでの合計を求める。
- `i -= i & -i` は「親ノードに遡る」操作。

---

### ループ処理本体

```ts
for (let i = arr.length - 1; i >= 0; i--) {
    res += query(arr[i] - 1); // 自分より小さい要素の数
    update(arr[i]); // 自分を記録
}

return res;
```

- 後ろから見ることで、「右にある値と比較する転倒」のカウントになる。
- `query(arr[i] - 1)` で「自分より小さい値がどれだけすでに出てきたか」を取得。
- `update(arr[i])` で自分の値をBITに登録。

---

## 🧪 例で確認

```ts
arr = [3, 1, 2]
処理順：右→左（i = 2 → 1 → 0）

i = 2 → arr[2] = 2
  query(1) = 0 ⇒ 転倒なし
  update(2)

i = 1 → arr[1] = 1
  query(0) = 0 ⇒ 転倒なし
  update(1)

i = 0 → arr[0] = 3
  query(2) = 2 ⇒ 2つ転倒（1,2）
  update(3)

最終 res = 2 ✅
```

---

## 📊 計算量

| 処理                     | 時間計算量 |
| ------------------------ | ---------- |
| `update(i)` / `query(i)` | O(log N)   |
| 全体                     | O(N log N) |

---

## 📌 まとめ

| 項目     | 内容                                                   |
| -------- | ------------------------------------------------------ |
| 目的     | 隣接スワップで整列させる最小操作回数（転倒数）を求める |
| 使用構造 | Fenwick Tree（BIT）                                    |
| 処理内容 | 「小さい数が右にどれだけいるか」を数える               |
| 方向     | 右から左へスキャンして更新                             |

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                               | ユーザ                                            | 言語                                                                                                        | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果   | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-06-29 17:07:27                                                                           | [A74 - Board Game](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bv) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)                  | 1000                                                                                    | 2067 Byte                                                                                 | **AC** | 17 ms                                                                                        | 22300 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67181473) |
| 2025-06-29 17:04:25                                                                           | [A74 - Board Game](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bv) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002)                   | 1000                                                                                    | 1532 Byte                                                                                 | **AC** | 1 ms                                                                                         | 1672 KiB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67181426) |
| 2025-06-29 17:02:26                                                                           | [A74 - Board Game](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bv) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)          | 1000                                                                                    | 1400 Byte                                                                                 | **AC** | 13 ms                                                                                        | 9252 KiB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67181382) |
| 2025-06-29 16:42:49                                                                           | [A74 - Board Game](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bv) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000                                                                                    | 1564 Byte                                                                                 | **AC** | 41 ms                                                                                        | 43848 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67181017) |
| 2025-06-29 16:38:32                                                                           | [A74 - Board Game](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bv) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009)     | 1000                                                                                    | 1621 Byte                                                                                 | **AC** | 44 ms                                                                                        | 43684 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67180939) |
