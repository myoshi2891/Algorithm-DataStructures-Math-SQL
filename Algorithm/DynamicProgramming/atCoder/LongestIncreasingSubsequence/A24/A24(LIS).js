function main(input) {
    const lines = input.trim().split('\n');
    const N = parseInt(lines[0]);
    const A = lines[1].split(' ').map(Number);

    const dp = []; // 値だけ（末尾最小）
    const dpIndex = []; // dp[i] のときの A のインデックス
    const prevIndex = new Array(N).fill(-1); // 復元のためのつながり

    for (let i = 0; i < N; i++) {
        let left = 0,
            right = dp.length;
        while (left < right) {
            let mid = Math.floor((left + right) / 2);
            if (dp[mid] < A[i]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        // dp の更新または拡張
        if (left === dp.length) {
            dp.push(A[i]);
            dpIndex.push(i);
        } else {
            dp[left] = A[i];
            dpIndex[left] = i;
        }

        // prevIndex に直前の要素を記録
        if (left > 0) {
            prevIndex[i] = dpIndex[left - 1];
        }
    }

    // LIS を復元
    const lis = [];
    let index = dpIndex[dp.length - 1];
    while (index !== -1) {
        lis.push(A[index]);
        index = prevIndex[index];
    }
    lis.reverse();

    console.log(dp.length); // 長さ
    console.log(lis.join(' ')); // 実際の列
}

// Node.js 実行環境用
const fs = require('fs');
main(fs.readFileSync('/dev/stdin', 'utf8'));
