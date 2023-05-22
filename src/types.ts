import { ICreateProjectOptions } from "miniprogram-ci/dist/@types/ci/project"

export type T_Miniprogram_Project = {
  [key: string]: { version: string }
}

export type ConfigurationOptions = {
  [key: string]: ICreateProjectOptions
}

export type VersionUpdatePolicy = 'odd' | 'even' | 'standard'

export type PublishMiniprogramActionOptions = {
  publishVersion?: string,
  desc?: string,
  robot?: number,
  policy?: VersionUpdatePolicy
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
  raw?: boolean
}

export type listConfigOptions = {
  raw?: boolean
}

export type UpdateVersionOptions = {
  projectName: string,
  version: string
}