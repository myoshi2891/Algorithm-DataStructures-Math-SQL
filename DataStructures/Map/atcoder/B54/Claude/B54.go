// Goを使用した型安全で高性能なソリューションを作成します。Go版の主な特徴と最適化について詳しく説明します：

// ## 🎯 Goの型システムと性能最適化

// ### 1. **厳密な型定義**
// ```go
// type InputData struct {
//     N   int   // 配列サイズ（明示的な型）
//     Arr []int // スライス型（動的配列）
// }
// ```

// ### 2. **メモリ効率の最適化**
// ```go
// // ❌ 非効率: スライスの動的拡張
// var arr []int
// for i := 0; i < n; i++ {
//     arr = append(arr, value) // 再割り当てが発生
// }

// // ✅ 効率的: 事前サイズ指定
// arr := make([]int, n) // 一度だけメモリ割り当て
// arr[i-1] = value
// ```

// ## ⚡ パフォーマンス特性

// | 処理段階 | 時間計算量 | 空間計算量 | Go特有の最適化 |
// |---------|------------|------------|----------------|
// | 入力読み込み | O(N) | O(N) | `bufio.Scanner`によるバッファリング |
// | 解析処理 | O(N) | O(N) | `make([]int, n)`で事前割り当て |
// | 出現カウント | O(N) | O(K) | `map[int]int`のゼロ値初期化活用 |
// | 組み合わせ計算 | O(K) | O(1) | `int64`でオーバーフロー対策 |
// | **総計算量** | **O(N)** | **O(N)** | **ネイティブ性能** |

// ## 🚀 Go特有の最適化技術

// ### 1. **ゼロ値の活用**
// ```go
// countMap := make(map[int]int)
// // mapのゼロ値は0なので、キーが存在しない場合も安全
// countMap[num]++ // if文不要
// ```

// ### 2. **型安全なオーバーフロー対策**
// ```go
// // int32の範囲を超える可能性があるため、明示的にint64使用
// pairsForThisValue := int64(count) * int64(count-1) / 2
// var totalPairs int64 = 0
// ```

// ### 3. **効率的な入力処理**
// ```go
// scanner := bufio.NewScanner(os.Stdin)
// // 大きな入力でもメモリ効率的にスキャン
// for scanner.Scan() {
//     lines = append(lines, scanner.Text())
// }
// ```

// ## 🔍 実行例での動作解析

// **入力例**: `[30, 10, 30, 20, 10, 30]`

// ```go
// // Step 1: 出現回数カウント
// countMap[30] = 3  // 30が3回出現
// countMap[10] = 2  // 10が2回出現  
// countMap[20] = 1  // 20が1回出現

// // Step 2: 組み合わせ計算
// // 値30: C(3,2) = 3 * 2 / 2 = 3
// // 値10: C(2,2) = 2 * 1 / 2 = 1
// // 値20: C(1,2) = 0 (count < 2)

// // 結果: 3 + 1 = 4
// ```

// ## 🛡️ エラーハンドリングとメモリ安全性

// ### 1. **Goのイディオマティックなエラー処理**
// ```go
// if err := scanner.Err(); err != nil {
//     return "", fmt.Errorf("入力読み込みエラー: %w", err)
// }
// ```

// ### 2. **境界チェックとパニック回避**
// ```go
// // スライス範囲チェック
// if len(lines) != n+1 {
//     return InputData{}, fmt.Errorf("期待される行数: %d, 実際の行数: %d", n+1, len(lines))
// }
// ```

// ### 3. **適切なプロセス終了**
// ```go
// fmt.Fprintf(os.Stderr, "制約違反: %v\n", err)
// os.Exit(1) // 明確な異常終了コード
// ```

// ## 📊 制約対応と性能評価

// ### メモリ使用量
// - **理論値**: 約8MB（N=100,000の場合）
// - **実装**: `make([]int, n)` + `map[int]int`で効率的
// - **マージン**: 1024MB制限に対し128倍の余裕

// ### 実行時間
// - **理論値**: 約0.001秒（Go 1.20のネイティブ性能）
// - **制約**: 2秒以内
// - **マージン**: 2000倍の余裕

// ### Go言語の利点
// 1. **コンパイル時型チェック**: 実行前にエラー検出
// 2. **ガベージコレクション**: メモリリーク防止
// 3. **ネイティブ性能**: C/C++に近い実行速度
// 4. **並行処理対応**: 将来の拡張に対応（今回は不要）

// ## 🎯 アルゴリズムの核心コード
// ```go
// func countPairsOptimized(arr []int) int64 {
//     countMap := make(map[int]int)
    
//     // O(N): 出現回数をカウント
//     for _, num := range arr {
//         countMap[num]++
//     }
    
//     var totalPairs int64 = 0
    
//     // O(K): 組み合わせ数を計算
//     for _, count := range countMap {
//         if count >= 2 {
//             pairsForThisValue := int64(count) * int64(count-1) / 2
//             totalPairs += pairsForThisValue
//         }
//     }
    
//     return totalPairs
// }
// ```

// この実装は、Goの型安全性、メモリ効率、実行速度の利点を最大限活用し、競技プログラミングの厳しい制約に対応した高性能ソリューションです。

package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

// InputData represents the parsed input structure
// 入力データの構造を表現する型定義
type InputData struct {
	N   int   // 配列のサイズ (1 ≤ N ≤ 100,000)
	Arr []int // 入力配列 (各要素は 1 ≤ Ai ≤ 10^9)
}

// readInput reads all input from standard input efficiently
// 標準入力から全データを効率的に読み込む
//
// Returns:
//   - string: 入力データの文字列（改行文字を含む）
//   - error: 読み込み中にエラーが発生した場合
//
// Notes:
//   - bufio.Scannerを使用してメモリ効率を最適化
//   - 大きな入力に対してもバッファオーバーフローを防止
func readInput() (string, error) {
	scanner := bufio.NewScanner(os.Stdin)
	var lines []string

	// 各行を順次読み込み
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		return "", fmt.Errorf("入力読み込みエラー: %w", err)
	}

	return strings.Join(lines, "\n"), nil
}

// parseInput converts raw input string to structured data
// 生の入力文字列を構造化データに変換
//
// Parameters:
//   - inputData string: 標準入力から読み込んだ生データ
//
// Returns:
//   - InputData: 解析済みの入力データ（サイズと配列）
//   - error: 解析中にエラーが発生した場合
//
// Notes:
//   - 型安全性を保証するためstrconv.Atoi()を使用
//   - メモリ効率のためスライスを事前に適切なサイズで初期化
func parseInput(inputData string) (InputData, error) {
	lines := strings.Split(strings.TrimSpace(inputData), "\n")

	if len(lines) < 1 {
		return InputData{}, fmt.Errorf("入力データが空です")
	}

	// 配列サイズの解析
	n, err := strconv.Atoi(lines[0])
	if err != nil {
		return InputData{}, fmt.Errorf("配列サイズの解析エラー: %w", err)
	}

	// 行数の整合性チェック
	if len(lines) != n+1 {
		return InputData{}, fmt.Errorf("期待される行数: %d, 実際の行数: %d", n+1, len(lines))
	}

	// 配列を事前に適切なサイズで初期化（メモリ効率向上）
	arr := make([]int, n)

	// 各要素を解析
	for i := 1; i <= n; i++ {
		value, err := strconv.Atoi(lines[i])
		if err != nil {
			return InputData{}, fmt.Errorf("要素[%d]の解析エラー: %w", i-1, err)
		}
		arr[i-1] = value
	}

	return InputData{N: n, Arr: arr}, nil
}

// countPairsOptimized efficiently calculates the number of pairs satisfying the condition
// 条件を満たすペア(i, j)の数を効率的に計算
//
// Condition: 1 ≤ j < i ≤ N and Aj = Ai
//
// Algorithm:
//   1. Count occurrences of each value using map (O(N))
//   2. For each value appearing k times, calculate C(k,2) = k * (k-1) / 2
//   3. Sum up all combinations
//
// Parameters:
//   - arr []int: 入力配列
//
// Returns:
//   - int64: 条件を満たすペアの総数（大きな値に対応するためint64使用）
//
// Time Complexity: O(N) where N is array length
// Space Complexity: O(K) where K is number of distinct values (worst case O(N))
//
// Notes:
//   - map[int]intを使用して出現回数をカウント
//   - int64を使用してオーバーフロー対策
//   - ゼロ値初期化によりmap[key]++が安全に動作
func countPairsOptimized(arr []int) int64 {
	// 各値の出現回数をカウント
	// Goのmapはゼロ値で初期化されるため、存在しないキーは0として扱われる
	countMap := make(map[int]int)

	// O(N)で配列をスキャンして出現回数をカウント
	for _, num := range arr {
		countMap[num]++
	}

	var totalPairs int64 = 0

	// 各値について組み合わせ数を計算
	// O(K)で処理（Kは異なる値の数、最悪でもO(N)）
	for _, count := range countMap {
		if count >= 2 {
			// k個の要素から2個を選ぶ組み合わせ数
			// C(k,2) = k * (k-1) / 2
			// int64にキャストしてオーバーフローを防止
			pairsForThisValue := int64(count) * int64(count-1) / 2
			totalPairs += pairsForThisValue
		}
	}

	return totalPairs
}

// validateConstraints verifies that input data satisfies problem constraints
// 入力データが問題の制約条件を満たしているかを検証
//
// Parameters:
//   - data InputData: 検証対象の入力データ
//
// Returns:
//   - error: 制約違反が検出された場合のエラー、正常な場合はnil
//
// Constraints:
//   - 1 ≤ N ≤ 100,000
//   - 1 ≤ Ai ≤ 10^9 for all i
//
// Notes:
//   - 実行前に制約をチェックすることでランタイムエラーを防止
//   - 詳細なエラーメッセージでデバッグを支援
func validateConstraints(data InputData) error {
	// 配列サイズの制約チェック
	if data.N < 1 || data.N > 100000 {
		return fmt.Errorf("Nが制約を満たしません: N = %d (1 ≤ N ≤ 100,000)", data.N)
	}

	// 配列長の整合性チェック
	if len(data.Arr) != data.N {
		return fmt.Errorf("配列長が不一致: 期待値 = %d, 実際 = %d", data.N, len(data.Arr))
	}

	// 各要素の値域チェック
	for i, value := range data.Arr {
		if value < 1 || value > 1000000000 {
			return fmt.Errorf("A[%d]が制約を満たしません: %d (1 ≤ Ai ≤ 10^9)", i, value)
		}
	}

	return nil
}

// main function orchestrates the entire solution process
// ソリューション全体のプロセスを統括するメイン関数
//
// Process Flow:
//   1. Read input from standard input
//   2. Parse input data into structured format
//   3. Validate constraints
//   4. Calculate pair count
//   5. Output result
//
// Notes:
//   - エラーハンドリングによる堅牢性の確保
//   - os.Exit()による適切なプロセス終了コード設定
//   - ステップごとの明確な責任分離
func main() {
	// Step 1: 入力データの読み込み
	inputData, err := readInput()
	if err != nil {
		fmt.Fprintf(os.Stderr, "入力読み込みエラー: %v\n", err)
		os.Exit(1)
	}

	// Step 2: データの解析
	data, err := parseInput(inputData)
	if err != nil {
		fmt.Fprintf(os.Stderr, "入力解析エラー: %v\n", err)
		os.Exit(1)
	}

	// Step 3: 制約の検証
	if err := validateConstraints(data); err != nil {
		fmt.Fprintf(os.Stderr, "制約違反: %v\n", err)
		os.Exit(1)
	}

	// Step 4: ペア数の計算
	result := countPairsOptimized(data.Arr)

	// Step 5: 結果の出力
	fmt.Println(result)
}