def main():
    import sys
    input = sys.stdin.read
    data = input().split()
    
    N = int(data[0])
    target = data[1]
    colors = list(data[2])

    combine = {
        'WW': 'W',
        'BB': 'R',
        'RR': 'B',
        'WB': 'B',
        'BW': 'B',
        'BR': 'W',
        'RB': 'W',
        'RW': 'R',
        'WR': 'R',
    }

    current = colors[0]
    for i in range(1, N):
        pair = current + colors[i]
        current = combine[pair]

    print("Yes" if current == target else "No")

if __name__ == '__main__':
    main()
