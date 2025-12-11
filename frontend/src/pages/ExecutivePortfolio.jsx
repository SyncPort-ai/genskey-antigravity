import { useState } from 'react';
import { TrendingUp, DollarSign, Users, Briefcase, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

export default function ExecutivePortfolio() {
    const projects = [
        {
            id: 'GNS-IBD-001',
            name: 'IBD益生菌联合疗法',
            nameEn: 'IBD Probiotic Combination Therapy',
            stage: 'Phase II临床试验',
            progress: 65,
            budget: 15000000,
            spent: 9750000,
            team: 12,
            milestones: { completed: 8, total: 12 },
            risk: 'medium',
            status: 'on-track',
            nextMilestone: 'Phase II中期分析',
            dueDate: '2025-03-15'
        },
        {
            id: 'GNS-CDI-001',
            name: 'CDI粪菌移植替代疗法',
            nameEn: 'C. diff FMT Alternative',
            stage: 'Phase I临床试验',
            progress: 85,
            budget: 8000000,
            spent: 6800000,
            team: 8,
            milestones: { completed: 11, total: 13 },
            risk: 'low',
            status: 'on-track',
            nextMilestone: 'Phase I完成报告',
            dueDate: '2025-01-20'
        },
        {
            id: 'GNS-T2D-002',
            name: '糖尿病肠道菌群调节',
            nameEn: 'T2D Microbiome Modulation',
            stage: '临床前研究',
            progress: 45,
            budget: 5000000,
            spent: 2250000,
            team: 10,
            milestones: { completed: 5, total: 11 },
            risk: 'high',
            status: 'at-risk',
            nextMilestone: '动物实验完成',
            dueDate: '2025-05-30'
        }
    ];

    const financials = {
        totalBudget: 50000000,
        totalSpent: 24500000,
        q4Spending: 6200000,
        burnRate: 2050000 // per month
    };

    // Pipeline funnel chart
    const pipelineFunnel = {
        title: {
            text: '研发管线 R&D Pipeline',
            textStyle: { fontSize: 18, fontWeight: 'bold' }
        },
        tooltip: { trigger: 'item' },
        series: [{
            name: '项目阶段',
            type: 'funnel',
            left: '10%',
            width: '80%',
            label: {
                formatter: '{b}: {c}个项目'
            },
            data: [
                { value: 12, name: '靶点验证 Target Validation' },
                { value: 8, name: '先导优化 Lead Optimization' },
                { value: 5, name: '临床前 Preclinical' },
                { value: 3, name: 'Phase I' },
                { value: 2, name: 'Phase II' },
                { value: 1, name: 'Phase III' }
            ],
            itemStyle: {
                color: (params) => {
                    const colors = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#14b8a6'];
                    return colors[params.dataIndex];
                }
            }
        }]
    };

    // Budget allocation pie chart
    const budgetAllocation = {
        title: {
            text: '预算分配 Budget Allocation',
            textStyle: { fontSize: 18, fontWeight: 'bold' }
        },
        tooltip: { trigger: 'item', formatter: '{b}: ¥{c}M ({d}%)' },
        legend: { bottom: 10 },
        series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            data: [
                { value: 15, name: '临床试验 Clinical', itemStyle: { color: '#0ea5e9' } },
                { value: 12, name: '研发 R&D', itemStyle: { color: '#10b981' } },
                { value: 8, name: '生产 Manufacturing', itemStyle: { color: '#f59e0b' } },
                { value: 7, name: '法规 Regulatory', itemStyle: { color: '#8b5cf6' } },
                { value: 8, name: '其他 Others', itemStyle: { color: '#6b7280' } }
            ]
        }]
    };

    const getRiskBadge = (risk) => {
        const styles = {
            low: 'bg-scientific-pass text-white',
            medium: 'bg-scientific-warning text-white',
            high: 'bg-scientific-fail text-white'
        };
        const labels = { low: '低风险', medium: '中风险', high: '高风险' };
        return { style: styles[risk], label: labels[risk] };
    };

    const getStatusIcon = (status) => {
        return status === 'on-track' ?
            <CheckCircle2 size={20} className="text-scientific-pass" /> :
            <AlertCircle size={20} className="text-scientific-warning" />;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            {/* Header */}
            <div className="mb-dense-6">
                <h1 className="text-3xl font-bold text-brand-800 mb-dense-2 flex items-center gap-3">
                    <Briefcase className="text-brand-600" />
                    项目组合视图
                    <span className="text-lg font-normal text-gray-600">Portfolio View</span>
                </h1>
                <p className="text-gray-600">
                    基因康研发管线全景 |  12个项目进行中 | 3个临床阶段
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-dense-4 mb-dense-6">
                <div className="card bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                    <Briefcase size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{projects.length}</div>
                    <div className="text-sm opacity-90">活跃项目</div>
                </div>

                <div className="card bg-gradient-to-br from-scientific-pass to-green-600 text-white">
                    <DollarSign size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">¥{(financials.totalBudget / 1000000).toFixed(0)}M</div>
                    <div className="text-sm opacity-90">总预算</div>
                </div>

                <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                    <TrendingUp size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{Math.round((financials.totalSpent / financials.totalBudget) * 100)}%</div>
                    <div className="text-sm opacity-90">预算使用率</div>
                </div>

                <div className="card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                    <Users size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{projects.reduce((sum, p) => sum + p.team, 0)}</div>
                    <div className="text-sm opacity-90">研发团队人数</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-dense-6 mb-dense-6">
                <div className="card">
                    <ReactECharts option={pipelineFunnel} style={{ height: '400px' }} />
                </div>
                <div className="card">
                    <ReactECharts option={budgetAllocation} style={{ height: '400px' }} />
                </div>
            </div>

            {/* Project Cards */}
            <div className="mb-dense-6">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">项目详情 Project Details</h2>
                <div className="space-y-4">
                    {projects.map((project) => (
                        <div key={project.id} className="card">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-brand-800">{project.name}</h3>
                                        {getStatusIcon(project.status)}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">{project.nameEn}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span className="font-mono text-brand-600">{project.id}</span>
                                        <span>{project.stage}</span>
                                        <span className={`badge ${getRiskBadge(project.risk).style}`}>
                                            {getRiskBadge(project.risk).label}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-brand-600">{project.progress}%</div>
                                    <div className="text-sm text-gray-500">完成度</div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span>项目进度</span>
                                    <span>{project.milestones.completed}/{project.milestones.total} 里程碑</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-brand-500 h-3 rounded-full transition-all"
                                        style={{ width: `${project.progress}%` }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <div className="text-sm text-gray-600">预算</div>
                                    <div className="font-semibold">¥{(project.budget / 1000000).toFixed(1)}M</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">已使用</div>
                                    <div className="font-semibold">¥{(project.spent / 1000000).toFixed(1)}M</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">团队规模</div>
                                    <div className="font-semibold">{project.team} 人</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600 flex items-center gap-1">
                                        <Clock size={14} />
                                        下一里程碑
                                    </div>
                                    <div className="font-semibold text-sm">{project.nextMilestone}</div>
                                    <div className="text-xs text-gray-500">{project.dueDate}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Financial Summary */}
            <div className="card">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">财务概览 Financial Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <div className="text-gray-600 mb-2">总预算 Total Budget</div>
                        <div className="text-2xl font-bold text-brand-600">
                            ¥{(financials.totalBudget / 1000000).toFixed(0)}M
                        </div>
                    </div>
                    <div>
                        <div className="text-gray-600 mb-2">已使用 Spent</div>
                        <div className="text-2xl font-bold text-purple-600">
                            ¥{(financials.totalSpent / 1000000).toFixed(1)}M
                        </div>
                    </div>
                    <div>
                        <div className="text-gray-600 mb-2">Q4支出 Q4 Spending</div>
                        <div className="text-2xl font-bold text-orange-600">
                            ¥{(financials.q4Spending / 1000000).toFixed(1)}M
                        </div>
                    </div>
                    <div>
                        <div className="text-gray-600 mb-2">月度消耗率 Burn Rate</div>
                        <div className="text-2xl font-bold text-scientific-warning">
                            ¥{(financials.burnRate / 1000000).toFixed(2)}M/月
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            预计可用时间: <span className="font-semibold text-brand-600">
                                {Math.round((financials.totalBudget - financials.totalSpent) / financials.burnRate)} 个月
                            </span>
                        </div>
                        <button className="btn-primary">
                            生成董事会报告
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
