import * as readline from 'readline';

class SegmentTree {
    private size: number;
    private tree: number[];

    constructor(n: number) {
        this.size = 1;
        while (this.size < n) this.size <<= 1;
        this.tree = Array(this.size * 2).fill(0);
    }

    // 更新処理: A[pos] = value
    update(pos: number, value: number): void {
        pos += this.size;
        this.tree[pos] = value;
        while (pos > 1) {
            pos >>= 1;
            this.tree[pos] = Math.max(this.tree[pos * 2], this.tree[pos * 2 + 1]);
        }
    }

    // クエリ処理: 区間 [l, r) の最大値を取得
    query(l: number, r: number): number {
        l += this.size;
        r += this.size;
        let res = 0;
        while (l < r) {
            if (l % 2 === 1) res = Math.max(res, this.tree[l++]);
            if (r % 2 === 1) res = Math.max(res, this.tree[--r]);
            l >>= 1;
            r >>= 1;
        }
        return res;
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let n = 0,
    q = 0,
    count = 0;
const queries: string[] = [];

rl.on('line', (line) => {
    if (count === 0) {
        [n, q] = line.split(' ').map(Number);
    } else {
        queries.push(line);
        if (queries.length === q) rl.close();
    }
    count++;
});

rl.on('close', () => {
    const seg = new SegmentTree(n);
    const result: number[] = [];

    for (const query of queries) {
        const parts = query.split(' ').map(Number);
        if (parts[0] === 1) {
            const [, pos, x] = parts;
            seg.update(pos - 1, x); // 0-based
        } else {
            const [, l, r] = parts;
            result.push(seg.query(l - 1, r - 1));
        }
    }

    console.log(result.join('\n'));
});
