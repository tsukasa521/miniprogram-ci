import { ICreateProjectOptions } from "miniprogram-ci/dist/@types/ci/project"

export type T_Miniprogram_Project = {
  [key: string]: { version: string }
}

export type ConfigurationOptions = {
  [key: string]: ICreateProjectOptions
}

export type VersionUpdatePolicy = 'odd' | 'even' | 'standard'

export type PublishMiniprogramActionOptions = {
  publishVersion?: string, // 想要发布的版本号,默认会使用版本策略进行发布
  desc?: string, // 发布时的描述,默认填入版本号
  robot?: number, // 机器人编号,默认为1
  policy?: VersionUpdatePolicy // 版本策略
}

export type PublishMiniprogramOptions = {
  projectName: string,
  config: string,
  publishVersion?: string,
  desc?: string,
  robot?: number,
  policy?: VersionUpdatePolicy
}

export type listConfigActionOptions = {
  raw?: boolean // 不采用列表输出, 输出原始格式
}

export type listConfigOptions = {
  raw?: boolean
}

export type UpdateVersionOptions = {
  projectName: string,
  version: string
}