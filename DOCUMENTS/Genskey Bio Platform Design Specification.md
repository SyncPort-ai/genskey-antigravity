# **Genskey Enterprise Platform: Architectural Specification and Design Blueprint for Next-Generation Live Biotherapeutic Product Discovery**

## **1\. Executive Summary and Strategic Imperative**

The global pharmaceutical sector stands at a precipice of transformation, shifting from the reductionist "one target, one molecule" paradigm that defined the small-molecule era toward the systemic, ecological complexity of Live Biotherapeutic Products (LMPs). This transition represents not merely a change in therapeutic modality but a fundamental reimagining of medicine itself—viewing the human body not as a solitary organism but as a holobiont, a dynamic ecosystem of host cells integrated with trillions of microbial symbionts. For Genskey Medical Technology Co. Ltd., already a dominant force in the high-precision diagnostics market via Next-Generation Sequencing (NGS), this shift offers a singular strategic opportunity: to pivot from observing the microbiome to engineering it.

This document serves as the definitive Architectural Specification and Design Blueprint for the **Genskey Platform (Genskey.Bio)**. It is not simply a software requirement specification; it is a strategic manifesto for building an industrial-grade "Reverse Translation" engine. The platform is engineered to ingest the terabytes of clinical mNGS data generated daily by Genskey’s diagnostic operations, transforming this "digital exhaust" into high-value therapeutic assets—specifically, engineered microbial consortia and precision phage therapies tailored for the Asian market.

The challenge of LBP development is characterized by a "Valley of Death" distinct from traditional pharma. It is not defined by target affinity, but by ecological engraftment, manufacturing stability, and complex regulatory landscapes. To bridge this valley, the Genskey Platform integrates three frontier technologies into a cohesive, enterprise-level portal: **Agentic Artificial Intelligence (AI)** for autonomous scientific reasoning, **Graph Neural Networks (GNNs)** for unraveling the "dark matter" of microbial interactions, and **Digital Twins** for de-risking the fermentation of anaerobic bacteria.

Constructed on a robust, high-performance technology stack featuring **Python** and **FastAPI** for asynchronous computation, and a responsive **React** frontend styled with **Tailwind CSS** for rapid, consistent UI development, the platform is tailored specifically for the Chinese R\&D ecosystem. It prioritizes information density, local regulatory compliance (NMPA), and seamless bilingual (Chinese/English) operation. This document details the end-to-end design of this system, providing the rigorous technical, scientific, and operational standards required to establish Genskey as the global leader in computational microbiome engineering.

## ---

**2\. Strategic Product Analysis and User Personas**

The development of the Genskey Platform is driven by specific market gaps identified in the current landscape of AI-driven drug discovery. While platforms like Insilico Medicine’s *Pharma.ai* have revolutionized small molecule design through Generative Adversarial Networks (GANs), they remain fundamentally chemically oriented. They optimize binding pockets and solubility, metrics irrelevant to a living bacterium that must survive the acidic gastric transit, compete for carbon sources, and evade the host immune system. The Genskey Platform addresses this "Microbial Gap" by focusing on ecological engineering rather than molecular docking.

### **2.1 The "Reverse Translation" Product Vision**

The core philosophy of the platform is "Reverse Translation." Traditional drug discovery begins in a petri dish and hopes for efficacy in humans—a process fraught with a 90% failure rate. Genskey’s approach begins with the human. By analyzing longitudinal data from patients who recovered from infections (e.g., *Klebsiella pneumoniae*) or responded well to immuno-therapy, the platform identifies the specific microbial signatures (Keystone Species) associated with health. The product vision is to automate the extraction of these signatures and their conversion into reproducible therapeutic products.

### **2.2 Comprehensive Persona Analysis**

To ensure the platform meets the nuanced needs of its users, we define four primary personas. These roles dictate the specific UI/UX requirements and functional access levels within the system.

**1\. The Strategic Architect (Dr. Chen \- Chief Scientific Officer)**

* **Profile:** A veteran of both academic research and biotech management. Deeply concerned with portfolio risk, IP generation, and high-level milestones.  
* **Pain Points:** Fragmented data sources (Excel sheets, disjointed PDFs), lack of visibility into real-time project status, difficulty in translating bioinformatic results into business decisions.  
* **Platform Needs:** A "Mission Control" dashboard. Dr. Chen needs to see the status of the entire pipeline at a glance—how many phage candidates are in screening, the predicted success rate of the current COPD consortium, and immediate alerts on regulatory non-compliance.  
* **UI Requirement:** High-level data visualization (Sunburst charts for pipeline distribution), automated reporting features, and "Red/Green" status indicators for stage-gate progression.

**2\. The Computational Engineer (Li Wei \- Lead Bioinformatician)**

* **Profile:** Expert in Python, Linux, and genomic algorithms. Values flexibility, reproducibility, and raw compute power.  
* **Pain Points:** "Black box" AI tools that don't allow parameter tuning, inability to access raw data for validation, cumbersome file upload mechanisms for terabyte-scale datasets.  
* **Platform Needs:** A "Glass Box" environment. Wei needs to upload raw FASTQ files, configure the hyperparameters of the Graph Neural Network (e.g., attention heads in GAT), and visualize the resulting interaction networks as dynamic graphs. He requires seamless integration with Jupyter Lab for ad-hoc analysis.  
* **UI Requirement:** Terminal-like interfaces, drag-and-drop file management, detailed log streams, and complex, interactive network canvases (e.g., Cytoscape.js or ECharts graph integration).

**3\. The Wet Lab Specialist (Zhang Min \- Senior Microbiologist)**

* **Profile:** Meticulous experimentalist responsible for validating computational predictions. focused on protocol adherence, sample tracking, and equipment management.  
* **Pain Points:** Disconnect between "in silico" predictions and physical reality (e.g., AI suggests a strain that cannot be cultured), manual data entry errors, lack of digital protocols at the bench.  
* **Platform Needs:** A "Digital Assistant." Min needs the platform to generate precise experimental protocols (e.g., "Mix Strain A and B at a 2:1 ratio in GAM media"), allow for mobile data entry via tablet at the bench, and automatically flag deviations from the expected results.  
* **UI Requirement:** Mobile-responsive design, large touch-friendly buttons for protocol steps, form-based data entry with validation (e.g., preventing input of impossible pH values), and barcode scanning integration.

**4\. The Regulatory Guardian (Wang Fang \- Regulatory Affairs Manager)**

* **Profile:** Expert in NMPA and FDA guidelines. Focused on safety, documentation, and compliance.  
* **Pain Points:** Scrambling to find data for IND filings, retrospective safety checks that delay projects, lack of traceability for AI-generated decisions.  
* **Platform Needs:** An "Automated Auditor." Fang needs the system to enforce "Safety by Design" (e.g., auto-rejecting strains with AMR genes), maintain a tamper-proof audit trail (21 CFR Part 11 compliant), and auto-generate draft regulatory documents.  
* **UI Requirement:** Document repositories, compliance checklists, audit log viewers, and "diff" views for tracking changes in strain safety profiles.

## ---

**3\. Detailed Architecture Design and Technology Stack**

To support these diverse needs, the Genskey Platform requires a robust, scalable architecture. We eschew monolithic designs in favor of a **Event-Driven Microservices Architecture**, ensuring that heavy computational tasks (like genome assembly) do not degrade the responsiveness of the user interface.

### **3.1 The Tech Stack: Selection and Justification**

Backend Core: Python & FastAPI  
Python is the lingua franca of modern biology and AI. While Go or Java might offer raw performance advantages in certain networking scenarios, the rich ecosystem of biological libraries in Python makes it the non-negotiable choice for this domain.

* **FastAPI:** Selected over Django or Flask for its modern, asynchronous core. LBP discovery involves orchestrating long-running I/O-bound tasks (database queries, API calls to external biological databases) and CPU-bound tasks (model inference). FastAPI’s native support for Python’s async and await allows the server to handle thousands of concurrent connections (e.g., real-time status updates for lab equipment) without blocking.  
* **Pydantic:** Integral to FastAPI, Pydantic offers rigorous data validation. In scientific computing, where a single malformed gene sequence or incorrect float precision can invalidate months of work, Pydantic's strict type enforcement acts as a critical safety net.  
* **Dependency Injection:** FastAPI’s dependency injection system facilitates clean, testable code, allowing us to easily swap out components (e.g., changing the vector database provider) without rewriting business logic.

**Frontend Interface: React & Tailwind CSS**

* **React:** The ecosystem of scientific visualization components for React is unmatched. Libraries like react-force-graph or visx are essential for rendering the complex interaction networks of microbial consortia.  
* **Tailwind CSS:** For the "Chinese UI/UX" requirement, customizability is key. Chinese enterprise interfaces often utilize specific color palettes and tighter spacing to maximize information density. Tailwind’s utility-first approach allows us to define a custom design system (e.g., a genskey-blue color scale, specific font stacks prioritizing PingFang SC) that is applied consistently across the entire application. It eliminates the "stylesheet sprawl" common in large legacy projects.

**Orchestration Engine: LangGraph**

* Scientific discovery is non-linear. A researcher might start mining literature, find a contradiction, run a simulation, and then return to the literature. Traditional linear DAGs (Directed Acyclic Graphs) like Airflow are insufficient for this. **LangGraph** allows for cyclic workflows, state persistence, and "human-in-the-loop" breakpoints, making it the ideal orchestrator for our autonomous AI agents.1

### **3.2 High-Level System Context Diagram**

The architecture is segmented into four conceptual planes:

1. **The User Plane (Frontend):**  
   * **Web Portal:** The primary access point for researchers and managers.  
   * **Mobile Companion:** A simplified PWA (Progressive Web App) for wet-lab scientists to view protocols and log data at the bench.  
   * **Admin Console:** For user management, RBAC configuration, and system health monitoring.  
2. **The API Gateway (Traefik / Nginx):**  
   * Handles SSL termination, rate limiting, and request routing.  
   * Implements the "Auth Service" barrier, ensuring only validated JWT tokens reach the internal services.  
3. **The Application Plane (Microservices):**  
   * **Discovery Service:** Manages the GenskeyMine workflows (Phage/BGC hunting).  
   * **Design Service:** Hosts the GNN models and metabolic simulators for GenskeyDesign.  
   * **Twin Service:** Manages the IoT connections and digital twin simulations for GenskeyTwin.  
   * **Clinical Service:** Handles CDx logic, regulatory document generation, and trial data management.  
   * **Knowledge Service:** The RAG engine, managing queries to the Vector and Graph databases.  
4. **The Data Plane (Polyglot Persistence):**  
   * **PostgreSQL:** The source of truth for structured relational data (Users, Projects, Samples, Inventory).  
   * **Neo4j:** The "Microbiome Knowledge Graph." Stores the complex, interconnected web of biological relationships (e.g., Species A \-\> produces Metabolite B \-\> inhibits Pathogen C).  
   * **Milvus/ChromaDB:** The Vector Store. Holds embeddings of scientific papers, patents, and genomic sequences for similarity search.  
   * **MinIO (S3 Compatible):** Object storage for massive raw files (FASTQ, BAM) and model artifacts.

## ---

**4\. Comprehensive Data Architecture and Governance**

In the era of AI, data is the primary asset. The Genskey Platform's data architecture is designed to handle the "Volume, Velocity, and Variety" of microbiome data while solving the specific problem of **Compositionality** inherent in sequencing datasets.1

### **4.1 Schema Design Strategies**

Relational Schema (PostgreSQL):  
We utilize a normalized schema for core entity management to ensure data integrity.

* **strains Table:** The central registry of all biological assets. Columns include taxonomy\_id (NCBI), isolation\_source, safety\_level (BSL-1/2), and JSONB fields for flexible metadata (e.g., growth\_conditions).  
* **samples Table:** Links patient metadata (age, diagnosis, phenotype) with sequencing data paths.  
* **experiments Table:** Tracks wet-lab validation results, linked to specific strains and projects.

Graph Schema (Neo4j):  
The graph database captures the biological context.

* **Nodes:** Microbe, Gene, Metabolite, Disease, Pathway, Paper.  
* **Edges:**  
  * (:Microbe)--\>(:Gene)  
  * (:Microbe)--\>(:Metabolite)  
  * (:Metabolite)--\>(:Disease)  
  * (:Microbe)--\>(:Microbe) (Derived from clinical data).  
* **Ontologies:** The schema enforces standard biological ontologies (NCBI Taxonomy, KEGG, GO) to ensure interoperability.

### **4.2 Data Engineering Pipeline (The ETL Layer)**

Raw data from sequencers is useless without rigorous processing. The platform implements an automated ETL pipeline triggered by file upload.

1. **Ingestion:** Raw FASTQ files are uploaded via the portal. Using the S3 multipart upload API ensures reliability for files \>10GB.  
2. **Quality Control (QC):** The **QC Agent** triggers fastp or Trimmomatic to remove low-quality reads and adapters.  
3. **Host Depletion:** To protect patient privacy and reduce noise, reads are aligned against the human reference genome (GRCh38) using Bowtie2, and matching reads are discarded immediately.  
4. **Transformation (The Compositional Correction):**  
   * Microbiome data is compositional (relative abundance sums to 1). This creates spurious negative correlations.  
   * The pipeline applies a **Centered Log-Ratio (CLR)** transformation: $CLR(x) \= \\ln(x / g(x))$, where $g(x)$ is the geometric mean. This projects the data into Euclidean space, making it valid for downstream ML analysis.1  
5. **Loading:**  
   * Taxonomic profiles (Kraken2 reports) are parsed and loaded into PostgreSQL.  
   * Assembled Contigs are stored in MinIO.  
   * Genomic embeddings (generated by models like Evo) are indexed in Milvus.

## ---

**5\. Core Module 1: GenskeyMine – The Discovery Engine**

Objective: To mine the clinical "dark matter" for therapeutic candidates.  
The microbiome contains vast unexplored genetic potential. GenskeyMine uses Deep Learning to identify two classes of assets: Bacteriophages (for antimicrobial therapy) and Biosynthetic Gene Clusters (BGCs) (for metabolite production).

### **5.1 Phage Hunter: Transformer-Based Viral Detection**

Traditional homology search (BLAST) fails to find novel phages because they lack sequence similarity to known databases. GenskeyMine deploys **PhageBERT** or **ProkBERT**, transformer models pre-trained on massive prokaryotic datasets.1

* **Mechanism:** The model treats DNA as a language. It analyzes the "grammar" of the sequence (k-mer patterns) to detect viral signatures like capsid proteins or terminases, even in the absence of known homologs.  
* **Host Prediction:** Once a phage is found, identifying its host is critical. The platform uses **Graph Convolutional Networks (GCNs)** (e.g., PhaGCN). It constructs a graph where nodes are contigs and edges represent shared k-mer patterns or CRISPR spacer matches. The GCN propagates labels from known bacteria to the unknown phage, predicting the host with high accuracy (e.g., confirming a phage targets *K. pneumoniae*).1

### **5.2 Molecular Hunter: BGC Mining**

To find commensals that produce therapeutic metabolites (e.g., anti-inflammatory short-chain fatty acids), the platform scans metagenomes for BGCs.

* **Algorithm:** **DeepBGC** utilizes a Bi-LSTM (Bidirectional Long Short-Term Memory) network to detect BGCs. Furthermore, the platform integrates **HyenaDNA**, a long-context genomic foundation model capable of processing 1 million token windows. This allows it to identify large, multi-gene clusters that standard models miss.1

### **5.3 User Interface (Discovery Dashboard)**

* **Input:** A "Drag-and-Drop" zone for FASTQ files, capable of handling batch uploads.  
* **Visualization:** The results page features a **Genome Browser** (using react-linear-genome-view).  
  * Tracks show the bacterial genome with overlays for detected Prophages and BGCs.  
  * Color-coding indicates confidence levels (Green=High, Yellow=Medium).  
  * Clicking a region expands it to show the ORF (Open Reading Frame) map and predicted function.

## ---

**6\. Core Module 2: GenskeyDesign – The Consortium Engineering Engine**

Objective: To rationally design stable, effective microbial consortia.  
Finding strains is only the first step. The "Valley of Death" in LBP development is engraftment failure—the introduced strains fail to colonize. GenskeyDesign solves this using Ecological AI.1

### **6.1 Interaction Prediction with Graph Neural Networks**

To predict which strains can coexist, the platform models the microbiome as a network.

* **Architecture:** **Graph Attention Networks (GAT)**.1  
* **Nodes:** Microbial species.  
* **Node Features:** Genomic embeddings (functional potential), growth rate, pH preference.  
* **Edges:** Predicted ecological interactions (competition, mutualism).  
* **Mechanism:** The GAT mechanism learns "attention weights" $\\alpha\_{ij}$. A high weight indicates that Species J strongly influences Species I. This allows the model to identify "Keystone Species"—the anchors of the community.  
* **Training:** The model is trained on thousands of Genskey's clinical samples, learning the "rules of co-occurrence" in the human gut.

### **6.2 Metabolic Validation (The "Digital Gut")**

Deep Learning finds patterns, but it doesn't understand physics. To ensure the predicted consortium is biologically viable, the platform couples the GNN with **Genome-Scale Metabolic Models (GEMs)** using **COBRApy**.1

* **Dynamic Flux Balance Analysis (dFBA):** The system simulates the growth of the proposed consortium in a virtual gut environment over time.  
  * *Input:* Metabolic models of the chosen strains, dietary inputs (e.g., Fiber, Starch).  
  * *Simulation:* It solves the optimization problem for biomass production, calculating nutrient consumption and metabolite secretion at each time step.  
  * *Output:* A "Stability Score." If the simulation shows that Strain A outcompetes Strain B for the only carbon source, leading to Strain B's extinction, the design is flagged as unstable.

### **6.3 Reinforcement Learning for Optimization**

* **Agent:** An RL agent explores the combinatorial space of strain mixtures.  
* **Reward Function:** Maximizing the production of a target metabolite (e.g., Butyrate) while minimizing the "Invasion Score" of a pathogen (e.g., *C. difficile*).  
* **Outcome:** The system outputs an optimized "Recipe": "Combine Strain A, B, and C at a ratio of 2:1:1."

## ---

**7\. Core Module 3: GenskeyTwin – The Manufacturing Digital Twin**

Objective: To solve the CMC (Chemistry, Manufacturing, and Controls) bottleneck.  
Manufacturing anaerobic bacteria at scale is notoriously difficult. A slight shift in pH or redox potential can kill the batch. GenskeyTwin creates a digital replica of the fermentation process.1

### **7.1 Soft Sensors and Real-Time Monitoring**

Physical sensors in bioreactors can only measure simple parameters (pH, DO, Temperature). Key attributes like "Live Cell Count" or "Metabolite Concentration" require offline sampling, which is too slow for control.

* **Soft Sensors:** The platform uses **LSTM (Long Short-Term Memory)** networks trained on historical fermentation data.  
* **Input:** Real-time streams from physical sensors (pH, agitation, off-gas).  
* **Output:** Real-time inference of the "Hidden State" (Biomass, Product Titer).  
* **UI:** A "Control Room" dashboard showing the physical sensor readings overlayed with the AI-predicted trajectory.

### **7.2 Neural ODEs for Process Simulation**

To optimize the feeding strategy (e.g., when to add glucose), the platform uses **Neural Ordinary Differential Equations (Neural ODEs)**.

* These models learn the continuous dynamics of the fermentation biology.  
* **Scenario Analysis:** The user can run "What-If" scenarios: "What happens if we lower the temperature by 2°C at hour 10?" The Digital Twin simulates the outcome instantly, allowing for risk-free optimization.

## ---

**8\. Core Module 4: GenskeyTrial – Clinical and Regulatory Intelligence**

**Objective:** To automate compliance and de-risk clinical trials.

### **8.3 Regulatory RAG Agents**

Navigating FDA and NMPA regulations for LBPs is complex. The platform deploys a **Retrieval-Augmented Generation (RAG)** agent specialized in regulatory affairs.

* **Knowledge Base:** The system vector-indexes thousands of documents: FDA Guidance for LBPs, NMPA Technical Guidelines, Chinese Pharmacopoeia, and internal SOPs.1  
* **Workflow:** When a researcher proposes a strain, the agent automatically checks it against the **Virulence Factor Database (VFDB)** and **Comprehensive Antibiotic Resistance Database (CARD)**.  
* **Gap Analysis:** The agent generates a "Regulatory Gap Report." Example: "Warning: Strain X contains a tetracycline resistance gene. This violates FDA guidance for live biotherapeutics unless proven to be intrinsic and non-transferable."

### **8.4 Companion Diagnostics (CDx) Stratification**

LBP trials often fail due to patient heterogeneity. GenskeyTrial uses ML to identify "Responders."

* **Algorithm:** Random Forest or XGBoost classifiers trained on retrospective data.  
* **Features:** Baseline microbiome composition, inflammatory markers.  
* **Output:** A simplified diagnostic signature (e.g., "Patients with high *Akkermansia* and low CRP are 3x more likely to respond"). This criteria is used to screen patients for trials, significantly increasing the Probability of Success (PoS).1

## ---

**9\. The AI Orchestration Layer: Multi-Agent Systems with LangGraph**

The complexity of these workflows requires more than simple automation; it requires reasoning. The Genskey Platform utilizes **LangGraph** to construct a "Super-Agent" architecture.1

### **9.1 Supervisor-Worker Topology**

The system mimics a human research team.

* **The Supervisor Agent (GPT-4o / Claude 3.5):** Acts as the Principal Investigator. It receives a high-level goal ("Design a consortium for COPD"), breaks it down into a plan, delegates tasks to workers, and reviews their output.  
* **The Literature Agent:** Uses vector search to mine PubMed for target validation.  
* **The Modeling Agent:** Configures and runs the GNN and COBRApy simulations.  
* **The Safety Agent:** Executes the regulatory checks against VFDB/CARD.  
* **The Protocol Agent:** Translates the final design into a machine-readable lab protocol.

### **9.2 Cyclic Reasoning and State Management**

Unlike linear pipelines, LangGraph allows for cycles.

* **Scenario:** The Modeling Agent proposes a consortium. The Safety Agent flags one strain as unsafe.  
* **Cycle:** The Supervisor sees the rejection, instructs the Literature Agent to find a functional substitute (a "safe analog" with similar metabolic output), and restarts the modeling loop. This iterative "Self-Correction" is the defining feature of agentic AI.  
* **State:** The entire conversation and data context are stored in a persisted State Object (Python TypedDict), ensuring that if the process pauses (e.g., waiting for human approval), it can resume with full context.

## ---

**10\. UI/UX Design Specification: The Chinese Enterprise Context**

Designing for the Chinese enterprise market requires specific sensibilities that differ from Western SaaS trends. The goal is "Scientific Precision with Cultural Clarity."

### **10.1 Design Philosophy: Information Density and Trust**

* **Density:** Chinese professionals often prefer higher information density. Dashboards should utilize the full screen width, minimizing whitespace in favor of data tables and comprehensive charts. The "Sparse" aesthetic of Silicon Valley is often perceived as "Empty" or "Low Function" in this context.  
* **Navigation:** A robust, nested left-sidebar navigation is standard. It should support 3-4 levels of depth to accommodate the complexity of the platform (Project \-\> Experiment \-\> Sample \-\> Analysis).  
* **Trust Signals:** The color palette must convey reliability. We define **Genskey Blue (\#0ea5e9)** as the primary brand color.  
* **Color Semantics:**  
  * In Chinese financial contexts, Red means "Up/Good" and Green means "Down/Bad." However, in **Medical/Scientific** interfaces, the international standard (Red \= Danger/Pathogen, Green \= Safe/Healthy) must be strictly enforced to avoid dangerous confusion. This distinction must be explicitly documented in the Design System.

### **10.2 Tailwind CSS Design System**

We implement a custom Tailwind configuration to enforce consistency.

JavaScript

// tailwind.config.js  
module.exports \= {  
  theme: {  
    extend: {  
      colors: {  
        brand: {  
          50: '\#f0f9ff',  
          500: '\#0ea5e9', // Genskey Blue  
          600: '\#0284c7', // Hover state  
          900: '\#0c4a6e', // Text headers  
        },  
        scientific: {  
          pass: '\#10b981', // Emerald \- Safety Pass  
          fail: '\#ef4444', // Red \- Safety Fail (Toxin)  
          warning: '\#f59e0b', // Amber \- Quality Warning  
        }  
      },  
      fontFamily: {  
        // Prioritize Chinese fonts for correct rendering of Hanzi  
        sans:,  
        mono:, // For DNA sequences  
      },  
      spacing: {  
        'dense': '4px', // Custom spacing for high-density tables  
      }  
    }  
  }  
}

### **10.3 Key Screen Specifications**

**1\. The "Mission Control" Dashboard (首页)**

* **Layout:** A 12-column grid.  
  * **Top Row:** Global metrics (Active Projects, Strains in Library, IND Readiness Score).  
  * **Main Panel (Left 8 cols):** Interactive Project Timeline (Gantt Chart).  
  * **Side Panel (Right 4 cols):** "Agent Activity Log." A scrolling feed showing the real-time actions of the AI agents (e.g., "Safety Agent rejected Strain X," "Modeling Agent completed simulation \#402"). This provides transparency into the AI's operations.

**2\. The Network Canvas (Network Visualization)**

* **Library:** ECharts (Apache ECharts). Chosen for its superior performance with large datasets and native support for Chinese interactions.  
* **Interaction:**  
  * Nodes (Bacteria) are sized by abundance and colored by Phylum.  
  * Edges (Interactions) use varying thickness for correlation strength.  
  * **Filter Panel:** A sidebar allows users to filter the graph by "Interaction Type" (Show only Competition) or "Safety Level" (Hide BSL-2).  
  * **Context Menu:** Right-clicking a node brings up a "Strain Card" with genomic details and a "Replace with Analog" button (triggering the AI agent).

## ---

**11\. Infrastructure, DevOps, and Security**

### **11.1 Cloud-Native Architecture on Kubernetes**

The platform is deployed on a **Kubernetes (K8s)** cluster to manage the lifecycle of microservices and computational jobs.

* **Node Pools:**  
  * *Service Pool:* Standard CPU nodes for API Gateway, Web Servers, and lightweight services.  
  * *Compute Pool:* High-memory nodes for Bio-workers (Genome Assembly requires 100GB+ RAM).  
  * *GPU Pool:* Nodes equipped with NVIDIA A100/H100s, autoscaled using the K8s Horizontal Pod Autoscaler based on queue depth in the Celery / Redis broker.

### **11.2 CI/CD and MLOps**

* **Code Pipeline:** GitLab CI/CD handles testing (Pytest), linting (Ruff), and Docker image building.  
* **MLOps:** **MLflow** is integrated for experiment tracking. Every GNN training run logs its hyperparameters (learning rate, layers), metrics (AUC, F1-score), and the resulting model artifact. This ensures reproducibility—a key regulatory requirement.

### **11.3 Security and 21 CFR Part 11 Compliance**

* **Audit Trails:** To meet FDA standards, *every* state-changing operation (CREATE, UPDATE, DELETE) is intercepted by a middleware.  
  * It writes an immutable record to a dedicated audit\_log table: {timestamp, user\_id, ip\_address, resource\_id, old\_value, new\_value, reason}.  
  * The UI provides an "Audit History" view for every data object (e.g., a Strain record).  
* **Authentication:** OAuth2 / OpenID Connect integrated with the enterprise Identity Provider (Active Directory/LDAP).  
* **Data Residency:** All data is encrypted at rest (AES-256) and stored on servers within mainland China to comply with the **Personal Information Protection Law (PIPL)** and cross-border data transfer regulations.

## ---

**12\. Implementation Roadmap and Project Plan**

The rollout of the Genskey Platform is structured into three strategic phases over 12 months.

**Phase 1: The Data Foundation (Months 1-4)**

* **Objective:** Establish the Single Source of Truth.  
* **Deliverables:**  
  * Deploy Kubernetes cluster and Polyglot DBs (Postgres, Neo4j, MinIO).  
  * Implement the ETL pipeline for automated mNGS ingestion and QC.  
  * Launch GenskeyMine (MVP) with PhageBERT integration.  
  * Release the "Strain Bank" UI for browsing the digital asset library.

**Phase 2: The Ecological Intelligence (Months 5-8)**

* **Objective:** Enable Rational Design.  
* **Deliverables:**  
  * Train and deploy the MicrobeGAT models on internal clinical data.  
  * Integrate COBRApy for metabolic validation.  
  * Launch GenskeyDesign with the interactive Network Canvas.  
  * Implement the "Supervisor Agent" for basic workflow orchestration.

**Phase 3: The Industrial Loop (Months 9-12)**

* **Objective:** Manufacturing and Regulatory Automation.  
* **Deliverables:**  
  * Deploy GenskeyTwin with soft sensors connected to pilot fermentation tanks.  
  * Launch GenskeyTrial with automated IND document generation.  
  * Full system validation (IQ/OQ/PQ) and security penetration testing.  
  * Release Mobile Companion app for wet-lab staff.

## **13\. Conclusion**

The Genskey Platform defined in this specification represents the convergence of modern software engineering, advanced artificial intelligence, and cutting-edge microbiology. By moving beyond simple digitization to true **Agentic Orchestration**, Genskey is not just building a tool but creating a **Digital Scientist** capable of navigating the immense complexity of the human microbiome. This architecture ensures that Genskey can rapidly translate its diagnostic data advantage into a robust pipeline of Live Biotherapeutic Products, securing its position as a global leader in the next revolution of medicine. The path from "Dark Matter" to "Approved Drug" is paved with data, and this platform is the engine that drives that journey.

---

**References to Research Snippets:**

* 1: Executive summary context, ML paradigms (CNN, GNN, LLM).  
* 1: Unsupervised learning strategies for strain discovery.  
* 1: Multi-agent architecture (LangGraph), RAG, and Safety Agents.  
* 1: Strategic pivot (Diagnostics \-\> Therapeutics), Insilico gap analysis, Phage/BGC algorithms.  
* 1: Generative biology strategies, comparison with Insilico Medicine.  
* 1: COPD workflow example, specific clinical trial design metrics.  
* 1: GNN implementation details, CLR normalization, PyTorch Geometric specifics.

#### **Works cited**

1. AI Platform for LBP Discovery.docx