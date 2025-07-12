// ありがとうございます。Go実装で以下のようなエラーが出た場合：

// ```
// # atcoder.jp/golang
// ./main.go:38:10: st declared and not used
// ```

// これは **Goでは変数を使わないとコンパイルエラーになる** というルールによるものです。

// ---

// ## ✅ 問題のある該当行：

// ```go
// for s, st := range dp {
//     newSum := s + A[i]
//     ...
// }
// ```

// ここで `st` を宣言しておきながら使用していないため、Goのコンパイラが怒ります。

// ---

// ## ✅ 修正方法：`_`（ブランク識別子）で未使用変数を明示

// ```go
// for s := range dp {
//     newSum := s + A[i]
//     ...
// }
// ```

// または、`st` を実際に使うようにしてもOKです（ここでは使っていないので削除でOK）。

// ---

// ## ✅ 修正済みの完全版コード（Go 1.20.6対応）

// ```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

// 経路復元のための構造体
type State struct {
	idx  int // 使用したカードのインデックス
	prev int // そのときの前の合計値
}

// main関数：標準入力を読み取り、部分和の存在判定と経路出力を行う
func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	header := strings.Split(scanner.Text(), " ")
	N, _ := strconv.Atoi(header[0])
	S, _ := strconv.Atoi(header[1])

	scanner.Scan()
	parts := strings.Split(scanner.Text(), " ")
	A := make([]int, N)
	for i := 0; i < N; i++ {
		A[i], _ = strconv.Atoi(parts[i])
	}

	// dp[sum] = State：sumを作るのにどのカードを使ったかとその前のsumを記録
	dp := make(map[int]State)
	dp[0] = State{-1, -1} // 0は何も使わずに作れる

	for i := 0; i < N; i++ {
		nextDP := make(map[int]State)
		for s := range dp { // ✅ 未使用変数stを削除
			newSum := s + A[i]
			if newSum <= S {
				if _, exists := dp[newSum]; !exists {
					nextDP[newSum] = State{i, s}
				}
			}
		}
		for k, v := range nextDP {
			dp[k] = v
		}
	}

	if _, ok := dp[S]; !ok {
		fmt.Println(-1)
		return
	}

	// 経路復元
	res := []int{}
	curr := S
	for curr != 0 {
		state := dp[curr]
		res = append(res, state.idx+1) // 1-indexed
		curr = state.prev
	}

	// 逆順にして出力
	for i, j := 0, len(res)-1; i < j; i, j = i+1, j-1 {
		res[i], res[j] = res[j], res[i]
	}

	fmt.Println(len(res))
	for i, v := range res {
		if i > 0 {
			fmt.Print(" ")
		}
		fmt.Print(v)
	}
	fmt.Println()
}
// ```

// ---

// ## ✅ 補足

// * Goは非常に厳格で、「未使用変数があるだけでビルドエラー」になります。
// * 使わない場合は `_` を使う、または削除が必要です。

// ---

// ✅ 解法の特徴
// 動的計画法（DP）で到達可能な合計を管理

// 経路復元のために map[int]struct{idx, prev int} を使用

// スパースDPにより、時間・空間効率を改善

// ✅ 処理時間・メモリ消費量
// 項目	説明
// 時間計算量	O(N * S) 最大 60×10000 = 600,000
// 空間計算量	O(S)（dp は map[int]State として管理）
// 最大メモリ目安	8バイト × S程度 + mapのオーバーヘッド
// Goバージョン	Go 1.20.6（型推論 + map使用）

// ✅ 補足：型の明示
// dp は map[int]State 型で、各合計値に対して使ったカードとその直前の合計を記録

// State 構造体で経路復元を正確に可能にしています

