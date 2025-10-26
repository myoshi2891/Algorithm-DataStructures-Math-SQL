繰り返し二乗法（Exponentiation by Squaring）を用いて `A^B mod M` を高速に計算する JavaScript のコードです。標準入力に対応しています（`fs` モジュールを使用）。

---

### ✅ JavaScript 解答コード（繰り返し二乗法 + 標準入力対応）

```javascript
const fs = require('fs');

// 入力読み取り
const input = fs.readFileSync('/dev/stdin', 'utf8').trim();
const [A, B, M] = input.split(' ').map(Number);

// 繰り返し二乗法
function modPow(a, b, m) {
    let result = 1;
    a = a % m;
    while (b > 0) {
        if (b & 1) {
            result = (result * a) % m;
        }
        a = (a * a) % m;
        b >>= 1;
    }
    return result;
}

// 出力
console.log(modPow(A, B, M));
```

---

### 🔍 処理の流れ（`2^13 mod M` の例をもとに）

```
初期状態:
a = 2, b = 13 → b(2進数) = 1101, m = 7, result = 1

1回目: b & 1 = 1 → result = result * a = 1 * 2 = 2
        a = a * a = 4, b = 6 (110)

2回目: b & 1 = 0 → result unchanged
        a = 16, b = 3 (11)

3回目: b & 1 = 1 → result = 2 * 16 = 32
        a = 256, b = 1

4回目: b & 1 = 1 → result = 32 * 256
        a = 65536, b = 0

最後に result % 7 = 4 を返す
```

---

### ✅ 実行例

#### 入力:

```
2 5 7
```

#### 出力:

```
4
```

---

### ⏱ 計算量

- 時間計算量: `O(log B)` （Bの2進数のビット長に比例）
- 空間計算量: `O(1)`

---
