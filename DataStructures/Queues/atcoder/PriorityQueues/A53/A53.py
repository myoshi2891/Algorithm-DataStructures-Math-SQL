# import sys
# import heapq

# def main():
#     input = sys.stdin.readline
#     Q = int(input())
#     heap = []
#     output = []

#     for _ in range(Q):
#         query = input().strip().split()
#         if query[0] == '1':
#             x = int(query[1])
#             heapq.heappush(heap, x)
#         elif query[0] == '2':
#             output.append(str(heap[0]))
#         elif query[0] == '3':
#             heapq.heappop(heap)

#     print('\n'.join(output))

# if __name__ == '__main__':
#     main()

# ✅ 修正版コード：sys.stdout.write 使用
import sys
import heapq

def main():
    input = sys.stdin.readline
    write = sys.stdout.write  # エイリアス化して高速化
    Q = int(input())
    heap = []
    output = []

    for _ in range(Q):
        query = input().split()
        if query[0] == '1':
            heapq.heappush(heap, int(query[1]))
        elif query[0] == '2':
            output.append(str(heap[0]))
        elif query[0] == '3':
            heapq.heappop(heap)

    # 改行付きでまとめて出力
    write('\n'.join(output) + '\n')

if __name__ == '__main__':
    main()
