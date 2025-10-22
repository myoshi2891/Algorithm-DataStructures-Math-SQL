// # 回答

// ## 1. 問題の分析

// ### 競技プログラミング視点

// * **時間効率**: m×n の行列を最大 200×200 (4万要素) まで処理。O(mn) 解法が十分高速。
// * **空間効率**: O(1) 追加領域が最適。O(m+n) でも制約上は許容されるが、定数領域解法がベストプラクティス。
// * **方針**:

//   * 1 行目と 1 列目をフラグ領域として再利用。
//   * 最初に 1 行目・1 列目のゼロ有無を記録し、残りの要素でフラグ付け。
//   * その後フラグを見て更新。

// ### 業務開発視点

// * **型安全性**: `number[][]` を明示し、空行列や不正入力を型/実行時チェック。
// * **保守性**: 「フェーズ分割 (初期チェック → フラグ付け → ゼロ化 → 最終処理)」を明示する。
// * **エラーハンドリング**:

//   * 行列が空ならそのまま返す。
//   * 数値以外の要素が混ざれば `TypeError`。

// ### TypeScript特有の考慮点

// * **型推論**: `matrix: number[][]` のみで十分明確。
// * **readonly/const**: 入力は破壊的更新するため戻り値は不要。`void` 戻り型を強調。
// * **strict mode**: `tsconfig.json` で `strict: true` 前提。
// * **イミュータブル vs ミュータブル**: 問題仕様は「in-place」なので破壊的更新を選択。

// ---

// ## 2. アルゴリズムアプローチ比較

// | アプローチ                 | 時間計算量   | 空間計算量  | TS実装コスト | 型安全性 | 可読性 | 備考            |
// | --------------------- | ------- | ------ | ------- | ---- | --- | ------------- |
// | 方法A: 1 行目・1 列目をフラグに使う | O(mn)   | O(1)   | 中       | 高    | 高   | ベスト解法         |
// | 方法B: O(m+n) の補助配列でフラグ | O(mn)   | O(m+n) | 低       | 高    | 高   | 実装簡単だが追加メモリ必要 |
// | 方法C: 各要素に遭遇するたび即更新    | O(m²n²) | O(1)   | 低       | 中    | 低   | 非現実的          |

// ---

// ## 3. 選択したアルゴリズムと理由

// * **選択**: 方法A（1行目・1列目をフラグ領域として使用）
// * **理由**:

//   * 時間: O(mn) で最適。
//   * 空間: O(1) 追加領域。
//   * TypeScriptでも `number[][]` 型を明示すれば可読性・安全性を担保できる。
// * **TS最適化ポイント**:

//   * `matrix: number[][]` を明示。
//   * 戻り値を `void` にして「破壊的更新」を明示。
//   * `Array.isArray` や `typeof === 'number'` で実行時型ガードを追加。

// ---

// ## 4. 実装コード（solution.ts）

// ```typescript
'use strict';

/**
 * Set Matrix Zeroes (LeetCode #73)
 * 与えられた行列で、0 の要素がある行と列をすべて 0 に設定する。
 * in-place 更新を行う。
 *
 * @param matrix - m x n の数値行列
 * @throws {TypeError} 行列または要素が不正な場合
 * @complexity Time: O(mn), Space: O(1)
 */
function setZeroes(matrix: number[][]): void {
    // 入力検証
    if (!Array.isArray(matrix)) {
        throw new TypeError('Input must be a 2D array');
    }
    const m = matrix.length;
    if (m === 0) return;
    const n = matrix[0].length;
    for (let i = 0; i < m; i++) {
        if (!Array.isArray(matrix[i]) || matrix[i].length !== n) {
            throw new TypeError('Matrix must be rectangular');
        }
        for (let j = 0; j < n; j++) {
            if (typeof matrix[i][j] !== 'number' || !Number.isFinite(matrix[i][j])) {
                throw new TypeError('Matrix must contain only finite numbers');
            }
        }
    }

    let firstRowZero = false;
    let firstColZero = false;

    // 1. 1 行目・1 列目のゼロ有無を確認
    for (let i = 0; i < m; i++) {
        if (matrix[i][0] === 0) {
            firstColZero = true;
            break;
        }
    }
    for (let j = 0; j < n; j++) {
        if (matrix[0][j] === 0) {
            firstRowZero = true;
            break;
        }
    }

    // 2. 内部要素を走査し、0 があれば 1 行目/1 列目にマーク
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (matrix[i][j] === 0) {
                matrix[i][0] = 0;
                matrix[0][j] = 0;
            }
        }
    }

    // 3. マークに従ってセルをゼロ化
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (matrix[i][0] === 0 || matrix[0][j] === 0) {
                matrix[i][j] = 0;
            }
        }
    }

    // 4. 最初の行・列を処理
    if (firstColZero) {
        for (let i = 0; i < m; i++) {
            matrix[i][0] = 0;
        }
    }
    if (firstRowZero) {
        for (let j = 0; j < n; j++) {
            matrix[0][j] = 0;
        }
    }
}

export { setZeroes };
// ```

// ---

// ## 5. TypeScript固有の最適化チェックリスト

// * ✅ strict mode: `tsconfig.json` で `strict: true`
// * ✅ `number[][]` 型を明示 → コンパイル時に不正検出
// * ✅ 実行時ガード: `Array.isArray`, `typeof === 'number'`
// * ✅ `void` 戻り型で「in-place 更新」を明示
// * ✅ for ループのみを使用 → V8 最適化に適する
// * ✅ 不要な一時配列生成を避け GC 負荷を最小化
