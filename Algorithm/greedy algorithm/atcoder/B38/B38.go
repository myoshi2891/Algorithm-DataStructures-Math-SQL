// 以下は、問題に対する **Go 1.20.6** での実装です。
// **処理時間（1秒以内）とメモリ使用量（1024MiB以内）** を意識し、効率的な **O(N)** アルゴリズムを採用しています。

// ---

// ## ✅ 解法概要（再掲）

// * 各草の初期高さを 1 に設定。
// * `'A'` に対して **左→右** に昇順制約を補正。
// * `'B'` に対して **右→左** に降順制約を補正。
// * 最終的な配列の合計が最小となる。

// ---

// ## ✅ Go実装（型明示・関数化・コメント付き）

// ```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	// "strings"
)

/*
computeMinimumTotalHeight は草の高さの最小合計を計算する関数です。

Parameters:
- n int: 草の本数 (1 <= n <= 3000)
- s string: 'A' または 'B' からなる長さ n-1 の文字列

Returns:
- int: 高さの合計の最小値
*/
func computeMinimumTotalHeight(n int, s string) int {
	height := make([]int, n)
	for i := range height {
		height[i] = 1 // 初期高さは全て1
	}

	// 左から 'A' 条件に従い補正
	for i := 0; i < n-1; i++ {
		if s[i] == 'A' && height[i] >= height[i+1] {
			height[i+1] = height[i] + 1
		}
	}

	// 右から 'B' 条件に従い補正
	for i := n - 2; i >= 0; i-- {
		if s[i] == 'B' && height[i] <= height[i+1] {
			height[i] = height[i+1] + 1
		}
	}

	// 合計計算
	total := 0
	for _, h := range height {
		total += h
	}
	return total
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	n, _ := strconv.Atoi(scanner.Text())

	scanner.Scan()
	s := scanner.Text()

	result := computeMinimumTotalHeight(n, s)
	fmt.Println(result)
}
// ```

// ---

// ## ✅ 入力例と実行方法

// ### 実行例：

// ```bash
// echo -e "7\nAABBBA" | go run main.go
// # 出力: 15
// ```

// または、ファイルで保存している場合：

// ```bash
// go run solve.go < input.txt
// ```

// ---

// ## ✅ 処理性能

// * **時間計算量:** `O(N)`（`n=3000` でも高速）
// * **空間計算量:** `O(N)`（高さスライスのみ）

// Goの速度と組み合わせて、問題の制限内（1 sec, 1024 MiB）で安定して動作します。

// ---

// ## ✅ 型と設計上の注意点

// * 関数 `computeMinimumTotalHeight` は引数・返り値の型を明示。
// * 入力の読み取りには `bufio.Scanner` を使用して **高速入力対応**。
// * 入力エラー処理は簡略化（本番環境では `err != nil` チェック推奨）。

// ---

// ご希望があれば以下も対応可能です：

// * 入力が全てAや全てBの特殊ケースでの検証
// * 単体テスト用の関数群追加
// * スライスの途中状態のデバッグ出力表示

// どうぞ気軽にお知らせください。
