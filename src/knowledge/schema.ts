// 通用知识单元类型定义
export type Visibility = "private" | "team" | "public";

export interface KnowledgeItem {
  id: string; // 唯一标识
  title: string; // 效果介绍
  summary: string; // 简述原理/API
  example: string; // 代码例子
  demoUrl?: string; // 可执行Demo或官方文档URL
  docUrl?: string; // 官方文档URL
  projectTypes: string[]; // 适用工程类型
  appIds?: string[]; // 适用应用ID
  visibility: Visibility; // 权限层级
  owner: string; // 所属用户/团队/组织
  tags?: string[]; // 关键词标签
  createdAt: string;
  updatedAt: string;
}

// 预设工程类型
export const DEFAULT_PROJECT_TYPES = [
  "app-hybrid",
  "browser-h5",
  "browser-pc",
  "admin-pc",
  "miniapp",
  "taro",
]; 