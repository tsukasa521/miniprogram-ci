import { DATABASE } from "./database"
import { nextSemanticVersion, validateSemanticVersion } from "./util"
import { uploadMiniprogram } from "./miniprogramCi"
import { CreateProjectOptions, MiniprogramProject, PublishMiniprogramOptions, UpdateProjectOptions, listProjectOptions } from "./types"
import { Logger } from "./logger"

/**
 * 发布小程序
 * @param options 
 */
export async function publishMiniprogram(projectName: string, options: PublishMiniprogramOptions) {

  const version: string = options.publishVersion || (await nextSemanticVersion(projectName, options.policy))
  const desc: string = options.desc || version
  const robot: number = options.robot || 1

  Logger.info(`准备开始上传 ${projectName} 小程序，版本号: ${version}`)
  // Logger.debug('上传参数:', configuration[projectName])

  const project = await getProjectByName(projectName)

  if (!project) throw new Error('项目不存在')

  await uploadMiniprogram(project, version, desc, robot)

  await updateProject(projectName, { projectVersion: version })
}

async function getProjectByName(projectName: string): Promise<MiniprogramProject | undefined> {
  const db = await DATABASE.T_MINIPROGRAM_PROJECT.list()
  return db[projectName]
}

/**
 * 列表显示所有小程序项目
 * @param options 
 */
export async function getProjectList(options: listProjectOptions) {
  const db = await DATABASE.T_MINIPROGRAM_PROJECT.list()
  if (options.raw) {
    Logger.info(db);
  } else {
    const displayDb = Object.entries(db).map(([k, v]) => {
      return {
        '项目名': k,
        '版本号': v.version || '--',
        'appid': v.appid || '--',
        'type': v.type || '--',
        'projectPath': v.projectPath || '--',
        'privateKey': v.privateKey || '--',
        'privateKeyPath': v.privateKeyPath || '--',
        'ignores': v.ignores || '--'
      }
    })
    console.table(displayDb)
  }
}

export async function createProject(projectName: string, options: CreateProjectOptions) {
  // 验证重复
  const project = await getProjectByName(projectName)
  if (project) throw new Error('项目已存在')

  // 验证必填项
  if (!options.appid || !options.projectPath || (!options.privateKey && !options.privateKeyPath)) {
    throw new Error('appid projectPath 为必填项, privateKey 和 privateKeyPath 中至少选择一项')
  }

  // 默认值
  let version: string
  if (options.projectVersion) {
    validateSemanticVersion(options.projectVersion, '版本号不符合Semantic规则')
    version = options.projectVersion
  } else {
    version = '0.0.0'
  }
  const type = options.type || 'miniProgram'
  const ignores = options.ignores || ['node_modules/**/*']

  const db = await DATABASE.T_MINIPROGRAM_PROJECT.list()

  db[projectName] = {
    projectName,
    appid: options.appid,
    projectPath: options.projectPath,
    type,
    version,
    ignores,
    privateKey: options.privateKey,
    privateKeyPath: options.privateKeyPath
  }

  DATABASE.T_MINIPROGRAM_PROJECT.update(db)

  Logger.info(`${projectName} 新建成功, ${version}`);
}

/**
 * 
 * @param options 
 */
export async function updateProject(projectName: string, options: UpdateProjectOptions) {
  const project = await getProjectByName(projectName)

  // 验证项目是否存在
  if (!project) throw new Error('项目不存在')


  const db = await DATABASE.T_MINIPROGRAM_PROJECT.list()

  if (options.projectVersion) {
    validateSemanticVersion(options.projectVersion || '', '版本号不符合Semantic规则')
    db[projectName].version = options.projectVersion || ''
  }

  // todo 对其他字段进行更新

  DATABASE.T_MINIPROGRAM_PROJECT.update(db)

  Logger.info(`${projectName} 更新成功`)
}

export async function removeProject(projectName: string) {
  const project = await getProjectByName(projectName)

  // 验证项目是否存在
  if (!project) throw new Error('项目不存在')

  const db = await DATABASE.T_MINIPROGRAM_PROJECT.list()

  delete db[projectName]

  DATABASE.T_MINIPROGRAM_PROJECT.update(db)

  Logger.info(`${projectName} 删除成功`)
}