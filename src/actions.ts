import { Logger } from './logger';
import { publishMiniprogram, createProject, getProjectList, updateProject, removeProject } from './services';
import { CreateProjectOptions, PublishMiniprogramOptions, UpdateProjectOptions, listProjectOptions } from './types';
import { exceptionHandler } from './util';

export default class {
  /**
   * 发布小程序
   * @param projectName 小程序项目名 
   * @param config 配置文件路径
   * @param options 
   */
  @exceptionHandler()
  async publishMiniprogramProjectAction(projectName: string, options: PublishMiniprogramOptions) {
    await publishMiniprogram(projectName, options)
  }

  /**
   * 列表显示所有小程序项目
   * @param options 
   */
  @exceptionHandler()
  async listProjectAction(options: listProjectOptions) {
    await getProjectList(options)
  }

  @exceptionHandler()
  async createProjectAction(projectName: string, options: CreateProjectOptions) {
    await createProject(projectName, options)
  }

  /**
   * 新建/更新小程序项目
   * 项目名称不存在就是新建,反之就是更新
   * @param projectName 小程序项目名称 
   * @param version 想要新建/更新的版本号
   */
  @exceptionHandler()
  async updateProjectAction(projectName: string, options: UpdateProjectOptions) {
    await updateProject(projectName, options)
  }

  @exceptionHandler()
  async removeProjectAction(projectName: string) {
    await removeProject(projectName)
  }
}