import { KnowledgeItem, Visibility } from "./schema.js";

export class KnowledgeResource {
  private items: Map<string, KnowledgeItem> = new Map();

  // 新增知识单元
  add(item: KnowledgeItem): void {
    this.items.set(item.id, item);
  }

  // 查询知识单元（支持多维度过滤和权限）
  list(filter?: {
    projectTypes?: string[];
    appIds?: string[];
    visibility?: Visibility;
    owner?: string;
    team?: string;
    tags?: string[];
    currentUser?: string;
    currentTeam?: string;
    minVisibility?: Visibility;
  }): KnowledgeItem[] {
    let result = Array.from(this.items.values());
    if (filter) {
      if (filter.projectTypes) {
        result = result.filter(item => item.projectTypes.some((pt: string) => filter.projectTypes!.includes(pt)));
      }
      if (filter.appIds) {
        result = result.filter(item => item.appIds?.some((appId: string) => filter.appIds!.includes(appId)));
      }
      if (filter.visibility) {
        result = result.filter(item => item.visibility === filter.visibility);
      }
      if (filter.owner) {
        result = result.filter(item => item.owner === filter.owner);
      }
      if (filter.team) {
        const team = filter.team;
        result = result.filter(item => team && (item.owner === team || (item.tags && item.tags.includes(team))));
      }
      if (filter.tags) {
        result = result.filter(item => item.tags?.some((tag: string) => filter.tags!.includes(tag)));
      }
      // 权限隔离：只返回当前用户/团队可见的内容
      if (filter.currentUser || filter.currentTeam) {
        result = result.filter(item => {
          if (item.visibility === "public") return true;
          if (item.visibility === "team" && filter.currentTeam && (item.owner === filter.currentTeam || (item.tags && item.tags.includes(filter.currentTeam)))) return true;
          if (item.visibility === "private" && filter.currentUser && item.owner === filter.currentUser) return true;
          return false;
        });
      }
      // 可选：最小可见性过滤
      if (filter.minVisibility) {
        const visOrder = { "private": 0, "team": 1, "public": 2 };
        result = result.filter(item => visOrder[item.visibility] >= visOrder[filter.minVisibility!]);
      }
    }
    return result;
  }

  // 获取单个知识单元
  get(id: string): KnowledgeItem | undefined {
    return this.items.get(id);
  }

  // 更新知识单元
  update(id: string, update: Partial<KnowledgeItem>, currentUser?: string): boolean {
    const item = this.items.get(id);
    if (!item) return false;
    // 只有owner或public可更新
    if (currentUser && item.owner !== currentUser && item.visibility !== "public") return false;
    this.items.set(id, { ...item, ...update, updatedAt: new Date().toISOString() });
    return true;
  }

  // 删除知识单元
  remove(id: string, currentUser?: string): boolean {
    const item = this.items.get(id);
    if (!item) return false;
    if (currentUser && item.owner !== currentUser && item.visibility !== "public") return false;
    return this.items.delete(id);
  }
} 