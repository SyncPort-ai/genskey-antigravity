import { useState } from 'react';
import { FileText, Users, Calendar, AlertTriangle } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

export default function TrialDesign() {
    const trials = [
        { id: 'GNS-IBD-001', phase: 'Phase II', design: 'RCT双盲', endpoints: ['CDAI缓解率', '内镜评分'], sampleSize: 200, duration: 52, power: 0.90, status: 'recruiting' },
        { id: 'GNS-CDI-001', phase: 'Phase I', design: '开放标签', endpoints: ['安全性', 'PK/PD'], sampleSize: 30, duration: 12, power: null, status: 'completed' },
        { id: 'GNS-T2D-002', phase: 'Preclinical', design: '动物试验', endpoints: ['血糖', 'HbA1c'], sampleSize: 60, duration: 24, power: 0.85, status: 'planning' }
    ];

    // Sample size calculation chart
    const sampleSizeChart = {
        title: { text: '样本量计算 Sample Size Calculation', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        xAxis: { type: 'category', data: trials.map(t => t.id) },
        yAxis: { type: 'value', name: '样本数' },
        series: [{
            name: '样本量',
            type: 'bar',
            data: trials.map(t => ({
                value: t.sampleSize,
                itemStyle: { color: t.phase === 'Phase II' ? '#0ea5e9' : t.phase === 'Phase I' ? '#10b981' : '#f59e0b' }
            })),
            label: { show: true, position: 'top' }
        }]
    };

    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <div className="mb-dense-6">
                <h1 className="text-3xl font-bold text-brand-800 mb-dense-2">
                    试验设计 <span className="text-lg font-normal text-gray-600">Clinical Trial Design</span>
                </h1>
                <p className="text-gray-600">方案设计与样本量计算 | Protocol Design & Sample Size Calculation</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-dense-4 mb-dense-6">
                <div className="card bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                    <FileText size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{trials.length}</div>
                    <div className="text-sm opacity-90">试验项目</div>
                </div>
                <div className="card bg-gradient-to-br from-scientific-pass to-green-600 text-white">
                    <Users size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{trials.reduce((sum, t) => sum + t.sampleSize, 0)}</div>
                    <div className="text-sm opacity-90">总样本量</div>
                </div>
                <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                    <Calendar size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{Math.round(trials.reduce((sum, t) => sum + t.duration, 0) / trials.length)}</div>
                    <div className="text-sm opacity-90">平均周期(周)</div>
                </div>
                <div className="card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                    <AlertTriangle size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{trials.filter(t => t.status === 'recruiting').length}</div>
                    <div className="text-sm opacity-90">招募中</div>
                </div>
            </div>

            {/* Chart */}
            <div className="card mb-dense-6">
                <ReactECharts option={sampleSizeChart} style={{ height: '300px' }} />
            </div>

            {/* Trial Table */}
            <div className="card">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">试验设计方案 Trial Design Protocols</h2>
                <div className="overflow-x-auto">
                    <table className="table-dense">
                        <thead>
                            <tr>
                                <th>项目ID</th>
                                <th>阶段</th>
                                <th>设计类型</th>
                                <th>主要终点</th>
                                <th>样本量</th>
                                <th>周期(周)</th>
                                <th>检验效能</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trials.map((trial) => (
                                <tr key={trial.id} className="hover:bg-gray-50">
                                    <td className="font-mono font-semibold text-brand-600">{trial.id}</td>
                                    <td><span className="badge bg-brand-100 text-brand-700">{trial.phase}</span></td>
                                    <td>{trial.design}</td>
                                    <td className="text-sm">{trial.endpoints.join(', ')}</td>
                                    <td className="text-right font-semibold">{trial.sampleSize}</td>
                                    <td className="text-right">{trial.duration}</td>
                                    <td className="text-right">{trial.power ? `${(trial.power * 100).toFixed(0)}%` : '-'}</td>
                                    <td>
                                        {trial.status === 'recruiting' ? <span className="badge bg-brand-500 text-white">招募中</span> :
                                            trial.status === 'completed' ? <span className="badge badge-pass">完成</span> :
                                                <span className="badge bg-gray-500 text-white">规划中</span>}
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
