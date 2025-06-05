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
	Q, _ := strconv.Atoi(scanner.Text())

	stack := make([]string, 0, Q)
	output := make([]string, 0, Q)

	for i := 0; i < Q; i++ {
		scanner.Scan()
		line := scanner.Text()
		parts := strings.Split(line, " ")

		switch parts[0] {
		case "1":
			stack = append(stack, parts[1])
		case "2":
			output = append(output, stack[len(stack)-1])
		case "3":
			stack = stack[:len(stack)-1]
		}
	}

	fmt.Println(strings.Join(output, "\n"))
}
