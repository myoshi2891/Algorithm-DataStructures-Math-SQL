const fs = require('fs');

function main(input) {
    const [N, A, B] = input.trim().split(' ').map(Number);
    const dp = new Array(N + 1).fill(false);

    // dp[i] = true なら i 個の石が残っている状態で先手が勝てる
    for (let i = 0; i <= N; i++) {
        if (i >= A && !dp[i - A]) dp[i] = true;
        else if (i >= B && !dp[i - B]) dp[i] = true;
        // どちらもできず、または遷移先が全て勝ち状態なら false（負け状態）
    }

    console.log(dp[N] ? 'First' : 'Second');
}

// 標準入力を読み取って実行（AtCoder形式）
main(fs.readFileSync('/dev/stdin', 'utf8'));
