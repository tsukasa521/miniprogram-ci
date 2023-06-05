import { DATABASE } from './database'
import { Logger } from './logger'
import { VersionUpdatePolicy } from './types'

/**
 * 验证版本号合法性
 * todo 暂不支持alpha这种版本号
 * @param version 版本号
 * @param throwErrorMessage 异常信息
 * @returns 
 */
export function validateSemanticVersion(version: string, throwErrorMessage: string = "") {
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
 * @param policy 版本更新策略
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

export function isEmptyObject(obj: any) {
  if (obj && Object.keys(obj).length === 0 && obj.constructor === Object) return true
  return false
}

/**
 * 异常处理装饰器
 */
export function exceptionHandler() {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      // Logger.debug('输入参数:', ...args)
      try {
        const result = originalMethod.apply(this, args);
        if (result && result instanceof Promise) {
          return result.catch((error: any) => {
            Logger.error((error as Error).message)
          });
        }
        return result;
      } catch (error: any) {
        Logger.error((error as Error).message);
      }
    }
  }
}
