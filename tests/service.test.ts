import { IDatabase } from "../src/database";
import { MiniprogramProject, T_Miniprogram_Project } from "../src/types";
import { createProject, getProjectList, publishMiniprogram, updateProject } from "../src/services";

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
      update: (content: object) => {
        console.log(content);
      }
    }
  }

  return {
    DATABASE: new MockDatabase("")
  }
})

jest.mock('../src/miniprogramCi.ts', () => {
  return {
    uploadMiniprogram: (miniprogramProject: MiniprogramProject, version: string, desc: string, robot: number) => {
      console.log('成功');
    }
  }
})

test('[getProjectList] standard', async () => {
  console.table = jest.fn()
  await getProjectList({})
  const logTable = console.table as any

  const expectValue = [{
    "项目名": "p1",
    "版本号": "0.0.1",
    "appid": "wx1234567890",
    "ignores": "--",
    "privateKey": "--",
    "privateKeyPath": "./tests/private.wx1234567890.key",
    "projectPath": "./tests",
    "type": "miniProgram",
  }]

  expect(logTable.mock.calls[0][0]).toEqual(expectValue)
});

test('[getProjectList] raw = false', async () => {
  console.table = jest.fn()
  await getProjectList({ raw: false })

  const expectValue = [{
    "项目名": "p1",
    "版本号": "0.0.1",
    "appid": "wx1234567890",
    "ignores": "--",
    "privateKey": "--",
    "privateKeyPath": "./tests/private.wx1234567890.key",
    "projectPath": "./tests",
    "type": "miniProgram",
  }]

  const tableMock = console.table as any
  expect(tableMock.mock.calls[0][0]).toEqual(expectValue)
});

test('[getProjectList] raw = true', async () => {
  console.info = jest.fn()

  await getProjectList({ raw: true })

  const expectValue = {
    p1: {
      version: '0.0.1',
      "appid": "wx1234567890",
      "privateKeyPath": "./tests/private.wx1234567890.key",
      "projectName": "p1",
      "projectPath": "./tests",
      "type": "miniProgram",
    }
  }

  const infoMock = console.info as any
  expect(infoMock.mock.calls[0][0]).toEqual(expectValue)
});

test('[updateProject] standard update', async () => {
  console.info = jest.fn()

  await updateProject('p1', { projectVersion: '0.0.3' })

  const infoMock = console.info as any
  expect(infoMock.mock.calls[0][0]).toEqual("p1 更新成功")
});

test('[updateProject] project no exist', async () => {
  await expect(updateProject('p2', {})).rejects.toThrowError(new Error('项目不存在'))
});

test('[updateProject] invalid project version', async () => {
  await expect(updateProject('p1', { projectVersion: 'aaa' })).rejects.toThrowError(new Error('版本号不符合Semantic规则'))
});

test('[createProject] standard create with privateKeyPath', async () => {
  console.info = jest.fn()

  await createProject('p2', {
    projectVersion: '0.0.1',
    appid: 'wx1234567890',
    type: 'miniProgram',
    projectPath: './tests',
    privateKeyPath: './tests/private.wx1234567890.key'
  })

  const infoMock = console.info as any
  expect(infoMock.mock.calls[0][0]).toEqual("p2 新建成功, 0.0.1")
});

test('[createProject] standard create with privateKey', async () => {
  console.info = jest.fn()

  await createProject('p2', {
    projectVersion: '0.0.1',
    appid: 'wx1234567890',
    type: 'miniProgram',
    projectPath: './tests',
    privateKey: 'xxx'
  })

  const infoMock = console.info as any
  expect(infoMock.mock.calls[0][0]).toEqual("p2 新建成功, 0.0.1")
});

test('[createProject] duplicate create', async () => {
  await expect(createProject('p1', {
    projectVersion: '0.0.1',
    appid: 'wx1234567890',
    type: 'miniProgram',
    projectPath: './tests',
    privateKeyPath: './tests/private.wx1234567890.key'
  })).rejects.toThrowError(new Error('项目已存在'))
});

test('[createProject] create with default options', async () => {
  console.log = jest.fn()

  await createProject('p2', {
    projectVersion: '',
    appid: 'wx1234567890',
    type: '',
    projectPath: './tests',
    privateKeyPath: './tests/private.wx1234567890.key'
  })

  const log = console.log as any

  const expectValue = {
    "p1":
      { "appid": "wx1234567890", "privateKeyPath": "./tests/private.wx1234567890.key", "projectName": "p1", "projectPath": "./tests", "type": "miniProgram", "version": "0.0.1" },
    "p2":
      { "appid": "wx1234567890", "ignores": ["node_modules/**/*"], "privateKey": undefined, "privateKeyPath": "./tests/private.wx1234567890.key", "projectName": "p2", "projectPath": "./tests", "type": "miniProgram", "version": "0.0.0" }
  }

  expect(log.mock.calls[0][0]).toEqual(expectValue)
})

test('[createProject] require options[appid] validation', async () => {
  await expect(createProject('p2', {
    projectVersion: '0.0.1',
    appid: '',
    type: 'miniProgram',
    projectPath: './tests',
    privateKeyPath: './tests/private.wx1234567890.key'
  })).rejects.toThrowError(new Error('appid projectPath 为必填项, privateKey 和 privateKeyPath 中至少选择一项'))
})

test('[createProject] require options[projectPath] validation', async () => {
  await expect(createProject('p2', {
    projectVersion: '0.0.1',
    appid: 'wx1234567890',
    type: 'miniProgram',
    projectPath: '',
    privateKeyPath: './tests/private.wx1234567890.key'
  })).rejects.toThrowError(new Error('appid projectPath 为必填项, privateKey 和 privateKeyPath 中至少选择一项'))
})

test('[createProject] require options[privateKey privateKeyPath] validation', async () => {
  await expect(createProject('p2', {
    projectVersion: '0.0.1',
    appid: 'wx1234567890',
    type: 'miniProgram',
    projectPath: './tests',
  })).rejects.toThrowError(new Error('appid projectPath 为必填项, privateKey 和 privateKeyPath 中至少选择一项'))
})

test('[createProject] invalid project version', async () => {
  await expect(createProject('p2', {
    projectVersion: 'aaa',
    appid: 'wx1234567890',
    type: 'miniProgram',
    projectPath: './tests',
    privateKeyPath: './tests/private.wx1234567890.key'
  })).rejects.toThrowError(new Error('版本号不符合Semantic规则'))
})

test('[publishMiniprogram] standard', async () => {
  console.info = jest.fn()

  await publishMiniprogram('p1', {})

  const infoMock = console.info as any
  expect(infoMock.mock.calls[0][0]).toEqual("准备开始上传 p1 小程序，版本号: 0.0.3")
});

test('[publishMiniprogram] project not exist', async () => {
  await expect(publishMiniprogram('p2', {})).rejects.toThrowError(new Error('请确认项目p2是否设置了版本号'))
});