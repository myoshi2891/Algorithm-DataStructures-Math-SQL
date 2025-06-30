package main

import (
    "bufio"
    "fmt"
    "os"
    "sort"
    "strconv"
    "strings"
)

type Student struct {
    A int
    B int
}

func main() {
    scanner := bufio.NewScanner(os.Stdin)
    scanner.Scan()
    parts := strings.Fields(scanner.Text())
    N, _ := strconv.Atoi(parts[0])
    K, _ := strconv.Atoi(parts[1])

    students := make([]Student, N)
    for i := 0; i < N; i++ {
        scanner.Scan()
        line := strings.Fields(scanner.Text())
        a, _ := strconv.Atoi(line[0])
        b, _ := strconv.Atoi(line[1])
        students[i] = Student{A: a, B: b}
    }

    // Step 1: 体力で昇順ソート
    sort.Slice(students, func(i, j int) bool {
        return students[i].A < students[j].A
    })

    maxCount := 0

    // Step 2: 全探索
    for i := 0; i < N; i++ {
        temp := make([]Student, 0)
        for j := i; j < N; j++ {
            if students[j].A - students[i].A > K {
                break
            }
            temp = append(temp, students[j])
        }

        // Step 3: 気力でソート
        sort.Slice(temp, func(i, j int) bool {
            return temp[i].B < temp[j].B
        })

        // Step 4: 気力の差がK以下の最大人数を探索
        for l := 0; l < len(temp); l++ {
            for r := l; r < len(temp); r++ {
                if temp[r].B - temp[l].B > K {
                    break
                }
                if r - l + 1 > maxCount {
                    maxCount = r - l + 1
                }
            }
        }
    }

    fmt.Println(maxCount)
}
