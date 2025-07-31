// 以下は、**Go 1.20.6** を使用した「最大収益を得るスケジューリング問題」の解法です。
// **優先度付きキュー（最大ヒープ）＋日ごとの貪欲処理**を用い、\*\*満点が狙える効率的な実装（O(N log N + D log N)）\*\*となっています。

// ---

// ## ✅ 処理概要

// * 各日付に対して「開始可能な仕事の報酬」を分類
// * 毎日、報酬が最大の仕事を `heap`（最大ヒープ）から選んで実行
// * `container/heap` パッケージを使って独自の最大ヒープを実装

// ---

// ## ✅ Goコード（関数化・型明示・メモリ計算考慮）

// ```go
package main

import (
	"bufio"
	"container/heap"
	"fmt"
	"os"
	"strconv"
	"strings"
)

// Job は仕事の情報（開始日と報酬）を表します。
type Job struct {
	startDay int // X_i：開始日
	reward   int // Y_i：報酬
}

// MaxHeap は報酬を格納する最大ヒープです。
type MaxHeap []int

// Len はヒープの要素数を返します。
func (h MaxHeap) Len() int { return len(h) }

// Less は最大ヒープとして動作させるための比較関数です。
func (h MaxHeap) Less(i, j int) bool { return h[i] > h[j] }

// Swap は要素の入れ替えを行います。
func (h MaxHeap) Swap(i, j int) { h[i], h[j] = h[j], h[i] }

// Push はヒープに要素を追加します。
func (h *MaxHeap) Push(x any) {
	*h = append(*h, x.(int))
}

// Pop はヒープから最大値を取り出します。
func (h *MaxHeap) Pop() any {
	old := *h
	n := len(old)
	val := old[n-1]
	*h = old[:n-1]
	return val
}

/**
 * 最大報酬を計算する関数
 * @param n int - 仕事数
 * @param d int - 就業可能日数
 * @param jobs []Job - 各仕事（開始日と報酬）
 * @return int - 最大得られる報酬
 */
func getMaxEarnings(n int, d int, jobs []Job) int {
	// 各日ごとにできる仕事の報酬リスト
	jobByDay := make([][]int, d+1) // 1-based indexing

	for _, job := range jobs {
		if job.startDay <= d {
			jobByDay[job.startDay] = append(jobByDay[job.startDay], job.reward)
		}
	}

	h := &MaxHeap{}
	heap.Init(h)
	total := 0

	for day := 1; day <= d; day++ {
		// 今日から可能な仕事をヒープに追加
		for _, reward := range jobByDay[day] {
			heap.Push(h, reward)
		}
		// 最大報酬の仕事を1つ実行
		if h.Len() > 0 {
			total += heap.Pop(h).(int)
		}
	}

	return total
}

// main は標準入力を受け取り、最大報酬を出力します。
func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	parts := strings.Fields(scanner.Text())
	n, _ := strconv.Atoi(parts[0])
	d, _ := strconv.Atoi(parts[1])

	jobs := make([]Job, n)
	for i := 0; i < n; i++ {
		scanner.Scan()
		parts := strings.Fields(scanner.Text())
		x, _ := strconv.Atoi(parts[0])
		y, _ := strconv.Atoi(parts[1])
		jobs[i] = Job{startDay: x, reward: y}
	}

	result := getMaxEarnings(n, d, jobs)
	fmt.Println(result)
}
// ```

// ---

// ## ✅ 入力例

// ```
// 5 4
// 1 1
// 2 4
// 2 3
// 3 4
// 4 2
// ```

// ### 出力

// ```
// 12
// ```

// ---

// ## ✅ 時間・空間計算量

// | 項目     | 計算量                  | 備考                 |
// | ------ | -------------------- | ------------------ |
// | job分類  | O(N)                 | 各仕事を1回処理           |
// | heap操作 | O(N log N + D log N) | push/pop は log N 回 |
// | 空間使用量  | O(N + D)             | jobByDay + heapサイズ |

// Goは静的型言語かつ高速なGCがあり、このようなヒープ・貪欲アルゴリズムに適しています。

// ---

// ## ✅ 実行方法

// 1. コードを `main.go` に保存
// 2. 以下のように実行できます：

// ```bash
// go run main.go < input.txt
// ```

// ---

// ## ✅ 補足

// * `container/heap` を使って安全・効率的に最大ヒープを実装
// * `bufio.Scanner` で高速な入力処理
// * 型安全 (`Job`, `MaxHeap`) に処理を構造化

// ---

// ご希望があれば、**図解付きの処理フロー**や**各日ごとのヒープ状態の追跡**も提供可能です。お気軽にどうぞ。
