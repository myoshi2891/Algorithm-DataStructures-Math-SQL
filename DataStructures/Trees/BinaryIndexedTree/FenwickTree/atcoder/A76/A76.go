package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strconv"
)

const MOD = 1_000_000_007

type FenwickTree struct {
	n    int
	data []int
}

func NewFenwickTree(n int) *FenwickTree {
	return &FenwickTree{
		n:    n,
		data: make([]int, n+2),
	}
}

func (ft *FenwickTree) Add(i, x int) {
	i++
	for i <= ft.n+1 {
		ft.data[i] = (ft.data[i] + x) % MOD
		i += i & -i
	}
}

func (ft *FenwickTree) Sum(i int) int {
	i++
	res := 0
	for i > 0 {
		res = (res + ft.data[i]) % MOD
		i -= i & -i
	}
	return res
}

func (ft *FenwickTree) RangeSum(l, r int) int {
	return (ft.Sum(r) - ft.Sum(l-1) + MOD) % MOD
}

func lowerBound(a []int, x int) int {
	return sort.Search(len(a), func(i int) bool { return a[i] >= x })
}

func upperBound(a []int, x int) int {
	return sort.Search(len(a), func(i int) bool { return a[i] > x })
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Split(bufio.ScanWords) // 単語（スペース区切り）単位で読み取り

	readInt := func() int {
		scanner.Scan()
		n, _ := strconv.Atoi(scanner.Text())
		return n
	}

	N := readInt()
	W := readInt()
	L := readInt()
	R := readInt()

	X := make([]int, N)
	for i := 0; i < N; i++ {
		X[i] = readInt()
	}

	// 全地点（スタート0、足場、ゴールW）をリストアップ
	positions := append([]int{0}, X...)
	positions = append(positions, W)
	sort.Ints(positions)

	posIndex := make(map[int]int)
	for i, v := range positions {
		posIndex[v] = i
	}

	n := len(positions)
	dp := make([]int, n)
	dp[0] = 1

	ft := NewFenwickTree(n)
	ft.Add(0, 1)

	for i := 1; i < n; i++ {
		cur := positions[i]
		left := cur - R
		right := cur - L

		li := lowerBound(positions, left)
		ri := upperBound(positions, right) - 1

		if li <= ri {
			val := ft.RangeSum(li, ri)
			dp[i] = val
			ft.Add(i, val)
		}
	}

	fmt.Println(dp[n-1])
}

// Go 解法で 20件の入力で ランタイムエラー（panic） が発生するとのこと、原因として考えられるのは以下のいずれかです：

// ❗️ 原因候補
// bufio.Scanner の 2行しか読んでいない
// 実際には N が大きくなると 複数行に分かれて入力される 可能性がある。
// つまり "5 65 7 37" の次に "5 15 30 50 55" でなく、改行を含む複数行に X が分割されている可能性がある。
// Xstr := strings.Fields(scanner.Text()) だけで全 N 要素を取得できない。

// ✅ 修正方針
// N 個の X[i] を読み切るまで ループで scanner.Scan() を繰り返す
// X := make([]int, N) を安全に埋める

// ✅ 修正点まとめ
// 修正箇所	内容
// scanner.Split(...)	単語単位で int を逐次読み取り可能に
// readInt() 関数	scanner.Scan() + strconv.Atoi() のラッパー
// X[i] = readInt()	必ず N 件読み切るようループで読み取り