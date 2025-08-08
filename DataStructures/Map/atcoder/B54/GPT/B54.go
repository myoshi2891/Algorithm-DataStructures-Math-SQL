// 以下は **Go 1.20.6** 向けの型明示・関数化した実装です。
// 処理は **O(N)**、メモリは異なる要素の数だけ保持するため **O(U)**（U はユニーク値数）です。

// ---

// ```go
// Go 1.20.6
// 処理時間: O(N)
// メモリ使用量: O(U) (U は配列内の異なる値の数、最大で N)
package main

import (
	"bufio"
	"fmt"
	"os"
)

// countPairs は、1 ≤ j < i ≤ N かつ A_j = A_i を満たす (i, j) の組数を返します。
// N: 整数の個数
// arr: 整数スライス A1...AN
// 戻り値: 条件を満たす (i, j) の組数
func countPairs(N int, arr []int) int {
	freq := make(map[int]int) // 値 -> 出現回数
	count := 0

	for _, val := range arr {
		if c, exists := freq[val]; exists {
			// 過去の出現回数分だけ組が作れる
			count += c
			freq[val] = c + 1
		} else {
			freq[val] = 1
		}
	}
	return count
}

func main() {
	in := bufio.NewReader(os.Stdin)

	var N int
	fmt.Fscan(in, &N)

	arr := make([]int, N)
	for i := 0; i < N; i++ {
		fmt.Fscan(in, &arr[i])
	}

	result := countPairs(N, arr)
	fmt.Println(result)
}
// ```

// ---

// ### 実装のポイント

// 1. **型明示**

//    * `N int`, `arr []int`, 戻り値も `int` を明示
//    * `freq` は `map[int]int` 型
// 2. **時間計算量**

//    * 1回のスライス走査で組数を計算 → **O(N)**
//    * `map` の `exists` チェックと代入は平均 **O(1)**
// 3. **メモリ計算量**

//    * 最大で `map` に N エントリ（全要素が異なる場合）
//    * N=100,000 程度なら数MB程度の使用
