package main

import (
    "bufio"
    "fmt"
    "os"
    "strconv"
    "strings"
)

func main() {
    reader := bufio.NewReader(os.Stdin)

    // 1行目: 山の数Nを取得
    line, _ := reader.ReadString('\n')
    N, _ := strconv.Atoi(strings.TrimSpace(line))

    // 2行目: 石の数の配列Aを取得
    line, _ = reader.ReadString('\n')
    tokens := strings.Fields(line)

    xorSum := 0
    for i := 0; i < N; i++ {
        a, _ := strconv.Atoi(tokens[i])
        xorSum ^= a
    }

    if xorSum == 0 {
        fmt.Println("Second")
    } else {
        fmt.Println("First")
    }
}
