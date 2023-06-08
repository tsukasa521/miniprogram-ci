# miniprogram-ci
可以快速持续化集成微信小程序工具

## 背景 | Background
### 为什么要做这个
小程序持续化集成一直是一个头疼的问题

最早只能通过微信开发者工具发布,需要使用微信号登录还必须打开一个软件非常的不方便.

后来官方发布了独立的npm包 [miniprogram-ci
](https://www.npmjs.com/package/miniprogram-ci) 可以通过命令行或代码的方式来进行发布,让自动发布成为了可能.但发布时版本号和版本描述还是需要人工填写,生产环境因为发布频率低这个问题还不明显.但到了体验版问题就明显了,体验版要拿来测试发布非常频繁,操作人员往往不知道下一个版本应该填什么,甚至会图省事版本号就不变了(版本号不变在体验版时也能发布但会出现不能及时更新的问题)

所以...就有了这个项目

## 到底解决了什么问题
其实也很简单,就是在发布时自动保存这一次的版本号,在下一次发布时自动升级版本号达到可以CI(持续集成)的目的.当有多个小程序时也会分别记录各自的版本号.

但这里也有一个明显的缺陷,这个保存版本号本质还是持久化在本地(就是一个`json`文件),如果多人协作发布,版本号就没法得到统一,`微信公众平台`也没有提供接口来获取版本号.这里建议用专门处理ci的服务统一处理或是将这个持久化json文件提交进代码仓库进行同步来规避这个问题.

## 如何使用 | How to use
### 全局安装
```sh
  # NPM
  npm install -g @2kk/miniprogram-ci

  # Yarn
  yarn global add @2kk/miniprogram-ci
```
### 新建项目
新建一个小程序项目,并设置一个初始的版本号，如果项目已经发布过这里可以设置为上一个版本号；如果从未发布过这里可以设置为`0.0.0`.
```sh
  mp-ci project update <miniprogram project name> <init version>
```

如果项目已经存在,那么执行此命令就是手动更新版本号

### 查看项目
新建完成后,可以随时查看项目的版本号
```sh
  mp-ci project ls

  # 显示如下内容:
  ┌─────────┬────────────┬──────────┐
  │ (index) │   项目名    │  版本号  │
  ├─────────┼────────────┼──────────┤
  │    0    │ 'project1' │ '1.0.0'  │
  └─────────┴────────────┴──────────┘
```

### 发布小程序
下面就是最重要的一步发布小程序
```sh
  mp-ci upload [options] <project name> <config path>
```

需要知道要发布的那个小程序项目名称和发布的配置文件路径，配置文件的内容与官网包完全一致

示例配置文件：
```json
  {
    "project1": {
      "appid": "wx1234567890",
      "projectPath": "./tests",
      "privateKeyPath": "./tests/private.wx1234567890.key"
    }
  }
```

## 本地运行 | Getting Started
安装依赖

```sh
  yarn # 推荐Yarn安装
```


```sh
  # 启动
  yarn dev

  # 运行测试用例
  yarn test

  # 打包
  yarn build
```

本地运行命令
```sh
  node ./dist/index.js project update <miniprogram project name> <init version>

  node ./dist/index.js project ls
```
### mock运行

如果没有真实的小程序appid和密钥，可以通过设置环境变量`mock`为`true`来运行命令
