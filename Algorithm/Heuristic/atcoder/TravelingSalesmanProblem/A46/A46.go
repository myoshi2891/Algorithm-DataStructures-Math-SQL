package main

import (
	"bufio"
	"fmt"
	"math"
	"os"
	"strconv"
)

type City struct {
	x, y int
}

var (
	n     int
	cities []City
)

func readInt(scanner *bufio.Scanner) int {
	scanner.Scan()
	num, _ := strconv.Atoi(scanner.Text())
	return num
}

func dist(i, j int) int {
	dx := cities[i].x - cities[j].x
	dy := cities[i].y - cities[j].y
	return dx*dx + dy*dy
}

// 最近傍法で初期ツアー生成
func greedyTour() []int {
	visited := make([]bool, n)
	tour := make([]int, 0, n)
	tour = append(tour, 0)
	visited[0] = true
	for len(tour) < n {
		last := tour[len(tour)-1]
		best := -1
		bestDist := math.MaxInt
		for i := 0; i < n; i++ {
			if !visited[i] {
				d := dist(last, i)
				if d < bestDist {
					bestDist = d
					best = i
				}
			}
		}
		tour = append(tour, best)
		visited[best] = true
	}
	return tour
}

// 2-opt法による改善
func twoOpt(tour []int) []int {
	changed := true
	for changed {
		changed = false
		for i := 1; i < n-1; i++ {
			for j := i + 1; j < n; j++ {
				a, b := tour[i-1], tour[i]
				c, d := tour[j], tour[(j+1)%n]
				before := dist(a, b) + dist(c, d)
				after := dist(a, c) + dist(b, d)
				if after < before {
					reverse(tour, i, j)
					changed = true
				}
			}
		}
	}
	return tour
}

func reverse(tour []int, i, j int) {
	for i < j {
		tour[i], tour[j] = tour[j], tour[i]
		i++
		j--
	}
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Split(bufio.ScanWords)

	n = readInt(scanner)
	cities = make([]City, n)

	for i := 0; i < n; i++ {
		x := readInt(scanner)
		y := readInt(scanner)
		cities[i] = City{x, y}
	}

	tour := greedyTour()
	tour = twoOpt(tour)

	// 出力（1-indexed）
	for _, city := range tour {
		fmt.Println(city + 1)
	}
	fmt.Println(tour[0] + 1)
}
