---

### ✅ 解法の概要（DP）

* `dp[i]` を「**i 番目の家まで見たときの最大の盗める金額**」と定義。
* 遷移は以下のようになります：

```ts
dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i])
```

* `dp[i - 1]`：今の家を襲わない → 前までの最大
* `dp[i - 2] + nums[i]`：今の家を襲う → 2つ前までの最大 + 今の金額

---

### 🧠 実装（TypeScript）

```ts
function rob(nums: number[]): number {
    const n = nums.length;
    if (n === 0) return 0;
    if (n === 1) return nums[0];

    const dp: number[] = new Array(n).fill(0);

    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);

    for (let i = 2; i < n; i++) {
        dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
    }

    return dp[n - 1];
}
```

---

### 📝 例での動作確認

#### 入力例1: `[1,2,3,1]`

```
dp = [1, 2, 0, 0]
i = 2 → dp[2] = max(2, 1+3) = 4
i = 3 → dp[3] = max(4, 2+1) = 4
→ 出力: 4
```

#### 入力例2: `[2,7,9,3,1]`

```
dp = [2, 7, 11, 0, 0]
i = 3 → dp[3] = max(11, 7+3) = 11
i = 4 → dp[4] = max(11, 11+1) = 12
→ 出力: 12
```

---

### 💡 空間を O(1) に最適化したバージョン（オプション）

```ts
function rob(nums: number[]): number {
    let prev1 = 0; // dp[i - 1]
    let prev2 = 0; // dp[i - 2]

    for (const num of nums) {
        const temp = prev1;
        prev1 = Math.max(prev1, prev2 + num);
        prev2 = temp;
    }

    return prev1;
}
```

---

### ✅ 計算量

- 時間計算量: `O(n)`
- 空間計算量: `O(n)`（最適化すれば `O(1)`）

---

## 🧩 問題の本質

> **隣の家を同時に襲うことはできない中で、最大金額を盗むには？**

---

## ✅ 使う配列と定義

```ts
dp[i] = i 番目まで見たときに盗める最大金額
```

---

## 🧪 例：`nums = [2, 7, 9, 3, 1]`

これを図で見ていきましょう。

---

### 🧱 初期状態

| i   | nums\[i] | dp\[i]の意味           |
| --- | -------- | ---------------------- |
| 0   | 2        | dp\[0] = 2             |
| 1   | 7        | dp\[1] = max(2, 7) = 7 |

```
dp 配列：
i:   0   1
dp: [2,  7,  ?,  ?,  ?]
```

---

### 🔁 i = 2 のとき（家3つ目）

```ts
dp[2] = Math.max(dp[1], dp[0] + nums[2]) = Math.max(7, 2 + 9) = 11;
```

**選択肢**

- 前の家（7）を襲った場合 → 今の家は襲えない → 7
- 1つ飛ばして今の家（9）を襲う → 2 + 9 = 11 ✅

```
dp 配列：
i:   0   1   2
dp: [2,  7,  11, ?, ?]
```

---

### 🔁 i = 3 のとき（家4つ目）

```ts
dp[3] = Math.max(dp[2], dp[1] + nums[3]) = Math.max(11, 7 + 3) = 11;
```

**選択肢**

- 前の最大（11）をそのまま使う
- 7（dp\[1]）+ 3（今の家） = 10 → 少ないのでスキップ

```
dp 配列：
i:   0   1   2   3
dp: [2,  7,  11, 11, ?]
```

---

### 🔁 i = 4 のとき（家5つ目）

```ts
dp[4] = Math.max(dp[3], dp[2] + nums[4]) = Math.max(11, 11 + 1) = 12;
```

**選択肢**

- 前の最大（11）をそのまま使う
- 今の家（1）を襲って11（dp\[2]）+1 = 12 ✅

```
dp 配列：
i:   0   1   2   3   4
dp: [2,  7,  11, 11, 12]
```

---

## ✅ 最終的な答え：`dp[4] = 12`

---

## 🔁 全体図（流れ）

```
nums: [2, 7, 9, 3, 1]
dp:   [2, 7, 11,11,12]
                ↑
             最終結果
```

---

## 🧠 コード再掲

```ts
function rob(nums: number[]): number {
    const n = nums.length;
    if (n === 0) return 0;
    if (n === 1) return nums[0];

    const dp: number[] = new Array(n).fill(0);
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);

    for (let i = 2; i < n; i++) {
        dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
    }

    return dp[n - 1];
}
```

---

## 🔧 空間を減らす最適化バージョン（O(1) space）

```ts
function rob(nums: number[]): number {
    let prev1 = 0;
    let prev2 = 0;

    for (const num of nums) {
        const tmp = prev1;
        prev1 = Math.max(prev1, prev2 + num);
        prev2 = tmp;
    }

    return prev1;
}
```

---
