import { DATABASE } from './database'
import { VersionUpdatePolicy } from './types'

export function validateSemanticVersion(version: string, throwErrorMessage: string = "") {
  // todo 暂不支持alpha这种版本号
  const reg = /^(\d+)\.(\d+)\.(\d+)$/
  if (throwErrorMessage) {
    if (!reg.test(version)) {
      throw new Error(throwErrorMessage)
    }
  } else {
    return reg.test(version)
  }
}

/**
 * 根据Semantic规则生成下一个版本号
 * @param projectName 小程序项目名称
 * @param policy
 * @returns 
 */
export async function nextSemanticVersion(projectName: string, policy?: VersionUpdatePolicy) {
  const db = await DATABASE.T_MINIPROGRAM_PROJECT.list()

  const sourceVersion = db[projectName]?.version

  if (!sourceVersion) {
    throw new Error(`请确认项目${projectName}是否设置了版本号`)
  }

  validateSemanticVersion(sourceVersion, '版本号不符合Semantic规则')

  const [major, minor, patch] = sourceVersion.split('.')
  const upgradedPatch = parseInt(patch) + 2 // todo 要处理版本提升策略 
  return [major, minor, upgradedPatch].join('.')
}

export function exceptionHandler() {
  
}