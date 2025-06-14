function main() {
    const input = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(/\s+/);
    const N = parseInt(input[0], 10);
    const A = input.slice(1).map(Number);

    const stack = []; // インデックスを保持（1-based）
    const result = Array(N).fill(-1);

    for (let i = 0; i < N; i++) {
        while (stack.length > 0 && A[stack[stack.length - 1]] <= A[i]) {
            stack.pop();
        }
        if (stack.length > 0) {
            result[i] = stack[stack.length - 1] + 1; // 1-based に変換
        }
        // 現在のインデックスをスタックに追加
        stack.push(i);
    }

    console.log(result.join(' '));
}

main();
