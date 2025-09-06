// ご提示いただいたテンプレートに従って、「Valid Number」問題の解析～実装～検証を **Node.js v18 / CommonJS / 外部ライブラリ不可** でまとめました。

// ---

// # 1. 問題の分析

// ### 競技プログラミング視点

// * **速度最優先**

//   * 入力長は最大 20 文字なので O(n) で十分。
//   * 単一パスで FSM（有限状態機械）風に検証可能。
// * **メモリ効率**

//   * 入力は短いため追加メモリ不要。状態管理のみ。

// ### 業務開発視点

// * **保守性**

//   * 「符号」「整数」「小数」「指数部」を明確に分けて判定。
//   * 正規表現を使うと読みやすいが、パフォーマンス上 FSM の方が安定。
// * **エラーハンドリング**

//   * 不正入力型に対して TypeError
//   * 長さ超過に対して RangeError

// ### JavaScript特有の考慮点

// * **V8最適化**

//   * forループで走査、クロージャを避ける。
// * **GC対策**

//   * 文字列操作で substring / split を避け、直接インデックス参照。
// * **配列操作**

//   * 状態フラグは boolean 変数で保持し、追加配列不要。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ                        | 時間計算量 | 空間計算量 | JS実装コスト | 可読性 | 備考               |
// | ---------------------------- | ----- | ----- | ------- | --- | ---------------- |
// | 方法A: FSM 単一パス                | O(n)  | O(1)  | 中       | 中   | 最適。競技用に強い        |
// | 方法B: 正規表現                    | O(n)  | O(1)  | 低       | 高   | 短いが regex が読みにくい |
// | 方法C: パース + try-catch(Number) | O(n)  | O(1)  | 低       | 高   | JSの数値仕様に依存、不正確   |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択**: 方法A (FSM 単一パス)
// * **理由**:

//   * 入力長が短いので正規表現でもよいが、FSM なら挙動が明確で安全。
//   * O(n) / O(1) の最小計算量を確保。
// * **JS最適化ポイント**:

//   * `for (let i=0; i<n; i++)` による単純ループ。
//   * boolean フラグで状態を追跡。
//   * 余計なオブジェクト生成を避ける。

// ---

// # 4. コード実装（solution.js）

// ```javascript
'use strict';

/**
 * 判定関数: 有効な数値かどうか
 * @param {string} s - 入力文字列
 * @returns {boolean} 有効なら true
 * @throws {TypeError} 入力が文字列でない
 * @throws {RangeError} 長さが制約外
 * @complexity Time: O(n), Space: O(1)
 */
function isNumber(s) {
  if (typeof s !== 'string') throw new TypeError('Input must be a string');
  const n = s.length;
  if (n < 1 || n > 20) throw new RangeError('Input length out of bounds');

  let seenDigit = false;
  let seenDot = false;
  let seenExp = false;

  for (let i = 0; i < n; i++) {
    const c = s[i];

    if (c >= '0' && c <= '9') {
      seenDigit = true;
    } else if (c === '+' || c === '-') {
      // sign allowed only at start or right after e/E
      if (i > 0 && !(s[i - 1] === 'e' || s[i - 1] === 'E')) {
        return false;
      }
    } else if (c === '.') {
      if (seenDot || seenExp) return false;
      seenDot = true;
    } else if (c === 'e' || c === 'E') {
      if (seenExp || !seenDigit) return false;
      seenExp = true;
      seenDigit = false; // must see digits after exponent
    } else {
      return false;
    }
  }

  return seenDigit;
}

module.exports = { isNumber };

// ---- 簡易テスト / ベンチ ----
if (require.main === module) {
  const assert = require('node:assert');
  const { performance } = require('node:perf_hooks');

  // 正常系
  assert.strictEqual(isNumber("0"), true);
  assert.strictEqual(isNumber("0089"), true);
  assert.strictEqual(isNumber("-0.1"), true);
  assert.strictEqual(isNumber("+3.14"), true);
  assert.strictEqual(isNumber("4."), true);
  assert.strictEqual(isNumber("-.9"), true);
  assert.strictEqual(isNumber("2e10"), true);
  assert.strictEqual(isNumber("53.5e93"), true);

  // 異常系
  assert.strictEqual(isNumber("e"), false);
  assert.strictEqual(isNumber("."), false);
  assert.strictEqual(isNumber("abc"), false);
  assert.strictEqual(isNumber("1a"), false);
  assert.strictEqual(isNumber("1e"), false);
  assert.strictEqual(isNumber("99e2.5"), false);
  assert.strictEqual(isNumber("--6"), false);

  // 例外系
  try { isNumber(123); assert.fail(); } catch (e) { assert.ok(e instanceof TypeError); }
  try { isNumber(""); assert.fail(); } catch (e) { assert.ok(e instanceof RangeError); }

  // 簡易ベンチ
  const N = 1_000_000;
  const input = "53.5e93";
  let ok = true;

  // ウォームアップ
  isNumber(input);

  const t0 = performance.now();
  for (let i = 0; i < N; i++) {
    ok &= isNumber(input);
  }
  const t1 = performance.now();

  console.log(JSON.stringify({
    sample: input,
    result: ok,
    ms: +(t1 - t0).toFixed(3),
    n: N
  }));
}
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * ✅ for ループのみ使用
// * ✅ 一時オブジェクト生成なし
// * ✅ 文字列は直接 `s[i]` アクセス
// * ✅ 状態管理は boolean 変数で固定順追加
// * ✅ Pure function（副作用なし）

// ---

// ✅ この `solution.js` は **`node solution.js` で単体実行可能**
// ✅ LeetCode フォーマットに準拠（`module.exports` → `class Solution` に差し替えればそのまま提出可能）

// ---


