// ## 1. 問題の分析

// ### 競技プログラミング視点

// * **目的**: 重複を含む `nums` から **重複のない全部分集合**を列挙（Subsets II）。
// * **高速方針**: `nums` を昇順ソートし、各要素 `v` について

//   * **新規値**: 既存の全 subset を拡張
//   * **重複値**: **直前イテレーションで新規に追加された範囲のみ**を拡張
//     とする**反復法**。再帰・クロージャ・`slice/concat` を避け、手書きコピーで割当と型不安定化を抑制。

// ### 業務開発視点

// * **型安全**: `readonly number[]` で参照透過を促し、イミュータブル準拠。
// * **保守性**: バリデーションを関数分離。条件は軽量でホットパス外。
// * **エラー**: 型不一致や値域外は `TypeError` / `RangeError` を明示。

// ### TypeScript特有の考慮点

// * **型推論**: 返り値は `number[][]`。内部作業配列は明示型で単型（number）を維持。
// * **readonly**: 入力は `readonly` にして破壊防止。
// * **コンパイル時最適化**: ジェネリクスは不要（問題が `number[]` 前提）。不要な抽象は排除。

// ---

// ## 2. アルゴリズムアプローチ比較

// | アプローチ                   | 時間計算量        |     空間計算量 | TS実装コスト | 型安全性 | 可読性 | 備考                             |
// | ----------------------- | ------------ | --------: | ------: | ---: | --: | ------------------------------ |
// | 方法A: **再帰BT + 同階層スキップ** | O(n·2^n)     |      O(n) |       低 |    高 |   高 | 定番・速いが関数呼び出し/クロージャが乗る          |
// | **方法B: 反復・拡張区間限定（採用）**  | **O(n·2^n)** | **O(1)**※ |       低 |    高 |   高 | `prevSize` で重複を自然排除、再帰なし ※出力除く |
// | 方法C: 頻度表（多重集合 DFS）      | O(n·2^n)     |      O(n) |       中 |    高 |   中 | 実装冗長、利点薄                       |

// ---

// ## 3. 実装方針

// * **選択**: 方法B（反復・拡張区間限定）
// * **理由**:

//   * 出力量に支配される領域で、**再帰・クロージャを排除**してオーバーヘッド低減。
//   * `prevSize` により**重複時の拡張区間を正しく限定**（前回のバグ要因を根治）。
//   * TS でも単純な `for` と明示配列生成で**型安全かつ可読**。
// * **TS最適化ポイント**:

//   * `readonly number[]` 入力、`const` / 明示長 `new Array(len)`、手書きコピーで**単型配列維持**。
//   * 例外は**ホットパス外**（バリデーション）で早期に投げる。

// ---

// ## 4. 実装コード（LeetCode 形式 / ESM指向）

// ```ts
// LeetCode の TypeScript 環境では `export` は付けずに提出してください。
// ローカル ESM で利用する場合は `export function subsetsWithDup(...)` に変更可。

/**
 * 重複を含む配列から、重複のない全部分集合を列挙（Subsets II）
 * 反復・拡張区間限定（prevSize）で重複排除
 *
 * @param nums - 入力配列（整数、readonly）
 * @returns すべてのユニークな部分集合（順不同）
 * @throws {TypeError} 入力が配列でない / 整数以外を含む場合
 * @throws {RangeError} 値域（[-10,10]）や長さ（>10）を逸脱する場合
 * @complexity Time: O(n·2^n), Space: O(1) 追加（出力除く）
 */
function subsetsWithDup(nums: readonly number[]): number[][] {
  validateInput(nums);

  // 昇順ソートで同値を隣接させる（入力は readonly のためコピーしてソート）
  const arr = nums.slice().sort((a, b) => a - b);
  const res: number[][] = [[]];

  // prevSize: 直前イテレーション「開始時点」の res.length
  // 重複値のときは、ここから末尾までが「直前に新規追加された範囲」
  let prevSize = 0;

  for (let i = 0, n = arr.length; i < n; i++) {
    const v = arr[i];
    const size = res.length; // 今回イテレーション開始時の長さ
    const start = i > 0 && v === arr[i - 1] ? prevSize : 0;

    // start..size-1 の既存 subset を v で拡張
    for (let j = start; j < size; j++) {
      const base = res[j];
      const m = base.length + 1;
      const next = new Array<number>(m);
      // 手書きコピー（slice/spread/concat を避ける）
      for (let k = 0; k < m - 1; k++) next[k] = base[k];
      next[m - 1] = v;
      res.push(next);
    }

    prevSize = size; // 次のイテレーション用に保存
  }

  return res;
}

/** 軽量バリデーション（ホットパス外） */
function validateInput(arr: unknown): asserts arr is readonly number[] {
  if (!Array.isArray(arr)) {
    throw new TypeError('Input must be an array of numbers');
  }
  const n = arr.length;
  // LeetCode 互換性のため下限 0 を許容（問題制約は 1..10）
  if (n > 10) {
    throw new RangeError('Array length must be <= 10');
  }
  for (let i = 0; i < n; i++) {
    const v = (arr as number[])[i];
    // 有限整数のみ
    if (typeof v !== 'number' || !Number.isFinite(v) || (v | 0) !== v) {
      throw new TypeError('All elements must be finite integers');
    }
    // 問題の値域に合わせる
    if (v < -10 || v > 10) {
      throw new RangeError('Each number must be within [-10, 10]');
    }
  }
}
// ```

// ---

// ## TypeScript 固有の最適化観点（補足）

// * **readonly 引数**で副作用を抑制し、Pure を型レベルで支援。
// * **手書きコピー + `new Array<number>(len)`** で hidden class 安定・割当最小化。
// * **`asserts` 型述語**でバリデーション後の安全な取り扱いを保証（以降の分岐不要）。
// * **ジェネリクスは不採用**（問題が `number[]` に限定のため抽象化コスト > 便益）。

// ---

// ### まとめ

// * 先の「`prevEnd + 1` バグ」を**`prevSize` 管理**で完全に回避。
// * 再帰を使わない反復法で **安定して高速 & 低 GC**。
// * TypeScript でも**strict & 型安全**に準拠。
//   このまま LeetCode に貼り付けて動作します（ローカル ESM は `export` を付与）。
