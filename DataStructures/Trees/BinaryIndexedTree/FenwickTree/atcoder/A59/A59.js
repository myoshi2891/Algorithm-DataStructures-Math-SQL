class FenwickTree {
    constructor(size) {
        this.n = size;
        this.tree = new Array(size + 1).fill(0); // 1-indexed
    }

    add(index, value) {
        while (index <= this.n) {
            this.tree[index] += value;
            index += index & -index;
        }
    }

    sum(index) {
        let result = 0;
        while (index > 0) {
            result += this.tree[index];
            index -= index & -index;
        }
        return result;
    }

    rangeSum(left, right) {
        return this.sum(right - 1) - this.sum(left - 1);
    }
}

function main(input) {
    const lines = input.trim().split('\n');
    const [N, Q] = lines[0].split(' ').map(Number);
    const bit = new FenwickTree(N);
    const A = new Array(N + 1).fill(0); // 1-indexed

    const result = [];
    for (let i = 1; i <= Q; i++) {
        const parts = lines[i].split(' ').map(Number);
        if (parts[0] === 1) {
            const [_, pos, x] = parts;
            const diff = x - A[pos];
            A[pos] = x;
            bit.add(pos, diff);
        } else {
            const [_, l, r] = parts;
            result.push(bit.rangeSum(l, r));
        }
    }

    console.log(result.join('\n'));
}

// Node.jsの標準入力から呼び出す
require('readline')
    .createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    })
    .on('line', function (line) {
        inputLines.push(line);
    })
    .on('close', function () {
        main(inputLines.join('\n'));
    });

const inputLines = [];
