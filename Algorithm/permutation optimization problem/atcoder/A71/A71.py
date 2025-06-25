import sys

def main():
    input = sys.stdin.read
    data = input().strip().split()
    
    N = int(data[0])
    A = list(map(int, data[1:N+1]))
    B = list(map(int, data[N+1:]))

    A.sort(reverse=True)  # 難易度：降順
    B.sort()              # 気温：昇順

    total_effort = sum(a * b for a, b in zip(A, B))
    print(total_effort)

if __name__ == "__main__":
    main()
