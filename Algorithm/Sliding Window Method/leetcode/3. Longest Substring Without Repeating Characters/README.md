この問題は、**スライディングウィンドウ法**を用いて効率よく解くことができます。目的は、\*\*重複しない文字からなる最長の部分文字列（連続した文字列）\*\*の長さを求めることです。

---

### ✅ 解法概要（スライディングウィンドウ + ハッシュマップ）

* `start`：ウィンドウの左端のインデックス
* `charIndexMap`：各文字が最後に現れたインデックスを記録
* `maxLength`：重複なし部分文字列の最大長

---

### 📘 TypeScript 実装

```typescript
function lengthOfLongestSubstring(s: string): number {
    let start = 0;
    let maxLength = 0;
    const charIndexMap: Map<string, number> = new Map();

    for (let end = 0; end < s.length; end++) {
        const currentChar = s[end];

        // 重複が見つかれば start を更新（同じ文字がウィンドウ内にあれば）
        if (charIndexMap.has(currentChar) && charIndexMap.get(currentChar)! >= start) {
            start = charIndexMap.get(currentChar)! + 1;
        }

        // 現在の文字のインデックスを記録
        charIndexMap.set(currentChar, end);

        // 最大長を更新
        maxLength = Math.max(maxLength, end - start + 1);
    }

    return maxLength;
}
```

---

### 🧪 例の検証

```typescript
console.log(lengthOfLongestSubstring("abcabcbb")); // 3 ("abc")
console.log(lengthOfLongestSubstring("bbbbb"));    // 1 ("b")
console.log(lengthOfLongestSubstring("pwwkew"));   // 3 ("wke")
console.log(lengthOfLongestSubstring(""));         // 0
console.log(lengthOfLongestSubstring(" "));        // 1
console.log(lengthOfLongestSubstring("au"));       // 2
```

---

### 📊 計算量

* **時間計算量**: O(n)（各文字を一度ずつスキャン）
* **空間計算量**: O(min(n, m))（mは使用される文字の種類の数）

---
