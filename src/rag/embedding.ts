import axios from "axios";

export class OllamaEmbedding {
  private baseUrl: string;
  private model: string;

  constructor(options: { baseUrl?: string; model?: string } = {}) {
    this.baseUrl = options.baseUrl || "http://localhost:11434";
    this.model = options.model || "nomic-embed-text";
  }

  async embed(text: string): Promise<number[]> {
    const resp = await axios.post(
      `${this.baseUrl}/api/embeddings`,
      {
        model: this.model,
        prompt: text,
      },
      { timeout: 10000 }
    );
    if (resp.data && Array.isArray(resp.data.embedding)) {
      return resp.data.embedding;
    }
    throw new Error("Ollama embedding API返回格式异常");
  }
} 