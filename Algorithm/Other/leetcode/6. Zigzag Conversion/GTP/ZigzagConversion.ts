// ## 1. 問題の分析

// ### 競技プログラミング視点での分析

// * **高速化**: 文字列長を `n` とすると、各行を**数式で直接走査**することで **O(n)** で出力を構成できる。

//   * 周期 `cycle = 2*(numRows-1)` を用い、各行 `row` について縦列インデックス `i = row + k*cycle` を走査。
//   * 中間行（`0` と `numRows-1` 以外）は**斜め成分** `diag = i + (cycle - 2*row)` が存在すれば追加する。
// * **メモリ**: 出力に必要な `n` 文字ぶん以外の補助領域を持たず、**O(1)**（出力除く）。
//   行配列などを作らず、**単一の出力バッファ**へ順次書き込み。

// ### 業務開発視点での分析

// * **型安全性**: 引数は `string` と `number` のみ。境界条件（`numRows=1` や `numRows>=n`）を**早期 return**で明示。
// * **可読性/保守性**: 主要な変数名（`cycle`, `diagIdx`, `out`, `k`）で意図を明確化。
// * **エラーハンドリング**: 仕様に従い `TypeError` / `RangeError` を投入（型不一致・制約違反）。

// ### TypeScript特有の考慮点

// * **型推論**: 出力バッファは `new Array<string>(n)` として**単一型**を固定し、JIT/GC の安定に寄与。
// * **null安全性**: インデックス境界を `if (diagIdx < n)` でガード。
// * **コンパイル時最適化**: 定数化（`const`）と狭いスコープの `let` により意図と最適化余地を明示。

// ---

// ## 2. アルゴリズムアプローチ比較

// | アプローチ                  | 時間計算量      | 空間計算量 | TS実装コスト | 型安全性 | 可読性 | 備考                                 |
// | ---------------------- | ---------- | ----- | ------- | ---- | --- | ---------------------------------- |
// | 方法A: 周期式で行別に直接抽出（採用）   | O(n)       | O(1)* | 低       | 高    | 高   | `cycle=2*(r-1)`、中間行のみ斜めを加える（*出力除く） |
// | 方法B: 各文字に行番号を付与して安定ソート | O(n log n) | O(n)  | 中       | 中    | 中   | 行番号算出→タプル配列→ソート→連結。不要に重い           |
// | 方法C: 2D マトリクスへ実ジグザグ配置  | O(n²)      | O(n²) | 低       | 高    | 高   | 小入力のみ可。多量の無駄セルが発生                  |

// ---

// ## 3. 選択したアルゴリズムと理由

// * **選択したアプローチ**: 方法A（周期式・直接抽出）
// * **理由**:

//   * **計算量**: 最短の **O(n)**。補助メモリ最小。
//   * **型安全性**: TS での境界チェック・型注釈が容易。
//   * **保守性/可読性**: 周期と行の関係が明確で、バグ混入点が少ない。
// * **TypeScript特有の最適化ポイント**:

//   * 出力バッファを `Array<string>` で固定し、**逐次代入→`join('')`**。
//   * 早期 return により分岐削減（`numRows===1` / `numRows>=n`）。
//   * 境界は数式で一元管理（`cycle - 2*row`）。

// ---

// ## 4. 実装コード（LeetCode 提出関数 / **ESM**）

// ```typescript
/**
 * 6. Zigzag Conversion
 * 指定行数のジグザグ配置で並べ替え、行ごとに読み出した文字列を返す。
 *
 * @param s - 変換対象文字列（長さ 1..1000, 英字/','/'.'）
 * @param numRows - 行数（1..1000, 整数）
 * @returns ジグザグ読み結果の文字列
 * @throws {TypeError} s が string でない / numRows が整数でない
 * @throws {RangeError} 入力長や行数が制約外
 * @complexity Time: O(n), Space: O(1)  ※出力を除く補助領域
 */
function convert(s: string, numRows: number): string {
    // ---- 入力検証（軽量＆早期）----
    if (typeof s !== 'string') throw new TypeError('s must be a string');
    if (!Number.isInteger(numRows)) throw new TypeError('numRows must be an integer');

    const n = s.length;
    if (n < 1 || n > 1000) throw new RangeError('s.length must be in [1, 1000]');
    if (numRows < 1 || numRows > 1000) throw new RangeError('numRows must be in [1, 1000]');

    // 特殊ケース：行数が1、または行数が文字数以上
    if (numRows === 1 || numRows >= n) return s;

    // ---- 本処理 ----
    // 周期：縦 numRows + 斜め (numRows - 2) を合わせて 2*(numRows-1)
    const cycle = (numRows - 1) << 1; // 2*(numRows-1)
    const out: string[] = new Array<string>(n);
    let k = 0; // out への書き込み位置

    for (let row = 0; row < numRows; row++) {
        for (let i = row; i < n; i += cycle) {
            out[k++] = s[i]; // 縦列成分

            // 中間行のみ斜め成分が存在
            if (row !== 0 && row !== numRows - 1) {
                const diagIdx = i + (cycle - (row << 1)); // i + (cycle - 2*row)
                if (diagIdx < n) out[k++] = s[diagIdx];
            }
        }
    }
    return out.join('');
}

// ESM モジュールと明示するためのダミー export（LeetCode 実行には影響なし）
export {};

// Analyze Complexity

// Runtime 2 ms
// Beats 98.03%
// Memory 60.24 MB
// Beats 66.81%

// ```

// ---

// ## TypeScript 固有の最適化観点

// * **型安全性の活用**

//   * 厳密な関数シグネチャで入力の型を固定。
//   * 実行時ガード（`typeof`/`Number.isInteger`）により**不正入力を明示的に排除**。
// * **コンパイル時最適化**

//   * `const`/`let` の適切な利用でスコープと再代入を限定。
//   * `new Array<string>(n)` により**単一型の配列**を確保、JIT 最適化と GC 負荷低減に寄与。
// * **開発効率/保守性**

//   * 周期と行の関係を数式化して条件分岐を最小化。
//   * 早期 return でホットパスの複雑性を削減。

// ---

// function convert(s: string, numRows: number): string {
//     if (numRows === 1 || s.length <= numRows) return s;

//     const rows: string[] = Array(Math.min(numRows, s.length)).fill('');
//     let currentRow = 0;
//     let goingDown = false;

//     for (const char of s) {
//         rows[currentRow] += char;
// 一番上または一番下に到達したら方向を反転
//         if (currentRow === 0 || currentRow === numRows - 1) {
//             goingDown = !goingDown;
//         }

//         currentRow += goingDown ? 1 : -1;
//     }

//     return rows.join('');
// }
