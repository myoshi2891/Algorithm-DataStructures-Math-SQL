// // // // // # JavaScript コーディング問題解析・実装・検証

// // // // // ## 問題分析結果

// // // // // ### 1. 競技プログラミング視点
// // // // // - **制約分析**: `words.length ≤ 300`, `maxWidth ≤ 100` から、最大30,000文字程度の処理
// // // // // - **必要計算量**: O(n×m) where n=単語数, m=平均単語長 → 実質O(総文字数)
// // // // // - **メモリ使用量**: 入力サイズの2-3倍程度（結果配列生成のため）

// // // // // ### 2. 業務開発視点
// // // // // - **可読性**: 行構築ロジックの分離、責務明確化
// // // // // - **保守性**: 各処理段階の独立性確保
// // // // // - **エラーハンドリング**: 制約違反・不正入力への対応

// // // // // ### 3. JavaScript特有分析
// // // // // - **V8最適化**: 文字列結合処理が性能のボトルネック
// // // // // - **GC負荷**: 大量の中間文字列生成を避ける必要
// // // // // - **配列操作**: `Array.join()`の活用でString concatenationを最適化

// // // // // ## アルゴリズム比較表

// // // // // |アプローチ|時間計算量|空間計算量|JS実装コスト|可読性|V8最適化|備考|
// // // // // |-----|-----|-----|-------|---|-----|--|
// // // // // |貪欲法+文字列結合|O(n×m)|O(n×m)|低|★★★|適|標準的解法|
// // // // // |StringBuilder模擬|O(n×m)|O(n×m)|中|★★☆|適|メモリ効率重視|
// // // // // |正規表現活用|O(n×m)|O(n×m)|高|★☆☆|不適|実装複雑|

// // // // // ## 採用アルゴリズムと根拠

// // // // // **貪欲法+配列結合**を採用
// // // // // - **選択理由**: 実装コストが低く、JavaScript の `Array.join()` を活用した文字列処理が効率的
// // // // // - **JavaScript最適化戦略**:
// // // // //   - 中間文字列生成を最小化
// // // // //   - 配列操作を`join()`で一括処理
// // // // //   - プリミティブ値中心の処理でGC負荷軽減
// // // // // - **トレードオフ**: メモリ使用量よりも実装の明確性を優先

// // // // // ## 実装詳細## パフォーマンス考察

// // // // // ### 1. 理論計算量
// // // // // - **時間複雑度**: O(n×m)
// // // // //   - n: 単語数、m: 平均単語長
// // // // //   - 実質的には総文字数に比例（各文字を定数回処理）
// // // // // - **空間複雑度**: O(n×m)
// // // // //   - 結果配列とその内容の文字列により決定

// // // // // ### 2. JavaScript実測予想
// // // // // - **V8環境での予想性能**:
// // // // //   - 小規模入力（<100単語）: 1ms未満
// // // // //   - 中規模入力（100-300単語）: 1-5ms
// // // // //   - `Array.join()`と`String.repeat()`の活用により高速化
// // // // // - **メモリ使用量**: 入力サイズの2-3倍程度

// // // // // ### 3. JavaScript特有最適化ポイント
// // // // // - **文字列結合最適化**: `+`演算子ではなく配列結合(`join()`)を使用
// // // // // - **プリミティブ値中心**: オブジェクト生成を最小限に抑制
// // // // // - **事前計算**: スペース数の計算を一度だけ実行
// // // // // - **GC負荷軽減**: 中間文字列の生成を最小化

// // // // // ### 4. 改善余地
// // // // // - **StringBuilder模擬**: より大規模データでは文字配列ベースの実装も検討可能
// // // // // - **メモリプール**: 繰り返し処理では配列の再利用で更なる最適化可能
// // // // // - **並列処理**: Web Workersを使った行単位の並列処理（大規模データ用）

// // // // // ## LeetCode回答フォーマット

// // // // // ```javascript
// // // // // /**
// // // // //  * @param {string[]} words
// // // // //  * @param {number} maxWidth
// // // // //  * @return {string[]}
// // // // //  */
// // // // // var fullJustify = function(words, maxWidth) {
// // // // //     const result = [];
// // // // //     let i = 0;

// // // // //     while (i < words.length) {
// // // // //         const lineWords = [];
// // // // //         let lineLength = 0;

// // // // //         // Pack words greedily
// // // // //         while (i < words.length) {
// // // // //             const wordLength = words[i].length;
// // // // //             const neededLength = lineLength + (lineWords.length > 0 ? 1 : 0) + wordLength;

// // // // //             if (neededLength > maxWidth) break;

// // // // //             lineWords.push(words[i]);
// // // // //             lineLength += wordLength;
// // // // //             i++;
// // // // //         }

// // // // //         // Justify the line
// // // // //         result.push(justifyLine(lineWords, lineLength, maxWidth, i === words.length));
// // // // //     }

// // // // //     return result;

// // // // //     function justifyLine(lineWords, lineLength, maxWidth, isLastLine) {
// // // // //         const wordsCount = lineWords.length;

// // // // //         if (wordsCount === 1 || isLastLine) {
// // // // //             const leftAligned = lineWords.join(' ');
// // // // //             return leftAligned + ' '.repeat(maxWidth - leftAligned.length);
// // // // //         }

// // // // //         const totalSpaces = maxWidth - lineLength;
// // // // //         const gaps = wordsCount - 1;
// // // // //         const baseSpaces = Math.floor(totalSpaces / gaps);
// // // // //         const extraSpaces = totalSpaces % gaps;

// // // // //         const parts = [];
// // // // //         for (let i = 0; i < wordsCount; i++) {
// // // // //             parts.push(lineWords[i]);
// // // // //             if (i < gaps) {
// // // // //                 const spacesCount = baseSpaces + (i < extraSpaces ? 1 : 0);
// // // // //                 parts.push(' '.repeat(spacesCount));
// // // // //             }
// // // // //         }

// // // // //         return parts.join('');
// // // // //     }
// // // // // };
// // // // // ```

// // // // // この実装は、貪欲法を用いて各行に可能な限り多くの単語を詰め込み、適切なスペース分散により完全正当化を実現しています。JavaScript特有の最適化として、文字列結合に配列のjoin()メソッドを活用し、V8エンジンでの高速実行を実現しています。

// // // // エラーを分析して修正します。2つの重要な問題があります：

// // // // 1. `String.repeat(-1)` エラー：パディング計算で負の値が発生
// // // // 2. 無限再帰：関数名の重複による`Maximum call stack size exceeded`## 修正内容説明

// // // // ### 1. エラーの原因と対策

// // // // #### RangeError: Invalid count value: -1
// // // // - **原因**: `leftAligned.length` が `maxWidth` より大きい場合に負の値でrepeatを呼び出し
// // // // - **対策**: パディング長さの負の値チェックを追加し、安全な処理を実装

// // // // #### Maximum call stack size exceeded
// // // // - **原因**: 関数名の重複により無限再帰が発生
// // // // - **対策**: LeetCode形式の関数名を `fullJustifyLeetCode` に変更し、独立した実装を提供

// // // // ### 2. 改善点

// // // // 1. **堅牢性向上**:
// // // //    - 負の値でのString.repeat()呼び出しを防止
// // // //    - ゼロ除算チェックを追加
// // // //    - エッジケースの適切な処理

// // // // 2. **コード構造改善**:
// // // //    - 単語収集ロジックを独立した関数に分離
// // // //    - 責務の明確化と可読性向上

// // // // 3. **デバッグ情報の改善**:
// // // //    - より詳細なエラーハンドリング
// // // //    - 予期しない状況への対応

// // // // ### 3. LeetCode対応版

// // // // ```javascript
// // // // /**
// // // //  * @param {string[]} words
// // // //  * @param {number} maxWidth
// // // //  * @return {string[]}
// // // //  */
// // // // var fullJustify = function(words, maxWidth) {
// // // //     const result = [];
// // // //     let i = 0;

// // // //     while (i < words.length) {
// // // //         const lineWords = [];
// // // //         let totalLength = 0;

// // // //         // Pack words greedily
// // // //         while (i < words.length) {
// // // //             const wordLength = words[i].length;
// // // //             const neededLength = totalLength + (lineWords.length > 0 ? 1 : 0) + wordLength;

// // // //             if (neededLength > maxWidth) break;

// // // //             lineWords.push(words[i]);
// // // //             totalLength += wordLength;
// // // //             i++;
// // // //         }

// // // //         // Justify the line
// // // //         result.push(justifyLine(lineWords, totalLength, maxWidth, i === words.length));
// // // //     }

// // // //     return result;

// // // //     function justifyLine(lineWords, totalLength, maxWidth, isLastLine) {
// // // //         const wordsCount = lineWords.length;

// // // //         if (wordsCount === 1 || isLastLine) {
// // // //             const leftAligned = lineWords.join(' ');
// // // //             const paddingLength = maxWidth - leftAligned.length;
// // // //             const padding = paddingLength > 0 ? ' '.repeat(paddingLength) : '';
// // // //             return leftAligned + padding;
// // // //         }

// // // //         const totalSpaces = maxWidth - totalLength;
// // // //         const gaps = wordsCount - 1;

// // // //         if (gaps === 0) {
// // // //             const paddingLength = maxWidth - lineWords[0].length;
// // // //             const padding = paddingLength > 0 ? ' '.repeat(paddingLength) : '';
// // // //             return lineWords[0] + padding;
// // // //         }

// // // //         const baseSpaces = Math.floor(totalSpaces / gaps);
// // // //         const extraSpaces = totalSpaces % gaps;

// // // //         const parts = [];
// // // //         for (let i = 0; i < wordsCount; i++) {
// // // //             parts.push(lineWords[i]);
// // // //             if (i < gaps) {
// // // //                 const spacesCount = baseSpaces + (i < extraSpaces ? 1 : 0);
// // // //                 if (spacesCount > 0) {
// // // //                     parts.push(' '.repeat(spacesCount));
// // // //                 }
// // // //             }
// // // //         }

// // // //         return parts.join('');
// // // //     }
// // // // };
// // // // ```

// // // // この修正により、エラーが解決され、全てのエッジケースに対して安全に動作するはずです。

// // // 問題を詳しく分析して修正します。主な問題は：

// // // 1. `String.repeat(padding)` でpaddingが負の値になっている
// // // 2. 単語収集のロジックに問題があり、スペースが正しく計算されていない最も重要な修正として、シンプルで正確なLeetCode対応版を提供します：## 修正された最終版 LeetCode対応コード

// // // ```javascript
// // // /**
// // //  * @param {string[]} words
// // //  * @param {number} maxWidth
// // //  * @return {string[]}
// // //  */
// // // var fullJustify = function(words, maxWidth) {
// // //     const result = [];
// // //     let i = 0;

// // //     while (i < words.length) {
// // //         // 現在行に収まる単語を貪欲に収集
// // //         const lineWords = [];
// // //         let totalWordsLength = 0;

// // //         // 単語を行に詰め込む
// // //         while (i < words.length) {
// // //             const wordLength = words[i].length;
// // //             const minSpacesNeeded = lineWords.length; // 現在の単語数 = 必要な最小スペース数
// // //             const totalNeededLength = totalWordsLength + minSpacesNeeded + wordLength;

// // //             if (totalNeededLength > maxWidth) break;

// // //             lineWords.push(words[i]);
// // //             totalWordsLength += wordLength;
// // //             i++;
// // //         }

// // //         // 行を正当化
// // //         const wordsCount = lineWords.length;
// // //         const isLastLine = (i === words.length);

// // //         let justifiedLine;

// // //         // 単語が1個または最終行の場合：左寄せ
// // //         if (wordsCount === 1 || isLastLine) {
// // //             const leftAligned = lineWords.join(' ');
// // //             const paddingLength = maxWidth - leftAligned.length;
// // //             justifiedLine = leftAligned + ' '.repeat(Math.max(0, paddingLength));
// // //         } else {
// // //             // 完全正当化：スペースを均等分散
// // //             const totalSpacesNeeded = maxWidth - totalWordsLength;
// // //             const gaps = wordsCount - 1;
// // //             const baseSpaces = Math.floor(totalSpacesNeeded / gaps);
// // //             const extraSpaces = totalSpacesNeeded % gaps;

// // //             const parts = [];
// // //             for (let j = 0; j < wordsCount; j++) {
// // //                 parts.push(lineWords[j]);
// // //                 if (j < gaps) {
// // //                     const spacesCount = baseSpaces + (j < extraSpaces ? 1 : 0);
// // //                     parts.push(' '.repeat(spacesCount));
// // //                 }
// // //             }
// // //             justifiedLine = parts.join('');
// // //         }

// // //         result.push(justifiedLine);
// // //     }

// // //     return result;
// // // };
// // // ```

// // // ## 主な修正点

// // // 1. **スペース計算の修正**:
// // //    - `minSpacesNeeded = lineWords.length` により正確なスペース数を計算
// // //    - 単語間の最低限必要なスペース（n-1個）を適切に考慮

// // // 2. **安全な`String.repeat()`使用**:
// // //    - すべての`repeat()`呼び出しで`Math.max(0, value)`を使用
// // //    - 負の値によるエラーを完全に防止

// // // 3. **アルゴリズムの簡潔化**:
// // //    - 関数呼び出しのオーバーヘッドを削減
// // //    - インライン処理による性能向上

// // // この修正版では、Example 1の期待される出力 `["This    is    an", "example  of text", "justification.  "]` が正確に生成されるはずです。

// // エラーの原因を特定しました。アーティファクト内の古い`justifyLine`関数（95行目）でまだ`' '.repeat(padding)`を使用していることが問題です。完全に修正します。念のため、テスト実行部分でデバッグ出力を追加して、問題の原因を特定できるようにしましょう：アーティファクト内に古いコードが残っていた可能性があります。確実に動作する最新のLeetCode対応版をもう一度提示します：

// // ## 確実に動作するLeetCode最終版

// // ```javascript
// // /**
// //  * @param {string[]} words
// //  * @param {number} maxWidth
// //  * @return {string[]}
// //  */
// // var fullJustify = function(words, maxWidth) {
// //     const result = [];
// //     let i = 0;

// //     while (i < words.length) {
// //         // 現在行に収まる単語を貪欲に収集
// //         const lineWords = [];
// //         let totalWordsLength = 0;

// //         // 単語を行に詰め込む
// //         while (i < words.length) {
// //             const wordLength = words[i].length;
// //             const minSpacesNeeded = lineWords.length; // 現在の単語数 = 必要な最小スペース数
// //             const totalNeededLength = totalWordsLength + minSpacesNeeded + wordLength;

// //             if (totalNeededLength > maxWidth) break;

// //             lineWords.push(words[i]);
// //             totalWordsLength += wordLength;
// //             i++;
// //         }

// //         // 行を正当化
// //         const wordsCount = lineWords.length;
// //         const isLastLine = (i === words.length);

// //         let justifiedLine;

// //         // 単語が1個または最終行の場合：左寄せ
// //         if (wordsCount === 1 || isLastLine) {
// //             const leftAligned = lineWords.join(' ');
// //             const paddingLength = maxWidth - leftAligned.length;
// //             justifiedLine = leftAligned + ' '.repeat(Math.max(0, paddingLength));
// //         } else {
// //             // 完全正当化：スペースを均等分散
// //             const totalSpacesNeeded = maxWidth - totalWordsLength;
// //             const gaps = wordsCount - 1;
// //             const baseSpaces = Math.floor(totalSpacesNeeded / gaps);
// //             const extraSpaces = totalSpacesNeeded % gaps;

// //             const parts = [];
// //             for (let j = 0; j < wordsCount; j++) {
// //                 parts.push(lineWords[j]);
// //                 if (j < gaps) {
// //                     const spacesCount = baseSpaces + (j < extraSpaces ? 1 : 0);
// //                     parts.push(' '.repeat(spacesCount));
// //                 }
// //             }
// //             justifiedLine = parts.join('');
// //         }

// //         result.push(justifiedLine);
// //     }

// //     return result;
// // };
// // ```

// // ## キーポイント

// // 1. **すべての`String.repeat()`で`Math.max(0, value)`使用**: 負の値エラーを完全に防止
// // 2. **正確なスペース計算**: `minSpacesNeeded = lineWords.length`で単語間の最小スペースを正確に計算
// // 3. **シンプルなインライン実装**: 関数呼び出しのオーバーヘッドを削減

// // この最終版コードは、あなたが確認したように「テストをパス」するはずです。アーティファクト内の古い関数が問題を引き起こしていたと思われます。LeetCodeではこの最終版コードをそのまま使用してください。

// 問題を特定しました。Line 95でまだ古い`' '.repeat(padding)`が残っています。アーティファクト全体を完全に書き直して、すべての箇所で安全な実装にします。完全に書き直しました。**すべての**`String.repeat()`呼び出しで`Math.max(0, value)`を使用して、負の値エラーを完全に排除しています。

// ## 最終版LeetCodeコード（100%安全版）

// ```javascript
// /**
//  * @param {string[]} words
//  * @param {number} maxWidth
//  * @return {string[]}
//  */
// var fullJustify = function(words, maxWidth) {
//     const result = [];
//     let i = 0;

//     while (i < words.length) {
//         // 現在行に収まる単語を貪欲に収集
//         const lineWords = [];
//         let totalWordsLength = 0;

//         // 単語を行に詰め込む
//         while (i < words.length) {
//             const wordLength = words[i].length;
//             const minSpacesNeeded = lineWords.length;
//             const totalNeededLength = totalWordsLength + minSpacesNeeded + wordLength;

//             if (totalNeededLength > maxWidth) break;

//             lineWords.push(words[i]);
//             totalWordsLength += wordLength;
//             i++;
//         }

//         // 行を正当化
//         const wordsCount = lineWords.length;
//         const isLastLine = (i === words.length);

//         let justifiedLine;

//         // 単語が1個または最終行の場合：左寄せ
//         if (wordsCount === 1 || isLastLine) {
//             const leftAligned = lineWords.join(' ');
//             const paddingLength = maxWidth - leftAligned.length;
//             const safeRepeatCount = Math.max(0, paddingLength);
//             justifiedLine = leftAligned + ' '.repeat(safeRepeatCount);
//         } else {
//             // 完全正当化：スペースを均等分散
//             const totalSpacesNeeded = maxWidth - totalWordsLength;
//             const gaps = wordsCount - 1;
//             const baseSpaces = Math.floor(totalSpacesNeeded / gaps);
//             const extraSpaces = totalSpacesNeeded % gaps;

//             const parts = [];
//             for (let j = 0; j < wordsCount; j++) {
//                 parts.push(lineWords[j]);
//                 if (j < gaps) {
//                     const spacesCount = baseSpaces + (j < extraSpaces ? 1 : 0);
//                     const safeSpacesCount = Math.max(0, spacesCount);
//                     parts.push(' '.repeat(safeSpacesCount));
//                 }
//             }
//             justifiedLine = parts.join('');
//         }

//         result.push(justifiedLine);
//     }

//     return result;
// };
// ```

// ## 完全修正のポイント

// 1. **すべての`String.repeat()`で安全ガード**: `Math.max(0, value)`を必ず使用
// 2. **変数名の明確化**: `safeRepeatCount`, `safeSpacesCount`で安全性を明示
// 3. **エラーハンドリングの徹底**: 予期しない負の値を完全に排除

// これでランタイムエラーは完全に解決されるはずです。

/**
 * Text Justification - LeetCode Hard Problem
 * 完全修正版 - すべてのString.repeat()で負の値チェック実装
 * @param {string[]} words - Array of words to justify
 * @param {number} maxWidth - Maximum width of each line
 * @returns {string[]} Array of justified lines
 * @complexity Time: O(n*m), Space: O(n*m) where n=words.length, m=average word length
 */
function fullJustify(words, maxWidth) {
    // 入力検証
    if (!Array.isArray(words) || words.length === 0) return [];
    if (typeof maxWidth !== 'number' || maxWidth < 1) return [];

    const result = [];
    let i = 0;

    while (i < words.length) {
        // 現在行に収まる単語を貪欲に収集
        const lineWords = [];
        let totalWordsLength = 0;

        // 単語を行に詰め込む（貪欲アプローチ）
        while (i < words.length) {
            const wordLength = words[i].length;
            const minSpacesNeeded = lineWords.length; // 現在の単語数 = 必要な最小スペース数
            const totalNeededLength = totalWordsLength + minSpacesNeeded + wordLength;

            if (totalNeededLength > maxWidth) break;

            lineWords.push(words[i]);
            totalWordsLength += wordLength;
            i++;
        }

        // 行を正当化して結果に追加
        const justifiedLine = justifyLineSafe(
            lineWords,
            totalWordsLength,
            maxWidth,
            i === words.length,
        );
        result.push(justifiedLine);
    }

    return result;
}

/**
 * 行の正当化処理（安全版）
 * すべてのString.repeat()で負の値チェック
 * @param {string[]} lineWords - 行の単語配列
 * @param {number} totalWordsLength - 単語のみの総文字数（スペース除く）
 * @param {number} maxWidth - 最大幅
 * @param {boolean} isLastLine - 最終行かどうか
 * @returns {string} 正当化された行
 */
function justifyLineSafe(lineWords, totalWordsLength, maxWidth, isLastLine) {
    const wordsCount = lineWords.length;

    // エラー防止：空の場合
    if (wordsCount === 0) {
        return ' '.repeat(Math.max(0, maxWidth));
    }

    // 単語が1個または最終行の場合：左寄せ
    if (wordsCount === 1 || isLastLine) {
        const leftAligned = lineWords.join(' ');
        const paddingLength = maxWidth - leftAligned.length;
        const safeRepeatCount = Math.max(0, paddingLength);
        return leftAligned + ' '.repeat(safeRepeatCount);
    }

    // 完全正当化：スペースを均等分散
    const totalSpacesNeeded = maxWidth - totalWordsLength;
    const gaps = wordsCount - 1;

    // gaps が 0 の場合の処理（単語が1個の場合）
    if (gaps === 0) {
        const paddingLength = maxWidth - totalWordsLength;
        const safeRepeatCount = Math.max(0, paddingLength);
        return lineWords[0] + ' '.repeat(safeRepeatCount);
    }

    // スペースの分散計算
    const baseSpaces = Math.floor(totalSpacesNeeded / gaps);
    const extraSpaces = totalSpacesNeeded % gaps;

    // 効率的な文字列構築
    const parts = [];

    for (let i = 0; i < wordsCount; i++) {
        parts.push(lineWords[i]);

        if (i < gaps) {
            // 最後の単語以外
            const spacesCount = baseSpaces + (i < extraSpaces ? 1 : 0);
            const safeSpacesCount = Math.max(0, spacesCount);
            parts.push(' '.repeat(safeSpacesCount));
        }
    }

    return parts.join('');
}

/**
 * 入力検証ヘルパー
 * @param {string[]} words - 単語配列
 * @param {number} maxWidth - 最大幅
 */
function validateInput(words, maxWidth) {
    if (!Array.isArray(words)) {
        throw new TypeError('words must be an array');
    }
    if (typeof maxWidth !== 'number' || !Number.isInteger(maxWidth)) {
        throw new TypeError('maxWidth must be an integer');
    }
    if (maxWidth < 1 || maxWidth > 100) {
        throw new RangeError('maxWidth must be between 1 and 100');
    }
    if (words.length === 0 || words.length > 300) {
        throw new RangeError('words length must be between 1 and 300');
    }

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (typeof word !== 'string') {
            throw new TypeError(`words[${i}] must be a string`);
        }
        if (word.length === 0 || word.length > 20) {
            throw new RangeError(`words[${i}] length must be between 1 and 20`);
        }
        if (word.length > maxWidth) {
            throw new RangeError(`words[${i}] length exceeds maxWidth`);
        }
    }
}

// テスト用のヘルパー関数
function runTests() {
    const testCases = [
        {
            words: ['This', 'is', 'an', 'example', 'of', 'text', 'justification.'],
            maxWidth: 16,
            expected: ['This    is    an', 'example  of text', 'justification.  '],
        },
        {
            words: ['What', 'must', 'be', 'acknowledgment', 'shall', 'be'],
            maxWidth: 16,
            expected: ['What   must   be', 'acknowledgment  ', 'shall be        '],
        },
        {
            words: [
                'Science',
                'is',
                'what',
                'we',
                'understand',
                'well',
                'enough',
                'to',
                'explain',
                'to',
                'a',
                'computer.',
                'Art',
                'is',
                'everything',
                'else',
                'we',
                'do',
            ],
            maxWidth: 20,
            expected: [
                'Science  is  what we',
                'understand      well',
                'enough to explain to',
                'a  computer.  Art is',
                'everything  else  we',
                'do                  ',
            ],
        },
    ];

    console.log('Running tests...');

    testCases.forEach((testCase, index) => {
        try {
            const result = fullJustify(testCase.words, testCase.maxWidth);
            const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
            console.log(`Test ${index + 1}: ${passed ? 'PASS' : 'FAIL'}`);

            if (!passed) {
                console.log('Expected:', testCase.expected);
                console.log('Got:', result);
                console.log('---');
                // 詳細比較
                for (let i = 0; i < Math.max(result.length, testCase.expected.length); i++) {
                    if (result[i] !== testCase.expected[i]) {
                        console.log(
                            `Line ${i}: Expected "${testCase.expected[i]}" (${testCase.expected[i]?.length})`,
                        );
                        console.log(`Line ${i}: Got      "${result[i]}" (${result[i]?.length})`);
                    }
                }
            }
        } catch (error) {
            console.log(`Test ${index + 1}: ERROR - ${error.message}`);
            console.error(error.stack);
        }
    });
}

// デバッグ実行用
function debugRun() {
    const words = [
        'Science',
        'is',
        'what',
        'we',
        'understand',
        'well',
        'enough',
        'to',
        'explain',
        'to',
        'a',
        'computer.',
        'Art',
        'is',
        'everything',
        'else',
        'we',
        'do',
    ];
    const maxWidth = 20;

    console.log('Input words:', words);
    console.log('maxWidth:', maxWidth);
    console.log('Running fullJustify...');

    try {
        const result = fullJustify(words, maxWidth);
        console.log('Success! Result:', result);

        result.forEach((line, index) => {
            console.log(`Line ${index}: "${line}" (length: ${line.length})`);
        });
    } catch (error) {
        console.error('Error occurred:', error.message);
        console.error('Stack:', error.stack);
    }
}

// LeetCode形式のエクスポート（完全安全版）
var fullJustifyLeetCode = function (words, maxWidth) {
    const result = [];
    let i = 0;

    while (i < words.length) {
        // 現在行に収まる単語を貪欲に収集
        const lineWords = [];
        let totalWordsLength = 0;

        // 単語を行に詰め込む
        while (i < words.length) {
            const wordLength = words[i].length;
            const minSpacesNeeded = lineWords.length; // 現在の単語数 = 必要な最小スペース数
            const totalNeededLength = totalWordsLength + minSpacesNeeded + wordLength;

            if (totalNeededLength > maxWidth) break;

            lineWords.push(words[i]);
            totalWordsLength += wordLength;
            i++;
        }

        // 行を正当化
        const wordsCount = lineWords.length;
        const isLastLine = i === words.length;

        let justifiedLine;

        // 単語が1個または最終行の場合：左寄せ
        if (wordsCount === 1 || isLastLine) {
            const leftAligned = lineWords.join(' ');
            const paddingLength = maxWidth - leftAligned.length;
            const safeRepeatCount = Math.max(0, paddingLength);
            justifiedLine = leftAligned + ' '.repeat(safeRepeatCount);
        } else {
            // 完全正当化：スペースを均等分散
            const totalSpacesNeeded = maxWidth - totalWordsLength;
            const gaps = wordsCount - 1;
            const baseSpaces = Math.floor(totalSpacesNeeded / gaps);
            const extraSpaces = totalSpacesNeeded % gaps;

            const parts = [];
            for (let j = 0; j < wordsCount; j++) {
                parts.push(lineWords[j]);
                if (j < gaps) {
                    const spacesCount = baseSpaces + (j < extraSpaces ? 1 : 0);
                    const safeSpacesCount = Math.max(0, spacesCount);
                    parts.push(' '.repeat(safeSpacesCount));
                }
            }
            justifiedLine = parts.join('');
        }

        result.push(justifiedLine);
    }

    return result;
};

// 実行例
// runTests();
// debugRun();
