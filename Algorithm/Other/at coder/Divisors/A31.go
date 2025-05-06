package main

import (
	"bufio"
	"fmt"
	"math/big"
	"os"
	"strings"
)

func main() {
	// 標準入力を取得
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	line := strings.TrimSpace(scanner.Text())

	// N を任意精度整数として扱う
	N := new(big.Int)
	N.SetString(line, 10)

	// 任意精度整数用の除算関数
	div := func(n *big.Int, d int64) *big.Int {
		denom := big.NewInt(d)
		return new(big.Int).Div(n, denom)
	}

	// 3, 5, 15で割り切れる数を数える（包除原理）
	count3 := div(N, 3)
	count5 := div(N, 5)
	count15 := div(N, 15)

	result := new(big.Int).Add(count3, count5)
	result.Sub(result, count15)

	// 出力
	fmt.Println(result.String())
}
