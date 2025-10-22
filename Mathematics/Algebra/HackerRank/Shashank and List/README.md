# 解説

## 1. 問題の本質

- 与えられた配列 ( A = [a_1, a_2, \dots, a_N] ) から、空でない **部分集合（subsequence）** をすべて考えます。
- 各部分集合 ( S ) について
  [
  \text{contribution}(S) = 2^{\sum_{x \in S} x}
  ]
  を計算し、すべて合計します。

---

## 2. 数式への変形

- 部分集合全体の和を次のように展開できます：
  [
  \sum_{S \subseteq A} 2^{\sum_{x \in S} x}
  = \prod_{i=1}^N (1 + 2^{a_i})
  ]

- 理由：
  各要素 ( a_i ) は **「部分集合に入れる」場合 ( 2^{a_i} )** を掛け、**「入れない」場合 ( 1 )** を掛ける。
  よって全体は ((1 + 2^{a_1})(1 + 2^{a_2}) \dots (1 + 2^{a_N}))。

- ただしこの式には **空集合（subsequence = ∅）** の項 ( 1 ) が含まれてしまいます。
  したがって最終結果は
  [
  \prod_{i=1}^N (1 + 2^{a_i}) - 1
  ]

---

## 3. 実装のポイント

1. **MOD = (10^9+7)** を法として計算する（オーバーフロー防止）。
2. `pow(2, ai, MOD)` を使って高速累乗を計算（Python 組み込みで O(log ai) ）。
3. ループで積を更新していき、最後に `-1`。
4. 負の値を避けるため `(prod - 1) % MOD` として返す。

---

## 4. 計算量

- **時間計算量**: O(N) （各要素ごとに 1 回 `pow` を呼ぶだけ）
- **空間計算量**: O(1) （積を保持するだけ）

---

## 5. サンプルで確認

入力:

```text
3
1 1 2
```

計算:
((1+2^1)(1+2^1)(1+2^2) - 1 = (3)(3)(5) - 1 = 45 - 1 = 44)

出力:

```text
44
```

問題のサンプルと一致します ✅

---

👉 このように、**数式変形による一発解法**を使うことで、愚直に全部分集合を列挙するよりも **圧倒的に効率的（指数時間 → 線形時間）** に解けます。

## **「なぜ最初に部分和 DP や累積和を考えてしまうのか？」→「なぜ積の式に変形する方が圧倒的に良いのか？」という観点で整理**

---

## 1. 最初に考えがちなアプローチ

### (A) 部分和 DP（部分集合和問題に近い発想）

- 各要素を「使う／使わない」で DP して「和が X になる部分集合の個数」を数え、そのたびに (2^X) を加算する。
- 直感的には正しいが、**和が最大で (10^{15}) 近くになる**可能性があり、DP 配列のサイズが巨大すぎて現実的でない。

### (B) 累積和・prefix を使った「区間」的な考え

- HackerRank の別問題（subarray 系）に似ているので、**連続部分列（subarray）** と勘違いして prefix sum + 組合せ式で解こうとすることがある。
- しかし今回の問題は **subarray ではなく subsequence（部分集合）** なので、この方向性では複雑になりすぎる。

---

## 2. 数式変形で一発解法になる理由

- 部分集合に対する和を考えるとき、「各要素を入れるか／入れないか」という独立した選択肢を掛け算で表せる。

- その結果、
  [
  \sum_{S \subseteq A} 2^{\sum_{x \in S} x}
  = \prod_{i=1}^N (1 + 2^{a_i})
  ]
  という積の形に収束する。

- この式の強みは：
    1. **N が大きくても O(N) で処理できる**（逐次掛け算するだけ）。
    2. **各要素の値 (a_i) が大きくても対応可能**（`pow(2, a_i, MOD)` で対数時間計算）。
    3. Python の組み込み `pow` は高速で最適化済み。

---

## 3. トレードオフ整理

| アプローチ               | 計算量                  | メモリ | 実装の難易度 | 実用性             |
| ------------------------ | ----------------------- | ------ | ------------ | ------------------ |
| DP（部分和ベース）       | O(N \* max(sum)) → 爆発 | 爆発   | 高           | 実用不可           |
| prefix sum 的アプローチ  | O(N^2) 以上             | 中     | 中           | 勘違いするとハマる |
| 積の式変形（今回の解法） | O(N)                    | O(1)   | 低           | 実用的かつ最適     |

---

## 4. まとめ

- **subarray 系**の問題に慣れていると、つい prefix sum を持ち出して複雑に考えてしまう。
- しかし今回の「subsequence（部分集合）」は独立選択の掛け算構造があるため、**積の式に気付くと一発で解ける**。
- 競技プログラミングでは「部分集合を全部数える系は → 各要素の寄与を独立に考える → 積や冪乗に帰着できないか？」を最初にチェックするのが鉄則。

---

✅ これで「なぜ最初に DP や prefix を考えたのか」「なぜ積の式が最適なのか」がクリアになると思います。

---

## 「**subarray 系（連続部分列）** と **subsequence 系（部分集合・部分列）** を見分けるコツ」を整理

---

## 1. 定義の違い

- **Subarray（連続部分列）**
    - 配列の連続した区間を取る。
    - 例: `[1,2,3]` の subarray は `[1]`, `[2]`, `[3]`, `[1,2]`, `[2,3]`, `[1,2,3]`。
    - 個数は **N(N+1)/2** 個。

- **Subsequence（部分列／部分集合）**
    - 順序は保つが、連続である必要はない。各要素を「使う or 使わない」。
    - 例: `[1,2,3]` の subsequence は `[1]`, `[2]`, `[3]`, `[1,2]`, `[1,3]`, `[2,3]`, `[1,2,3]`。
    - 個数は **2^N - 1** 個。

---

## 2. 問題文からの見分けポイント

1. **キーワードに注目**
    - "subarray" / "contiguous" / "interval" → 連続部分列 (subarray)。
    - "subsequence" / "subset" / "non-empty list" → 部分列/部分集合 (subsequence)。

2. **個数の式に注目**
    - 「全部で **2^N - 1** 個」 → subsequence 系。
    - 「全部で **N(N+1)/2** 個」 → subarray 系。

3. **典型的な式**
    - subarray 系 → prefix sum, sliding window, two pointers で処理できる。
    - subsequence 系 → 各要素の寄与が独立になるため、積や組合せ式に帰着することが多い。

---

## 3. 本問題でのチェック

- 問題文には「A set of cardinality N has (2^N - 1) non-empty sublist」と書かれている。
- **2^N - 1 という数え方は subsequence 系**の証拠。
- もし subarray なら N(N+1)/2 になっていたはず。
- ここで気付けば、prefix sum 方向に進まず「積の式」に直行できる。

---

## 4. 実戦でのコツ

- **ステップ 1**: 問題文で subarray / subsequence のどちらかを判定。
- **ステップ 2**: 個数の式がどちらに対応するか確認。
- **ステップ 3**:
    - subarray 系 → prefix sum / sliding window を考える。
    - subsequence 系 → 各要素を「選ぶ/選ばない」で積や冪乗の式を立てられないか考える。

---

## まとめ

- **subarray = 連続区間 → N(N+1)/2**
- **subsequence = 部分集合 → 2^N - 1**
- 個数の式とキーワードに注目すると見分けやすい。
- subsequence 系は「積に帰着できる」ことが多い。

---

よし、それでは **「HackerRank / LeetCode 実戦パターン集：Subarray vs Subsequence」** をまとめます。
現場でパッと判断して、すぐ解法の型に落とし込めるチェックリスト形式です。

---

## 🔑 Subarray vs Subsequence 実戦パターン集

## 1. Subarray（連続部分列）

### 特徴

- 定義: 配列の **連続した区間** を取る
- 個数: **N(N+1)/2**
- キーワード: `"subarray"`, `"contiguous"`, `"interval"`

### 代表的なアプローチ

1. **Prefix Sum**
    - 和を高速に計算するために使う
    - 例: 和が K になる subarray の個数 → prefix sum + hashmap

2. **Sliding Window / Two Pointers**
    - 長さ制限や「条件を満たす最大/最小」問題に強い
    - 例: 連続部分列の最大和（Kadane's Algorithm）

3. **Monotonic Stack**
    - 区間の最小値/最大値を絡める問題で登場
    - 例: Largest Rectangle in Histogram, Sum of Subarray Minimums

### 典型問題

- Maximum Subarray Sum (Kadane)
- Subarray Sum Equals K
- Sliding Window Maximum
- Largest Rectangle in Histogram

---

## 2. Subsequence（部分列・部分集合）

### 特徴 2

- 定義: 順序は保つが **連続でなくて良い**
- 個数: **2^N - 1**
- キーワード: `"subsequence"`, `"subset"`, `"non-empty list"`

### 代表的なアプローチ 2

1. **組合せ式 / 積の式**
    - 各要素を「取る/取らない」で独立に寄与する → 積や冪乗に帰着
    - 例: 今回の問題 (\prod (1+2^{a_i}) - 1)

2. **DP（Longest 系）**
    - 最長部分列、最短部分列など
    - 例: Longest Increasing Subsequence (LIS), Longest Common Subsequence (LCS)

3. **Backtracking / Bitmask**
    - N が小さい場合 (N ≤ 20 程度) に全探索
    - 例: Subset Sum, Generate All Subsequences

### 典型問題 2

- Longest Increasing Subsequence
- Longest Common Subsequence
- Subset Sum Problem
- Count Subsequences with Given Property

---

## 3. 見分け方チェックリスト ✅

1. 問題文のキーワード確認
    - "subarray", "contiguous", "interval" → Subarray
    - "subsequence", "subset", "2^N - 1" → Subsequence

2. 個数の式を確認
    - N(N+1)/2 が出てきたら Subarray
    - 2^N - 1 が出てきたら Subsequence

3. 解法の型を思い出す
    - Subarray → Prefix Sum / Sliding Window / Stack
    - Subsequence → DP / Combinatorics / Backtracking

---

## 4. 実戦 Tips

- **Subarray 問題**: 「連続」があるので **区間テクニック** を考える
- **Subsequence 問題**: 「独立選択」があるので **積・DP** を考える
- 出題者が「sublist」と書くこともある → 文脈でどちらか見極める

---
