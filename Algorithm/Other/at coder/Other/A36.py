def main():
    N, K = map(int, input().split())
    min_steps = 2 * (N - 1)

    if K >= min_steps and (K - min_steps) % 2 == 0:
        print("Yes")
    else:
        print("No")

if __name__ == "__main__":
    main()
