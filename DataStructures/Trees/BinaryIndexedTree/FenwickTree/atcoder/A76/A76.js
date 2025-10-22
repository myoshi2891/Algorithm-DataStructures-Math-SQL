const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const MOD = 1_000_000_007;

rl.once('line', (line1) => {
    const [N, W, L, R] = line1.trim().split(' ').map(Number);
    rl.once('line', (line2) => {
        const X = line2.trim().split(' ').map(Number);

        // 座標圧縮: 0 (スタート), 全ての足場, W (ゴール)
        const positions = [0, ...X, W];
        positions.sort((a, b) => a - b);
        const indexMap = new Map();
        positions.forEach((v, i) => indexMap.set(v, i));

        const n = positions.length;
        const dp = Array(n).fill(0);
        dp[0] = 1;

        // Fenwick Tree 実装
        class FenwickTree {
            constructor(n) {
                this.n = n;
                this.tree = Array(n + 2).fill(0);
            }

            add(i, x) {
                i++;
                while (i <= this.n + 1) {
                    this.tree[i] = (this.tree[i] + x) % MOD;
                    i += i & -i;
                }
            }

            sum(i) {
                i++;
                let res = 0;
                while (i > 0) {
                    res = (res + this.tree[i]) % MOD;
                    i -= i & -i;
                }
                return res;
            }

            rangeSum(l, r) {
                return (this.sum(r) - this.sum(l - 1) + MOD) % MOD;
            }
        }

        const ft = new FenwickTree(n);
        ft.add(0, 1);

        for (let i = 1; i < n; i++) {
            const cur = positions[i];
            const left = cur - R;
            const right = cur - L;

            // 二分探索で到達可能な範囲 [left, right] を index に変換
            let li = lowerBound(positions, left);
            let ri = upperBound(positions, right) - 1;

            if (li <= ri) {
                const val = ft.rangeSum(li, ri);
                dp[i] = val;
                ft.add(i, val);
            }
        }

        console.log(dp[n - 1]);
        rl.close();
    });
});

// 二分探索: lower_bound
function lowerBound(arr, x) {
    let left = 0,
        right = arr.length;
    while (left < right) {
        let mid = (left + right) >> 1;
        if (arr[mid] < x) left = mid + 1;
        else right = mid;
    }
    return left;
}

// 二分探索: upper_bound
function upperBound(arr, x) {
    let left = 0,
        right = arr.length;
    while (left < right) {
        let mid = (left + right) >> 1;
        if (arr[mid] <= x) left = mid + 1;
        else right = mid;
    }
    return left;
}

// ✅ 解法概要（JavaScript）
// 出発点 0 と終点 W を含めた すべてのジャンプ可能な地点 を 昇順で管理。
// ジャンプ可能距離 [L, R] に対して、ある地点 pos[i] に到達するために、直前のどの地点 pos[j] からジャンプすればいいかを 二分探索で特定。
// 各地点の到達方法数 dp[i] を高速に合計管理するために、Binary Indexed Tree (Fenwick Tree) を使う。

// 🧠 考慮するポイント
// JavaScript では大きな座標 (W ≤ 10^9) を扱うが、実際にジャンプできる点は最大でも N + 2 個しかないため、インデックス圧縮が使える。
// dp[i]: i 番目の位置に到達する方法の数（mod 1e9+7）
// dp[0] = 1（スタート地点）

// ⏱️ 計算量
// 座標圧縮・二分探索・Fenwick Tree 操作：すべて O(N log N)
// N ≤ 150000 でも十分間に合います。
