この問題は **組み合わせ計算（コンビネーション）** に帰着されるため、数式だけでなく図解ベースで「何をしているか」を丁寧に説明します。

---

## 🧭 問題の概要：格子上の経路数

---

### ✅ 問題設定（図）

```
スタート: (1,1)    ゴール: (H,W)
  ↓         →→→→→→→→→→→→→→→→
  ↓         ↓
  ↓         ↓
  ↓         ↓
  ↓         ↓
  ↓         ↓
  ↓         ↓
  ↓         ↓
  ↓         ↓
  ↓         ↓
  ↓         ↓
  ↓         ↓
  ↓         ↓
  ↓         ↓
```

上の図のように、スタートからゴールまで「**右**」または「**下**」のみで移動する。

---

## 🧮 数学的な変換：経路数 = 組み合わせの問題

---

### 📘 重要ポイント

- 総移動回数：
    - 右へ：`W - 1` 回
    - 下へ：`H - 1` 回
    - 合計：`(H - 1) + (W - 1) = H + W - 2` 回

- その中で、どのタイミングで「下に行くか」を選ぶことで経路が確定する。

---

### 🎯 具体例：H = 3, W = 3

```
(1,1) → (1,2) → (1,3)
  ↓       ↓       ↓
(2,1) → (2,2) → (2,3)
  ↓       ↓       ↓
(3,1) → (3,2) → (3,3)
```

- 移動手順 = 「→→↓↓」「→↓→↓」「↓→→↓」「↓→↓→」「↓↓→→」「→↓↓→」

- 移動合計 = 4 回（下2回, 右2回）

- 組み合わせとして考えると：
    - `4` 回のうち、`2` 回「下に行く」位置を選ぶ
    - つまり `4C2 = 6` 通り

---

## 🔧 実装の全体構造図

---

```plaintext
  入力読み取り
       ↓
  階乗の前計算 ─────────┐
       ↓                │
  逆元の前計算（modPow）│
       ↓                │
 組み合わせ関数 (nCr) ←─┘
       ↓
   出力（mod 1e9+7）
```

---

## 🛠 各処理の詳細と図解

---

### ① `modPow(base, exp)`：累乗を高速に計算

#### 処理：

```ts
while (exp > 0) {
    if (exp % 2n === 1n) result = (result * base) % MOD;
    base = (base * base) % MOD;
    exp >>= 1n;
}
```

#### 説明図：

指数が大きい時に掛け算を最小限に抑える「**繰り返し二乗法**」を使っています。

```
例：base^13 → base^1 * base^4 * base^8

       13(1101)
        ↑   ↑   ↑
        │   │   └─ base^1
        │   └───── base^4
        └───────── base^8
```

計算量：`O(log exp)`

---

### ② `precomputeFactorials()`：階乗とその逆元を事前に全て計算

#### 説明図：

```
fact[i] = i! mod MOD
invFact[i] = (i!)^-1 mod MOD

例:
i = 0: fact[0] = 1, invFact[0] = 1
i = 1: fact[1] = 1, invFact[1] = 1
i = 2: fact[2] = 2, invFact[2] = 1/2 mod MOD
       ...
i = 5: fact[5] = 120, invFact[5] = 1/120 mod MOD
```

- `fact[]`: 通常の階乗
- `invFact[]`: 階乗の逆元（割り算を mod 上で行うために必要）

#### 補足：

mod の世界では割り算ができないので、逆元に変換する必要があります。
それを効率化するため、1 回だけ前計算します。

---

### ③ `combination(n, r)`：nCr を求める

#### 数式：

```
nCr = fact[n] × invFact[r] × invFact[n - r] mod MOD
```

#### 説明図（n = 5, r = 2 の場合）：

```
     5!          120
----------- = --------- = 10
 2! * 3!     2 * 6 = 12

modでやるには：
(120 * 逆元(2) * 逆元(6)) % MOD
```

#### 返却値：

`BigInt` 型のまま返し、出力時に `.toString()` にして出力

---

### ④ 全体の流れまとめ（数式 × 図）

#### スタート → ゴールへ行く道数：

```
(右: W-1 回, 下: H-1 回)
→ 総ステップ = H + W - 2
→ 下を選ぶ位置 = H - 1 箇所

→ 組み合わせ (H + W - 2) C (H - 1)
```

#### 図で再確認（例：H=3, W=4）

```
↓ → → ↓ →
↓ → ↓ → →
→ ↓ ↓ → →
→ ↓ → ↓ →
→ → ↓ ↓ →
→ → ↓ → ↓
(全 10 通り = 5C2)
```

---

## 🧠 最後に

この解法は「動的計画法（DP）」のような `O(H × W)` 計算とは違い、**数学的に帰着して O(1) で解く**方法です。

✅ メリット：

- 非常に大きな `H, W` に対応可能（最大10万）
- 事前計算のみで高速に `nCr` を求められる

---

ご希望あれば、DP による `O(H×W)` 解法や、mod なしで理論確認する「Python/Excel」スタイルの可視化もお見せできます。

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                                  | ユーザ                                            | 言語                                                                                                        | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-07-22 17:00:19                                                                           | [B30 - Combination 2](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_dc) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002)                   | 1000                                                                                    | 1814 Byte                                                                                 |      | 4 ms                                                                                         | 4744 KiB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67828468) |
| 2025-07-22 16:55:59                                                                           | [B30 - Combination 2](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_dc) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)                  | 1000                                                                                    | 2095 Byte                                                                                 |      | 25 ms                                                                                        | 27708 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67828372) |
| 2025-07-22 16:49:15                                                                           | [B30 - Combination 2](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_dc) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)          | 1000                                                                                    | 1723 Byte                                                                                 |      | 63 ms                                                                                        | 26292 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67828205) |
| 2025-07-22 16:39:36                                                                           | [B30 - Combination 2](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_dc) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000                                                                                    | 2121 Byte                                                                                 |      | 121 ms                                                                                       | 74100 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67827976) |
| 2025-07-22 16:33:46                                                                           | [B30 - Combination 2](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_dc) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009)     | 1000                                                                                    | 1703 Byte                                                                                 |      | 158 ms                                                                                       | 73836 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67827821) |
