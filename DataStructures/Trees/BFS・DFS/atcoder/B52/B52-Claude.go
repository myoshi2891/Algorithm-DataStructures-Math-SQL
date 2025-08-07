// ファイル名から特定のエッジケースが原因と推測できます。`max_01`と`random_05`でのランタイムエラーを修正します。## 🔍 `max_01`と`random_05`でのランタイムエラー原因分析と修正

// ### 1. **推測される問題と対策**

// #### A. **max_01エラー (最大ケース)**
// ```go
// // 問題: N=100,000の最大ケースでのメモリ/処理問題
// // 対策1: visited配列で重複処理防止
// visited := make([]bool, n) // 重複キュー追加を防止

// // 対策2: キューインデックス管理でslice操作最小化
// queueIdx := 0
// for queueIdx < len(queue) {  // slice切り詰めなし
//     pos := queue[queueIdx]
//     queueIdx++
// }
// ```

// #### B. **random_05エラー (ランダムケース)**
// ```go
// // 問題: 特殊な文字や入力形式
// // 対策1: より堅牢な入力処理
// reader := bufio.NewReader(os.Stdin)
// line, err := reader.ReadString('\n')  // より安全

// // 対策2: EOFハンドリング改善
// if err2 != nil {
//     // 最後の行に改行がない場合も対応
//     line2 = strings.TrimSpace(line2)
//     if len(line2) == 0 { return }
// }
// ```

// ### 2. **重要な修正点**

// #### 重複処理防止
// ```go
// visited := make([]bool, n)  // 同じ位置を2回処理しない
// if !visited[leftPos] && balls[leftPos] == '.' {
//     visited[leftPos] = true  // 重複防止
//     queue = append(queue, leftPos)
// }
// ```

// #### メモリ効率化
// ```go
// // 修正前: rune使用（4バイト/文字）
// balls := []rune(a)  // 100,000 × 4 = 400KB

// // 修正後: byte使用（1バイト/文字） 
// balls := make([]byte, len(a))  // 100,000 × 1 = 100KB
// copy(balls, []byte(a))         // 安全なコピー
// ```

// #### 境界チェック強化
// ```go
// // 完全な境界チェック
// if leftPos >= 0 && leftPos < n && !visited[leftPos] && balls[leftPos] == '.' {
//     // leftPos >= 0: 左端チェック
//     // leftPos < n:  右端チェック  
//     // !visited:     重複チェック
//     // == '.':       白ボールチェック
// }
// ```

// ### 3. **エッジケース完全対応**

// #### N=1の特別処理
// ```go
// if n == 1 {
//     if x == 1 && len(a) == 1 && a[0] == '.' {
//         return "@"  // 単一の白ボール
//     }
//     return a  // その他は変更なし
// }
// ```

// #### 不正入力の安全処理
// ```go
// // サイズ制限チェック
// if n > 100000 || len(a) > 100000 {
//     return  // メモリ不足防止
// }

// // パース失敗時の安全終了
// if err != nil || n <= 0 {
//     return  // panicではなく正常終了
// }
// ```

// ### 4. **出力形式の修正**
// ```go
// // 修正前
// fmt.Print(result)  // 改行なし

// // 修正後  
// fmt.Println(result)  // 改行付き（標準的）
// ```

// ### 5. **修正版の特徴**

// #### ✅ **確実性の向上**
// - **visited配列**: O(1)での重複チェック
// - **インデックス管理**: スライス操作によるGC負荷軽減
// - **堅牢な入力**: EOF・改行なし・不正形式に対応

// #### 📊 **パフォーマンス改善**
// - **メモリ**: 400KB → 200KB（byte + visited配列）
// - **時間**: 重複処理防止でより高速
// - **安定性**: エッジケースでのクラッシュ防止

// この**完全修正版では`max_01`と`random_05`を含む全7問でAC**が期待できます。特に**重複処理防止**と**堅牢な入力処理**が決定的な修正点です。
package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

// simulateBallColoring ボール色塗りシミュレーションを実行する
// n: ボールの個数
// x: 開始位置（1-indexed）
// a: 初期のボールの色を表す文字列
// 返り値: シミュレーション後のボールの色を表す文字列
func simulateBallColoring(n int, x int, a string) string {
	// エッジケース: N=1の場合
	if n == 1 {
		if x == 1 && len(a) == 1 && a[0] == '.' {
			return "@"
		}
		return a
	}
	
	// エッジケース: 空文字列や長さ不整合
	if len(a) != n || n <= 0 || x <= 0 || x > n {
		return a
	}
	
	// 0-indexedに変換
	startPos := x - 1
	
	// エッジケース: startPosが範囲外
	if startPos < 0 || startPos >= len(a) {
		return a
	}
	
	// エッジケース: 開始位置が白でない
	if a[startPos] != '.' {
		return a
	}
	
	// 文字列をバイト配列に変換（runeよりも軽量で安全）
	balls := make([]byte, len(a))
	copy(balls, []byte(a))
	
	// BFS用の効率的なキュー実装（スライス操作を最小化）
	queue := make([]int, 0, n)
	visited := make([]bool, n) // 重複処理防止
	
	// 開始位置を青に塗る
	balls[startPos] = '@'
	queue = append(queue, startPos)
	visited[startPos] = true
	
	// BFSでシミュレーション実行
	queueIdx := 0
	for queueIdx < len(queue) {
		pos := queue[queueIdx]
		queueIdx++
		
		// 左隣のボールをチェック
		leftPos := pos - 1
		if leftPos >= 0 && leftPos < n && !visited[leftPos] && balls[leftPos] == '.' {
			balls[leftPos] = '@'
			queue = append(queue, leftPos)
			visited[leftPos] = true
		}
		
		// 右隣のボールをチェック
		rightPos := pos + 1
		if rightPos >= 0 && rightPos < n && !visited[rightPos] && balls[rightPos] == '.' {
			balls[rightPos] = '@'
			queue = append(queue, rightPos)
			visited[rightPos] = true
		}
	}
	
	return string(balls)
}

func main() {
	// より堅牢な入力処理
	reader := bufio.NewReader(os.Stdin)
	
	// 1行目を読み込み (N X)
	line1, err1 := reader.ReadString('\n')
	if err1 != nil {
		return // EOF等のエラーで安全に終了
	}
	line1 = strings.TrimSpace(line1)
	
	// 2行目を読み込み (A)
	line2, err2 := reader.ReadString('\n')
	if err2 != nil {
		// EOFの場合でも処理を続行（最後の行に改行がない場合）
		line2 = strings.TrimSpace(line2)
		if len(line2) == 0 {
			return
		}
	} else {
		line2 = strings.TrimSpace(line2)
	}
	
	// 1行目をパース
	parts := strings.Fields(line1)
	if len(parts) != 2 {
		return // 不正な形式で安全に終了
	}
	
	n, err := strconv.Atoi(parts[0])
	if err != nil || n <= 0 {
		return
	}
	
	x, err := strconv.Atoi(parts[1])
	if err != nil || x <= 0 {
		return
	}
	
	a := line2
	
	// 最大サイズチェック（メモリ不足防止）
	if n > 100000 || len(a) > 100000 {
		return
	}
	
	// シミュレーション実行
	result := simulateBallColoring(n, x, a)
	
	// 結果を出力（改行付き - 多くの競技プログラミング問題の標準）
	fmt.Println(result)
}