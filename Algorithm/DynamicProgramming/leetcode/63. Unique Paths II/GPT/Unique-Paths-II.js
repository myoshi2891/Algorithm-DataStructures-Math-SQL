// ご指定のテンプレートに従い、「Unique Paths II」（障害物ありのロボット経路数）の解析～実装～検証を **Node.js v18 (CommonJS, 外部ライブラリ不可)** で回答します。

// ---

// # 1. 問題の分析

// ## 競技プログラミング視点

// * DP（動的計画法）が最適。
// * m, n ≤ 100 なので O(mn) = 10,000 程度 → 計算量は余裕。
// * メモリは O(n) に削減可能（行単位で再利用）。
// * V8 向けに固定長配列を使い、push/pop などを避ける。

// ## 業務開発視点

// * 読みやすく保守しやすい命名（`dp`, `rows`, `cols`）。
// * 入力検証を追加（型・サイズ制約・要素が 0/1 か）。
// * エラーは `TypeError` / `RangeError` を明確に投げる。

// ## JavaScript特有の考慮

// * ループは `for` を利用（`forEach`/`map`は避ける）。
// * 配列は単型（すべて number）で GC 負荷を軽減。
// * クロージャ生成を避け、ホットパスに関数呼び出しを置かない。
// * `Array(cols).fill(0)` により Hidden Class を安定化。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ          | 時間計算量 | 空間計算量 | JS実装コスト | 可読性 | 備考                   |
// | -------------- | ----- | ----- | ------- | --- | -------------------- |
// | 方法A: DP 1次元配列  | O(mn) | O(n)  | 低       | 中   | 最小メモリ、行更新で効率的        |
// | 方法B: DP 2次元配列  | O(mn) | O(mn) | 低       | 高   | 実装直感的だが無駄メモリ         |
// | 方法C: DFS + メモ化 | O(mn) | O(mn) | 中       | 中   | 再帰で Stack 負荷、JS では不利 |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択**: 方法A（1次元 DP）
// * **理由**:

//   * O(mn) で十分速い。
//   * 空間 O(n) に削減できる。
//   * JS の GC 負荷を抑え、配列再利用で安定化。
// * **最適化ポイント**:

//   * 1行ごとに上書きするだけでよい。
//   * `if (obstacle) dp[j] = 0; else dp[j] += dp[j-1];` で計算。
//   * 初期化で `dp[0]` を設定してからループ開始。

// ---

// # 4. コード実装（solution.js）

// ```js
'use strict';

/**
 * Unique Paths II
 * @param {number[][]} obstacleGrid - 0/1 のグリッド
 * @returns {number} 到達可能経路数
 * @throws {TypeError} 入力が配列でない / 非数値を含む場合
 * @throws {RangeError} サイズや要素が制約外
 * @complexity Time: O(mn), Space: O(n)
 */
function uniquePathsWithObstacles(obstacleGrid) {
    // --- 入力検証 ---
    if (!Array.isArray(obstacleGrid)) throw new TypeError('Input must be a 2D array');
    const m = obstacleGrid.length;
    if (m < 1 || m > 100) throw new RangeError('Row count out of range');
    const n = obstacleGrid[0].length;
    if (n < 1 || n > 100) throw new RangeError('Column count out of range');

    for (let i = 0; i < m; i++) {
        if (!Array.isArray(obstacleGrid[i]) || obstacleGrid[i].length !== n) {
            throw new TypeError('Each row must be an array of equal length');
        }
        for (let j = 0; j < n; j++) {
            const v = obstacleGrid[i][j];
            if (v !== 0 && v !== 1) throw new RangeError('Grid values must be 0 or 1');
        }
    }

    // --- DP 初期化 ---
    const dp = new Array(n).fill(0);
    dp[0] = obstacleGrid[0][0] === 0 ? 1 : 0;

    // --- DP 更新 ---
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (obstacleGrid[i][j] === 1) {
                dp[j] = 0;
            } else if (j > 0) {
                dp[j] += dp[j - 1];
            }
        }
    }

    return dp[n - 1];
}

// ---- 簡易テスト / ベンチ ----
if (require.main === module) {
    const assert = require('node:assert');
    const { performance } = require('node:perf_hooks');

    // サンプル
    assert.strictEqual(
        uniquePathsWithObstacles([
            [0, 0, 0],
            [0, 1, 0],
            [0, 0, 0],
        ]),
        2,
    );
    assert.strictEqual(
        uniquePathsWithObstacles([
            [0, 1],
            [0, 0],
        ]),
        1,
    );

    // 境界
    assert.strictEqual(uniquePathsWithObstacles([[0]]), 1);
    assert.strictEqual(uniquePathsWithObstacles([[1]]), 0);
    assert.strictEqual(uniquePathsWithObstacles([[0, 0, 0, 0]]), 1);

    // 例外系
    try {
        uniquePathsWithObstacles('x');
        assert.fail();
    } catch (e) {
        assert.ok(e instanceof TypeError);
    }
    try {
        uniquePathsWithObstacles([[2]]);
        assert.fail();
    } catch (e) {
        assert.ok(e instanceof RangeError);
    }

    // ベンチ
    const rows = 100,
        cols = 100;
    const big = Array.from({ length: rows }, () => Array(cols).fill(0));
    big[50][50] = 1; // 障害物

    // ウォームアップ
    uniquePathsWithObstacles(big);

    const t0 = performance.now();
    const res = uniquePathsWithObstacles(big);
    const t1 = performance.now();

    console.log(
        JSON.stringify({
            result: res,
            ms: +(t1 - t0).toFixed(3),
            rows,
            cols,
        }),
    );
}

module.exports = { uniquePathsWithObstacles };
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * ループは `for`。
// * `dp` は固定長 `Array(n)` を再利用。
// * 値は `0/1` のみで Hidden Class が安定。
// * Pure function として副作用なし。
// * 例外は入力検証フェーズで早期に投げる。

// ---
