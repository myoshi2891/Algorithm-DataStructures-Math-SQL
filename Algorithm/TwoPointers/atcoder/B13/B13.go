// 以下に、**Go (v1.20.6)** を用いた、しゃくとり法（二重ポインタ）による高速解法を提示します。
// 時間・メモリ効率を意識しており、**`O(N)` 時間、`O(N)` メモリ**で動作します。

// ---

// ## ✅ 問題再掲（要約）

// * 配列 `A[0...N-1]` の連続部分列のうち、**和が K 以下**の個数を数える。
// * 制約：`1 ≤ N ≤ 10^5`, `1 ≤ K, A[i] ≤ 10^9`
// * 実行時間制限：1 秒、メモリ制限：1024 MiB

// ---

// ## ✅ Go 実装（型明示・高速処理）

package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	// 高速読み取りのため bufio.Scanner 使用
	reader := bufio.NewReader(os.Stdin)

	// 1行目：N, K
	line1, _ := reader.ReadString('\n')
	parts := strings.Fields(line1)
	N, _ := strconv.Atoi(parts[0])
	K, _ := strconv.Atoi(parts[1])

	// 2行目：A[0..N-1]
	line2, _ := reader.ReadString('\n')
	aParts := strings.Fields(line2)
	A := make([]int, N)
	for i := 0; i < N; i++ {
		A[i], _ = strconv.Atoi(aParts[i])
	}

	// Two pointers（しゃくとり法）
	var count int = 0
	var sum int = 0
	var right int = 0

	for left := 0; left < N; left++ {
		for right < N && sum+A[right] <= K {
			sum += A[right]
			right++
		}

		count += right - left

		if right == left {
			right++
		} else {
			sum -= A[left]
		}
	}

	fmt.Println(count)
}

// ## ✅ 処理内容と型の明示

// | 変数名                             | 型       | 説明           |
// | ------------------------------- | ------- | ------------ |
// | `N`, `K`                        | `int`   | 入力サイズ・上限     |
// | `A`                             | `[]int` | 配列（最大10⁵要素）  |
// | `sum`, `count`, `left`, `right` | `int`   | 計算用ポインタ・累積変数 |

// ---

// ## ✅ パフォーマンスとリソース

// | 項目    | 評価                           |
// | ----- | ---------------------------- |
// | 時間計算量 | `O(N)`                       |
// | 空間計算量 | `O(N)`（配列Aのみ）                |
// | メモリ目安 | ≒ 400KB（`10⁵ × 4B`）          |
// | 実行速度  | 数十ms（`go run` or `go build`） |

// ---

// ## ✅ 入力例

// ```text
// 7 50
// 11 12 16 22 27 28 31
// ```

// ```bash
// go run main.go < input.txt
// ```

// 出力：

// ```
// 13
// ```

// ---

// ## ✅ 処理フロー概要（図解）

// ```
// [11, 12, 16, 22, 27, 28, 31]
//  ↑                            left
//  ↑                            right
// sum = 0 → 右へ進めて、合計 ≤ K の最大範囲 → count += (right - left)
// → left を進めて同様に処理
// ```

// ---

// ## ✅ 補足：高速 I/O の工夫

// * `bufio.NewReader` で1行ずつ高速読み込み
// * `strings.Fields()` により空白文字を自動分割（タブ・空白など）
// * すべての `Atoi` は `int` 型で扱い、64bit対応不要（Go の `int` は 64bit）


// 複数行に渡る A\[i] 入力形式や、ベンチマーク用コードの追加、`bufio.Scanner` 使用への切り替えも可能です。
