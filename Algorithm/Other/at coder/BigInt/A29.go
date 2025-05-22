package main

import (
    "bufio"
    "fmt"
    "math/big"
    "os"
)

func main() {
    var aStr, bStr string

    // 入力読み取り
    scanner := bufio.NewScanner(os.Stdin)
    if scanner.Scan() {
        fmt.Sscan(scanner.Text(), &aStr, &bStr)
    }

    a := new(big.Int)
    b := new(big.Int)
    mod := big.NewInt(1000000007)

    a.SetString(aStr, 10)
    b.SetString(bStr, 10)

    // result = a^b mod 1000000007
    result := new(big.Int).Exp(a, b, mod)

    fmt.Println(result.String())
}
