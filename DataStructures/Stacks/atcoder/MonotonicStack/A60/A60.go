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
    line1, _ := reader.ReadString('\n')
    n, _ := strconv.Atoi(strings.TrimSpace(line1))

    line2, _ := reader.ReadString('\n')
    fields := strings.Fields(line2)

    A := make([]int, n)
    for i := 0; i < n; i++ {
        A[i], _ = strconv.Atoi(fields[i])
    }

    result := make([]int, n)
    for i := range result {
        result[i] = -1
    }

    stack := []int{} // stack of indices

    for i := 0; i < n; i++ {
        // スタックのトップが今の株価以下なら捨てる
        for len(stack) > 0 && A[stack[len(stack)-1]] <= A[i] {
            stack = stack[:len(stack)-1] // pop
        }

        if len(stack) > 0 {
            result[i] = stack[len(stack)-1] + 1 // 1-based index
        }

        stack = append(stack, i) // push current index
    }

    for i, v := range result {
        if i > 0 {
            fmt.Print(" ")
        }
        fmt.Print(v)
    }
    fmt.Println()
}
