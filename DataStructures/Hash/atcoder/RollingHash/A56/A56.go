package main

import (
    "bufio"
    "fmt"
    "os"
    "strconv"
)

const (
    MOD  = 1000000007
    BASE = 31
)

func main() {
    reader := bufio.NewReaderSize(os.Stdin, 1<<20)
    writer := bufio.NewWriterSize(os.Stdout, 1<<20)
    defer writer.Flush()

    // 入力読み取り
    var N, Q int
    fmt.Fscan(reader, &N, &Q)

    var S string
    fmt.Fscan(reader, &S)

    // 前計算
    hash := make([]int64, N+1)   // hash[i] = S[0..i-1] のハッシュ
    power := make([]int64, N+1)  // BASE^i の累乗

    power[0] = 1
    for i := 0; i < N; i++ {
        code := int64(S[i] - 'a' + 1)
        hash[i+1] = (hash[i]*BASE + code) % MOD
        power[i+1] = (power[i] * BASE) % MOD
    }

    // クエリ処理
    scanner := bufio.NewScanner(reader)
    scanner.Split(bufio.ScanWords)

    nextInt := func() int {
        scanner.Scan()
        val, _ := strconv.Atoi(scanner.Text())
        return val
    }

    for i := 0; i < Q; i++ {
        a := nextInt()
        b := nextInt()
        c := nextInt()
        d := nextInt()

        hash1 := getHash(hash, power, a, b)
        hash2 := getHash(hash, power, c, d)

        if hash1 == hash2 {
            fmt.Fprintln(writer, "Yes")
        } else {
            fmt.Fprintln(writer, "No")
        }
    }
}

func getHash(hash, power []int64, l, r int) int64 {
    res := hash[r] - (hash[l-1]*power[r-l+1])%MOD
    if res < 0 {
        res += MOD
    }
    return res
}
