import packageJson from '../package.json'
import { program } from 'commander'
import Actions from './actions'
import { init } from './database'

const actions = new Actions()

function main() {
  program
    .name('mp-ci')
    .description(packageJson.description)
    .version(packageJson.version)
    .option('--verbose', '开启log')

  program
    .command('upload')
    .description('上传代码')
    .argument('<project name>', '保存在配置中的小程序项目名')
    .argument('<config path>', '配置文件地址') // todo 不需要config了
    .option('--publish-version <publish version>', '发布的版本号')
    .option('--desc <desc>', '发布时的描述, 默认会设置为版本号')
    .option('--robot <robot>', '指定使用哪一个 ci 机器人', '1')
    .option('-p, --policy [odd | even | standard]', '版本提升策略,默认为奇数提升', 'odd')
    .action(actions.publishMiniprogramProjectAction)

  const configCommand = program.command('project').description('新增/修改小程序项目')

  configCommand
    .command('ls')
    .description('显示所有小程序项目')
    .option('--raw', '原始数据格式')
    .action(actions.listProjectAction)

  // todo 新增时可以支持导入配置
  configCommand
    .command('create')
    .description('新建小程序项目')
    .argument('<project name>', '小程序项目名')
    .option('--project-version <project version>', '项目版本号')
    .option('--project-path <project path>', '项目的路径，即 project.config.json 所在的目录')
    .option('--project-path <type>', '项目的类型')
    .option('--appid <appid>', '小程序/小游戏项目的 appid')
    .option('--private-key <privateKey>', '私钥的内容，（创建 Project 对象，需要传入私钥内容或私钥文件路径）')
    .option('--private-key-path <privateKeyPath>', '私钥文件的路径，（创建 Project 对象，需要传入私钥内容或私钥文件路径）')
    .option('--ignores', '指定需要排除的规则')
    .action(actions.createProjectAction) // todo 新建时调用新增方法

  // todo 每个字段都可以修改
  configCommand
    .command('update')
    .description('修改小程序项目')
    .argument('<project name>', '小程序项目名')
    .option('--project-version <project version>', '项目版本号')
    .option('--project-path <project path>', '项目的路径，即 project.config.json 所在的目录')
    .option('--project-path <type>', '项目的类型')
    .option('--appid <appid>', '小程序/小游戏项目的 appid')
    .option('--private-key <privateKey>', '私钥的内容，（创建 Project 对象，需要传入私钥内容或私钥文件路径）')
    .option('--private-key-path <privateKeyPath>', '私钥文件的路径，（创建 Project 对象，需要传入私钥内容或私钥文件路径）')
    .option('--ignores', '指定需要排除的规则')
    .action(actions.updateConfigAction)

  program.parse()
}

init()
main()
