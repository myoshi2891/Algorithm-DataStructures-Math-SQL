import * as fs from 'fs';

function main() {
    const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split(/\s+/);
    const N = parseInt(input[0]);
    const A = input.slice(1).map(Number);

    const stack: number[] = []; // インデックス（0-based）を保持
    const result: number[] = new Array(N).fill(-1);

    for (let i = 0; i < N; i++) {
        // スタックの株価が今の株価以下なら捨てる（意味がない）
        while (stack.length > 0 && A[stack[stack.length - 1]] <= A[i]) {
            stack.pop();
        }

        // 残っていれば、直近の大きい株価の日が起算日
        if (stack.length > 0) {
            result[i] = stack[stack.length - 1] + 1; // 出力は1-basedに
        }

        // 今の日をスタックに積む
        stack.push(i);
    }

    console.log(result.join(' '));
}

main();
