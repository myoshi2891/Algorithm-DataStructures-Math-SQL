// 以下に、**Go 1.20.6** を用いた解答を提示します。
// ご要望に従って：

// * **関数ベース**
// * **型明示（引数・返却値ともに）**
// * **処理時間 O(1)**、**メモリ消費も定数**
// * **int64型**で `-10^18～10^18` に安全対応（Goの `int64` は ±9.22e18）

// ---

// ## ✅ 問題の本質（再確認）

// * 操作：「2つ選んで一方を +1、他方を -1」
// * 各操作で合計 `a + b + c` は変わらない
// * よって、**a + b + c == 0** のときだけ全て0にできる → `Yes`
// * それ以外は `No`

// ---

// ## ✅ Go 解答コード（int64使用）

// ```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

/*
canMakeAllZero は、3つの整数 a, b, c を 0 にできるか判定する関数です。
操作内容：任意の2つを選んで、一方を +1、もう一方を -1 にする。
引数:
 - a int64: 整数a（-1e18 <= a <= 1e18）
 - b int64: 整数b（-1e18 <= b <= 1e18）
 - c int64: 整数c（-1e18 <= c <= 1e18）
戻り値:
 - string: "Yes" または "No"
*/
func canMakeAllZero(a, b, c int64) string {
	if a+b+c == 0 {
		return "Yes"
	}
	return "No"
}

/*
readInput は標準入力から3つのint64を読み取る関数です。
戻り値:
 - int64, int64, int64: 入力された3つの整数
 - error: パースエラーがあれば返します
*/
func readInput() (int64, int64, int64, error) {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	line := scanner.Text()
	parts := strings.Fields(line)
	if len(parts) != 3 {
		return 0, 0, 0, fmt.Errorf("入力が3つではありません")
	}
	a, err1 := strconv.ParseInt(parts[0], 10, 64)
	b, err2 := strconv.ParseInt(parts[1], 10, 64)
	c, err3 := strconv.ParseInt(parts[2], 10, 64)
	if err1 != nil || err2 != nil || err3 != nil {
		return 0, 0, 0, fmt.Errorf("整数の変換に失敗しました")
	}
	return a, b, c, nil
}

/*
main 関数：標準入力から読み込み、判定して結果を出力します。
*/
func main() {
	a, b, c, err := readInput()
	if err != nil {
		fmt.Fprintln(os.Stderr, "入力エラー:", err)
		return
	}
	result := canMakeAllZero(a, b, c)
	fmt.Println(result)
}
// ```

// ---

// ## ✅ 実行例

// ```bash
// $ echo "3 -4 1" | go run main.go
// Yes
// ```

// ---

// ## ✅ 処理時間・メモリ使用量

// | 項目      | 内容                             |
// | ------- | ------------------------------ |
// | 時間計算量   | O(1)（加算・比較のみ）                  |
// | メモリ使用量  | int64 × 3（24バイト）＋入力行（数十バイト）    |
// | 対応範囲    | ±9.22e18 の範囲で `int64` により完全カバー |
// | GC圧・確保量 | ほぼゼロ（整数処理のみ）                   |

// ---

// ## ✅ 型安全性とエラーハンドリング

// * `int64` を明示 → 型安全、10^18対応
// * `strconv.ParseInt(..., 10, 64)` で正確にパース
// * 入力数や変換の失敗も `error` ハンドリング済み

// ---

// ## ✅ まとめ

// | 観点   | 内容               |
// | ---- | ---------------- |
// | 処理時間 | O(1)             |
// | メモリ  | 定数（最小限）          |
// | 型    | `int64` 安全範囲でカバー |
// | 実装方針 | 関数ベース、標準入力、明示型   |
// | 出力   | `Yes` / `No`     |

// ---

// 必要であれば、ユニットテスト関数やベンチマーク関数もGoでご提供可能です。
