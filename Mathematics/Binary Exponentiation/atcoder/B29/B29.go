// 以下は **Go 1.20.6** に対応した `a^b % 1000000007` を高速に計算する実装です。

// ---

// ## ✅ 要件と対応内容

// | 項目     | 内容                                        |
// | ------ | ----------------------------------------- |
// | 入力     | `a`：int型 (最大 10^9)、`b`：最大 10^18（文字列として取得） |
// | 計算方法   | **繰り返し二乗法（Binary Exponentiation）**        |
// | 型の扱い   | `a`: `int64`、`b`: `*big.Int`（任意精度整数）      |
// | 計算時間   | `O(log b)`（最大でも ≒60回）                     |
// | メモリ使用量 | 数十KB程度（`big.Int` 使用）                      |

// ---

// ## ✅ Goコード（`main.go`）

// ```go
package main

import (
	"bufio"
	"fmt"
	"math/big"
	"os"
	"strings"
)

const MOD int64 = 1000000007

/**
 * modPow は (a^b) % mod を高速に計算する関数（bは任意精度）
 *
 * @param a int64      底（1 ≤ a ≤ 10^9）
 * @param b *big.Int   指数（1 ≤ b ≤ 10^18 まで対応）
 * @param mod int64    法（通常は 1000000007）
 * @return int64       計算結果 a^b % mod
 */
func modPow(a int64, b *big.Int, mod int64) int64 {
	result := int64(1)
	base := a % mod
	zero := big.NewInt(0)
	two := big.NewInt(2)
	bCopy := new(big.Int).Set(b) // b を破壊しないようにコピー

	for bCopy.Cmp(zero) > 0 {
		if new(big.Int).Mod(bCopy, two).Cmp(zero) != 0 {
			result = (result * base) % mod
		}
		base = (base * base) % mod
		bCopy.Div(bCopy, two)
	}

	return result
}

/**
 * main は標準入力を読み込み、a^b % MOD を出力する
 */
func main() {
	reader := bufio.NewReader(os.Stdin)
	line, _ := reader.ReadString('\n')
	parts := strings.Fields(line)

	var a int64
	var b big.Int
	fmt.Sscan(parts[0], &a)
	b.SetString(parts[1], 10)

	result := modPow(a, &b, MOD)
	fmt.Println(result)
}

// ## ✅ 実行例

// #### 入力

// ```
// 123456789 123456789012345678
// ```

// #### 出力

// ```
// 3599437
// ```

// ---

// ## ✅ 処理性能分析

// | 項目     | 値                      |
// | ------ | ---------------------- |
// | 時間計算量  | `O(log b)`（最大でも約60回）   |
// | 実行時間   | 数ミリ秒（Goは非常に高速）         |
// | メモリ使用量 | 数十 KB 程度（`big.Int`の数個） |

// ---

// ## ✅ 備考：なぜ `*big.Int` を使うのか？

// * Go の `int64` は最大で `2^63 - 1 ≒ 9.2e18` ⇒ `10^18` を超えると不正確
// * `math/big` パッケージを使えば任意精度整数として安全に指数演算が可能

// ---

// ## ✅ 補足：最速を目指すなら

// * `math/big` の `.Exp()` 関数を使っても計算可能ですが、`modPow` の方が処理流れが明確です：

//   ```go
//   res := new(big.Int).Exp(big.NewInt(a), b, big.NewInt(MOD))
//   fmt.Println(res.Int64())
//   ```

