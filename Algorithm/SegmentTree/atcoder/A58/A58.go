package main

import (
    "bufio"
    "fmt"
    "os"
    "strconv"
    "strings"
)

// セグメントツリー構造体
type SegmentTree struct {
    size int
    data []int
}

// 新しいセグメントツリーを作成
func NewSegmentTree(n int) *SegmentTree {
    size := 1
    for size < n {
        size <<= 1
    }
    return &SegmentTree{
        size: size,
        data: make([]int, size*2),
    }
}

// 値の更新
func (st *SegmentTree) Update(pos int, value int) {
    pos += st.size
    st.data[pos] = value
    for pos > 1 {
        pos >>= 1
        st.data[pos] = max(st.data[pos*2], st.data[pos*2+1])
    }
}

// 区間 [l, r) の最大値
func (st *SegmentTree) Query(l, r int) int {
    res := 0
    l += st.size
    r += st.size
    for l < r {
        if l&1 == 1 {
            res = max(res, st.data[l])
            l++
        }
        if r&1 == 1 {
            r--
            res = max(res, st.data[r])
        }
        l >>= 1
        r >>= 1
    }
    return res
}

func max(a, b int) int {
    if a > b {
        return a
    }
    return b
}

func main() {
    reader := bufio.NewReader(os.Stdin)
    line, _ := reader.ReadString('\n')
    parts := strings.Fields(line)
    n, _ := strconv.Atoi(parts[0])
    q, _ := strconv.Atoi(parts[1])

    st := NewSegmentTree(n)

    var output []string
    for i := 0; i < q; i++ {
        line, _ = reader.ReadString('\n')
        parts = strings.Fields(line)
        cmd, _ := strconv.Atoi(parts[0])
        if cmd == 1 {
            pos, _ := strconv.Atoi(parts[1])
            x, _ := strconv.Atoi(parts[2])
            st.Update(pos-1, x) // 0-indexed
        } else {
            l, _ := strconv.Atoi(parts[1])
            r, _ := strconv.Atoi(parts[2])
            res := st.Query(l-1, r-1)
            output = append(output, strconv.Itoa(res))
        }
    }

    fmt.Println(strings.Join(output, "\n"))
}
