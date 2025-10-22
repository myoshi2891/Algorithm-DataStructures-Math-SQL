// ## 1. 問題の分析

// ### 競技プログラミング視点での分析

// * **最速アプローチ:** 2 つの連結リストを同時走査し、各桁の和＋繰り上がり（`carry`）を管理して新しい結果リストを前から構築。1 パス **O(n)**、末尾追加はテールポインタで **O(1)**。
// * **メモリ最小化:** 入力リストは非破壊、出力は必要最小限の新規ノード（最大で長い方の長さ + 1）。補助配列や文字列化は行わない。

// ### 業務開発視点での分析

// * **型安全性:** `ListNode` を厳密に定義（`val: number`, `next: ListNode | null`）。入出力は `ListNode | null` の組み合わせを許容（LeetCode 互換）。
// * **可読性/保守性:** ダミーノード（番兵）＋テールポインタで実装を単純化。`while (p || q || carry)` の明快なループ。補助関数での過剰分割は行わず、ホットパスに集中。
// * **エラーハンドリング:** LeetCode 前提では実行時例外は通常不要だが、**本回答では要件に従い軽量ガード**（値域の前提を壊す入力が来た際に `RangeError` を投げるチェックをオプション的に実装可能）。デフォルトでは前提を信頼し、ホットパスを汚さない。

// ### TypeScript特有の考慮点

// * **型推論:** `number` と `null` の合流型を最小化し、`digit`/`carry` は `number` で安定。
// * **コンパイル時最適化:** プロパティ形状固定（`val`, `next`）で隠れクラス安定化に貢献。`Math.floor` によりビット演算の 32bit 化による不意の型崩れを避ける。
// * **null 安全:** 走査ポインタ `p`/`q` は `ListNode | null`。都度の三項演算子で `0` 供給し、`next` 進行は null チェック。

// ---

// ## 2. アルゴリズムアプローチ比較

// | アプローチ                          | 時間計算量    | 空間計算量          | TS実装コスト | 型安全性 | 可読性 | 備考                      |
// | ------------------------------ | -------- | -------------- | ------: | ---: | --: | ----------------------- |
// | **方法A**: 同時走査＋carry 伝搬（番兵＋テール） | **O(n)** | **O(1)**（出力除く） |       低 |    高 |   高 | 定番・最速・最少メモリ             |
// | 方法B: 配列/文字列へ展開→数値加算→再構築        | O(n)     | O(n)           |       中 |    中 |   中 | 桁オーバーフローや BigInt 混入で複雑化 |
// | 方法C: 再帰的に桁加算                   | O(n)     | O(n)（再帰深さ）     |       低 |    高 |   中 | スタック使用で不利、利点少           |

// **採用: 方法A**（速度・メモリ・実装容易性のバランスが最良）

// ---

// ## 3. 選択したアルゴリズムと理由

// * **選択したアプローチ:** 方法A（同時走査＋carry）
// * **理由:**

//   * **計算量:** 時間 **O(n)** / 追加空間 **O(1)**（出力ノードを除く）
//   * **型安全:** `ListNode` の構造を固定化し、`null` 分岐を明確化
//   * **保守性/可読性:** ダミーヘッドで特例除去（先頭ノードの分岐不要）
// * **TypeScript特有の最適化ポイント:**

//   * `ListNode` を `class` で定義し、プロパティ順を固定
//   * `const`/`let` の最小使用域、三項演算で `null` を数値 `0` に安全変換
//   * ビット演算は使用せず `Math.floor` により値域の意図を明確化

// ---

// ## 4. 実装コード（TypeScript / ESM / LeetCode 互換）

// > **メモ:** LeetCode の TypeScript 環境と互換のため、関数名/シグネチャは既定形に合わせています。**Pure function（入力リストは不変）**。
// > Node.js v18 で ESM を想定する場合、本ファイルを `add-two-numbers.ts` としてコンパイルして利用できます（外部ライブラリ不使用）。

// ```ts
// =======================================================
// Add Two Numbers - TypeScript (ESM) / LeetCode format
// Node.js v18 / External libraries: none
// Strict mode想定（tsconfigで "strict": true を推奨）
// =======================================================

export class ListNode {
    val: number;
    next: ListNode | null;

    constructor(val?: number, next?: ListNode | null) {
        this.val = val ?? 0;
        this.next = next ?? null;
    }
}

/**
 * 2つの逆順リストで表された非負整数の和を、逆順リストで返す（非破壊）
 *
 * @param l1 - 第1引数リストの先頭ノード（null不可想定だが型は互換のため null 許容）
 * @param l2 - 第2引数リストの先頭ノード（null不可想定だが型は互換のため null 許容）
 * @returns 新しく生成された結果リストの先頭ノード
 * @throws {RangeError} ノード値が 0–9 の範囲外（前提破り入力）を検出した場合
 * @complexity Time: O(n), Space: O(1)  ※出力ノードを除く
 */
export function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    // --- （任意）軽量バリデーション：LeetCodeの前提を壊す入力を明示検出 ---
    // 実運用/本番コードでは前提に自信がない場合のみ有効化を検討。
    // validateListDigits(l1);
    // validateListDigits(l2);

    let p: ListNode | null = l1;
    let q: ListNode | null = l2;
    let carry = 0;

    const dummy = new ListNode(0);
    let tail = dummy;

    // p または q が残っている、もしくは carry が残っている間ループ
    while (p !== null || q !== null || carry !== 0) {
        const x = p !== null ? p.val : 0;
        const y = q !== null ? q.val : 0;

        // 前提破り検出（任意）
        // if (x < 0 || x > 9 || y < 0 || y > 9) {
        //   throw new RangeError('Digit out of [0,9] detected.');
        // }

        const sum = x + y + carry;
        carry = Math.floor(sum / 10);
        const digit = sum % 10;

        tail.next = new ListNode(digit);
        tail = tail.next;

        if (p !== null) p = p.next;
        if (q !== null) q = q.next;
    }

    return dummy.next;
}

// --- 任意の補助（無効化しても主処理に影響なし） ---
/** 値域チェック（0–9）— 本来は不要だが堅牢性重視で用意 */
function validateListDigits(head: ListNode | null): void {
    let node = head;
    while (node !== null) {
        const v = node.val;
        // 整数判定（TS では number は浮動小数なので整数性は明示チェック）
        if (!Number.isInteger(v) || v < 0 || v > 9) {
            throw new RangeError('List contains a digit outside [0,9].');
        }
        node = node.next;
    }
}
// ```

// ---

// ## 5. 制約条件

// * **外部ライブラリ禁止**（Node.js 標準のみ）
// * **メモリ使用:** 出力リスト生成以外は定数オーバヘッドのみ
// * **TypeScript strict mode:** 推奨（`"strict": true`）。未定義動作を抑制

// ---

// ## TypeScript固有の最適化観点

// ### 型安全性の活用

// * **ListNode の構造を固定**し、`null` 合流は三項で即時数値化（`0`）することで分岐局所化。
// * **整数性チェック（任意）**を用意し、前提破りの入力を明示的に `RangeError` にマップ可能。

// ### コンパイル時最適化

// * **プロパティ形状固定**（`val` → `next` の順で初期化）によりヒドゥンクラスの安定化を支援。
// * **`Math.floor` を使用**し、ビット演算による 32bit 化副作用を避けて数値型を安定。

// ### 開発効率と保守性

// * LeetCode 互換の **最小 API**（`addTwoNumbers`）と **番兵ノード定石**で読みやすく、バグ温床の特例（先頭ノード分岐）を排除。
// * 検証ロジックは **任意（コメントアウトで切替）** とし、競プロと業務の両要求に対応。
