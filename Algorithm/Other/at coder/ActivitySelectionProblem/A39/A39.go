package main

import (
    "bufio"
    "fmt"
    "os"
    "sort"
    "strconv"
    "strings"
)

// 映画の構造体
type Movie struct {
    Start int
    End   int
}

func main() {
    scanner := bufio.NewScanner(os.Stdin)
    scanner.Split(bufio.ScanLines)

    // 最初の行で映画の本数を読む
    scanner.Scan()
    n, _ := strconv.Atoi(scanner.Text())

    movies := make([]Movie, n)

    // 各映画の開始・終了時間を読み取る
    for i := 0; i < n; i++ {
        scanner.Scan()
        parts := strings.Split(scanner.Text(), " ")
        start, _ := strconv.Atoi(parts[0])
        end, _ := strconv.Atoi(parts[1])
        movies[i] = Movie{Start: start, End: end}
    }

    // 終了時間で昇順ソート
    sort.Slice(movies, func(i, j int) bool {
        return movies[i].End < movies[j].End
    })

    // 貪欲に映画を選ぶ
    count := 0
    currentTime := 0

    for _, m := range movies {
        if m.Start >= currentTime {
            count++
            currentTime = m.End
        }
    }

    fmt.Println(count)
}
