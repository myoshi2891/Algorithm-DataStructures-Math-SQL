// 以下は、**Go 1.20.6** を用いた解答です。
// この問題は、「2方向にしか動かせない複数のコマがある Nim ゲーム」の変種であり、各コマの状態を Grundy 数 `(a-1) ^ (b-1)` で表し、全ての Grundy 数の XOR を取ることで勝敗を判定します。

// ---

// ## ✅ Go 解答コード（関数分離・型明示）

// ```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

// determineWinner は勝者を判定する関数です。
// N: コマの数
// positions: 各コマの位置 (a, b) のスライス
// 戻り値: 先手が勝つ場合 "First"、後手が勝つ場合 "Second"
func determineWinner(N int, positions [][2]int) string {
	var xorSum int = 0
	for i := 0; i < N; i++ {
		a, b := positions[i][0], positions[i][1]
		grundy := (a - 1) ^ (b - 1)
		xorSum ^= grundy
	}
	if xorSum == 0 {
		return "Second"
	}
	return "First"
}

// main は標準入力からデータを受け取り、勝者を出力します。
func main() {
	reader := bufio.NewReaderSize(os.Stdin, 1<<20) // 1MB buffer for fast input
	line, _ := reader.ReadString('\n')
	tokens := strings.Fields(line)
	N, _ := strconv.Atoi(tokens[0])
	// H, W は読み込むが未使用
	// H, _ := strconv.Atoi(tokens[1])
	// W, _ := strconv.Atoi(tokens[2])

	positions := make([][2]int, N)
	for i := 0; i < N; i++ {
		line, _ := reader.ReadString('\n')
		tokens = strings.Fields(line)
		a, _ := strconv.Atoi(tokens[0])
		b, _ := strconv.Atoi(tokens[1])
		positions[i] = [2]int{a, b}
	}

	result := determineWinner(N, positions)
	fmt.Println(result)
}
// ```

// ---

// ## ✅ 入力例

// ```
// 2 8 4
// 6 4
// 7 1
// ```

// ### ✅ 出力

// ```
// Second
// ```

// ---

// ## ✅ 型と構造の解説

// | 項目          | 型          | 説明                         |
// | ----------- | ---------- | -------------------------- |
// | `positions` | `[][2]int` | 各コマの位置 (a, b) の配列（固定長2タプル） |
// | `xorSum`    | `int`      | Grundy 数の XOR 合計           |
// | 戻り値         | `string`   | 勝者 `"First"` or `"Second"` |

// ---

// ## ✅ 計算量とパフォーマンス

// | 項目       | 内容                 |
// | -------- | ------------------ |
// | 時間計算量    | `O(N)`（最大 10⁵）     |
// | 空間計算量    | `O(N)`（コマの座標のみ保持）  |
// | 実行時間（目安） | 約 20〜40ms（Goの高速実装） |
// | メモリ使用量   | 約 1〜2MB 以下         |

// ※ `bufio.Reader` による高速読み取りを活用してボトルネック回避

// ---

// ## ✅ まとめ

// このGo実装は、以下のように設計されています：

// * 高速な `bufio.NewReaderSize` による I/O
// * `positions` を `[2]int` で表現し、型安全かつ効率的に処理
// * Grundy 数の計算は定数時間なので、全体の計算量は `O(N)`

// ---

// ご希望があれば、テスト入力・ユニットテスト形式、またはエラーハンドリング追加版も提供できます。お気軽にお申し付けください。
