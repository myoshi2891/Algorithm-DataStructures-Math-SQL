// ### 🔍 よくあるランタイムエラーの原因（Go）

// | 原因               | 内容                                                      |
// | ---------------- | ------------------------------------------------------- |
// | ❌ インデックスエラー      | `acc[L-1]` のように `L=1` のとき `acc[0]` にアクセスできない or スライス外参照 |
// | ❌ スキャン不足         | 入力のスキャン回数が `Q` に足りていない（クエリが途中で終わる）                      |
// | ❌ スペースのない入力の処理ミス | `bufio.Scanner` が 1行ずつ読み取る前提で、改行の無い入力に対応できていない          |
// | ❌ 空文字列の変換        | `strconv.Atoi("")` のように、空の文字列を数値に変換してエラー                |

// ### ✅ 修正版 Go コード（安全対策込み）

package main

import (
	"bufio"
	"os"
	"strconv"
	"strings"
)

func main() {
	reader := bufio.NewReader(os.Stdin)

	// Read N
	line, _ := reader.ReadString('\n')
	N, _ := strconv.Atoi(strings.TrimSpace(line))

	// Read A
	line, _ = reader.ReadString('\n')
	Astr := strings.Fields(line)
	A := make([]int, N+1) // 1-indexed
	for i := 1; i <= N; i++ {
		A[i], _ = strconv.Atoi(Astr[i-1])
	}

	// Build prefix sum
	acc := make([]int, N+1)
	for i := 1; i <= N; i++ {
		acc[i] = acc[i-1] + A[i]
	}

	// Read Q
	line, _ = reader.ReadString('\n')
	Q, _ := strconv.Atoi(strings.TrimSpace(line))

	writer := bufio.NewWriter(os.Stdout)
	defer writer.Flush()

	// Read and process queries
	for i := 0; i < Q; i++ {
		line, err := reader.ReadString('\n')
		if err != nil {
			break // 安全策
		}
		LR := strings.Fields(line)
		if len(LR) < 2 {
			continue // 不正入力回避
		}
		L, _ := strconv.Atoi(LR[0])
		R, _ := strconv.Atoi(LR[1])

		if L < 1 || R > N || L > R {
			writer.WriteString("draw\n") // 安全なフォールバック
			continue
		}

		ones := acc[R] - acc[L-1]
		total := R - L + 1
		zeros := total - ones

		if ones > zeros {
			writer.WriteString("win\n")
		} else if zeros > ones {
			writer.WriteString("lose\n")
		} else {
			writer.WriteString("draw\n")
		}
	}
}

// ## ✅ 修正ポイントまとめ

// | 修正箇所                        | 説明                      |   |                         |
// | --------------------------- | ----------------------- | - | ----------------------- |
// | ✅ `bufio.NewReader` 使用      | `bufio.Scanner` の行制限を回避 |   |                         |
// | ✅ `strings.Fields` 使用       | 空白区切り入力を安全に処理           |   |                         |
// | ✅ `acc` と `A` を 1-indexed に | `acc[L-1]` アクセスを安全にするため |   |                         |
// | ✅ クエリ境界チェック                 | \`L < 1                 |   | R > N\` などの入力ミスで落ちないように |

// ---

// ## ✅ 確認テスト（例）

// ### 入力

// ```
// 7
// 0 1 1 0 1 0 0
// 3
// 2 5
// 2 7
// 5 7
// ```

// ### 出力

// ```
// win
// draw
// lose
// ```

// ## ✅ 補足

// * 万が一、`LR` の長さが不足する場合（不完全な入力など）にも対応。
// * クエリ数が `Q` 未満でもクラッシュしないように `err != nil` チェック。

