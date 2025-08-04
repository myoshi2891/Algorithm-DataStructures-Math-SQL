// 以下は、Go 1.20.6 に対応した解法です。**処理時間・メモリの効率を重視**し、**インデックスベースの行マッピング**によって `O(1)` でクエリを処理します。

// ---

// ## ✅ 解法の概要（Go版）

// * グリッドの実体は変更せず、`rowMap[i] = j` により「論理行 i は物理行 j に対応」と記録。
// * 交換はインデックス交換のみ。
// * クエリ処理全体は `O(Q)` 時間、`O(N² + Q)` 空間で完了。

// ---

// ## ✅ Goコード（型明示・関数ベース）

// ```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

// processGridOperations はグリッド操作クエリを処理し、取得操作の結果を返す。
// n: グリッドサイズ
// grid: 初期グリッド (n x n)
// queries: クエリ [type, x, y]
// 戻り値: 取得操作 (type==2) の出力結果スライス
func processGridOperations(n int, grid [][]int, queries [][]int) []int {
	rowMap := make([]int, n)
	for i := 0; i < n; i++ {
		rowMap[i] = i
	}

	var results []int
	for _, query := range queries {
		t, x, y := query[0], query[1]-1, query[2]-1
		if t == 1 {
			// 行交換
			rowMap[x], rowMap[y] = rowMap[y], rowMap[x]
		} else if t == 2 {
			// 値取得
			results = append(results, grid[rowMap[x]][y])
		}
	}
	return results
}

func main() {
	reader := bufio.NewReaderSize(os.Stdin, 1<<20)
	scanner := bufio.NewScanner(reader)
	scanner.Split(bufio.ScanLines)

	// 数字トークンを読み取る関数
	readInts := func() []int {
		scanner.Scan()
		fields := strings.Fields(scanner.Text())
		ints := make([]int, len(fields))
		for i, s := range fields {
			ints[i], _ = strconv.Atoi(s)
		}
		return ints
	}

	// 入力処理
	scanner.Scan()
	n, _ := strconv.Atoi(scanner.Text())
	grid := make([][]int, n)
	for i := 0; i < n; i++ {
		grid[i] = readInts()
	}

	scanner.Scan()
	q, _ := strconv.Atoi(scanner.Text())
	queries := make([][]int, q)
	for i := 0; i < q; i++ {
		queries[i] = readInts()
	}

	// クエリ処理
	results := processGridOperations(n, grid, queries)

	// 結果出力
	for _, val := range results {
		fmt.Println(val)
	}
}
// ```

// ---

// ## ✅ 入力例（例: input.txt）

// ```
// 3
// 1 2 3
// 4 5 6
// 7 8 9
// 7
// 2 2 1
// 1 1 2
// 2 2 1
// 2 1 3
// 1 2 3
// 2 2 3
// 2 3 2
// ```

// ### 実行

// ```bash
// go run main.go < input.txt
// ```

// ### 出力

// ```
// 4
// 1
// 6
// 9
// 2
// ```

// ---

// ## ✅ 型と構造の説明

// | 項目        | 型         | 説明                 |
// | --------- | --------- | ------------------ |
// | `grid`    | `[][]int` | `n x n` の整数グリッド    |
// | `rowMap`  | `[]int`   | 各論理行に対応する実体行インデックス |
// | `queries` | `[][]int` | 各クエリ：長さ3のスライス      |
// | `results` | `[]int`   | 取得結果リスト            |

// ---

// ## ✅ 処理性能とメモリ

// | 項目     | 計算量          | 最大値（制約）      |
// | ------ | ------------ | ------------ |
// | 入力読み込み | `O(N^2 + Q)` | N≤500, Q≤2e5 |
// | 各クエリ処理 | `O(1)` / 件   | 合計 O(Q)      |
// | メモリ使用  | ≈ 0.5〜1MB    | 安全に収まる       |

// * Goでは `[]int` や `[][]int` のアロケーションも効率的に行われるため、500×500 配列 + インデックスでもメモリ上は余裕です。

// ---

// ## ✅ まとめ

// * `grid` を変更せず、**rowMap による高速インデックス管理**で全操作を `O(1)` で処理。
// * 型はすべて明示されており、Goらしく効率的な処理設計。
// * 大規模入力にも対応可能（処理時間・メモリともに安全範囲内）。

// ---

// ご希望があれば、パフォーマンス測定や `map` 使用・ジェネリクス対応なども可能です。
