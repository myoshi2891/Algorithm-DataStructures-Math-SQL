function compressArray(A: number[]): void {
    // ユニークな値を取り出してソート
    const sortedUnique = Array.from(new Set(A)).sort((a, b) => a - b);

    // 値に対するランクをマップに格納
    const rankMap = new Map<number, number>();
    sortedUnique.forEach((value, index) => {
        rankMap.set(value, index + 1);
    });

    // 元の順番でランクを適用
    const B = A.map((value) => rankMap.get(value)!);

    // 結果を出力
    console.log(B.join(' '));
}

const fs = require('fs');
const input = fs.readFileSync('/dev/stdin', 'utf-8').trim();
const lines = input.split('\n');
const A = lines[1].split(' ').map(Number);

compressArray(A);
