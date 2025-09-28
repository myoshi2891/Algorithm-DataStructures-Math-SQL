// # 1. 問題の分析

// ## 競技プログラミング視点

// * ランダムな二分割＋（入れ替え or そのまま）という再帰定義に沿って、「2 つの再帰木が一致し得るか」を判定する典型問題（LeetCode #87）。
// * 素朴再帰は指数時間。**メモ化**と**頻度（文字カウント）による枝刈り**が必須。
// * 代表解は

//   * トップダウン（再帰＋メモ化）O(n⁴) 付近
//   * またはボトムアップ DP（長さ×開始位置×開始位置）O(n⁴)
// * 文字種は a–z、長さ ≤ 30 なので O(n⁴) でも十分通る。

// ## 業務開発視点

// * 可読性: 「同じ部分問題を何度も解かない」＝メモ化。key は `(i1,i2,len)` に固定。
// * 例外方針: 仕様外（型・長さ不一致・文字種違反）は早期 `TypeError` / `RangeError`。
// * 保守性: 早期同値判定（部分文字列が完全一致なら true）と、頻度チェックで枝刈りを明確化。

// ## JavaScript特有の考慮

// * V8 最適化:

//   * `for` ループの単純走査、固定長の 26 配列（number 単型）でカウント。
//   * クロージャと一時オブジェクト生成を抑制（`Map` の key は一意な文字列）。
// * GC対策:

//   * `slice` での部分文字列生成はしない（指数的に増えるため）。インデックス参照のみ。
//   * 26 長配列は都度作るが、長さ 30・深さ ≤30 で十分軽い。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ                 | 時間計算量 | 空間計算量          | JS実装コスト | 可読性 | 備考                     |
// | --------------------- | ----- | -------------- | ------- | --- | ---------------------- |
// | 方法A: 再帰＋メモ化＋頻度枝刈り（採用） | O(n⁴) | O(n³)（メモ・再帰深さ） | 低       | 高   | 実装短く速い。等価・頻度チェックで強く枝刈り |
// | 方法B: ボトムアップDP（長さ×i×j） | O(n⁴) | O(n³)          | 中       | 中   | 配列3Dで明示DP、コード量は増える     |
// | 方法C: 素朴再帰             | 指数    | 再帰深のみ          | 低       | 低   | 30 文字でも間に合わない          |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択**: 方法A（再帰＋メモ化＋頻度枝刈り）
// * **理由**: コード量が少なく、枝刈りが強力で最速クラス。n≤30 の制約に最適。
// * **JS最適化ポイント**:

//   * `for` インデックス走査、`charCodeAt( ) - 97` で 0..25 へ直写。
//   * 3 要素（i1,i2,len）からの文字列キーで `Map` を安定利用。
//   * サブストリング生成回避（`slice` 不使用）、等価判定はインデックスで直接比較。

// ---

// # 4. コード実装（solution.js / **CommonJS**, Node.js v18, 外部ライブラリなし）

// ```js
"use strict";

/**
 * LeetCode形式: 関数名は isScramble をエクスポート（ローカル実行も可）
 * Runtime: Node.js v18+, Module: CommonJS
 */

/**
 * s2 が s1 の scramble 文字列か判定する（Pure Function）
 * - 再帰 + メモ化 + 頻度枝刈り
 *
 * @param {string} s1 - 元文字列（a-z, 1..30）
 * @param {string} s2 - 対象文字列（a-z, 1..30）
 * @returns {boolean} 判定結果
 * @throws {TypeError} 型が文字列でない場合
 * @throws {RangeError} 長さ不一致/範囲外、文字種不正
 * @complexity 最悪 O(n^4) 時間, O(n^3) 空間（n = s1.length）
 */
function isScramble(s1, s2) {
  // --- 入力検証 ---
  if (typeof s1 !== "string" || typeof s2 !== "string") {
    throw new TypeError("Inputs must be strings");
  }
  const n = s1.length;
  if (n !== s2.length) throw new RangeError("Length mismatch");
  if (n < 1 || n > 30) throw new RangeError("Length out of range (1..30)");
  // 文字種チェック（a-z のみ）
  for (let i = 0; i < n; i++) {
    const c1 = s1.charCodeAt(i);
    const c2 = s2.charCodeAt(i);
    if (c1 < 97 || c1 > 122 || c2 < 97 || c2 > 122) {
      throw new RangeError("Only lowercase a-z are allowed");
    }
  }

  if (s1 === s2) return true;

  // 全体頻度チェック（不一致なら即 false）
  if (!sameMultiset(s1, 0, s2, 0, n)) return false;

  // メモ化: key = "i1,i2,len"
  const memo = new Map();

  /**
   * s1[i1..i1+len), s2[i2..i2+len) が scramble 一致するか
   * @param {number} i1
   * @param {number} i2
   * @param {number} len
   * @returns {boolean}
   */
  function dfs(i1, i2, len) {
    const key = i1 + "," + i2 + "," + len;
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

    // 頻度枝刈り（このペア全体でマルチセット一致しなければ false）
    if (!sameMultiset(s1, i1, s2, i2, len)) {
      memo.set(key, false);
      return false;
    }

    // すべての分割点を試す
    for (let cut = 1; cut < len; cut++) {
      // ケース1: 非スワップ
      // s1[i1..i1+cut) <-> s2[i2..i2+cut)
      // s1[i1+cut..i1+len) <-> s2[i2+cut..i2+len)
      if (
        sameMultiset(s1, i1, s2, i2, cut) &&
        sameMultiset(s1, i1 + cut, s2, i2 + cut, len - cut) &&
        dfs(i1, i2, cut) &&
        dfs(i1 + cut, i2 + cut, len - cut)
      ) {
        memo.set(key, true);
        return true;
      }

      // ケース2: スワップ
      // s1 前半 <-> s2 後半, s1 後半 <-> s2 前半
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
   * 2つの部分文字列のマルチセット（文字頻度）が一致するか
   * @param {string} a
   * @param {number} ia
   * @param {string} b
   * @param {number} ib
   * @param {number} len
   * @returns {boolean}
   */
  function sameMultiset(a, ia, b, ib, len) {
    // 26個のカウント配列（number単型）
    const cnt = new Array(26).fill(0);
    for (let k = 0; k < len; k++) {
      cnt[a.charCodeAt(ia + k) - 97]++;
      cnt[b.charCodeAt(ib + k) - 97]--;
    }
    for (let i = 0; i < 26; i++) if (cnt[i] !== 0) return false;
    return true;
  }
}

module.exports = { isScramble };
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * `for` 基本、`map/forEach` は使わない（割り当て削減）。
// * 文字列 `slice` は使わず、**インデックス参照**で部分比較。
// * `sameMultiset` は 26 要素配列でカウント差分を 1 パスで判定。
// * `Map` のキーは固定形式の文字列で hidden class を安定化。
// * 例外はホットパス外（先頭の入力検証）で早期実行。
