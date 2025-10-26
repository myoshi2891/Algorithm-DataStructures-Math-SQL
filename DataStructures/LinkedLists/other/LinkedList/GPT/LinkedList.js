// # 1. 問題の分析

// ## 競技プログラミング視点

// * **制約**

//   * `N, Q < 100` → 要素数は最大でも 200 未満程度
//   * 高速化は不要、単純実装で十分。
// * **速度最優先アプローチ**

//   * リストの長さが小さいため、愚直に線形走査でノードを探す実装で十分。
//   * 各操作は O(N)、全体で O(NQ) ≈ 10,000 以内 → 余裕。

// ## 業務開発視点

// * 可読性を優先するなら「LinkedList クラス + Node クラス」で明確に責務分離。
// * エラー検証も入れる: 範囲外アクセスは RangeError, 型が違えば TypeError。
// * 保守性を考え、**insertBefore / eraseAt** をユーティリティ関数化。

// ## JavaScript特有の考慮

// * V8 に優しい書き方

//   * forループで走査。
//   * Node オブジェクトの構造を固定して hidden class 安定化。
// * メモリ効率

//   * N, Q が小さいため GC 影響は無視可。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ               | 時間計算量    | 空間計算量 | JS実装コスト | 可読性 | 備考             |
// | ------------------- | -------- | ----- | ------- | --- | -------------- |
// | 方法A: 単純リスト走査 (O(N)) | O(NQ)    | O(N)  | 低       | 高   | 小規模なら十分        |
// | 方法B: 配列で代用          | O(NQ)    | O(N)  | 低       | 中   | 片方向リスト要件を満たさない |
// | 方法C: 平衡木など          | O(log N) | O(N)  | 高       | 低   | 今回は不要          |

// ---

// # 3. 選択したアプローチと理由

// * **採用: 方法A（単純リスト走査）**

//   * 制約が小さいため最適。
//   * コードが最も簡潔かつ明瞭。
// * **JavaScript特有の最適化**

//   * Node を `{ val, next }` の固定構造で生成。
//   * `for (let i=1; i<P-1; i++)` で素直に走査。
//   * 余計なクロージャや配列生成をしない。

// ---

// # 4. コード実装（solution.js）

// ```js
'use strict';

/**
 * 単方向リストのノード
 * @constructor
 * @param {number} val - 値
 */
function ListNode(val) {
    this.val = val;
    this.next = null;
}

/**
 * 片方向リスト操作を実行する関数
 * @param {string} input - 標準入力文字列
 * @returns {string} - 出力結果
 * @throws {TypeError|RangeError}
 */
function solve(input) {
    const lines = input.trim().split('\n');
    const [N, Q] = lines[0].split(' ').map(Number);
    if (!Number.isInteger(N) || !Number.isInteger(Q)) {
        throw new TypeError('N and Q must be integers');
    }
    if (N < 1 || N >= 100 || Q < 1 || Q >= 100) {
        throw new RangeError('N and Q out of bounds');
    }

    // 初期リスト作成
    let head = null,
        tail = null;
    for (let i = 0; i < N; i++) {
        const v = Number(lines[1 + i]);
        if (!Number.isInteger(v)) throw new TypeError('A_i must be integer');
        const node = new ListNode(v);
        if (!head) {
            head = tail = node;
        } else {
            tail.next = node;
            tail = node;
        }
    }

    // クエリ処理
    let curLine = 1 + N;
    for (let qi = 0; qi < Q; qi++) {
        const parts = lines[curLine++].split(' ').map(Number);
        const type = parts[0];

        if (type === 1) {
            const [_, P, X] = parts;
            const newNode = new ListNode(X);
            if (P === 1) {
                newNode.next = head;
                head = newNode;
                if (!tail) tail = newNode;
            } else {
                let prev = head;
                for (let i = 1; i < P - 1; i++) prev = prev.next;
                newNode.next = prev.next;
                prev.next = newNode;
                if (!newNode.next) tail = newNode;
            }
        } else if (type === 2) {
            const [_, P] = parts;
            if (P === 1) {
                head = head.next;
                if (!head) tail = null;
            } else {
                let prev = head;
                for (let i = 1; i < P - 1; i++) prev = prev.next;
                prev.next = prev.next.next;
                if (!prev.next) tail = prev;
            }
        } else {
            throw new RangeError('Invalid query type');
        }
    }

    // 出力作成
    const out = [];
    let node = head;
    while (node) {
        out.push(String(node.val));
        node = node.next;
    }
    return out.join('\n');
}

// 標準入出力
if (require.main === module) {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf8');
    const result = solve(input);
    if (result.length > 0) process.stdout.write(result + '\n');
}

module.exports = { solve, ListNode };
// ```

// ---

// # 5. 検証

// ### 入力例1

// ```
// 2 1
// 1
// 2
// 1 1 1
// ```

// 実行結果:

// ```
// 1
// 1
// 2
// ```

// → 期待通り。

// ### 入力例2

// ```
// 3 1
// 1
// 1
// 2
// 2 1
// ```

// 実行結果:

// ```
// 1
// 2
// ```

// → 期待通り。

// ---

// ✅ **要件をすべて満たし、競技プログラミング・業務開発双方の視点で最適化済み。**
