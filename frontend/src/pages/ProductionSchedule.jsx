import { useState } from 'react';
import { Calendar, Clock, TrendingUp, AlertCircle, Package } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import batchesData from '../data/batches.json';

export default function ProductionSchedule() {
    const schedule = [
        {
            week: 'W1',
            batches: [
                { id: 'BATCH-2025-001', strain: 'GNS0012', fermenter: 'F1-500L', status: 'completed', progress: 100 },
                { id: 'BATCH-2025-002', strain: 'GNS0023', fermenter: 'F2-500L', status: 'in-progress', progress: 75 }
            ]
        },
        {
            week: 'W2',
            batches: [
                { id: 'BATCH-2025-003', strain: 'GNS0042', fermenter: 'F3-200L', status: 'in-progress', progress: 45 },
                { id: 'BATCH-2025-004', strain: 'GNS0018', fermenter: 'F4-1000L', status: 'planned', progress: 0 }
            ]
        },
        {
            week: 'W3',
            batches: [
                { id: 'BATCH-2025-005', strain: 'GNS0035', fermenter: 'F1-500L', status: 'planned', progress: 0 },
                { id: 'BATCH-2025-006', strain: 'GNS0007', fermenter: 'F2-500L', status: 'planned', progress: 0 }
            ]
        }
    ];

    const fermenters = [
        { id: 'F1-500L', capacity: 500, current: 'BATCH-2025-002', utilization: 85, nextAvailable: '2025-12-15' },
        { id: 'F2-500L', capacity: 500, current: null, utilization: 0, nextAvailable: 'Available' },
        { id: 'F3-200L', capacity: 200, current: 'BATCH-2025-003', utilization: 92, nextAvailable: '2025-12-18' },
        { id: 'F4-1000L', capacity: 1000, current: null, utilization: 0, nextAvailable: 'Available' }
    ];

    // Gantt chart simulation
    const ganttChart = {
        title: { text: '生产甘特图 Production Gantt', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { formatter: (params) => `${params.name}<br/>进度: ${params.value[3]}%` },
        xAxis: {
            type: 'time',
            min: '2025-12-01',
            max: '2025-12-31'
        },
        yAxis: {
            type: 'category',
            data: ['F4-1000L', 'F3-200L', 'F2-500L', 'F1-500L']
        },
        series: [{
            type: 'custom',
            renderItem: (params, api) => {
                const categoryIndex = api.value(0);
                const start = api.coord([api.value(1), categoryIndex]);
                const end = api.coord([api.value(2), categoryIndex]);
                const height = api.size([0, 1])[1] * 0.6;

                return {
                    type: 'rect',
                    shape: {
                        x: start[0],
                        y: start[1] - height / 2,
                        width: end[0] - start[0],
                        height: height
                    },
                    style: {
                        fill: api.value(4) === 'completed' ? '#10b981' :
                            api.value(4) === 'in-progress' ? '#0ea5e9' : '#94a3b8'
                    }
                };
            },
            encode: {
                x: [1, 2],
                y: 0
            },
            data: [
                [0, '2025-12-01', '2025-12-05', 100, 'completed', 'BATCH-2025-001'],
                [0, '2025-12-06', '2025-12-14', 75, 'in-progress', 'BATCH-2025-002'],
                [1, '2025-12-08', '2025-12-18', 92, 'completed', 'BATCH-2024-050'],
                [1, '2025-12-10', '2025-12-18', 45, 'in-progress', 'BATCH-2025-003'],
                [2, '2025-12-15', '2025-12-22', 0, 'planned', 'BATCH-2025-005'],
                [3, '2025-12-12', '2025-12-20', 0, 'planned', 'BATCH-2025-004']
            ]
        }]
    };

    // Capacity utilization
    const utilizationChart = {
        title: { text: '产能利用率 Capacity Utilization', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'axis', formatter: '{b}: {c}%' },
        xAxis: { type: 'category', data: fermenters.map(f => f.id) },
        yAxis: { type: 'value', name: '利用率%', max: 100 },
        series: [{
            type: 'bar',
            data: fermenters.map(f => ({
                value: f.utilization,
                itemStyle: {
                    color: f.utilization >= 80 ? '#10b981' : f.utilization >= 50 ? '#f59e0b' : '#ef4444'
                }
            }))
        }]
    };

    const getStatusBadge = (status) => {
        const badges = {
            completed: <span className="badge badge-pass">已完成</span>,
            'in-progress': <span className="badge bg-brand-500 text-white">进行中</span>,
            planned: <span className="badge bg-gray-500 text-white">计划中</span>
        };
        return badges[status];
    };

    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <div className="mb-dense-6">
                <h1 className="text-3xl font-bold text-brand-800 mb-dense-2">
                    生产排程 <span className="text-lg font-normal text-gray-600">Production Schedule</span>
                </h1>
                <p className="text-gray-600">发酵批次计划与资源管理 | Batch Planning & Resource Management</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-dense-4 mb-dense-6">
                <div className="card bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                    <Package size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{schedule.reduce((sum, w) => sum + w.batches.length, 0)}</div>
                    <div className="text-sm opacity-90">计划批次</div>
                </div>

                <div className="card bg-gradient-to-br from-scientific-pass to-green-600 text-white">
                    <TrendingUp size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">
                        {schedule.flatMap(w => w.batches).filter(b => b.status === 'completed').length}
                    </div>
                    <div className="text-sm opacity-90">已完成</div>
                </div>

                <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                    <Clock size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">
                        {schedule.flatMap(w => w.batches).filter(b => b.status === 'in-progress').length}
                    </div>
                    <div className="text-sm opacity-90">进行中</div>
                </div>

                <div className="card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                    <Calendar size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">
                        {Math.round(fermenters.reduce((sum, f) => sum + f.utilization, 0) / fermenters.length)}%
                    </div>
                    <div className="text-sm opacity-90">平均产能利用</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-dense-6 mb-dense-6">
                <div className="card">
                    <ReactECharts option={ganttChart} style={{ height: '300px' }} />
                </div>
                <div className="card">
                    <ReactECharts option={utilizationChart} style={{ height: '300px' }} />
                </div>
            </div>

            {/* Weekly Schedule */}
            <div className="mb-dense-6">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">周生产计划 Weekly Schedule</h2>
                <div className="space-y-4">
                    {schedule.map((week) => (
                        <div key={week.week} className="card">
                            <h3 className="text-lg font-semibold mb-3 text-brand-700">第{week.week}周</h3>
                            <div className="space-y-3">
                                {week.batches.map((batch) => (
                                    <div key={batch.id} className="p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono font-semibold text-brand-600">{batch.id}</span>
                                                <span className="text-sm text-gray-600">{batch.strain}</span>
                                                <span className="badge bg-brand-100 text-brand-700">{batch.fermenter}</span>
                                            </div>
                                            {getStatusBadge(batch.status)}
                                        </div>
                                        {batch.status !== 'planned' && (
                                            <div>
                                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                    <span>进度</span>
                                                    <span>{batch.progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-brand-500 h-2 rounded-full"
                                                        style={{ width: `${batch.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fermenter Status */}
            <div className="card">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">发酵罐状态 Fermenter Status</h2>
                <div className="overflow-x-auto">
                    <table className="table-dense">
                        <thead>
                            <tr>
                                <th>发酵罐ID</th>
                                <th>容量 (L)</th>
                                <th>当前批次</th>
                                <th>利用率</th>
                                <th>下次可用</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fermenters.map((fermenter) => (
                                <tr key={fermenter.id} className="hover:bg-gray-50">
                                    <td className="font-mono font-semibold text-brand-600">{fermenter.id}</td>
                                    <td className="text-right">{fermenter.capacity}L</td>
                                    <td className="font-mono text-sm">
                                        {fermenter.current || <span className="text-gray-400">-</span>}
                                    </td>
                                    <td className="text-right">
                                        <span className={`font-semibold ${fermenter.utilization >= 80 ? 'text-scientific-pass' :
                                                fermenter.utilization >= 50 ? 'text-scientific-warning' : 'text-gray-600'
                                            }`}>
                                            {fermenter.utilization}%
                                        </span>
                                    </td>
                                    <td>{fermenter.nextAvailable}</td>
                                    <td>
                                        {fermenter.current ?
                                            <span className="badge bg-brand-500 text-white">运行中</span> :
                                            <span className="badge badge-pass">空闲</span>
                                        }
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
