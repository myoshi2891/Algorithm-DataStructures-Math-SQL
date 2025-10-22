// # 1. 問題の分析

// ## 競技プログラミング視点

// * **本質**: 全ての部分集合（power set）を返す。要素数 `n` に対して出力は `2^n` 個。
// * **時間**: 出力サイズに比例するので下限は `Ω(2^n)`。一般的実装は `O(n·2^n)`（各部分集合の作成に最悪で O(n)）。
// * **メモリ**: 結果自体が `O(2^n)` を要するため、出力を保持する分のメモリは不可避。再帰スタックは `O(n)`。
// * **方針**: n ≤ 10 の制約があるため、再帰（バックトラック）かビット列列挙のどちらでも現実的。バックトラックの方が可読で実装コスト低。

// ## 業務開発視点

// * **型安全性**: TypeScript の型注釈で入力の意図を明確化（ここは整数配列を受け取る）。
// * **入力検証**: 実行時に `Array.isArray`、要素の型・範囲・一意性をチェックして `TypeError`/`RangeError` を投げる。
// * **保守性**: シンプルな純関数、JSDoc と明確な例外仕様を持つ実装が望ましい。

// ## TypeScript 特有の考慮

// * **strict モード**での型安全化（`tsconfig.json` に `strict: true`）。
// * ジェネリクスは本問題では不要（問題文が `number[]` を要求）ため使わず、型推論を活かす。
// * 実行時に `readonly` 引数を型で保証し、内部では再利用可能な一時 `subset` 配列を `push/pop` で扱う（イミュータブルな外部振る舞いを保持）。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ                   |    時間計算量 |                     空間計算量 | TS 実装コスト | 型安全性 | 可読性 | 備考                            |
// | ----------------------- | -------: | ------------------------: | -------: | ---: | --: | ----------------------------- |
// | 方法A: 再帰バックトラック（採用）      | O(n·2^n) | O(2^n) (出力) + O(n) (スタック) |        低 |    高 |   高 | 最も直感的で GC を抑えられる（subset を再利用） |
// | 方法B: ビット列列挙             | O(n·2^n) |                    O(2^n) |        中 |    中 |   中 | 反復で実装可能。配列コピーが多くなりがち          |
// | 方法C: 再帰的合成（concatで都度複製） | O(n·2^n) |                    O(2^n) |        高 |    中 |   低 | new-array を多用するため GC 負荷が高い    |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択**: 方法A（再帰バックトラック、subset を再利用する push/pop方式）
// * **理由**:

//   * 実装が簡潔でバグ率が低く、TypeScript の型注釈とも親和性が高い。
//   * 一時配列を再利用することで GC を抑えられ、V8 にフレンドリー（単型の number\[] を維持）。
//   * 出力量が支配的なのでアルゴリズム差は小さいが、可読性・保守性で優位。
// * **TypeScript 最適化ポイント**:

//   * `readonly nums: readonly number[]` を受け取り副作用を避ける。
//   * 実行時検査で数値・整数判定・範囲・ユニーク性を確認（問題制約に沿う）。
//   * 結果の各 subset は `number[]`（ミュータブル）だが、関数は pure（入力変更なし）。

// ---

// # 4. 実装コード（TypeScript, ESM 形式）

// 以下を `solution.ts` として保存し、`tsconfig.json` は `strict: true`（あるいは `--strict`）でコンパイルしてください。実行は `ts-node` 等か、`tsc` で JS にトランスパイル後 `node` で実行（`"type":"module"` を package.json に入れるか `.mjs` に出力）してください。

// ```typescript
// solution.ts
/**
 * subsets
 * @param nums - 入力配列（整数、ユニーク、長さ 1..10、各要素範囲 -10..10）
 * @returns 全ての部分集合（配列の配列）。順序は任意。
 * @throws {TypeError} 入力が配列でない、または要素が数値でない場合
 * @throws {RangeError} 長さや要素の制約を超える場合
 * @complexity Time: O(n * 2^n), Space: O(2^n) (出力) + O(n) (再帰スタック)
 */
export function subsetsTypescript(nums: readonly number[]): number[][] {
    // 実行時入力検証（早期にエラーを投げる）
    if (!Array.isArray(nums)) {
        throw new TypeError('Input must be an array');
    }

    const n = nums.length;
    if (n < 1 || n > 10) {
        throw new RangeError('Array length must be between 1 and 10');
    }

    // 要素検査: number, integer, 範囲, 一意性
    const seen = new Set<number>();
    for (let i = 0; i < n; ++i) {
        const v = nums[i];
        if (typeof v !== 'number' || !Number.isFinite(v)) {
            throw new TypeError(`Array elements must be finite numbers. Invalid at index ${i}`);
        }
        // 問題は整数を想定しているため整数性を確認（LeetCode の入力は整数）
        if (!Number.isInteger(v)) {
            throw new TypeError(`Array elements must be integers. Invalid at index ${i}`);
        }
        if (v < -10 || v > 10) {
            throw new RangeError(
                `Array elements must be in [-10, 10]. Invalid value ${v} at index ${i}`,
            );
        }
        if (seen.has(v)) {
            throw new RangeError(
                `Array elements must be unique. Duplicate value ${v} at index ${i}`,
            );
        }
        seen.add(v);
    }

    // 出力領域
    const res: number[][] = [];
    // 再利用する一時配列（バックトラック用）
    const temp: number[] = [];

    /**
     * dfs
     * @param idx - 次に考慮するインデックス
     */
    function dfs(idx: number): void {
        if (idx === n) {
            // 複製して結果に格納（必須：参照を渡すと後で変更されてしまう）
            res.push(temp.slice());
            return;
        }
        // 1) idx を選ばない場合
        dfs(idx + 1);

        // 2) idx を選ぶ場合
        temp.push(nums[idx]);
        dfs(idx + 1);
        temp.pop();
    }

    dfs(0);
    return res;
}

// default export for convenience (ESM)
export default subsetsTypescript;
// ```

// ---

// # 5. 検証（注意点）

// * TypeScript では `tsc --strict` でコンパイルしてください。出力が ESM であること（`package.json` に `"type":"module"`）を確認すると、Node.js v18 で `import` / `export` がそのまま使えます。
// * LeetCode 等のプラットフォームに提出する場合はプラットフォームの期待するモジュール様式（多くは CommonJS）に合わせて `export` を削除して `function subsets(...) {}` とし、必要に応じて `module.exports = subsets;` に変換してください。
// * `n <= 10` のため、スタックオーバーフローや性能問題は現実的には発生しません。
