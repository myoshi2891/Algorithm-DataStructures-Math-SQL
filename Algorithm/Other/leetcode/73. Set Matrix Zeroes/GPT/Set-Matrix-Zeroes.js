// # 1. 問題の分析

// ## 競技プログラミング視点

// * **制約**: `1 <= m, n <= 200` なので最悪でも 40,000 要素。O(mn) 処理は十分許容可能。
// * **単純解**: 0 を検出したら行列をすぐ更新すると二重反映が発生 → 一時フラグ必要。
// * **最適解**: O(1) 追加空間 → 行列の最初の行と列を「フラグ領域」として使う。

// 手順:

// 1. 1列目と1行目にゼロが含まれるか記録。
// 2. 残りの要素を走査し、ゼロがあればその行/列の先頭をゼロに。
// 3. 2でマーキングされた行・列をゼロ化。
// 4. 最後に 1列目と1行目のゼロ処理を反映。

// ## 業務開発視点

// * **可読性**: アルゴリズムの意図をコメントや関数分割で明示。
// * **入力検証**: `matrix` が配列かどうか、サイズが制約内か確認。
// * **例外処理**: 型不正時は `TypeError`、制約超過は `RangeError` を投げる。

// ## JavaScript特有の考慮点

// * **V8最適化**: 配列は number のみ保持、hidden class を安定化。
// * **GC負荷**: 一時配列やオブジェクト生成を避け、行列をそのまま破壊的更新。
// * **ループ**: `for` ループでインデックスアクセスを使用（`forEach`/`map`は避ける）。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ                | 時間計算量 | 空間計算量  | JS実装コスト | 可読性 | 備考        |
// | -------------------- | ----- | ------ | ------- | --- | --------- |
// | 方法A: 1行1列をフラグとして利用   | O(mn) | O(1)   | 低       | 中   | 定番、最適解    |
// | 方法B: O(m+n) 配列でフラグ管理 | O(mn) | O(m+n) | 中       | 高   | 実装直感的     |
// | 方法C: コピー行列を生成        | O(mn) | O(mn)  | 低       | 高   | 小規模限定、非効率 |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択**: 方法A（1行1列をフラグとして利用）
// * **理由**:

//   * O(mn) 時間、O(1) 空間で最適。
//   * JS 実装コストも低い（余分な配列を持たない）。
// * **最適化ポイント**:

//   * `for` ループで単純走査。
//   * 一時オブジェクト生成を避け、破壊的更新。
//   * フラグは boolean 変数で保持。

// ---

// # 4. コード実装（solution.js）

// ```javascript
'use strict';

/**
 * LeetCode形式: Set Matrix Zeroes
 * @param {number[][]} matrix - m x n の整数行列
 * @returns {void} - 行列を in-place で更新（返り値なし）
 * @throws {TypeError} - 入力が配列でない場合
 * @throws {RangeError} - 行列サイズが制約外の場合
 * @complexity 時間 O(mn), 空間 O(1)
 */
var setZeroes = function (matrix) {
    // --- 入力検証 ---
    if (!Array.isArray(matrix)) {
        throw new TypeError('Input must be a 2D array');
    }
    const m = matrix.length;
    if (m === 0) return;
    if (m > 200) throw new RangeError('Row size exceeds 200');
    const n = matrix[0].length;
    if (n === 0) return;
    if (n > 200) throw new RangeError('Column size exceeds 200');

    for (let i = 0; i < m; i++) {
        if (!Array.isArray(matrix[i]) || matrix[i].length !== n) {
            throw new TypeError('Input must be a well-formed 2D array');
        }
        for (let j = 0; j < n; j++) {
            const v = matrix[i][j];
            if (typeof v !== 'number' || !Number.isFinite(v)) {
                throw new TypeError('Matrix must contain finite numbers');
            }
        }
    }

    // --- 本処理 ---
    let firstRowZero = false;
    let firstColZero = false;

    // 1列目にゼロがあるか
    for (let i = 0; i < m; i++) {
        if (matrix[i][0] === 0) {
            firstColZero = true;
            break;
        }
    }

    // 1行目にゼロがあるか
    for (let j = 0; j < n; j++) {
        if (matrix[0][j] === 0) {
            firstRowZero = true;
            break;
        }
    }

    // マーキング
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (matrix[i][j] === 0) {
                matrix[i][0] = 0;
                matrix[0][j] = 0;
            }
        }
    }

    // 内部をゼロ化
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (matrix[i][0] === 0 || matrix[0][j] === 0) {
                matrix[i][j] = 0;
            }
        }
    }

    // 1列目
    if (firstColZero) {
        for (let i = 0; i < m; i++) {
            matrix[i][0] = 0;
        }
    }

    // 1行目
    if (firstRowZero) {
        for (let j = 0; j < n; j++) {
            matrix[0][j] = 0;
        }
    }
};

module.exports = { setZeroes };
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * 配列は数値のみ保持 → hidden class 安定化。
// * `for` ループで走査（`forEach`/`map`は避けた）。
// * 一時配列を作らず、matrix を直接更新。
// * 例外チェックはホットパス外（開始時のみ）。
// * 返り値を返さず in-place 更新、LeetCode の仕様準拠。
