import { IDatabase } from "../src/database";
import { ConfigurationOptions, T_Miniprogram_Project } from "../src/types";
import { getConfigList, publishMiniprogram, updateVersion } from "../src/services";
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

jest.mock('../src/configuration.ts', () => {
  return {
    CONFIGURATION: {
      load: (configPath: string): Promise<ConfigurationOptions> => {
        return new Promise((resolve, reject) => {
          const options:ConfigurationOptions ={} 
          resolve(options)
        })
      }
    }
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

test('[getConfigList] raw = false', async () => {
  console.table = jest.fn()
  await getConfigList({ raw: false })
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

test('[updateVersion] standard update', async () => {
  console.info = jest.fn()

  await updateVersion({ projectName: 'p1', version: '0.0.3' })

  const logMock = console.info as any
  expect(logMock.mock.calls[0][0]).toEqual("更新成功, 从0.0.1 -> 0.0.3")
});

test('[updateVersion] standard create', async () => {
  console.info = jest.fn()

  await updateVersion({ projectName: 'p2', version: '0.0.1' })

  const logMock = console.info as any
  expect(logMock.mock.calls[0][0]).toEqual("新建成功, 0.0.1")
});


test('[publishMiniprogram] standard', async () => {
  console.info = jest.fn()

  await publishMiniprogram({ projectName: 'p1', config: '' })

  const logMock = console.info as any
  expect(logMock.mock.calls[0][0]).toEqual("新建成功, 0.0.1")
});
