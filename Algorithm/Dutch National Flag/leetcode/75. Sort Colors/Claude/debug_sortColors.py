def debug_sortColors(nums):
    low, mid, high = 0, 0, len(nums) - 1
    step = 0

    print(f"Initial: {nums}, low={low}, mid={mid}, high={high}")

    while mid <= high:
        print(f"Step {step}: nums[{mid}]={nums[mid]}")

        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
            print(f"  -> Swapped 0: {nums}, low={low}, mid={mid}")
        elif nums[mid] == 1:
            mid += 1
            print(f"  -> Kept 1: {nums}, mid={mid}")
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
            print(f"  -> Swapped 2: {nums}, high={high}")

        step += 1

    print(f"Final: {nums}")


nums = [2, 0, 2, 1, 1, 0]
debug_sortColors(nums)
