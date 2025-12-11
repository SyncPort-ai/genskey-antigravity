import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    zh: {
        translation: {
            // Navigation
            "nav.dashboard": "首页",
            "nav.discovery": "发现引擎",
            "nav.design": "菌群设计",
            "nav.twin": "数字孪生",
            "nav.trial": "临床法规",

            // Dashboard
            "dashboard.title": "任务控制中心",
            "dashboard.welcome": "欢迎使用基因康企业平台",
            "dashboard.projects": "活跃项目",
            "dashboard.strains": "菌株库",
            "dashboard.trials": "临床试验",

            // Discovery Module
            "discovery.title": "基因康发现 - 噬菌体与BGC挖掘",
            "discovery.upload": "上传测序数据",
            "discovery.phage": "噬菌体检测",
            "discovery.bgc": "生物合成基因簇",
            "discovery.genome": "基因组浏览器",

            // Design Module
            "design.title": "基因康设计 - 菌群工程",
            "design.network": "互作网络",
            "design.optimize": "优化组合",
            "design.simulate": "代谢模拟",

            // Twin Module  
            "twin.title": "基因康孪生 - 发酵监控",
            "twin.batches": "发酵批次",
            "twin.sensors": "传感器监控",
            "twin.analysis": "场景分析",

            // Trial Module
            "trial.title": "基因康临床 - 法规与试验",
            "trial.safety": "安全评估",
            "trial.compliance": "合规检查",
            "trial.cdx": "伴随诊断",

            // Common
            "common.loading": "加载中...",
            "common.error": "错误",
            "common.success": "成功",
            "common.cancel": "取消",
            "common.confirm": "确认",
            "common.search": "搜索",
            "common.filter": "筛选",
            "common.export": "导出",
            "common.refresh": "刷新",
        }
    },
    en: {
        translation: {
            // Navigation
            "nav.dashboard": "Dashboard",
            "nav.discovery": "Discovery",
            "nav.design": "Design",
            "nav.twin": "Digital Twin",
            "nav.trial": "Clinical & Regulatory",

            // Dashboard
            "dashboard.title": "Mission Control",
            "dashboard.welcome": "Welcome to Genskey Platform",
            "dashboard.projects": "Active Projects",
            "dashboard.strains": "Strain Library",
            "dashboard.trials": "Clinical Trials",

            // Discovery Module
            "discovery.title": "GenskeyMine - Phage & BGC Discovery",
            "discovery.upload": "Upload Sequencing Data",
            "discovery.phage": "Phage Detection",
            "discovery.bgc": "Biosynthetic Gene Clusters",
            "discovery.genome": "Genome Browser",

            // Design Module
            "design.title": "GenskeyDesign - Consortium Engineering",
            "design.network": "Interaction Network",
            "design.optimize": "Optimize Consortium",
            "design.simulate": "Metabolic Simulation",

            // Twin Module
            "twin.title": "GenskeyTwin - Fermentation Monitoring",
            "twin.batches": "Fermentation Batches",
            "twin.sensors": "Sensor Monitoring",
            "twin.analysis": "Scenario Analysis",

            // Trial Module
            "trial.title": "GenskeyTrial - Clinical & Regulatory",
            "trial.safety": "Safety Assessment",
            "trial.compliance": "Compliance Check",
            "trial.cdx": "Companion Diagnostics",

            // Common
            "common.loading": "Loading...",
            "common.error": "Error",
            "common.success": "Success",
            "common.cancel": "Cancel",
            "common.confirm": "Confirm",
            "common.search": "Search",
            "common.filter": "Filter",
            "common.export": "Export",
            "common.refresh": "Refresh",
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
