# FashFE - FashOJ 前端项目

FashFE 是 FashOJ（Fashion Online Judge）在线代码评测平台的前端项目，使用 Vue 3 + TypeScript + Vite 技术栈构建。

## 项目简介

FashOJ 是一个开源的在线代码评测平台，采用微服务架构设计，支持多种编程语言的代码提交和自动判题。本仓库为其前端界面，提供用户友好的代码提交、题目浏览、成绩查看等功能。

## 技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **路由**: Vue Router 4
- **状态管理**: Pinia
- **样式**: CSS3
- **测试**: Vitest + Cypress
- **代码规范**: ESLint + Prettier

## 相关项目

- 后端项目: [FashOnlineJudgeBE](https://github.com/FashOJ/FashOnlineJudgeBE)



## TypeScript 支持

TypeScript 默认无法处理 `.vue` 文件的类型信息，因此我们使用 `vue-tsc` 替代默认的 `tsc` 进行类型检查。在编辑器中，需要安装 [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 插件以获得完整的 TypeScript 支持。

## 快速开始

### 安装依赖

```sh
npm install
```

### 开发环境运行

```sh
npm run dev
```

访问 http://localhost:5173 查看应用

### 生产环境构建

```sh
npm run build
```

### 预览生产构建

```sh
npm run preview
```

## 测试

### 单元测试

```sh
npm run test:unit
```

### 端到端测试

开发环境测试：
```sh
npm run test:e2e:dev
```

生产环境测试：
```sh
npm run build
npm run test:e2e
```

## 代码规范

### 代码检查

```sh
npm run lint
```

### 代码格式化

```sh
npm run format
```

## 项目结构

```
src/
├── assets/          # 静态资源
├── components/      # 可复用组件
├── router/          # 路由配置
├── stores/          # Pinia 状态管理
├── views/           # 页面组件
├── App.vue          # 根组件
└── main.ts          # 应用入口
```

## 配置说明

详细配置请参考 [Vite 配置文档](https://vite.dev/config/)

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情
