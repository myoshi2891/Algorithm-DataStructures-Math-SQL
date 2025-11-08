この解法は、64ビット整数を使わずに、32ビット整数の範囲を超えないかを都度チェックしながら桁を逆にしていきます。

---

### ✅ TypeScriptコード（`fs`での入力読み取り対応）

```ts
import * as fs from 'fs';

const input = fs.readFileSync('/dev/stdin', 'utf8').trim();
const x = parseInt(input);

/**
 * 32ビット整数の範囲
 */
const INT_MIN = -(2 ** 31);
const INT_MAX = 2 ** 31 - 1;

function reverse(x: number): number {
    let result = 0;
    let num = x;

    while (num !== 0) {
        const digit = num % 10 | 0; // 小数点対策で |0 して整数化
        num = (num / 10) | 0;

        // resultが次の桁を追加したときにオーバーフローしないか確認
        if (
            result > Math.floor(INT_MAX / 10) ||
            (result === Math.floor(INT_MAX / 10) && digit > 7)
        ) {
            return 0;
        }
        if (
            result < Math.ceil(INT_MIN / 10) ||
            (result === Math.ceil(INT_MIN / 10) && digit < -8)
        ) {
            return 0;
        }

        result = result * 10 + digit;
    }

    return result;
}

console.log(reverse(x));
```

---

### 🔍 処理概要（図付きで説明）

たとえば `x = -123` のとき：

```
初期状態: result = 0, num = -123

ループ1:
    digit = -123 % 10 = -3
    num = -123 / 10 = -12
    result = 0 * 10 + (-3) = -3

ループ2:
    digit = -12 % 10 = -2
    num = -12 / 10 = -1
    result = -3 * 10 + (-2) = -32

ループ3:
    digit = -1 % 10 = -1
    num = -1 / 10 = 0
    result = -32 * 10 + (-1) = -321

終了（num === 0）→ return -321
```

---

### 🛑 オーバーフローの例

例：`x = 1534236469`

```
途中で result = 964632435 になり、
次の桁（9）を追加すると 9646324350 + 9 = 9646324359 > INT_MAX
→ return 0
```

---

### ✅ テストケース例

```plaintext
Input:
123
Output:
321

Input:
-123
Output:
-321

Input:
120
Output:
21

Input:
1534236469
Output:
0
```

---
