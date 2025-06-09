package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strconv"
	"strings"
)

func insertSorted(cards *[]int, x int) {
	idx := sort.Search(len(*cards), func(i int) bool {
		return (*cards)[i] >= x
	})
	if idx == len(*cards) || (*cards)[idx] != x {
		*cards = append(*cards, 0)
		copy((*cards)[idx+1:], (*cards)[idx:])
		(*cards)[idx] = x
	}
}

func deleteSorted(cards *[]int, x int) {
	idx := sort.Search(len(*cards), func(i int) bool {
		return (*cards)[i] >= x
	})
	if idx < len(*cards) && (*cards)[idx] == x {
		*cards = append((*cards)[:idx], (*cards)[idx+1:]...)
	}
}

func lowerBound(cards []int, x int) int {
	idx := sort.Search(len(cards), func(i int) bool {
		return cards[i] >= x
	})
	if idx < len(cards) {
		return cards[idx]
	}
	return -1
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	Q, _ := strconv.Atoi(scanner.Text())

	cards := []int{}
	output := []string{}

	for i := 0; i < Q; i++ {
		scanner.Scan()
		parts := strings.Split(scanner.Text(), " ")
		t, _ := strconv.Atoi(parts[0])
		x, _ := strconv.Atoi(parts[1])

		switch t {
		case 1:
			insertSorted(&cards, x)
		case 2:
			deleteSorted(&cards, x)
		case 3:
			res := lowerBound(cards, x)
			output = append(output, strconv.Itoa(res))
		}
	}

	fmt.Println(strings.Join(output, "\n"))
}
