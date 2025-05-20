import { KnowledgeItem } from "./schema.js";

export class KnowledgeResource {
  private items: Map<string, KnowledgeItem> = new Map();

  // 新增知识单元
  add(item: KnowledgeItem): void {
    this.items.set(item.id, item);
  }

  // 查询知识单元（支持条件过滤）
  list(filter?: Partial<Pick<KnowledgeItem, "projectTypes" | "appIds" | "visibility" | "owner" | "tags">>): KnowledgeItem[] {
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
      if (filter.tags) {
        result = result.filter(item => item.tags?.some((tag: string) => filter.tags!.includes(tag)));
      }
    }
    return result;
  }

  // 获取单个知识单元
  get(id: string): KnowledgeItem | undefined {
    return this.items.get(id);
  }

  // 更新知识单元
  update(id: string, update: Partial<KnowledgeItem>): boolean {
    const item = this.items.get(id);
    if (!item) return false;
    this.items.set(id, { ...item, ...update, updatedAt: new Date().toISOString() });
    return true;
  }

  // 删除知识单元
  remove(id: string): boolean {
    return this.items.delete(id);
  }
} 