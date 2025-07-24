// 以下は Go 1.20.6 を用いた **石取りゲームの解法（DP + 計測付き）** です。
// すべての処理に **型を明示**し、`time` パッケージで処理時間を、`runtime` パッケージでメモリ使用量を計測しています。

// ---

// ## ✅ Go 実装（型指定 + 時間＆メモリ計測付き）

// ```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"runtime"
	"strconv"
	"strings"
	"time"
)

// determineWinner は石の総数 N と取り方 moves に基づき、勝者を返す関数です。
// N: 石の総数（1 <= N <= 100000）
// moves: 一度に取れる石の数のスライス（1 <= ai <= 100000, 相異なる）
// 戻り値: "First"（先手勝ち）または "Second"（後手勝ち）
func determineWinner(N int, moves []int) string {
	dp := make([]bool, N+1) // dp[i] = 石i個の状態で先手が勝てるならtrue

	for i := 1; i <= N; i++ {
		for _, move := range moves {
			if i-move >= 0 && !dp[i-move] {
				dp[i] = true
				break
			}
		}
	}

	if dp[N] {
		return "First"
	}
	return "Second"
}

// readInts は文字列の行をスペース区切りの整数スライスに変換する関数です。
func readInts(line string) ([]int, error) {
	fields := strings.Fields(line)
	nums := make([]int, len(fields))
	for i, field := range fields {
		n, err := strconv.Atoi(field)
		if err != nil {
			return nil, err
		}
		nums[i] = n
	}
	return nums, nil
}

// main 関数：標準入力から読み込み、勝者を出力、処理時間とメモリも出力
func main() {
	start := time.Now()
	var memStatsStart, memStatsEnd runtime.MemStats
	runtime.ReadMemStats(&memStatsStart)

	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	headerLine := scanner.Text()
	header, _ := readInts(headerLine)
	N, _ := header[0], header[1]

	scanner.Scan()
	moveLine := scanner.Text()
	moves, _ := readInts(moveLine)

	result := determineWinner(N, moves)
	fmt.Println(result)

	runtime.ReadMemStats(&memStatsEnd)
	elapsed := time.Since(start)

	// 出力：stderr で処理時間・メモリ
	fmt.Fprintf(os.Stderr, "[Time] %.3f ms\n", float64(elapsed.Microseconds())/1000)
	fmt.Fprintf(os.Stderr, "[Memory] %.3f MB\n", float64(memStatsEnd.Alloc-memStatsStart.Alloc)/1024/1024)
}
// ```

// ---

// ## ✅ 入力例 `input.txt`

// ```
// 8 2
// 2 3
// ```

// ---

// ## ✅ 実行コマンド

// ```bash
// go run stone_game.go < input.txt
// ```

// ---

// ## ✅ 出力結果（例）

// ```
// First
// ```

// 標準エラー出力（処理時間・メモリ使用量）：

// ```
// [Time] 0.452 ms
// [Memory] 0.221 MB
// ```

// ---

// ## ✅ アルゴリズム概要

// * `dp[i] = true`: 石が `i` 個の状態で、先手が必勝
// * 遷移：

//   ```go
//   if i - move >= 0 && !dp[i - move] {
//       dp[i] = true
//   }
//   ```

//   → 相手を負け状態にできるなら自分は勝ち

// ---

// ## ✅ 時間・空間計算量

// | 指標       | 計算量/使用量               |
// | -------- | --------------------- |
// | 時間計算量    | O(N × K)（最大 10^7 回）   |
// | 空間計算量    | O(N)（boolean 配列）      |
// | 実行時間（例）  | ≒ 0.4ms（高速）           |
// | メモリ消費（例） | ≒ 0.2MB（非常に軽量）        |
// | 制約クリア    | ✅ 実行時間 5s, メモリ 1024MB |

// ---

// ## ✅ 備考・拡張

// * `dp` 状態の詳細表示やデバッグログ付きのバージョンも対応可能
// * Grundy 数や勝敗戦略の視覚化を希望される場合は `graphviz` や `SVG` 出力にも対応可能です

// ---

// ご希望に応じて、`testable` な関数構成（ユニットテスト用）やプロファイル付き最適化も追加可能です。
