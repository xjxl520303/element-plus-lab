/* eslint-disable regexp/no-unused-capturing-group */
// <type>[optional scope]: <description>
//
// [optional body]
//
// [optional footer(s)]

// 【说明】：内容参考 cz-git 官方配置以及 Element Plus 的 .commitlintrc.mjs 配置

import { execSync } from 'node:child_process'
import fg from 'fast-glob'

function getPackages(packagePath) {
  return fg.sync('*', { cwd: packagePath, onlyDirectories: true })
}

const scopes = [
  ...getPackages('packages'),
  ...getPackages('internal'),
  'docs',
  'play',
  'project',
  'style',
  'ci',
  'dev',
  'deploy',
  'other',
  'typography',
  'color',
  'types',
  'deps',
]

const gitStatus = execSync('git status --porcelain || true')
  .toString()
  .trim()
  .split('\n')

const scopeComplete = gitStatus
  .find(r => ~r.indexOf('M  packages'))
  ?.replace(/\//g, '%%')
  ?.match(/packages%%((\w|-)*)/)?.[1]

const subjectComplete = gitStatus
  .find(r => ~r.indexOf('M  packages/components'))
  ?.replace(/\//g, '%%')
  ?.match(/packages%%components%%((\w|-)*)/)?.[1]

/** @type {import('czg').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'release',
        'style',
        'test',
        'improvement',
      ],
    ],
    'scope-enum': [2, 'always', scopes],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [
      1,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
  },
  prompt: {
    defaultScope: scopeComplete,
    customScopesAlign: !scopeComplete ? 'top' : 'bottom',
    defaultSubject: subjectComplete && `[${subjectComplete}] `,
    allowCustomIssuePrefixs: false,
    allowEmptyIssuePrefixs: false,
    // 这里后续不选择 ISSUE 是不会显示的
    issuePrefixes: [
      { value: 'fixes', name: 'fixes: 修复了哪些问题' },
      { value: 'closes', name: 'closes: 需要关闭哪些 Issue' },
    ],
    messages: {
      type: '选择你要提交的类型 :',
      scope: '选择一个提交范围（可选）:',
      customScope: '请输入自定义的提交范围 :',
      subject: '填写简短精炼的变更描述（请使用 [bus-dialog, more] 格式来注明组件名称） :\n',
      body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
      breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',
      footerPrefixesSelect: '选择关联issue前缀（可选）:',
      customFooterPrefix: '输入自定义issue前缀 :',
      footer: '列举关联issue (可选) 例如: #31, #I3244 :\n',
      confirmCommit: '是否提交或修改commit ?',
    },
    types: [
      { value: 'build', name: 'build: 构建相关 | 用于修改项目构建系统，例如修改依赖库、外部接口或者升级 Node 版本等' },
      { value: 'chore', name: 'chore: 其他修改 | 用于对非业务性代码进行修改，例如修改构建流程或者工具配置等' },
      { value: 'ci', name: 'ci: 持续集成 | 用于修改持续集成流程，例如修改 Travis、Jenkins 等工作流配置' },
      { value: 'docs', name: 'docs: 文档更新 | 用于修改文档，例如修改 README 文件、API 文档等' },
      { value: 'feat', name: 'feat: 新增功能 | 在代码库中新增了一个功能' },
      { value: 'fix', name: 'fix: 修复缺陷 | 表示在代码库中修复了一个 bug' },
      { value: 'perf', name: 'perf: 性能提升 | 用于优化性能，例如提升代码的性能、减少内存占用等' },
      { value: 'refactor', name: 'refactor: 代码重构 | 用于重构代码，例如修改代码结构、变量名、函数名等但不修改功能逻辑' },
      { value: 'revert', name: 'revert: 回退代码 | 用于回滚代码' },
      { value: 'release', name: 'release: 发布版本 | 用于发布指定 tag 的版本' },
      { value: 'style', name: 'style: 代码格式 | 用于修改代码的样式，例如调整缩进、空格、空行等' },
      { value: 'test', name: 'test: 测试相关 | 用于修改测试用例，例如添加、删除、修改代码的测试用例等' },
      { value: 'improvement', name: 'improvement: 体验/实现改进 | 用于改进现有功能或实现（如交互、可访问性、实现方式等），不含新功能与 bug 修复' },
    ],
  },
}
