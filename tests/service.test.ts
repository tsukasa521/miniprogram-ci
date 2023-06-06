import { IDatabase } from "../src/database";
import { T_Miniprogram_Project } from "../src/types";
import { createProject, getProjectList, publishMiniprogram, updateProject } from "../src/services";
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
          p1: {
            projectName: 'p1',
            version: '0.0.1',
            appid: 'wx1234567890',
            type: 'miniProgram',
            projectPath: './tests',
            privateKeyPath: './tests/private.wx1234567890.key'
          }
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
  await getProjectList({})
  const logTable = console.table as any

  const expectValue = [{ "版本号": "0.0.1", "项目名": "p1" }]

  expect(logTable.mock.calls[0][0]).toEqual(expectValue)
});

test('[getConfigList] raw = false', async () => {
  console.table = jest.fn()
  await getProjectList({ raw: false })
  const logTable = console.table as any

  const expectValue = [{ "版本号": "0.0.1", "项目名": "p1" }]

  expect(logTable.mock.calls[0][0]).toEqual(expectValue)
});

test('[getConfigList] raw = true', async () => {
  console.info = jest.fn()

  await getProjectList({ raw: true })

  const expectValue = { p1: { version: '0.0.1' } }

  const logMock = console.info as any
  expect(logMock.mock.calls[0][0]).toEqual(expectValue)
});

test('[updateVersion] standard update', async () => {
  console.info = jest.fn()

  await updateProject('p1', { projectVersion: '0.0.3' })

  const logMock = console.info as any
  expect(logMock.mock.calls[0][0]).toEqual("p1 更新成功")
});

test('[updateVersion] standard create', async () => {
  console.info = jest.fn()

  await createProject('p2', {
    projectVersion: '0.0.1',
    appid: 'wx1234567890',
    type: 'miniProgram',
    projectPath: './tests',
    privateKeyPath: './tests/private.wx1234567890.key'
  })

  const logMock = console.info as any
  expect(logMock.mock.calls[0][0]).toEqual("新建成功, 0.0.1")
});


test('[publishMiniprogram] standard', async () => {
  console.info = jest.fn()

  await publishMiniprogram('p1', {})

  const logMock = console.info as any
  expect(logMock.mock.calls[0][0]).toEqual("新建成功, 0.0.1")
});
