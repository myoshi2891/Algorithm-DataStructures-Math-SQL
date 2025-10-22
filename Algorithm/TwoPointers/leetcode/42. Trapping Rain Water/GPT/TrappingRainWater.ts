// では、先ほどの JavaScript 実装を **TypeScript 5.1** 用に書き直し、パラメーターと返却値の型を明確にした実装を示します。
// **O(n) 時間・O(1) 空間** の two-pointer 法を採用しています。

// ```typescript
/**
 * Trapping Rain Water
 * @param height - 各位置の柱の高さを表す配列
 * @returns 溜まる水の総量
 *
 * 制約:
 * - 1 <= height.length <= 2 * 10^4
 * - 0 <= height[i] <= 10^5
 *
 * 時間計算量: O(n)  (nは配列の長さ)
 * 空間計算量: O(1)  (定数メモリ)
 */
function trapGPT(height: number[]): number {
    const n: number = height.length;
    if (n < 3) return 0; // 3未満では水は溜まらない

    let left: number = 0; // 左ポインタ
    let right: number = n - 1; // 右ポインタ
    let leftMax: number = 0; // 左側で見た最大の高さ
    let rightMax: number = 0; // 右側で見た最大の高さ
    let water: number = 0; // 溜まった水の総量

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

// 実行例（LeetCodeテスト用）
// console.log(trap([0,1,0,2,1,0,1,3,2,1,2,1])); // 6
// console.log(trap([4,2,0,3,2,5])); // 9
// ```

// ---

// ### 実装の特徴

// 1. **型安全**

//    * `height: number[]` と `number` の戻り値を明示。
//    * LeetCode の TypeScript 環境にそのままコピペして利用可能。

// 2. **性能**

//    * **時間計算量 O(n)** → 各インデックスを最大1回ずつ処理。
//    * **空間計算量 O(1)** → 補助配列を使わず、ポインタと最大値だけ保持。

// 3. **動作原理**

//    * 左右のポインタから中央に向けて進め、
//      高さの小さい方を基準に「左側最大値」または「右側最大値」から差を計算。
