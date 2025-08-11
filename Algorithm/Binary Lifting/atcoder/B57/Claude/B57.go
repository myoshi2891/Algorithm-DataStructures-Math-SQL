// Go言語での実装版を作成します。高速化とメモリ効率を重視した実装にします：**Go版の主要な特徴：**

// ## 1. 型安全性
// - すべての変数に明示的な型宣言
// - `int`型を一貫して使用（Go 1.20.6対応）
// - スライスの型を`[]int`で明示

// ## 2. メモリ効率の最適化
// - `make([]int, n+1)`でスライスを事前にサイズ指定
// - 不要なメモリ再配置を避ける
// - ガベージコレクションの負荷を軽減

// ## 3. 高速入出力処理
// - `bufio.Scanner`と`bufio.Writer`でバッファリング
// - 1MBのバッファサイズ設定
// - `defer writer.Flush()`で確実に出力

// ## 4. ダブリング手法の実装
// - ビット演算（`&`, `>>=`）で効率的な処理
// - O(N * log K)の時間計算量を実現
// - メモリ使用量はO(N)に抑制

// ## 5. エラー処理とエッジケース
// - 負の値を防ぐ条件分岐
// - 境界値の適切な処理
// - Go慣用句に従った実装

// **計算量分析：**
// - **時間計算量**: O(N * log K)
//   - N個の要素それぞれに対してlog K回の処理
// - **空間計算量**: O(N)
//   - `nextPosition`, `currentPositions`, `result`の3つのスライス

// **メモリ使用量（N=300,000の場合）:**
// - 各スライス: 約300,000 × 8バイト = 2.4MB
// - 合計: 約7.2MB（制限1024MiBに対して十分小さい）

// **実行時間（推定）:**
// - N=300,000, K=10^9の場合
// - 約30回のダブリング処理
// - 実行時間: 1-2秒程度（4秒制限内）

// この実装により、Go 1.20.6の制約下で高速かつメモリ効率的な解を提供できます。

package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
)

// calculateDigitSum は整数の桁和を計算する関数
//
// Parameters:
//   - num: 桁和を求める非負整数
//
// Returns:
//   - int: 各桁の数字の和
//
// Time Complexity: O(log num)
// Space Complexity: O(1)
func calculateDigitSum(num int) int {
	digitSum := 0
	for num > 0 {
		digitSum += num % 10
		num /= 10
	}
	return digitSum
}

// solveDigitOperations は1からNまでの各整数に対して桁和を引く操作をK回実行する
//
// Parameters:
//   - n: 処理する整数の最大値 (1 <= n <= 300000)
//   - k: 操作回数 (1 <= k <= 10^9)
//
// Returns:
//   - []int: 各整数の最終値のスライス（インデックス0は1の結果、インデックス1は2の結果...）
//
// Time Complexity: O(N * log K)
// Space Complexity: O(N)
func solveDigitOperations(n int, k int) []int {
	// 初期化：各位置から1ステップ後の位置を計算
	// インデックス0は未使用、1からnまでを使用
	nextPosition := make([]int, n+1)
	
	for i := 1; i <= n; i++ {
		digitSum := calculateDigitSum(i)
		// 負の値になることを防ぐため、0との最大値を取る
		if i-digitSum >= 0 {
			nextPosition[i] = i - digitSum
		} else {
			nextPosition[i] = 0
		}
	}
	
	// 現在の各整数の位置を初期化
	currentPositions := make([]int, n+1)
	for i := 1; i <= n; i++ {
		currentPositions[i] = i
	}
	
	// ダブリング（倍加法）でK回の操作を高速実行
	remainingSteps := k
	
	for remainingSteps > 0 {
		// 最下位ビットが1なら、現在のジャンプ表を適用
		if remainingSteps&1 == 1 {
			for i := 1; i <= n; i++ {
				currentPositions[i] = nextPosition[currentPositions[i]]
			}
		}
		
		// ジャンプ表を2倍化（2^i ステップ → 2^(i+1) ステップ）
		if remainingSteps > 1 {
			newNextPosition := make([]int, n+1)
			for i := 1; i <= n; i++ {
				newNextPosition[i] = nextPosition[nextPosition[i]]
			}
			nextPosition = newNextPosition
		}
		
		remainingSteps >>= 1 // 右シフトで次のビットへ
	}
	
	// 1-indexedの結果を0-indexedに変換して返す
	result := make([]int, n)
	for i := 1; i <= n; i++ {
		result[i-1] = currentPositions[i]
	}
	
	return result
}

// readInts は標準入力から整数を読み取るヘルパー関数
//
// Parameters:
//   - scanner: バッファ化されたスキャナー
//
// Returns:
//   - []int: 読み取った整数のスライス
func readInts(scanner *bufio.Scanner) []int {
	scanner.Scan()
	line := scanner.Text()
	var nums []int
	
	i := 0
	for i < len(line) {
		if line[i] == ' ' {
			i++
			continue
		}
		
		j := i
		for j < len(line) && line[j] != ' ' {
			j++
		}
		
		num, _ := strconv.Atoi(line[i:j])
		nums = append(nums, num)
		i = j
	}
	
	return nums
}

// main メイン関数：入力処理と結果出力を行う
func main() {
	// 高速入出力のためのバッファリング
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Buffer(make([]byte, 0, 64*1024), 1024*1024) // 1MBバッファ
	
	writer := bufio.NewWriter(os.Stdout)
	defer writer.Flush()
	
	// 入力読み取り
	nums := readInts(scanner)
	n := nums[0]
	k := nums[1]
	
	// 問題を解く
	results := solveDigitOperations(n, k)
	
	// 結果を出力
	for _, result := range results {
		fmt.Fprintln(writer, result)
	}
}