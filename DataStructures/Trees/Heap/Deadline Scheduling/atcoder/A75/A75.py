import sys
import heapq
from typing import List, Tuple

def solve(n: int, problems: List[Tuple[int, int]]) -> int:
    # 締切Dで昇順ソート
    problems.sort(key=lambda x: x[1])

    total_time: int = 0
    max_heap: List[int] = []  # Pythonはmin-heapなので、-Tを使って最大ヒープにする

    for t, d in problems:
        total_time += t
        heapq.heappush(max_heap, -t)  # 最大ヒープとして扱うため -t

        if total_time > d:
            removed: int = -heapq.heappop(max_heap)  # 最大値（時間のかかる問題）を除く
            total_time -= removed

    return len(max_heap)

def main() -> None:
    input_data = sys.stdin.read().strip().splitlines()
    n: int = int(input_data[0])
    problems: List[Tuple[int, int]] = []

    for line in input_data[1:]:
        parts = line.split()
        if len(parts) == 2:
            problems.append((int(parts[0]), int(parts[1])))
        else:
            raise ValueError("Each line must contain exactly two integers")

    print(solve(n, problems))

if __name__ == "__main__":
    main()
