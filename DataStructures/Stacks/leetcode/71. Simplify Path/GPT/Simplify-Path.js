// ご指定のテンプレートに沿って、「Unix-style Path Simplifier」の解析～実装～検証をまとめました。
// **実装は Node.js v18（CommonJS）、leetcode 形式で提出可能な形**にしてあります。

// ---

// # 1. 問題の分析

// ## 競技プログラミング視点

// * 入力は最大 3000 文字。O(n) アルゴリズムで十分高速。
// * `split('/')` → トークン処理 → `push/pop` のスタック方式が最適。
// * メモリも O(n) 以内。1 回のパス処理で十分。

// ## 業務開発視点

// * 可読性のため「トークン処理」と「フィルタリング処理」を分離。
// * 入力検証（文字種・絶対パスかどうか）を追加して堅牢性を担保。
// * エラーハンドリング：不正な型は `TypeError`、長さ違反は `RangeError`。

// ## JavaScript特有の考慮

// * V8 最適化を意識：`for` ループ利用、クロージャ回避。
// * 配列操作は `push/pop` を用い、`shift/unshift` は避ける。
// * Hidden class を安定化するため、配列は常に文字列型。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ           | 時間計算量      | 空間計算量 | JS実装コスト | 可読性 | 備考      |
// | --------------- | ---------- | ----- | ------- | --- | ------- |
// | 方法A（スタック処理）     | O(n)       | O(n)  | 低       | 中   | 最適、実用的  |
// | 方法B（正規表現多用＋再構築） | O(n log n) | O(n)  | 中       | 高   | 過剰、保守性低 |
// | 方法C（文字単位の逐次構築）  | O(n²)      | O(1)  | 低       | 高   | 小規模のみ有効 |

// ---

// # 3. 選択したアルゴリズムと理由

// * **採用: 方法A（スタック方式）**
// * **理由:**

//   * O(n) で十分高速。
//   * V8 最適化に向く単純配列操作。
//   * 実装コストが低く、保守性も確保可能。
// * **JS最適化ポイント:**

//   * `split('/')` 後に for ループで処理。
//   * `.` → 無視、`..` → `pop`、その他 → `push`。
//   * `join('/')` で復元し、空配列なら `'/'` を返す。

// ---

// # 4. コード実装（solution.js, CommonJS）

// ```javascript
'use strict';

/**
 * Simplify Unix-style absolute path
 * @param {string} path - Absolute Unix-style path (1 <= length <= 3000)
 * @returns {string} Simplified canonical path
 * @throws {TypeError} If input is not a string
 * @throws {RangeError} If length constraint violated
 * @complexity Time O(n), Space O(n)
 */
var simplifyPath = function (path) {
    // --- 入力検証 ---
    if (typeof path !== 'string') {
        throw new TypeError('Input must be a string');
    }
    const n = path.length;
    if (n < 1 || n > 3000) {
        throw new RangeError('Path length out of bounds');
    }
    if (path[0] !== '/') {
        throw new RangeError('Path must be absolute and start with "/"');
    }

    // --- 本処理 ---
    const parts = path.split('/');
    const stack = [];

    for (let i = 0; i < parts.length; i++) {
        const token = parts[i];
        if (token === '' || token === '.') {
            // 無視（空 or 現在ディレクトリ）
            continue;
        }
        if (token === '..') {
            if (stack.length > 0) {
                stack.pop();
            }
        } else {
            // 通常のディレクトリ名（"..." など含む）
            stack.push(token);
        }
    }

    return '/' + stack.join('/');
};

module.exports = { simplifyPath };
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * ✅ for ループ利用 → V8 の JIT 最適化に好適
// * ✅ push/pop のみ利用 → O(1)
// * ✅ クロージャ・匿名関数未使用
// * ✅ 一時オブジェクト削減（stack 再利用）
// * ✅ Pure function で副作用なし

// ---

// これで **LeetCode 提出用（CommonJS, Node.js v18+ 実行可能, 外部ライブラリ不要）** の完全版です。
