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
  process.env.MOCK_ENV = 'mock'

  await uploadMiniprogram({
    appid: '',
    projectPath: '',
    type: 'miniProgram',
  }, 'xxx')

  const logMock = console.info as any
  expect(logMock.mock.calls[0][0]).toEqual("上传结果")
  expect(logMock.mock.calls[0][1]).toEqual({ "msg": "成功了" })

  process.env.MOCK_ENV = originalVal
});

test('[uploadMiniprogram] standard upload', async () => {
  console.info = jest.fn()

  await uploadMiniprogram({
    appid: '',
    projectPath: '',
    type: 'miniProgram',
  }, 'xxx')

  const logMock = console.info as any
  expect(logMock.mock.calls[0][0]).toEqual("上传结果")
  expect(logMock.mock.calls[0][1]).toEqual({
    "subPackageInfo": [],
    "pluginInfo": [],
    "devPluginId": "",
  })
});