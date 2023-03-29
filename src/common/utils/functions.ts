export const range = (start: number, end: number): number[] => {
  const arr: number[] = [];
  const length = end - start;
  for (let i = 0; i <= length; i++) {
    arr[i] = start;
    start++;
  }
  return arr;
};
