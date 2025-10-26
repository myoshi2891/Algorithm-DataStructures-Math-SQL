const fs = require('fs');

const input = fs.readFileSync('/dev/stdin', 'utf-8').trim();

function caluculateNum(input) {
    const [N, Q] = input.split('\n')[0].split(' ');
    let arr = input.split('\n')[1].split(' ').map(Number);
    let LR = input
        .split('\n')
        .splice(2)
        .map((a) => a.split(' ').map(Number));

    let newArr = [0];
    let sum = 0;
    arr.map((num) => newArr.push((sum += num)));
    for (i = 0; i < LR.length; i++) {
        const [L, R] = LR[i];
        let total = newArr[R] - newArr[L - 1];
        console.log(total);
    }
}

caluculateNum(input);
