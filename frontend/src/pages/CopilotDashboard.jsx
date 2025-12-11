import { useState } from 'react';
import { Bot, Activity, Zap, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

export default function CopilotDashboard() {
    const agents = [
        {
            name: 'Literature Agent',
            status: 'active',
            tasksCompleted: 127,
            successRate: 0.94,
            avgResponseTime: 3.2,
            currentTask: '检索IBD临床试验最新文献',
            uptime: '99.2%'
        },
        {
            name: 'Safety Agent',
            status: 'active',
            tasksCompleted: 89,
            successRate: 0.98,
            avgResponseTime: 2.8,
            currentTask: '评估GNS0042安全性',
            uptime: '99.8%'
        },
        {
            name: 'Design Agent',
            status: 'active',
            tasksCompleted: 156,
            successRate: 0.91,
            avgResponseTime: 5.4,
            currentTask: '优化F. prausnitzii+B. longum配方',
            uptime: '98.5%'
        },
        {
            name: 'Modeling Agent',
            status: 'idle',
            tasksCompleted: 78,
            successRate: 0.87,
            avgResponseTime: 12.5,
            currentTask: null,
            uptime: '97.3%'
        },
        {
            name: 'Analysis Agent',
            status: 'active',
            tasksCompleted: 203,
            successRate: 0.96,
            avgResponseTime: 4.1,
            currentTask: '分析GNS-IBD-001 Phase II数据',
            uptime: '99.5%'
        },
        {
            name: 'Regulatory Agent',
            status: 'idle',
            tasksCompleted: 45,
            successRate: 0.93,
            avgResponseTime: 8.7,
            currentTask: null,
            uptime: '98.9%'
        }
    ];

    const workflowStats = {
        totalWorkflows: 24,
        activeWorkflows: 8,
        completedToday: 15,
        avgCompletionTime: 18.5  // minutes
    };

    // Agent performance chart
    const performanceChart = {
        title: { text: '智能体性能对比 Agent Performance', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'axis' },
        legend: { data: ['成功率%', '平均响应时间(s)'] },
        xAxis: {
            type: 'category',
            data: agents.map(a => a.name.split(' ')[0]),
            axisLabel: { rotate: 30 }
        },
        yAxis: [
            { type: 'value', name: '成功率%', max: 100 },
            { type: 'value', name: '响应时间(s)' }
        ],
        series: [
            {
                name: '成功率%',
                type: 'bar',
                data: agents.map(a => a.successRate * 100),
                itemStyle: { color: '#10b981' }
            },
            {
                name: '平均响应时间(s)',
                type: 'line',
                yAxisIndex: 1,
                data: agents.map(a => a.avgResponseTime),
                itemStyle: { color: '#0ea5e9' },
                lineStyle: { width: 3 }
            }
        ]
    };

    // Task distribution pie
    const taskDistribution = {
        title: { text: '任务类型分布', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'item' },
        legend: { bottom: 10 },
        series: [{
            type: 'pie',
            radius: '70%',
            data: [
                { value: 127, name: '文献检索', itemStyle: { color: '#0ea5e9' } },
                { value: 89, name: '安全评估', itemStyle: { color: '#10b981' } },
                { value: 156, name: '设计优化', itemStyle: { color: '#f59e0b' } },
                { value: 78, name: '建模预测', itemStyle: { color: '#8b5cf6' } },
                { value: 203, name: '数据分析', itemStyle: { color: '#ec4899' } },
                { value: 45, name: '法规咨询', itemStyle: { color: '#6b7280' } }
            ]
        }]
    };

    const getStatusBadge = (status) => {
        if (status === 'active') {
            return <span className="badge bg-scientific-pass text-white flex items-center gap-1">
                <Activity size={14} className="animate-pulse" /> 活跃
            </span>;
        }
        return <span className="badge bg-gray-500 text-white">空闲</span>;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <div className="mb-dense-6">
                <h1 className="text-3xl font-bold text-brand-800 mb-dense-2">
                    智能体控制台 <span className="text-lg font-normal text-gray-600">Agent Dashboard</span>
                </h1>
                <p className="text-gray-600">多智能体系统监控与管理 | Multi-Agent System Monitoring</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-dense-4 mb-dense-6">
                <div className="card bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                    <Bot size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{agents.length}</div>
                    <div className="text-sm opacity-90">智能体总数</div>
                </div>

                <div className="card bg-gradient-to-br from-scientific-pass to-green-600 text-white">
                    <Zap size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{agents.filter(a => a.status === 'active').length}</div>
                    <div className="text-sm opacity-90">活跃中</div>
                </div>

                <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                    <CheckCircle2 size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{workflowStats.completedToday}</div>
                    <div className="text-sm opacity-90">今日完成任务</div>
                </div>

                <div className="card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                    <Clock size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{workflowStats.avgCompletionTime} min</div>
                    <div className="text-sm opacity-90">平均完成时间</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-dense-6 mb-dense-6">
                <div className="card">
                    <ReactECharts option={performanceChart} style={{ height: '300px' }} />
                </div>
                <div className="card">
                    <ReactECharts option={taskDistribution} style={{ height: '300px' }} />
                </div>
            </div>

            {/* Agent Cards */}
            <div className="mb-dense-6">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">智能体状态 Agent Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-dense-4">
                    {agents.map((agent) => (
                        <div key={agent.name} className="card">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${agent.status === 'active' ? 'bg-scientific-pass' : 'bg-gray-400'
                                        }`}>
                                        <Bot size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{agent.name}</h3>
                                        {agent.currentTask && (
                                            <p className="text-sm text-gray-600 mt-1">{agent.currentTask}</p>
                                        )}
                                    </div>
                                </div>
                                {getStatusBadge(agent.status)}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-gray-600">已完成任务</div>
                                    <div className="text-lg font-semibold text-brand-600">{agent.tasksCompleted}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-600">成功率</div>
                                    <div className="text-lg font-semibold text-scientific-pass">{(agent.successRate * 100).toFixed(1)}%</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-600">平均响应</div>
                                    <div className="text-lg font-semibold">{agent.avgResponseTime}s</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-600">运行时间</div>
                                    <div className="text-lg font-semibold text-brand-600">{agent.uptime}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activities */}
            <div className="card">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">最近活动 Recent Activities</h2>
                <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-4">
                        <Clock size={20} className="text-brand-600" />
                        <div className="flex-1">
                            <div className="font-semibold">Literature Agent</div>
                            <div className="text-sm text-gray-600">完成文献检索: "IBD新型益生菌疗法meta分析" - 找到23篇相关文献</div>
                        </div>
                        <span className="text-xs text-gray-500">2分钟前</span>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-4">
                        <CheckCircle2 size={20} className="text-scientific-pass" />
                        <div className="flex-1">
                            <div className="font-semibold">Safety Agent</div>
                            <div className="text-sm text-gray-600">完成安全性评估: GNS0042 - 未检测到AMR/毒力因子</div>
                        </div>
                        <span className="text-xs text-gray-500">5分钟前</span>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-4">
                        <Activity size={20} className="text-scientific-warning animate-pulse" />
                        <div className="flex-1">
                            <div className="font-semibold">Design Agent</div>
                            <div className="text-sm text-gray-600">正在优化配方: F. prausnitzii(40%) + B. longum(30%) + A. muciniphila(20%)</div>
                        </div>
                        <span className="text-xs text-gray-500">进行中</span>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-4">
                        <AlertCircle size={20} className="text-brand-600" />
                        <div className="flex-1">
                            <div className="font-semibold">Analysis Agent</div>
                            <div className="text-sm text-gray-600">开始分析: GNS-IBD-001 Phase II中期数据 (156患者)</div>
                        </div>
                        <span className="text-xs text-gray-500">10分钟前</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
