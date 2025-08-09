// では、先ほどの **二重ローリングハッシュ法による回文判定** を Go 1.20.6 で実装します。

// * 型はすべて明示
// * 関数ごとにパラメータ・返却値をコメントで記載
// * `time` パッケージで処理時間計測
// * `runtime` パッケージでメモリ使用量計測
// * 入出力は高速化のために `bufio` を使用

// ---

// ```go
// Go 1.20.6
// 二重ローリングハッシュによる高速回文判定
// 実行方法: go run main.go < input.txt

package main

import (
	"bufio"
	"fmt"
	"os"
	"runtime"
	"time"
)

// buildHash は文字列 S に対して基数 base と法 mod を用いた
// 累乗配列、正方向ハッシュ配列、逆方向ハッシュ配列を構築する
//
// Parameters:
//   S    string : 対象文字列（英小文字）
//   base int64  : ローリングハッシュの基数
//   mod  int64  : 法（素数）
//
// Returns:
//   pow []int64 : base^i % mod の累乗配列
//   hf  []int64 : 正方向 prefix hash 配列（1-indexed）
//   hr  []int64 : 逆方向 prefix hash 配列（1-indexed）
func buildHash(S string, base, mod int64) ([]int64, []int64, []int64) {
	n := len(S)
	pow := make([]int64, n+1)
	hf := make([]int64, n+1)
	hr := make([]int64, n+1)

	pow[0] = 1
	for i := 1; i <= n; i++ {
		pow[i] = (pow[i-1] * base) % mod
	}

	for i := 0; i < n; i++ {
		val := int64(S[i]-'a'+1)
		hf[i+1] = (hf[i]*base + val) % mod
	}

	for i := 0; i < n; i++ {
		val := int64(S[n-1-i]-'a'+1)
		hr[i+1] = (hr[i]*base + val) % mod
	}

	return pow, hf, hr
}

// getSubHash は prefix hash 配列から部分文字列 [l, r] (1-indexed) のハッシュ値を取得する
//
// Parameters:
//   hf   []int64 : prefix hash 配列（1-indexed）
//   pow  []int64 : base^i % mod の累乗配列
//   l    int     : 部分文字列の開始位置 (1-indexed)
//   r    int     : 部分文字列の終了位置 (1-indexed)
//   mod  int64   : 法
//
// Returns:
//   hashValue int64 : 部分文字列のハッシュ値
func getSubHash(hf, pow []int64, l, r int, mod int64) int64 {
	length := r - l + 1
	res := hf[r] - (hf[l-1]*pow[length])%mod
	res %= mod
	if res < 0 {
		res += mod
	}
	return res
}

// solve は N, Q, S, クエリ配列を受け取り回文判定結果を返す
//
// Parameters:
//   N       int           : 文字列長
//   Q       int           : クエリ数
//   S       string        : 対象文字列
//   queries [][2]int      : 各クエリ (L, R) の配列
//
// Returns:
//   results []string : 各クエリに対する "Yes" または "No" の結果
func solve(N, Q int, S string, queries [][2]int) []string {
	const MOD1 int64 = 1000000007
	const MOD2 int64 = 1000000009
	const BASE1 int64 = 1000003
	const BASE2 int64 = 1000033

	pow1, hf1, hr1 := buildHash(S, BASE1, MOD1)
	pow2, hf2, hr2 := buildHash(S, BASE2, MOD2)

	results := make([]string, Q)
	for i, q := range queries {
		L, R := q[0], q[1]

		fh1 := getSubHash(hf1, pow1, L, R, MOD1)
		fh2 := getSubHash(hf2, pow2, L, R, MOD2)

		revL := N - R + 1
		revR := N - L + 1

		rh1 := getSubHash(hr1, pow1, revL, revR, MOD1)
		rh2 := getSubHash(hr2, pow2, revL, revR, MOD2)

		if fh1 == rh1 && fh2 == rh2 {
			results[i] = "Yes"
		} else {
			results[i] = "No"
		}
	}
	return results
}

func main() {
	in := bufio.NewReaderSize(os.Stdin, 1<<20)
	out := bufio.NewWriterSize(os.Stdout, 1<<20)
	defer out.Flush()

	var N, Q int
	fmt.Fscan(in, &N, &Q)

	var S string
	fmt.Fscan(in, &S)

	queries := make([][2]int, Q)
	for i := 0; i < Q; i++ {
		fmt.Fscan(in, &queries[i][0], &queries[i][1])
	}

	start := time.Now()
	results := solve(N, Q, S, queries)
	elapsed := time.Since(start)

	for _, res := range results {
		fmt.Fprintln(out, res)
	}

	// メモリ使用量計測
	var m runtime.MemStats
	runtime.ReadMemStats(&m)

	fmt.Fprintf(os.Stderr, "Time: %v ms\n", elapsed.Milliseconds())
	fmt.Fprintf(os.Stderr, "Memory: %.2f MB\n", float64(m.Alloc)/1024.0/1024.0)
}
// ```

// ---

// ### 実装の特徴

// 1. **二重ローリングハッシュ**

//    * `MOD1, MOD2` と `BASE1, BASE2` を変えて衝突率をほぼゼロに。
//    * Go の `int64` 型を使用して安全に計算。

// 2. **関数分割**

//    * `buildHash` → 累乗配列・正逆ハッシュ配列生成
//    * `getSubHash` → 部分文字列の O(1) ハッシュ取得
//    * `solve` → クエリを処理して結果を返す

// 3. **高速入出力**

//    * `bufio.NewReaderSize` / `bufio.NewWriterSize` で大きめバッファを確保。

// 4. **計測**

//    * `time.Since()` で経過時間計測
//    * `runtime.ReadMemStats` でメモリ使用量取得
