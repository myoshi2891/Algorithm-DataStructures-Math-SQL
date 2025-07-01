import * as fs from 'fs';

const MOD = 1_000_000_007;

class FenwickTree {
    private n: number;
    private tree: number[];

    constructor(n: number) {
        this.n = n;
        this.tree = new Array(n + 2).fill(0);
    }

    add(i: number, x: number): void {
        i++;
        while (i <= this.n + 1) {
            this.tree[i] = (this.tree[i] + x) % MOD;
            i += i & -i;
        }
    }

    sum(i: number): number {
        i++;
        let res = 0;
        while (i > 0) {
            res = (res + this.tree[i]) % MOD;
            i -= i & -i;
        }
        return res;
    }

    rangeSum(l: number, r: number): number {
        return (this.sum(r) - this.sum(l - 1) + MOD) % MOD;
    }
}

function lowerBound(arr: number[], x: number): number {
    let left = 0,
        right = arr.length;
    while (left < right) {
        const mid = (left + right) >> 1;
        if (arr[mid] < x) left = mid + 1;
        else right = mid;
    }
    return left;
}

function upperBound(arr: number[], x: number): number {
    let left = 0,
        right = arr.length;
    while (left < right) {
        const mid = (left + right) >> 1;
        if (arr[mid] <= x) left = mid + 1;
        else right = mid;
    }
    return left;
}

// Main function
function main(): void {
    const input = fs.readFileSync('/dev/stdin', 'utf8');
    const lines = input.trim().split('\n');

    const [N, W, L, R] = lines[0].split(' ').map(Number);
    const X = lines[1].split(' ').map(Number);

    // 全地点（0, 足場, W）を座標圧縮用にソート
    const positions = [0, ...X, W];
    positions.sort((a, b) => a - b);

    const posToIndex = new Map<number, number>();
    positions.forEach((v, i) => posToIndex.set(v, i));

    const n = positions.length;
    const dp = new Array(n).fill(0);
    dp[0] = 1;

    const ft = new FenwickTree(n);
    ft.add(0, 1);

    for (let i = 1; i < n; i++) {
        const cur = positions[i];
        const left = cur - R;
        const right = cur - L;

        const li = lowerBound(positions, left);
        const ri = upperBound(positions, right) - 1;

        if (li <= ri) {
            const val = ft.rangeSum(li, ri);
            dp[i] = val;
            ft.add(i, val);
        }
    }

    console.log(dp[n - 1]);
}

main();

// 📌 解法ポイント
// 座標圧縮：Wが大きすぎる（最大10⁹）ので使う点だけに圧縮
// DP + BIT：dp[i] = Σ dp[j], 条件：L ≤ pos[i] - pos[j] ≤ R → これを BIT で高速集計
// 計算量：O(N log N) で N ≤ 150,000 に対応

