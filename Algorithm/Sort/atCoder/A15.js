const fs = require("fs");

const input = fs.readFileSync("/dev/stdin", "utf-8").trim();

const [_, lineStr] = input.split("\n"); // 1行目(num)は不要なので _ にする
const lines = lineStr.split(" ").map(Number);

// ユニークな値をソートし、キー（1から始まる）を割り当てる
const uniqNum = [...new Set(lines)].sort((a, b) => a - b);

// Mapを使って、各数値のランキングを作成
const numMap = new Map(uniqNum.map((num, index) => [num, index + 1]));

// 変換した配列を取得
const result = lines.map((num) => numMap.get(num));

console.log(result.join(" "));
