import ci, { IUploadOptions } from 'miniprogram-ci'
import { ICreateProjectOptions } from 'miniprogram-ci/dist/@types/ci/project'
import { Logger } from './logger'

export const MiniprogramCi = new Proxy(ci, {
  get(target, p, receiver) {
    if (process.env.mock) {
      if (p == 'Project') {
        return class {
          constructor(options: any) { }
        }
      } else if (p == 'upload') {
        return function (options: IUploadOptions) {
          return new Promise((resolve) => {
            resolve({ msg: '成功了' })
          })
        }
      }
    }
    return Reflect.get(target, p, receiver)
  },
})

export async function uploadMiniprogram(
  projectOption: ICreateProjectOptions,
  version: string, desc?: string, robot?: number
) {
  const project = new MiniprogramCi.Project(projectOption)

  const uploadResult = await MiniprogramCi.upload({
    project,
    version,
    desc: desc || version,
    robot: robot || 1,
    onProgressUpdate: console.log,
  })

  // todo 美化输出上传结构
  Logger.info('上传结果', uploadResult)
}
