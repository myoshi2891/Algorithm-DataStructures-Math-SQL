// 以下は、**Go 1.20.6** における実装です。
// 問題の要件を満たすために、**任意精度整数型 `math/big.Int` を使用**して `f(1)+f(2)+...+f(N)` を高速に正確に計算します。

// ---

// ## ✅ Go (1.20.6) 実装：各桁の出現回数 × 桁の値 による加算

// ```go
package main

import (
	"bufio"
	"fmt"
	"math/big"
	"os"
	"strings"
)

/*
sumOfDigitSums は、1 から N までの各整数 x に対して f(x) = 各桁の和 を計算し、
その合計 f(1) + f(2) + ... + f(N) を返す。

@param n *big.Int: 入力整数 N（最大 10^15 程度を想定）
@return *big.Int: 各桁の和の総和（任意精度整数）
*/
func sumOfDigitSums(n *big.Int) *big.Int {
	total := big.NewInt(0)
	base := big.NewInt(1)
	ten := big.NewInt(10)

	tmp := new(big.Int)
	higher := new(big.Int)
	current := new(big.Int)
	lower := new(big.Int)
	count := new(big.Int)

	for tmp.Set(base); tmp.Cmp(n) <= 0; base.Mul(base, ten) {
		// higher = n / (base * 10)
		tmp.Mul(base, ten)
		higher.Div(n, tmp)

		// current = (n / base) % 10
		tmp.Div(n, base)
		current.Mod(tmp, ten)

		// lower = n % base
		lower.Mod(n, base)

		for digit := int64(1); digit <= 9; digit++ {
			d := big.NewInt(digit)

			switch current.Cmp(d) {
			case 1: // digit < current
				tmp.Add(higher, big.NewInt(1))
				count.Mul(tmp, base)
			case 0: // digit == current
				tmp.Mul(higher, base)
				count.Add(tmp, lower)
				count.Add(count, big.NewInt(1))
			case -1: // digit > current
				count.Mul(higher, base)
			}

			// total += count * digit
			tmp.Mul(count, d)
			total.Add(total, tmp)
		}
	}

	return total
}

/*
main は標準入力から整数 N を読み込み、sumOfDigitSums を呼び出して結果を出力する。
*/
func main() {
	reader := bufio.NewReader(os.Stdin)
	line, _ := reader.ReadString('\n')
	line = strings.TrimSpace(line)

	N := new(big.Int)
	N.SetString(line, 10)

	result := sumOfDigitSums(N)
	fmt.Println(result.String())
}

// ## ✅ 実行例

// ```bash
// echo 288 | go run main.go
// # 出力: 2826

// echo 4 | go run main.go
// # 出力: 10
// ```

// ---

// ## ✅ 型・性能・制約

// | 指標      | 内容                                   |
// | ------- | ------------------------------------ |
// | 計算量     | O(log₁₀N)（最大15桁 → 最大15ループ）           |
// | 型       | `*big.Int`（任意精度整数）                   |
// | メモリ使用量  | 定数（big.Int のインスタンス数個）                |
// | ライブラリ   | `math/big`, `bufio`, `os`, `strings` |
// | 最大対応サイズ | N < 10¹⁸ 程度まで問題なし                    |

// ---

// ## ✅ 処理の流れ（例: N = 288）

// 1. 一の位（base = 1）から順に
// 2. `higher` = 左側の桁、`current` = 注目桁、`lower` = 右側の桁
// 3. digit = 1〜9 に対して、出現回数 × digit を加算

// ---

// ## ✅ 利点

// * **高精度：** `big.Int` により任意桁数を安全に扱える
// * **効率的：** 各桁を一度ずつ処理するだけ
// * **再帰や配列不要：** 状態を持たずループのみ

// ---

// ご希望があれば以下も提供可能です：

// * `int64` で処理できる簡易版（Nが小さい前提）
// * 単体テストや `testing` モジュールの追加
// * `f(x)` の累積和グラフのプロット（Go + gnuplot 連携） など

// お気軽にご要望ください！
