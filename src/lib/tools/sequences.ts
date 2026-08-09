export function factorial(n: number): bigint {
  let result = BigInt(1);
  for (let index = BigInt(2); index <= BigInt(Math.max(0, Math.floor(n))); index += BigInt(1)) {
    result *= index;
  }
  return result;
}

export function factorialTrailingZeros(value: bigint): number {
  const digits = value.toString();
  let count = 0;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    if (digits[index] === '0') {
      count += 1;
    } else {
      break;
    }
  }
  return count;
}

export function fibonacciTerms(count: number): bigint[] {
  const terms: bigint[] = [];
  let previous = BigInt(0);
  let current = BigInt(1);
  for (let index = 0; index < Math.max(0, Math.floor(count)); index += 1) {
    terms.push(previous);
    const next = previous + current;
    previous = current;
    current = next;
  }
  return terms;
}
