以下は、**TypeScript** を使って「最長回文部分文字列」を求める解法です。中心展開法（expand around center）を使って、**O(N²)** の時間計算量で実装できます。

---

### ✅ コード（TypeScript）

```ts
function longestPalindrome(s: string): string {
    if (s.length <= 1) return s;

    let start = 0;
    let end = 0;

    const expandAroundCenter = (left: number, right: number): void => {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            left--;
            right++;
        }
        // [left+1, right-1] が現在の回文
        if (right - left - 1 > end - start) {
            start = left + 1;
            end = right - 1;
        }
    };

    for (let i = 0; i < s.length; i++) {
        expandAroundCenter(i, i); // 奇数長の回文中心
        expandAroundCenter(i, i + 1); // 偶数長の回文中心
    }

    return s.slice(start, end + 1);
}
```

---

### 🔍 解説

#### 🔸中心展開法とは？

文字列の各インデックス `i` を中心として、左右に文字が対称かどうかを確認して最長の回文を探す方法です。回文には以下の2パターンがあります：

- 奇数長（例: `"aba"`） → 中心は1文字
- 偶数長（例: `"abba"`）→ 中心は2文字

#### 🔸処理フロー図（例: `"babad"`）

```
i = 0: 中心 = "b" → "bab" が回文
i = 1: 中心 = "a" → "aba" が回文
i = 2: 中心 = "b" → "bab" が回文
i = 3: 中心 = "a" → "a"
...
最長は "bab" または "aba"
```

---

### 🧪 テスト

```ts
console.log(longestPalindrome('babad')); // "bab" or "aba"
console.log(longestPalindrome('cbbd')); // "bb"
console.log(longestPalindrome('a')); // "a"
console.log(longestPalindrome('ac')); // "a" or "c"
```

---

### ⏱️ 計算量

- 時間計算量：O(N²)
- 空間計算量：O(1)

---

**動的計画法（DP）を用いた TypeScript 実装**
この方法は、部分文字列 `s[i..j]` が回文かどうかを記録し、そこから最長の回文部分文字列を探索します。

---

## ✅ TypeScript 実装（動的計画法）

```ts
function longestPalindrome(s: string): string {
    const n = s.length;
    if (n < 2) return s;

    // dp[i][j] = s[i..j] が回文かどうか
    const dp: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));

    let start = 0;
    let maxLen = 1;

    // 1文字は必ず回文
    for (let i = 0; i < n; i++) {
        dp[i][i] = true;
    }

    // 長さ2以上の部分文字列を検討
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;

            if (s[i] === s[j]) {
                if (len === 2) {
                    dp[i][j] = true;
                } else {
                    dp[i][j] = dp[i + 1][j - 1];
                }

                if (dp[i][j] && len > maxLen) {
                    start = i;
                    maxLen = len;
                }
            }
        }
    }

    return s.substring(start, start + maxLen);
}
```

---

## 🔍 処理概要

### 🧠 dp\[i]\[j] の定義：

- `dp[i][j] = true` なら `s[i..j]` が回文

### 🔄 状態遷移：

- `s[i] !== s[j]` → `dp[i][j] = false`
- `s[i] === s[j]`：
    - 長さ2 → `dp[i][j] = true`
    - 長さ3以上 → `dp[i][j] = dp[i+1][j-1]`

---

## 🧪 例： `"babad"` の場合

```
i=0, j=2 -> "bab" => dp[0][2] = dp[1][1] = true → 回文
i=1, j=3 -> "aba" => dp[1][3] = dp[2][2] = true → 回文
最長は "bab" または "aba"
```

---

## ⏱️ 計算量

- 時間計算量：`O(N²)`
- 空間計算量：`O(N²)`（2次元配列）

---

## ✅ テスト例

```ts
console.log(longestPalindrome('babad')); // "bab" または "aba"
console.log(longestPalindrome('cbbd')); // "bb"
console.log(longestPalindrome('a')); // "a"
console.log(longestPalindrome('ac')); // "a" または "c"
```

---
