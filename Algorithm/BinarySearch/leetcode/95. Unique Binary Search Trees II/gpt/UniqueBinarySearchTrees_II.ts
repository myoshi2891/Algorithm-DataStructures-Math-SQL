// ## 1. 問題の分析

// ### 競技プログラミング視点での分析

// * **最速アプローチ**：区間 `[l, r]` に対し、根候補 `i` を全列挙→左は `[l, i-1]`、右は `[i+1, r]` の**全組合せ**。
//   同一区間を繰り返し計算しないよう **メモ化**（`Map`）を用いる分割統治が定番。
// * **計算量の下限**：作られる木の本数は **カタラン数 `C_n`**。よって計算量は少なくとも出力サイズに比例。
// * **メモリ方針**：出力（全木）そのものが支配的。アルゴリズム側の追加メモリは「区間→配列」のメモのみで極小化。

// ### 業務開発視点での分析

// * **型安全/保守性**：`TreeNode` の型を厳密化（`left/right` は `TreeNode | null`）。
//   内部関数 `build(l, r)` は閉包内スコープに限定し、外部 API は `generateTrees(n)` のみ。
// * **例外/エラー**：入力範囲外（`n < 0 || n > 8`）や整数以外は **早期検証**で `TypeError/RangeError` を送出。
// * **可読性**：命名（`build`・`memo`・`key`）を一貫、ネストは浅く、`for` ループベースで明快に。

// ### TypeScript特有の考慮点

// * **型推論**：`TreeNode | null` の配列を返すことでコンパイラが適切に推論。
// * **readonly の活用**：API 受け口はイミュータブル（ここでは `number` パラメータのみなので副作用なし）。
// * **コンパイル時最適化**：クラスのプロパティ順を固定し、実行時の hidden class を安定化（V8 的にも有利）。

// ---

// ## 2. アルゴリズムアプローチ比較

// | アプローチ                 | 時間計算量            | 空間計算量              | TS実装コスト | 型安全性 | 可読性 | 備考           |
// | --------------------- | ---------------- | ------------------ | ------: | ---: | --: | ------------ |
// | 方法A: 分割統治 + 区間メモ化（採用） | だいたい **O(Cₙ·n)** | **O(Cₙ·n)**（出力＋メモ） |       低 |    高 |   高 | 最短実装で重複計算を排除 |
// | 方法B: 区間長 DP（ボトムアップ）   | だいたい **O(Cₙ·n)** | **O(Cₙ·n)**        |       中 |    高 |   中 | 実装が煩雑な割に利得小  |
// | 方法C: 素朴バックトラッキング      | 指数               | 指数                 |       低 |    中 |   中 | 小規模のみ可、無駄が多い |

// > 生成物が `Cₙ` 本なので、**出力線形**以上の時間・空間は不可避です。

// ---

// ## 3. 実装方針

// * **選択したアプローチ**：方法A（分割統治 + 区間メモ化）
// * **理由**：

//   * **計算量**：重複サブ問題を除去し、出力サイズに近い下限コスト。
//   * **TypeScript**：`TreeNode | null` の組合せ生成が型で明確化できる。実装も簡潔。
//   * **保守性**：副作用なし・関数分割最小・読みやすい。
// * **TypeScript特有の最適化ポイント**：

//   * コンストラクタでプロパティ順固定（`val→left→right`）。
//   * ループは `for` を用い、不要なクロージャ/ラムダ生成を抑制。
//   * `Map<string, TreeNode[]>` でキーを `"l,r"` に統一し、型を安定させる。

// ---

// ## 4. コード実装（**LeetCode 形式 / ESM 準拠 / Pure**）

// ```ts
/* eslint-disable @typescript-eslint/no-unused-vars */
// ESM想定（Node v18+）。LeetCode では export 不要のため本体のみ記述。

/**
 * Definition for a binary tree node (LeetCode 既定仕様).
 */
class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        // Hidden Class 安定化のためプロパティ順を固定
        this.val = val === undefined ? 0 : val;
        this.left = left === undefined ? null : left;
        this.right = right === undefined ? null : right;
    }
}

/**
 * Unique Binary Search Trees II
 * 1..n の値で構造的に一意な BST をすべて生成して返す。
 *
 * @param n - 範囲の上限（1 <= n <= 8）
 * @returns 生成された BST の根ノード配列
 * @throws {TypeError} n が number でない or 整数でない
 * @throws {RangeError} n が 0 未満 or 8 超過
 * @complexity Time: ~O(C_n * n), Space: ~O(C_n * n)（出力＋メモ）
 */
function generateTrees(n: number): Array<TreeNode | null> {
    // --- 入力検証（早期・軽量 / LeetCode入力は有効だが堅牢性のため保持）---
    if (typeof n !== 'number' || Number.isNaN(n)) {
        throw new TypeError('n must be a number');
    }
    if (!Number.isInteger(n)) {
        throw new TypeError('n must be an integer');
    }
    if (n < 0 || n > 8) {
        throw new RangeError('n must satisfy 0 <= n <= 8');
    }
    if (n === 0) return []; // 防御的。仕様上は 1..8

    // --- 区間メモ化: key = "l,r" ---
    const memo = new Map<string, Array<TreeNode | null>>();

    /**
     * 区間 [l, r] の全 BST 根ノード配列を返す。
     * 空区間は [null]（1通りの空木）で表現。
     */
    function build(l: number, r: number): Array<TreeNode | null> {
        if (l > r) return [null];

        const key = `${l},${r}`;
        const hit = memo.get(key);
        if (hit !== undefined) return hit;

        const out: Array<TreeNode | null> = [];
        for (let rootVal = l; rootVal <= r; rootVal++) {
            const left = build(l, rootVal - 1);
            const right = build(rootVal + 1, r);

            // 全組合せで新規ノードを生成（参照共有しない）
            for (let i = 0; i < left.length; i++) {
                const L = left[i];
                for (let j = 0; j < right.length; j++) {
                    const R = right[j];
                    out.push(new TreeNode(rootVal, L, R));
                }
            }
        }
        memo.set(key, out);
        return out;
    }

    return build(1, n);
}

/* --------------- ここまでが LeetCode 提出関数本体 --------------- */

/* ローカル実行 (ESM) 用の最小コード例（提出時は不要・コメントアウト推奨）
import { argv } from 'node:process';
if (import.meta.url === `file://${process.argv[1]}`) {
  const n = Number(argv[2] ?? '3');
  console.log(generateTrees(n).length);
}
*/
// ```

// ---

// ## TypeScript固有の最適化観点（補足）

// * **型安全性**：`TreeNode | null` を返す配列型を明示し、空部分木を **`null` で一意表現**。
// * **readonly/immutability**：引数は `number` のみで外部状態に依存せず **Pure**。
// * **ジェネリクス**：本問題は数値専用であり、過度なジェネリクスは可読性低下につながるため **未使用が最適**。
// * **実行時性能**：`for` ループ・固定プロパティ順・最小限の一時オブジェクトで **V8 に優しい**実装。

// ---

// ### まとめ

// * 出力本数がカタラン数のため、**分割統治＋メモ化**が最短で堅牢。
// * TypeScript では `TreeNode | null` の型で**安全性/可読性**を両立。
// * 実装は **Pure / 早期入力検証 / ESM準拠**、Node v18 でそのまま動作可能（ローカル実行補助はコメントで同梱）。
