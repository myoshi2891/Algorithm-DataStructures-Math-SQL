// 以下は、**Go (1.20.6)** を用いた `1 以上 N 以下の整数のうち、3, 5, 7 のいずれかで割り切れる数の個数` を求める実装です。

// ---

// ## ✅ 解法：包除原理（Inclusion-Exclusion）

// 次の式により、重複を避けた個数を高速に計算できます：

// ```text
// |A ∪ B ∪ C| = |A| + |B| + |C| - |A ∩ B| - |A ∩ C| - |B ∩ C| + |A ∩ B ∩ C|
// ```

// ---

// ## ✅ Go 実装（型・処理時間・メモリを意識）

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
	countMultiplesOf3or5or7 は、N 以下の整数のうち、
	3, 5, 7 のいずれかで割り切れる数の個数を返します。

	@param N *big.Int : 任意精度の整数 N (1 ≤ N ≤ 10^12)
	@return *big.Int : 条件を満たす個数（任意精度整数）
*/
func countMultiplesOf3or5or7(N *big.Int) *big.Int {
	// 補助関数: floor(N / x)
	div := func(x int64) *big.Int {
		return new(big.Int).Div(N, big.NewInt(x))
	}

	// 各項を計算（包除原理）
	a := div(3)
	b := div(5)
	c := div(7)

	ab := div(3 * 5)
	ac := div(3 * 7)
	bc := div(5 * 7)

	abc := div(3 * 5 * 7)

	// A + B + C - AB - AC - BC + ABC
	result := new(big.Int).Add(a, b)
	result.Add(result, c)
	result.Sub(result, ab)
	result.Sub(result, ac)
	result.Sub(result, bc)
	result.Add(result, abc)

	return result
}

func main() {
	reader := bufio.NewReader(os.Stdin)
	line, _ := reader.ReadString('\n')
	line = strings.TrimSpace(line)

	N := new(big.Int)
	N.SetString(line, 10) // 入力を任意精度整数に変換

	result := countMultiplesOf3or5or7(N)
	fmt.Println(result.String())
}

// ## ✅ 入出力例

// ```txt
// 入力:
// 210

// 出力:
// 114
// ```

// ---

// ## ✅ 実行方法

// ファイル名を `main.go` として保存し、以下のコマンドで実行できます。

// ```bash
// go run main.go < input.txt
// ```

// ---

// ## ✅ 処理時間・メモリ使用量（想定）

// | 指標     | 内容                             |
// | ------ | ------------------------------ |
// | 時間計算量  | O(1)（定数回の除算 + 加減算のみ）           |
// | 実行時間目安 | 約 0.05ms ～ 0.2ms（N の大きさに無関係）   |
// | メモリ消費  | 数個の `*big.Int` のみ（≒ 数 KB 未満）   |
// | 精度・安全性 | `math/big` により最大 `10^1000` でも可 |

// ---

// ## ✅ コメント

// * Go の `int64` 型は `10^12` まで対応できますが、整数の積（105）との除算時に桁あふれを避けるため、安全策として `math/big.Int` による任意精度処理を採用しています。
// * もし `N <= 10^18` を保証できる環境で高速化したい場合は、`int64` ベースの処理に書き換えも可能です。

// ---

// ご希望に応じて、**`int64` ベース版・ループ版・テスト付きのGoコード**も提供可能です。
