package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
)

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func main() {
	sc := bufio.NewScanner(os.Stdin)
	sc.Split(bufio.ScanLines)

	sc.Scan()
	var H, W, K int
	fmt.Sscanf(sc.Text(), "%d %d %d", &H, &W, &K)

	grid := make([][]rune, H)
	for i := 0; i < H; i++ {
		sc.Scan()
		row := []rune(sc.Text())
		grid[i] = row
	}

	maxBlack := 0

	// 全ての行選択パターンをビット列で列挙
	for bit := 0; bit < (1 << H); bit++ {
		paintedRows := []int{}
		for i := 0; i < H; i++ {
			if (bit>>i)&1 == 1 {
				paintedRows = append(paintedRows, i)
			}
		}

		if len(paintedRows) > K {
			continue
		}

		// gridのコピー（deep copy）
		painted := make([][]rune, H)
		for i := 0; i < H; i++ {
			painted[i] = make([]rune, W)
			copy(painted[i], grid[i])
		}

		// 選んだ行を黒く塗る
		for _, row := range paintedRows {
			for j := 0; j < W; j++ {
				painted[row][j] = '#'
			}
		}

		// 各列の黒マス数を数える
		blackCount := make([]int, W)
		for j := 0; j < W; j++ {
			for i := 0; i < H; i++ {
				if painted[i][j] == '#' {
					blackCount[j]++
				}
			}
		}

		// gain を計算（白マスの多い列を貪欲に選ぶ）
		type gainCol struct {
			gain int
			col  int
		}
		gains := []gainCol{}
		for j := 0; j < W; j++ {
			gains = append(gains, gainCol{H - blackCount[j], j})
		}
		sort.Slice(gains, func(i, j int) bool {
			return gains[i].gain > gains[j].gain
		})

		// 残りの K - 行数 だけ列を塗る
		columnsToPaint := make(map[int]bool)
		remain := K - len(paintedRows)
		for i := 0; i < remain && i < len(gains); i++ {
			columnsToPaint[gains[i].col] = true
		}

		// 黒マスの総数を数える
		total := 0
		for i := 0; i < H; i++ {
			for j := 0; j < W; j++ {
				if painted[i][j] == '#' || columnsToPaint[j] {
					total++
				}
			}
		}

		maxBlack = max(maxBlack, total)
	}

	fmt.Println(maxBlack)
}
