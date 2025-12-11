import { useState } from 'react';
import { AlertTriangle, Activity, FileText } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

export default function Pharmacovigilance() {
    const aes = [
        { id: 'AE-2025-001', patient: 'PT0042', trial: 'GNS-IBD-001', event: '轻度腹泻', severity: 'mild', causality: 'possible', reported: '2025-12-08', status: 'closed' },
        { id: 'AE-2025-002', patient: 'PT0158', trial: 'GNS-IBD-001', event: '腹痛', severity: 'mild', causality: 'unlikely', reported: '2025-12-09', status: 'closed' },
        { id: 'AE-2025-003', patient: 'PT0091', trial: 'GNS-CDI-001', event: '恶心', severity: 'moderate', causality: 'possible', reported: '2025-12-10', status: 'investigating' }
    ];

    // AE severity distribution
    const severityChart = {
        title: { text: '不良事件严重程度分布', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'item' },
        series: [{
            type: 'pie',
            radius: '70%',
            data: [
                { value: 12, name: '轻度 Mild', itemStyle: { color: '#10b981' } },
                { value: 3, name: '中度 Moderate', itemStyle: { color: '#f59e0b' } },
                { value: 0, name: '严重 Severe', itemStyle: { color: '#ef4444' } }
            ]
        }]
    };

    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <div className="mb-dense-6">
                <h1 className="text-3xl font-bold text-brand-800 mb-dense-2">
                    药物警戒 <span className="text-lg font-normal text-gray-600">Pharmacovigilance</span>
                </h1>
                <p className="text-gray-600">不良事件监测与报告 | Adverse Event Monitoring & Reporting</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-dense-4 mb-dense-6">
                <div className="card bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                    <FileText size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{aes.length}</div>
                    <div className="text-sm opacity-90">AE报告总数</div>
                </div>
                <div className="card bg-gradient-to-br from-scientific-pass to-green-600 text-white">
                    <Activity size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{aes.filter(ae => ae.status === 'investigating').length}</div>
                    <div className="text-sm opacity-90">调查中</div>
                </div>
                <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                    <AlertTriangle size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{aes.filter(ae => ae.severity === 'severe').length}</div>
                    <div className="text-sm opacity-90">严重AE</div>
                </div>
                <div className="card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-sm opacity-90">24h报告率</div>
                </div>
            </div>

            {/* Chart */}
            <div className="card mb-dense-6">
                <ReactECharts option={severityChart} style={{ height: '300px' }} />
            </div>

            {/* AE Table */}
            <div className="card">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">不良事件记录 AE Records</h2>
                <div className="overflow-x-auto">
                    <table className="table-dense">
                        <thead>
                            <tr>
                                <th>AE编号</th>
                                <th>患者</th>
                                <th>试验</th>
                                <th>事件描述</th>
                                <th>严重程度</th>
                                <th>因果关系</th>
                                <th>报告日期</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            {aes.map((ae) => (
                                <tr key={ae.id} className="hover:bg-gray-50">
                                    <td className="font-mono font-semibold text-brand-600">{ae.id}</td>
                                    <td className="font-mono text-sm">{ae.patient}</td>
                                    <td className="font-mono text-sm">{ae.trial}</td>
                                    <td>{ae.event}</td>
                                    <td>
                                        {ae.severity === 'mild' ? <span className="badge badge-pass">轻度</span> :
                                            ae.severity === 'moderate' ? <span className="badge bg-scientific-warning text-white">中度</span> :
                                                <span className="badge badge-fail">严重</span>}
                                    </td>
                                    <td className="text-sm">{ae.causality === 'possible' ? '可能相关' : '可能无关'}</td>
                                    <td>{new Date(ae.reported).toLocaleDateString('zh-CN')}</td>
                                    <td>
                                        {ae.status === 'closed' ? <span className="badge bg-gray-500 text-white">已结案</span> :
                                            <span className="badge bg-brand-500 text-white">调查中</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
