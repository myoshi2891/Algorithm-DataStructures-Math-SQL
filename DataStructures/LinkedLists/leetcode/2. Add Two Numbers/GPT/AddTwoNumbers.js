// # 0. 実行環境

// * **Language/Runtime:** JavaScript (Node.js v18+)
// * **Module:** **CommonJS**
// * **外部ライブラリ:** なし（Node 標準のみ）
// * **CI 前提:** `node solution.js` 単体で実行可能（入出力コードは含めません／テストコード不要）

// ---

// # 1. 問題

// 二つの非空単方向連結リスト `l1`, `l2` は逆順に格納された非負整数を表す。各ノードは 1 桁（0–9）を保持する。二数の和を同じ形式の連結リストで返せ。

// * 例1: `l1=[2,4,3], l2=[5,6,4] -> [7,0,8]` （342 + 465 = 807）
// * 例2: `l1=[0], l2=[0] -> [0]`
// * 例3: `l1=[9,9,9,9,9,9,9], l2=[9,9,9,9] -> [8,9,9,9,0,0,0,1]`
// * 制約:

//   * 各リストのノード数は `[1, 100]`
//   * `0 <= Node.val <= 9`
//   * 先頭に不要な 0 は無い（数 0 自体を除く）

// ---

// # 2. 解析

// ## 2.1 競技プログラミング視点

// * **速度最優先アプローチ:** 同時走査し、桁ごとに `carry` を伝搬。1 パス `O(n)`、追加配列不要。ダミーヘッドで末尾追加を `O(1)` に。
// * **メモリ最小化:** 破壊的更新を避けつつも新規ノードは必要最小限（合計桁数 + 1 まで）。ストリーム的に前から生成。

// ## 2.2 業務開発視点

// * **保守性・可読性:** `validateList` を分離し、JSDoc と型ガードで意図を明確化。早期例外でバグを顕在化。
// * **エラーハンドリング:**

//   * 引数が `ListNode` 系でない → `TypeError`
//   * 値が整数[0,9]外／ノード数>100 → `RangeError`
//   * （LeetCode では厳格チェックは不要だが、本回答要件に従い実装）

// ## 2.3 JavaScript特有の考慮

// * **V8最適化:** ループは `while`/`for`、プロパティ形状は固定（`val`,`next`のみ）。`ListNode` コンストラクタは一定形状を維持。
// * **GC対策:** 一時オブジェクト生成を抑え、ダミーヘッド + テールポインタのみ。クロージャ不使用。
// * **配列操作特性:** 配列は不使用（連結リスト直接操作）。`push/pop` 等のコストは関与しない。

// ---

// # 3. アルゴリズム比較

// | アプローチ                      | 時間計算量           |         空間計算量 | JS実装コスト | 可読性 | 備考                         |
// | -------------------------- | --------------- | ------------: | ------: | --- | -------------------------- |
// | **方法A**（同時走査 + 桁和 + 繰り上がり） | **O(n)**        |   **O(1)** 追加 |       低 | 中〜高 | ダミーヘッドで実装容易・最速             |
// | 方法B（配列へ展開→数値化→加算→再展開）      | O(n) ただし多オブジェクト |          O(n) |       中 | 低   | 桁数多で BigInt/桁溢れ考慮が必要、無駄が多い |
// | 方法C（再帰でペア加算）               | O(n)            | O(n)（コールスタック） |       低 | 中   | 深い再帰でスタック増、不要              |

// **採用:** 方法A（最短・省メモリ・V8に優しい）

// ---

// # 4. 採用方針

// * **選択:** 方法A（同時走査 + carry）
// * **理由:** 単一パス `O(n)` / 追加メモリ `O(1)`、実装簡潔、定番でバグ少。
// * **保守性:** 検証を関数分離、JSDocと例外で契約を明確化。
// * **JS最適化の具体点:**

//   * `while (p || q || carry)` の単純ループ
//   * `new ListNode(sum % 10)` の一定形状オブジェクト
//   * 余計な配列・クロージャ生成を避ける

// ---

// # 5. コード実装（solution.js）

// ```js
'use strict';

/**
 * 単方向連結リストノード（LeetCode 互換）
 * @constructor
 * @param {number} val
 * @param {ListNode|null} [next=null]
 */
function ListNode(val, next = null) {
    this.val = val;
    this.next = next;
}

/**
 * 入力リストの軽量検証（型・値域・長さ）
 * 仕様に従い TypeError / RangeError を投げる
 * @param {ListNode} head
 * @param {string} name
 * @throws {TypeError|RangeError}
 */
function validateList(head, name) {
    // 型
    if (head == null || typeof head !== 'object') {
        throw new TypeError(`${name} must be a ListNode`);
    }
    // 走査してノード数と値域
    let cnt = 0;
    let node = head;
    while (node) {
        cnt++;
        if (cnt > 100) {
            throw new RangeError(`${name} length exceeds 100`);
        }
        const v = node.val;
        if (!Number.isInteger(v)) {
            throw new TypeError(`${name} contains non-integer value`);
        }
        if (v < 0 || v > 9) {
            throw new RangeError(`${name} contains digit out of [0,9]`);
        }
        // 次ポインタ型の緩やかな検証
        if (node.next !== null && typeof node.next !== 'object') {
            throw new TypeError(`${name}.next must be ListNode or null`);
        }
        node = node.next;
    }
    if (cnt === 0) {
        throw new RangeError(`${name} must be non-empty`);
    }
}

/**
 * Add Two Numbers（非破壊的：入力リストは変更しない）
 *
 * @function addTwoNumbers
 * @param {ListNode} l1 - 逆順の数を表す連結リスト1
 * @param {ListNode} l2 - 逆順の数を表す連結リスト2
 * @returns {ListNode} 和を表す新しい連結リスト（逆順）
 * @throws {TypeError} 引数型が不正
 * @throws {RangeError} 値域/長さが制約超過
 * @complexity 時間計算量 O(n)、空間計算量 O(1)（出力ノードを除く）
 */
function addTwoNumbers(l1, l2) {
    // ---- 入力検証（ホットパス外：最初に一度だけ）----
    validateList(l1, 'l1');
    validateList(l2, 'l2');

    // ---- 本処理（単一パス）----
    let p = l1;
    let q = l2;
    let carry = 0;

    const dummy = new ListNode(0);
    let tail = dummy;

    while (p || q || carry !== 0) {
        const x = p ? p.val : 0;
        const y = q ? q.val : 0;

        // 桁和 + 繰り上がり
        const sum = x + y + carry;
        carry = (sum / 10) | 0; // 10 での整数除算（ビット演算で高速化）
        const digit = sum % 10;

        // 新規ノードを一つだけ生成し末尾に繋ぐ
        tail.next = new ListNode(digit);
        tail = tail.next;

        // 次へ
        if (p) p = p.next;
        if (q) q = q.next;
    }

    return dummy.next;
}

module.exports = { ListNode, addTwoNumbers };
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * ループは `while` の単純形。`forEach` / `map` は不使用（不要なコールバック割当を回避）。
// * 一時配列・中間オブジェクトは最小限（ノード生成のみ）。
// * `ListNode` は固定プロパティ順（`val` → `next`）で hidden class を安定化。
// * 例外は開始時の検証で早期に投げ、ホットパスから排除。
// * 64bit 超桁の数値演算は配列化や BigInt 不要（桁ごと加算のため）。
// * 入力は**非破壊**（Pure Function）。出力は新規リストのみ。

// ---

// **補足:**

// * LeetCode 環境では `ListNode` 定義が既に存在することがありますが、上記は**単体ファイル**としても読めるよう同名クラスを含めています。LeetCode へ貼り付ける際は `module.exports` 行を削除するだけでそのまま動作します（求められる関数名は `addTwoNumbers`）。
