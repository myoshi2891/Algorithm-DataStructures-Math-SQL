// 以下に、**Node.js (v18.16.1)** 環境での**Rolling Hashを使った文字列一致ペアカウントプログラム**を提示します。
// 高速な判定のために**2つのハッシュ関数 (P, X) の組を用いた多重ハッシュ**で衝突対策をしています。

// ---

// ## ✅ 特徴

// * **`fs.readFileSync`** による標準入力対応
// * **Rolling Hash** による高速文字列同一性判定
// * **BigInt** によるオーバーフロー対策
// * **時間計測 (`process.hrtime.bigint()`) とメモリ計測 (`process.memoryUsage()`)** を含む

// ---

// ### 📘 JavaScript (Node.js) 解答コード：

// ```javascript
const fs = require('fs');

/**
 * Rolling Hash を用いて一致ペア数を計算する関数
 * @param {string[]} strings - 対象文字列配列
 * @returns {number} - 一致している文字列ペアの個数
 */
function countEqualStringPairs(strings) {
    const P1 = 1000000007n;
    const X1 = 911n;
    const P2 = 1000000009n;
    const X2 = 3571n;

    // ハッシュ生成関数（BigIntで処理）
    function rollingHash(s, P, X) {
        let hash = 0n;
        for (let i = 0; i < s.length; i++) {
            hash = (hash * X + BigInt(s.charCodeAt(i))) % P;
        }
        return hash;
    }

    // ハッシュ値のペアをキーとして文字列カウント
    const hashMap = new Map();
    for (const str of strings) {
        const h1 = rollingHash(str, P1, X1);
        const h2 = rollingHash(str, P2, X2);
        const key = `${h1}_${h2}`;

        hashMap.set(key, (hashMap.get(key) || 0) + 1);
    }

    // ペアの個数計算（nC2 = n * (n - 1) / 2）
    let count = 0;
    for (const val of hashMap.values()) {
        if (val >= 2) {
            count += (val * (val - 1)) / 2;
        }
    }

    return count;
}

// メイン処理
(function main() {
    const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
    const N = parseInt(input[0], 10);
    const strings = input.slice(1, N + 1);

    // 処理時間計測開始
    const start = process.hrtime.bigint();

    const result = countEqualStringPairs(strings);
    console.log(result);

    // 処理時間・メモリ使用量の出力
    const end = process.hrtime.bigint();
    const memory = process.memoryUsage();

    console.error(`処理時間: ${(end - start) / 1000000n} ms`);
    console.error(`使用メモリ: ${Math.round(memory.heapUsed / 1024 / 1024)} MB`);
})();

// ### ✅ 入出力例と結果（確認用）

// #### 🔢 入力:

// ```
// 6
// NANA
// HELLO
// KAKA
// HELLO
// NANA
// NANA
// ```

// #### ✅ 出力:

// ```
// 4
// ```

// #### ⏱ 処理時間（stderr 出力）例:

// ```
// 処理時間: 3 ms
// 使用メモリ: 8 MB
// ```

// ---

// ### 🔍 解説図（簡略）

// ```
// 文字列 → RollingHash(P1,X1) と RollingHash(P2,X2)
//                 ↓
//          "hash1_hash2" をキーとして Map に出現回数を保存
//                 ↓
//         各カウントから nC2 を合計 → 一致ペア数
// ```

// ---

// ### 📌 注意点

// * `BigInt` を使うことで `Number.MAX_SAFE_INTEGER` を超える衝突・オーバーフローを防止
// * `/dev/stdin` は AtCoder/Python環境やpaiza.IOで利用可能

// ---

// 他にも Rolling Hash の途中値を保持して高速スライディング比較なども可能ですが、今回は固定長文字列で十分高速なのでシンプルに保っています。

// 必要であれば、**図やテスト追加、Pの動的設定**も対応できます。
