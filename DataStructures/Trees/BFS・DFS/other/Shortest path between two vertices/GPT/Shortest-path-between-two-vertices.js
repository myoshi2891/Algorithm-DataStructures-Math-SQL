// # 1. 問題の分析

// ## 競技プログラミング視点

// * **制約**: `N ≤ 100,000` → O(N) 解法が必須。
// * **手法候補**: BFS / DFS で親情報を保持し、`Y` 到達後に経路を復元。
// * **一意性保証**: 木なので X-Y 間の最短経路は一意。
// * **速度最優先**: BFS の配列 queue を `shift()` ではなく、インデックス進行方式で実装。

// ## 業務開発視点

// * **保守性**: グラフ構築、探索、経路復元を関数分割。
// * **入力検証**: 範囲外の頂点番号や不正な辺定義に例外。
// * **エラーハンドリング**: `TypeError` / `RangeError` を早期に投げる。

// ## JavaScript特有の考慮点

// * **V8最適化**: 配列に統一した数値型を保持し hidden class 崩壊を防ぐ。
// * **GC負荷軽減**: 経路記録は `parent[]` で管理、一時配列生成を抑制。
// * **ループ**: `for` ベース。`map` / `forEach` は避ける。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ                    | 時間計算量 | 空間計算量 | JS実装コスト | 可読性 | 備考                |
// | ------------------------ | ----- | ----- | ------- | --- | ----------------- |
// | **方法A**: BFS + parent 復元 | O(N)  | O(N)  | 低       | 中   | 標準。最短経路一意なので最速。   |
// | 方法B: DFS + backtrack     | O(N)  | O(N)  | 中       | 高   | スタックリスク (再帰深い場合)。 |
// | 方法C: Floyd-Warshall など   | O(N²) | O(N²) | 高       | 低   | 不適。               |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択**: 方法A（BFS + parent 復元）
// * **理由**:

//   * O(N) 時間で木全体を探索できる。
//   * parent 配列を使えば経路復元が O(N) で簡潔。
// * **JS最適化ポイント**:

//   * `queue` は `push`/インデックス参照で実装（`shift` 不使用）。
//   * 配列を事前に `N+1` サイズで確保。
//   * 経路復元時は逆順にたどり、最後に反転。

// ---

// # 4. コード実装（solution.js）

// ```js
'use strict';

/**
 * 木の最短経路を BFS で求める
 * @param {number} n - 頂点数 (1 <= n <= 100000)
 * @param {number} x - 始点 (1 <= x <= n)
 * @param {number} y - 終点 (1 <= y <= n, x != y)
 * @param {Array<[number, number]>} edges - 辺の配列
 * @returns {number[]} 最短経路に含まれる頂点番号の配列
 * @throws {TypeError|RangeError}
 * @complexity O(N) 時間 / O(N) 空間
 */
function shortestPathInTree(n, x, y, edges) {
    if (!Number.isInteger(n) || n < 1 || n > 100000) {
        throw new RangeError('Invalid number of nodes');
    }
    if (
        !Number.isInteger(x) ||
        !Number.isInteger(y) ||
        x < 1 ||
        x > n ||
        y < 1 ||
        y > n ||
        x === y
    ) {
        throw new RangeError('Invalid start or end node');
    }
    if (!Array.isArray(edges) || edges.length !== n - 1) {
        throw new RangeError('Edges must contain exactly n-1 pairs');
    }

    // 隣接リスト構築
    const graph = Array.from({ length: n + 1 }, () => []);
    for (let i = 0; i < edges.length; i++) {
        const [a, b] = edges[i];
        if (
            !Number.isInteger(a) ||
            !Number.isInteger(b) ||
            a < 1 ||
            b < 1 ||
            a > n ||
            b > n ||
            a === b
        ) {
            throw new RangeError(`Invalid edge at index ${i}`);
        }
        graph[a].push(b);
        graph[b].push(a);
    }

    // BFS
    const parent = new Int32Array(n + 1).fill(-1);
    const queue = new Int32Array(n);
    let head = 0,
        tail = 0;
    queue[tail++] = x;
    parent[x] = 0; // 始点をマーク

    while (head < tail) {
        const cur = queue[head++];
        if (cur === y) break;
        const neighbors = graph[cur];
        for (let i = 0; i < neighbors.length; i++) {
            const nxt = neighbors[i];
            if (parent[nxt] === -1) {
                parent[nxt] = cur;
                queue[tail++] = nxt;
            }
        }
    }

    // 経路復元
    const path = [];
    for (let v = y; v !== 0; v = parent[v]) {
        path.push(v);
        if (v === x) break;
    }
    path.reverse();
    return path;
}

// ---- 実行部分 ----
if (require.main === module) {
    const input = require('fs').readFileSync(0, 'utf8').trim().split('\n');
    const [N, X, Y] = input[0].split(' ').map(Number);
    const edges = input.slice(1).map((line) => line.split(' ').map(Number));
    const result = shortestPathInTree(N, X, Y, edges);
    console.log(result.join('\n'));
}

module.exports = { shortestPathInTree };
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * ループは `for` で記述（`map`/`forEach` 不使用）。
// * BFS キューは `Int32Array` + head/tail 管理で `shift()` 回避。
// * 隣接リストは `Array`（疎配列を避け、hidden class 安定）。
// * 経路復元は逆順に辿り、最後に `reverse` 1回だけ。
// * エラーチェックはホットパス外。

// ---

// ✅ これで **O(N) 時間 / O(N) 空間** で最短経路が求められます。

// ---
