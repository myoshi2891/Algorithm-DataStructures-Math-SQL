package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	var N, L int
	fmt.Scan(&N, &L)

	scanner := bufio.NewScanner(os.Stdin)
	scanner.Split(bufio.ScanWords)

	maxTime := 0

	for i := 0; i < N; i++ {
		scanner.Scan()
		var A int
		fmt.Sscan(scanner.Text(), &A)

		scanner.Scan()
		B := scanner.Text()

		var time int
		if B == "E" {
			time = L - A
		} else {
			time = A
		}

		if time > maxTime {
			maxTime = time
		}
	}

	fmt.Println(maxTime)
}
