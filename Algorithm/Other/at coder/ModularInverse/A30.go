package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

const MOD = 1000000007
const MAX = 100000

var fac [MAX + 1]int64
var invFac [MAX + 1]int64

func main() {
	precompute()

	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	line := scanner.Text()
	parts := strings.Fields(line)

	n, _ := strconv.Atoi(parts[0])
	r, _ := strconv.Atoi(parts[1])

	res := fac[n]
	res = res * invFac[r] % MOD
	res = res * invFac[n-r] % MOD

	fmt.Println(res)
}

// 前処理：階乗と逆元階乗の計算
func precompute() {
	fac[0] = 1
	for i := 1; i <= MAX; i++ {
		fac[i] = fac[i-1] * int64(i) % MOD
	}

	invFac[MAX] = modPow(fac[MAX], MOD-2)
	for i := MAX - 1; i >= 0; i-- {
		invFac[i] = invFac[i+1] * int64(i+1) % MOD
	}
}

// a^b % MOD を計算（繰り返し二乗法）
func modPow(a int64, b int) int64 {
	result := int64(1)
	a = a % MOD
	for b > 0 {
		if b%2 == 1 {
			result = result * a % MOD
		}
		a = a * a % MOD
		b /= 2
	}
	return result
}
