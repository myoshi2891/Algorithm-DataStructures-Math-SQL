// # JavaScript コーディング問題解析・実装・検証

// ## 1. 問題分析結果

// ### 競技プログラミング視点
// - **制約**: m×n行列、1≤m,n≤200 → 最大40,000要素
// - **要求**: in-place操作でO(1)空間計算量が理想
// - **キーポイント**: 0の位置情報を元の行列内で管理する必要

// ### 業務開発視点
// - **可読性**: 複数パスでの処理が理解しやすい
// - **保守性**: 各段階が明確に分離された設計
// - **エラーハンドリング**: 入力検証と境界条件の適切な処理

// ### JavaScript特有分析
// - **V8最適化**: 連続メモリアクセス、型安定性が重要
// - **配列操作**: インデックスアクセスが最効率
// - **GC負荷**: 新規オブジェクト生成を最小化

// ## 2. アルゴリズム比較表

// |アプローチ|時間計算量|空間計算量|JS実装コスト|可読性|V8最適化|備考|
// |-----|-----|-----|-------|---|-----|--|
// |追加配列使用|O(mn)|O(m+n)|低|★★★|適|メモリ使用量大|
// |第一行列使用|O(mn)|O(1)|中|★★☆|適|Follow-up要求満たす|
// |ビット操作|O(mn)|O(1)|高|★☆☆|不適|JSでは非効率|

// ## 3. 採用アルゴリズムと根拠

// **選択**: 第一行・第一列をフラグとして使用するO(1)空間解法
// - **理由**: Follow-upのO(1)空間要求を満たし、実装効率と可読性のバランスが良好
// - **JavaScript最適化戦略**:
//   - 3パス処理で局所性を活用
//   - 条件分岐最小化でインライン化促進
//   - プリミティブ値のみ使用でGC負荷軽減

// ## 4. 実装詳細

/**
 * Set Matrix Zeroes - O(1) Space Solution
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 * @complexity Time: O(mn), Space: O(1)
 */
var setZeroes = function (matrix) {
    // 入力検証
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return;
    }

    const m = matrix.length;
    const n = matrix[0].length;

    // 第一行・第一列に元々0があるかを記録
    let firstRowHasZero = false;
    let firstColHasZero = false;

    // 第一行の0チェック
    for (let j = 0; j < n; j++) {
        if (matrix[0][j] === 0) {
            firstRowHasZero = true;
            break;
        }
    }

    // 第一列の0チェック
    for (let i = 0; i < m; i++) {
        if (matrix[i][0] === 0) {
            firstColHasZero = true;
            break;
        }
    }

    // 第一行・第一列をフラグとして使用
    // matrix[i][0] = 0 なら i行目を0にする
    // matrix[0][j] = 0 なら j列目を0にする
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (matrix[i][j] === 0) {
                matrix[i][0] = 0; // i行目のフラグ
                matrix[0][j] = 0; // j列目のフラグ
            }
        }
    }

    // フラグに基づいて行・列を0に設定（第一行・列以外）
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (matrix[i][0] === 0 || matrix[0][j] === 0) {
                matrix[i][j] = 0;
            }
        }
    }

    // 第一行を0に設定（必要な場合）
    if (firstRowHasZero) {
        for (let j = 0; j < n; j++) {
            matrix[0][j] = 0;
        }
    }

    // 第一列を0に設定（必要な場合）
    if (firstColHasZero) {
        for (let i = 0; i < m; i++) {
            matrix[i][0] = 0;
        }
    }
};

// 使用例とテスト
function testSetZeroes() {
    // Example 1
    const matrix1 = [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
    ];
    console.log('Input 1:', JSON.stringify(matrix1));
    setZeroes(matrix1);
    console.log('Output 1:', JSON.stringify(matrix1));
    // Expected: [[1,0,1],[0,0,0],[1,0,1]]

    // Example 2
    const matrix2 = [
        [0, 1, 2, 0],
        [3, 4, 5, 2],
        [1, 3, 1, 5],
    ];
    console.log('Input 2:', JSON.stringify(matrix2));
    setZeroes(matrix2);
    console.log('Output 2:', JSON.stringify(matrix2));
    // Expected: [[0,0,0,0],[0,4,5,0],[0,3,1,0]]

    // Edge case: 単一要素
    const matrix3 = [[1]];
    console.log('Input 3:', JSON.stringify(matrix3));
    setZeroes(matrix3);
    console.log('Output 3:', JSON.stringify(matrix3));

    // Edge case: 全て0
    const matrix4 = [
        [0, 0],
        [0, 0],
    ];
    console.log('Input 4:', JSON.stringify(matrix4));
    setZeroes(matrix4);
    console.log('Output 4:', JSON.stringify(matrix4));
}

// パフォーマンス測定用ヘルパー（開発時用）
function generateTestMatrix(m, n, zeroRate = 0.1) {
    const matrix = Array(m)
        .fill(null)
        .map(() => Array(n).fill(1));
    const zeroCount = Math.floor(m * n * zeroRate);

    for (let k = 0; k < zeroCount; k++) {
        const i = Math.floor(Math.random() * m);
        const j = Math.floor(Math.random() * n);
        matrix[i][j] = 0;
    }

    return matrix;
}
// ## 5. JavaScript特有最適化ポイント

// ### V8エンジン最適化
// - **インライン化促進**: 小さな関数と最小限の条件分岐
// - **Hidden Class安定化**: 配列要素の型統一（number型のみ）
// - **効率的ループ**: forループでインデックスアクセス使用
// - **局所性活用**: 連続メモリアクセスパターン

// ### GC負荷軽減
// - **オブジェクト生成回避**: プリミティブ値のみ使用
// - **配列再利用**: 元の配列をin-place修正
// - **参照管理**: 不要な中間変数を最小化

// ## 6. パフォーマンス考察

// ### 理論計算量
// - **時間計算量**: O(mn) - 各要素を定数回アクセス
// - **空間計算量**: O(1) - 固定数の変数のみ使用

// ### JavaScript実測予想
// - **V8環境**: 3パス処理により高いキャッシュ効率
// - **メモリ効率**: 追加メモリ割り当てなしでGC圧迫回避
// - **実行速度**: インデックスアクセス主体で高速

// ### 改善余地
// - **SIMD最適化**: 大規模行列では並列処理の検討余地
// - **キャッシュ最適化**: ブロック単位処理による局所性向上
// - **条件分岐削減**: ビット演算による更なる高速化（可読性トレードオフ）

// ## 7. アルゴリズム動作原理

// 1. **フラグ収集**: 第一行・第一列の元の0状態を保存
// 2. **0検出**: 内部要素の0を見つけて第一行・列にマーキング
// 3. **ゼロ化実行**: フラグに基づいて内部要素を0に設定
// 4. **境界処理**: 保存した情報で第一行・列を適切に処理

// この解法はFollow-upの要求を完全に満たし、JavaScript環境での実行効率も最適化されています。
