# %matplotlib inline

import numpy as np
import matplotlib.pyplot as plt


# Configure matplotlib for non-interactive use (equivalent to %matplotlib inline in notebooks)
plt.show()  # Turn off interactive mode
# a = np.array([[[1, 2, 3], [4, 5, 6]], [[7, 8, 9], [10, 11, 12]]])
# print(a)

# d = np.zeros(8)
# print(d)

# e = np.ones(8)
# print(e)

# f = np.arange(8)
# print(f)

# a = np.array([[1, 2, 3], [4, 5, 6]])
# print(np.shape(a))
# print(len(a))

# b = np.array([[0, 1, 2], [3, 4, 5]])
# print(b[1, 2])
# b[1 ,2] = 9
# print(b)

# c = np.array([[0, 1, 2], [3, 4, 5]])
# print(c[1, :])
# print()

# c[:, 1] = np.array([7, 8])
# print(c)

from numpy.typing import NDArray


def my_func(x: NDArray[np.int_]) -> NDArray[np.int_]:
    y = x * 2 + 1
    return y


a = np.array([[0, 1, 2], [3, 4, 5]])
b = my_func(a)
print(b)

print("合計：", np.sum(a))
print("平均：", np.average(a))
print("中間値：", np.median(a))
print("標準偏差：", np.std(a))
print("分散：", np.var(a))
print("最小値：", np.min(a))
print("最大値：", np.max(a))
