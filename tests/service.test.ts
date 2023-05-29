import { IDatabase } from "../src/database";
import { T_Miniprogram_Project } from "../src/types";
import { getConfigList } from "../src/services";
import { ICreateProjectOptions } from "miniprogram-ci/dist/@types/ci/project";

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

jest.mock('../src/miniprogramCi.ts', () => {
  return {
    uploadMiniprogram: (projectOption: ICreateProjectOptions,
      version: string, desc?: string, robot?: number) => { }
  }
})

test('[getConfigList] standard', async () => {
  console.table = jest.fn()
  await getConfigList({})
  const logTable = console.table as any

  const expectValue = [{ "版本号": "0.0.1", "项目名": "p1" }]

  expect(logTable.mock.calls[0][0]).toEqual(expectValue)
});

test('[getConfigList] raw = true', async () => {
  console.info = jest.fn()
  
  await getConfigList({ raw: true })
  
  const expectValue = { p1: { version: '0.0.1' } }
  
  const logMock = console.info as any
  expect(logMock.mock.calls[0][0]).toEqual(expectValue)
});