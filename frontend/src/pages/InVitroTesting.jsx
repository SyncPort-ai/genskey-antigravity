import { useState } from 'react';
import { TestTube, Activity, TrendingUp, CheckCircle2 } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

export default function InVitroTesting() {
    const assays = [
        { id: 'SHIME-001', name: 'SHIME模拟肠道系统', strain: 'GNS0042', duration: 72, viability: 0.94, colonization: 0.88, metabolites: 'SCFAs↑35%', status: 'completed' },
        { id: 'CACO2-002', name: 'Caco-2细胞黏附试验', strain: 'GNS0023', duration: 24, viability: 0.91, colonization: 0.92, metabolites: 'Tight junction↑', status: 'completed' },
        { id: 'COLON-003', name: '结肠类器官模型', strain: 'GNS0035', duration: 168, viability: 0.89, colonization: 0.85, metabolites: '抗炎因子↑', status: 'running' },
        { id: 'BILE-004', name: '胆盐耐受性测试', strain: 'GNS0042', duration: 6, viability: 0.96, colonization: null, metabolites: null, status: 'completed' }
    ];

    // Viability chart over time
    const viabilityChart = {
        title: { text: '体外存活率曲线 In Vitro Viability', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'axis' },
        legend: { data: ['GNS0042', 'GNS0023', 'GNS0035'] },
        xAxis: { type: 'category', data: ['0h', '12h', '24h', '48h', '72h'], name: '时间' },
        yAxis: { type: 'value', name: '存活率%', max: 100 },
        series: [
            {
                name: 'GNS0042',
                type: 'line',
                data: [100, 96, 95, 94, 94],
                smooth: true,
                itemStyle: { color: '#0ea5e9' }
            },
            {
                name: 'GNS0023',
                type: 'line',
                data: [100, 94, 92, 91, 91],
                smooth: true,
                itemStyle: { color: '#10b981' }
            },
            {
                name: 'GNS0035',
                type: 'line',
                data: [100, 92, 90, 89, 89],
                smooth: true,
                itemStyle: { color: '#f59e0b' }
            }
        ]
    };

    // Metabolite production bar chart
    const metaboliteChart = {
        title: { text: '代谢产物分析 Metabolite Production', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { data: ['乙酸', '丙酸', '丁酸'] },
        xAxis: { type: 'category', data: ['GNS0042', 'GNS0023', 'GNS0035'] },
        yAxis: { type: 'value', name: 'mM' },
        series: [
            {
                name: '乙酸',
                type: 'bar',
                data: [45, 38, 42],
                itemStyle: { color: '#0ea5e9' }
            },
            {
                name: '丙酸',
                type: 'bar',
                data: [28, 32, 25],
                itemStyle: { color: '#10b981' }
            },
            {
                name: '丁酸',
                type: 'bar',
                data: [18, 15, 22],
                itemStyle: { color: '#f59e0b' }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <div className="mb-dense-6">
                <h1 className="text-3xl font-bold text-brand-800 mb-dense-2">
                    体外测试 <span className="text-lg font-normal text-gray-600">In Vitro Testing</span>
                </h1>
                <p className="text-gray-600">肠道模拟系统与功能验证 | Gut Simulation Assays & Functional Validation</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-dense-4 mb-dense-6">
                <div className="card bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                    <TestTube size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{assays.length}</div>
                    <div className="text-sm opacity-90">试验总数</div>
                </div>

                <div className="card bg-gradient-to-br from-scientific-pass to-green-600 text-white">
                    <CheckCircle2 size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{assays.filter(a => a.status === 'completed').length}</div>
                    <div className="text-sm opacity-90">已完成</div>
                </div>

                <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                    <Activity size={32} className="mb-2 opacity-80 animate-pulse" />
                    <div className="text-2xl font-bold">{assays.filter(a => a.status === 'running').length}</div>
                    <div className="text-sm opacity-90">进行中</div>
                </div>

                <div className="card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                    <TrendingUp size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">
                        {Math.round((assays.filter(a => a.viability).reduce((sum, a) => sum + a.viability, 0) / assays.filter(a => a.viability).length) * 100)}%
                    </div>
                    <div className="text-sm opacity-90">平均存活率</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-dense-6 mb-dense-6">
                <div className="card">
                    <ReactECharts option={viabilityChart} style={{ height: '300px' }} />
                </div>
                <div className="card">
                    <ReactECharts option={metaboliteChart} style={{ height: '300px' }} />
                </div>
            </div>

            {/* Assay Table */}
            <div className="card">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">试验记录 Assay Records</h2>
                <div className="overflow-x-auto">
                    <table className="table-dense">
                        <thead>
                            <tr>
                                <th>试验ID</th>
                                <th>试验类型</th>
                                <th>菌株</th>
                                <th>时长(h)</th>
                                <th>存活率</th>
                                <th>定植能力</th>
                                <th>代谢产物</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assays.map((assay) => (
                                <tr key={assay.id} className="hover:bg-gray-50">
                                    <td className="font-mono font-semibold text-brand-600">{assay.id}</td>
                                    <td className="font-semibold">{assay.name}</td>
                                    <td className="font-mono text-sm">{assay.strain}</td>
                                    <td className="text-right">{assay.duration}</td>
                                    <td className="text-right">
                                        {assay.viability ? (
                                            <span className={`font-semibold ${assay.viability >= 0.9 ? 'text-scientific-pass' :
                                                    assay.viability >= 0.85 ? 'text-scientific-warning' : 'text-gray-600'
                                                }`}>
                                                {(assay.viability * 100).toFixed(0)}%
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td className="text-right">
                                        {assay.colonization ? (
                                            <span className="font-semibold">{(assay.colonization * 100).toFixed(0)}%</span>
                                        ) : '-'}
                                    </td>
                                    <td className="text-sm">{assay.metabolites || '-'}</td>
                                    <td>
                                        {assay.status === 'completed' ?
                                            <span className="badge badge-pass">完成</span> :
                                            <span className="badge bg-brand-500 text-white animate-pulse">进行中</span>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 p-4 bg-brand-50 rounded-lg">
                    <h3 className="font-semibold text-brand-800 mb-2">检测方法 Assay Methods</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-600">SHIME:</span>
                            <span className="ml-2 font-semibold">Simulator of Human Intestinal Microbial Ecosystem</span>
                        </div>
                        <div>
                            <span className="text-gray-600">SCFAs:</span>
                            <span className="ml-2 font-semibold">Short-Chain Fatty Acids (GC-MS)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
