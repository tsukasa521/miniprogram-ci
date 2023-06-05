import { ICreateProjectOptions } from "miniprogram-ci/dist/@types/ci/project"

export type ProjectType = 'miniProgram' | 'miniGame' | 'miniProgramPlugin' | 'miniGamePlugin';

export interface MiniprogramProject {
  // projectName:string, // todo
  version: string;
  projectPath: string;
  type: ProjectType;
  appid: string;
  privateKey?: string;
  privateKeyPath?: string;
  ignores?: string[];
}

export type T_Miniprogram_Project = {
  [projectName: string]: MiniprogramProject
}

/**
 * @deprecated
 */
export type ConfigurationOptions = {
  [key: string]: ICreateProjectOptions
}

export type VersionUpdatePolicy = 'odd' | 'even' | 'standard' // 版本更新策略：单数 | 复数 | 标准

export type PublishMiniprogramOptions = {
  publishVersion?: string, // 想要发布的版本号,默认会使用版本策略进行发布
  desc?: string, // 发布时的描述,默认填入版本号
  robot?: number, // 机器人编号,默认为1
  policy?: VersionUpdatePolicy // 版本更新策略
}

export type listProjectOptions = {
  raw?: boolean // 不采用列表输出, 输出原始格式
}

export type CreateProjectOptions = {
  projectVersion: string // 想要更新的版本号
  projectPath: string;
  type: ProjectType;
  appid: string;
  privateKey?: string;
  privateKeyPath?: string;
  ignores?: string[];
}

export type UpdateProjectOptions = {
  projectVersion?: string // 想要更新的版本号
  projectPath?: string;
  type?: ProjectType;
  appid?: string;
  privateKey?: string;
  privateKeyPath?: string;
  ignores?: string[];
}