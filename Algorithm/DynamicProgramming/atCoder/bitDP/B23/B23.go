// 以下は、**Go 1.20.6** を用いた巡回セールスマン問題（TSP）の解法です。
// ビットDPを用いて、全都市を一度ずつ訪問し出発地点に戻る最短距離を求めます。

// ---

// ## ✅ Go実装（main.go）

// ```go
package main

import (
	"bufio"
	"fmt"
	"math"
	"os"
	"strconv"
	"strings"
)

// Point 座標を表す構造体
type Point struct {
	x int
	y int
}

// computeDistances は各都市間のユークリッド距離を前計算して返します。
//
// 引数:
//   coords []Point: 都市の座標
//
// 戻り値:
//   [][]float64: dist[i][j] := 都市iから都市jへの距離
func computeDistances(coords []Point) [][]float64 {
	N := len(coords)
	dist := make([][]float64, N)
	for i := 0; i < N; i++ {
		dist[i] = make([]float64, N)
		for j := 0; j < N; j++ {
			dx := float64(coords[i].x - coords[j].x)
			dy := float64(coords[i].y - coords[j].y)
			dist[i][j] = math.Hypot(dx, dy)
		}
	}
	return dist
}

// solveTSP はビットDPを使って巡回セールスマン問題の最短距離を返します。
//
// 引数:
//   N int: 都市の数 (2 <= N <= 15)
//   coords []Point: 都市の座標
//
// 戻り値:
//   float64: 最短経路の長さ（誤差1e-3未満）
func solveTSP(N int, coords []Point) float64 {
	const INF = 1e18
	dist := computeDistances(coords)

	dp := make([][]float64, 1<<N)
	for i := range dp {
		dp[i] = make([]float64, N)
		for j := range dp[i] {
			dp[i][j] = INF
		}
	}
	dp[1][0] = 0.0 // 都市0のみ訪問している状態

	for s := 1; s < (1 << N); s++ {
		for u := 0; u < N; u++ {
			if (s>>u)&1 == 0 {
				continue
			}
			for v := 0; v < N; v++ {
				if (s>>v)&1 != 0 {
					continue
				}
				ns := s | (1 << v)
				if dp[ns][v] > dp[s][u]+dist[u][v] {
					dp[ns][v] = dp[s][u] + dist[u][v]
				}
			}
		}
	}

	// 全都市訪問後、都市0へ戻る
	res := INF
	full := (1 << N) - 1
	for u := 1; u < N; u++ {
		if cost := dp[full][u] + dist[u][0]; cost < res {
			res = cost
		}
	}
	return res
}

// main は標準入力を読み取り、TSPの最短距離を出力します。
func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	N, _ := strconv.Atoi(scanner.Text())

	coords := make([]Point, N)
	for i := 0; i < N; i++ {
		scanner.Scan()
		fields := strings.Fields(scanner.Text())
		x, _ := strconv.Atoi(fields[0])
		y, _ := strconv.Atoi(fields[1])
		coords[i] = Point{x, y}
	}

	result := solveTSP(N, coords)
	fmt.Printf("%.12f\n", result)
}

// ## ✅ 実行方法

// ```bash
// go run main.go < input.txt
// ```

// ### 入力例（input.txt）:

// ```
// 4
// 0 0
// 0 1
// 1 0
// 1 1
// ```

// ### 出力:

// ```
// 4.000000000000
// ```

// ---

// ## 📊 処理量とメモリの見積もり

// | 指標       | 値                               |
// | -------- | ------------------------------- |
// | 時間計算量    | `O(N^2 * 2^N)`（N=15で約50万回）      |
// | 空間使用量    | 約 `N * 2^N * 8 Byte` ≒ 最大 4 MiB |
// | 浮動小数誤差対策 | `math.Hypot` と `%.12f` で安全な出力   |

// ---

// ## ✅ この実装の特徴

// * `math.Hypot(dx, dy)` による安全で精度の高い距離計算
// * `[]float64` による省メモリなDPテーブル
// * 都市数 N=15 まで十分高速に対応
// * 誤差 1e-3 未満の出力精度を保証（`fmt.Printf("%.12f")`）

// ---
