---

## 🏪 問題概要の再確認

### 📌 条件

* 開店時刻：`t = 0`
* 閉店時刻：`t = T`
* 各従業員 `i` は区間 `[Li, Ri)` の間だけ在店
* 時刻 `t+0.5` に店内にいる人数を `T` 行出力

---

## 📥 入力例（図付き）

```
T = 10
N = 7
[0,3]
[2,4]
[1,3]
[0,3]
[5,6]
[5,6]
[5,6]
```

---

### 🧭 Step 1: 差分配列の更新（いもす法）

#### 🧮 実行処理（TypeScript）

```ts
cnt[L] += 1;
cnt[R] -= 1;
```

#### 📊 差分配列 `cnt` の初期状態（全て 0）

| t    | 0   | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10  |
| ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 差分 | 0   | 0   | 0   | 0   | 0   | 0   | 0   | 0   | 0   | 0   | 0   |

---

### ✏️ 差分更新後の `cnt`

従業員の `[L, R]` を順に適用：

| 従業員 | L   | R   | `cnt[L]++` | `cnt[R]--` |
| ------ | --- | --- | ---------- | ---------- |
| 1      | 0   | 3   | +1 at 0    | -1 at 3    |
| 2      | 2   | 4   | +1 at 2    | -1 at 4    |
| 3      | 1   | 3   | +1 at 1    | -1 at 3    |
| 4      | 0   | 3   | +1 at 0    | -1 at 3    |
| 5      | 5   | 6   | +1 at 5    | -1 at 6    |
| 6      | 5   | 6   | +1 at 5    | -1 at 6    |
| 7      | 5   | 6   | +1 at 5    | -1 at 6    |

#### 🧮 更新後の `cnt` 配列

| t   | 0   | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| cnt | 2   | 1   | 1   | -3  | -1  | 3   | -3  | 0   | 0   | 0   | 0   |

---

## 🔄 Step 2: 累積和をとる

```ts
let current = 0;
for (let t = 0; t < T; t++) {
    current += cnt[t];
    console.log(current);
}
```

`current` を使って累積的に従業員の数を加算。

### 📊 累積和の流れと出力（= 各時刻 t+0.5 の人数）

| t    | 0   | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   |
| ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 累積 | 2   | 3   | 4   | 1   | 0   | 3   | 0   | 0   | 0   | 0   |

---

## ⏰ イメージ図（時刻と人数）

```
時刻:      0   1   2   3   4   5   6   7   8   9
           |---|---|---|---|---|---|---|---|---|
人数(0.5):   2   3   4   1   0   3   0   0   0   0
```

---

## ✅ 出力結果

```
2
3
4
1
0
3
0
0
0
0
```

---

## 🧠 まとめ：各ステップの役割

| ステップ | 処理内容                 | 計算量 | 内容                                   |
| -------- | ------------------------ | ------ | -------------------------------------- |
| Step 1   | 差分配列 `cnt` の構築    | O(N)   | 各 `[L, R)` に `+1, -1`                |
| Step 2   | 累積和の計算（人数算出） | O(T)   | `cnt[t]` を累積し、時刻 `t+0.5` に出力 |

---

## ✍️ 備考

- `cnt` 配列はサイズ `T + 1` とすることで R = T の退勤も正しく処理
- 出力はまとめて `process.stdout.write(result)` にすると高速化できる

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                                              | ユーザ                                            | 言語                                                                                                        | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-07-03 10:17:20                                                                           | [B07 - Convenience Store 2](https://atcoder.jp/contests/tessoku-book/tasks/math_and_algorithm_al) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)                  | 1000                                                                                    | 987 Byte                                                                                  |      | 639 ms                                                                                       | 29068 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67248374) |
| 2025-07-03 10:11:51                                                                           | [B07 - Convenience Store 2](https://atcoder.jp/contests/tessoku-book/tasks/math_and_algorithm_al) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002)                   | 1000                                                                                    | 919 Byte                                                                                  |      | 118 ms                                                                                       | 15736 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67248295) |
| 2025-07-03 10:07:39                                                                           | [B07 - Convenience Store 2](https://atcoder.jp/contests/tessoku-book/tasks/math_and_algorithm_al) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)          | 1000                                                                                    | 724 Byte                                                                                  |      | 301 ms                                                                                       | 56448 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67248254) |
| 2025-07-03 09:49:03                                                                           | [B07 - Convenience Store 2](https://atcoder.jp/contests/tessoku-book/tasks/math_and_algorithm_al) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000                                                                                    | 661 Byte                                                                                  |      | 472 ms                                                                                       | 134216 KiB                                                                                   | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67248019) |
| 2025-07-03 09:44:47                                                                           | [B07 - Convenience Store 2](https://atcoder.jp/contests/tessoku-book/tasks/math_and_algorithm_al) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009)     | 1000                                                                                    | 546 Byte                                                                                  |      | 1845 ms                                                                                      | 123988 KiB                                                                                   | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67247958) |
