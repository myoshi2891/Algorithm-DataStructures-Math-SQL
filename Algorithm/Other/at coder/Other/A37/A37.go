package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
)

func readInts(scanner *bufio.Scanner, count int) []int {
	result := make([]int, count)
	for i := 0; i < count; {
		scanner.Scan()
		line := scanner.Bytes()
		start := 0
		for j := 0; j <= len(line); j++ {
			if j == len(line) || line[j] == ' ' {
				if start < j {
					num, _ := strconv.Atoi(string(line[start:j]))
					result[i] = num
					i++
				}
				start = j + 1
			}
		}
	}
	return result
}

func sum(arr []int) int {
	total := 0
	for _, v := range arr {
		total += v
	}
	return total
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Buffer(make([]byte, 1e6), 1e9)

	scanner.Scan()
	header := scanner.Text()
	var N, M, B int
	fmt.Sscanf(header, "%d %d %d", &N, &M, &B)

	A := readInts(scanner, N)
	C := readInts(scanner, M)

	sumA := sum(A)
	sumC := sum(C)

	total := N*M*B + M*sumA + N*sumC
	fmt.Println(total)
}
