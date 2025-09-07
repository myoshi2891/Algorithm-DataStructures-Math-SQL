// # TypeScript コーディング問題解析・実装・検証

// ## 問題分析結果

// ### 1. 競技プログラミング視点
// - **制約分析**: `words.length ≤ 300`, `maxWidth ≤ 100` から、最大30,000文字程度の処理
// - **必要計算量**: O(n×m) where n=単語数, m=平均単語長 → 実質O(総文字数)
// - **メモリ使用量**: 入力サイズの2-3倍程度（結果配列生成のため）

// ### 2. 業務開発視点
// - **型安全性**: 文字列配列の厳密な型チェック、幅指定の数値型制約
// - **エラーケース網羅**: コンパイル時の型チェック + 実行時の制約検証
// - **保守性**: 型定義による意図の明確化、関数分離による責務分散

// ### 3. TypeScript特有分析
// - **型システム最適化**: 厳密な型定義により実行時エラーの事前検出
// - **コンパイル時最適化**: `readonly`配列、`const assertions`による型推論強化
// - **V8最適化**: TypeScriptコンパイル後のJavaScriptが高度に最適化可能

// ## アルゴリズム比較表

// |アプローチ|時間計算量|空間計算量|TS実装コスト|可読性|型安全性|V8最適化|備考|
// |-----|-----|-----|-------|---|-----|-----|--|
// |貪欲法+型安全配列結合|O(n×m)|O(n×m)|低|★★★|高|適|推奨解法|
// |StringBuilder模擬+型ガード|O(n×m)|O(n×m)|中|★★☆|高|適|メモリ効率重視|
// |関数型アプローチ|O(n×m)|O(n×m)|高|★☆☆|高|不適|実装複雑|

// ## 採用アルゴリズムと根拠

// **貪欲法+型安全配列結合**を採用
// - **選択理由**: TypeScriptの型システムを最大活用しつつ、実装コストとパフォーマンスのバランスが最適
// - **TypeScript最適化戦略**:
//   - 厳密な型定義による実行時エラー削減
//   - `readonly`修飾子による配列の不変性保証
//   - 型ガードによる安全な型変換
// - **トレードオフ**: 型チェックのオーバーヘッドは実行時には存在しないため、型安全性を最大化

// ## 実装詳細## TypeScript特有最適化ポイント

// ### 1. 型システム活用
// - **厳密な型定義**: `readonly string[]`, `JustificationResult`等で意図を明確化
// - **型ガード実装**: `isEmptyInput`, `wordsCount === 0`での安全な分岐
// - **`const assertions`**: `as const`による型推論最適化
// - **Utility Types**: `Required<T>`, `readonly`修飾子での不変性保証

// ### 2. V8エンジン最適化（TypeScript特有）
// - **コンパイル後JavaScript最適化**: TypeScriptの型情報は実行時に存在しないため、純粋なJavaScript性能
// - **Hidden Class安定化**: インターフェースによる一貫したオブジェクト形状
// - **型統一配列**: `string[]`の厳密な型により最適化促進

// ### 3. TypeScript特有の安全性
// - **コンパイル時エラー検出**: 型不整合の事前発見
// - **`satisfies`演算子**: 型チェックと推論の両立（必要に応じて）
// - **厳密なnullチェック**: `--strictNullChecks`による実行時エラー削減

// ## パフォーマンス考察

// ### 1. 理論計算量
// - **時間複雑度**: O(n×m) where n=単語数, m=平均単語長
// - **空間複雑度**: O(n×m) - 結果配列のサイズ

// ### 2. TypeScript/V8実測予想
// - **コンパイル後性能**: JavaScriptと同等（型情報は実行時に存在しない）
// - **型チェックオーバーヘッド**: コンパイル時のみ、実行時は0
// - **最適化効果**: 型安全性による実行時エラー削減で全体性能向上

// ### 3. 改善余地
// - **さらなる型活用**: Template Literal Typesでの文字列操作型安全性
// - **並列処理**: Worker Threadsとの組み合わせ（大規模データ用）
// - **メモリプール**: 型安全な配列再利用パターン

// ## 最終版LeetCodeコード

// ```typescript
// /**
//  * @param {string[]} words
//  * @param {number} maxWidth
//  * @return {string[]}
//  */
// var fullJustify = function(words: string[], maxWidth: number): string[] {
//     const result: string[] = [];
//     let i = 0;

//     while (i < words.length) {
//         const lineWords: string[] = [];
//         let totalWordsLength = 0;

//         // 単語収集（型安全）
//         while (i < words.length) {
//             const wordLength: number = words[i].length;
//             const minSpacesNeeded: number = lineWords.length;
//             const totalNeededLength: number = totalWordsLength + minSpacesNeeded + wordLength;

//             if (totalNeededLength > maxWidth) break;

//             lineWords.push(words[i]);
//             totalWordsLength += wordLength;
//             i++;
//         }

//         // 行正当化（型安全な処理）
//         const wordsCount: number = lineWords.length;
//         const isLastLine: boolean = (i >= words.length);

//         let justifiedLine: string;

//         if (wordsCount === 1 || isLastLine) {
//             const leftAligned: string = lineWords.join(' ');
//             const paddingLength: number = maxWidth - leftAligned.length;
//             const padding: string = ' '.repeat(Math.max(0, paddingLength));
//             justifiedLine = leftAligned + padding;
//         } else {
//             const totalSpacesNeeded: number = maxWidth - totalWordsLength;
//             const gaps: number = wordsCount - 1;
//             const baseSpaces: number = Math.floor(totalSpacesNeeded / gaps);
//             const extraSpaces: number = totalSpacesNeeded % gaps;

//             const parts: string[] = [];
//             for (let j = 0; j < wordsCount; j++) {
//                 parts.push(lineWords[j]);
//                 if (j < gaps) {
//                     const spacesCount: number = baseSpaces + (j < extraSpaces ? 1 : 0);
//                     const safeSpaces: string = ' '.repeat(Math.max(0, spacesCount));
//                     parts.push(safeSpaces);
//                 }
//             }
//             justifiedLine = parts.join('');
//         }

//         result.push(justifiedLine);
//     }

//     return result;
// };
// ```

// このTypeScript実装では、型安全性を最大限に活用しつつ、JavaScriptにコンパイル後も高いパフォーマンスを維持できる設計となっています。

// 型定義
interface JustificationInput {
  readonly words: readonly string[];
  readonly maxWidth: number;
}

type JustifiedLine = string;
type JustificationResult = readonly JustifiedLine[];

interface LineCollectionResult {
  readonly words: readonly string[];
  readonly totalLength: number;
  readonly nextIndex: number;
}

interface AlgorithmOptions {
  readonly validateInput?: boolean;
  readonly enableDebug?: boolean;
}

// 制約定数
const CONSTRAINTS = {
  MIN_WORDS: 1,
  MAX_WORDS: 300,
  MIN_WIDTH: 1,
  MAX_WIDTH: 100,
  MIN_WORD_LENGTH: 1,
  MAX_WORD_LENGTH: 20,
} as const;

/**
 * Text Justification - TypeScript版
 * 型安全性を重視した実装
 * @param words - 正当化対象の単語配列
 * @param maxWidth - 各行の最大幅
 * @param options - アルゴリズムオプション
 * @returns 正当化された行の配列
 * @throws {TypeError} 型制約違反
 * @throws {RangeError} 制約条件違反
 * @complexity Time: O(n*m), Space: O(n*m)
 */
function fullJustify(
  words: readonly string[],
  maxWidth: number,
  options: AlgorithmOptions = {}
): JustificationResult {
  // 1. 入力検証（型安全）
  if (options.validateInput !== false) {
    validateInput({ words, maxWidth });
  }

  // 2. エッジケース処理
  if (isEmptyInput(words)) {
    return [];
  }

  // 3. メインアルゴリズム
  return processJustification(words, maxWidth);
}

/**
 * 型安全な入力検証
 * @param input - 入力データ
 */
function validateInput(
  input: JustificationInput
): asserts input is Required<JustificationInput> {
  const { words, maxWidth } = input;

  // null/undefined チェック
  if (words == null) {
    throw new TypeError("words cannot be null or undefined");
  }
  if (typeof maxWidth !== "number") {
    throw new TypeError("maxWidth must be a number");
  }

  // 配列型チェック
  if (!Array.isArray(words)) {
    throw new TypeError("words must be an array");
  }

  // 制約チェック
  if (
    !Number.isInteger(maxWidth) ||
    maxWidth < CONSTRAINTS.MIN_WIDTH ||
    maxWidth > CONSTRAINTS.MAX_WIDTH
  ) {
    throw new RangeError(
      `maxWidth must be an integer between ${CONSTRAINTS.MIN_WIDTH} and ${CONSTRAINTS.MAX_WIDTH}`
    );
  }

  if (
    words.length < CONSTRAINTS.MIN_WORDS ||
    words.length > CONSTRAINTS.MAX_WORDS
  ) {
    throw new RangeError(
      `words length must be between ${CONSTRAINTS.MIN_WORDS} and ${CONSTRAINTS.MAX_WORDS}`
    );
  }

  // 各単語の検証
  words.forEach((word, index) => {
    if (typeof word !== "string") {
      throw new TypeError(`words[${index}] must be a string`);
    }
    if (
      word.length < CONSTRAINTS.MIN_WORD_LENGTH ||
      word.length > CONSTRAINTS.MAX_WORD_LENGTH
    ) {
      throw new RangeError(
        `words[${index}] length must be between ${CONSTRAINTS.MIN_WORD_LENGTH} and ${CONSTRAINTS.MAX_WORD_LENGTH}`
      );
    }
    if (word.length > maxWidth) {
      throw new RangeError(`words[${index}] length exceeds maxWidth`);
    }
  });
}

/**
 * エッジケース判定（型ガード）
 * @param words - 単語配列
 * @returns 空配列かどうか
 */
function isEmptyInput(words: readonly string[]): words is readonly [] {
  return words.length === 0;
}

/**
 * メイン正当化処理
 * @param words - 単語配列
 * @param maxWidth - 最大幅
 * @returns 正当化結果
 */
function processJustification(
  words: readonly string[],
  maxWidth: number
): JustificationResult {
  const result: JustifiedLine[] = [];
  let currentIndex = 0;

  while (currentIndex < words.length) {
    // 一行分の単語収集
    const lineData = collectWordsForLine(words, currentIndex, maxWidth);
    currentIndex = lineData.nextIndex;

    // 行の正当化
    const isLastLine = currentIndex >= words.length;
    const justifiedLine = justifyLineSafe(
      lineData.words,
      lineData.totalLength,
      maxWidth,
      isLastLine
    );

    result.push(justifiedLine);
  }

  return result as JustificationResult;
}

/**
 * 一行分の単語収集（型安全版）
 * @param words - 全単語配列
 * @param startIndex - 開始インデックス
 * @param maxWidth - 最大幅
 * @returns 収集結果
 */
function collectWordsForLine(
  words: readonly string[],
  startIndex: number,
  maxWidth: number
): LineCollectionResult {
  const lineWords: string[] = [];
  let totalWordsLength = 0;
  let currentIndex = startIndex;

  while (currentIndex < words.length) {
    const currentWord = words[currentIndex];
    const wordLength = currentWord.length;
    const requiredSpaces = lineWords.length; // 現在の単語数 = 必要最小スペース数
    const totalNeededLength = totalWordsLength + requiredSpaces + wordLength;

    if (totalNeededLength > maxWidth) {
      break;
    }

    lineWords.push(currentWord);
    totalWordsLength += wordLength;
    currentIndex++;
  }

  return {
    words: lineWords as readonly string[],
    totalLength: totalWordsLength,
    nextIndex: currentIndex,
  };
}

/**
 * 行の正当化処理（型安全版）
 * @param lineWords - 行の単語配列
 * @param totalWordsLength - 単語の総長
 * @param maxWidth - 最大幅
 * @param isLastLine - 最終行フラグ
 * @returns 正当化された行
 */
function justifyLineSafe(
  lineWords: readonly string[],
  totalWordsLength: number,
  maxWidth: number,
  isLastLine: boolean
): JustifiedLine {
  const wordsCount = lineWords.length;

  // 型ガード: 空行チェック
  if (wordsCount === 0) {
    return createPadding(maxWidth);
  }

  // 左寄せケース: 単語1個または最終行
  if (wordsCount === 1 || isLastLine) {
    return justifyLeft(lineWords, maxWidth);
  }

  // 完全正当化ケース
  return justifyFull(lineWords, totalWordsLength, maxWidth);
}

/**
 * 左寄せ正当化
 * @param lineWords - 単語配列
 * @param maxWidth - 最大幅
 * @returns 左寄せされた行
 */
function justifyLeft(
  lineWords: readonly string[],
  maxWidth: number
): JustifiedLine {
  const leftAligned = lineWords.join(" ");
  const paddingLength = maxWidth - leftAligned.length;
  const safePadding = createPadding(Math.max(0, paddingLength));

  return leftAligned + safePadding;
}

/**
 * 完全正当化
 * @param lineWords - 単語配列
 * @param totalWordsLength - 単語総長
 * @param maxWidth - 最大幅
 * @returns 完全正当化された行
 */
function justifyFull(
  lineWords: readonly string[],
  totalWordsLength: number,
  maxWidth: number
): JustifiedLine {
  const wordsCount = lineWords.length;
  const totalSpacesNeeded = maxWidth - totalWordsLength;
  const gaps = wordsCount - 1;

  // ゼロ除算防止（型安全）
  if (gaps <= 0) {
    return (
      lineWords[0] + createPadding(Math.max(0, maxWidth - lineWords[0].length))
    );
  }

  const baseSpaces = Math.floor(totalSpacesNeeded / gaps);
  const extraSpaces = totalSpacesNeeded % gaps;

  // 効率的な文字列構築
  const parts: string[] = [];

  for (let i = 0; i < wordsCount; i++) {
    parts.push(lineWords[i]);

    if (i < gaps) {
      const spacesCount = baseSpaces + (i < extraSpaces ? 1 : 0);
      const safeSpacesCount = Math.max(0, spacesCount);
      parts.push(createPadding(safeSpacesCount));
    }
  }

  return parts.join("");
}

/**
 * 安全なパディング生成
 * @param count - スペース数
 * @returns スペース文字列
 */
function createPadding(count: number): string {
  const safeCount = Math.max(0, Math.floor(count));
  return " ".repeat(safeCount);
}

// LeetCode対応版（型安全）
/**
 * @param {string[]} words
 * @param {number} maxWidth
 * @return {string[]}
 */
var fullJustifyLeetCode = function (
  words: string[],
  maxWidth: number
): string[] {
  const result: string[] = [];
  let i = 0;

  while (i < words.length) {
    // 現在行に収まる単語を収集
    const lineWords: string[] = [];
    let totalWordsLength = 0;

    while (i < words.length) {
      const wordLength = words[i].length;
      const minSpacesNeeded = lineWords.length;
      const totalNeededLength = totalWordsLength + minSpacesNeeded + wordLength;

      if (totalNeededLength > maxWidth) break;

      lineWords.push(words[i]);
      totalWordsLength += wordLength;
      i++;
    }

    // 行を正当化
    const wordsCount = lineWords.length;
    const isLastLine = i >= words.length;

    let justifiedLine: string;

    if (wordsCount === 1 || isLastLine) {
      // 左寄せ
      const leftAligned = lineWords.join(" ");
      const paddingLength = maxWidth - leftAligned.length;
      const padding = " ".repeat(Math.max(0, paddingLength));
      justifiedLine = leftAligned + padding;
    } else {
      // 完全正当化
      const totalSpacesNeeded = maxWidth - totalWordsLength;
      const gaps = wordsCount - 1;
      const baseSpaces = Math.floor(totalSpacesNeeded / gaps);
      const extraSpaces = totalSpacesNeeded % gaps;

      const parts: string[] = [];
      for (let j = 0; j < wordsCount; j++) {
        parts.push(lineWords[j]);
        if (j < gaps) {
          const spacesCount = baseSpaces + (j < extraSpaces ? 1 : 0);
          const safeSpaces = " ".repeat(Math.max(0, spacesCount));
          parts.push(safeSpaces);
        }
      }
      justifiedLine = parts.join("");
    }

    result.push(justifiedLine);
  }

  return result;
};

// 使用例（型安全）
const exampleWords: readonly string[] = [
  "This",
  "is",
  "an",
  "example",
  "of",
  "text",
  "justification.",
] as const;
const exampleWidth: number = 16;

try {
  const result = fullJustify(exampleWords, exampleWidth);
  console.log("TypeScript版実行結果:", result);
} catch (error) {
  console.error("エラー:", error);
}
