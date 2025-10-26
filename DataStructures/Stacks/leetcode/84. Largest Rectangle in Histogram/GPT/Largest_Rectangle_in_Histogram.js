// 1. 問題の分析
//    • 競技プログラミング視点

// * 最適解は単調増加スタックでの一次走査。各棒を「最小高さとして延ばせる最大幅」を、より低い棒に遭遇した瞬間に確定させる。番兵 0 を末尾に追加して最後まで一括処理。
// * 計算量 O(n)、各インデックスは push/pop それぞれ高々1回。

// • 業務開発視点

// * 可読性と安全性のため、関数は Pure、入力検証を早期に実施（配列型、長さ範囲、整数・有限、値域）。
// * 命名を明確化（largestRectangleArea, stack, top など）。
// * 例外方針：型不一致は TypeError、制約逸脱は RangeError。

// • JavaScript特有の考慮点

// * V8 最適化：数値単型配列を前提に Int32Array をスタックとして利用（hidden class 安定、GC 圧縮）。
// * ループはインデックス for。クロージャや高階関数を避ける。
// * 余計なオブジェクト生成を抑制（配列再利用・固定長 stack）。

// ---

// 2. アルゴリズムアプローチ比較

// | アプローチ               | 時間計算量      | 空間計算量 | JS実装コスト | 可読性 | 備考                       |
// | ------------------- | ---------- | ----- | ------- | --- | ------------------------ |
// | 方法A（単調スタック）         | O(n)       | O(n)※ | 低       | 中   | 最速・実戦定番。※Int32Array で最小限 |
// | 方法B（分割統治 + セグ木/ソート） | O(n log n) | O(n)  | 中       | 高   | 実装重くバグりやすい               |
// | 方法C（全区間二重ループ）       | O(n²)      | O(1)  | 低       | 高   | 小規模専用、今回の制約では不可          |

// ---

// 3. 選択したアルゴリズムと理由
//    • 選択したアプローチ: 方法A（単調増加スタック）
//    • 理由: 一回の線形走査で各棒をちょうど1回 push/pop、最短計算量。実装も短く堅牢。
//    • JavaScript特有の最適化ポイント:

// * stack を `Int32Array`（長さ n+1）で確保し、`top` で手動管理。
// * 末尾番兵（高さ 0 同等）によりループ一本化。
// * すべて `for` とプリミティブ演算のみでホットパスを安定化。

// ---

// 4. コード実装（solution.js）
//    （実行環境: **CommonJS**, Node.js v18、外部ライブラリ不可）

// ```javascript
'use strict';

/**
 * Largest Rectangle in Histogram
 * 単調増加スタックで最大長方形面積を求める Pure 関数
 *
 * @param {number[]} heights - 各棒の高さ（整数, 長さ 1..1e5, 値 0..1e4）
 * @returns {number} 最大長方形の面積
 * @throws {TypeError} 入力が配列でない／数値でない／整数でない／有限でない
 * @throws {RangeError} 長さや値が制約外
 *
 * 時間計算量: O(n)  （各 index の push/pop は高々1回）
 * 空間計算量: O(n)  （Int32Array スタック; 追加の配列生成なし）
 */
function largestRectangleArea(heights) {
    // --- 入力検証 ---
    if (!Array.isArray(heights)) {
        throw new TypeError('Input must be an array of integers');
    }
    const n = heights.length;

    // 問題制約の範囲チェック（LeetCode準拠）
    if (n < 1 || n > 1e5) {
        throw new RangeError('Array length out of bounds [1, 1e5]');
    }

    // 要素型・範囲チェック（整数・有限・値域）
    for (let i = 0; i < n; i++) {
        const v = heights[i];
        if (typeof v !== 'number' || !Number.isFinite(v) || !Number.isInteger(v)) {
            throw new TypeError('All elements must be finite integers');
        }
        if (v < 0 || v > 1e4) {
            throw new RangeError('Element out of bounds [0, 1e4]');
        }
    }

    // --- 本処理（単調増加スタック） ---
    // スタックは「インデックス」を保持。対応する高さは heights[idx]。
    // curr < heights[stack[top]] になったら、pop して面積を確定。
    // 番兵として i==n のとき curr=0 とみなすことで一括排出。
    const stack = new Int32Array(n + 1); // 固定長、GC圧縮
    let top = -1;
    let maxArea = 0;

    for (let i = 0; i <= n; i++) {
        const curr = i === n ? 0 : heights[i];

        // 現在の高さがスタック頂点より低い → 頂点を高さとする長方形の幅が確定
        while (top >= 0 && curr < heights[stack[top]]) {
            const h = heights[stack[top--]];
            const leftIndex = top >= 0 ? stack[top] : -1; // 左境界（直前に残った更に低い棒）
            const width = i - leftIndex - 1; // (右境界 i-1) - (左境界) の距離
            const area = h * width;
            if (area > maxArea) maxArea = area;
        }
        // 単調増加を保つように現在位置を push
        stack[++top] = i;
    }

    return maxArea;
}

module.exports = { largestRectangleArea };
// ```

// ---

// 5. 追加メモ（JS最適化チェックリスト）

// * ループは `for` のみ、コールバック生成を避ける
// * スタックは `Int32Array` で固定長・単型化
// * 一時オブジェクト／配列生成なし（面積/幅はプリミティブ）
// * hidden class を安定化（同一プロパティ順、動的追加なし）
// * 例外はホットパス前の早期チェックで分離（正常系を高速化）
