import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Activity,
    Database,
    FlaskRound,
    TrendingUp,
    RefreshCw,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        activeProjects: 12,
        strains: 284,
        trials: 3,
        indReadiness: 68
    });

    const [agentActivity, setAgentActivity] = useState([
        {
            id: 1,
            timestamp: new Date(),
            agent: 'Safety Agent',
            action: '已完成菌株 GK-001 的安全评估',
            status: 'success'
        },
        {
            id: 2,
            timestamp: new Date(Date.now() - 60000),
            agent: 'Modeling Agent',
            action: '完成代谢模拟 #402',
            status: 'success'
        },
        {
            id: 3,
            timestamp: new Date(Date.now() - 120000),
            agent: 'Safety Agent',
            action: '警告：菌株 GK-015 检测到AMR基因',
            status: 'warning'
        },
        {
            id: 4,
            timestamp: new Date(Date.now() - 180000),
            agent: 'Literature Agent',
            action: '已提取 23 篇相关文献',
            status: 'success'
        }
    ]);

    const [projects, setProjects] = useState([
        {
            id: 1,
            name: 'COPD菌群疗法',
            name_en: 'COPD Consortium',
            status: 'design',
            progress: 65,
            deadline: '2025-Q3'
        },
        {
            id: 2,
            name: 'CDI噬菌体疗法',
            name_en: 'CDI Phage Therapy',
            status: 'trial',
            progress: 40,
            deadline: '2025-Q4'
        },
        {
            id: 3,
            name: '代谢综合征',
            name_en: 'Metabolic Syndrome',
            status: 'discovery',
            progress: 20,
            deadline: '2026-Q1'
        }
    ]);

    const formatTime = (date) => {
        const diff = Date.now() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return '刚刚';
        if (minutes < 60) return `${minutes}分钟前`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}小时前`;
        return `${Math.floor(hours / 24)}天前`;
    };

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <h1 className="page-title">
                    任务控制中心 <span className="text-enterprise-500 font-normal">/ Mission Control</span>
                </h1>
                <p className="page-subtitle">
                    实时监控平台活动和项目进展 / Real-time platform monitoring
                </p>
            </div>

            {/* Stats Grid - Top Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="card card-hover">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="text-sm-cn text-enterprise-600 mb-1">
                                活跃项目 / Active Projects
                            </div>
                            <div className="text-3xl font-bold text-enterprise-900">
                                {stats.activeProjects}
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
                            <Activity size={24} className="text-brand-600" />
                        </div>
                    </div>
                </div>

                <div className="card card-hover">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="text-sm-cn text-enterprise-600 mb-1">
                                菌株库 / Strain Library
                            </div>
                            <div className="text-3xl font-bold text-enterprise-900">
                                {stats.strains}
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Database size={24} className="text-emerald-600" />
                        </div>
                    </div>
                </div>

                <div className="card card-hover">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="text-sm-cn text-enterprise-600 mb-1">
                                临床试验 / Clinical Trials
                            </div>
                            <div className="text-3xl font-bold text-enterprise-900">
                                {stats.trials}
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FlaskRound size={24} className="text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="card card-hover">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="text-sm-cn text-enterprise-600 mb-1">
                                IND准备度 / IND Readiness
                            </div>
                            <div className="text-3xl font-bold text-enterprise-900">
                                {stats.indReadiness}%
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                            <TrendingUp size={24} className="text-amber-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - 12 Column Grid */}
            <div className="grid grid-cols-12 gap-6">
                {/* Left: Project Timeline (8 cols) */}
                <div className="col-span-12 lg:col-span-8">
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-enterprise-900">
                                项目进展 / Project Timeline
                            </h2>
                            <button className="btn-secondary text-xs">
                                <RefreshCw size={14} />
                                刷新
                            </button>
                        </div>

                        <div className="space-y-4">
                            {projects.map(project => (
                                <div key={project.id} className="border border-enterprise-200 rounded-lg p-4 hover:border-brand-300 transition-colors">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-enterprise-900">
                                                {project.name}
                                            </h3>
                                            <p className="text-sm text-enterprise-600">
                                                {project.name_en}
                                            </p>
                                        </div>
                                        <span className={`badge ${project.status === 'trial' ? 'badge-info' :
                                                project.status === 'design' ? 'badge-warning' :
                                                    'badge-pass'
                                            }`}>
                                            {project.status === 'trial' ? '临床期' :
                                                project.status === 'design' ? '设计期' : '发现期'}
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-2">
                                        <div className="flex justify-between text-xs text-enterprise-600 mb-1">
                                            <span>进度</span>
                                            <span>{project.progress}%</span>
                                        </div>
                                        <div className="w-full bg-enterprise-200 rounded-full h-2">
                                            <div
                                                className="bg-brand-500 h-2 rounded-full transition-all"
                                                style={{ width: `${project.progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between text-xs text-enterprise-600">
                                        <span>目标时间：{project.deadline}</span>
                                        <span>Deadline: {project.deadline}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Agent Activity Log (4 cols) */}
                <div className="col-span-12 lg:col-span-4">
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-enterprise-900">
                                AI代理活动 / Agent Activity
                            </h2>
                            <div className="status-dot-green animate-pulse" />
                        </div>

                        <div className="space-y-3 max-h-[500px] overflow-y-auto scrollable-y">
                            {agentActivity.map(activity => (
                                <div key={activity.id} className="pb-3 border-b border-enterprise-100 last:border-0">
                                    <div className="flex items-start gap-2">
                                        <div className={`mt-1 ${activity.status === 'success' ? 'text-scientific-pass' :
                                                activity.status === 'warning' ? 'text-scientific-warning' :
                                                    'text-scientific-fail'
                                            }`}>
                                            {activity.status === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs text-brand-600 font-medium mb-1">
                                                {activity.agent}
                                            </div>
                                            <div className="text-sm-cn text-enterprise-900 mb-1">
                                                {activity.action}
                                            </div>
                                            <div className="text-xs text-enterprise-500">
                                                {formatTime(activity.timestamp)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
