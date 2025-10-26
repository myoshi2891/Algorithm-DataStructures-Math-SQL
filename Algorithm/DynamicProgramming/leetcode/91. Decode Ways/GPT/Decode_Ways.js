// # 0. 実行環境

// * **Language/Runtime:** JavaScript (Node.js v18+)
// * **Module:** **CommonJS**
// * **外部ライブラリ:** 不可（Node 標準のみ）
// * **CI前提:** `node -e "require('./solution.js').numDecodings('226')"` で実行可能

// ---

// # 1. 問題の分析

// ## 競技プログラミング視点

// * 典型的な「**Decode Ways**」問題。各位置で

//   * 単独1桁（`1..9`）が有効なら前状態を加算
//   * 直前と組の2桁（`10..26`）が有効なら前々状態を加算
// * **DP一列ロール**で `O(n)` 時間・`O(1)` 追加メモリが最速安定。

// ## 業務開発視点

// * **保守性**: 遷移条件を関数化せず、文字→数値を定数時間で計算しつつコメントで明示。
// * **入力検証**: 文字列型・桁数・全て数字かの3点を早期に検証。
// * **例外方針**: 型不正は `TypeError`、長さ違反は `RangeError`。文字列自体は正しいが「デコード不能（例: '06', '230'）」は**例外ではなく**仕様通り **0 を返す**。

// ## JavaScript特有の考慮

// * **V8最適化**:

//   * `for` ループ＋数値スカラー（単型）で Hidden Class を安定化。
//   * `charCodeAt(0) - 48` で digit を取得（`Number()`/`parseInt`回避）。
// * **GC対策**: `substring`/`slice` の生成を避け、2桁値は `d10*10 + d1` で算出。
// * **配列操作**: DP 配列を使わずスカラー2変数（`prev2`, `prev1`）のみを用いる。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ                     | 時間計算量    |    空間計算量 | JS実装コスト | 可読性 | 備考                   |
// | ------------------------- | -------- | -------: | ------: | --- | -------------------- |
// | **方法A**: 一列ロールDP（スカラー2変数） | **O(n)** | **O(1)** |       低 | 中   | 本採用。最速・低メモリ          |
// | 方法B: 配列DP（長さ n+1）         | O(n)     |     O(n) |       中 | 高   | 遷移の可視性は高いが余分な配列      |
// | 方法C: 再帰+メモ化               | O(n)     |     O(n) |       中 | 中   | コールスタックと関数割当のオーバーヘッド |

// *JS実装コストは割当・GCリスクを含む評価。*

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択**: 方法A（O(n) 時間 / O(1) 追加メモリ）
// * **理由**: 速度とメモリのバランスが最良。文字列長 ≤ 100 に対しても十分余裕。
// * **JS最適化ポイント**:

//   * `for (let i = 0; i < n; i++)` のインデックス走査
//   * `charCodeAt` による桁取得、`substring` 非使用
//   * スカラーの `prev2`, `prev1` でロール（配列未使用）

// ---

// # 4. コード実装（solution.js）

// ```js
'use strict';

/**
 * Decode Ways: s を 1..26 マッピングでデコードできる通り数を返す（Pure）
 *
 * 変換規則:
 *  - '1'..'9' は 1 桁として有効
 *  - '10'..'26' は 2 桁として有効（'06' など先頭 0 は不可）
 *
 * 遷移:
 *  dp[i] = (s[i] が 1..9) ? dp[i-1] を加算
 *        + (s[i-1..i] が 10..26) ? dp[i-2] を加算
 * ローリング:
 *  prev2 = dp[i-2], prev1 = dp[i-1], cur = dp[i]
 *
 * @param {string} s - 数字のみから成る文字列（長さ 1..100）
 * @returns {number} 通り数（32bit 範囲内）
 * @throws {TypeError} s が文字列でない / 非数字を含む場合
 * @throws {RangeError} 長さが制約外の場合
 *
 * @complexity Time O(n), Space O(1)
 */
function numDecodings(s) {
    // ---- 入力検証（早期）----
    if (typeof s !== 'string') {
        throw new TypeError('Input must be a string');
    }
    const n = s.length;
    if (n < 1 || n > 100) {
        throw new RangeError('Input length must be in [1, 100]');
    }
    // 全て数字か（ASCII '0'..'9'）
    // ついでに最初の文字を取得して先頭0の早期不成立も見る
    const c0 = s.charCodeAt(0);
    if (c0 < 48 || c0 > 57) throw new TypeError('Input must contain digits only');
    if (c0 === 48) return 0; // 先頭 '0' はデコード不能

    for (let i = 1; i < n; i++) {
        const ci = s.charCodeAt(i);
        if (ci < 48 || ci > 57) throw new TypeError('Input must contain digits only');
    }

    // ---- DP（O(1) ローリング）----
    // dp[0] = 1（空文字の基数 / 最初の1桁が有効なら 1）
    let prev2 = 1; // dp[i-2]
    let prev1 = 1; // dp[i-1] for i=1（先頭が '1'..'9' であることは上で保証）

    for (let i = 1; i < n; i++) {
        const d1 = s.charCodeAt(i) - 48; // 現在桁
        const d0 = s.charCodeAt(i - 1) - 48; // 直前桁
        let cur = 0;

        // 1桁有効: 1..9
        if (d1 >= 1) {
            cur += prev1;
        }
        // 2桁有効: 10..26
        const two = d0 * 10 + d1; // 'xy' → 10*x + y（先頭0は two<10 となり自然に無効）
        if (two >= 10 && two <= 26) {
            cur += prev2;
        }

        // どちらにも該当しない → デコード不能
        if (cur === 0) return 0;

        // ロール
        prev2 = prev1;
        prev1 = cur;
    }

    return prev1;
}

// LeetCode 形式（関数定義）＋ ローカル/CI 用エクスポート
module.exports = { numDecodings };
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * ループは `for` 基本。`map/forEach` は関数割当・クロージャ生成を避けるため不使用
// * `substring/slice` を使わず、`charCodeAt` で桁を直接数値化
// * DP 配列なし（`prev2`, `prev1` のスカラーのみ）で GC 負荷を削減
// * 例外はホットパス外（冒頭の入力検証）で処理
// * 戻り値は 32bit 範囲内（問題保証）

// ---

// ## 簡易動作例（参考）

// * `numDecodings("12") → 2`（"AB", "L"）
// * `numDecodings("226") → 3`（"BZ","VF","BBF"）
// * `numDecodings("06") → 0`（先頭 0）
