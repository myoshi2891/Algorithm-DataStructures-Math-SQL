const fs = require('fs');
main(fs.readFileSync('/dev/stdin', 'utf8'));

function main(input) {
    const lines = input.trim().split('\n');
    const N = parseInt(lines[0]);
    const A = lines[1].split(' ').map(Number);

    const memo = Array.from({ length: N }, () => Array(N).fill(undefined));

    // 再帰関数: 区間 [l, r] のときの最適スコア
    function dfs(l, r) {
        if (l === r) return A[l]; // 最下段でスコア確定
        if (memo[l][r] !== undefined) return memo[l][r];

        const turnIsTaro = (r - l + 1) % 2 === N % 2;

        if (turnIsTaro) {
            // 太郎の手番（スコア最大化）
            memo[l][r] = Math.max(dfs(l + 1, r), dfs(l, r - 1));
        } else {
            // 次郎の手番（スコア最小化）
            memo[l][r] = Math.min(dfs(l + 1, r), dfs(l, r - 1));
        }

        return memo[l][r];
    }

    const result = dfs(0, N - 1);
    console.log(result);
}
