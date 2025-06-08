import * as fs from 'fs';

// 標準入力から全ての入力を読み込む
const input: string[] = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');

// クエリ数
const Q: number = parseInt(input[0], 10);

// 成績を保持するマップ（名前 => 点数）
const scores: Map<string, number> = new Map();

// 出力結果を格納する配列
const output: number[] = [];

for (let i = 1; i <= Q; i++) {
    const parts: string[] = input[i].split(' ');
    const queryType: number = parseInt(parts[0], 10);

    if (queryType === 1) {
        const name: string = parts[1];
        const score: number = parseInt(parts[2], 10);
        scores.set(name, score);
    } else if (queryType === 2) {
        const name: string = parts[1];
        const result: number | undefined = scores.get(name);
        if (result !== undefined) {
            output.push(result);
        }
    }
}

// 出力
console.log(output.join('\n'));
