// 以下は、**TypeScript (v5.1, Node.js 18.16.1)** 向けの `countAndSay` 実装です。
// クラスは使わず**関数ベース**で書いており、型注釈、処理時間、メモリ使用量にも配慮しています。

// ---
// Runtime
// 4
// ms
// Beats
// 77.66%
// Memory
// 57.88
// MB
// Beats
// 66.30%

// ### ✅ TypeScript 実装（関数のみ）

// ```typescript
/**
 * 与えられた正の整数 n に対して、"Count and Say" シーケンスの n 番目の項を返す
 *
 * @param n - 1以上30以下の正の整数
 * @returns string - "Count and Say" シーケンスの n 番目の値（文字列）
 *
 * 時間計算量: O(n * m)  // m は各ステップでの文字列長（指数的に増加）
 * 空間計算量: O(m)      // 出力文字列の長さに比例
 */
function countAndSayGpt(n: number): string {
    if (n === 1) return '1';

    let result: string = '1';

    for (let i = 2; i <= n; i++) {
        let temp: string[] = [];
        let count: number = 1;

        for (let j = 1; j <= result.length; j++) {
            if (result[j] === result[j - 1]) {
                count++;
            } else {
                temp.push(count.toString());
                temp.push(result[j - 1]);
                count = 1;
            }
        }

        result = temp.join('');
    }

    return result;
}
// ```

// ---

// ### ✅ 補足：実装の工夫と解析

// #### 🔹 最適化ポイント

// * `string` への `+=` よりも `string[]` + `join("")` にした方がパフォーマンスがよく、**メモリ効率・速度両立**。
// * `count` は 1 からスタートし、同じ文字が続く限り加算。

// #### 🔹 実行パフォーマンス目安（LeetCode環境想定）

// * **最大入力 n = 30** の場合、出力はおおよそ 4000〜5000 文字程度。
// * Node.js 18.16.1 + TypeScript 5.1 では**100ms以内で十分に完了**。
// * **メモリ使用量は最大でも数MB未満**。

// ---

// ### ✅ countAndSay シーケンス例（参考）

// ```
// n = 1: "1"
// n = 2: "11"      (one 1)
// n = 3: "21"      (two 1s)
// n = 4: "1211"    (one 2, one 1)
// n = 5: "111221"  (one 1, one 2, two 1s)
// ...
// ```

// ---

// 他にも、以下のような**改良バージョン**も対応可能です：

// * 再帰版（関数呼び出しで構成）
// * ジェネレーターを使ってメモリ効率向上
// * RLE部分をユーティリティ関数に分離
