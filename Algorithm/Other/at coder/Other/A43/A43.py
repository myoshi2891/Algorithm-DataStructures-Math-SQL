import sys

def main():
    input = sys.stdin.readline
    N, L = map(int, input().split())
    
    max_time = 0
    for _ in range(N):
        A_str, B = input().split()
        A = int(A_str)
        if B == 'E':
            time = L - A
        else:  # B == 'W'
            time = A
        if time > max_time:
            max_time = time
    
    print(max_time)

if __name__ == '__main__':
    main()
