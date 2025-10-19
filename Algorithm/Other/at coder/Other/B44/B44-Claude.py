# この問題は、行の交換操作と値の取得操作を効率的に処理する必要があります。行を実際に交換するのではなく、行のインデックスをマッピングすることで効率化します。このソリューションの特徴：

# ## アルゴリズム設計
# - **行マッピング配列**を使用して、実際の行の交換を避けています
# - `row_mapping[i]`は現在のi行目が元々何行目だったかを記録
# - 交換操作ではマッピングのみを更新（O(1)時間）

# ## 型安全性
# - すべての変数に型アノテーションを明示
# - `List[int]`, `List[List[int]]`などの複合型も適切に定義
# - Pylanceの型チェックに対応

# ## 計算量効率
# - **時間計算量**: O(N² + Q)
#   - 初期化: O(N²)
#   - 各操作: O(1)
# - **空間計算量**: O(N²)
#   - マトリックス: O(N²)
#   - マッピング配列: O(N)

# ## パフォーマンス最適化
# - 行の実際の交換を避けることで、各交換操作をO(1)で実行
# - メモリ使用量を最小限に抑制
# - 入力の1-indexedから0-indexedへの変換を適切に処理

# この実装により、制約（N≤500, Q≤200000）を満たしながら効率的に処理できます。

from typing import List


def process_matrix_operations() -> None:
    """
    N×Nのマス目に対する行交換操作と値取得操作を処理する
    
    時間計算量: O(N^2 + Q) - 初期化にO(N^2)、各操作にO(1)
    空間計算量: O(N^2) - マトリックスとマッピング配列
    """
    # 入力読み込み
    N: int = int(input())
    
    # マトリックスの読み込み - O(N^2)時間、O(N^2)空間
    matrix: List[List[int]] = []
    for _ in range(N):
        row: List[int] = list(map(int, input().split()))
        matrix.append(row)
    
    # 行のマッピング配列 - 実際の行番号を管理 - O(N)空間
    # row_mapping[i] = 現在のi行目が元々何行目だったか（0-indexed）
    row_mapping: List[int] = list(range(N))
    
    Q: int = int(input())
    
    # クエリ処理 - O(Q)時間
    for _ in range(Q):
        query: List[int] = list(map(int, input().split()))
        
        if query[0] == 1:  # 交換操作
            x: int = query[1] - 1  # 0-indexedに変換
            y: int = query[2] - 1  # 0-indexedに変換
            
            # 行のマッピングを交換 - O(1)時間
            row_mapping[x], row_mapping[y] = row_mapping[y], row_mapping[x]
            
        elif query[0] == 2:  # 取得操作
            x: int = query[1] - 1  # 0-indexedに変換
            y: int = query[2] - 1  # 0-indexedに変換
            
            # 実際の行を取得して値を出力 - O(1)時間
            actual_row: int = row_mapping[x]
            result: int = matrix[actual_row][y]
            print(result)


if __name__ == "__main__":
    process_matrix_operations()