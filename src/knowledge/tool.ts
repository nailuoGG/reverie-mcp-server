import { KnowledgeResource } from "./resource.js";
import { KnowledgeItem, Visibility } from "./schema.js";

export class KnowledgeTool {
  constructor(private resource: KnowledgeResource) {}

  /**
   * 列出知识（支持多维度过滤和权限）
   */
  listKnowledge(params: {
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
    return this.resource.list(params);
  }

  /**
   * 语义检索知识（可扩展为RAG检索）
   */
  searchKnowledge(params: {
    query: string;
    projectTypes?: string[];
    appIds?: string[];
    currentUser?: string;
    currentTeam?: string;
    topK?: number;
  }): KnowledgeItem[] {
    // 这里只做结构化过滤，后续可接入RAG
    return this.resource.list(params);
  }

  /**
   * 新增知识（需指定owner）
   */
  addKnowledge(item: KnowledgeItem, currentUser: string): boolean {
    if (!item.owner) item.owner = currentUser;
    this.resource.add(item);
    return true;
  }

  /**
   * 删除知识（需权限校验）
   */
  deleteKnowledge(id: string, currentUser: string): boolean {
    return this.resource.remove(id, currentUser);
  }
} 