import { validateSemanticVersion } from "../src/util";

test('create project named P1', () => {
  const r = validateSemanticVersion('0.0.1', 'xxx')
  expect(r).toBeFalsy();
});

test('create project named P2', () => {
  expect(() => validateSemanticVersion('aaa', 'xxx'))
    .toThrowError(new Error('xxx'));
});