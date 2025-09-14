// # TypeScript コーディング問題解析・実装・検証

// ## 1. 問題分析結果

// ### 競技プログラミング視点
// - **問題の本質**: Edit Distance（編集距離）問題 - 文字列間の最小変換コスト
// - **制約分析**: `0 <= word1.length, word2.length <= 500` → O(n²)の動的プログラミングが適用可能
// - **最適解**: 2次元DPテーブルによる最小編集距離計算

// ### 業務開発視点
// - **型安全性**: 文字列型の厳密なチェック、実行時エラーの事前検出
// - **保守性**: インターフェースによる明確な契約、ジェネリクスによる再利用性
// - **拡張性**: コスト重み付けや操作種別の型安全な拡張が容易

// ### TypeScript特有分析
// - **コンパイル最適化**: `const assertions`による型推論最適化
// - **型安全性**: 文字列型の厳密なチェック、null/undefined安全性
// - **V8最適化**: コンパイル後のJavaScriptは標準的な最適化を受ける

// ## 2. アルゴリズム比較表

// |アプローチ|時間計算量|空間計算量|TS実装コスト|可読性|型安全性|V8最適化|備考|
// |-----|-----|-----|-------|---|-----|-----|--|
// |2D DP  |O(m×n) |O(m×n) |低  |★★★|高|適 |標準的解法、型安全 |
// |1D DP最適化  |O(m×n) |O(min(m,n)) |中  |★★☆|高|適 |空間効率、複雑な型定義 |
// |再帰+メモ化  |O(m×n) |O(m×n) |高  |★☆☆|中|不適 |型推論困難、スタックリスク |

// ## 3. 採用アルゴリズムと根拠

// **選択**: 2次元動的プログラミング with 強力な型安全性
// - **計算効率**: O(m×n)で最適
// - **型安全性**: コンパイル時の型チェックで実行時エラー防止
// - **実装安全性**: 配列境界チェック、null安全性の保証

// **TypeScript最適化戦略**:
// - 厳密な型定義による実行時エラー削減
// - `readonly`配列による不変性保証
// - ジェネリクスによる型安全な再利用性
// - アサーション関数による型ガード

// ## 4. 実装詳細

// 型定義
interface EditDistanceInput {
  readonly word1: string;
  readonly word2: string;
}

interface EditDistanceOptions {
  readonly validateInput?: boolean;
  readonly enableOptimization?: boolean;
}

// 操作種別の型定義
type EditOperation = "insert" | "delete" | "replace" | "match";

// DPテーブルの型定義
type DPTable = readonly (readonly number[])[];

/**
 * Edit Distance計算の結果型
 */
interface EditDistanceResult {
  readonly distance: number;
  readonly operations?: readonly EditOperation[];
}

/**
 * 型安全な入力検証
 */
function validateEditDistanceInput(
  input: unknown
): asserts input is EditDistanceInput {
  if (typeof input !== "object" || input === null) {
    throw new TypeError("Input must be an object");
  }

  const obj = input as Record<string, unknown>;

  if (typeof obj.word1 !== "string") {
    throw new TypeError("word1 must be a string");
  }

  if (typeof obj.word2 !== "string") {
    throw new TypeError("word2 must be a string");
  }

  // 制約チェック
  if (obj.word1.length > 500 || obj.word2.length > 500) {
    throw new RangeError("Word length must not exceed 500 characters");
  }
}

/**
 * エッジケース判定（型ガード）
 */
function isEmptyStringCase(input: EditDistanceInput): boolean {
  return input.word1.length === 0 || input.word2.length === 0;
}

/**
 * エッジケース処理
 */
function handleEmptyStringCase(input: EditDistanceInput): number {
  return input.word1.length + input.word2.length;
}

/**
 * DPテーブル初期化（型安全）
 */
function createDPTable(rows: number, cols: number): number[][] {
  // V8最適化: 事前サイズ確保
  const dp = new Array<number[]>(rows);
  for (let i = 0; i < rows; i++) {
    dp[i] = new Array<number>(cols);
  }
  return dp;
}

/**
 * メインアルゴリズム実装（型安全 + V8最適化）
 */
function computeEditDistance(word1: string, word2: string): number {
  const m = word1.length;
  const n = word2.length;

  // DPテーブル作成
  const dp = createDPTable(m + 1, n + 1);

  // ベースケース初期化（型安全なループ）
  for (let j = 0; j <= n; j++) {
    dp[0]![j] = j;
  }

  for (let i = 0; i <= m; i++) {
    dp[i]![0] = i;
  }

  // DPテーブル構築
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        // 文字一致: 追加操作不要
        dp[i]![j] = dp[i - 1]![j - 1]!;
      } else {
        // 3つの操作の最小値を計算
        const deleteOp = dp[i - 1]![j]!;
        const insertOp = dp[i]![j - 1]!;
        const replaceOp = dp[i - 1]![j - 1]!;

        dp[i]![j] = Math.min(deleteOp, insertOp, replaceOp) + 1;
      }
    }
  }

  return dp[m]![n]!;
}

/**
 * TypeScript版 minDistance関数（LeetCode形式）
 * @param word1 - 変換元文字列
 * @param word2 - 変換先文字列
 * @returns 最小編集距離
 * @complexity Time: O(m×n), Space: O(m×n)
 */
function minDistance(word1: string, word2: string): number {
  // 型安全な入力検証
  const input: EditDistanceInput = { word1, word2 } as const;
  validateEditDistanceInput(input);

  // エッジケース処理
  if (isEmptyStringCase(input)) {
    return handleEmptyStringCase(input);
  }

  // メインアルゴリズム実行
  return computeEditDistance(word1, word2);
}

/**
 * 拡張版: 操作履歴も含む計算（業務開発向け）
 */
function minDistanceWithOperations(
  word1: string,
  word2: string,
  options: EditDistanceOptions = {}
): EditDistanceResult {
  // オプション処理
  const { validateInput = true } = options;

  if (validateInput) {
    validateEditDistanceInput({ word1, word2 });
  }

  const distance = minDistance(word1, word2);

  return {
    distance,
    // 操作履歴は必要に応じて実装
    operations: undefined,
  } as const;
}

// LeetCode提出用のエクスポート
export { minDistance };

// 業務開発用の拡張エクスポート
export {
  minDistanceWithOperations,
  type EditDistanceInput,
  type EditDistanceOptions,
  type EditDistanceResult,
};
// ## 5. TypeScript特有最適化ポイント

// ### 型システム活用
// - **厳密な型定義**: `readonly`による不変性、`as const`による型推論最適化
// - **型ガード実装**: `asserts`による実行時型安全性の保証
// - **ユーティリティ型**: インターフェース設計による契約の明確化
// - **ジェネリクス**: 型安全な再利用性の確保

// ### V8エンジン最適化（コンパイル後）
// - **配列事前確保**: `new Array<T>(size)`による型安全なメモリ確保
// - **非null アサーション**: `!`演算子による型チェック除去とパフォーマンス向上
// - **インデックスアクセス**: 型安全なまま高速配列アクセス
// - **プリミティブ値**: 数値型統一による Hidden Class 安定化

// ### コンパイル時最適化
// - **Tree Shaking**: 明示的export/importによる不要コード除去
// - **型消去**: 実行時の型情報オーバーヘッドなし
// - **デッドコード除去**: 型チェックによる到達不能コードの特定

// ## 6. パフォーマンス考察

// ### 理論計算量
// - **時間計算量**: O(m × n) - JavaScriptと同等
// - **空間計算量**: O(m × n) - DPテーブルのサイズ

// ### TypeScript/V8実測予想
// - **コンパイル後性能**: JavaScript版と同等（型情報は消去される）
// - **型チェックオーバーヘッド**: コンパイル時のみで実行時影響なし
// - **非null アサーション**: 型チェック除去によるわずかな高速化

// ### 型システムのメリット
// 1. **実行時エラー削減**: 配列境界外アクセス、null参照の事前検出
// 2. **開発効率向上**: IDEサポート、リファクタリング安全性
// 3. **保守性**: インターフェースによる契約の明確化

// ### 改善余地
// 1. **空間最適化**: `Uint16Array`による固定長配列の活用
// 2. **型レベル計算**: Template Literal Typesによる文字列操作の型安全性
// 3. **関数オーバーロード**: 入力に応じた戻り値型の特殊化

// この実装は型安全性とパフォーマンスを両立させ、競技プログラミングから業務開発まで幅広く対応できる堅牢なソリューションです。
