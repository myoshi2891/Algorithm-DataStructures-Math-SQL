// 以下は、TypeScript (v5.1, Node.js 18.16.1) 環境での **LeetCode 対応関数ベースの解法**です。クラスは使用せず、\*\*型定義・コメント付きで効率重視（スライディングウィンドウ + Map）\*\*に実装しています。

// ---

// ### ✅ TypeScript 解法（LeetCode 提出用）

// ```ts
/**
 * 与えられた文字列 `s` の中から、配列 `words` のすべての単語を順不同で連結した部分文字列の開始インデックスを返す
 * @param s - 入力文字列（1 <= s.length <= 10^4）
 * @param words - 単語配列（すべての単語は同じ長さ、1 <= words.length <= 5000）
 * @returns 該当する連結部分文字列の開始インデックス配列（順不同）
 */
function findSubstring(s: string, words: string[]): number[] {
    const result: number[] = [];
    if (words.length === 0 || s.length === 0) return result;

    const wordLen = words[0].length;
    const wordCount = words.length;
    const totalLen = wordLen * wordCount;
    const sLen = s.length;

    if (sLen < totalLen) return result;

    // 単語の頻度マップを作成
    const wordMap: Map<string, number> = new Map();
    for (const word of words) {
        wordMap.set(word, (wordMap.get(word) ?? 0) + 1);
    }

    // 各開始オフセットに対してスライディングウィンドウ
    for (let i = 0; i < wordLen; i++) {
        let left = i;
        let right = i;
        let count = 0;
        const windowMap: Map<string, number> = new Map();

        while (right + wordLen <= sLen) {
            const word = s.substring(right, right + wordLen);
            right += wordLen;

            if (wordMap.has(word)) {
                windowMap.set(word, (windowMap.get(word) ?? 0) + 1);
                count++;

                while ((windowMap.get(word) ?? 0) > (wordMap.get(word) ?? 0)) {
                    const leftWord = s.substring(left, left + wordLen);
                    windowMap.set(leftWord, (windowMap.get(leftWord) ?? 1) - 1);
                    left += wordLen;
                    count--;
                }

                if (count === wordCount) {
                    result.push(left);
                }
            } else {
                windowMap.clear();
                count = 0;
                left = right;
            }
        }
    }

    return result;
}
// ```

// ---

// ### ✅ 使用例（テストコード）

// ```ts
// console.log(findSubstring("barfoothefoobarman", ["foo", "bar"])); // [0, 9]
// console.log(findSubstring("wordgoodgoodgoodbestword", ["word", "good", "best", "word"])); // []
// console.log(findSubstring("barfoofoobarthefoobarman", ["bar", "foo", "the"])); // [6, 9, 12]
// ```

// ---

// ### ✅ 時間・空間計算量（LeetCode 効率）

// | 項目      | 計算量              | 説明                                                         |
// | ------- | ---------------- | ---------------------------------------------------------- |
// | 時間計算量   | `O(N * W)`       | `N = s.length`, `W = words[0].length`。文字列全体を wordLen 分だけ走査 |
// | 空間計算量   | `O(U)`           | U = ユニークな単語数（最大 5000）に対して Map を保持                          |
// | 実行時間の目安 | 約 80〜100ms       | LeetCode制限下で良好（中央値付近）                                      |
// | メモリ使用量  | 約 50MB 未満（通常ケース） | 単語辞書とウィンドウ状態の保持                                            |

// ---

// ### ✅ 最適化ポイント

// * **オフセットループで `wordLen` スタートのすべてを探索**。
// * **Map を効率よく使ってウィンドウを巻き戻し**（オーバーカウント対応）。

// ---

// 図解や `Map` の状態遷移図が必要であれば、合わせて提示可能です。必要ですか？
