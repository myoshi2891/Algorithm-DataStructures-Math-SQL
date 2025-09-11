// ## 1. 問題分析

// * **競技プログラミング視点**

//   * N, Q ≤ 100 と小規模。
//   * 直接「双方向リスト」を実装する必要はなく、配列で代用しても十分高速。
//   * 挿入・削除は配列の `splice` を使えば O(n) で処理可能。
//     n ≤ 200 程度なので全く問題なし。

// * **業務開発視点**

//   * 双方向リストを本当に実装する場合、Node クラスを作って `prev` / `next` を管理する。
//   * しかし可読性・保守性の観点では、今回の制約なら配列で表現する方がシンプル。

// * **JavaScript特有の考慮**

//   * V8 は数値配列に最適化されているので、型を統一するのが有利。
//   * `splice` は内部で効率化されており、今回の規模なら高速。

// ---

// ## 2. アルゴリズム比較

// | アプローチ            | 時間計算量       | 空間計算量  | JS実装コスト | 可読性 | 備考      |
// | ---------------- | ----------- | ------ | ------- | --- | ------- |
// | **A: 配列＋splice** | O(NQ) (≦2万) | O(N+Q) | 低       | 高   | 制約内なら最適 |
// | **B: 本当の双方向リスト** | O(1) 挿入/削除  | O(N+Q) | 高       | 中   | 実装コスト大  |
// | **C: 再構築ベース**    | O(NQ)       | O(N+Q) | 中       | 中   | 無駄が多い   |

// ---

// ## 3. 実装方針

// * **選択**: **配列＋splice**
// * **理由**:

//   * N, Q ≤ 100 で十分高速。
//   * 実装が簡潔でエラーバグが少ない。
//   * Node.js 配列操作の内部最適化を活用できる。

// ---

// ## 4. コード実装

// ```javascript
// /**
//  * 双方向リスト操作を配列でシミュレートする
//  * @param {number} N - 初期要素数
//  * @param {number} Q - クエリ数
//  * @param {number[]} A - 初期配列
//  * @param {Array<Array<number>>} queries - クエリ (形式: [1, P, X] または [2, P])
//  * @returns {number[]} 操作後の配列
//  * @throws {Error} 無効なクエリや範囲外アクセス時
//  * @complexity Time: O(N*Q), Space: O(N+Q)
//  */
// function processList(N, Q, A, queries) {
//     if (!Array.isArray(A) || !Array.isArray(queries)) {
//         throw new TypeError("A and queries must be arrays");
//     }

//     /** @type {number[]} */
//     const list = [...A]; // 初期化

//     for (let i = 0; i < Q; i++) {
//         const q = queries[i];
//         if (q[0] === 1) {
//             // INSERT
//             const [, P, X] = q;
//             const M = list.length;
//             if (P < 1 || P > M + 1) {
//                 throw new RangeError("Invalid P in INSERT");
//             }
//             // P は1始まり、spliceは0始まり → P-1
//             list.splice(P - 1, 0, X);
//         } else if (q[0] === 2) {
//             // ERASE
//             const [, P] = q;
//             const M = list.length;
//             if (P < 1 || P > M) {
//                 throw new RangeError("Invalid P in ERASE");
//             }
//             list.splice(P - 1, 1);
//         } else {
//             throw new Error("Invalid query type");
//         }
//     }

//     return list;
// }

// // =======================
// // 実行部分（Node.js標準入力処理）
// // =======================
// function main() {
//     const input = require("fs").readFileSync(0, "utf8").trim().split("\n");
//     const [N, Q] = input[0].split(" ").map(Number);
//     const A = input.slice(1, 1 + N).map(Number);
//     const queries = input.slice(1 + N).map(line => line.split(" ").map(Number));

//     const result = processList(N, Q, A, queries);
//     console.log(result.join("\n"));
// }

// if (require.main === module) {
//     main();
// }
// ```

// ---

// ### ✅ このコードの特徴

// * **配列 `splice`** でシンプルに挿入・削除を実現
// * **入力検証あり** (`RangeError`, `TypeError`)
// * **JSDocコメント付き**
// * **Pure function** (`processList`) と **I/O部分** を分離

// ---

// # 🔹 実装解説

// ## 1. データ構造設計

// ```text
// Node {
//   value: number
//   prev: Node | null
//   next: Node | null
// }

// DoublyLinkedList {
//   head: Node | null
//   tail: Node | null
//   length: number
//   methods:
//     - append(value)        // 末尾に追加
//     - insertAt(pos, value) // P 番目に挿入
//     - eraseAt(pos)         // P 番目を削除
//     - toArray()            // 配列に変換
// }
// ```

// * **append**: 末尾に O(1) で追加可能
// * **insertAt**: 先頭から P 番目を辿って O(n)
// * **eraseAt**: 同上、O(n)
// * **toArray**: head から順に走査 O(n)

// ---

// ## 2. コード実装（Node.js v16.17.1）

// ```javascript
/**
 * 双方向リストのノード
 */
class Node {
  /**
   * @param {number} value
   */
  constructor(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

/**
 * 双方向リストの実装
 */
class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * 末尾にノードを追加
   * @param {number} value
   */
  append(value) {
    const node = new Node(value);
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    }
    this.length++;
  }

  /**
   * P番目(1-based)に要素を挿入
   * @param {number} pos - 挿入位置 (1 <= pos <= length+1)
   * @param {number} value - 挿入する値
   */
  insertAt(pos, value) {
    if (pos < 1 || pos > this.length + 1) {
      throw new RangeError("Invalid position for insert");
    }
    const node = new Node(value);

    if (pos === 1) {
      // 先頭に挿入
      if (!this.head) {
        this.head = this.tail = node;
      } else {
        node.next = this.head;
        this.head.prev = node;
        this.head = node;
      }
    } else if (pos === this.length + 1) {
      // 末尾に挿入
      this.append(value);
      return;
    } else {
      // 中間に挿入
      let cur = this.head;
      for (let i = 1; i < pos; i++) {
        cur = cur.next;
      }
      const prevNode = cur.prev;
      prevNode.next = node;
      node.prev = prevNode;
      node.next = cur;
      cur.prev = node;
    }
    this.length++;
  }

  /**
   * P番目(1-based)のノードを削除
   * @param {number} pos
   */
  eraseAt(pos) {
    if (pos < 1 || pos > this.length) {
      throw new RangeError("Invalid position for erase");
    }
    let cur = this.head;
    for (let i = 1; i < pos; i++) {
      cur = cur.next;
    }
    if (cur.prev) {
      cur.prev.next = cur.next;
    } else {
      this.head = cur.next; // 先頭削除
    }
    if (cur.next) {
      cur.next.prev = cur.prev;
    } else {
      this.tail = cur.prev; // 末尾削除
    }
    this.length--;
  }

  /**
   * リストを配列に変換
   * @returns {number[]}
   */
  toArray() {
    const res = [];
    let cur = this.head;
    while (cur) {
      res.push(cur.value);
      cur = cur.next;
    }
    return res;
  }
}

/**
 * 双方向リスト操作をシミュレート
 * @param {number} N
 * @param {number} Q
 * @param {number[]} A
 * @param {Array<Array<number>>} queries
 * @returns {number[]}
 */
function processListWithDLL(N, Q, A, queries) {
  const dll = new DoublyLinkedList();
  for (const val of A) {
    dll.append(val);
  }

  for (const q of queries) {
    if (q[0] === 1) {
      const [, P, X] = q;
      dll.insertAt(P, X);
    } else if (q[0] === 2) {
      const [, P] = q;
      dll.eraseAt(P);
    } else {
      throw new Error("Invalid query type");
    }
  }

  return dll.toArray();
}

// =======================
// 実行部分
// =======================
function main() {
  const input = require("fs").readFileSync(0, "utf8").trim().split("\n");
  const [N, Q] = input[0].split(" ").map(Number);
  const A = input.slice(1, 1 + N).map(Number);
  const queries = input.slice(1 + N).map((line) => line.split(" ").map(Number));

  const result = processListWithDLL(N, Q, A, queries);
  console.log(result.join("\n"));
}

if (require.main === module) {
  main();
}
// ```

// ---

// # 🔹 この実装の特徴

// * **配列を使わず、Node構造体で管理**
// * **`insertAt` / `eraseAt` を本当に O(n) 探索 → O(1) 更新で実装**
// * **保守性**: `DoublyLinkedList` クラスに責務を分離
// * **可読性**: 「双方向リストらしい処理」を忠実に再現
