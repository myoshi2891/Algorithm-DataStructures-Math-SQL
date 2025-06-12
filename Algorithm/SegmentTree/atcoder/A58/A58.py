import sys
input = sys.stdin.read

class SegmentTree:
    def __init__(self, n):
        self.size = 1
        while self.size < n:
            self.size <<= 1
        self.tree = [0] * (2 * self.size)
    
    def update(self, pos, value):
        pos += self.size
        self.tree[pos] = value
        while pos > 1:
            pos >>= 1
            self.tree[pos] = max(self.tree[2 * pos], self.tree[2 * pos + 1])
    
    def query(self, l, r):
        l += self.size
        r += self.size
        res = 0
        while l < r:
            if l % 2 == 1:
                res = max(res, self.tree[l])
                l += 1
            if r % 2 == 1:
                r -= 1
                res = max(res, self.tree[r])
            l >>= 1
            r >>= 1
        return res

def main():
    data = input().split()
    n, q = int(data[0]), int(data[1])
    seg = SegmentTree(n)
    idx = 2
    res = []
    for _ in range(q):
        c = int(data[idx])
        if c == 1:
            pos = int(data[idx + 1]) - 1  # 0-based index
            x = int(data[idx + 2])
            seg.update(pos, x)
            idx += 3
        else:
            l = int(data[idx + 1]) - 1  # 0-based
            r = int(data[idx + 2]) - 1
            res.append(str(seg.query(l, r)))
            idx += 3
    print("\n".join(res))

if __name__ == "__main__":
    main()
