import ci, { IUploadOptions } from 'miniprogram-ci'
import { Logger } from './logger'
import { MiniprogramProject } from './types'

/**
 * 对微信小程序官方发布类做的代理类
 */
export const MiniprogramCi = new Proxy(ci, {
  get(target, p, receiver) {

    if (process.env.MOCK_ENV == 'mock') {
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

/**
 * 发布小程序
 * @param projectOption 
 * @param version 
 * @param desc 
 * @param robot 
 */
export async function uploadMiniprogram(miniprogramProject: MiniprogramProject, version: string, desc: string, robot: number) {
  const project = new MiniprogramCi.Project({
    appid: miniprogramProject.appid, projectPath: miniprogramProject.projectPath, privateKey: miniprogramProject.privateKey, privateKeyPath: miniprogramProject.privateKeyPath, type: miniprogramProject.type,
    ignores: miniprogramProject.ignores
  })

  const uploadResult = await MiniprogramCi.upload({ project, version, desc, robot, onProgressUpdate: console.log })

  // todo 验证是否上传成功
  Logger.info('上传成功')

  Logger.debug('uploadResult', uploadResult)
}
