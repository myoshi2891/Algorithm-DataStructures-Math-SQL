function canAchieveK(
    N: number,
    K: number,
    A: number[],
    B: number[],
    C: number[],
    D: number[],
): void {
    const AB_set: Set<number> = new Set();

    // AとBの全ペアの和をSetに格納
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            AB_set.add(A[i] + B[j]);
        }
    }

    // CとDの全ペアの和を計算し、K - (C[i] + D[j]) がAB_setに存在するかチェック
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            if (AB_set.has(K - (C[i] + D[j]))) {
                console.log('Yes');
                return;
            }
        }
    }

    console.log('No');
}

// 標準入力を受け取る (Node.js環境を想定)
function main(input: string) {
    const lines = input.trim().split('\n');
    const [N, K] = lines[0].split(' ').map(Number);
    const A = lines[1].split(' ').map(Number);
    const B = lines[2].split(' ').map(Number);
    const C = lines[3].split(' ').map(Number);
    const D = lines[4].split(' ').map(Number);

    canAchieveK(N, K, A, B, C, D);
}

// 実行用 (Node.js環境で`cat input.txt | node script.js`のように実行)
if (require.main === module) {
    let input = '';
    process.stdin.on('data', (chunk) => {
        input += chunk;
    });
    process.stdin.on('end', () => {
        main(input);
    });
}
