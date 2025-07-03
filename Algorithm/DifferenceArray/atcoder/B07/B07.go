// この問題では最大で `T = 500000`, `N = 500000` と非常に大きくなるため、**差分配列（いもす法）**＋**累積和**を使って高速に処理する必要があります。

// ## ✅ Goによる回答コード（標準入力 & 高速出力対応）
package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	reader := bufio.NewReaderSize(os.Stdin, 1<<20) // 1MB buffer
	scanner := bufio.NewScanner(reader)
	scanner.Split(bufio.ScanLines)

	// Helper function to read one line and convert to int
	// readInt := func() int {
	// 	scanner.Scan()
	// 	val, _ := strconv.Atoi(scanner.Text())
	// 	return val
	// }

	// First line: T (閉店時刻)
	scanner.Scan()
	T, _ := strconv.Atoi(scanner.Text())

	// Second line: N (従業員数)
	scanner.Scan()
	N, _ := strconv.Atoi(scanner.Text())

	// 差分配列の初期化
	cnt := make([]int, T+1)

	// 各従業員の[L, R)を読み取り、差分配列に記録
	for i := 0; i < N; i++ {
		scanner.Scan()
		parts := strings.Fields(scanner.Text())
		L, _ := strconv.Atoi(parts[0])
		R, _ := strconv.Atoi(parts[1])
		cnt[L] += 1
		cnt[R] -= 1
	}

	// 出力用バッファ
	writer := bufio.NewWriterSize(os.Stdout, 1<<20) // 1MB buffer
	defer writer.Flush()

	// 累積和をとって出力
	current := 0
	for t := 0; t < T; t++ {
		current += cnt[t]
		fmt.Fprintln(writer, current)
	}
}

// ## 📥 入力形式（例）

// ```text
// 10
// 7
// 0 3
// 2 4
// 1 3
// 0 3
// 5 6
// 5 6
// 5 6
// ```

// ---

// ## 📤 出力形式

// ```text
// 2
// 3
// 4
// 1
// 0
// 3
// 0
// 0
// 0
// 0
// ```

// ---

// ## ✅ 説明

// ### データ構造

// | 変数名       | 型       | 内容              |
// | --------- | ------- | --------------- |
// | `T`       | `int`   | 営業時間（閉店時刻）      |
// | `N`       | `int`   | 従業員数            |
// | `cnt`     | `[]int` | 差分配列（サイズ `T+1`） |
// | `current` | `int`   | 時刻 t にいる人数の累積値  |

// ---

// ## ⏱ パフォーマンス

// * 計算量：O(N + T)
// * メモリ：`cnt` 配列で最大 500001 要素 → 約 2MB
// * 入出力：`bufio.NewReaderSize`, `NewWriterSize` を使用して高速化

// ## ✅ 実行方法（ターミナル）

// ファイル名 `main.go` で保存して以下を実行：

// ```bash
// go run main.go < input.txt
// ```

// またはコンパイルして実行：

// ```bash
// go build main.go
// ./main < input.txt
// ```

