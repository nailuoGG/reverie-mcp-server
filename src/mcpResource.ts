/**
 * MCP Resource handlers for Anki
 */
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { AnkiClient } from "./utils.js";

/**
 * Handles all MCP resource operations for Anki
 */
export class McpResourceHandler {
	private ankiClient: AnkiClient;
	private modelSchemaCache: Map<string, ModelSchema>;
	private allModelSchemasCache: ModelSchema[] | null;
	private cacheExpiry: number;
	private lastCacheUpdate: number;

	constructor() {
		this.ankiClient = new AnkiClient();
		this.modelSchemaCache = new Map();
		this.allModelSchemasCache = null;
		this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
		this.lastCacheUpdate = 0;
	}

	/**
	 * List all available resources
	 */
	async listResources(): Promise<{
		resources: {
			uri: string;
			name: string;
			description?: string;
			mimeType?: string;
		}[];
	}> {
		await this.ankiClient.checkConnection();

		return {
			resources: [
				{
					uri: "anki://decks/all",
					name: "All Decks",
					description: "List of all available decks in Anki",
					mimeType: "application/json",
				},
			],
		};
	}

	/**
	 * List all available resource templates
	 */
	async listResourceTemplates(): Promise<{
		resourceTemplates: {
			uriTemplate: string;
			name: string;
			description?: string;
			mimeType?: string;
		}[];
	}> {
		await this.ankiClient.checkConnection();

		return {
			resourceTemplates: [
				{
					uriTemplate: "anki://note-types/{modelName}",
					name: "Note Type Schema",
					description:
						"Detailed structure information for a specific note type",
					mimeType: "application/json",
				},
			],
		};
	}

	/**
	 * Read a resource by URI
	 */
	async readResource(uri: string): Promise<{
		contents: {
			uri: string;
			mimeType?: string;
			text: string;
		}[];
	}> {
		await this.ankiClient.checkConnection();
		if (uri === "anki://decks/all") {
			const decks = await this.ankiClient.getDeckNames();
			return {
				contents: [
					{
						uri,
						mimeType: "application/json",
						text: JSON.stringify(
							{
								decks,
								count: decks.length,
							},
							null,
							2,
						),
					},
				],
			};
		}

		throw new McpError(ErrorCode.InvalidParams, `Unknown resource: ${uri}`);
	}

	/**
	 * Clear all cached data
	 */
	clearCache(): void {
		this.modelSchemaCache.clear();
		this.allModelSchemasCache = null;
		this.lastCacheUpdate = 0;
	}
}

/**
 * Model schema type
 */
interface ModelSchema {
	modelName: string;
	fields: string[];
	templates: Record<string, { Front: string; Back: string }>;
	css: string;
}
