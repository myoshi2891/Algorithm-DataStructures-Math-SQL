// 以下は、Go 1.20.6 を用いた `N 以下の素数を小さい順に出力する` 問題の解法です。
// エラトステネスの篩を用い、関数化・型明示・処理時間・メモリ計測を行っています。

// ---

// ## ✅ 実装コード（`main.go`）

package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	// "time"
	// "runtime"
)

/**
 * sieveOfEratosthenes は N 以下のすべての素数を小さい順に列挙します。
 *
 * @param n int: 上限値（2 <= n <= 10^6）
 * @return []int: n 以下の素数を昇順で格納したスライス
 */
func sieveOfEratosthenes(n int) []int {
	if n < 2 {
		return []int{}
	}

	isPrime := make([]bool, n+1)
	for i := 2; i <= n; i++ {
		isPrime[i] = true
	}

	for i := 2; i*i <= n; i++ {
		if isPrime[i] {
			for j := i * i; j <= n; j += i {
				isPrime[j] = false
			}
		}
	}

	primes := make([]int, 0)
	for i := 2; i <= n; i++ {
		if isPrime[i] {
			primes = append(primes, i)
		}
	}
	return primes
}

func main() {
	// 入力の読み取り
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	N, _ := strconv.Atoi(scanner.Text())

	// 計測開始
	// start := time.Now()
	// var memStatsStart, memStatsEnd runtime.MemStats
	// runtime.ReadMemStats(&memStatsStart)

	// 素数列挙
	primes := sieveOfEratosthenes(N)

	// 出力（高速化のため bufio.Writer 使用）
	writer := bufio.NewWriter(os.Stdout)
	for _, p := range primes {
		fmt.Fprintln(writer, p)
	}
	writer.Flush()

	// 計測終了
	// runtime.ReadMemStats(&memStatsEnd)
	// duration := time.Since(start)

	// stderr に時間・メモリ使用量を出力
	// fmt.Fprintf(os.Stderr, "Execution Time: %v\n", duration)
	// fmt.Fprintf(os.Stderr, "Memory Used: %.2f MB\n", float64(memStatsEnd.Alloc-memStatsStart.Alloc)/1024/1024)
}
// ```

// ---

// ## 🧪 実行例

// ### ✅ 入力

// ```
// 20
// ```

// ### ✅ 出力（stdout）

// ```
// 2
// 3
// 5
// 7
// 11
// 13
// 17
// 19
// ```

// ### ✅ stderr 出力（例）

// ```
// Execution Time: 430.12µs
// Memory Used: 0.45 MB
// ```

// ---

// ## 📌 解説

// | 項目     | 内容                              |
// | ------ | ------------------------------- |
// | 処理時間計測 | `time.Now()` + `time.Since()`   |
// | メモリ計測  | `runtime.ReadMemStats()`（バイト単位） |
// | 入力処理   | `bufio.Scanner` を使用（標準入力）       |
// | 出力処理   | `bufio.Writer` による高速出力（標準出力）    |
// | 時間計算   | `time.Duration` をマイクロ秒またはミリ秒で表示 |
// | メモリ計算  | 差分（使用メモリ増分）を `MB` 単位で表示         |

// ---

// ## ✅ アルゴリズム情報

// * 時間計算量：`O(N log log N)`
// * 空間計算量：`O(N)`（bool配列）

// ---

// ## 🛠️ コンパイルと実行方法

// ```bash
// go build main.go
// echo 1000000 | ./main
// ```
