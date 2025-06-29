import sys
input = sys.stdin.read

class FenwickTree:
    def __init__(self, size: int):
        self.n = size
        self.tree = [0] * (size + 1)  # 1-indexed

    def add(self, index: int, value: int):
        while index <= self.n:
            self.tree[index] += value
            index += index & -index

    def sum(self, index: int) -> int:
        result = 0
        while index > 0:
            result += self.tree[index]
            index -= index & -index
        return result

    def range_sum(self, left: int, right: int) -> int:
        return self.sum(right - 1) - self.sum(left - 1)

def main():
    data = input().split()
    N = int(data[0])
    
    bit = FenwickTree(N)
    A = [0] * (N + 1)  # 1-indexed

    res: list[str] = []  # Type hint for the list of strings
    idx = 2
    while idx < len(data):
        if data[idx] == '1':
            pos = int(data[idx + 1])
            x = int(data[idx + 2])
            diff = x - A[pos]
            A[pos] = x
            bit.add(pos, diff)
            idx += 3
        else:  # '2'
            l = int(data[idx + 1])
            r = int(data[idx + 2])
            res.append(str(bit.range_sum(l, r)))
            idx += 3

    print('\n'.join(res))

if __name__ == "__main__":
    main()
