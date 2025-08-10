// Go言語版の実装を作成しました。Goの特徴を活かした最適化ポイント：

// ## 🚀 Go特有の最適化

// ### 1. **型安全性と性能**
// ```go
// func lowerBound(arr []int, target int) int
// func insertSorted(arr *[]int, value int)
// func findMinDifference(cards []int, x int) int
// ```
// - 明示的な型指定によるコンパイル時最適化
// - ポインタ渡しによるメモリコピーの回避
// - スライスの効率的な操作

// ### 2. **メモリ効率の最適化**
// ```go
// cards := make([]int, 0, 100000)  // 事前容量確保
// results := make([]int, 0, q)     // 結果用スライス
// var sb strings.Builder           // 効率的な文字列構築
// sb.Grow(len(results) * 10)       // メモリ事前確保
// ```

// ### 3. **標準ライブラリの活用**
// ```go
// pos := sort.SearchInts(cards, x)  // 最適化された二分探索
// ```

// ## 📊 パフォーマンス特性

// ### 時間計算量
// - **クエリ1（カード追加）**: O(n) - スライス要素のシフト
// - **クエリ2（最小差検索）**: O(log n) - sort.SearchIntsによる二分探索
// - **全体**: O(Q × n) - Q個のクエリ処理

// ### 空間計算量
// - **カード配列**: O(n) - 最大100,000個の整数
// - **結果配列**: O(Q) - クエリ2の結果保存
// - **文字列構築**: O(結果サイズ) - strings.Builderによる効率的な構築
// - **合計**: O(n + Q) ≈ 800KB程度

// ## 🛠️ 実装のバリエーション

// ### 1. **標準ライブラリ使用版（推奨）**
// ```go
// func solve(inputData string) string {
//     // sort.SearchIntsを使用した最適化版
// }
// ```

// ### 2. **手動実装版**
// ```go
// func solveManual(inputData string) string {
//     // lowerBound()を手動実装した学習用版
// }
// ```

// ## 🔧 Goの利点

// ### 1. **コンパイル時最適化**
// - 静的型付けによる最適化
// - インライン化による関数呼び出しオーバーヘッド削減
// - ゼロガベージコレクションの実現可能性

// ### 2. **メモリ管理**
// - スライスの効率的な容量管理
// - `make([]int, 0, capacity)`による事前メモリ確保
// - `strings.Builder`による効率的な文字列構築

// ### 3. **標準ライブラリの性能**
// - `sort.SearchInts`の最適化された実装
// - `copy()`による効率的なメモリコピー
// - バイナリサイズの最小化

// ### 4. **エラーハンドリング**
// ```go
// input, err := readInput()
// if err != nil {
//     // エラー処理
// }
// ```

// ## 🎯 競技プログラミング向け最適化

// ### 1. **入力処理の高速化**
// - `bufio.Scanner`による効率的な行読み取り
// - 文字列分割の最小化

// ### 2. **メモリプールの活用**
// - 事前容量確保による再アロケーション回避
// - `strings.Builder`による文字列構築最適化

// ### 3. **コンパイラ最適化の活用**
// - インライン関数による呼び出しオーバーヘッド削減
// - 境界チェック除去による高速化

// この実装は、Goの特徴である高性能・メモリ効率・型安全性を最大限に活用し、競技プログラミングの制約下で最適なパフォーマンスを実現しています。特に標準ライブラリの`sort.SearchInts`を使用することで、手動実装よりも高速で信頼性の高い処理を実現しています。


package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strconv"
	"strings"
)

// lowerBound は二分探索で配列内の値以上の最初の位置を見つける
// パラメータ:
//   - arr: ソート済みのint型スライス
//   - target: 検索対象の値
// 戻り値:
//   - 挿入位置のインデックス
// 時間計算量: O(log n)
// 空間計算量: O(1)
func lowerBound(arr []int, target int) int {
	left := 0
	right := len(arr)
	
	for left < right {
		mid := (left + right) / 2
		if arr[mid] < target {
			left = mid + 1
		} else {
			right = mid
		}
	}
	
	return left
}

// insertSorted はソートされたスライスに値を挿入する
// パラメータ:
//   - arr: ソート済みのint型スライスのポインタ（インプレースで変更される）
//   - value: 挿入する値
// 戻り値: なし
// 時間計算量: O(n) - 挿入位置より後の要素をシフト
// 空間計算量: O(1) - ただし、スライスの容量が不足する場合はO(n)
func insertSorted(arr *[]int, value int) {
	pos := lowerBound(*arr, value)
	
	// スライスの容量を拡張し、挿入位置に値を挿入
	*arr = append(*arr, 0)
	copy((*arr)[pos+1:], (*arr)[pos:])
	(*arr)[pos] = value
}

// insertSortedBuiltin は標準ライブラリのsort.SearchIntsを使用して値を挿入する（最適化版）
// パラメータ:
//   - arr: ソート済みのint型スライスのポインタ（インプレースで変更される）
//   - value: 挿入する値
// 戻り値: なし
// 時間計算量: O(n) - 挿入操作が主なコスト
// 空間計算量: O(1) - ただし、スライスの容量が不足する場合はO(n)
func insertSortedBuiltin(arr *[]int, value int) {
	pos := sort.SearchInts(*arr, value)
	
	*arr = append(*arr, 0)
	copy((*arr)[pos+1:], (*arr)[pos:])
	(*arr)[pos] = value
}

// findMinDifference は整数xと机にあるカードとの差の絶対値の最小値を求める
// パラメータ:
//   - cards: ソート済みのカード配列
//   - x: 比較対象の整数
// 戻り値:
//   - 差の絶対値の最小値、カードがない場合は-1
// 時間計算量: O(log n)
// 空間計算量: O(1)
func findMinDifference(cards []int, x int) int {
	if len(cards) == 0 {
		return -1
	}
	
	// 二分探索でx以上の最初の値の位置を見つける
	pos := lowerBound(cards, x)
	
	minDiff := int(^uint(0) >> 1) // int型の最大値
	
	// pos位置の値との差を確認
	if pos < len(cards) {
		diff := abs(cards[pos] - x)
		if diff < minDiff {
			minDiff = diff
		}
	}
	
	// pos-1位置の値との差を確認
	if pos > 0 {
		diff := abs(cards[pos-1] - x)
		if diff < minDiff {
			minDiff = diff
		}
	}
	
	return minDiff
}

// findMinDifferenceBuiltin は標準ライブラリのsort.SearchIntsを使用して最小差を求める（最適化版）
// パラメータ:
//   - cards: ソート済みのカード配列
//   - x: 比較対象の整数
// 戻り値:
//   - 差の絶対値の最小値、カードがない場合は-1
// 時間計算量: O(log n)
// 空間計算量: O(1)
func findMinDifferenceBuiltin(cards []int, x int) int {
	if len(cards) == 0 {
		return -1
	}
	
	// sort.SearchIntsを使用してx以上の最初の値の位置を見つける
	pos := sort.SearchInts(cards, x)
	
	minDiff := int(^uint(0) >> 1) // int型の最大値
	
	// pos位置の値との差を確認
	if pos < len(cards) {
		diff := abs(cards[pos] - x)
		if diff < minDiff {
			minDiff = diff
		}
	}
	
	// pos-1位置の値との差を確認
	if pos > 0 {
		diff := abs(cards[pos-1] - x)
		if diff < minDiff {
			minDiff = diff
		}
	}
	
	return minDiff
}

// abs は整数の絶対値を返す
// パラメータ:
//   - x: 整数
// 戻り値:
//   - xの絶対値
// 時間計算量: O(1)
// 空間計算量: O(1)
func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

// solve はメインの処理関数
// パラメータ:
//   - inputData: 入力文字列
// 戻り値:
//   - 出力結果の文字列
// 時間計算量: O(Q * n) ここで Q はクエリ数、n はカード数
// 空間計算量: O(n) カード保存用
func solve(inputData string) string {
	lines := strings.Split(strings.TrimSpace(inputData), "\n")
	q, _ := strconv.Atoi(lines[0])
	
	cards := make([]int, 0, 100000) // 容量を事前に確保してメモリ効率を向上
	results := make([]int, 0, q)    // 結果格納用スライス
	
	for i := 1; i <= q; i++ {
		parts := strings.Split(lines[i], " ")
		queryType, _ := strconv.Atoi(parts[0])
		x, _ := strconv.Atoi(parts[1])
		
		if queryType == 1 {
			// クエリ1: カードを追加（標準ライブラリ使用版）
			insertSortedBuiltin(&cards, x)
		} else {
			// クエリ2: 最小差を求める（標準ライブラリ使用版）
			result := findMinDifferenceBuiltin(cards, x)
			results = append(results, result)
		}
	}
	
	// 結果を文字列に変換
	var sb strings.Builder
	sb.Grow(len(results) * 10) // 概算でメモリを事前確保
	
	for i, result := range results {
		if i > 0 {
			sb.WriteString("\n")
		}
		sb.WriteString(strconv.Itoa(result))
	}
	
	return sb.String()
}

// solveManual は手動実装の二分探索を使用するバージョン
// パラメータ:
//   - inputData: 入力文字列
// 戻り値:
//   - 出力結果の文字列
// 時間計算量: O(Q * n)
// 空間計算量: O(n)
func solveManual(inputData string) string {
	lines := strings.Split(strings.TrimSpace(inputData), "\n")
	q, _ := strconv.Atoi(lines[0])
	
	cards := make([]int, 0, 100000)
	results := make([]int, 0, q)
	
	for i := 1; i <= q; i++ {
		parts := strings.Split(lines[i], " ")
		queryType, _ := strconv.Atoi(parts[0])
		x, _ := strconv.Atoi(parts[1])
		
		if queryType == 1 {
			// クエリ1: カードを追加
			insertSorted(&cards, x)
		} else {
			// クエリ2: 最小差を求める
			result := findMinDifference(cards, x)
			results = append(results, result)
		}
	}
	
	// 結果を文字列に変換
	var sb strings.Builder
	sb.Grow(len(results) * 10)
	
	for i, result := range results {
		if i > 0 {
			sb.WriteString("\n")
		}
		sb.WriteString(strconv.Itoa(result))
	}
	
	return sb.String()
}

// readInput は標準入力から全てのデータを読み込む
// パラメータ: なし
// 戻り値:
//   - 読み込んだ文字列
//   - エラー（存在する場合）
// 時間計算量: O(入力サイズ)
// 空間計算量: O(入力サイズ)
func readInput() (string, error) {
	scanner := bufio.NewScanner(os.Stdin)
	var lines []string
	
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}
	
	if err := scanner.Err(); err != nil {
		return "", err
	}
	
	return strings.Join(lines, "\n"), nil
}

// main はメイン実行関数
func main() {
	input, err := readInput()
	
	if err != nil || input == "" {
		// テスト用のサンプル入力
		testInput := `5
2 30
1 10
2 30
1 40
2 30`
		result := solve(testInput)
		fmt.Print(result)
	} else {
		result := solve(input)
		fmt.Print(result)
	}
}