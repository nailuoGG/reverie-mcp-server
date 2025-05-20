#!/usr/bin/env node
/**
 * Main entry point for the Knowledge MCP Server
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { KnowledgeResource } from "./knowledge/resource.js";
import { KnowledgeTool } from "./knowledge/tool.js";

async function main() {
	const server = new McpServer({
		name: "knowledge-mcp-server",
		version: "0.1.0",
	});

	// 初始化知识资源与工具
	const resource = new KnowledgeResource();
	const tool = new KnowledgeTool(resource);

	// 注册MCP工具
	server.tool(
		"listKnowledge",
		{
			projectTypes: z.array(z.string()).optional(),
			appIds: z.array(z.string()).optional(),
			visibility: z.enum(["private", "team", "public"]).optional(),
			owner: z.string().optional(),
			team: z.string().optional(),
			tags: z.array(z.string()).optional(),
			currentUser: z.string().optional(),
			currentTeam: z.string().optional(),
			minVisibility: z.enum(["private", "team", "public"]).optional(),
		},
		async (params) => ({
			content: [
				{
					type: "json",
					text: JSON.stringify(tool.listKnowledge(params)),
				},
			],
		})
	);

	server.tool(
		"searchKnowledge",
		{
			query: z.string(),
			projectTypes: z.array(z.string()).optional(),
			appIds: z.array(z.string()).optional(),
			currentUser: z.string().optional(),
			currentTeam: z.string().optional(),
			topK: z.number().optional(),
		},
		async (params) => ({
			content: [
				{
					type: "json",
					text: JSON.stringify(tool.searchKnowledge(params)),
				},
			],
		})
	);

	server.tool(
		"addKnowledge",
		{
			item: z.object({
				id: z.string(),
				title: z.string(),
				summary: z.string(),
				example: z.string(),
				demoUrl: z.string().optional(),
				docUrl: z.string().optional(),
				projectTypes: z.array(z.string()),
				appIds: z.array(z.string()).optional(),
				visibility: z.enum(["private", "team", "public"]),
				owner: z.string().optional(),
				tags: z.array(z.string()).optional(),
				createdAt: z.string(),
				updatedAt: z.string(),
			}),
			currentUser: z.string(),
		},
		async ({ item, currentUser }) => ({
			content: [
				{
					type: "text",
					text: tool.addKnowledge(item, currentUser) ? "ok" : "fail",
				},
			],
		})
	);

	server.tool(
		"deleteKnowledge",
		{
			id: z.string(),
			currentUser: z.string(),
		},
		async ({ id, currentUser }) => ({
			content: [
				{
					type: "text",
					text: tool.deleteKnowledge(id, currentUser) ? "ok" : "fail",
				},
			],
		})
	);

	// 启动MCP Server
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("Knowledge MCP server running on stdio");
}

main().catch(console.error);
