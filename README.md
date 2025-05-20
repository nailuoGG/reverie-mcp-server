# reverie-mcp-server

> A cross-project, cross-team, and best-practice knowledge base server for AI and developers

## Overview

reverie-mcp-server is a knowledge base server based on the [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol). It supports cross-project, cross-application, multi-level permissions, and both structured and RAG (vector search) knowledge storage and retrieval. It enables AI and developers to efficiently collaborate, accumulate, and reuse best practices.

## Features
- **Atomic Markdown Knowledge Units**: Each knowledge point is an independent Markdown file, easy for manual maintenance and version control
- **RAG Capability**: Automatically sync Markdown to Qdrant vector database for semantic search
- **Multi-project/Multi-app/Multi-team**: Supports filtering and isolation by projectType, appId, owner, team, visibility, etc.
- **MCP Tool/Resource API**: Exposes list/search/add/delete knowledge operations via MCP protocol, accessible by AI and users
- **Permission Levels**: Supports private, team, and public knowledge isolation
- **Best Practice Accumulation**: Extensible for auto-summarization, recommendation, and completion tools

## Quick Start

### Requirements
- Node.js >= 18
- [Qdrant](https://qdrant.tech/) vector database (local or cloud)
- [Ollama](https://ollama.com/) embedding API (or custom embedding service)

### Install dependencies
```bash
npm install
```

### Start MCP Server
```bash
npm run build
npx reverie-mcp-server 
```

### Directory Structure
```
knowledge/
  items/                # Markdown knowledge units
src/
  knowledge/           # Structured knowledge and permission logic
  rag/                 # RAG/vector search logic
  index.ts             # MCP Server entry point
```

### Main APIs (MCP Tool)
- `listKnowledge`: List knowledge with multi-dimensional filtering and permission isolation
- `searchKnowledge`: Structured/semantic search (can be extended to RAG)
- `addKnowledge`: Securely add new knowledge
- `deleteKnowledge`: Securely delete knowledge

### Markdown Knowledge Unit Example
```markdown
---
id: xxx-001
title: Feature Implementation
summary: Brief principle/API
projectTypes: [miniapp, taro]
appIds: [app1, app2]
visibility: public
owner: team-abc
tags: [navigation, jump]
createdAt: 2024-06-01T12:00:00Z
updatedAt: 2024-06-01T12:00:00Z
demoUrl: https://demo.com
docUrl: https://docs.com
---

## Effect Overview
...

## Principle/API
...

## Code Example
```js
// Example code
```
```

## Development & Extension
- All core logic is modular, easy to extend with more Tool/Resource
- Supports custom embedding, RAG backend, and permission models
- Recommended to manage Markdown knowledge files with Git for team collaboration

## Contribution
PRs, issues, and discussions are welcome!

## License
GNU General Public License v3.0 (GPLv3)

This project is licensed under the GNU GPL v3. See the LICENSE file for details.
