// では Go (1.20.6) で **ダブリング法** を使った高速解法を書きます。
// 配列は `[]uint32` を使ってメモリ効率を上げ、不要なオブジェクト生成を避けます。

// ---

// ```go
// Go 1.20.6
// 実行時間制限: 4 sec / メモリ制限: 1024 MiB
// 入力: N K
// 出力: 各 i (1 <= i <= N) に対し、K 回の操作後の値

package main

import (
	"bufio"
	"fmt"
	"os"
)

/*
sumDigits は整数 x の桁和を計算する関数
@param x int - 計算対象の整数
@return int - 桁和
*/
func sumDigits(x int) int {
	s := 0
	for x > 0 {
		s += x % 10
		x /= 10
	}
	return s
}

/*
solve は各整数 1..N に対し K 回操作後の値を求める
@param N int     - 最大の整数
@param K uint64  - 操作回数 (1 <= K <= 1e9)
@return []uint32 - 各整数の最終値
*/
func solve(N int, K uint64) []uint32 {
	// 1ステップ先を格納する配列
	next := make([]uint32, N+1)
	for i := 1; i <= N; i++ {
		next[i] = uint32(i - sumDigits(i))
	}

	// ダブリングテーブル構築
	const LOG = 32 // K<=1e9 なので log2(K)≈30、余裕を持たせて32
	jump := make([][]uint32, LOG)
	for p := range jump {
		jump[p] = make([]uint32, N+1)
	}
	copy(jump[0], next)
	for p := 1; p < LOG; p++ {
		prev := jump[p-1]
		cur := jump[p]
		for i := 1; i <= N; i++ {
			cur[i] = prev[prev[i]]
		}
	}

	// 各 i について K ステップ先を計算
	res := make([]uint32, N)
	for i := 1; i <= N; i++ {
		cur := uint32(i)
		steps := K
		bit := 0
		for steps > 0 {
			if steps&1 == 1 {
				cur = jump[bit][cur]
			}
			steps >>= 1
			bit++
		}
		res[i-1] = cur
	}

	return res
}

func main() {
	in := bufio.NewReaderSize(os.Stdin, 1<<20)
	out := bufio.NewWriterSize(os.Stdout, 1<<20)
	defer out.Flush()

	var N int
	var K uint64
	fmt.Fscan(in, &N, &K)

	res := solve(N, K)

	for _, v := range res {
		fmt.Fprintln(out, v)
	}
}
// ```

// ---

// ## **処理時間・メモリ見積もり**

// * **時間計算量**

//   * next 配列構築: $O(N \cdot d)$（dは桁数、最大6）
//   * ダブリング: $O(N \log K)$ ≈ $3\times 10^5 \times 30 \approx 9\times 10^6$ ステップ
//   * 各 i の計算: $O(N \log K)$
//     → Go でも 1 秒未満〜2 秒程度で収まる想定

// * **メモリ使用量**

//   * `next`: 約 1.2MB
//   * `jump`: 約 38MB
//   * `res`: 約 1.2MB
//     → 合計 約 40MB（1024MB 制限内）

// ---

// この Go 実装なら処理時間・メモリともに十分余裕があります。
// もし必要なら、**ジャンプ表を1本だけにしてメモリ削減版** も書けます。

// この後、メモリ削減版の Go 実装も作りますか？
