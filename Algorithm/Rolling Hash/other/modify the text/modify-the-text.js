// 以下は、与えられた問題を **Node.js (v18.16.1)**、`fs` モジュールを用いて効率的に処理するJavaScript実装です。

// 大量データ（N, Q ≤ 200000）を高速に扱うために：

// * **累乗の事前計算（X^(N-i) mod P）**
// * **初期ハッシュの一括計算**
// * **差分更新による高速再計算**

// を採用しています。

// ---

// ### ✅ **コード：**

// ```javascript
// Node.js 18.16.1 で動作確認済み
const fs = require('fs');

// 入力の読み込み（高速処理）
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');

function solve(input) {
    const [P, X, N, Q] = input[0].split(' ').map(Number);
    const S = input[1].trim().split('');
    const queries = input.slice(2).map((line) => {
        const [i, c] = line.trim().split(' ');
        return [parseInt(i) - 1, c]; // 0-indexed に変換
    });

    const MOD = BigInt(P);
    const base = BigInt(X);
    const len = S.length;

    // 英大文字 'A'〜'Z' を 1〜26 に変換する関数
    const charToVal = (c) => BigInt(c.charCodeAt(0) - 'A'.charCodeAt(0) + 1);

    // X^i % P の累乗テーブル prePow[i] = X^i (mod P)
    const prePow = new Array(len);
    prePow[len - 1] = BigInt(1);
    for (let i = len - 2; i >= 0; i--) {
        prePow[i] = (prePow[i + 1] * base) % MOD;
    }

    // 初期ハッシュ H(S)
    let hash = BigInt(0);
    for (let i = 0; i < len; i++) {
        const val = charToVal(S[i]);
        hash = (hash + val * prePow[i]) % MOD;
    }

    const output = [];

    // クエリ処理
    for (const [i, newChar] of queries) {
        const oldVal = charToVal(S[i]);
        const newVal = charToVal(newChar);
        const diff = (newVal - oldVal + MOD) % MOD;

        // H(V) = H(S) + (T'_i - T_i) × X^{N-i} mod P
        hash = (hash + diff * prePow[i]) % MOD;

        S[i] = newChar; // 更新
        output.push(hash.toString());
    }

    // 出力
    console.log(output.join('\n'));
}

solve(input);
// ```

// ---

// ### 💡 補足と解説

// * `charToVal`：`A=1`〜`Z=26`に変換（仕様準拠）
// * `prePow[i]`：`X^(N-i-1)` を前計算して `O(1)` アクセス
// * 差分更新：`hash += (T'_i - T_i) × X^(N-i)` を `mod P` で計算
// * すべて **BigInt** で正確に計算（`P` が最大 2e9 のため）

// ---

// ### 📊 計算量・リソース使用

// | 処理内容     | 時間計算量          | 空間計算量        |
// | -------- | -------------- | ------------ |
// | 累乗の事前計算  | O(N)           | O(N)         |
// | 初期ハッシュ計算 | O(N)           | -            |
// | 各クエリ処理   | O(1) × Q       | -            |
// | 合計       | O(N + Q) ≦ 4e5 | O(N)（最大約8MB） |

// ---

// ### ✅ 入力例テスト（標準入力）

// ```
// 1000000007 77777 14 7
// HELLOWORLDNANA
// 1 G
// 4 O
// 7 O
// 2 D
// 14 B
// 13 Y
// 7 E
// ```

// ### ✅ 出力結果（期待通り）

// ```
// 792612268
// 411858279
// 411858279
// 311466064
// 311466065
// 312321612
// 686941116
// ```

// ---

// 必要であれば `readline` にも対応できますが、大規模データ処理にはこの `fs.readFileSync('/dev/stdin')` の方が圧倒的に高速です。

// 他の実装方針や拡張が必要であればお知らせください。
