/** Asserts that an array of strings matches an array of regex's or strings meant to test each item
 * @param items The array of strings you want to test
 * @param regex The array of regex's or strings that defines the expected value of 'items'
 */
export function assertMatches(items: string[], regex: (RegExp | string)[]) {
  expect(items.length).toEqual(regex.length);
  const sortedItems = items.sort();
  for (let i = 0; i < items.length; i++) {
    expect(sortedItems[i]).toMatch(regex[i]);
  }
}
