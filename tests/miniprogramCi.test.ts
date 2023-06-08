import { IUploadOptions } from "miniprogram-ci";
import { uploadMiniprogram } from "../src/miniprogramCi";
import { TPluginInfo, TSubPackageInfo } from "miniprogram-ci/dist/@types/ci/upload";

jest.mock('miniprogram-ci', () => {
  return {
    Project: class {
      constructor() { }
    },
    upload: (options: IUploadOptions) => {

      const subPackageInfo: TSubPackageInfo = [];

      const pluginInfo: TPluginInfo = []

      return {
        subPackageInfo,
        pluginInfo,
        devPluginId: ''
      }
    }
  }
})

test('[uploadMiniprogram] mock upload', async () => {
  const originalVal = process.env.MOCK_ENV
  console.info = jest.fn()
  console.debug = jest.fn()
  process.env.MOCK_ENV = 'mock'

  await uploadMiniprogram({
    projectName: 'p1',
    version: '0.0.1',
    appid: 'wx1234567890',
    type: 'miniProgram',
    projectPath: './tests',
    privateKeyPath: './tests/private.wx1234567890.key'
  }, '0.0.3', '0.0.3', 1)

  const infoMock = console.info as any
  const debugMock = console.debug as any
  expect(infoMock.mock.calls[0][0]).toEqual("上传成功")
  expect(debugMock.mock.calls[0][0]).toEqual("uploadResult")
  expect(debugMock.mock.calls[0][1]).toEqual({ "msg": "成功了" })

  process.env.MOCK_ENV = originalVal
});

test('[uploadMiniprogram] standard upload', async () => {
  console.info = jest.fn()
  console.debug = jest.fn()

  await uploadMiniprogram({
    projectName: 'p1',
    version: '0.0.1',
    appid: 'wx1234567890',
    type: 'miniProgram',
    projectPath: './tests',
    privateKeyPath: './tests/private.wx1234567890.key'
  }, '0.0.3', '0.0.3', 1)

  const infoMock = console.info as any
  const debugMock = console.debug as any
  expect(infoMock.mock.calls[0][0]).toEqual("上传成功")
  expect(debugMock.mock.calls[0][0]).toEqual("uploadResult")
  expect(debugMock.mock.calls[0][1]).toEqual({
    "subPackageInfo": [],
    "pluginInfo": [],
    "devPluginId": "",
  })
});