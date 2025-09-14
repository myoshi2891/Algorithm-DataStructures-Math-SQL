# NumPy & Matplotlib 練習用コード集

このリポジトリでは、**NumPy** を使った数値計算と、**Matplotlib** を使ったグラフ描画の基本を練習できます。

---

## 必要なライブラリ

```bash
pip install numpy matplotlib
```

---

## NumPy 基本操作

```python
import numpy as np
from numpy.typing import NDArray
```

### 配列の生成

```python
a = np.array([[[1, 2, 3], [4, 5, 6]], [[7, 8, 9], [10, 11, 12]]])
print(a)

zeros = np.zeros(8)
ones = np.ones(8)
arange_vals = np.arange(8)
print(zeros, ones, arange_vals)
```

### 配列の形状とアクセス

```python
a = np.array([[1, 2, 3], [4, 5, 6]])
print(np.shape(a))  # (2, 3)
print(len(a))       # 2

b = np.array([[0, 1, 2], [3, 4, 5]])
print(b[1, 2])   # 5
b[1, 2] = 9
print(b)

c = np.array([[0, 1, 2], [3, 4, 5]])
print(c[1, :])      # 2行目
c[:, 1] = np.array([7, 8])  # 2列目を置換
print(c)
```

### 関数と統計量

```python
def transform_array(x: NDArray[np.int_]) -> NDArray[np.int_]:
    """配列を2倍して1を加える"""
    return x * 2 + 1

a = np.array([[0, 1, 2], [3, 4, 5]])
b = transform_array(a)
print(b)

print("合計：", np.sum(a))
print("平均：", np.average(a))
print("中間値：", np.median(a))
print("標準偏差：", np.std(a))
print("分散：", np.var(a))
print("最小値：", np.min(a))
print("最大値：", np.max(a))
```

---

## グラフ描画

```python
import matplotlib.pyplot as plt
```

### 線形関数のプロット

```python
x = np.linspace(-5, 5)
y_1 = 2 * x
y_2 = 3 * x

plt.xlabel("x value", size=14)
plt.ylabel("y value", size=14)
plt.title("Function Graph")
plt.grid()

plt.plot(x, y_1, label="y1")
plt.plot(x, y_2, label="y2", linestyle="dashed")
plt.legend()
plt.show()
```

### 散布図

```python
x = np.array([1.2, 2.4, 0.3, 4.3, 3.5, 5.1, 6.7, 5.9])
y = np.array([2.3, 4.5, 1.2, 3.9, 5.1, 7.3, 6.8, 8.0])

plt.scatter(x, y, color="red")
plt.xlabel("x value", size=14)
plt.ylabel("y value", size=14)
plt.title("Scatter Plot")
plt.grid()
plt.show()
```

### ヒストグラム

```python
data = np.array([0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4])
plt.hist(data, bins=10, color="lightblue")
plt.xlabel("Value", size=14)
plt.ylabel("Frequency", size=14)
plt.title("Histogram")
plt.show()
```

---

## 変数と定数

```python
a = 1.5  # 定数
x = np.linspace(-1, 1)
y = a * x

plt.plot(x, y)
plt.xlabel("x value", size=14)
plt.ylabel("y value", size=14)
plt.title("Function Graph")
plt.grid()
plt.show()
```

---

## 関数定義と利用

```python
def linear_func1(x):
    """y = 3x + 2"""
    return 3 * x + 2

print(linear_func1(4))  # 14

def linear_func2(x):
    """y = 4x + 1"""
    return 4 * x + 1

print(linear_func2(3))  # 13
```

---

## 冪乗・平方根

```python
def cubic_func(x):
    """y = x^3"""
    return x**3

x = np.linspace(0, 2)
y = cubic_func(x)
plt.plot(x, y)
plt.title("Cubic Function")
plt.grid()
plt.show()
```

```python
def sqrt_func(x):
    """y = sqrt(x)"""
    return np.sqrt(x)

x = np.linspace(0, 9)
y = sqrt_func(x)
plt.plot(x, y)
plt.title("Square Root Function")
plt.grid()
plt.show()
```

---

## 多項式関数

```python
def polynomial_func(x: NDArray[np.float_]) -> NDArray[np.float_]:
    """多項式関数"""
    return x**3 - 2 * x**2 - 3 * x + 4

x = np.linspace(-2, 2)
y = polynomial_func(x)
plt.plot(x, y)
plt.title("Polynomial Function")
plt.xlabel("x", size=14)
plt.ylabel("y", size=14)
plt.grid()
plt.show()
```
