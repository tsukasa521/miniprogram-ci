import { Logger } from './logger';
import { getConfigList, updateVersion, publishMiniprogram } from './services';
import { PublishMiniprogramActionOptions, listConfigActionOptions } from './types';
import { exceptionHandler } from './util';

export default class {
  /**
   * 发布小程序
   * @param projectName 小程序项目名 
   * @param config 配置文件路径
   * @param options 
   */
  @exceptionHandler()
  async publishMiniprogramProjectAction(projectName: string, config: string, options: PublishMiniprogramActionOptions) {
    await publishMiniprogram({ projectName, config, publishVersion: options.publishVersion, desc: options.desc, robot: options.robot, policy: options.policy })
  }

  /**
   * 列表显示所有小程序项目
   * @param options 
   */
  @exceptionHandler()
  async listConfigAction(options: listConfigActionOptions) {
    await getConfigList(options)
  }

  /**
   * 新建/更新小程序项目
   * 项目名称不存在就是新建,反之就是更新
   * @param projectName 小程序项目名称 
   * @param version 想要新建/更新的版本号
   */
  @exceptionHandler()
  async updateConfigAction(projectName: string, version: string) {
    await updateVersion({ projectName, version })
  }
}