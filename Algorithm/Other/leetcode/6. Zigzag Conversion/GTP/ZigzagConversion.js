// # 1. 問題の分析

// ## 競技プログラミング視点

// * **最短時間**での解法は、**1 パス O(n)** で出力順に文字を拾うこと。
// * ジグザグの周期 `cycle = 2*(numRows-1)` を用い、**各行ごとのインデックス列**を数式で直接走査すれば、余計なデータ構造なしに構成できる。
// * 端の行（0 行目と最終行）は周期刻みで 1 箇所、**中間行は 2 箇所**（縦方向と斜め方向）を交互に拾う。

// ## 業務開発視点

// * **保守性**：行ごとの規則（先頭・末尾・中間行）を関数内で明確に分岐。命名は `cycle`, `downIdx`, `diagIdx` などで意図を可視化。
// * **例外方針**：入力検証を**早期 return/throw**。`TypeError`（型不一致）、`RangeError`（制約違反）を使用。

// ## JavaScript特有の考慮点

// * **V8 最適化**：

//   * 単純な `for` ループで**隠れクラス安定**。
//   * 結果用配列を**固定長で先行確保**し、インデックス代入→最後に `join('')`。
// * **GC対策**：行ごと配列の増殖を避け、**単一の結果バッファ**へ順次書き込み。
// * **配列操作**：`push` よりも **事前確保 + 代入** が高速/低 GC。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ                | 時間計算量      | 空間計算量 | JS実装コスト | 可読性 | 備考                                          |
// | -------------------- | ---------- | ----: | ------: | --- | ------------------------------------------- |
// | 方法A：周期式で行別に直接抽出（採用）  | O(n)       | O(1)* |       低 | 中   | `cycle=2*(r-1)`、中間行は2インデックス。結果配列のみ（*出力分は除く） |
// | 方法B：各文字に行番号を振って安定ソート | O(n log n) |  O(n) |       中 | 高   | 安定ソート前提で非効率                                 |
// | 方法C：実ジグザグ表を2Dに構築     | O(n²)      | O(n²) |       低 | 高   | 小規模のみ現実的、不要メモリが多い                           |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択**：方法A（周期式・直接抽出）
// * **理由**：最短の **O(n)**・最小補助メモリで実装容易。`numRows=1` などの端条件も単純。
// * **JS最適化ポイント**：

//   * `for` ループのみ、結果配列を **固定長 `new Array(n)`**。
//   * 文字列連結は避け、**配列→`join('')`**。
//   * 例外はホットパス前に一度だけチェック。

// ---

// # 4. コード実装（solution.js）

// **実行環境**

// * Language/Runtime: **JavaScript (Node.js v18 互換 / v22 でも可)**
// * Module: **CommonJS**
// * 外部ライブラリ: **不使用（Node 標準のみ）**
// * 実行: `node solution.js`（本ファイルは関数定義のみ。LeetCode では関数を貼り付け）

// ```javascript
'use strict';

/**
 * 6. Zigzag Conversion
 * LeetCode 用関数（Pure）
 *
 * @param {string} s - 変換対象の文字列（長さ 1..1000, 英字/','/'.'）
 * @param {number} numRows - 行数（1..1000, 整数）
 * @returns {string} ジグザグ読みの結果文字列
 * @throws {TypeError} s が文字列でない / numRows が整数でない
 * @throws {RangeError} 制約違反（長さや行数）
 *
 * 時間計算量: O(n)  （n = s.length）
 * 空間計算量: O(1)  （出力バッファを除く）
 */
var convert = function (s, numRows) {
    // --- 入力検証 ---
    if (typeof s !== 'string') throw new TypeError('s must be a string');
    if (!Number.isInteger(numRows)) throw new TypeError('numRows must be an integer');

    const n = s.length;
    if (n < 1 || n > 1000) throw new RangeError('s.length must be in [1, 1000]');
    if (numRows < 1 || numRows > 1000) throw new RangeError('numRows must be in [1, 1000]');

    // 退避しない早期終了
    if (numRows === 1 || numRows >= n) return s;

    // --- 本処理 ---
    // 周期：縦に numRows、斜めに numRows-2 → 合計 2*(numRows-1)
    const cycle = (numRows - 1) << 1; // 2*(numRows-1)
    // 結果用の固定長配列（単型: string）
    const out = new Array(n);
    let k = 0; // out への書き込み位置

    // 各行ごとに、縦方向のインデックス i と斜め方向のインデックス j を拾う
    for (let row = 0; row < numRows; row++) {
        // 行ごとの最初の縦位置は row
        for (let i = row; i < n; i += cycle) {
            out[k++] = s[i];

            // 中間行のみ「斜め」要素が存在
            // diagIdx = i + (cycle - 2*row)  ただし 0行と最終行はスキップ
            const isMiddleRow = row !== 0 && row !== numRows - 1;
            if (isMiddleRow) {
                const diagIdx = i + (cycle - (row << 1)); // cycle - 2*row
                if (diagIdx < n) out[k++] = s[diagIdx];
            }
        }
    }

    // 連結して返却
    return out.join('');
};

// CommonJS エクスポート（ローカル実行/CI 用）
module.exports = { convert };

// Analyze Complexity

// Runtime 3 ms
// Beats 90.96%
// Memory 56.48 MB
// Beats 96.08%

// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * ループは **`for` 基本**。`forEach/map` は割当コストとクロージャ生成を避けるため不使用。
// * **一時配列を最小化**：行リストを作らず、**出力配列 1 本**のみ。
// * **隠れクラス安定化**：配列は同一型（string）で連続代入。
// * 例外は**ホットパス前に早期**チェック。
// * 文字列の逐次連結は避け、**配列で構築→`join`**。

// ---

// 必要であれば、`方法A` の代替として「行配列に `push` して最後に `join`」版も提示できますが、上記実装が最も軽量・高速です。
