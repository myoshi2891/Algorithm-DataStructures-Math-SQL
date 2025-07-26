// 以下は、**Go 1.20.6** に対応した `X=2, Y=3` 固定の Nim型取り石ゲームにおける
// **正確・高速・メモリ効率良好** な解法です。

// ---

// ## ✅ 解法方針

// * `X=2`, `Y=3` の場合、Grundy数は **mod 5 で周期性**がある。
// * 各山の石数 $A_i$ に対し、Grundy数 $G(A_i) = grundy[A_i \mod 5]$ を求め、XOR を取る。
// * XOR 和が `0` → **後手勝利（"Second"）**
//   XOR 和が `≠0` → **先手勝利（"First"）**

// ---

// ## ✅ Goコード（コメント付き、型注釈、処理時間・メモリ考慮）

// ```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
)

// determineWinner 判定関数：取り石ゲームの勝者を返す
//
// 引数:
//   A []int64 : 各山の石の個数
//
// 戻り値:
//   string : "First" または "Second"
//
// 計算量:
//   時間計算量: O(N)
//   空間計算量: O(1)（Grundyテーブルのみ使用）
func determineWinner(A []int64) string {
	// Grundy数: X=2, Y=3 のとき周期5で以下の通り
	grundyMod := [5]int{0, 0, 1, 1, 2}

	xorSum := 0
	for _, a := range A {
		g := grundyMod[a%5]
		xorSum ^= g
	}

	if xorSum == 0 {
		return "Second"
	}
	return "First"
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Split(bufio.ScanWords)

	// readInt reads the next token and converts it to int
	readInt := func() int {
		scanner.Scan()
		v, _ := strconv.Atoi(scanner.Text())
		return v
	}

	// readInt64 reads the next token and converts it to int64
	readInt64 := func() int64 {
		scanner.Scan()
		v, _ := strconv.ParseInt(scanner.Text(), 10, 64)
		return v
	}

	N := readInt() // number of mountains
	_ = readInt()  // X (unused, fixed = 2)
	_ = readInt()  // Y (unused, fixed = 3)

	A := make([]int64, N)
	for i := 0; i < N; i++ {
		A[i] = readInt64()
	}

	result := determineWinner(A)
	fmt.Println(result)
}

// ## ✅ 処理例（標準入力）

// ```
// 2 2 3
// 5 8
// ```

// → 出力

// ```
// First
// ```

// ---

// ## ✅ Grundy数とXORの仕組み（図解）

// | A\[i] | A\[i] % 5 | Grundy\[A\[i] % 5] |
// | ----- | --------- | ------------------ |
// | 5     | 0         | 0                  |
// | 8     | 3         | 1                  |

// XOR: `0 ^ 1 = 1` → 非0 → **"First"**

// ---

// ## ✅ 時間・空間効率まとめ

// | 指標    | 内容                  |
// | ----- | ------------------- |
// | 時間計算量 | O(N)                |
// | 空間計算量 | O(1)（配列 + 定数）       |
// | 最大N   | 100,000（問題制約）       |
// | Ai最大  | 10^18（int64で安全に扱える） |

// ---

// ## ✅ 使用した言語仕様

// * `bufio.Scanner`：高速な標準入力処理
// * `strconv.ParseInt`：10^18 に対応するために `int64` を使用
// * `make([]int64, N)`：O(N) 入力配列

// ---

// ## ✅ 拡張可能な点

// * 任意の `X, Y` に対して Grundy数の `mex()` を動的に計算する汎用化
// * 動的メモ化（`map[int64]int`）で周期発見の自動化
// * テストファイルの標準入力対応

// ---

// 必要であれば：

// * テスト用入力ファイルの作成コード
// * 任意 `X`, `Y` に対応する汎用Nim解法
//   などもお手伝いできます！
