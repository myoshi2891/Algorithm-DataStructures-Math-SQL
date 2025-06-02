def main():
    import sys
    input = sys.stdin.read
    data = list(map(int, input().split()))
    
    N = data[0]
    M = data[1]
    B = data[2]
    
    A = data[3:3 + N]
    C = data[3 + N:]
    
    sumA = sum(A)
    sumC = sum(C)

    total = N * M * B + M * sumA + N * sumC
    print(total)

if __name__ == "__main__":
    main()
