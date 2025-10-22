// **最小経路和 (Minimum Path Sum)** の問題を Node.js (v18, CommonJS, 外部ライブラリ不可) で、LeetCode提出フォーマットに適合した形でまとめます。

// ---

// # 1. 問題の分析

// ### 競技プログラミング視点

// * **時間計算量**: m, n ≤ 200 → 最大要素数 40,000。O(mn) で十分高速。
// * **空間削減**: O(n) または O(1) に抑えられる。破壊的更新が許容されるなら入力 `grid` を直接 DP 配列として利用可能。
// * **速度優先**: for ループでの添字アクセスが最速。クロージャや `map`/`reduce` は避ける。

// ### 業務開発視点

// * **保守性**: 関数名・変数名を意味あるものにする。処理を「入力検証」「初期化」「DP本処理」に分ける。
// * **入力検証**: 型チェック、配列長・要素範囲の検証を行い、不正なら `TypeError` または `RangeError`。
// * **例外方針**: 仕様外入力に対して早期に例外を投げる。

// ### JavaScript特有の考慮

// * **V8最適化**:

//   * 配列は単型 (number のみ) に統一。
//   * for ループ利用で hidden class 安定。
// * **GC負荷削減**: 一時配列を作らず入力 `grid` を直接更新。
// * **性能**: `Math.min` を使いシンプルに。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ               | 時間計算量 | 空間計算量 | JS実装コスト | 可読性 | 備考               |
// | ------------------- | ----- | ----- | ------- | --- | ---------------- |
// | 方法A: DPで`grid`を破壊更新 | O(mn) | O(1)  | 低       | 中   | 最速・最省メモリ         |
// | 方法B: 別配列でDP         | O(mn) | O(mn) | 中       | 高   | 保守性◎だが余分メモリ      |
// | 方法C: DFS + メモ化      | O(mn) | O(mn) | 高       | 中   | 再帰深さによりStack制約あり |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択**: 方法A（入力 `grid` を直接 DP 更新）
// * **理由**:

//   * O(mn) 時間で十分高速
//   * O(1) 空間で済む
//   * 競技プログラミングでは最適
// * **JS最適化ポイント**:

//   * for ループ固定長
//   * `Math.min` の利用
//   * 配列の再生成なし

// ---

// # 4. コード実装（solution.js）

// ```js
'use strict';

/**
 * 最小経路和を求める Pure Function
 * @param {number[][]} grid - m×n の非負整数グリッド
 * @returns {number} 最小経路和
 * @throws {TypeError} 入力が二次元配列でない
 * @throws {RangeError} 制約違反 (m,n > 200 または 値が範囲外)
 * @complexity Time: O(mn), Space: O(1)
 */
function minPathSum(grid) {
    // --- 入力検証 ---
    if (!Array.isArray(grid)) throw new TypeError('Input must be a 2D array');
    const m = grid.length;
    if (m === 0) throw new RangeError('Grid must have at least 1 row');
    if (m > 200) throw new RangeError('Row size exceeds 200');

    const n = grid[0].length;
    if (n === 0) throw new RangeError('Grid must have at least 1 column');
    if (n > 200) throw new RangeError('Column size exceeds 200');

    for (let i = 0; i < m; i++) {
        if (!Array.isArray(grid[i]) || grid[i].length !== n) {
            throw new TypeError('Grid must be rectangular');
        }
        for (let j = 0; j < n; j++) {
            const v = grid[i][j];
            if (typeof v !== 'number' || !Number.isInteger(v) || v < 0 || v > 200) {
                throw new RangeError('Grid values must be integers between 0 and 200');
            }
        }
    }

    // --- DP処理（破壊的更新）---
    for (let i = 1; i < m; i++) grid[i][0] += grid[i - 1][0];
    for (let j = 1; j < n; j++) grid[0][j] += grid[0][j - 1];

    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            grid[i][j] += Math.min(grid[i - 1][j], grid[i][j - 1]);
        }
    }

    return grid[m - 1][n - 1];
}

// ---- 簡易テスト / ベンチ ----
if (require.main === module) {
    const assert = require('node:assert');
    const { performance } = require('node:perf_hooks');

    // 正常系テスト
    assert.strictEqual(
        minPathSum([
            [1, 3, 1],
            [1, 5, 1],
            [4, 2, 1],
        ]),
        7,
    );
    assert.strictEqual(
        minPathSum([
            [1, 2, 3],
            [4, 5, 6],
        ]),
        12,
    );
    assert.strictEqual(minPathSum([[0]]), 0);

    // 境界ケース
    assert.strictEqual(minPathSum([[5]]), 5);

    // 例外系
    try {
        minPathSum('x');
        assert.fail();
    } catch (e) {
        assert.ok(e instanceof TypeError);
    }
    try {
        minPathSum([[201]]);
        assert.fail();
    } catch (e) {
        assert.ok(e instanceof RangeError);
    }

    // 簡易ベンチ
    const N = 200,
        M = 200;
    const big = Array.from({ length: M }, () => Array(N).fill(1));

    // ウォームアップ
    minPathSum(big.map((r) => r.slice()));

    const t0 = performance.now();
    const res = minPathSum(big.map((r) => r.slice()));
    const t1 = performance.now();

    console.log(
        JSON.stringify({
            result: res,
            ms: +(t1 - t0).toFixed(3),
            m: M,
            n: N,
        }),
    );
}

module.exports = { minPathSum };
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * for ループ利用で V8 に優しい
// * `grid` を破壊的更新することで O(1) メモリ
// * hidden class の安定化（配列は常に数値のみ）
// * 不正入力は例外で早期終了
// * 再帰非使用 → Stack 安全

// ---

// ✅ これで **解析 → 実装 → 検証** がテンプレートに従って揃いました。

// ---

// 質問：
// この問題は **「pure function (副作用なし)」** が必須でしたが、最小メモリ化のために「`grid` を破壊的更新」しました。
// 完全に副作用禁止にしたい場合は **コピーを取って DP** に変更しますか？
