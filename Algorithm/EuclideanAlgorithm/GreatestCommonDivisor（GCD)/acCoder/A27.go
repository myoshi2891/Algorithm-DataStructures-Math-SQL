package main

import (
    "fmt"
)

func gcd(a, b int) int {
    for b != 0 {
        a, b = b, a%b
    }
    return a
}

func main() {
    var a, b int
    fmt.Scan(&a, &b) // 標準入力から2つの整数を読み込む
    fmt.Println(gcd(a, b))
}
