export interface RagDocument {
  id: string;
  text: string;
  metadata: Record<string, any>;
  embedding?: number[];
}

export interface RagSearchResult {
  id: string;
  score: number;
  text: string;
  metadata: Record<string, any>;
}

export interface RagStore {
  upsert(docs: RagDocument[]): Promise<void>;
  search(query: string, topK: number, filter?: Record<string, any>): Promise<RagSearchResult[]>;
  delete(ids: string[]): Promise<void>;
} 