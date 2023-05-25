import { CONFIGURATION } from "../src/configuration";
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

test('[JsonConfiguration] standard config', async () => {

  const expectValue = {
    "project1": { "appid": "wx1234567890", "ignores": ["node_modules/**/*"], "privateKeyPath": "./tests/private.wx1234567890.key", "projectPath": "./tests", "type": "miniProgram" }
  }

  const actualValue = await CONFIGURATION.load('./tests/configs/config1.json')

  expect(actualValue).toStrictEqual(expectValue);
});

test('[JsonConfiguration] full config', async () => {

  const expectValue = {
    "project1": { "appid": "wx1234567890", "ignores": ["node_modules"], "privateKeyPath": "./tests/private.wx1234567890.key", "projectPath": "./tests", "type": "mp" }
  }

  const actualValue = await CONFIGURATION.load('./tests/configs/config2.json')

  expect(actualValue).toStrictEqual(expectValue);
});

test('[JsonConfiguration] empty object', async () => {
  try {
    await CONFIGURATION.load('./tests/configs/config3.json')
  } catch (error) {
    expect(error).toBeInstanceOf(Error)
    expect((error as Error).message).toEqual('配置文件为空')
  }
});

test('[JsonConfiguration] miss required fields', async () => {
  try {
    await CONFIGURATION.load('./tests/configs/config4.json')
  } catch (error) {
    expect(error).toBeInstanceOf(Error)
    expect((error as Error).message).toEqual('配置文件缺少必要配置')
  }
});