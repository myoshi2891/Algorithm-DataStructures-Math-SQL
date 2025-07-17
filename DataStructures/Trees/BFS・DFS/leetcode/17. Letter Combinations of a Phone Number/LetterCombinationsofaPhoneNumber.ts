// ローカル実行や関数のみで使いたい場合は、**グローバル関数で実装**できます。
// LeetCodeの制約を無視して「関数版」のコードを提供します。

// ---

// ## **TypeScript 関数実装（クラスなし）**

// ```typescript
/**
 * 与えられた数字文字列から、考えられる全ての文字列の組み合わせを返す
 * @param digits - 数字文字列（0 <= digits.length <= 4）
 * @returns 可能な文字列組み合わせの配列
 * 
 * 時間計算量: O(3^N × 4^M)  
 * 空間計算量: O(出力サイズ + 再帰スタック)
 */
function letterCombinations(digits: string): string[] {
    if (digits.length === 0) return [];

    const phoneMap: Record<string, string> = {
        '2': "abc", '3': "def", '4': "ghi",
        '5': "jkl", '6': "mno", '7': "pqrs",
        '8': "tuv", '9': "wxyz"
    };

    const result: string[] = [];

    function backtrack(index: number, path: string): void {
        if (index === digits.length) {
            result.push(path);
            return;
        }

        const currentDigit = digits[index];
        const letters = phoneMap[currentDigit];

        for (const letter of letters) {
            backtrack(index + 1, path + letter);
        }
    }

    backtrack(0, "");
    return result;
}
// ```

// ---

// ## **使い方（ローカル実行用）**

// ```typescript
// console.log(letterCombinations("23"));
// // 出力例: ["ad","ae","af","bd","be","bf","cd","ce","cf"]

// console.log(letterCombinations(""));
// // 出力: []

// console.log(letterCombinations("2"));
// // 出力: ["a","b","c"]
// ```

// ---

// ## **計算量**

// | 項目    | 内容                                                     |
// | ----- | ------------------------------------------------------ |
// | 時間計算量 | O(3^N × 4^M)（N: '2', '3', ..., '8' の個数, M: '7'と'9'の個数） |
// | 空間計算量 | O(出力サイズ + 再帰スタック)                                      |

// ---

// ## **用途に応じた使い分け**

// | 用途              | 実装パターン                            |
// | --------------- | --------------------------------- |
// | LeetCode提出      | `class Solution` 必須               |
// | Node.js / 関数テスト | `function letterCombinations` でOK |

// ---

// もし、**Node.jsでの実行コマンド（`ts-node`）や、最適化版実装**も必要でしたら教えてください！
