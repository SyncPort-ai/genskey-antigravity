import { useState } from 'react';
import { Users, TrendingUp, Award, Target } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

export default function TeamPerformance() {
    const teams = [
        { department: '发现引擎', members: 12, productivity: 0.88, projects: 5, publications: 8, onTime: 0.92 },
        { department: '研发设计', members: 18, productivity: 0.91, projects: 8, publications: 12, onTime: 0.89 },
        { department: '生产制造', members: 25, productivity: 0.95, projects: 3, publications: 2, onTime: 0.94 },
        { department: '临床法规', members: 15, productivity: 0.86, projects: 4, publications: 6, onTime: 0.88 },
        { department: '数据科学', members: 10, productivity: 0.93, projects: 6, publications: 15, onTime: 0.90 },
        { department: 'AI副驾驶', members: 8, productivity: 0.89, projects: 3, publications: 5, onTime: 0.85 }
    ];

    const topPerformers = [
        { name: '张伟', department: '研发设计', role: 'Senior Scientist', achievements: 12, score: 95 },
        { name: '李娜', department: '数据科学', role: 'ML Engineer', achievements: 10, score: 93 },
        { name: '王强', department: '生产制造', role: 'Process Engineer', achievements: 9, score: 91 },
        { name: '刘静', department: '临床法规', role: 'CRA', achievements: 8, score: 89 },
        { name: '陈明', department: '发现引擎', role: 'Microbiologist', achievements: 7, score: 87 }
    ];

    // Team productivity chart
    const productivityChart = {
        title: { text: '部门生产力 Department Productivity', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        xAxis: {
            type: 'category',
            data: teams.map(t => t.department),
            axisLabel: { rotate: 30 }
        },
        yAxis: { type: 'value', name: '生产力指数', max: 100 },
        series: [{
            name: '生产力',
            type: 'bar',
            data: teams.map(t => ({
                value: t.productivity * 100,
                itemStyle: {
                    color: t.productivity >= 0.9 ? '#10b981' : t.productivity >= 0.85 ? '#f59e0b' : '#ef4444'
                }
            })),
            label: {
                show: true,
                position: 'top',
                formatter: '{c}%'
            }
        }]
    };

    // Publications trend
    const publicationsChart = {
        title: { text: '学术产出 Publications Output', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'axis' },
        legend: { data: ['论文发表', '专利申请'] },
        xAxis: {
            type: 'category',
            data: ['Q1', 'Q2', 'Q3', 'Q4']
        },
        yAxis: { type: 'value', name: '数量' },
        series: [
            {
                name: '论文发表',
                type: 'line',
                data: [8, 12, 15, 13],
                smooth: true,
                itemStyle: { color: '#0ea5e9' },
                areaStyle: { color: 'rgba(14, 165, 233, 0.2)' }
            },
            {
                name: '专利申请',
                type: 'line',
                data: [3, 5, 7, 9],
                smooth: true,
                itemStyle: { color: '#10b981' },
                areaStyle: { color: 'rgba(16, 185, 129, 0.2)' }
            }
        ]
    };

    // Collaboration network (simplified radar)
    const collaborationRadar = {
        title: { text: '跨部门协作指数', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: {},
        radar: {
            indicator: teams.map(t => ({ name: t.department, max: 100 }))
        },
        series: [{
            type: 'radar',
            data: [{
                value: teams.map(t => t.onTime * 100),
                name: '准时交付率',
                itemStyle: { color: '#0ea5e9' },
                areaStyle: { color: 'rgba(14, 165, 233, 0.3)' }
            }]
        }]
    };

    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <div className="mb-dense-6">
                <h1 className="text-3xl font-bold text-brand-800 mb-dense-2">
                    团队绩效 <span className="text-lg font-normal text-gray-600">Team Performance</span>
                </h1>
                <p className="text-gray-600">生产力指标与协作网络 | Productivity Metrics & Collaboration Network</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-dense-4 mb-dense-6">
                <div className="card bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                    <Users size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{teams.reduce((sum, t) => sum + t.members, 0)}</div>
                    <div className="text-sm opacity-90">团队总人数</div>
                </div>

                <div className="card bg-gradient-to-br from-scientific-pass to-green-600 text-white">
                    <TrendingUp size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">
                        {Math.round((teams.reduce((sum, t) => sum + t.productivity, 0) / teams.length) * 100)}%
                    </div>
                    <div className="text-sm opacity-90">平均生产力</div>
                </div>

                <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                    <Target size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{teams.reduce((sum, t) => sum + t.projects, 0)}</div>
                    <div className="text-sm opacity-90">活跃项目</div>
                </div>

                <div className="card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                    <Award size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{teams.reduce((sum, t) => sum + t.publications, 0)}</div>
                    <div className="text-sm opacity-90">年度发表</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-dense-6 mb-dense-6">
                <div className="card">
                    <ReactECharts option={productivityChart} style={{ height: '300px' }} />
                </div>
                <div className="card">
                    <ReactECharts option={publicationsChart} style={{ height: '300px' }} />
                </div>
            </div>

            <div className="card mb-dense-6">
                <ReactECharts option={collaborationRadar} style={{ height: '350px' }} />
            </div>

            {/* Department Table */}
            <div className="card mb-dense-6">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">部门绩效 Department Performance</h2>
                <div className="overflow-x-auto">
                    <table className="table-dense">
                        <thead>
                            <tr>
                                <th>部门</th>
                                <th>人数</th>
                                <th>生产力</th>
                                <th>活跃项目</th>
                                <th>年度发表</th>
                                <th>准时交付率</th>
                                <th>评级</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teams.map((team, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="font-semibold">{team.department}</td>
                                    <td className="text-right">{team.members}</td>
                                    <td className="text-right">
                                        <span className={`font-semibold ${team.productivity >= 0.9 ? 'text-scientific-pass' :
                                                team.productivity >= 0.85 ? 'text-scientific-warning' : 'text-scientific-fail'
                                            }`}>
                                            {(team.productivity * 100).toFixed(0)}%
                                        </span>
                                    </td>
                                    <td className="text-right">{team.projects}</td>
                                    <td className="text-right">{team.publications}</td>
                                    <td className="text-right">{(team.onTime * 100).toFixed(0)}%</td>
                                    <td>
                                        {team.productivity >= 0.9 ?
                                            <span className="badge badge-pass">优秀</span> :
                                            team.productivity >= 0.85 ?
                                                <span className="badge badge-warning">良好</span> :
                                                <span className="badge bg-gray-500 text-white">合格</span>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Top Performers */}
            <div className="card">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">优秀员工 Top Performers</h2>
                <div className="space-y-3">
                    {topPerformers.map((person, index) => (
                        <div key={index} className="p-4 bg-gradient-to-r from-brand-50 to-white rounded-lg border border-brand-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${index === 0 ? 'bg-yellow-500' :
                                            index === 1 ? 'bg-gray-400' :
                                                index === 2 ? 'bg-orange-600' : 'bg-brand-500'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg">{person.name}</div>
                                        <div className="text-sm text-gray-600">{person.department} · {person.role}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-brand-600">{person.score}</div>
                                    <div className="text-xs text-gray-500">绩效分</div>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                                <Award size={16} className="text-brand-600" />
                                <span className="text-sm text-gray-700">{person.achievements} 项成就</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
