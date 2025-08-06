// 以下は Go (1.20.6) による解答です。
// **対応の取れた括弧列**に対して、対応する括弧の位置ペアを出力します。

// ---

// ## ✅ 要件への対応

// | 要件        | 対応内容                            |
// | --------- | ------------------------------- |
// | Go 1.20.6 | 最新構文で記述                         |
// | 型の明示      | すべての関数に引数・返却値の型を明示              |
// | 処理の関数化    | 入力、処理、出力を別関数に分離                 |
// | 時間・メモリ効率  | O(N log N) 時間・O(N) 空間で制約内に収まる設計 |

// ---

// ## ✅ 実装コード（Go）

// ```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strings"
)

// pair は括弧の対応位置を表す構造体
type pair struct {
	left  int // 開き括弧の位置（1-indexed）
	right int // 閉じ括弧の位置（1-indexed）
}

// findMatchingParentheses は対応の取れた括弧列から対応ペアを返す
//
// s: 括弧列（例: "(())()"）
// 戻り値: 対応する括弧の位置ペア（1-indexed, max(l,r) 昇順）
func findMatchingParentheses(s string) []pair {
	stack := make([]int, 0)
	pairs := make([]pair, 0, len(s)/2)

	for i, ch := range s {
		if ch == '(' {
			stack = append(stack, i+1) // 1-indexed
		} else {
			n := len(stack)
			if n > 0 {
				left := stack[n-1]
				stack = stack[:n-1]
				pairs = append(pairs, pair{left, i + 1})
			}
		}
	}

	// max(l, r) の昇順でソート
	sort.Slice(pairs, func(i, j int) bool {
		return max(pairs[i].left, pairs[i].right) < max(pairs[j].left, pairs[j].right)
	})

	return pairs
}

// max は2つの整数の最大値を返す
func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

// main は標準入力からデータを読み、結果を出力する
func main() {
	reader := bufio.NewReader(os.Stdin)
	line, _ := reader.ReadString('\n')
	s := strings.TrimSpace(line)

	pairs := findMatchingParentheses(s)
	for _, p := range pairs {
		fmt.Printf("%d %d\n", p.left, p.right)
	}
}
// ```

// ---

// ## ✅ 出力例（入力: `(())()`）

// ```
// 2 3
// 1 4
// 5 6
// ```

// ---

// ## ✅ 時間・メモリ効率

// | 指標     | 計算量        | 説明                     |
// | ------ | ---------- | ---------------------- |
// | 時間計算量  | O(N log N) | 探索：O(N)、ソート：O(N log N) |
// | 空間計算量  | O(N)       | スタック＋ペア記録 slice        |
// | 入力最大長  | 200,000    | 問題なし（制約内）              |
// | 実行時間制限 | ✅ 2秒以内     | Go の I/O + 処理なら十分高速    |
// | メモリ制限  | ✅ 1024 MiB | 約数MB程度で収まる             |

// ---

// ## ✅ 備考

// * `bufio.Reader` と `strings.TrimSpace` を使うことで高速な I/O を実現。
// * スライスや構造体を使ってメモリ確保の効率も良く設計しています。
// * 並べ替えの基準は `max(left, right)` に従っており、出力条件を厳密に満たします。

// ---

// 他言語や他スタイル（逐次出力・メモリ節約型）をご希望であれば対応できます。
