// ### 1. 問題の分析

// * **競技プログラミング視点での分析**

//   * 各行を底とする「連続1の高さ」をヒストグラムとして更新し、行ごとに「単調増加スタック」で最大長方形を計算すると **O(R×C)**。
//   * 追加メモリは `heights`（列数）とスタック（列数）で **O(C)**。配列を再利用し、push/pop を避けて「手動スタック（添字管理）」にすると高速・省メモリ。

// * **業務開発視点での分析**

//   * 型は `string[][]`（'0'/'1'）を厳密に扱い、行・列の不揃いを実行前に検証。
//   * 実装は純粋関数化し、副作用ゼロ。ローカル関数としてヒストグラム計算を分離して見通しを確保。
//   * 仕様違反入力には `TypeError` / `RangeError` を早期に投げる（ホットパス外）。

// * **TypeScript特有の考慮点**

//   * `readonly` パラメータを受け取りつつ内部は数値配列に正規化。
//   * 関数境界の型で不正入力を事前に抑止し、実行時ガードは最小限。
//   * 配列は number 単型を維持し、hidden class/最適化を阻害しない単純な for ループで実装。

// ---

// ### 2. アルゴリズムアプローチ比較

// | アプローチ                          | 時間計算量           |  空間計算量 | TS実装コスト | 型安全性 | 可読性 | 備考           |
// | ------------------------------ | --------------- | -----: | ------: | ---: | --: | ------------ |
// | 方法A: 行ごとのヒストグラム + 単調増加スタック（採用） | O(R·C)          |   O(C) |       低 |    高 |   高 | 最速定番、実装短・バグ少 |
// | 方法B: DPで各セルの左幅/右幅/高さを保持        | O(R·C)          | O(R·C) |       中 |    高 |   中 | メモリ重め、コード量増  |
// | 方法C: 各セルから拡張して全探索              | O(R·C·min(R,C)) |   O(1) |       低 |    高 |   中 | 小規模のみ現実的     |

// ---

// ### 3. 選択したアルゴリズムと理由

// * **選択したアプローチ**: 方法A（行ごとのヒストグラム + 単調増加スタック）
// * **理由**:

//   * **計算量的な優位性**: 制約最大でも O(R·C) で余裕、メモリ O(C)。
//   * **TypeScript環境での型安全性**: `string` → `number`（高さ）を限定変換し、内部は number 単型で最適化。
//   * **保守性・可読性**: 主処理は 2 つのループ + 小さなローカル関数。副作用なしで検証容易。
// * **TypeScript特有の最適化ポイント**:

//   * `readonly` 入力を受けつつ、内部配列は再利用（`heights`/`stack` の固定長・手動トップ管理）。
//   * 例外はホットパス外の先頭チェックのみ。
//   * 追加のオブジェクト生成を避け、単純 for で JIT に優しい形。

// ---

// ### 4. 実装コード（LeetCode形式 / Node.js v18, **ESM** / 外部ライブラリ不可）

// ```typescript
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
// ESM 形式（ローカル実行時は `node --loader ts-node/esm solution.ts` 等の想定）
// LeetCode 環境では関数定義のみで可。ここでは ESM としてエクスポートも付与。

/**
 * 最大長方形（LeetCode 85）
 * 与えられた '0'/'1' 文字行列で、1のみから成る最大長方形の面積を返す。
 *
 * @param matrix - R×C の2次元配列（各要素は '0' または '1'）
 * @returns 最大長方形の面積
 * @throws {TypeError} matrix が 2 次元配列でない／要素が '0'/'1' 以外
 * @throws {RangeError} 行数/列数が [1,200] を外れる、または列長が不揃い
 * @complexity Time: O(R*C), Space: O(C)
 */
export default function maximalRectangle(matrix: readonly (readonly string[])[]): number {
    // ---- 入力検証（軽量＆早期；ホットパス外） ----
    if (!Array.isArray(matrix)) {
        throw new TypeError('matrix must be a 2D array');
    }
    const rows = matrix.length;
    if (!(rows >= 1 && rows <= 200)) {
        throw new RangeError('rows must be within [1, 200]');
    }
    if (!Array.isArray(matrix[0])) {
        throw new TypeError('matrix must be a 2D array (array of arrays)');
    }
    const cols = matrix[0].length;
    if (!(cols >= 1 && cols <= 200)) {
        throw new RangeError('cols must be within [1, 200]');
    }
    for (let i = 0; i < rows; i++) {
        const row = matrix[i];
        if (!Array.isArray(row) || row.length !== cols) {
            throw new RangeError('All rows must be arrays of identical length');
        }
        for (let j = 0; j < cols; j++) {
            const v = row[j];
            if (typeof v !== 'string' || (v !== '0' && v !== '1')) {
                throw new TypeError("matrix[i][j] must be '0' or '1'");
            }
        }
    }

    // ---- 本処理：行ごとのヒストグラム + 単調増加スタック ----
    // heights[j]: 現在行を底とする列 j の連続 1 の高さ
    const heights: number[] = new Array<number>(cols).fill(0);
    // スタックは「インデックス」を格納。push/pop を避け、top を手動管理で高速化。
    const stack: number[] = new Array<number>(cols + 1);
    let maxArea = 0;

    // ヒストグラムの最大長方形を O(C) で計算（センチネルはループ境界で擬似化）
    function largestRectangleInHistogram(h: readonly number[]): number {
        let best = 0;
        let top = -1; // スタックのトップ（-1 は空）

        for (let j = 0; j <= cols; j++) {
            const cur = j === cols ? 0 : h[j];
            while (top >= 0 && cur < h[stack[top]]) {
                const height = h[stack[top--]];
                const leftLess = top >= 0 ? stack[top] : -1;
                const width = j - leftLess - 1;
                const area = height * width;
                if (area > best) best = area;
            }
            stack[++top] = j;
        }
        return best;
    }

    for (let i = 0; i < rows; i++) {
        const row = matrix[i];
        for (let j = 0; j < cols; j++) {
            // '1' なら高さをインクリメント、'0' ならリセット
            heights[j] = row[j] === '1' ? heights[j] + 1 : 0;
        }
        const area = largestRectangleInHistogram(heights);
        if (area > maxArea) maxArea = area;
    }

    return maxArea;
}

// LeetCode 用の余計なエクスポート抑止（環境により不要）
// export {};
// ```

// ---

// ## TypeScript固有の最適化観点

// * **型安全性の活用**

//   * `readonly (readonly string[])[]` で外部からの破壊を禁止、実装側では number 配列に正規化して単型を維持。
//   * 実行時ガードで仕様外入力を早期排除（`TypeError` / `RangeError`）。
// * **コンパイル時最適化**

//   * 単純な for ループと number 単型配列で JIT の最適化を阻害しない。
//   * スタックは配列再利用 + 手動 `top` 管理で割当・GC を削減。
// * **開発効率と保守性**

//   * 主処理は 2 段（高さ更新／ヒストグラム計算）に明確分割、ローカル関数でカプセル化。
//   * 例外はホットパス外に集約し、データサイズ上限の逸脱も検知。
