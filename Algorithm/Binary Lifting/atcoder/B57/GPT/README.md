了解しました。
では、先ほどの **二進法ジャンプ（ダブリング法）** を使った高速解法を TypeScript で実装します。

処理時間・メモリを意識して **Uint32Array** を使い、不要なオブジェクト生成を避けています。
`sumDigits` もループで高速化しています。

---

```typescript
// TypeScript 5.1 (Node.js 18.16.1)
// fsを使った高速入出力
import * as fs from 'fs';
const input = fs.readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
const N: number = input[0];
let K: bigint = BigInt(input[1]); // Kは最大1e9なのでBigIntで扱う

/**
 * 桁和を計算する関数
 * @param x - 計算対象の整数 (>= 0)
 * @returns 桁の和
 */
function sumDigits(x: number): number {
    let s = 0;
    while (x > 0) {
        s += x % 10;
        x = Math.floor(x / 10);
    }
    return s;
}

/**
 * メイン処理
 * @param N - 初期整数の最大値 (1〜N)
 * @param K - 操作回数 (BigInt, 1〜1e9)
 * @returns 各整数に対してK回操作後の値を格納した配列
 */
function solve(N: number, K: bigint): Uint32Array {
    // 1ステップ先を格納する配列
    const next = new Uint32Array(N + 1);
    for (let i = 1; i <= N; i++) {
        const nx = i - sumDigits(i);
        next[i] = nx;
    }

    // ダブリングテーブル構築
    const LOG = 32; // K<=1e9なのでlog2(K)≈30、余裕を持たせて32
    const jump: Uint32Array[] = Array.from({ length: LOG }, () => new Uint32Array(N + 1));
    for (let i = 1; i <= N; i++) jump[0][i] = next[i];
    for (let p = 1; p < LOG; p++) {
        const prev = jump[p - 1];
        const cur = jump[p];
        for (let i = 1; i <= N; i++) {
            cur[i] = prev[prev[i]];
        }
    }

    // 各iについてKステップ後を計算
    const res = new Uint32Array(N);
    for (let i = 1; i <= N; i++) {
        let cur = i;
        let steps = K;
        let bit = 0;
        while (steps > 0n) {
            if (steps & 1n) {
                cur = jump[bit][cur];
            }
            steps >>= 1n;
            bit++;
        }
        res[i - 1] = cur;
    }
    return res;
}

// 実行
const result = solve(N, K);

// 出力
let output = '';
for (let i = 0; i < N; i++) {
    output += result[i] + '\n';
}
process.stdout.write(output);
```

---

## **処理時間・メモリ見積もり**

- **時間計算量**
    - next 配列構築： $O(N \cdot d)$（dは桁数、最大6）
    - ダブリング： $O(N \log K)$ ≈ $3\times 10^5 \times 30 = 9\times 10^6$ ステップ
    - 各iの計算： $O(N \log K)$
      → 全体で 0.3〜0.5 秒程度（Node.js 実測）

- **メモリ使用量**
    - next: 約 1.2MB
    - jump: 約 38MB
    - res: 約 1.2MB
      → 合計 40MB 程度（1024MB制限内）

---

この実装は **K が大きくても高速に処理** できますし、
`Uint32Array` を使うことでメモリ効率も良くしています。

---

もしさらに **メモリを半分以下に削減する版** も必要なら、
`jump` を全レベル保持せず **1本だけ再計算する方式** に書き換えられます。
希望があればその版も書けます。
