// ### 1. 問題の分析

// #### 競技プログラミング視点での分析

// * 目標は **最速 & 低メモリ**。
// * 最適解は **スライディングウィンドウ + 直近出現位置テーブル** による 1 パス **O(n)**。
// * 文字集合は実質 ASCII が多い前提が現実的 → **まず 128 エントリの表で走らせ、非 ASCII を検知したら一度だけ 65536 に昇格**（初期化コスト最小）。

// #### 業務開発視点での分析

// * **Pure function** で副作用なし、例外はホットパス外（関数冒頭）で早期に投げる。
// * **型安全**: 引数は `string` に限定、戻り値は `number`。
// * **保守性**: JSDoc と簡潔なロジック（単純な `for`）で読みやすさを担保。

// #### TypeScript特有の考慮点

// * **型推論**でローカル変数は `number` に収束（単型で JIT 友好）。
// * **`readonly` を要求しない API 設計**（TS の型制約で過度なコピーを回避）。
// * Node/TS では Unicode の完全なコードポイント処理も可能だが、本問題は **UTF-16 コードユニット**で十分（制約に合致）。

// ---

// ### 2. アルゴリズムアプローチ比較

// | アプローチ                                  | 時間計算量    | 空間計算量                                  | TS実装コスト | 型安全性 | 可読性 | 備考                    |
// | -------------------------------------- | -------- | -------------------------------------- | ------- | ---- | --- | --------------------- |
// | 方法A: スライディング + **ASCII最適化→必要時昇格**      | **O(n)** | **O(1)**（通常 128×4B、非ASCII時のみ 65536×4B） | 低       | 高    | 高   | 最速・省メモリ（本回答）          |
// | 方法B: スライディング + `Uint32Array(65536)` 固定 | O(n)     | O(1)（65536×4B 固定）                      | 低       | 高    | 中   | 実装容易だが毎回メモリ確保が大きい     |
// | 方法C: スライディング + `Map`                   | O(n)     | O(min(n,Σ))                            | 中       | 高    | 高   | 直感的だが Map/GC のオーバーヘッド |

// ---

// ### 3. 実装方針

// * **選択したアプローチ**: 方法A（ASCII最適化 → 非ASCII検知時のみ一度だけ 65536 へ昇格）
// * **理由**:

//   * 計算量は O(n) を維持しつつ、**初期メモリが極小**でキャッシュ効率が高い。
//   * TS で TypedArray を使うことで **数値単型を保証**し、JIT/GC に優しい。
//   * 例外をホットパス外に押し出し、**ホットループの分岐を最小化**。
// * **TypeScript特有の最適化ポイント**:

//   * 変数は `number` に統一、`const`/`let` で再割り当てパターンを安定化。
//   * JSDoc による契約明示で静的解析を強化。
//   * 余計なジェネリクスやユーティリティ型を使わず、**最小の表面積**で可読性と性能を両立。

// ---

// ### 4. 実装コード（LeetCode フォーマット / ESM・外部ライブラリ不使用）

// ```ts
// solution.ts (ESM)  —  Node.js v22.14.0 / TypeScript strict 推奨
// 実行: tsc でビルド後、node で実行想定。LeetCode では関数だけ提出。

/**
 * 長さが最大の「重複文字を含まない連続部分文字列」の長さを返す（Pure）
 *
 * 高速・省メモリの工夫:
 * - まず Uint32Array(128)（ASCII）で走らせ、非ASCII（code >= 128）に遭遇したら
 *   一度だけ Uint32Array(65536) へ「昇格」。128 要素だけ copy（微小コスト）。
 * - 値は「最後に見た index + 1」、未出現は 0（fill 回避で初期化コストゼロ）。
 * - UTF-16 のコードユニット単位（本問題の想定に十分）。
 *
 * @param s - 入力文字列
 * @returns 最長長さ
 * @throws {TypeError} 入力が文字列でない場合
 * @throws {RangeError} 長さが制約 (0..5*10^4) を超える場合
 * @complexity Time: O(n), Space: O(1)
 */
export function lengthOfLongestSubstring(s: string): number {
    // --- 入力検証（ホットパス外） ---
    if (typeof s !== 'string') {
        throw new TypeError('Input must be a string');
    }
    const n: number = s.length;
    if (n < 0 || n > 5 * 10 ** 4) {
        throw new RangeError('Input length out of allowed range (0..5*10^4)');
    }
    if (n === 0) return 0;

    // --- 直近位置テーブル：まず ASCII 用（128 要素） ---
    let lastPos: Uint32Array = new Uint32Array(128);
    let asciiOnly = true; // 初回の非ASCII検出で false にして昇格
    let left = 0; // ウィンドウ左端（index+1 を格納する運用）
    let best = 0;

    // 単純 for ループ（JIT/CPU キャッシュに優しい）
    for (let i = 0; i < n; i++) {
        const code = s.charCodeAt(i); // UTF-16 コードユニット

        // 初めて非ASCIIに遭遇 → 一度だけ 65536 へ昇格
        if (asciiOnly && code >= 128) {
            const big = new Uint32Array(65536);
            big.set(lastPos); // 128 要素のみコピー
            lastPos = big;
            asciiOnly = false;
        }

        const prev = lastPos[code]; // 直近出現位置+1（未出現=0）
        if (prev > left) {
            left = prev; // ウィンドウ左端を前進
        }
        lastPos[code] = i + 1; // 現在位置+1 を記録

        const len = i - left + 1;
        if (len > best) best = len;
    }

    return best;
}
// ```

// ---

// ## TypeScript 固有の最適化観点（補足）

// * **型推論**と**数値単型**で JIT 最適化を阻害しない（`number` のみ運用）。
// * **TypedArray** による連続メモリで **GC 負荷を回避**、アクセスは添字のみで分岐最小。
// * **例外はホットパス外**（冒頭）で早期に発火し、メインループのパフォーマンスを確保。

// > もし多数回呼び出すワークロードなら、モジュールスコープに再利用用の小/大テーブルを持ち、**世代カウンタ方式**でクリアを省く最適化も可能です（ただし LeetCode 提出の純粋性を優先し上記は単関数完結）。
