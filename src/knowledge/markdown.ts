import fs from "fs/promises";
import matter from "gray-matter";
import { KnowledgeItem } from "./schema.js";
import path from "path";
import { RagStore } from "../rag/types.js";

/**
 * 解析单个Markdown文件为KnowledgeItem对象
 */
export async function parseMarkdownToKnowledgeItem(filePath: string): Promise<KnowledgeItem> {
  const raw = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(raw);
  // 兼容createdAt/updatedAt
  const now = new Date().toISOString();
  return {
    id: data.id || filePath,
    title: data.title || "",
    summary: data.summary || "",
    example: extractExample(content),
    demoUrl: data.demoUrl,
    docUrl: data.docUrl,
    projectTypes: data.projectTypes || [],
    appIds: data.appIds || [],
    visibility: data.visibility || "private",
    owner: data.owner || "",
    tags: data.tags || [],
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
  };
}

/**
 * 简单提取代码例子（第一个代码块）
 */
function extractExample(content: string): string {
  const match = content.match(/```[\w]*\n([\s\S]*?)```/);
  return match ? match[1].trim() : "";
}

/**
 * 批量扫描knowledge/items目录下的md文件，解析并同步到RagStore
 */
export async function syncAllMarkdownToRag(ragStore: RagStore, itemsDir = "knowledge/items"): Promise<void> {
  const files = await fs.readdir(itemsDir);
  const mdFiles = files.filter(f => f.endsWith(".md"));
  const docs = [];
  for (const file of mdFiles) {
    const filePath = path.join(itemsDir, file);
    const item = await parseMarkdownToKnowledgeItem(filePath);
    docs.push({
      id: item.id,
      text: item.summary + "\n" + item.example,
      metadata: { ...item, filePath },
    });
  }
  await ragStore.upsert(docs);
} 