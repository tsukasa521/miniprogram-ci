import { DATABASE } from "./database"
import { nextSemanticVersion, validateSemanticVersion } from "./util"
import { uploadMiniprogram } from "./miniprogramCi"
import { CONFIGURATION } from "./configuration"
import { PublishMiniprogramOptions, UpdateVersionOptions, listConfigOptions } from "./types"
import { Logger } from "./logger"

/**
 * 发布小程序
 * @param options 
 */
export async function publishMiniprogram(
  options: PublishMiniprogramOptions
) {
  const {
    projectName,
    config,
    publishVersion,
    desc,
    robot,
    policy
  } = options

  const version: string = publishVersion || (await nextSemanticVersion(projectName, policy))

  const configuration = await CONFIGURATION.load(config)

  Logger.info(`准备开始上传小程序，版本号: ${version}`)
  Logger.debug('上传参数:', configuration[projectName])

  await uploadMiniprogram(configuration[projectName], version, desc, robot)

  await updateVersion({ projectName, version })
}

/**
 * 列表显示所有小程序项目
 * @param options 
 */
export async function getConfigList(options: listConfigOptions) {
  const db = await DATABASE.T_MINIPROGRAM_PROJECT.list()
  if (options.raw) {
    Logger.info(db);
  } else {
    const displayDb = Object.entries(db).map(([k, v]) => {
      return { '项目名': k, '版本号': v.version }
    })
    console.table(displayDb)
  }
}

/**
 * 更新版本号
 * @param options 
 */
export async function updateVersion(options: UpdateVersionOptions) {

  const { projectName, version } = options
  validateSemanticVersion(version, '版本号不符合Semantic规则')

  let originalVersion = ''
  const db = await DATABASE.T_MINIPROGRAM_PROJECT.list()

  // 如果项目存在就更新,如果项目不存在就新建
  if (db[projectName]) {
    originalVersion = db[projectName].version
    db[projectName].version = version
  } else {
    db[projectName] = { version }
  }

  DATABASE.T_MINIPROGRAM_PROJECT.update(db)
  if (originalVersion) {
    Logger.info(`更新成功, 从${originalVersion} -> ${version}`)
  } else {
    Logger.info(`新建成功, ${version}`);
  }
}