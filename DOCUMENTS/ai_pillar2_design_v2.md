# Genskey AI Pillar 2: LLM Co-Scientist System - Design V2 Blueprint

## 🎯 Introduction & Scope

This document extends the initial "Genskey AI Pillar 2: LLM Co-Scientist System" design, outlining the necessary enhancements to transition from a functional prototype to a robust, enterprise-grade implementation. The previous development achieved a working demo, establishing core agent structures and mock service integrations. This V2 Blueprint focuses on deepening those integrations, maturing the agent orchestration, and enriching the user experience to meet the comprehensive vision articulated in the "Genskey Bio Platform Design Specification.md".

## 🏗️ Architectural Evolution

The core architecture remains multi-agent, leveraging RAG, knowledge graphs, and LLM orchestration. The evolution centers on making these components more intelligent, interconnected, and production-ready.

### 1. Full RAG Integration Enhancement

**Current Prototype Status:**
- Basic vector search using `VectorDBService` (mocked).
- `PubMedService` for fetching article details.
- `KnowledgeGraphService` for Neo4j interaction (schema defined, but not populated).
- No explicit context management or hybrid retrieval.

**Proposed V2 Design:**

#### 1.1 Hybrid Retrieval Strategy Implementation
- **Objective:** Improve retrieval accuracy and recall by combining multiple search modalities.
- **Components:**
    - **Vector Search:** Continue using `VectorDBService` (with real Pinecone/Weaviate).
    - **Lexical Search (BM25):** Integrate with Elasticsearch or a similar solution for keyword-based retrieval on raw text content (titles, abstracts, full-text chunks).
    - **Knowledge Graph Traversal:** Develop `KnowledgeGraphService` methods to identify and retrieve relevant facts/relationships from Neo4j based on query entities (e.g., if query mentions a disease, retrieve associated papers/strains from KG).
    - **Fusion Algorithm:** Implement Reciprocal Rank Fusion (RRF) or a learned ranker to combine results from vector, lexical, and graph searches into a single, ranked list of documents/facts.
    - **Re-ranking:** Introduce a cross-encoder model (e.g., `ms-marco-MiniLM-L-12-v2`) to re-rank the top-K retrieved documents based on their relevance to the original query.

#### 1.2 Context-Aware Retrieval & Management
- **Objective:** Maintain and leverage conversational and project-level context for more relevant RAG.
- **Components:**
    - **`ContextManager` Service:** A dedicated backend service (e.g., `backend/services/context_manager_service.py`) to manage:
        - **Session Memory:** Stores recent conversation turns, extracted entities, and user preferences for the current session.
        - **Project Memory:** Persists project-specific information (e.g., target disease, lead strains, key findings, pending questions) across sessions (stored in PostgreSQL/Neo4j).
    - **Query Enhancement:** Before RAG search, the `ContextManager` will enrich the user's query with relevant project details and conversation history, improving retrieval effectiveness.

#### 1.3 Knowledge Graph Population Pipeline
- **Objective:** Automate the extraction of structured knowledge from scientific literature and platform data into Neo4j.
- **Components:**
    - **Entity/Relationship Extraction (ERE) Agent:** An LLM-based agent (or dedicated NLP pipeline) that processes PubMed article abstracts/full-texts and extracts entities (Microbes, Genes, Diseases, Metabolites) and their relationships (e.g., `Microbe-TREATS-Disease`, `Paper-STUDIES-Strain`).
    - **Integration with `EmbeddingPipeline`:** Extend the `EmbeddingPipeline` to include an ERE step. After fetching and embedding articles, this step would parse the articles and send extracted entities/relationships to the `KnowledgeGraphService` for ingestion.
    - **Platform Data Integration:** Develop connectors to automatically ingest structured platform data (e.g., `strains` table in PostgreSQL) into Neo4j, creating corresponding nodes and relationships.

### 2. Advanced Agent Orchestration (LangGraph & Supervisor Agent)

**Current Prototype Status:**
- Individual worker agents (Literature, Experimental Design, etc.) callable directly via a simple `agent_router`.
- No explicit "Supervisor Agent" or LangGraph implementation for cyclic workflows.
- No state persistence for multi-turn agent interactions.

**Proposed V2 Design:**

#### 2.1 LangGraph-based Multi-Agent System
- **Objective:** Enable complex, multi-step, self-correcting workflows that mimic human scientific reasoning.
- **Components:**
    - **Central `SupervisorAgent`:** Implemented as the orchestrator within LangGraph. Its role:
        - Receive high-level user goals.
        - Break down goals into sub-tasks (planning).
        - Delegate sub-tasks to specialized worker agents (Literature, Experimental Design, etc.).
        - Evaluate worker agent outputs.
        - Decide on next steps, including re-planning or invoking human intervention.
        - Manage the overall workflow state.
    - **Worker Agents as Nodes:** Each specialized agent (Literature, Experimental Design, Regulatory, Hypothesis, Data Insight) becomes a node in the LangGraph, representing a specific capability.
    - **State Object (TypedDict):** Define a comprehensive `AgentState` object that stores:
        - Conversation history.
        - Intermediate results from worker agents.
        - Extracted entities.
        - Project context.
        - Decision history.
    - **Conditional Edges:** LangGraph's conditional edges will define the flow between agents based on the `AgentState` (e.g., if `SafetyAgent` flags an issue, route to `LiteratureAgent` for alternatives).
    - **Human-in-the-Loop:** Implement mechanisms for the `SupervisorAgent` to request human input or review at critical decision points, with the workflow pausing and resuming.

#### 2.2 Agent Tooling
- **Objective:** Allow agents to interact with external systems and platform capabilities.
- **Components:**
    - **Internal Tools:** Each agent will be equipped with "tools" to perform specific actions:
        - `LiteratureAgent`: `search_vector_db`, `query_knowledge_graph`, `fetch_full_text`.
        - `ExperimentalDesignAgent`: `query_strain_library`, `query_equipment_availability`, `access_project_budget`.
        - `RegulatoryAgent`: `check_vfdb`, `check_card`, `access_regulatory_docs_kb`.
        - `DocumentGeneratorAgent` (new agent): `generate_report`, `export_pdf`.
    - **External API Calls:** Agents can be configured to call external APIs (e.g., PubMed, internal lab systems) through these tools.

### 3. Enhanced Regulatory Agent

**Current Prototype Status:**
- Basic LLM interaction for regulatory questions.
- No integration with actual regulatory knowledge bases or automated checks.

**Proposed V2 Design:**

#### 3.1 Regulatory Knowledge Base Integration
- **Objective:** Provide the Regulatory Agent with precise, up-to-date regulatory context.
- **Components:**
    - **Dedicated Vector DB Index:** Index thousands of regulatory documents (FDA Guidance, NMPA Guidelines, internal SOPs) into a separate Pinecone/Weaviate index.
    - **Structured Data Integration:** Populate Neo4j with structured regulatory information (e.g., "Drug_Type-REQUIRES-Test_X", "Section_Y-MENTIONS-Guideline_Z").
    - **RAG for Regulatory Queries:** The `RegulatoryAgent` will use this dedicated RAG system to retrieve relevant clauses/sections before generating responses.

#### 3.2 Automated Compliance Checks & Gap Analysis
- **Objective:** Automate the identification of regulatory risks and missing information.
- **Components:**
    - **Integration with VFDB/CARD:** Implement backend services to query virulence factor and antibiotic resistance databases. The `RegulatoryAgent` will call these as tools.
    - **Rule-Based Checkers:** Develop a system to automatically check proposed strains/protocols against predefined regulatory rules (e.g., "IF Strain HAS AMR Gene AND NOT Intrinsic THEN FLAG as High Risk").
    - **"Regulatory Gap Report" Generation:** The `RegulatoryAgent` will generate structured reports highlighting non-compliance issues and suggesting required data or studies.

### 4. Advanced Document Generation

**Current Prototype Status:**
- Basic template service with hardcoded templates.
- Placeholder for multi-format export (returns Markdown).
- Frontend UI allows basic form filling and a prototype template editor (local state only).

**Proposed V2 Design:**

#### 4.1 Dynamic Data Integration for Generation
- **Objective:** Populate document templates with live data from across the Genskey platform.
- **Components:**
    - **Agent-Driven Data Retrieval:** Document generation will be initiated by a `DocumentGeneratorAgent` (or the `SupervisorAgent`). This agent will use various data-accessing tools (e.g., `query_postgresql`, `query_neo4j`, `fetch_minio_metadata`) to gather all necessary information for a specific document type.
    - **Data Mapping Service:** A flexible service to map queried platform data fields to template placeholders (e.g., `strain.species_name` -> `{strain_species}`).

#### 4.2 True Multi-Format Export
- **Objective:** Provide high-quality document exports in standard formats.
- **Components:**
    - **PDF Generation:** Integrate a Python library like `WeasyPrint` (for HTML-to-PDF) or `ReportLab` (for programmatic PDF generation), focusing on professional styling, pagination, and embedding of figures/tables.
    - **DOCX Generation:** Integrate `python-docx` for generating editable Word documents, ensuring proper formatting, tables, and image insertion.
    - **LaTeX Integration (Optional):** For highly scientific reports, consider `LaTeX` generation for precise typesetting.

#### 4.3 Persistent Template Management (UI & Backend)
- **Objective:** Allow users to create, modify, and manage document templates through the UI, with proper persistence.
- **Components:**
    - **Template Storage:** A dedicated database table (e.g., in PostgreSQL) to store template content (markdown/HTML), metadata (name, description, required fields), and version information.
    - **Backend API for Templates:** New API endpoints (`/api/templates`) for CRUD operations on templates (`GET /templates`, `POST /templates`, `PUT /templates/{id}`, `DELETE /templates/{id}`).
    - **Enhanced Frontend UI:**
        - Document templates are fetched dynamically from the backend.
        - The "Template Customization Interface" will save changes to the backend, enabling persistence.
        - Implement a basic versioning system for templates (e.g., auto-incrementing version numbers, timestamped saves).

### 5. Refined Chat UI/UX

**Current Prototype Status:**
- Basic request-response chat interface.
- Manual task selection via dropdown.
- No streaming, context visualization, or deep RAG integration in UI.

**Proposed V2 Design:**

#### 5.1 Streaming Response Display
- **Objective:** Enhance user experience with real-time token-by-token LLM output.
- **Components:**
    - **Backend Streaming:** Modify `LLMRouterService` to support streaming responses from LLM providers (e.g., using OpenAI's `stream=True`).
    - **FastAPI SSE Endpoint:** Expose a Server-Sent Events (SSE) or WebSocket endpoint (e.g., `/api/agent/stream`) that streams the LLM output to the frontend.
    - **Frontend SSE/WebSocket Client:** `CopilotChat.jsx` will implement an SSE or WebSocket client to consume the stream and display tokens as they arrive.

#### 5.2 Context Memory Visualization
- **Objective:** Provide transparency into the AI's current understanding and context.
- **Components:**
    - **Sidebar/Modal UI:** A dedicated UI element (e.g., a collapsible sidebar or modal) in `CopilotChat.jsx` to display:
        - **Recent Conversation Turns:** Summarized history.
        - **Extracted Entities:** List of recognized biological entities (strains, diseases, genes) from the conversation.
        - **Active Project Context:** Key parameters of the currently selected project.
        - **Retrieved RAG Documents:** List of documents used for the current response, with links.
    - **`ContextManager` Frontend Integration:** The frontend will query the `ContextManager` service to retrieve and display this information.

#### 5.3 Enhanced Intent Recognition & Dynamic Agent Invocation
- **Objective:** Allow users to express complex queries naturally, with the system dynamically determining the intent and appropriate agent(s).
- **Components:**
    - **LLM-Based Intent Classifier:** The `SupervisorAgent` (or a dedicated `IntentClassifier` service) will use an LLM to analyze the user's natural language input and classify it into one or more intents (e.g., "literature_search", "experimental_design", "document_generation").
    - **Frontend Suggestion:** Based on the classified intent, the UI could suggest the best agent to handle the query or automatically switch contexts.

### 6. Other Core Module Integrations (Genskey Bio Platform Design Specification)

**Current Prototype Status:**
- Agents are largely standalone, not directly interacting with GenskeyMine, GenskeyDesign, GenskeyTwin, or live platform data (beyond mock).

**Proposed V2 Design:**

#### 6.1 Agent-Enabled Data Access
- **Objective:** Allow AI agents to programmatically access and interact with the platform's core data and functionalities.
- **Components:**
    - **Standardized API Endpoints:** Ensure all core platform services (Discovery, Design, Twin, Trial) expose well-defined RESTful APIs.
    - **Agent Tools for Platform Access:** Develop specific "tools" for agents to:
        - Query `StrainLibrary` (PostgreSQL).
        - Fetch `ExperimentalResults` (PostgreSQL/MinIO).
        - Trigger `GNNModels` or `COBRApy` simulations (via `DesignService`).
        - Access `EquipmentManager` status (via `TwinService`).
        - Upload/download files from `MinIO`.

#### 6.2 Frontend Integration with Agent Outputs
- **Objective:** Display agent-generated content and insights seamlessly within relevant UI components.
- **Components:**
    - **Dynamic Dashboards:** Update dashboards (e.g., Dr. Chen's "Mission Control") with agent-generated insights, reports, and status updates (e.g., "Safety Agent Flagged Strain X").
    - **Interactive Visualizations:** Integrate agent output with existing visualization components (e.g., `Network Canvas` in GenskeyDesign updated with agent-predicted interactions).
    - **Alerts and Notifications:** System-wide alerts for agent-triggered events (e.g., regulatory non-compliance).

## 🚀 Conclusion

This Design V2 Blueprint outlines a path to mature the Genskey AI Co-Scientist System from a functional prototype to a powerful, integrated platform. The focus is on implementing sophisticated orchestration, deeper RAG, and seamless integration with the broader Genskey ecosystem, ultimately delivering a truly intelligent research assistant capable of accelerating LBP discovery.
