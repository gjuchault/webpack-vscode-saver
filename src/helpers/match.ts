import ignore from "ignore";

export function createMatcher(patterns: string[]) {
  const ig = ignore().add(patterns);

  return (input: string) => ig.test(input).ignored;
}
