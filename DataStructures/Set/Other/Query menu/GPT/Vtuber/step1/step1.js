// ご提示のテンプレートに従い、**解析 → アルゴリズム比較 → 採用方針 → 実装** の流れで、Node.js (v16.17.1, CommonJS, 外部ライブラリ禁止) 向けの **leetcode回答形式** でまとめます。

// ---

// # 1. 問題の分析

// ## 競技プログラミング視点

// * N, K ≤ 100,000 なので、イベント処理は **O(N + K log N)** 以内で収めたい。
// * 「handshake」は最大 10 回しかないため、**ソートコストを許容できる**。
// * join/leave は **Set** を使えば O(1) で処理可能。
// * handshake のたびに `Array.from(set).sort()` して出力すれば十分高速。

// ## 業務開発視点

// * 可読性: イベントをハンドラ関数で分割。
// * 保守性: join/leave/handshake を個別に扱い、仕様変更時にも安全。
// * エラーハンドリング: 不正なイベント形式を検出して `RangeError` を投げる。

// ## JavaScript特有の考慮点

// * **V8 最適化**:

//   * join/leave は `Set` を利用し hidden class 安定化。
//   * handshake の sort は `Array.from(set)` の後に sort、GC負担は handshake ≤ 10 回のため軽微。
// * **配列操作**: push/pop のみ利用、shift/unshift は使わない。
// * **GC対策**: 一時配列の生成は handshake 時のみに限定。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ                      | 時間計算量          | 空間計算量 | JS実装コスト | 可読性 | 備考                         |
// | -------------------------- | -------------- | ----- | ------- | --- | -------------------------- |
// | 方法A: Set + handshake時にsort | O(N + K log N) | O(N)  | 低       | 高   | handshake ≤ 10 なので最適       |
// | 方法B: 常にソート済配列を維持           | O(K log N)     | O(N)  | 中       | 中   | insert/remove の logN が累積する |
// | 方法C: 配列探索 (線形)             | O(NK)          | O(N)  | 低       | 高   | N,K=10^5 では TLE            |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択: 方法A (Set + handshake時にsort)**
// * 理由:

//   * handshake ≤ 10 なのでソートコストは軽微。
//   * join/leave は O(1) で高速。
//   * 実装がシンプルで保守性も高い。
// * **JS特有の最適化**:

//   * `Set` を使って join/leave を定数時間で処理。
//   * `Array.from(set)` → sort は handshake 時のみ。
//   * 出力はバッファにまとめて最後に一度 `console.log`。

// ---

// # 4. コード実装（solution.js, CommonJS）

// ```javascript
'use strict';

/**
 * アイドルグループ管理とイベント処理
 * @param {string} input 標準入力からの文字列
 * @returns {string} 握手会出力結果（改行区切り）
 * @throws {TypeError} 入力型不正
 * @throws {RangeError} イベント形式不正
 * @complexity O(N + K log N)
 */
function solve(input) {
    if (typeof input !== 'string') throw new TypeError('Input must be a string');
    const lines = input.trim().split('\n');
    if (lines.length === 0) return '';

    const [nStr, kStr] = lines[0].split(' ');
    const N = Number(nStr),
        K = Number(kStr);

    if (!Number.isInteger(N) || !Number.isInteger(K)) {
        throw new TypeError('N and K must be integers');
    }
    if (N < 1 || K < 1 || N > 1e5 || K > 1e5) {
        throw new RangeError('N or K out of range');
    }

    const members = new Set();
    let idx = 1;

    // 初期メンバー
    for (let i = 0; i < N; i++, idx++) {
        const name = lines[idx];
        members.add(name);
    }

    let output = [];

    // イベント処理
    for (let i = 0; i < K; i++, idx++) {
        const parts = lines[idx].split(' ');
        const cmd = parts[0];

        if (cmd === 'join') {
            const name = parts[1];
            members.add(name);
        } else if (cmd === 'leave') {
            const name = parts[1];
            members.delete(name);
        } else if (cmd === 'handshake') {
            if (members.size > 0) {
                const sorted = Array.from(members).sort();
                for (const name of sorted) output.push(name);
            }
        } else {
            throw new RangeError(`Unknown command: ${cmd}`);
        }
    }

    return output.join('\n');
}

// 標準入出力 (leetcode形式)
if (require.main === module) {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf8');
    const result = solve(input);
    if (result.length > 0) console.log(result);
}

module.exports = { solve };
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * ✅ ループは `for` を使用（`forEach/map` 不使用）。
// * ✅ join/leave で一時配列生成なし。
// * ✅ handshake 時のみ `Array.from + sort`。
// * ✅ 出力は配列にバッファして最後に `join('\n')`。
// * ✅ hidden class 安定化 (`Set` のみで管理)。

// ---
