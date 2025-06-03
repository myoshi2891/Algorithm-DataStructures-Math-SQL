import sys
import math
import time

sys.setrecursionlimit(10000)

# --- 入力 ---
N = int(sys.stdin.readline())
cities = [tuple(map(int, sys.stdin.readline().split())) for _ in range(N)]

# --- 距離関数（平方ユークリッド距離） ---
def dist(i, j):
    dx = cities[i][0] - cities[j][0]
    dy = cities[i][1] - cities[j][1]
    return dx * dx + dy * dy

# --- 初期解：貪欲法（最近傍法） ---
def greedy_tour():
    visited = [False] * N
    tour = [0]  # 都市1（インデックス0）からスタート
    visited[0] = True
    for _ in range(N - 1):
        last = tour[-1]
        next_city = min(
            ((i, dist(last, i)) for i in range(N) if not visited[i]),
            key=lambda x: x[1]
        )[0]
        tour.append(next_city)
        visited[next_city] = True
    return tour

# --- 2-opt法 ---
def two_opt(tour):
    improved = True
    while improved:
        improved = False
        for i in range(1, N - 2):
            for j in range(i + 1, N - 1):
                a, b = tour[i - 1], tour[i]
                c, d = tour[j], tour[j + 1]
                before = dist(a, b) + dist(c, d)
                after = dist(a, c) + dist(b, d)
                if after < before:
                    tour[i:j + 1] = reversed(tour[i:j + 1])
                    improved = True
        # optional: break early if time is tight
    return tour

# --- 実行 ---
start_time = time.time()

tour = greedy_tour()
tour = two_opt(tour)

# --- 出力（都市番号を1-indexedで） ---
for city in tour:
    print(city + 1)
print(tour[0] + 1)  # 最後に都市1へ戻る

# --- optional: debug info ---
# print("Total squared distance:", sum(dist(tour[i], tour[(i+1)%N]) for i in range(N)))
# print("Time used:", time.time() - start_time)
