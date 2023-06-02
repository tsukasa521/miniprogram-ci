import { uploadMiniprogram } from "../src/miniprogramCi";


jest.mock('miniprogram-ci', () => {
  return {
    upload: () => { }
  }
})


test('[uploadMiniprogram] mock upload', async () => {
  const originalVal = process.env.mock
  console.info = jest.fn()
  process.env.mock = 'true'

  await uploadMiniprogram({
    appid: '',
    projectPath: '',
    type: 'miniProgram',
  }, 'xxx')

  const logMock = console.info as any
  expect(logMock.mock.calls[0][0]).toEqual("上传结果")
  expect(logMock.mock.calls[0][1]).toEqual({ "msg": "成功了" })

  process.env.mock = originalVal
});