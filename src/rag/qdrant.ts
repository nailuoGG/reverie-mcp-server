import { Api } from "qdrant-client";
import type { RagDocument, RagSearchResult, RagStore } from "./types.js";

const COLLECTION_NAME = "knowledge_items";

/**
 * QdrantRagStore: 基于Qdrant的RAG向量存储实现
 * 依赖qdrant-client的Api类
 */
export class QdrantRagStore implements RagStore {
  private client: Api<any>;
  private vectorSize: number;

  constructor(options: { url?: string; vectorSize?: number } = {}) {
    this.client = new Api({
      baseUrl: options.url || "http://localhost:6333",
    });
    this.vectorSize = options.vectorSize || 768;
  }

  /**
   * 批量插入或更新向量文档
   */
  async upsert(docs: RagDocument[]): Promise<void> {
    await this.ensureCollection();
    await this.client.upsertPoints(COLLECTION_NAME, {
      points: docs.map((doc: RagDocument) => ({
        id: doc.id,
        vector: doc.embedding || [],
        payload: doc.metadata,
      })),
    });
  }

  /**
   * 基于embedding向量检索相似文档
   */
  async search(query: string, topK: number, filter?: Record<string, any>, embedding?: number[]): Promise<RagSearchResult[]> {
    if (!embedding) throw new Error("search必须传入embedding");
    const res = await this.client.searchPoints(COLLECTION_NAME, {
      vector: embedding,
      limit: topK,
      filter: filter ? { must: Object.entries(filter).map(([k, v]) => ({ key: k, match: { value: v } })) } : undefined,
    });
    return res.result.map((r: any) => ({
      id: String(r.id),
      score: r.score,
      text: r.payload?.text || "",
      metadata: r.payload || {},
    }));
  }

  /**
   * 删除指定id的向量文档
   */
  async delete(ids: string[]): Promise<void> {
    await this.client.deletePoints(COLLECTION_NAME, { points: ids });
  }

  /**
   * 确保collection存在
   */
  private async ensureCollection() {
    const collections = await this.client.getCollections();
    if (!collections.result.some((c: any) => c.name === COLLECTION_NAME)) {
      await this.client.createCollection(COLLECTION_NAME, {
        vectors: { size: this.vectorSize, distance: "Cosine" },
      });
    }
  }
} 