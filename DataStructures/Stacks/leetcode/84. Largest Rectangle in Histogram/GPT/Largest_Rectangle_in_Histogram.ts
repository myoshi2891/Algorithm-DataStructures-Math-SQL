// ### 1. 問題の分析

// * **競技プログラミング視点での分析**

//   * 最速は「単調増加スタック」。各棒を高々1回 `push/pop` する一次走査で、より低い棒に遭遇した瞬間に「その高さを最小とする最大幅」を確定。末尾に番兵（高さ0扱い）を加えるとループが一度で済む。
//   * メモリはスタックで **O(n)** 必要。ただし配列を固定長 `Int32Array` として確保し、`top` インデックスで管理すれば GC 負荷を最小化できる。

// * **業務開発視点での分析**

//   * **型安全性**：入力を `readonly number[]` とし、破壊的操作を避けて Pure にする。実行前に長さ・要素範囲を検証。
//   * **保守性**：命名（`stack`, `top`, `maxArea` 等）とコメントでロジックを明確化。例外種別は型違反を `TypeError`、制約逸脱を `RangeError` に統一。

// * **TypeScript特有の考慮点**

//   * **型推論**：`readonly number[]` により入力の不変性をコンパイル時に担保。
//   * **コンパイル時最適化**：単純な数値演算と `for` ループのみでホットパスを安定化。
//   * **ジェネリクス**：本問題は数値専用のため不要。過剰な抽象化はパフォーマンス・可読性を損ねるため採用しない。

// ---

// ### 2. アルゴリズムアプローチ比較

// | アプローチ                          | 時間計算量      | 空間計算量 | TS実装コスト | 型安全性 | 可読性 | 備考           |
// | ------------------------------ | ---------- | ----- | ------- | ---- | --- | ------------ |
// | 方法A: 単調増加スタック                  | O(n)       | O(n)  | 低       | 高    | 高   | 最速・実務/競プロ定番  |
// | 方法B: 分割統治（最小値取得をセグ木/スパーステーブル等） | O(n log n) | O(n)  | 中       | 中    | 中   | 実装重・保守コスト高   |
// | 方法C: 全区間二重ループ                  | O(n²)      | O(1)  | 低       | 高    | 高   | n=1e5 では非現実的 |

// ---

// ### 3. 選択したアルゴリズムと理由

// * **選択したアプローチ**: 方法A（単調増加スタック）
// * **理由**:

//   * **計算量**: 一度の線形走査で最良の O(n)。
//   * **型安全性**: 数値のみ・不変参照で実装が単純、検証もしやすい。
//   * **保守性**: 番兵込みの一つのループで読みやすく、境界条件が明瞭。
// * **TypeScript特有の最適化ポイント**:

//   * `readonly number[]` により不変性と副作用排除。
//   * `Int32Array`＋手動 `top` 管理で割り当て回数・GC を抑制。
//   * 例外はホットパス前に早期判定して実行時コストを低減。

// ---

// ### 4. 実装コード（LeetCode 形式 / **ESM 準拠のTS**）

// > ※ LeetCodeのTypeScript解答は関数定義のみで評価されます（`export` は不要）。ESM要件はローカル実行時にも満たせるよう、モジュール依存のない純粋関数として実装しています。

// ```ts
/**
 * Largest Rectangle in Histogram
 * 単調増加スタックで最大長方形面積を求める Pure 関数
 *
 * @param heights - 棒の高さ配列（readonly, 整数, 0..1e4）
 * @returns 最大長方形の面積
 * @throws {TypeError} 入力が配列でない／数値でない／整数でない／有限でない
 * @throws {RangeError} 長さや要素値が制約外（length: 1..1e5, 値域: 0..1e4）
 * @complexity Time: O(n), Space: O(n)
 */
function largestRectangleArea(heights: readonly number[]): number {
    // ---- 入力検証（軽量＆早期）----
    if (!Array.isArray(heights)) {
        throw new TypeError('Input must be an array of numbers');
    }
    const n = heights.length;
    if (n < 1 || n > 1e5) {
        throw new RangeError('Array length out of bounds [1, 1e5]');
    }
    for (let i = 0; i < n; i++) {
        const v = heights[i];
        // 厳密に整数・有限・非負・上限チェック
        if (typeof v !== 'number' || !Number.isFinite(v) || !Number.isInteger(v)) {
            throw new TypeError('All elements must be finite integers');
        }
        if (v < 0 || v > 1e4) {
            throw new RangeError('Element out of bounds [0, 1e4]');
        }
    }

    // ---- 本処理：単調増加スタック（インデックス保持）----
    // stack は「インデックス」を保持。height は heights[idx] で参照。
    // i==n のとき curr=0 とみなし番兵として残りを一括処理。
    const stack = new Int32Array(n + 1); // 固定長・単型化でGC抑制
    let top = -1;
    let maxArea = 0;

    for (let i = 0; i <= n; i++) {
        const curr = i === n ? 0 : (heights[i] as number);
        while (top >= 0 && curr < (heights[stack[top]] as number)) {
            const h = heights[stack[top--]] as number;
            const leftIndex = top >= 0 ? stack[top] : -1; // 直前に残った更に低い棒の位置
            const width = i - leftIndex - 1; // (右境界 i-1) - (左境界) の距離
            const area = h * width;
            if (area > maxArea) maxArea = area;
        }
        stack[++top] = i;
    }

    return maxArea;
}

/* ローカルESM向け補助（LeetCodeでは不要）
   ファイルをTS/ESMとして扱うための空エクスポートを入れたい場合は以下を有効化:
   export {};
*/
// ```

// ---

// ## TypeScript固有の最適化観点（チェックリスト）

// * `readonly number[]` で**不変性**を型で担保（副作用なしの Pure）。
// * ループは `for`、高階関数は未使用（割当・クロージャ生成を回避）。
// * `Int32Array` の**固定長スタック**＋`top` 管理で **GC** と**型不安定化**を抑制。
// * 例外はホットパス前の**早期バリデーション**で分離。
// * リテラル/プロパティの形状変更なし（hidden class 安定）。
