
// * **制約**より `N ≤ 30` なので、**半分全列挙（Meet-in-the-middle）** を使って効率的に解を導きます。
// * 入力は `fs.readFileSync` を使って取得します。
// * 出力は `console.log` で行います。

// ---

// ### ✅ 解法：半分全列挙（Meet-in-the-middle）

// * 配列を2つに分割して、各部分集合和を列挙し、片方はソート・二分探索。

// ---

// ### ✅ コード

const fs = require('fs');

function getSubsetSums(arr) {
  const result = [];
  const n = arr.length;
  for (let bit = 0; bit < (1 << n); bit++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      if (bit & (1 << i)) sum += arr[i];
    }
    result.push(sum);
  }
  return result;
}

function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = (left + right) >> 1;
    if (arr[mid] === target) return true;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return false;
}

function main() {
  const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split(/\s+/).map(Number);
  const N = input[0];
  const K = input[1];
  const A = input.slice(2);

  const mid = Math.floor(N / 2);
  const left = A.slice(0, mid);
  const right = A.slice(mid);

  const leftSums = getSubsetSums(left);
  const rightSums = getSubsetSums(right);
  rightSums.sort((a, b) => a - b);

  for (const x of leftSums) {
    const remain = K - x;
    if (binarySearch(rightSums, remain)) {
      console.log("Yes");
      return;
    }
  }

  console.log("No");
}

main();

// ### ✅ 実行例

// 入力:

// ```
// 6 30
// 5 1 18 7 2 9
// ```

// 出力:

// ```
// Yes
// ```

// ---

// ### ✅ 時間・空間計算量

// * 時間: `O(2^(N/2) * log(2^(N/2)))` ≒ `2^15 * 15` → 高速（制限内）
// * 空間: `O(2^(N/2))` → 最大 32,768 個（メモリ制限内）

