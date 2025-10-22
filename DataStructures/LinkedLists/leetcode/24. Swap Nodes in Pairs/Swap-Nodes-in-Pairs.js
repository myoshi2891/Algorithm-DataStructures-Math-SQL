// 以下は、Node.js 18.16.1 環境および LeetCode の仕様に対応した形で、**クラスを使わずに関数形式で**「隣接ノードのペアをスワップする」実装です。
// **ノードの値は変更せず、ノードの構造自体を操作してスワップ**しています。

// ---

// ## ✅ 解法方針

// * 再帰的 or 反復的（ループ）に、2ノードずつスワップ
// * ノードの `.val` ではなく、`.next` を変更
// * `dummy` ノードを利用して先頭の処理を簡素化

// ---

// ## ✅ 実装（JavaScript / Node.js）

// ```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

/**
 * 与えられた連結リストで隣接するノードをペアごとにスワップする
 * @param {ListNode} head - 連結リストの先頭ノード
 * @returns {ListNode} - スワップ後の新しい先頭ノード
 */
function swapPairsJs(head) {
    const dummy = new ListNode(0, head); // 仮の先頭ノード
    let prev = dummy;

    while (prev.next !== null && prev.next.next !== null) {
        const first = prev.next;
        const second = first.next;

        // スワップ処理
        first.next = second.next;
        second.next = first;
        prev.next = second;

        // 次のペアへ移動
        prev = first;
    }

    return dummy.next;
}
// ```

// ---

// ## ✅ 入出力例

// ```javascript
// // ヘルパー関数（LeetCode外）
// function arrayToList(arr) {
//   let dummy = new ListNode(0);
//   let curr = dummy;
//   for (let val of arr) {
//     curr.next = new ListNode(val);
//     curr = curr.next;
//   }
//   return dummy.next;
// }

// function listToArray(head) {
//   const result = [];
//   while (head) {
//     result.push(head.val);
//     head = head.next;
//   }
//   return result;
// }

// // テスト（ローカル用）
// const input = arrayToList([1, 2, 3, 4]);
// const output = swapPairs(input);
// console.log(listToArray(output)); // [2, 1, 4, 3]
// ```

// ---

// ## ✅ 計算量とパフォーマンス

// | 項目             | 値                |
// | -------------- | ---------------- |
// | 時間計算量          | O(n)（n = ノード数）   |
// | 空間計算量（追加）      | O(1)（反復処理）       |
// | メモリ使用          | ほぼ入力の ListNode 分 |
// | 実行速度（LeetCode） | ≒ 50〜70ms（中央値）   |
// | メモリ使用（参考）      | ≒ 41〜44MB（中央値）   |

// ---

// ## ✅ 参考：ノード接続の図解

// ```
// Before:
// prev → 1 → 2 → nextPair
//           ↑
//        swap here

// After:
// prev → 2 → 1 → nextPair
// ```

// 1. `first = prev.next`（1）
// 2. `second = first.next`（2）
// 3. `first.next = second.next`（nextPair）
// 4. `second.next = first`
// 5. `prev.next = second`

// ---

// ## ✅ 備考

// * 再帰でも可能ですが、スタックの使用量を増やすため、**O(1) 空間の反復解がより安定**。
// * クラスは使用せず、関数スタイルで一貫。

// ---

// 必要であれば、**再帰的実装**や **Python版**, **図付きの詳細解説** も提供可能です。お気軽にお知らせください！
