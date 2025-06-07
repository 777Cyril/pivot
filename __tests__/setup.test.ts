describe('Jest Setup', () => {
  it('should be configured correctly', () => {
    expect(true).toBe(true);
  });

  it('should support TypeScript', () => {
    const add = (a: number, b: number): number => a + b;
    expect(add(1, 2)).toBe(3);
  });
});
