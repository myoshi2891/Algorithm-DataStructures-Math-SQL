// ### 1. 問題の分析

// **競技プログラミング視点（速度・メモリ最優先）**

// * 素朴再帰は分割位置ごとに入れ替え/非入れ替えの 2 分岐を持つため指数時間。
// * 有効な方策は

//   1. **メモ化**（同じ区間ペア `(i1,i2,len)` の再計算回避）
//   2. **頻度枝刈り**（区間内の文字 multiset が一致しない場合は即 false）
//   3. **完全一致の早期判定**（同じ並びなら分割不要で true）
// * 制約は `n ≤ 30`。上記の枝刈り＋メモ化なら間に合う（実測でも一般に余裕）。

// **業務開発視点（型安全・可読・保守）**

// * API は **pure function** `isScramble(s1, s2): boolean`。
// * 例外は仕様外入力時のみ（型/長さ/文字種）。LeetCode 側は常に正当入力だが、業務品質として入れてもコスト小。
// * 実装は「トップダウン再帰」を**1ファイル・小関数**で閉じる。テストしやすく、読みやすい。

// **TypeScript特有の考慮点**

// * 文字は `a-z` 限定なので、`charCodeAt(i) - 97` を `0..25` にマップし、`number[]`（固定長 26）で頻度管理し**単型配列**を維持。
// * `Map<string, boolean>` のキーは `"i1,i2,len"` の**定幅要素並び**でヒドゥンクラスを安定化。
// * `readonly` 引数で不変性を意識し副作用を回避。
// * ジェネリクスは不要（問題が文字列固定のため）。**狭すぎる型**で安全性と最適化を両立。

// ---

// ### 2. アルゴリズムアプローチ比較

// | アプローチ                 | 時間計算量     | 空間計算量     | TS実装コスト | 型安全性 | 可読性 | 備考                   |
// | --------------------- | --------- | --------- | ------- | ---- | --- | -------------------- |
// | 方法A: 再帰＋メモ化＋頻度枝刈り（採用） | **O(n⁴)** | O(n³)     | 低       | 高    | 高   | 実装短・高速。枝刈りで実行時間が大幅短縮 |
// | 方法B: ボトムアップDP（長さ×i×j） | O(n⁴)     | **O(n³)** | 中       | 高    | 中   | 三次元配列で明示DP。コード量増     |
// | 方法C: 素朴再帰             | 指数        | 低         | 低       | 中    | 低   | n=30 でもタイムアウト不可避     |

// ---

// ### 3. 実装方針

// * **選択したアプローチ**: 方法A（トップダウン再帰＋メモ化＋頻度枝刈り＋完全一致早期判定）
// * **理由**:

//   * 計算量: 同規模の DP と同等の理論計算量（O(n⁴)) だが、**早期一致/頻度枝刈り**で実測が速い。
//   * TypeScript: 文字→インデックスの安全な写像、`Map<string, boolean>` の単純設計で型安全・保守性良好。
//   * 可読性: 再帰の問題定義に直交しておりコードが短く、意図が明確。
// * **TS最適化ポイント**:

//   * `const cnt = new Array<number>(26).fill(0)` による**単型 number 配列**。
//   * ループは `for` 基本、`slice` 等の部分文字列生成は**禁止**（GC負荷回避）。
//   * `memo.get(key) !== undefined` で**ヒット/ミス**を分岐、キー形式は固定。

// ---

// ### 4. コード実装（LeetCode回答フォーマット / **ESM** / Node.js v18 / 外部ライブラリ不可）

// ```ts
/**
 * LeetCode: 87. Scramble String
 * ESM / TypeScript (strict) / Node.js v18+
 * ピュア関数・メモ化・頻度枝刈り・完全一致早期判定
 */

function isScramble(s1: string, s2: string): boolean {
  // --- 入力検証（LeetCodeでは常に正当だが、業務品質として保持） ---
  if (typeof s1 !== "string" || typeof s2 !== "string") {
    throw new TypeError("Inputs must be strings");
  }
  const n: number = s1.length;
  if (n !== s2.length) throw new RangeError("Length mismatch");
  if (n < 1 || n > 30) throw new RangeError("Length out of range (1..30)");

  // 文字種チェック（a-z）
  for (let i = 0; i < n; i++) {
    const c1 = s1.charCodeAt(i);
    const c2 = s2.charCodeAt(i);
    if (c1 < 97 || c1 > 122 || c2 < 97 || c2 > 122) {
      throw new RangeError("Only lowercase letters a-z are allowed");
    }
  }

  if (s1 === s2) return true;

  // グローバル頻度が違えば即 false
  if (!sameMultiset(s1, 0, s2, 0, n)) return false;

  // メモ: key = "i1,i2,len"
  const memo = new Map<string, boolean>();

  /**
   * s1[i1..i1+len), s2[i2..i2+len) が scramble で一致するか
   * @complexity Time: O(n^4) worst, Space: O(n^3)
   */
  function dfs(i1: number, i2: number, len: number): boolean {
    const key = `${i1},${i2},${len}`;
    const cached = memo.get(key);
    if (cached !== undefined) return cached;

    // 完全一致の早期判定
    let allEq = true;
    for (let k = 0; k < len; k++) {
      if (s1.charCodeAt(i1 + k) !== s2.charCodeAt(i2 + k)) {
        allEq = false;
        break;
      }
    }
    if (allEq) {
      memo.set(key, true);
      return true;
    }

    // 頻度枝刈り（区間 multiset 不一致なら false）
    if (!sameMultiset(s1, i1, s2, i2, len)) {
      memo.set(key, false);
      return false;
    }

    // 分割点を総当り（1..len-1）
    for (let cut = 1; cut < len; cut++) {
      // 非スワップ
      if (
        sameMultiset(s1, i1, s2, i2, cut) &&
        sameMultiset(s1, i1 + cut, s2, i2 + cut, len - cut) &&
        dfs(i1, i2, cut) &&
        dfs(i1 + cut, i2 + cut, len - cut)
      ) {
        memo.set(key, true);
        return true;
      }
      // スワップ
      if (
        sameMultiset(s1, i1, s2, i2 + (len - cut), cut) &&
        sameMultiset(s1, i1 + cut, s2, i2, len - cut) &&
        dfs(i1, i2 + (len - cut), cut) &&
        dfs(i1 + cut, i2, len - cut)
      ) {
        memo.set(key, true);
        return true;
      }
    }

    memo.set(key, false);
    return false;
  }

  return dfs(0, 0, n);

  /**
   * 2つの部分文字列（[ia, ia+len), [ib, ib+len)）の文字 multiset が一致するか
   * 文字は a..z を想定。固定長 26 のカウント配列で差分チェック。
   */
  function sameMultiset(
    a: string,
    ia: number,
    b: string,
    ib: number,
    len2: number
  ): boolean {
    const cnt: number[] = new Array<number>(26).fill(0);
    for (let k = 0; k < len2; k++) {
      cnt[a.charCodeAt(ia + k) - 97]++;
      cnt[b.charCodeAt(ib + k) - 97]--;
    }
    for (let i = 0; i < 26; i++) if (cnt[i] !== 0) return false;
    return true;
  }
}

export { isScramble }; // LeetCode では関数定義のみでOK、ESMとしても利用可
export default isScramble; // ESM環境でのローカル実行にも対応
// ```

// **実装上のポイント**

// * **Pure**: 外部状態なし、同一入力→同一出力。
// * **型安全**: 引数は `string`、内部は `number` で統一、配列は `number[]` 固定。
// * **エラーハンドリング**: 仕様外の入力に `TypeError` / `RangeError`。LeetCode では正当入力のみ想定。
// * **パフォーマンス**: `slice` 非使用（文字列生成回避）、`for` ループ、単型配列、`Map` メモ化。

// ---

// ### 5. 制約条件への適合

// * 外部ライブラリ不使用（Node 標準のみ）。
// * メモリは `Map` と 26 配列のみ（`n ≤ 30` で十分低負荷）。
// * TS **strict** 前提の型注釈で安全性を担保。
