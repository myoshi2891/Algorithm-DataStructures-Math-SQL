// # 1. 問題の分析

// ## 競技プログラミング視点での分析

// * 典型問題「Longest Substring Without Repeating Characters」
// * 最速は **スライディングウィンドウ＋直近位置テーブル**。左右ポインタで 1 パス、各文字の最後の位置を参照して左端を更新。
// * 入力長は最大 `5*10^4` なので **O(n)** で十分余裕。ハッシュ (`Map`) でも良いが、**連想配列よりも固定長の数値配列**の方が速く・省メモリになりやすい。

// ## 業務開発視点での分析

// * **関数は Pure**（入出力のみ・副作用なし）として実装。
// * **入力検証**（型・長さ）を早期に実施し、`TypeError` / `RangeError` を明確に投げる。
// * 命名は LeetCode 準拠の `lengthOfLongestSubstring` とし、保守性のため **JSDoc** を付与。

// ## JavaScript特有の考慮点

// * **V8 最適化**:

//   * 直近位置テーブルは `Uint32Array(65536)` を使用し、**「未出現 = 0」「出現位置は index+1」**で管理（`fill(-1)`等を避け初期化コストをゼロ化）。
//   * ループは `for (let i = 0; i < n; i++)` で単純化し、**hidden class** を安定化。
// * **GC対策**:

//   * `Map`/オブジェクト生成を避け、**固定長 TypedArray** を再利用（関数内スコープで完結、都度の拡張なし）。
// * **文字の扱い**:

//   * `charCodeAt` により **UTF-16 のコードユニット**単位で処理（一般的な LeetCode の想定と整合）。
//   * サロゲートペアを 1 文字として数えたい要件では追加実装が必要だが、本問題の制約（英数字・記号・スペース等）では十分。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ                               | 時間計算量    |                   空間計算量 | JS実装コスト | 可読性 | 備考                           |
// | ----------------------------------- | -------- | ----------------------: | ------: | --- | ---------------------------- |
// | 方法A：スライディングウィンドウ＋`Uint32Array` 直近位置 | **O(n)** | **O(1)**（固定 65536 × 4B） |       低 | 中   | 1 パス・分岐最小、初期化コスト小（未出現=0方式）   |
// | 方法B：スライディング＋`Map`                   | O(n)     |             O(min(n,Σ)) |       中 | 高   | 実装は直感的だが、GC/ハッシュ管理の分だけ相対的に不利 |
// | 方法C：二重ループ＋集合チェック                    | O(n²)    |                    O(1) |       低 | 高   | 小規模のみ妥当。最大入力では不適             |

// > 注: 「JS実装コスト」はオブジェクト生成や型不安定化のリスクも加味。

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択**: 方法A（スライディングウィンドウ＋`Uint32Array` 直近位置テーブル）
// * **理由**:

//   * **計算量**: 時間 **O(n)**・空間 **O(1)** を達成し、最大入力でも安定高速。
//   * **V8 友好**: 連続メモリの TypedArray でヒープ断片化や Map のオーバーヘッドを回避。
//   * **初期化最適化**: `index+1` を格納し「未出現=0」で管理するため `fill` 不要、起動コストが極小。
// * **JavaScript特有の最適化ポイント**:

//   * `for` インデックス走査で JIT に優しいホットループ。
//   * 例外はホットパス外・冒頭で早期に投げる。
//   * 一時オブジェクト生成を抑制（クロージャ・コールバック不使用）。

// ---

// # 4. コード実装（solution.js）

// ```js
// 'use strict';
// // Module: CommonJS（CI で `node solution.js` 実行可能）
// // 外部ライブラリ: 不使用（Node標準のみ）

// /**
//  * 長さが最大の「重複文字を含まない連続部分文字列」の長さを返す（Pure）
//  *
//  * 実装詳細:
//  * - スライディングウィンドウ（left..i）
//  * - 直近位置テーブル: Uint32Array(65536) に「最後に現れた位置+1」を格納（未出現=0）
//  *   - UTF-16 のコードユニット単位で処理（英数字・記号・スペースの制約に十分）
//  *
//  * @param {string} s - 入力文字列
//  * @returns {number} - 最長長さ
//  * @throws {TypeError} - 入力が文字列でない場合
//  * @throws {RangeError} - 長さが制約 (0 <= len <= 5*10^4) を超える場合
//  *
//  * @example
//  * lengthOfLongestSubstring("abcabcbb") === 3
//  * lengthOfLongestSubstring("bbbbb") === 1
//  * lengthOfLongestSubstring("pwwkew") === 3
//  *
//  * @complexity
//  * 時間計算量: O(n)
//  * 空間計算量: O(1)（固定 65536 要素のテーブル）
//  */
// function lengthOfLongestSubstring(s) {
//   // --- 入力検証（軽量＆早期） ---
//   if (typeof s !== 'string') {
//     throw new TypeError('Input must be a string');
//   }
//   const n = s.length;
//   if (n < 0 || n > 5 * 10 ** 4) {
//     throw new RangeError('Input length out of allowed range (0..5*10^4)');
//   }
//   if (n === 0) return 0; // 早期リターン

//   // --- 本処理 ---
//   // 直近位置テーブル（UTF-16 コードユニット範囲: 0..65535）
//   // 値は「最後に見た index + 1」。未出現は 0。
//   const lastPos = new Uint32Array(65536);

//   let left = 0;      // 現在ウィンドウの左端
//   let best = 0;      // 最長長さ

//   // 単純な for ループ（V8 好み、分岐少なめ）
//   for (let i = 0; i < n; i++) {
//     const code = s.charCodeAt(i);     // UTF-16 コードユニット
//     const seen = lastPos[code];       // 直近の出現位置+1（未出現=0）

//     if (seen > 0 && seen > left) {
//       // 同じ文字がウィンドウ内にある → 左端を更新
//       left = seen;
//     }
//     // 現在位置（+1）を記録
//     lastPos[code] = i + 1;

//     // 長さ更新
//     const len = i - left + 1;
//     if (len > best) best = len;
//   }

//   return best;
// }

// module.exports = { lengthOfLongestSubstring };
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * ループは `for` 基本。`forEach`/`map` は不要な関数割当を生むため回避。
// * 一時オブジェクト・クロージャを作らない（GC 圧を低減）。
// * 直近位置テーブルは **TypedArray** で固定長・数値単型を維持（hidden class 安定）。
// * 例外はホットパス外（関数冒頭）で早期チェック。
// * 文字は UTF-16 コードユニット基準。サロゲートペアを 1 文字換算にしたい場合は追加ロジックが必要（本問題の想定では不要）。

// # 1. 問題の分析

// ## 競技プログラミング視点での分析

// * 目標は **最速 & 低メモリ**。
// * 基本はスライディングウィンドウ＋「直近出現位置」。
// * 多くの入力は **ASCII（≤127）** が大半 → ここを最適化すれば体感が大きく改善。

// ## 業務開発視点での分析

// * **Pure function** を維持（副作用なし）。
// * **入力検証**を早期に行い、エラーはホットパス外で処理。
// * 命名は LeetCode 準拠 `lengthOfLongestSubstring`。

// ## JavaScript特有の考慮点

// * **V8 最適化**

//   * まず **小さいテーブル（`Uint32Array(128)`）** で走らせ、**非ASCII（code ≥ 128）** を検知したら **一度だけ 65536 テーブルへ昇格**。
//   * 「未出現=0 / 出現は index+1」で**初期化不要**（`fill`を避ける）。
//   * ループは `for (let i = 0; i < n; i++)` のインデックス走査、関数割り当てなし。
// * **GC対策**

//   * `Map`/オブジェクトを使わず、**TypedArray** で連続メモリ・単型数値。
//   * 昇格時のコピーは **128 要素だけ**（微小コスト）。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ                                  | 時間計算量    |                                  空間計算量 | JS実装コスト | 可読性 | 備考                    |
// | -------------------------------------- | -------- | -------------------------------------: | ------: | --- | --------------------- |
// | 方法A（本回答）: **ASCII最適化＋必要時のみ 65536 に昇格** | **O(n)** | **O(1)**（通常 128×4B、非ASCII時のみ 65536×4B） |       低 | 中   | ほぼ ASCII の入力で速度・メモリ優位 |
// | 方法B: 常に `Uint32Array(65536)`           | O(n)     |                      O(1)（固定 65536×4B） |       低 | 中   | 実装簡単だが毎回大きい表を確保       |
// | 方法C: `Map`                             | O(n)     |                            O(min(n,Σ)) |       中 | 高   | 直感的だが GC/ハッシュで相対的に不利  |

// ---

// # 3. 選択したアプローチと理由

// * **選択**: 方法A（ASCII 最適化＋必要時のみ昇格）
// * **理由**:

//   * 実運用で多い ASCII 入力に対し **テーブル 128 要素で済む** → メモリ・キャッシュ効率良し。
//   * 非ASCII 混在でも **一度だけ昇格 & 128 要素コピー** でオーバーヘッド極小。
//   * `fill` 不要設計（index+1 管理）で **初期化コストゼロ**。
// * **JS最適化ポイント**:

//   * 単純 `for` ループ、コールバック未使用（クロージャ生成なし）。
//   * TypedArray による単型・連続メモリで **JIT/CPU キャッシュに優しい**。
//   * 例外はホットパス外で早期判定。

// ---

// # 4. コード実装（solution.js）

// ```js
'use strict';
// Module: CommonJS（node solution.js で実行可）
// 外部ライブラリ: 不使用（Node標準のみ）

/**
 * 長さが最大の「重複文字を含まない連続部分文字列」の長さを返す（Pure）
 *
 * 高速・省メモリの工夫:
 * - まず Uint32Array(128)（ASCII）で処理し、非ASCII（code >= 128）に遭遇したら
 *   そのタイミングで一度だけ Uint32Array(65536) に「昇格」して継続。
 * - 値は「最後に見た index + 1」、未出現は 0（初期化 fill を回避）。
 * - UTF-16 のコードユニット単位（本問題の制約に十分）。
 *
 * @param {string} s - 入力文字列
 * @returns {number} - 最長長さ
 * @throws {TypeError} - 入力が文字列でない
 * @throws {RangeError} - 長さが 0..5*10^4 を超える
 *
 * @complexity
 * 時間計算量: O(n)
 * 空間計算量: O(1)  ※ 通常は 128×4B、非ASCIIを含む場合のみ 65536×4B
 */
function lengthOfLongestSubstring(s) {
    // --- 入力検証（ホットパス外） ---
    if (typeof s !== 'string') throw new TypeError('Input must be a string');
    const n = s.length;
    if (n < 0 || n > 5 * 10 ** 4) {
        throw new RangeError('Input length out of allowed range (0..5*10^4)');
    }
    if (n === 0) return 0;

    // --- 直近位置テーブル：まず ASCII 用（128 要素） ---
    let lastPos = new Uint32Array(128);
    let asciiOnly = true; // 昇格フラグ
    let left = 0;
    let best = 0;

    for (let i = 0; i < n; i++) {
        const code = s.charCodeAt(i);

        // 非ASCIIに初めて遭遇 → 65536 テーブルへ一度だけ昇格
        if (asciiOnly && code >= 128) {
            const big = new Uint32Array(65536);
            // ここで 128 要素だけコピー（微小コスト）
            big.set(lastPos);
            lastPos = big;
            asciiOnly = false;
        }

        const prev = lastPos[code]; // 直近の出現位置+1（未出現=0）
        if (prev > left) left = prev; // ウィンドウ左端を更新
        lastPos[code] = i + 1; // 現在位置+1 を記録

        const len = i - left + 1;
        if (len > best) best = len;
    }

    return best;
}

module.exports = { lengthOfLongestSubstring };

// ---- 以下はローカル実行の簡易入出力（CI想定: node solution.js "abcabcbb"）----
// 入力を与えない限りは何もしない（Pure実装とは分離）
if (require.main === module) {
    const arg = process.argv[2];
    if (typeof arg === 'string') {
        console.log(lengthOfLongestSubstring(arg));
    }
}
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * ループは `for`、コールバック不使用で **関数割当/クロージャ生成を回避**。
// * **TypedArray** を用い、**index+1** 管理により `fill` を避ける（初期化ゼロコスト）。
// * **ASCII 最適化**により小さい表（128）で走るケースが大半 → **メモリ/キャッシュ友好**。
// * 非ASCIIが混在しても **一回だけ昇格 & 128要素コピー** のみ。
// * 例外はホットパス外で早期に投げ、ホットループ内の分岐を最小化。

// > 補足：もしさらに「複数回呼ばれるワークロード」での効率を高めたい場合は、
// > モジュールスコープに小テーブル/大テーブルを **再利用オブジェクト**として持ち、
// > 「世代カウンタ（generation）」方式でクリアを省く最適化も可能です（本回答は関数単体の純粋性と可搬性を優先）。
