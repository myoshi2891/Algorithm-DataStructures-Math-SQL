package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	header := strings.Split(scanner.Text(), " ")
	N, _ := strconv.Atoi(header[0])
	Q, _ := strconv.Atoi(header[1])

	changes := make(map[int]int)
	reversed := false
	var output []string

	for i := 0; i < Q; i++ {
		scanner.Scan()
		line := strings.Split(scanner.Text(), " ")
		t, _ := strconv.Atoi(line[0])

		if t == 1 {
			x, _ := strconv.Atoi(line[1])
			y, _ := strconv.Atoi(line[2])
			var realIndex int
			if reversed {
				realIndex = N - x
			} else {
				realIndex = x - 1
			}
			changes[realIndex] = y

		} else if t == 2 {
			reversed = !reversed

		} else if t == 3 {
			x, _ := strconv.Atoi(line[1])
			var realIndex int
			if reversed {
				realIndex = N - x
			} else {
				realIndex = x - 1
			}
			if val, ok := changes[realIndex]; ok {
				output = append(output, strconv.Itoa(val))
			} else {
				output = append(output, strconv.Itoa(realIndex+1))
			}
		}
	}

	fmt.Println(strings.Join(output, "\n"))
}
