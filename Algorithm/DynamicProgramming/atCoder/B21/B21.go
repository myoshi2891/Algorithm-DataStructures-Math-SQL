// 以下に、**Go (go 1.20.6)** を用いて「最長回文部分列の長さ（Longest Palindromic Subsequence）」を求める実装を提示します。
// **型を明示**し、\*\*処理時間・メモリ制約（1秒・1024MiB）\*\*を満たすよう設計しています。

// ---

// ## ✅ 実装（Go）

// ```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

// longestPalindromicSubsequence は、与えられた文字列 S に対して、削除のみで構成可能な
// 最長の回文部分列の長さを返します。
// パラメータ:
//   - s string : 英小文字からなる入力文字列（長さ N）
// 戻り値:
//   - int : 最長の回文部分列の長さ
func longestPalindromicSubsequence(s string) int {
	n := len(s)

	// dp[i][j] := s[i..j] の最長回文部分列の長さ
	dp := make([][]int, n)
	for i := range dp {
		dp[i] = make([]int, n)
	}

	// 長さ1の部分列は常に回文
	for i := 0; i < n; i++ {
		dp[i][i] = 1
	}

	// 長さ2以上の部分列についてのDP
	for length := 2; length <= n; length++ {
		for i := 0; i <= n-length; i++ {
			j := i + length - 1
			if s[i] == s[j] {
				if length == 2 {
					dp[i][j] = 2
				} else {
					dp[i][j] = dp[i+1][j-1] + 2
				}
			} else {
				if dp[i+1][j] > dp[i][j-1] {
					dp[i][j] = dp[i+1][j]
				} else {
					dp[i][j] = dp[i][j-1]
				}
			}
		}
	}

	return dp[0][n-1]
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	// 入力 N は使用しないが、読み取りだけ行う
	_ = scanner.Text()

	scanner.Scan()
	s := strings.TrimSpace(scanner.Text())

	result := longestPalindromicSubsequence(s)
	fmt.Println(result)
}

// ## ✅ 入力例と出力

// ### 入力:

// ```
// 11
// programming
// ```

// ### 出力:

// ```
// 4
// ```

// ---

// ## ✅ 時間・メモリの分析

// | 項目     | 分析内容                    |
// | ------ | ----------------------- |
// | 時間計算量  | O(N^2)（最大1000×1000）     |
// | 空間計算量  | O(N^2)（1000×1000 int配列） |
// | メモリ使用量 | 約4〜8MB（int型が4〜8バイト）     |
// | 実行時間制限 | 約1秒 → Goの速度で余裕あり        |
// | メモリ制限  | 1024 MiB → 問題なし         |

// ---

// ## ✅ 備考

// * 入力制約から N ≤ 1000 のため、2次元DPでも十分高速かつ低メモリです。
// * 回文の中身を復元することも可能ですが、今回は「長さ」だけを効率的に求めます。
// * `bufio.Scanner` を使用して高速に標準入力を処理しています。
