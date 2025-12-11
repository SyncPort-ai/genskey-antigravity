import { useState } from 'react';
import { Dna, TrendingUp, CheckCircle2, FlaskConical } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import strainsData from '../data/strains.json';

export default function HitToLead() {
    const candidates = [
        { id: 'GNS0042', species: 'F. prausnitzii', efficacy: 0.92, safety: 0.98, manufacturability: 0.85, overall: 0.92, status: 'lead' },
        { id: 'GNS0023', species: 'B. longum', efficacy: 0.88, safety: 0.95, manufacturability: 0.92, overall: 0.92, status: 'lead' },
        { id: 'GNS0035', species: 'A. muciniphila', efficacy: 0.90, safety: 0.97, manufacturability: 0.78, overall: 0.88, status: 'hit' },
        { id: 'GNS0018', species: 'R. intestinalis', efficacy: 0.84, safety: 0.96, manufacturability: 0.88, overall: 0.89, status: 'hit' },
        { id: 'GNS0007', species: 'B. adolescentis', efficacy: 0.81, safety: 0.94, manufacturability: 0.90, overall: 0.88, status: 'hit' },
        { id: 'GNS0056', species: 'L. reuteri', efficacy: 0.75, safety: 0.92, manufacturability: 0.95, overall: 0.87, status: 'screened-out' }
    ];

    // Efficacy comparison chart
    const efficacyChart = {
        title: { text: '候选菌株疗效对比', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        xAxis: {
            type: 'category',
            data: candidates.map(c => c.id),
            axisLabel: { rotate: 30 }
        },
        yAxis: { type: 'value', name: '疗效评分', max: 100 },
        series: [{
            name: '疗效',
            type: 'bar',
            data: candidates.map(c => ({
                value: c.efficacy * 100,
                itemStyle: {
                    color: c.status === 'lead' ? '#10b981' : c.status === 'hit' ? '#f59e0b' : '#6b7280'
                }
            })),
            label: {
                show: true,
                position: 'top',
                formatter: '{c}%'
            }
        }]
    };

    // Multi-criteria radar
    const radarChart = {
        title: { text: '综合评价 Multi-Criteria Evaluation', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: {},
        legend: { bottom: 10 },
        radar: {
            indicator: [
                { name: '疗效 Efficacy', max: 100 },
                { name: '安全性 Safety', max: 100 },
                { name: '可生产性 Manufacturability', max: 100 }
            ]
        },
        series: [{
            type: 'radar',
            data: candidates.filter(c => c.status === 'lead').map((c, idx) => ({
                value: [c.efficacy * 100, c.safety * 100, c.manufacturability * 100],
                name: c.id,
                itemStyle: { color: ['#0ea5e9', '#10b981'][idx] }
            }))
        }]
    };

    const getStatusBadge = (status) => {
        const badges = {
            lead: <span className="badge badge-pass">Lead</span>,
            hit: <span className="badge bg-scientific-warning text-white">Hit</span>,
            'screened-out': <span className="badge bg-gray-500 text-white">淘汰</span>
        };
        return badges[status];
    };

    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <div className="mb-dense-6">
                <h1 className="text-3xl font-bold text-brand-800 mb-dense-2">
                    先导化合物优化 <span className="text-lg font-normal text-gray-600">Hit-to-Lead Optimization</span>
                </h1>
                <p className="text-gray-600">候选菌株筛选与优化 | Lead Strain Selection & Optimization</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-dense-4 mb-dense-6">
                <div className="card bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                    <FlaskConical size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{strainsData.length}</div>
                    <div className="text-sm opacity-90">初筛菌株库</div>
                </div>

                <div className="card bg-gradient-to-br from-scientific-pass to-green-600 text-white">
                    <CheckCircle2 size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{candidates.filter(c => c.status === 'lead').length}</div>
                    <div className="text-sm opacity-90">Lead菌株</div>
                </div>

                <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                    <Dna size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{candidates.filter(c => c.status === 'hit').length}</div>
                    <div className="text-sm opacity-90">Hit菌株</div>
                </div>

                <div className="card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                    <TrendingUp size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">
                        {Math.round((candidates.reduce((sum, c) => sum + c.overall, 0) / candidates.length) * 100)}%
                    </div>
                    <div className="text-sm opacity-90">平均综合评分</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-dense-6 mb-dense-6">
                <div className="card">
                    <ReactECharts option={efficacyChart} style={{ height: '300px' }} />
                </div>
                <div className="card">
                    <ReactECharts option={radarChart} style={{ height: '300px' }} />
                </div>
            </div>

            {/* Candidate Table */}
            <div className="card">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">候选菌株评估 Candidate Strains Evaluation</h2>
                <div className="overflow-x-auto">
                    <table className="table-dense">
                        <thead>
                            <tr>
                                <th>菌株ID</th>
                                <th>物种</th>
                                <th>疗效</th>
                                <th>安全性</th>
                                <th>可生产性</th>
                                <th>综合评分</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidates.map((candidate) => (
                                <tr key={candidate.id} className="hover:bg-gray-50">
                                    <td className="font-mono font-semibold text-brand-600">{candidate.id}</td>
                                    <td className="italic">{candidate.species}</td>
                                    <td className="text-right">
                                        <span className={`font-semibold ${candidate.efficacy >= 0.9 ? 'text-scientific-pass' :
                                                candidate.efficacy >= 0.8 ? 'text-scientific-warning' : 'text-gray-600'
                                            }`}>
                                            {(candidate.efficacy * 100).toFixed(0)}%
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <span className="font-semibold text-scientific-pass">
                                            {(candidate.safety * 100).toFixed(0)}%
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <span className={`font-semibold ${candidate.manufacturability >= 0.9 ? 'text-scientific-pass' :
                                                candidate.manufacturability >= 0.8 ? 'text-scientific-warning' : 'text-gray-600'
                                            }`}>
                                            {(candidate.manufacturability * 100).toFixed(0)}%
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <span className="text-lg font-bold text-brand-600">
                                            {(candidate.overall * 100).toFixed(0)}%
                                        </span>
                                    </td>
                                    <td>{getStatusBadge(candidate.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 p-4 bg-brand-50 rounded-lg">
                    <h3 className="font-semibold text-brand-800 mb-2">筛选标准 Selection Criteria</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="text-gray-600">Lead标准:</span>
                            <span className="ml-2 font-semibold">综合≥90%</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Hit标准:</span>
                            <span className="ml-2 font-semibold">综合≥85%</span>
                        </div>
                        <div>
                            <span className="text-gray-600">安全性:</span>
                            <span className="ml-2 font-semibold">必须≥92%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
