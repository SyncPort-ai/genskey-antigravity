import { useState } from 'react';
import { Beaker, TrendingUp, AlertCircle, CheckCircle2, Flask } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

export default function FormulationLab() {
    const formulations = [
        {
            id: 'FORM-001',
            name: 'F. prausnitzii微囊制剂',
            composition: 'F. prausnitzii (1e9 CFU), 海藻酸钠, 壳聚糖',
            status: 'stable',
            stabilityDays: 180,
            viabilityRetention: 0.92,
            moistureContent: 4.2,
            lastTested: '2025-12-08'
        },
        {
            id: 'FORM-002',
            name: 'Multi-strain冻干粉',
            composition: '3-strain consortium, 蔗糖, 海藻糖',
            status: 'testing',
            stabilityDays: 90,
            viabilityRetention: 0.88,
            moistureContent: 3.8,
            lastTested: '2025-12-10'
        },
        {
            id: 'FORM-003',
            name: 'B. longum肠溶胶囊',
            composition: 'B. longum (5e8 CFU), HPMC肠溶衣',
            status: 'stable',
            stabilityDays: 365,
            viabilityRetention: 0.95,
            moistureContent: 2.1,
            lastTested: '2025-12-05'
        },
        {
            id: 'FORM-004',
            name: 'A. muciniphila悬浮液',
            composition: 'A. muciniphila, 甘油保护剂',
            status: 'unstable',
            stabilityDays: 30,
            viabilityRetention: 0.65,
            moistureContent: 82.5,
            lastTested: '2025-12-11'
        }
    ];

    const stabilityStudies = [
        { condition: '4°C', months: [95, 94, 93, 91, 89, 88] },
        { condition: '25°C/60%RH', months: [95, 90, 85, 78, 72, 65] },
        { condition: '40°C/75%RH', months: [95, 82, 68, 52, 38, 25] }
    ];

    // Stability curve chart
    const stabilityChart = {
        title: { text: '稳定性研究曲线 Stability Study Curves', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'axis' },
        legend: { data: ['4°C', '25°C/60%RH', '40°C/75%RH'] },
        xAxis: {
            type: 'category',
            data: ['0M', '1M', '2M', '3M', '4M', '5M', '6M'],
            name: '时间'
        },
        yAxis: { type: 'value', name: '活菌率%', max: 100 },
        series: stabilityStudies.map((study, idx) => ({
            name: study.condition,
            type: 'line',
            data: [100, ...study.months],
            smooth: true,
            itemStyle: { color: ['#10b981', '#f59e0b', '#ef4444'][idx] },
            lineStyle: { width: 3 }
        }))
    };

    // Formulation comparison radar
    const radarChart = {
        title: { text: '制剂性能对比 Formulation Performance', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: {},
        legend: { bottom: 10 },
        radar: {
            indicator: [
                { name: '稳定性', max: 100 },
                { name: '活菌保留', max: 100 },
                { name: '工艺可行性', max: 100 },
                { name: '成本效益', max: 100 },
                { name: '患者依从性', max: 100 }
            ]
        },
        series: [{
            type: 'radar',
            data: [
                {
                    value: [92, 92, 75, 85, 90],
                    name: 'FORM-001 微囊',
                    itemStyle: { color: '#0ea5e9' }
                },
                {
                    value: [88, 88, 90, 92, 85],
                    name: 'FORM-002 冻干粉',
                    itemStyle: { color: '#10b981' }
                },
                {
                    value: [95, 95, 85, 78, 95],
                    name: 'FORM-003 肠溶胶囊',
                    itemStyle: { color: '#f59e0b' }
                }
            ]
        }]
    };

    const getStatusBadge = (status) => {
        const badges = {
            stable: <span className="badge badge-pass">稳定</span>,
            testing: <span className="badge bg-brand-500 text-white">测试中</span>,
            unstable: <span className="badge badge-fail">不稳定</span>
        };
        return badges[status];
    };

    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <div className="mb-dense-6">
                <h1 className="text-3xl font-bold text-brand-800 mb-dense-2">
                    制剂实验室 <span className="text-lg font-normal text-gray-600">Formulation Lab</span>
                </h1>
                <p className="text-gray-600">制剂配方开发与稳定性研究 | Formulation Development & Stability Studies</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-dense-4 mb-dense-6">
                <div className="card bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                    <Flask size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{formulations.length}</div>
                    <div className="text-sm opacity-90">制剂配方</div>
                </div>

                <div className="card bg-gradient-to-br from-scientific-pass to-green-600 text-white">
                    <CheckCircle2 size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{formulations.filter(f => f.status === 'stable').length}</div>
                    <div className="text-sm opacity-90">稳定配方</div>
                </div>

                <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                    <TrendingUp size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">
                        {Math.round((formulations.reduce((sum, f) => sum + f.viabilityRetention, 0) / formulations.length) * 100)}%
                    </div>
                    <div className="text-sm opacity-90">平均活菌保留</div>
                </div>

                <div className="card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                    <Beaker size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">
                        {Math.max(...formulations.map(f => f.stabilityDays))}
                    </div>
                    <div className="text-sm opacity-90">最长稳定期(天)</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-dense-6 mb-dense-6">
                <div className="card">
                    <ReactECharts option={stabilityChart} style={{ height: '350px' }} />
                </div>
                <div className="card">
                    <ReactECharts option={radarChart} style={{ height: '350px' }} />
                </div>
            </div>

            {/* Formulation Table */}
            <div className="card">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">制剂配方库 Formulation Library</h2>
                <div className="overflow-x-auto">
                    <table className="table-dense">
                        <thead>
                            <tr>
                                <th>配方ID</th>
                                <th>制剂名称</th>
                                <th>组成</th>
                                <th>稳定期(天)</th>
                                <th>活菌保留率</th>
                                <th>水分含量%</th>
                                <th>上次测试</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formulations.map((form) => (
                                <tr key={form.id} className="hover:bg-gray-50">
                                    <td className="font-mono font-semibold text-brand-600">{form.id}</td>
                                    <td className="font-semibold">{form.name}</td>
                                    <td className="text-sm max-w-xs">{form.composition}</td>
                                    <td className="text-right">{form.stabilityDays}</td>
                                    <td className="text-right">
                                        <span className={`font-semibold ${form.viabilityRetention >= 0.9 ? 'text-scientific-pass' :
                                                form.viabilityRetention >= 0.8 ? 'text-scientific-warning' : 'text-scientific-fail'
                                            }`}>
                                            {(form.viabilityRetention * 100).toFixed(0)}%
                                        </span>
                                    </td>
                                    <td className="text-right">{form.moistureContent}%</td>
                                    <td>{new Date(form.lastTested).toLocaleDateString('zh-CN')}</td>
                                    <td>{getStatusBadge(form.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 p-4 bg-brand-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-brand-800 mb-2">
                        <AlertCircle size={16} />
                        <span className="font-semibold">稳定性标准 Stability Criteria</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="text-gray-600">活菌保留率:</span>
                            <span className="ml-2 font-semibold">≥80% (6个月)</span>
                        </div>
                        <div>
                            <span className="text-gray-600">水分含量:</span>
                            <span className="ml-2 font-semibold">≤5% (冻干粉)</span>
                        </div>
                        <div>
                            <span className="text-gray-600">储存条件:</span>
                            <span className="ml-2 font-semibold">4°C / -20°C</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
