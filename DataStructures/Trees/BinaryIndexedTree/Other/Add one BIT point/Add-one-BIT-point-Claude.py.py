# この問題は、Binary Indexed Tree (BIT) の木構造において、指定された頂点から根（頂点0）までの最短パス上の頂点を求める問題ですね。

# 問題を分析すると：
# 1. 頂点 `i` の親は `i + (i & -i)` で計算できます（`i & -i` は `i` を2で何回割れるかの2のべき乗）
# 2. 根に到達するまで親を辿っていけば、パス上の全頂点が得られます
# 3. 親の頂点番号が `n` を超えた場合は根（頂点0）に到達したとみなしますこのコードの実装について説明します：

# ## アルゴリズムの詳細

# 1. **親の計算方法**: `current + (current & -current)`
#    - `current & -current` は、`current` の最下位の立っているビットを取得
#    - これは「`current` を2で何回割れるか」の2のべき乗と同じ値

# 2. **パス探索**:
#    - 指定された頂点から開始して、親を順次辿る
#    - 親が配列サイズ `n` を超えた場合は根（頂点0）に到達したと判定
#    - 最終的に根（0）をパスに追加

# ## 計算量

# - **時間計算量**: O(log n) per query
#   - 各頂点から根までの距離は最大 log₂(n) なので
# - **空間計算量**: O(log n) 
#   - パスの長さが最大 log₂(n) + 1

# ## 入力例での動作確認

# 入力例 `8 6 1` の場合：
# - n=8, I=1 で頂点1から根までのパス
# - 1 → 2 (1 + 1) → 4 (2 + 2) → 0 (4 + 4 > 8)
# - 出力: `4\n1 2 4 0`

# このように、BIT木構造の特性を活用して効率的にパスを計算できます。

# Python 3.8.10では型ヒントで`list[int]`が使えないエラーですね。`typing`モジュールの`List`を使用する必要があります。修正しました。Python 3.8では`typing.List`を使用する必要があります。これで型エラーが解消されるはずです。

# 主な変更点：
# - `from typing import List` をインポート
# - `list[int]` → `List[int]` に変更

# これでPython 3.8.10で正常に動作するはずです。

# from typing import List

# def find_path_to_root(n: int, start_vertex: int) -> List[int]:
#     """
#     BIT木構造において、指定された頂点から根までの最短パス上の頂点を取得
    
#     Parameters:
#     n (int): 配列の長さ（BITのサイズ）
#     start_vertex (int): 開始頂点番号
    
#     Returns:
#     List[int]: パス上の頂点リスト（開始頂点から根までの順）
#     """
#     path = []
#     current = start_vertex
    
#     # 根（頂点0）に到達するまで親を辿る
#     while current != 0:
#         path.append(current)
#         # 親の計算: current + (current & -current)
#         # (current & -current) は currentを2で何回割れるかの2のべき乗
#         parent = current + (current & -current)
        
#         # 親が配列サイズnを超えた場合は根（0）に到達
#         if parent > n:
#             current = 0
#         else:
#             current = parent
    
#     # 最後に根（0）を追加
#     path.append(0)
#     return path


# def solve() -> None:
#     """
#     メイン処理関数
#     標準入力からクエリを読み取り、各クエリに対してBIT木の最短パスを出力
#     """
#     import sys
#     input = sys.stdin.readline
    
#     # クエリ数を読み取り
#     Q = int(input().strip())
    
#     # 各クエリを処理
#     for _ in range(Q):
#         line = input().strip().split()
#         n = int(line[0])  # 配列の長さ
#         I = int(line[1])  # 開始頂点
        
#         # パスを計算
#         path = find_path_to_root(n, I)
        
#         # 結果を出力
#         print(len(path))  # パス上の頂点数
#         print(' '.join(map(str, path)))  # パス上の頂点を空白区切りで出力


# if __name__ == "__main__":
#     solve()

#     Pythonの型ヒントの問題ですね。Python 3.8では`typing.List`を使い、より明確な型指定をしましょう。修正しました。変更点：

# 1. `path: List[int] = []` - 空のリストを明示的に`List[int]`型として宣言
# 2. `current: int = start_vertex` - 変数の型を明示
# 3. `parent: int = current + ...` - 変数の型を明示

# これでPylanceの型チェッカーが正しく型を認識し、エラーが解消されるはずです。Python 3.8.10での実行も問題なく動作します。

from typing import List

def find_path_to_root(n: int, start_vertex: int) -> List[int]:
    """
    BIT木構造において、指定された頂点から根までの最短パス上の頂点を取得
    
    Parameters:
    n (int): 配列の長さ（BITのサイズ）
    start_vertex (int): 開始頂点番号
    
    Returns:
    List[int]: パス上の頂点リスト（開始頂点から根までの順）
    """
    path: List[int] = []
    current: int = start_vertex
    
    # 根（頂点0）に到達するまで親を辿る
    while current != 0:
        path.append(current)
        # 親の計算: current + (current & -current)
        # (current & -current) は currentを2で何回割れるかの2のべき乗
        parent: int = current + (current & -current)
        
        # 親が配列サイズnを超えた場合は根（0）に到達
        if parent > n:
            current = 0
        else:
            current = parent
    
    # 最後に根（0）を追加
    path.append(0)
    return path


def solve() -> None:
    """
    メイン処理関数
    標準入力からクエリを読み取り、各クエリに対してBIT木の最短パスを出力
    """
    import sys
    input = sys.stdin.readline
    
    # クエリ数を読み取り
    Q = int(input().strip())
    
    # 各クエリを処理
    for _ in range(Q):
        line = input().strip().split()
        n = int(line[0])  # 配列の長さ
        I = int(line[1])  # 開始頂点
        
        # パスを計算
        path = find_path_to_root(n, I)
        
        # 結果を出力
        print(len(path))  # パス上の頂点数
        print(' '.join(map(str, path)))  # パス上の頂点を空白区切りで出力


if __name__ == "__main__":
    solve()