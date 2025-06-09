import sys
input = sys.stdin.read

# === AVL Tree Node ===
class Node:
    def __init__(self, val):
        self.val = val
        self.height = 1
        self.left = None
        self.right = None

# === AVL Tree Class ===
class AVLTree:
    def __init__(self):
        self.root = None

    def get_height(self, node):
        return node.height if node else 0

    def update_height(self, node):
        node.height = max(self.get_height(node.left), self.get_height(node.right)) + 1

    def get_balance(self, node):
        return self.get_height(node.left) - self.get_height(node.right)

    # Rotation
    def rotate_right(self, y):
        x = y.left
        T2 = x.right
        x.right = y
        y.left = T2
        self.update_height(y)
        self.update_height(x)
        return x

    def rotate_left(self, x):
        y = x.right
        T2 = y.left
        y.left = x
        x.right = T2
        self.update_height(x)
        self.update_height(y)
        return y

    # Balance
    def balance(self, node):
        self.update_height(node)
        bf = self.get_balance(node)

        if bf > 1:
            if self.get_balance(node.left) < 0:
                node.left = self.rotate_left(node.left)
            return self.rotate_right(node)
        if bf < -1:
            if self.get_balance(node.right) > 0:
                node.right = self.rotate_right(node.right)
            return self.rotate_left(node)

        return node

    # Insert
    def insert(self, val):
        self.root = self._insert(self.root, val)

    def _insert(self, node, val):
        if not node:
            return Node(val)
        if val < node.val:
            node.left = self._insert(node.left, val)
        else:
            node.right = self._insert(node.right, val)
        return self.balance(node)

    # Find min node
    def find_min(self, node):
        while node.left:
            node = node.left
        return node

    # Delete
    def delete(self, val):
        self.root = self._delete(self.root, val)

    def _delete(self, node, val):
        if not node:
            return None
        if val < node.val:
            node.left = self._delete(node.left, val)
        elif val > node.val:
            node.right = self._delete(node.right, val)
        else:
            if not node.left or not node.right:
                return node.left or node.right
            min_larger = self.find_min(node.right)
            node.val = min_larger.val
            node.right = self._delete(node.right, min_larger.val)
        return self.balance(node)

    # Lower Bound: 最小の x以上 の値
    def lower_bound(self, x):
        return self._lower_bound(self.root, x)

    def _lower_bound(self, node, x):
        if not node:
            return None
        if node.val >= x:
            left = self._lower_bound(node.left, x)
            return left if left is not None else node.val
        else:
            return self._lower_bound(node.right, x)

# === メイン処理 ===
def main():
    data = input().splitlines()
    Q = int(data[0])
    tree = AVLTree()
    results = []

    for i in range(1, Q + 1):
        t, x = map(int, data[i].split())
        if t == 1:
            tree.insert(x)
        elif t == 2:
            tree.delete(x)
        elif t == 3:
            res = tree.lower_bound(x)
            results.append(str(res if res is not None else -1))

    print("\n".join(results))

if __name__ == "__main__":
    main()
