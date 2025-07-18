// 以下は、JavaScript（Node.js 18.16.1）で**エラトステネスの篩**を用いて、`N` 以下の素数をすべて出力するコードです。
// 標準入力は `fs.readFileSync` を使用し、実行時間とメモリ使用量を意識して最適化されています。

// ---

// ### ✅ 実装：`sieveOfEratosthenes(N: number): number[]`

// ```javascript
// Node.jsで標準入力から値を読み込む
const fs = require('fs');

// 入力の読み取り
const input = fs.readFileSync('/dev/stdin', 'utf8');
const N = parseInt(input.trim(), 10);

/**
 * N 以下のすべての素数を小さい順に列挙する関数（エラトステネスの篩）
 * @param {number} n - 上限値（2 <= n <= 10^6）
 * @returns {number[]} - 素数の配列（昇順）
 */
function sieveOfEratosthenes(n) {
    const isPrime = new Array(n + 1).fill(true); // 初期状態はすべて素数と仮定
    isPrime[0] = isPrime[1] = false; // 0と1は素数ではない

    for (let i = 2; i * i <= n; i++) {
        if (isPrime[i]) {
            for (let j = i * i; j <= n; j += i) {
                isPrime[j] = false;
            }
        }
    }

    const primes = [];
    for (let i = 2; i <= n; i++) {
        if (isPrime[i]) primes.push(i);
    }

    return primes;
}

// 処理の実行と出力
const result = sieveOfEratosthenes(N);
console.log(result.join('\n'));

// ### ⏱️ 処理時間・メモリの目安（最大入力 N=1,000,000 時）

// * **計算量**：O(N log log N)
// * **空間量**：O(N)（`isPrime` 配列使用）

// ---

// ### 🧪 入力例

// ```txt
// 20
// ```

// ### ✅ 出力例

// ```txt
// 2
// 3
// 5
// 7
// 11
// 13
// 17
// 19
// ```

// ---

// 必要であれば、`/dev/stdin` を別のファイル名に変更することでローカルでのテストも可能です（例: `input.txt`）。その場合は `fs.readFileSync('input.txt', 'utf8')` に変更してください。

// ご希望があれば、処理時間やメモリ使用量の測定コード（`console.time`, `process.memoryUsage`）も追加可能です。
