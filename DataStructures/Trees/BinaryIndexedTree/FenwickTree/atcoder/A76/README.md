
---

## 🧭 問題の要点（図解）

```
川幅: 65m、ジャンプ距離: [7, 37]

足場:   5   15   30   50   55
位置: |---|----|----|----|----|
        ↑    ↑    ↑    ↑    ↑
スタート(0m)                      ゴール(65m)
```

* 太郎君は **スタート地点 (0m)** から、**ジャンプ距離が \[7m, 37m]** で足場やゴールにジャンプ。
* **どのような順番でジャンプしてゴールに到達できるか** の**総数を求める問題**。

---

## ✅ ステップ 1：座標圧縮と前処理

```ts
const positions = [0, ...X, W]; // [0, 5, 15, 30, 50, 55, 65]
positions.sort((a, b) => a - b);
```

📘 **図1：位置リスト（圧縮対象）**

```
Index:     0   1   2    3    4    5    6
Position:  0   5   15   30   50   55   65
```

* 実際にジャンプで到達する可能性のある地点のみを考慮（最大 N+2 個）
* `dp[i]` は `positions[i]` に到達する方法の数を表す

---

## ✅ ステップ 2：初期化

```ts
dp[0] = 1;       // スタート地点 0 にいる方法は1通り
ft.add(0, 1);    // BITにもセット
```

📘 **図2：初期状態**

```
dp:       [1, 0, 0, 0, 0, 0, 0]
position: [0, 5, 15, 30, 50, 55, 65]
```

---

## ✅ ステップ 3：各位置 i にジャンプ可能な過去の範囲を探す（二分探索）

```ts
const left = cur - R;
const right = cur - L;

const li = lowerBound(positions, left);
const ri = upperBound(positions, right) - 1;
```

📘 **図3：ジャンプ可能範囲を図示（例: i = 2, pos = 15）**

```
今の位置: 15
ジャンプ元候補: 15 - 37 = -22 〜 15 - 7 = 8

→ 到達できる前の点： [0, 5] → positions[0], positions[1]
```

つまり：

```ts
li = lowerBound(positions, -22) = 0
ri = upperBound(positions, 8) - 1 = 1
```

* `dp[2] = dp[0] + dp[1]` を求める（`BIT.rangeSum(li, ri)`）

---

## ✅ ステップ 4：BIT（Fenwick Tree）による高速区間和の計算

📘 **図4：BITで dp\[0]+dp\[1] を合計し、dp\[2] に代入**

```ts
dp[i] = ft.rangeSum(li, ri);
ft.add(i, dp[i]);
```

BIT は `O(log N)` で次のように動作：

* `add(i, x)`：`i` 番目の値に `x` を加える
* `rangeSum(l, r)`：`dp[l] + dp[l+1] + ... + dp[r]` を計算

---

## ✅ ステップ 5：最終結果

```ts
console.log(dp[n - 1]);  // 最後の位置 (W=65m) に到達する通り数
```

📘 **図5：dp配列（最終的な通り数）**

```
Index:     0   1   2    3    4    5    6
Position:  0   5   15   30   50   55   65
dp:        1   0   1    2    2    1    7
```

* `dp[6] = 7` → ゴール (65m) にたどり着く通り数は **7通り**

---

## 💡 まとめ

| 処理ステップ            | 説明                              |
| ----------------- | ------------------------------- |
| 座標圧縮              | 0, 足場, ゴールだけをインデックスに変換          |
| dp 初期化            | `dp[0] = 1`（スタート）               |
| 各位置ごとに探索          | `pos[i]` にジャンプできる前の範囲を2分探索      |
| Fenwick Tree（BIT） | 区間和を O(log N) で計算して `dp[i]` に加算 |
| 最終出力              | `dp[ゴールのインデックス]` が答え            |

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-07-01 18:36:39 | [A76 - River Crossing](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bx) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 1000 | 2451 Byte |  | 248 ms | 46648 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67219001) |
| 2025-07-01 18:33:18 | [A76 - River Crossing](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bx) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 1000 | 1925 Byte |  | 56 ms | 15992 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67218947) |
| 2025-07-01 18:27:47 | [A76 - River Crossing](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bx) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 1000 | 1741 Byte |  | 473 ms | 39756 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67218847) |
| 2025-07-01 18:16:16 | [A76 - River Crossing](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bx) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000 | 2371 Byte |  | 150 ms | 86184 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67218646) |
| 2025-07-01 18:14:02 | [A76 - River Crossing](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bx) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 2694 Byte |  | 183 ms | 88068 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67218589) |