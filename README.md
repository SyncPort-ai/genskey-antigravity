# Genskey Enterprise Platform
# 基因康企业平台

<div align="center">

![Genskey Logo](https://via.placeholder.com/120x120/0ea5e9/ffffff?text=基因康)

**Enterprise Live Biotherapeutic Product Discovery Platform**

活体生物治疗产品发现引擎

[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/react-18+-61DAFB.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/fastapi-0.109+-009688.svg)](https://fastapi.tiangolo.com/)

</div>

---

## 🧬 概述 / Overview

Genskey Platform is an enterprise-level computational biology platform designed for **Live Biotherapeutic Product (LBP) discovery**. It integrates cutting-edge AI technologies to transform clinical metagenomic data into therapeutic assets.

基因康平台是一个企业级计算生物学平台，专为**活体生物治疗产品（LBP）发现**而设计。它集成前沿AI技术，将临床宏基因组数据转化为治疗资产。

### 核心模块 / Core Modules

1. **GenskeyMine 发现引擎** - Phage & BGC Discovery
   - Bacteriophage detection using PhageBERT
   - Biosynthetic Gene Cluster mining with DeepBGC
   - Automated genomic annotation

2. **GenskeyDesign 菌群设计** - Consortium Engineering
   - Graph Neural Network-based interaction prediction
   - Metabolic modeling with COBRApy
   - RL-optimized consortium design

3. **GenskeyTwin 数字孪生** - Digital Manufacturing
   - Real-time fermentation monitoring
   - LSTM-based soft sensors
   - Process optimization with Neural ODEs

4. **GenskeyTrial 临床法规** - Clinical & Regulatory
   - Automated safety assessment (VFDB, CARD)
   - NMPA/FDA compliance checking
   - Clinical trial management with CDx stratification

---

## 🚀 快速开始 / Quick Start

### Prerequisites / 前置要求

- Docker & Docker Compose
- Python 3.11+ (for local development)
- Node.js 18+ (for frontend development)

### 1. Clone Repository

```bash
git clone <repository-url>
cd Genskey-anitgavity
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

The platform will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/api/docs
- **Neo4j Browser**: http://localhost:7474
- **MinIO Console**: http://localhost:9001

---

## 🛠️ Development Setup / 开发设置

### Backend Development

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run backend server
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📊 Architecture / 架构

```
┌─────────────────────────────────────────────┐
│  React Frontend (Tailwind CSS)             │
│  - Dashboard                                │
│  - 4 Core Modules                           │
│  - Bilingual UI (中文/English)              │
└──────────────┬──────────────────────────────┘
               │ HTTP/WebSocket
┌──────────────▼──────────────────────────────┐
│  FastAPI Backend (Python)                   │
│  - Discovery Service                        │
│  - Design Service                           │
│  - Twin Service                             │
│  - Trial Service                            │
└──────────────┬──────────────────────────────┘
               │
        ┌──────┴──────┬──────────┬─────────┐
        ▼             ▼          ▼         ▼
   PostgreSQL     Neo4j       MinIO     Redis
   (Relational)   (Graph)   (Object)   (Cache)
```

---

## 🎨 UI Design System / 设计系统

The platform uses a custom Tailwind CSS design system optimized for Chinese enterprise UX:

- **Genskey Blue** (#0ea5e9) - Primary brand color
- **PingFang SC** - Primary Chinese font
- **High information density** - Maximized screen usage
- **Scientific color semantics**:
  - 🟢 Green - Safety pass / Healthy microbes
  - 🔴 Red - Safety fail / Pathogens
  - 🟡 Amber - Warnings

---

## 📚 API Documentation / API文档

Interactive API documentation is available at:
- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

### Example API Calls

```python
import requests

# Get phage detection results
response = requests.get('http://localhost:8000/api/v1/discovery/phage/detect/sample_001')
phages = response.json()

# Predict interaction network
response = requests.post('http://localhost:8000/api/v1/design/network/predict', json={
    'sample_ids': ['sample_001', 'sample_002']
})
network = response.json()
```

---

## 🧪 Testing / 测试

```bash
# Backend tests
pytest backend/tests/ --cov

# Frontend tests
cd frontend
npm run test
```

---

## 📦 Deployment / 部署

For production deployment:

1. Use `.env.production` for environment variables
2. Build frontend: `npm run build`
3. Use Kubernetes manifests in `/k8s` directory
4. Configure Nginx/Traefik for API gateway
5. Enable SSL/TLS certificates

---

## 🔒 Security / 安全

- All API endpoints require authentication
- 21 CFR Part 11 compliant audit trails
- Data encryption at rest (AES-256)
- PIPL compliant (China data residency)

---

## 📄 License / 许可证

Proprietary - Genskey Medical Technology Co. Ltd.

---

## 👥 Contact / 联系方式

- **Website**: https://genskey.bio
- **Email**: support@genskey.bio
- **Documentation**: https://docs.genskey.bio

---

## 🙏 Acknowledgments / 致谢

Built with:
- FastAPI, React, Tailwind CSS
- ECharts for visualizations
- PyTorch, BioPython
- Neo4j, PostgreSQL

---

<div align="center">

**基因康企业平台 · Genskey Enterprise Platform**

*Transforming Microbiome Data into Therapeutic Assets*

*将微生物组数据转化为治疗资产*

</div>
