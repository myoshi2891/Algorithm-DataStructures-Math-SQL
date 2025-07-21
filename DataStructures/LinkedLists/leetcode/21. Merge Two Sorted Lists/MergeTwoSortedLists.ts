// 以下は **TypeScript 5.1 (Node.js 18.16.1)** での実装です。
// **クラスは使わず関数ベース**で実装し、型を明示しています。

// ---

// ## ListNode の型定義

// LeetCode の TypeScript では通常以下が定義済み：

class ListNode {
    val: number
    next: ListNode | null
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val===undefined ? 0 : val)
        this.next = (next===undefined ? null : next)
    }
}

/**
 * 2つのソート済み連結リストをマージする関数
 * 
 * @param list1 - ソート済みの単方向連結リストの先頭ノード（null可）
 * @param list2 - ソート済みの単方向連結リストの先頭ノード（null可）
 * @returns マージされたソート済み単方向連結リストの先頭ノード（null可）
 */
function mergeTwoLists(
    list1: ListNode | null, 
    list2: ListNode | null
): ListNode | null {
    const dummy: ListNode = new ListNode(0);
    let current: ListNode = dummy;

    while (list1 !== null && list2 !== null) {
        if (list1.val <= list2.val) {
            current.next = list1;
            list1 = list1.next;
        } else {
            current.next = list2;
            list2 = list2.next;
        }
        current = current.next;
    }

    current.next = list1 !== null ? list1 : list2;

    return dummy.next;
}
// ```

// ---

// ## 型情報

// | 項目               | 型          |        |
// | ---------------- | ---------- | ------ |
// | `list1`, `list2` | \`ListNode | null\` |
// | 戻り値              | \`ListNode | null\` |

// ---

// ## 計算量とメモリ消費

// | 項目             | 内容                             |
// | -------------- | ------------------------------ |
// | 時間計算量 (Time)   | O(N + M) （N, Mはlist1とlist2の長さ） |
// | 空間計算量 (Memory) | O(1)（追加ノードは作らずポインタ操作のみ）        |

// ---

// ## 実行性能

// | 条件          | 予想値（Node.js 18.16.1, LeetCode環境） |
// | ----------- | -------------------------------- |
// | 最大ノード数（50個） | 実行時間：\~0.05ms                    |
// | メモリ使用量      | O(1)（追加ノードは`dummy`のみ）            |

// ---

// ## テスト例

// ```ts
// // サンプルデータ作成
// const list1 = new ListNode(1, new ListNode(2, new ListNode(4)));
// const list2 = new ListNode(1, new ListNode(3, new ListNode(4)));

// const merged = mergeTwoLists(list1, list2);

// // 出力確認
// const result: number[] = [];
// let current = merged;
// while (current !== null) {
//     result.push(current.val);
//     current = current.next;
// }
// console.log(result); // [1, 1, 2, 3, 4, 4]
// ```

// ---

// ## 補足

// * **再帰は使用せずループで実装** → スタックオーバーフローを防止
// * **ポインタ操作のみで追加メモリほぼゼロ**
// * LeetCodeのTypeScript判定環境（5.1系）でそのまま動作可能

// ---

// もし他のバリエーション（再帰版・配列変換など）が必要でしたらお伝えください。
