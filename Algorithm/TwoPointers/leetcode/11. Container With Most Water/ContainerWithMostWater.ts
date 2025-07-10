// 以下は、LeetCode 11「Container With Most Water」のTypeScriptでの効率的な解法です。処理時間とメモリ使用量を意識し、**O(n)** 時間・**O(1)** 空間のアルゴリズム（ツーポインター法）を用いています。

// ---

// ### ✅ **TypeScript 解法（Two Pointers アプローチ）**

// ```ts
function maxArea(height: number[]): number {
    let maxArea = 0;
    let left = 0;
    let right = height.length - 1;

    while (left < right) {
        const h = Math.min(height[left], height[right]);
        const w = right - left;
        const area = h * w;
        maxArea = Math.max(maxArea, area);

        // 高さの小さい方を内側に移動する
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }

    return maxArea;
}

// ### 🔍 **アルゴリズムの概要**

// * **初期化**: 両端（`left=0`, `right=n-1`）からスタート
// * **ループ処理**:

//   * 面積 = `min(height[left], height[right]) * (right - left)`
//   * 最大面積を更新
//   * より**低い方のポインタ**を内側に動かす（より高い線が存在する可能性があるため）

// ---

// ### 🧠 **時間・空間計算量**

// | 項目    | 値            |
// | ----- | ------------ |
// | 時間計算量 | O(n)         |
// | 空間計算量 | O(1)（追加領域なし） |

// ---

// ### ✅ **テスト例**

// ```ts
// console.log(maxArea([1,8,6,2,5,4,8,3,7])); // 49
// console.log(maxArea([1,1]));             // 1
// console.log(maxArea([4,3,2,1,4]));       // 16
// console.log(maxArea([1,2,1]));           // 2
// ```
