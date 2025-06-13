import * as fs from 'fs';

class FenwickTree {
    private n: number;
    private tree: number[];

    constructor(size: number) {
        this.n = size;
        this.tree = new Array(size + 1).fill(0); // 1-indexed
    }

    add(index: number, value: number): void {
        while (index <= this.n) {
            this.tree[index] += value;
            index += index & -index;
        }
    }

    sum(index: number): number {
        let result = 0;
        while (index > 0) {
            result += this.tree[index];
            index -= index & -index;
        }
        return result;
    }

    rangeSum(left: number, right: number): number {
        return this.sum(right - 1) - this.sum(left - 1);
    }
}

function main(input: string): void {
    const lines = input.trim().split('\n');
    const [N, Q] = lines[0].split(' ').map(Number);
    const bit = new FenwickTree(N);
    const A = new Array<number>(N + 1).fill(0); // 1-indexed

    const result: number[] = [];

    for (let i = 1; i <= Q; i++) {
        const parts = lines[i].split(' ').map(Number);
        if (parts[0] === 1) {
            const pos = parts[1];
            const x = parts[2];
            const diff = x - A[pos];
            A[pos] = x;
            bit.add(pos, diff);
        } else {
            const l = parts[1];
            const r = parts[2];
            result.push(bit.rangeSum(l, r));
        }
    }

    console.log(result.join('\n'));
}

// 実行
const input = fs.readFileSync('/dev/stdin', 'utf8');
main(input);
