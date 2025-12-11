import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { CheckCircle2, XCircle, AlertTriangle, Download, Filter, Search } from 'lucide-react';
import qcTestsData from '../data/qc_tests.json';
import batchesData from '../data/batches.json';

export default function QualityControl() {
    const [tests, setTests] = useState(qcTestsData.slice(0, 50));
    const [batches, setBatches] = useState(batchesData);
    const [selectedBatch, setSelectedBatch] = useState(null);

    const stats = {
        totalTests: qcTestsData.length,
        passRate: (qcTestsData.filter(t => t.pass_fail === 'Pass').length / qcTestsData.length * 100).toFixed(1),
        releasedBatches: batches.filter(b => b.release_status === 'Released').length,
        onHold: batches.filter(b => b.release_status === 'Hold').length
    };

    // Pass/Fail trend chart
    const trendChart = {
        title: {
            text: 'QC检测通过率趋势',
            textStyle: { fontSize: 16, fontWeight: 'bold' }
        },
        tooltip: { trigger: 'axis' },
        legend: { data: ['通过率%', '检测数'] },
        xAxis: {
            type: 'category',
            data: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6']
        },
        yAxis: [
            { type: 'value', name: '通过率(%)', max: 100 },
            { type: 'value', name: '检测数' }
        ],
        series: [
            {
                name: '通过率%',
                type: 'line',
                data: [94.5, 96.2, 93.8, 95.5, 97.1, 95.8],
                itemStyle: { color: '#10b981' },
                yAxisIndex: 0
            },
            {
                name: '检测数',
                type: 'bar',
                data: [32, 38, 35, 40, 37, 38],
                itemStyle: { color: '#0ea5e9' },
                yAxisIndex: 1
            }
        ]
    };

    // Test type distribution
    const testTypeChart = {
        title: {
            text: '检测类型分布',
            textStyle: { fontSize: 16, fontWeight: 'bold' }
        },
        tooltip: { trigger: 'item' },
        series: [{
            type: 'pie',
            radius: '70%',
            data: [
                { value: 45, name: 'Viability', itemStyle: { color: '#0ea5e9' } },
                { value: 38, name: 'Purity', itemStyle: { color: '#10b981' } },
                { value: 28, name: 'Identity', itemStyle: { color: '#f59e0b' } },
                { value: 32, name: 'Endotoxin', itemStyle: { color: '#8b5cf6' } },
                { value: 25, name: 'Sterility', itemStyle: { color: '#ec4899' } },
                { value: 32, name: '其他 Others', itemStyle: { color: '#6b7280' } }
            ]
        }]
    };

    const getPassFailBadge = (passFail) => {
        return passFail === 'Pass' ?
            <span className="badge badge-pass flex items-center gap-1">
                <CheckCircle2 size={14} /> 通过
            </span> :
            <span className="badge badge-fail flex items-center gap-1">
                <XCircle size={14} /> 不合格
            </span>;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            {/* Header */}
            <div className="mb-dense-6">
                <h1 className="text-3xl font-bold text-brand-800 mb-dense-2">
                    质量控制 <span className="text-lg font-normal text-gray-600">Quality Control</span>
                </h1>
                <p className="text-gray-600">
                    批次放行检测 | Batch Release Testing | 21 CFR Part 211
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-dense-4 mb-dense-6">
                <div className="card bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                    <div className="text-2xl font-bold">{stats.totalTests}</div>
                    <div className="text-sm opacity-90">QC检测总数</div>
                </div>

                <div className="card bg-gradient-to-br from-scientific-pass to-green-600 text-white">
                    <div className="text-2xl font-bold">{stats.passRate}%</div>
                    <div className="text-sm opacity-90">通过率</div>
                </div>

                <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                    <div className="text-2xl font-bold">{stats.releasedBatches}</div>
                    <div className="text-sm opacity-90">已放行批次</div>
                </div>

                <div className="card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                    <div className="text-2xl font-bold">{stats.onHold}</div>
                    <div className="text-sm opacity-90">待审批Hold</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-dense-6 mb-dense-6">
                <div className="card">
                    <ReactECharts option={trendChart} style={{ height: '300px' }} />
                </div>
                <div className="card">
                    <ReactECharts option={testTypeChart} style={{ height: '300px' }} />
                </div>
            </div>

            {/* Recent Tests Table */}
            <div className="card mb-dense-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-brand-800">最近检测结果 Recent Test Results</h2>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                            <Filter size={18} />
                            筛选
                        </button>
                        <button className="btn-primary">
                            <Download size={18} />
                            导出报告
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="table-dense">
                        <thead>
                            <tr>
                                <th>检测ID</th>
                                <th>批次</th>
                                <th>检测类型</th>
                                <th>检测日期</th>
                                <th>规格 Spec</th>
                                <th>结果 Result</th>
                                <th>判定</th>
                                <th>分析员</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tests.map((test) => (
                                <tr key={test.test_id} className="hover:bg-gray-50">
                                    <td className="font-mono text-brand-600">{test.test_id}</td>
                                    <td className="font-mono">{test.batch_id}</td>
                                    <td>{test.test_type}</td>
                                    <td>{new Date(test.test_date).toLocaleDateString('zh-CN')}</td>
                                    <td className="text-sm">{test.specification}</td>
                                    <td className="font-semibold">{test.result}</td>
                                    <td>{getPassFailBadge(test.pass_fail)}</td>
                                    <td className="text-sm">{test.analyst}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Batch Release Status */}
            <div className="card">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">批次放行状态 Batch Release Status</h2>
                <div className="space-y-3">
                    {batches.slice(0, 10).map((batch) => (
                        <div key={batch.batch_id} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="font-mono font-semibold text-brand-600">{batch.batch_id}</span>
                                        <span className="text-sm text-gray-600">{batch.strain}</span>
                                        <span className="badge bg-brand-100 text-brand-700">{batch.scale}</span>
                                    </div>
                                    <div className="grid grid-cols-5 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">活率:</span>
                                            <span className={`ml-1 font-semibold ${batch.viability_percent >= 90 ? 'text-scientific-pass' : 'text-scientific-fail'}`}>
                                                {batch.viability_percent}%
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">纯度:</span>
                                            <span className={`ml-1 font-semibold ${batch.purity_percent >= 95 ? 'text-scientific-pass' : 'text-scientific-fail'}`}>
                                                {batch.purity_percent}%
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">内毒素:</span>
                                            <span className={`ml-1 font-semibold ${batch.endotoxin_eu_ml < 5 ? 'text-scientific-pass' : 'text-scientific-fail'}`}>
                                                {batch.endotoxin_eu_ml} EU/mL
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">鉴别:</span>
                                            <span className={`ml-1 font-semibold ${batch.identity_confirmed ? 'text-scientific-pass' : 'text-scientific-fail'}`}>
                                                {batch.identity_confirmed ? '确认' : '待定'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">最终OD600:</span>
                                            <span className="ml-1 font-semibold">{batch.final_od600}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {batch.release_status === 'Released' && (
                                        <span className="badge badge-pass flex items-center gap-1">
                                            < CheckCircle2 size={16} /> 已放行
                                        </span>
                                    )}
                                    {batch.release_status === 'Hold' && (
                                        <span className="badge badge-warning flex items-center gap-1">
                                            <AlertTriangle size={16} /> Hold
                                        </span>
                                    )}
                                    {batch.release_status === 'Reject' && (
                                        <span className="badge badge-fail flex items-center gap-1">
                                            <XCircle size={16} /> 拒收
                                        </span>
                                    )}
                                    {batch.deviation && (
                                        <div className="text-xs text-scientific-warning mt-1">
                                            偏差: {batch.deviation}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
