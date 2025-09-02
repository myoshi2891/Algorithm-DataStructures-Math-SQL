// この問題（**Rotate List**）を、提示いただいたテンプレートに沿って **JavaScript (Node.js v18+)** で整理・実装します。

// ---

// ## 1. 問題の分析

// ### 競技プログラミング視点

// * 入力サイズは最大500ノード → 計算量はそこまで厳しくない。
// * ただし `k` が最大 2\*10^9 まで大きいため、`k % n` の計算が必須。
// * 最小の計算量 O(n)、追加メモリ O(1) で解ける。

// ### 業務開発視点

// * 入力が `null` の場合のハンドリングが必要。
// * ノード数が 0 または 1 の場合は即 return。
// * コードの可読性を保ちつつ、リンクリストの特性を利用。

// ### JavaScript特有の考慮点

// * V8エンジンは **forループ最適化済み**、再帰よりループ推奨。
// * 500要素程度では GC の影響は無視できるが、不要オブジェクト生成は避ける。
// * Node.jsでは `class ListNode` を明示的に定義し、テスト容易性を確保。

// ---

// ## 2. アルゴリズムアプローチ比較

// | アプローチ                | 時間計算量   | 空間計算量 | JS実装コスト | 可読性 | 備考              |
// | -------------------- | ------- | ----- | ------- | --- | --------------- |
// | 方法A: リスト長を求めて環状にし、切断 | O(n)    | O(1)  | 低       | 高   | 最適解             |
// | 方法B: 配列に展開して回転後に再構築  | O(n)    | O(n)  | 中       | 中   | コードは簡単だが無駄な配列生成 |
// | 方法C: k 回シフト          | O(n\*k) | O(1)  | 低       | 高   | k が大きいと非効率      |

// **選択: 方法A**
// 理由: O(n)・O(1) で最適。リストを「環状化→切断」するのが最も効率的。

// ---

// ## 3. 実装方針

// 1. head が null または head.next が null → そのまま return。
// 2. リストの長さを計算し、tail を取得。
// 3. tail.next = head で環状リストに変換。
// 4. `steps = n - (k % n)` を計算し、steps-1 回移動したノードを newTail に。
// 5. newHead = newTail.next, newTail.next = null にして return。

// ---

// ## 4. 実装コード

// ```javascript
/**
 * Definition for singly-linked list.
 */
class ListNode {
    /**
     * @param {number} val
     * @param {ListNode|null} next
     */
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

/**
 * Rotate Linked List to the right by k places
 * @param {ListNode|null} head - Head of the linked list
 * @param {number} k - Number of rotations
 * @returns {ListNode|null} Rotated linked list head
 * @throws {TypeError} If input is invalid
 * @complexity Time: O(n), Space: O(1)
 */
function rotateRight(head, k) {
    // 入力検証
    if (head !== null && !(head instanceof ListNode)) {
        throw new TypeError("head must be a ListNode or null");
    }
    if (typeof k !== "number" || k < 0) {
        throw new TypeError("k must be a non-negative number");
    }

    if (!head || !head.next || k === 0) return head;

    // リストの長さを求める
    let length = 1;
    let tail = head;
    while (tail.next) {
        tail = tail.next;
        length++;
    }

    // kを最適化
    k %= length;
    if (k === 0) return head;

    // リストを環状にする
    tail.next = head;

    // 新しいtailを探す
    let steps = length - k;
    let newTail = head;
    for (let i = 1; i < steps; i++) {
        newTail = newTail.next;
    }

    const newHead = newTail.next;
    newTail.next = null;

    return newHead;
}
// ```

// ---

// ## 5. 性能計測コード

// ```javascript
const { performance } = require("perf_hooks");

function measureTime(fn, ...args) {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    console.log(`実行時間: ${(end - start).toFixed(3)}ms`);
    return result;
}

function measureMemory(fn, ...args) {
    const memBefore = process.memoryUsage();
    const result = fn(...args);
    const memAfter = process.memoryUsage();
    const heapDiff = (memAfter.heapUsed - memBefore.heapUsed) / 1024 / 1024;
    console.log(`ヒープ使用量差分: ${heapDiff.toFixed(3)}MB`);
    return result;
}
// ```

// ---

// ## 6. テストケース

// ```javascript
const assert = require("assert");

// ヘルパー: 配列からリストを作成
function buildList(arr) {
    if (!arr.length) return null;
    let head = new ListNode(arr[0]);
    let current = head;
    for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
    }
    return head;
}

// ヘルパー: リストを配列に変換
function listToArray(head) {
    const res = [];
    while (head) {
        res.push(head.val);
        head = head.next;
    }
    return res;
}

(function runTests() {
    console.log("=== 基本テスト ===");
    assert.deepStrictEqual(listToArray(rotateRight(buildList([1,2,3,4,5]), 2)), [4,5,1,2,3]);
    assert.deepStrictEqual(listToArray(rotateRight(buildList([0,1,2]), 4)), [2,0,1]);
    console.log("✅ 基本テスト通過");

    console.log("=== 境界値テスト ===");
    assert.deepStrictEqual(listToArray(rotateRight(buildList([]), 5)), []);
    assert.deepStrictEqual(listToArray(rotateRight(buildList([1]), 99)), [1]);
    console.log("✅ 境界値テスト通過");

    console.log("=== エラーケーステスト ===");
    assert.throws(() => rotateRight("invalid", 2), TypeError);
    assert.throws(() => rotateRight(buildList([1,2,3]), -1), TypeError);
    console.log("✅ エラーケース通過");

    console.log("=== 大規模データテスト ===");
    const big = Array.from({length: 500}, (_, i) => i);
    const rotated = listToArray(rotateRight(buildList(big), 123456));
    assert.strictEqual(rotated.length, 500);
    console.log("✅ 大規模データテスト通過");

    console.log("\n🎉 全テスト成功");
})();
// ```

// ---

// ## 7. まとめ

// * **時間計算量**: O(n)
// * **空間計算量**: O(1)
// * **V8最適化考慮**: forループ利用、オブジェクト生成最小化、環状リスト操作
// * **保守性**: ListNode 定義 + ヘルパー関数でテスト容易性を確保

// ---

// 👉 ご質問ですが、こちらの解法は **リンクリストを維持したまま回転** しています。
// もし「配列として回転結果を返す」仕様にした方が使いやすいでしょうか？
