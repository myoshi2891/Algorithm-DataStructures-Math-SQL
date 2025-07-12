以下では、**部分和問題**を解くために TypeScript で実装した **動的計画法（DP）+ 経路復元** の処理を、**図を交えてわかりやすく解説**します。

---

## 🔍 問題概要（再掲）

**入力：**

* カード枚数 `N = 3`
* 目標合計 `S = 7`
* カードに書かれた数値 `A = [2, 2, 3]`

**目標：**
いくつかのカードを選んで、合計が `S = 7` になるような **組み合わせを1つ出力**する。

---

## ✅ 処理の流れと図解

---

### 🎯 ステップ1：DP状態の初期化

* `dp` は「合計値」→「どうやってその合計を作ったか」を記録する Map。
* 初期状態では、`0` は「何も選ばずに作れる」。

```
dp = {
  0: null
}
```

---

### 🧮 ステップ2：カード 1 枚目（A\[0] = 2）を使う

#### 処理:

* 今の `dp` は `{ 0: null }`
* 合計 0 に A\[0]=2 を足して 2 を作れる

```
newSum = 0 + 2 = 2
→ dp[2] = [0, 0]
```

#### 更新後の dp:

```
dp = {
  0: null,
  2: [0, 0]  // カード0（1-indexedで1）を使って2を作れる
}
```

---

### 🧮 ステップ3：カード 2 枚目（A\[1] = 2）を使う

#### 処理:

* dp にある全ての合計（0, 2）に A\[1]=2 を足して、新しい合計を追加

```
0 + 2 = 2 → dp[2] はすでにあるので無視
2 + 2 = 4 → dp[4] = [1, 2]
```

#### 更新後の dp:

```
dp = {
  0: null,
  2: [0, 0],
  4: [1, 2]
}
```

---

### 🧮 ステップ4：カード 3 枚目（A\[2] = 3）を使う

#### 処理:

* dp にある全ての合計（0, 2, 4）に A\[2]=3 を足す

```
0 + 3 = 3 → dp[3] = [2, 0]
2 + 3 = 5 → dp[5] = [2, 2]
4 + 3 = 7 → dp[7] = [2, 4]
```

#### 更新後の dp:

```
dp = {
  0: null,
  2: [0, 0],
  4: [1, 2],
  3: [2, 0],
  5: [2, 2],
  7: [2, 4]  ← ✅ 目標の合計が作れる！
}
```

---

### 🔁 ステップ5：経路復元（dp からたどる）

目標合計 `S = 7` から、どのカードを使って合計を作ったかを **逆に辿る**。

#### 図で追う：

```
currSum = 7
↓
dp[7] = [2, 4]     → カード2 (A[2] = 3), 前の合計4
currSum = 4
↓
dp[4] = [1, 2]     → カード1 (A[1] = 2), 前の合計2
currSum = 2
↓
dp[2] = [0, 0]     → カード0 (A[0] = 2), 前の合計0
```

---

### ✅ 結果まとめ

逆順にたどった結果（カードのインデックス）は `[2, 1, 0]`（0-indexed）。
これを **1-indexed に変換**して並び替えると：

```
→ 出力:
3
1 2 3
```

---

## 🧠 全体フローの図（イメージ）

```
入力: N=3, S=7, A=[2, 2, 3]

[Step 0] 初期: dp = { 0: null }

[Step 1] A[0] = 2 で更新:
  2 ← 0 + A[0]

[Step 2] A[1] = 2 で更新:
  4 ← 2 + A[1]

[Step 3] A[2] = 3 で更新:
  3 ← 0 + A[2]
  5 ← 2 + A[2]
  7 ← 4 + A[2]  ← ✅ S に到達！

[復元] 7 ← 4 ← 2 ← 0
         ↑    ↑    ↑
        A[2] A[1] A[0]

出力: 3
      1 2 3
```

---

## ✅ 計算量まとめ

| 処理    | 計算量       |
| ----- | --------- |
| DP構築  | O(N \* S) |
| 経路復元  | O(N)      |
| 空間使用量 | O(S)      |

---
| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-07-12 20:08:46 | [B18 - Subset Sum with Restoration](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cq) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 1000 | 1656 Byte |  | 8 ms | 2812 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67506631) |
| 2025-07-12 19:57:11 | [B18 - Subset Sum with Restoration](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cq) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 1000 | 1348 Byte |  | 20 ms | 22852 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67506444) |
| 2025-07-12 16:27:12 | [B18 - Subset Sum with Restoration](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cq) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000 | 1719 Byte |  | 82 ms | 59292 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67502667) |
| 2025-07-12 16:21:08 | [B18 - Subset Sum with Restoration](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cq) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 1645 Byte |  | 105 ms | 59856 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67502555) |
| 2025-07-12 16:19:05 | [B18 - Subset Sum with Restoration](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cq) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 1000 | 1123 Byte |  | 29 ms | 11728 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67502517) |