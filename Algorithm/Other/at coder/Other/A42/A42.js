const fs = require('fs');

// 入力読み取り
const input = fs.readFileSync(0, 'utf8').trim().split('\n');
const [N, K] = input[0].split(' ').map(Number);
const students = input.slice(1).map((line) => {
    const [a, b] = line.trim().split(' ').map(Number);
    return { a, b };
});

// 体力でソート
students.sort((s1, s2) => s1.a - s2.a);

let maxCount = 0;

// iを固定し、体力がK以内に収まる範囲を探索
for (let i = 0; i < N; i++) {
    let temp = [];

    for (let j = i; j < N; j++) {
        if (students[j].a - students[i].a > K) break;
        temp.push(students[j]);
    }

    // 気力でソートして、K以内の最大人数を数える
    temp.sort((s1, s2) => s1.b - s2.b);

    for (let l = 0; l < temp.length; l++) {
        for (let r = l; r < temp.length; r++) {
            if (temp[r].b - temp[l].b > K) break;
            maxCount = Math.max(maxCount, r - l + 1);
        }
    }
}

console.log(maxCount);
