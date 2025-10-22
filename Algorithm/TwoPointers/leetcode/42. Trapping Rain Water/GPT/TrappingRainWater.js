// 以下は、クラスを使わずに関数ベースで実装した **"Trapping Rain Water"** のJavaScriptコードです。
// 時間計算量・メモリ消費を意識し、**O(n)** 時間・**O(1)** 追加メモリで動作する **two-pointer法** を採用しています。

// ```javascript
/**
 * Trapping Rain Water
 * @param {number[]} height - 各位置の柱の高さを表す配列
 * @returns {number} - 溜まる水の総量
 *
 * 制約:
 * - 1 <= height.length <= 2 * 10^4
 * - 0 <= height[i] <= 10^5
 *
 * 時間計算量: O(n)  (nは配列の長さ)
 * 空間計算量: O(1)  (定数メモリ)
 */
function trap(height) {
    const n = height.length;
    if (n < 3) return 0; // 3未満では水は溜まらない

    let left = 0; // 左ポインタ
    let right = n - 1; // 右ポインタ
    let leftMax = 0; // 左側で見た最大の高さ
    let rightMax = 0; // 右側で見た最大の高さ
    let water = 0; // 溜まった水の総量

    // 左右から中央に向かってポインタを進める
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) {
                leftMax = height[left];
            } else {
                water += leftMax - height[left];
            }
            left++;
        } else {
            if (height[right] >= rightMax) {
                rightMax = height[right];
            } else {
                water += rightMax - height[right];
            }
            right--;
        }
    }
    return water;
}

// 実行例（LeetCodeのテスト用）
// console.log(trap([0,1,0,2,1,0,1,3,2,1,2,1])); // 6
// console.log(trap([4,2,0,3,2,5])); // 9
// ```

// ---

// ### 実装のポイント

// 1. **Two-pointer法**

//    * 左右からポインタを動かしつつ、各位置での「溜まる水」を計算。
//    * 高さの小さい側から動かすことで、必要な境界条件を簡略化できます。

// 2. **時間・メモリ効率**

//    * 時間計算量 **O(n)**: 各要素を1回ずつ処理。
//    * 空間計算量 **O(1)**: 入力配列以外のメモリ使用は定数個の変数のみ。

// 3. **境界条件**

//    * 長さが3未満の場合は水が溜まらないため即0を返す。
