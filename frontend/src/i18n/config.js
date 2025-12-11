import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    zh: {
        translation: {
            // Navigation - Main
            "nav.dashboard": "首页",
            "nav.discovery": "发现引擎",
            "nav.design": "研发设计",
            "nav.twin": "生产制造",
            "nav.trial": "临床法规",
            "nav.data_science": "数据科学",
            "nav.copilot": "AI副驾驶",
            "nav.executive": "高管仪表板",
            "nav.lab": "实验室管理",

            // Discovery submenu
            "nav.discovery_phage": "噬菌体检测",
            "nav.discovery_bgc": "BGC挖掘",
            "nav.discovery_targets": "靶点验证",
            "nav.discovery_library": "菌株库",
            "nav.discovery_hit_to_lead": "先导化合物",

            // Design/R&D submenu
            "nav.design_network": "互作网络",
            "nav.design_formulation": "制剂实验室",
            "nav.design_in_vitro": "体外测试",
            "nav.design_animal": "动物实验",
            "nav.design_ai_lab": "AI实验室",

            // Manufacturing/Twin submenu
            "nav.twin_monitor": "实时监控",
            "nav.twin_schedule": "生产排程",
            "nav.twin_qc": "质量控制",
            "nav.twin_supply": "供应链",
            "nav.twin_tech_transfer": "技术转移",

            // Clinical/Trial submenu
            "nav.trial_safety": "安全评估",
            "nav.trial_design": "试验设计",
            "nav.trial_recruitment": "患者招募",
            "nav.trial_regulatory": "法规事务",
            "nav.trial_pharmacovigilance": "药物警戒",

            // Data Science submenu
            "nav.data_lake": "数据湖",
            "nav.data_mlops": "ML运维",
            "nav.data_analytics": "分析工作台",
            "nav.data_knowledge_graph": "知识图谱",

            // AI Copilot submenu
            "nav.copilot_dashboard": "智能体控制台",
            "nav.copilot_chat": "对话界面",
            "nav.copilot_workflows": "工作流构建",
            "nav.copilot_marketplace": "智能体市场",

            // Executive submenu
            "nav.executive_portfolio": "项目组合",
            "nav.executive_finance": "财务仪表板",
            "nav.executive_team": "团队绩效",
            "nav.executive_reports": "董事会报告",

            // Lab submenu
            "nav.lab_samples": "样品追踪",
            "nav.lab_equipment": "设备管理",
            "nav.lab_protocols": "方案库",
            "nav.lab_safety": "实验室安全",

            // Dashboard
            "dashboard.title": "任务控制中心",
            "dashboard.welcome": "欢迎使用基因康企业平台"
        }
    },
    en: {
        translation: {
            // Navigation - Main
            "nav.dashboard": "Dashboard",
            "nav.discovery": "Discovery",
            "nav.design": "R&D",
            "nav.twin": "Manufacturing",
            "nav.trial": "Clinical & Regulatory",
            "nav.data_science": "Data Science",
            "nav.copilot": "AI Copilot",
            "nav.executive": "Executive",
            "nav.lab": "Laboratory",

            // Discovery submenu
            "nav.discovery_phage": "Phage Detection",
            "nav.discovery_bgc": "BGC Mining",
            "nav.discovery_targets": "Target Validation",
            "nav.discovery_library": "Strain Library",
            "nav.discovery_hit_to_lead": "Hit-to-Lead",

            // Design/R&D submenu
            "nav.design_network": "Interaction Network",
            "nav.design_formulation": "Formulation Lab",
            "nav.design_in_vitro": "In Vitro Testing",
            "nav.design_animal": "Animal Studies",
            "nav.design_ai_lab": "AI Lab",

            // Manufacturing/Twin submenu
            "nav.twin_monitor": "Real-time Monitor",
            "nav.twin_schedule": "Production Schedule",
            "nav.twin_qc": "Quality Control",
            "nav.twin_supply": "Supply Chain",
            "nav.twin_tech_transfer": "Tech Transfer",

            // Clinical/Trial submenu
            "nav.trial_safety": "Safety Assessment",
            "nav.trial_design": "Trial Design",
            "nav.trial_recruitment": "Patient Recruitment",
            "nav.trial_regulatory": "Regulatory Affairs",
            "nav.trial_pharmacovigilance": "Pharmacovigilance",

            // Data Science submenu
            "nav.data_lake": "Data Lake",
            "nav.data_mlops": "MLOps",
            "nav.data_analytics": "Analytics Workbench",
            "nav.data_knowledge_graph": "Knowledge Graph",

            // AI Copilot submenu
            "nav.copilot_dashboard": "Agent Dashboard",
            "nav.copilot_chat": "Chat Interface",
            "nav.copilot_workflows": "Workflow Builder",
            "nav.copilot_marketplace": "Agent Marketplace",

            // Executive submenu
            "nav.executive_portfolio": "Portfolio View",
            "nav.executive_finance": "Financial Dashboard",
            "nav.executive_team": "Team Performance",
            "nav.executive_reports": "Board Reports",

            // Lab submenu
            "nav.lab_samples": "Sample Tracking",
            "nav.lab_equipment": "Equipment Manager",
            "nav.lab_protocols": "Protocol Library",
            "nav.lab_safety": "Lab Safety",

            // Dashboard
            "dashboard.title": "Mission Control",
            "dashboard.welcome": "Welcome to Genskey Platform"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'zh', // Default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
