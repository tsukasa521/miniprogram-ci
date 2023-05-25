import { validateSemanticVersion, nextSemanticVersion } from "../src/util";
import { IDatabase } from "../src/database";
import { T_Miniprogram_Project } from "../src/types";

jest.mock('../src/database.ts', () => {
  class MockDatabase implements IDatabase {
    connectionString: string

    constructor(connectionString: string) {
      this.connectionString = connectionString
    }

    T_MINIPROGRAM_PROJECT = {
      list: async () => {
        const t: T_Miniprogram_Project = {
          p1: { version: '0.0.1' }
        }
        return t
      },
      update: (content: object) => { }
    }
  }

  return {
    DATABASE: new MockDatabase("")
  }
})

test('[validateSemanticVersion] standard', () => {
  const r = validateSemanticVersion('0.0.1', 'xxx')
  expect(r).toBeFalsy();
});

test('[validateSemanticVersion] invalid input', () => {
  expect(() => validateSemanticVersion('aaa', 'xxx'))
    .toThrowError(new Error('xxx'));
});

test('[nextSemanticVersion] odd policy', async () => {
  const v = await nextSemanticVersion('p1')
  expect(v).toEqual('0.0.3')
});

test('[nextSemanticVersion project not exist] ', async () => {
  try {
    await nextSemanticVersion('p2')
  } catch (error) {
    expect(error).toBeInstanceOf(Error)
    expect((error as Error).message).toEqual('请确认项目p2是否设置了版本号')
  }
});