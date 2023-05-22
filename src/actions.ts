import { Logger } from './logger';
import { getConfigList, updateVersion, publishMiniprogram } from './services';
import { PublishMiniprogramActionOptions, listConfigActionOptions } from './types';

/**
 * 发布小程序
 * @param projectName 小程序项目名 
 * @param config 配置文件路径
 * @param options 
 */
export async function publishMiniprogramProjectAction(projectName: string, config: string, options: PublishMiniprogramActionOptions) {
  try {
    Logger.debug(projectName, config, options)
    await publishMiniprogram({ projectName, config, publishVersion: options.publishVersion, desc: options.desc, robot: options.robot, policy: options.policy })
  } catch (error: any) {
    Logger.error((error as Error).message);
  }
}

/**
 * 列表显示所有小程序项目
 * @param options 
 */
export async function listConfigAction(options: listConfigActionOptions) {
  await getConfigList(options)
}

/**
 * 新建/更新小程序项目
 * 项目名称不存在就是新建,反之就是更新
 * @param projectName 小程序项目名称 
 * @param version 想要新建/更新的版本号
 */
export async function updateConfigAction(projectName: string, version: string) {
  try {
    await updateVersion({ projectName, version })
  } catch (error: any) {
    Logger.error((error as Error).message);
  }
}
