def factorial(n):
    if n < 0:
        raise ValueError("Factorial is not defined for negative numbers")
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        try:
            n = int(sys.argv[1])
            print(f"{n}! = {factorial(n)}")
        except ValueError as e:
            print(f"Error: {e}")
    else:
        test_values = [0, 1, 5, 10]
        for n in test_values:
            print(f"{n}! = {factorial(n)}")