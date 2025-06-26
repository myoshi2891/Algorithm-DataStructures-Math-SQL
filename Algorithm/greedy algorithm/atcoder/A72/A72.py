import sys
from itertools import combinations

def main():
    input = sys.stdin.read
    data = input().strip().split('\n')
    
    H, W, K = map(int, data[0].split())
    grid = [list(row) for row in data[1:]]
    
    max_black = 0

    for bit in range(1 << H):
        painted_rows = []
        for i in range(H):
            if (bit >> i) & 1:
                painted_rows.append(i)
        
        row_count = len(painted_rows)
        if row_count > K:
            continue  # 操作回数オーバー

        # 行を黒く塗ったグリッドを作る
        painted = [row[:] for row in grid]  # deepcopy
        for i in painted_rows:
            painted[i] = ['#'] * W
        
        # 各列の黒マス数を数える
        black_count_per_col = [0] * W
        for j in range(W):
            for i in range(H):
                if painted[i][j] == '#':
                    black_count_per_col[j] += 1

        # 残りの K-row_count 回で最も gain の大きい列を選ぶ
        column_gain = []
        for j in range(W):
            gain = H - black_count_per_col[j]  # 黒く塗れば gain だけ黒が増える
            column_gain.append((gain, j))
        
        column_gain.sort(reverse=True)
        remaining_ops = K - row_count
        columns_to_paint = set()
        for i in range(min(remaining_ops, W)):
            columns_to_paint.add(column_gain[i][1])

        # 最終的な黒マス数を数える
        total_black = 0
        for i in range(H):
            for j in range(W):
                if painted[i][j] == '#' or j in columns_to_paint:
                    total_black += 1
        
        max_black = max(max_black, total_black)

    print(max_black)

if __name__ == "__main__":
    main()
