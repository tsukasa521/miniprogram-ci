import { Logger } from './logger';
import { getConfigList, updateVersion, publishMiniprogram } from './services';
import { PublishMiniprogramActionOptions, listConfigActionOptions } from './types';

export const publishMiniprogramProjectAction = async (
  projectName: string,
  config: string,
  options: PublishMiniprogramActionOptions
) => {
  try {
    Logger.debug(projectName, config, options)
    await publishMiniprogram({ projectName, config, publishVersion: options.publishVersion, desc: options.desc, robot: options.robot, policy: options.policy })
  } catch (error: any) {
    Logger.error((error as Error).message);
  }
}

/**
 * 显示所有配置
 */
export const listConfigAction = async ({ raw }: listConfigActionOptions) => {
  await getConfigList({ raw })
}

/**
 * 
 * @param projectName 
 * @param version 
 * @returns 
 */
export const updateConfigAction = async (projectName: string, version: string) => {
  try {
    await updateVersion({ projectName, version })
  } catch (error: any) {
    Logger.error((error as Error).message);
  }
}
