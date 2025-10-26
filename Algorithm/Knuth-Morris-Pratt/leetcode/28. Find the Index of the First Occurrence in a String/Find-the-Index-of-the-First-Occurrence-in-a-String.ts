// 以下に、\*\*TypeScript 5.1（Node.js 18.16.1）\*\*で `needle` を `haystack` の中から最初に探す関数を、**KMP（Knuth-Morris-Pratt）法**を用いて効率的に実装したものを提示します。

// クラスは使用せず、**関数ベース**で構成されています。

// ---

// ## ✅ 実装（TypeScript・関数形式）

// ```ts
/**
 * haystack から needle を検索し、最初に一致するインデックスを返す。
 * 一致しない場合は -1 を返す。
 *
 * @param haystack - 探索対象の文字列（長さ最大10^4）
 * @param needle - 探索する部分文字列（長さ最大10^4）
 * @returns 最初に一致した位置のインデックス、または -1
 *
 * 時間計算量: O(n + m)
 * 空間計算量: O(m)
 */
function strStr(haystack: string, needle: string): number {
    if (needle.length === 0) return 0;

    // KMP: LPS（Longest Prefix Suffix）配列の構築
    function buildLPS(pattern: string): number[] {
        const lps: number[] = new Array(pattern.length).fill(0);
        let length = 0;
        let i = 1;

        while (i < pattern.length) {
            if (pattern[i] === pattern[length]) {
                length++;
                lps[i] = length;
                i++;
            } else {
                if (length !== 0) {
                    length = lps[length - 1]; // 戻って再試行
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
        }
        return lps;
    }

    const lps = buildLPS(needle);
    let i = 0; // haystack index
    let j = 0; // needle index

    while (i < haystack.length) {
        if (haystack[i] === needle[j]) {
            i++;
            j++;
            if (j === needle.length) {
                return i - j; // 完全一致発見
            }
        } else {
            if (j !== 0) {
                j = lps[j - 1]; // needle をスライド
            } else {
                i++;
            }
        }
    }

    return -1; // 一致せず
}
// ```

// ---

// ## 📦 テストケース例

// ```ts
// console.log(strStr("sadbutsad", "sad"));       // => 0
// console.log(strStr("leetcode", "leeto"));      // => -1
// console.log(strStr("mississippi", "issip"));   // => 4
// console.log(strStr("abc", ""));                // => 0
// ```

// ---

// ## 🧠 処理時間・メモリ消費量の考察

// | 項目    | 値                                |
// | ----- | -------------------------------- |
// | 時間計算量 | `O(n + m)` （KMP法）                |
// | 空間計算量 | `O(m)`（LPS配列）                    |
// | 実行環境  | TypeScript 5.1 + Node.js 18.16.1 |
// | 最大文字数 | 10⁴（問題制約）                        |

// この方法は、最悪ケースでも `haystack` と `needle` の長さの合計だけで済むため、**TLE（Time Limit Exceeded）を回避しやすい**です。

// ---

// ## ✅ 補足

// * TypeScriptでは `.indexOf()` を使えば O(n \* m) になる可能性があるため、KMP法がパフォーマンス的に優れています。
// * クラスベースでの設計が不要な場合、競技プログラミングやLeetCodeの制約にも適しています。

// ---

// 他のアルゴリズム（Rabin-Karp など）や `.indexOf` ベースもご希望であれば比較提示可能です。必要であればお知らせください。
