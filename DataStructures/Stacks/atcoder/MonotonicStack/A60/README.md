---

## 📌 問題要点まとめ

* 株価 `A[i]` の日（1-based）に対し、左側にあって `A[i]` より**大きい最後の株価日**を求める。
* なければ `-1` を返す。
* 制約上 `O(N)` 解法が必要。

---

## ✅ TypeScriptコード（Node.js + fs）

```ts
import * as fs from 'fs';

function main() {
    const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split(/\s+/);
    const N = parseInt(input[0]);
    const A = input.slice(1).map(Number);

    const stack: number[] = []; // インデックス（0-based）を保持
    const result: number[] = new Array(N).fill(-1);

    for (let i = 0; i < N; i++) {
        // スタックの株価が今の株価以下なら捨てる（意味がない）
        while (stack.length > 0 && A[stack[stack.length - 1]] <= A[i]) {
            stack.pop();
        }

        // 残っていれば、直近の大きい株価の日が起算日
        if (stack.length > 0) {
            result[i] = stack[stack.length - 1] + 1; // 出力は1-basedに
        }

        // 今の日をスタックに積む
        stack.push(i);
    }

    console.log(result.join(' '));
}

main();
```

---

## 📊 図解で理解：例 `A = [6, 2, 5, 3, 1, 4]`

各日（0-based）でのスタック操作を見てみましょう。

---

### 🔁 i = 0, A\[i] = 6

- スタック空 → 起算日なし → 結果 `-1`
- スタックに `0` を積む
  **stack = \[0]**
  **result = \[-1]**

---

### 🔁 i = 1, A\[i] = 2

- A\[0] = 6 > 2 → 起算日 = 0 → 結果 `0 + 1 = 1`
- スタックに `1` を積む
  **stack = \[0, 1]**
  **result = \[-1, 1]**

---

### 🔁 i = 2, A\[i] = 5

- A\[1] = 2 ≤ 5 → pop → stack = \[0]
- A\[0] = 6 > 5 → 起算日 = 0 → 結果 `1`
- スタックに `2` を積む
  **stack = \[0, 2]**
  **result = \[-1, 1, 1]**

---

### 🔁 i = 3, A\[i] = 3

- A\[2] = 5 > 3 → 起算日 = 2 → 結果 `3`
- スタックに `3` を積む
  **stack = \[0, 2, 3]**
  **result = \[-1, 1, 1, 3]**

---

### 🔁 i = 4, A\[i] = 1

- A\[3] = 3 > 1 → 起算日 = 3 → 結果 `4`
- スタックに `4` を積む
  **stack = \[0, 2, 3, 4]**
  **result = \[-1, 1, 1, 3, 4]**

---

### 🔁 i = 5, A\[i] = 4

- A\[4] = 1 ≤ 4 → pop → stack = \[0,2,3]
- A\[3] = 3 ≤ 4 → pop → stack = \[0,2]
- A\[2] = 5 > 4 → 起算日 = 2 → 結果 `3`
- スタックに `5` を積む
  **stack = \[0, 2, 5]**
  **result = \[-1, 1, 1, 3, 4, 3]**

---

## 🎯 最終出力

```
-1 1 1 3 4 3
```

---

## 💡 解法まとめ

| 処理                    | 内容                                                       |
| ----------------------- | ---------------------------------------------------------- |
| `while` ループ          | 現在の株価 `A[i]` より小さい or 同じ株価をスタックから除外 |
| `if (stack.length > 0)` | 一番上に残ったものが「最も近い左側の大きい株価」＝起算日   |
| `stack.push(i)`         | 現在の日を次の比較のために積む                             |

---

## ⏱ 計算量

- **時間**: `O(N)`（各要素がスタックに1回入って1回出る）
- **空間**: `O(N)`（スタック + 結果配列）

---

## ✅ こんなときにも使える

この手法（モノトニックスタック）は以下のような問題にも応用できます：

- **直近で高い温度/株価/値段**などの取得
- **最大面積の長方形** in ヒストグラム
- **Next Greater Element** 問題

---

もちろんです。モノトニックスタック（単調スタック）は、**特定の順序（昇順または降順）を保つように設計されたスタック**であり、多くの**区間最小・最大、直近比較系の問題**に対して効率的に解を導くことができます。

---

## 🔍 モノトニックスタックとは？

**モノトニックスタック（Monotonic Stack）** は、以下の性質を持つスタックのことです：

| 名前             | 保つ順序      | スタック上の状態       |
| ---------------- | ------------- | ---------------------- |
| 単調増加スタック | 小→大（上へ） | 最小値が下、最大値が上 |
| 単調減少スタック | 大→小（上へ） | 最大値が下、最小値が上 |

値を追加するときにこの順序が崩れる要素は **pop()** されます。

---

## 🧠 なぜ使うのか？

通常、**左側 or 右側で条件を満たす最も近い要素**を探す問題では、毎回前の要素を全部見ていたら `O(N^2)` になります。

➡ モノトニックスタックを使うと、**各要素を1回push・1回popするだけ**で `O(N)` になります。

---

## 🧩 典型的な用途例

| 問題例                                               | スタックの型       | 内容                       |
| ---------------------------------------------------- | ------------------ | -------------------------- |
| 各要素に対して**直近の左側でより大きい要素**を求める | 単調減少スタック   | 株価問題（今回）           |
| 各要素に対して**直近の右側でより小さい要素**を求める | 単調増加スタック   | ネクストスモールエレメント |
| ヒストグラムの最大長方形面積                         | 両側の最小要素探索 | 最大長方形問題             |

---

## 📘 動作の流れ（例）

次のような配列 `A = [3, 1, 4, 2]` に対して、\*\*左側で「直近の大きい要素」\*\*を求めたい場合：

### 🎯 単調減少スタックの動き（降順維持）

```
i=0: A[i]=3
  スタック空 → 結果: -1 → push(0)
  スタック: [0]

i=1: A[i]=1
  A[0]=3 > 1 → 結果: 0 → push(1)
  スタック: [0,1]

i=2: A[i]=4
  A[1]=1 <= 4 → pop
  A[0]=3 <= 4 → pop
  スタック空 → 結果: -1 → push(2)
  スタック: [2]

i=3: A[i]=2
  A[2]=4 > 2 → 結果: 2 → push(3)
  スタック: [2,3]
```

### ✅ 出力: `[-1, 1, -1, 3]`（1-basedなら `[-1, 1, -1, 3]`）

---

## 🖼 図で説明（スタックの中身）

```
処理      A[i]   スタック状態（インデックス）    出力
------   -----   ----------------------------    ------
i = 0     3      push 0                         -1
i = 1     1      0 -> (3 > 1) ⇒ OK → push 1     0
i = 2     4      1 -> (1 ≤ 4) → pop
                 0 -> (3 ≤ 4) → pop → stack空   -1
                 → push 2
i = 3     2      2 -> (4 > 2) ⇒ OK → push 3     2
```

---

## 💡 ポイントまとめ

| 特徴         | 内容                                                                         |
| ------------ | ---------------------------------------------------------------------------- |
| **順序制御** | 常に単調な値の並びを保つことで不要な比較を避ける                             |
| **操作回数** | 各要素は1回だけpush & popされる → 総操作回数は `O(N)`                        |
| **応用力**   | 範囲最大/最小、履歴との比較、Next Greater Element系の問題に強い              |
| **柔軟性**   | 値だけでなく、**インデックス**をスタックに保持することで、位置情報が得られる |

---

## 📚 応用問題例

| 問題名                                                                              | 内容               |
| ----------------------------------------------------------------------------------- | ------------------ |
| [Leetcode 739](https://leetcode.com/problems/daily-temperatures/)                   | Daily Temperatures |
| [AtCoder Typical DP Contest B](https://atcoder.jp/contests/tdpc/tasks/tdpc_contest) | 最大長方形面積     |
| [AOJ ALDS1_3_D](https://onlinejudge.u-aizu.ac.jp/problems/ALDS1_3_D)                | 括弧列の最大マッチ |

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                                | ユーザ                                            | 言語                                                                                                        | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果   | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-06-14 16:00:29                                                                           | [A60 - Stock Price](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bh) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)                  | 1000                                                                                    | 676 Byte                                                                                  | **AC** | 68 ms                                                                                        | 44508 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66711300) |
| 2025-06-14 15:58:27                                                                           | [A60 - Stock Price](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bh) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002)                   | 1000                                                                                    | 1113 Byte                                                                                 | **AC** | 450 ms                                                                                       | 12792 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66711256) |
| 2025-06-14 15:55:55                                                                           | [A60 - Stock Price](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bh) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)          | 1000                                                                                    | 712 Byte                                                                                  | **AC** | 99 ms                                                                                        | 49248 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66711204) |
| 2025-06-14 15:48:40                                                                           | [A60 - Stock Price](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bh) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000                                                                                    | 845 Byte                                                                                  | **AC** | 118 ms                                                                                       | 95112 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66711041) |
| 2025-06-14 15:38:16                                                                           | [A60 - Stock Price](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bh) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009)     | 1000                                                                                    | 660 Byte                                                                                  | **AC** | 136 ms                                                                                       | 89052 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66710824) |
