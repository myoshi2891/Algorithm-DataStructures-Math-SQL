// # 1. 問題の分析

// ## 競技プログラミング視点

// * **入力サイズ**:

//   * `N ≤ 1000`, `K ≤ 100,000`
//   * K件の出来事を並べ替える必要がある。
// * **主要処理**:

//   * (年, 名前) のペアを **年昇順、同年なら名前辞書順** でソート。
// * **計算量**:

//   * `O(K log K)` で十分高速。
// * **メモリ**:

//   * `K=100,000` 件でも配列格納は問題なし。

// ## 業務開発視点

// * **保守性**:

//   * 「入力→解析→ソート→出力」の直線的処理に分ける。
//   * 関数を分割してテスト容易性を担保。
// * **エラーハンドリング**:

//   * 型・範囲チェックを行い、異常値があれば `TypeError` / `RangeError` を投げる。

// ## JavaScript特有の考慮点

// * `Array.sort` は `O(n log n)` で十分速い。
// * V8の安定ソートを利用すれば、同じ年に複数人がいても安定。辞書順比較は明示。
// * `for` ループで出力文字列を構築し、`join("\n")` でまとめるのが効率的。
// * 文字列連結の都度 `+` を使うより配列バッファを使う方がGC効率が良い。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ             | 時間計算量      | 空間計算量 | JS実装コスト | 可読性 | 備考             |
// | ----------------- | ---------- | ----- | ------- | --- | -------------- |
// | 方法A: ヒープ構築 (逐次抽出) | O(K log K) | O(K)  | 高       | 低   | 実装が複雑          |
// | 方法B: sort利用       | O(K log K) | O(K)  | 低       | 高   | 安定ソートで十分高速     |
// | 方法C: 全探索選択        | O(K²)      | O(1)  | 低       | 中   | K=100,000では不可能 |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択**: 方法B（sortによる一括ソート）
// * **理由**:

//   * K=100,000 に対して `O(K log K)` は現実的。
//   * Node.js の `Array.sort` は最適化済みで信頼性が高い。
//   * 実装・可読性・保守性が最良。
// * **JS最適化ポイント**:

//   * sort比較関数を `(a, b) => a.year - b.year || a.name.localeCompare(b.name)` として単純化。
//   * 出力は `map(...).join("\n")` で効率化。

// ---

// # 4. コード実装（solution.js）

// ```javascript
"use strict";

/**
 * 歴史年表の担当者を年代順に並べて出力
 * CommonJS形式
 */

/**
 * @typedef {Object} Event
 * @property {number} year - 出来事の年
 * @property {string} name - 担当者の名前
 */

/**
 * 歴史年表の順番を決定する関数（Pure Function）
 * @param {number} n - グループ人数
 * @param {number} k - 出来事数
 * @param {string[]} members - メンバー一覧
 * @param {Event[]} events - 出来事リスト
 * @returns {string[]} 年代順に並んだ担当者名
 * @throws {TypeError} 型不正時
 * @throws {RangeError} 制約違反時
 */
function buildTimeline(n, k, members, events) {
  // --- 入力検証 ---
  if (!Number.isInteger(n) || !Number.isInteger(k)) {
    throw new TypeError("n and k must be integers");
  }
  if (n < 1 || n > 1000) {
    throw new RangeError("n out of range");
  }
  if (k < 1 || k > 100000) {
    throw new RangeError("k out of range");
  }
  if (!Array.isArray(members) || members.length !== n) {
    throw new TypeError("members must be an array of length n");
  }
  if (!Array.isArray(events) || events.length !== k) {
    throw new TypeError("events must be an array of length k");
  }

  // メンバー集合で担当者名を検証
  const memberSet = new Set(members);
  for (const ev of events) {
    if (typeof ev.year !== "number" || !Number.isFinite(ev.year)) {
      throw new TypeError("year must be a finite number");
    }
    if (ev.year < 1 || ev.year > 1_000_000_000) {
      throw new RangeError("year out of range");
    }
    if (typeof ev.name !== "string" || !memberSet.has(ev.name)) {
      throw new TypeError(`invalid member name: ${ev.name}`);
    }
  }

  // --- ソート ---
  events.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.name.localeCompare(b.name);
  });

  // --- 出力用リスト ---
  return events.map((ev) => ev.name);
}

// --- 実行部 ---
if (require.main === module) {
  const input = require("fs").readFileSync(0, "utf8").trim().split("\n");
  let idx = 0;
  const [nStr, kStr] = input[idx++].split(" ");
  const n = Number(nStr),
    k = Number(kStr);

  const members = [];
  for (let i = 0; i < n; i++) {
    members.push(input[idx++].trim());
  }

  const events = [];
  for (let i = 0; i < k; i++) {
    const [yStr, name] = input[idx++].split(" ");
    events.push({ year: Number(yStr), name });
  }

  const result = buildTimeline(n, k, members, events);
  console.log(result.join("\n"));
}

module.exports = { buildTimeline };
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * **ループ**: 出力生成は `map` → `join`、V8最適化に沿った配列操作。
// * **一時オブジェクト**: 最小限（イベントオブジェクトK件のみ）。
// * **プロパティ形状**: `{year:number, name:string}` で統一、hidden class 安定化。
// * **例外処理**: 制約違反を早期チェック、ホットパス外。
// * **sort**: `localeCompare` は必要最小限。

// ---
