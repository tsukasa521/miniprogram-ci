import { ICreateProjectOptions } from "miniprogram-ci/dist/@types/ci/project"

export type T_Miniprogram_Project = {
  [key: string]: { version: string }
}

export type ConfigurationOptions = {
  [key: string]: ICreateProjectOptions
}

export type VersionUpdatePolicy = 'odd' | 'even' | 'standard' // 版本更新策略：单数 | 复数 | 标准

export interface PublishMiniprogramActionOptions {
  publishVersion?: string, // 想要发布的版本号,默认会使用版本策略进行发布
  desc?: string, // 发布时的描述,默认填入版本号
  robot?: number, // 机器人编号,默认为1
  policy?: VersionUpdatePolicy // 版本更新策略
}

export interface PublishMiniprogramOptions extends PublishMiniprogramActionOptions {
  projectName: string, // 小程序项目名称
  config: string, // 配置文件路径
}

export interface listConfigActionOptions {
  raw?: boolean // 不采用列表输出, 输出原始格式
}

export interface listConfigOptions extends listConfigActionOptions { }

export type UpdateVersionOptions = {
  projectName: string, // 小程序项目名
  version: string // 想要更新的版本号
}