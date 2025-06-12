const fs = require("fs");

const input = fs.readFileSync("/dev/stdin", "utf8").trim().split("\n");
const [N, Q] = input[0].split(" ").map(Number);

class SegmentTree {
  constructor(size) {
    this.N = 1;
    while (this.N < size) this.N <<= 1;
    this.data = Array(this.N * 2).fill(0);
  }

  // 値を index に設定する（index は 0-based）
  update(index, value) {
    index += this.N;
    this.data[index] = value;
    while (index > 1) {
      index >>= 1;
      this.data[index] = Math.max(this.data[index * 2], this.data[index * 2 + 1]);
    }
  }

  // [l, r) の最大値を取得（0-based）
  query(l, r) {
    let res = 0;
    l += this.N;
    r += this.N;
    while (l < r) {
      if (l % 2 === 1) res = Math.max(res, this.data[l++]);
      if (r % 2 === 1) res = Math.max(res, this.data[--r]);
      l >>= 1;
      r >>= 1;
    }
    return res;
  }
}

const seg = new SegmentTree(N);
const result = [];

for (let i = 1; i <= Q; i++) {
  const parts = input[i].split(" ").map(Number);
  if (parts[0] === 1) {
    const [_, pos, x] = parts;
    seg.update(pos - 1, x); // 0-based index
  } else {
    const [_, l, r] = parts;
    result.push(seg.query(l - 1, r - 1)); // 0-based, r-1は含まれない
  }
}

console.log(result.join("\n"));
