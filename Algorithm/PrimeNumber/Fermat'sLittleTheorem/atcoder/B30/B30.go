// 以下は、**Go 1.20.6** による格子経路数の計算（`H×W` グリッド上を右と下にだけ移動）を行う実装です。
// 計算には組み合わせ公式 `C(H + W - 2, H - 1)` を使用し、**前計算 + フェルマーの小定理による逆元計算**で高速化しています。

// ---

// ## ✅ 実装概要

// * モジュロ：`MOD = 1_000_000_007`
// * 目的：`C(H + W - 2, H - 1) % MOD`
// * 技術：

//   * 高速累乗（繰り返し二乗法）
//   * フェルマーの小定理で逆元を計算
//   * `n!`, `(n!)^-1` の配列を前計算

// ---

// ## ✅ Goコード（型明示・関数分離・効率重視）

// ```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

const MOD int64 = 1_000_000_007
const MAX int = 200000 // H + W の最大値に余裕を持たせる

var fact = make([]int64, MAX+1)
var invFact = make([]int64, MAX+1)

/**
 * powMod は base^exp を MOD で割った値を返す
 * @param base int64 底
 * @param exp int64 指数
 * @return int64 base^exp % MOD
 */
func powMod(base, exp int64) int64 {
	result := int64(1)
	base %= MOD
	for exp > 0 {
		if exp%2 == 1 {
			result = (result * base) % MOD
		}
		base = (base * base) % MOD
		exp >>= 1
	}
	return result
}

/**
 * precomputeFactorials は fact[], invFact[] を前計算する
 */
func precomputeFactorials() {
	fact[0] = 1
	for i := 1; i <= MAX; i++ {
		fact[i] = fact[i-1] * int64(i) % MOD
	}
	invFact[MAX] = powMod(fact[MAX], MOD-2)
	for i := MAX - 1; i >= 0; i-- {
		invFact[i] = invFact[i+1] * int64(i+1) % MOD
	}
}

/**
 * combination は nCr (mod MOD) を返す
 * @param n int
 * @param r int
 * @return int64 組み合わせ値
 */
func combination(n, r int) int64 {
	if r < 0 || r > n {
		return 0
	}
	return fact[n] * invFact[r] % MOD * invFact[n-r] % MOD
}

/**
 * countGridPaths はグリッドの経路数を返す
 * @param H int 行数
 * @param W int 列数
 * @return int64 経路数（mod MOD）
 */
func countGridPaths(H, W int) int64 {
	precomputeFactorials()
	return combination(H+W-2, H-1)
}

/**
 * main は標準入力から H, W を読み取り、経路数を出力する
 */
func main() {
	reader := bufio.NewReader(os.Stdin)
	line, _ := reader.ReadString('\n')
	tokens := strings.Fields(line)

	H, _ := strconv.Atoi(tokens[0])
	W, _ := strconv.Atoi(tokens[1])

	result := countGridPaths(H, W)
	fmt.Println(result)
}
// ```

// ---

// ## ✅ 入力例と出力例

// ### 入力:

// ```
// 869 120
// ```

// ### 出力:

// ```
// 223713395
// ```

// ---

// ## 🧠 実行性能

// | 項目     | 内容                                      |
// | ------ | --------------------------------------- |
// | 時間計算量  | `O(MAX)`（前計算）＋`O(1)`（本計算）               |
// | メモリ使用量 | 約 3.2MB（`int64` × 2 × 200001）           |
// | 入力取得   | `bufio.Reader` + `strings.Fields` 使用で高速 |

// ---

// ## ✅ 各関数の責務まとめ

// | 関数名                    | 内容（役割）                      |
// | ---------------------- | --------------------------- |
// | `powMod`               | a^b mod MOD を高速に計算（繰り返し二乗法） |
// | `precomputeFactorials` | `n!` と `逆元` を事前計算           |
// | `combination`          | `nCr % MOD` を返す             |
// | `countGridPaths`       | `C(H+W-2, H-1)` を計算         |
// | `main`                 | 入力を読み取り、結果を出力               |

// ---

// ## ✅ Go版のコンパイル・実行方法

// ```bash
// go run main.go < input.txt
// ```

// ---

// ご希望があれば：

// * 再帰＋メモ化を使ったDP版
// * 小さなサイズ向けの動的計画法版

// なども提供可能です。
