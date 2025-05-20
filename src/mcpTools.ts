/**
 * MCP Tool handlers for Anki
 */
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { AnkiClient } from "./utils.js";

/**
 * Handles all MCP tool operations for Anki
 */
export class McpToolHandler {
	private ankiClient: AnkiClient;

	constructor() {
		this.ankiClient = new AnkiClient();
	}

	/**
	 * Get tool schema for all available tools
	 */
	async getToolSchema(): Promise<{
		tools: {
			name: string;
			description: string;
			inputSchema: Record<string, any>;
		}[];
	}> {
		return {
			tools: [
				{
					name: "list_decks",
					description: "List all available Anki decks",
					inputSchema: {
						type: "object",
						properties: {},
						required: [],
					},
				},
			],
		};
	}

	/**
	 * Handle tool execution
	 */
	async executeTool(
		name: string,
		args: any,
	): Promise<{
		content: {
			type: string;
			text: string;
		}[];
		isError?: boolean;
	}> {
		await this.ankiClient.checkConnection();

		try {
			switch (name) {
				// Deck tools
				case "list_decks":
					return this.listDecks();
				// Dynamic model-specific note creation
				default:
					const typeToolMatch = name.match(/^create_(.+)_note$/);
					if (typeToolMatch) {
						const modelName = typeToolMatch[1].replace(/_/g, " ");
						return this.createModelSpecificNote(modelName, args);
					}

					throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
			}
		} catch (error) {
			if (error instanceof McpError) {
				throw error;
			}

			return {
				content: [
					{
						type: "text",
						text: `Error: ${
							error instanceof Error ? error.message : String(error)
						}`,
					},
				],
				isError: true,
			};
		}
	}
}
