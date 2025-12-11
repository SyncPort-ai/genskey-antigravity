import { useState } from 'react';
import { Wrench, CheckCircle2, AlertCircle, Calendar, Clock } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

export default function EquipmentManager() {
    const equipment = [
        { id: 'FRM-F1-500L', name: '发酵罐F1', type: '发酵设备', status: 'operational', lastCalibration: '2025-11-15', nextCalibration: '2026-02-15', utilization: 85 },
        { id: 'FRM-F2-500L', name: '发酵罐F2', type: '发酵设备', status: 'operational', lastCalibration: '2025-10-20', nextCalibration: '2026-01-20', utilization: 0 },
        { id: 'FRM-F3-200L', name: '发酵罐F3', type: '发酵设备', status: 'maintenance', lastCalibration: '2025-09-10', nextCalibration: '2025-12-10', utilization: 0 },
        { id: 'ANA-HPLC-01', name: 'HPLC分析仪', type: '分析设备', status: 'operational', lastCalibration: '2025-11-28', nextCalibration: '2026-02-28', utilization: 62 },
        { id: 'ANA-LCMS-02', name: 'LC-MS质谱仪', type: '分析设备', status: 'operational', lastCalibration: '2025-12-01', nextCalibration: '2026-03-01', utilization: 78 },
        { id: 'FRZ-80C-A03', name: '超低温冰箱A03', type: '存储设备', status: 'operational', lastCalibration: '2025-11-10', nextCalibration: '2026-02-10', utilization: 92 },
        { id: 'FRZ-20C-B05', name: '冷冻库B05', type: '存储设备', status: 'operational', lastCalibration: '2025-10-15', nextCalibration: '2026-01-15', utilization: 75 },
        { id: 'SEQ-NGS-01', name: 'NGS测序仪', type: '测序设备', status: 'calibration-due', lastCalibration: '2025-09-05', nextCalibration: '2025-12-05', utilization: 45 }
    ];

    const maintenanceSchedule = [
        { equipment: 'FRM-F3-200L', type: '年度维护', scheduled: '2025-12-12', status: 'scheduled' },
        { equipment: 'SEQ-NGS-01', type: '校准验证', scheduled: '2025-12-15', status: 'overdue' },
        { equipment: 'ANA-HPLC-01', type: '季度保养', scheduled: '2026-01-08', status: 'scheduled' }
    ];

    // Utilization chart
    const utilizationChart = {
        title: { text: '设备利用率 Equipment Utilization (%)', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            data: equipment.map(e => e.name),
            axisLabel: { rotate: 30 }
        },
        yAxis: { type: 'value', max: 100 },
        series: [{
            name: '利用率',
            type: 'bar',
            data: equipment.map(e => ({
                value: e.utilization,
                itemStyle: {
                    color: e.utilization >= 80 ? '#10b981' : e.utilization >= 50 ? '#f59e0b' : '#6b7280'
                }
            }))
        }]
    };

    // Calibration timeline
    const calibrationTimeline = {
        title: { text: '校准时间线 Calibration Timeline', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { formatter: '{b}: {c}天' },
        xAxis: {
            type: 'category',
            data: equipment.filter(e => e.status !== 'maintenance').map(e => e.name),
            axisLabel: { rotate: 30 }
        },
        yAxis: { type: 'value', name: '距下次校准(天)' },
        series: [{
            name: '剩余天数',
            type: 'bar',
            data: equipment.filter(e => e.status !== 'maintenance').map(e => {
                const daysUntil = Math.floor((new Date(e.nextCalibration) - new Date()) / (1000 * 60 * 60 * 24));
                return {
                    value: daysUntil,
                    itemStyle: {
                        color: daysUntil < 7 ? '#ef4444' : daysUntil < 30 ? '#f59e0b' : '#10b981'
                    }
                };
            })
        }]
    };

    const getStatusBadge = (status) => {
        const badges = {
            operational: <span className="badge badge-pass">运行中</span>,
            maintenance: <span className="badge bg-scientific-warning text-white">维护中</span>,
            'calibration-due': <span className="badge badge-fail">待校准</span>,
            offline: <span className="badge bg-gray-500 text-white">离线</span>
        };
        return badges[status];
    };

    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <div className="mb-dense-6">
                <h1 className="text-3xl font-bold text-brand-800 mb-dense-2">
                    设备管理 <span className="text-lg font-normal text-gray-600">Equipment Manager</span>
                </h1>
                <p className="text-gray-600">设备校准与维护管理 | Equipment Calibration & Maintenance</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-dense-4 mb-dense-6">
                <div className="card bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                    <Wrench size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{equipment.length}</div>
                    <div className="text-sm opacity-90">设备总数</div>
                </div>

                <div className="card bg-gradient-to-br from-scientific-pass to-green-600 text-white">
                    <CheckCircle2 size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{equipment.filter(e => e.status === 'operational').length}</div>
                    <div className="text-sm opacity-90">正常运行</div>
                </div>

                <div className="card bg-gradient-to-br from-scientific-fail to-red-600 text-white">
                    <AlertCircle size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{equipment.filter(e => e.status === 'calibration-due').length}</div>
                    <div className="text-sm opacity-90">待校准</div>
                </div>

                <div className="card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                    <Calendar size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{maintenanceSchedule.length}</div>
                    <div className="text-sm opacity-90">计划维护</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-dense-6 mb-dense-6">
                <div className="card">
                    <ReactECharts option={utilizationChart} style={{ height: '300px' }} />
                </div>
                <div className="card">
                    <ReactECharts option={calibrationTimeline} style={{ height: '300px' }} />
                </div>
            </div>

            {/* Equipment Table */}
            <div className="card mb-dense-6">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">设备清单 Equipment Inventory</h2>
                <div className="overflow-x-auto">
                    <table className="table-dense">
                        <thead>
                            <tr>
                                <th>设备ID</th>
                                <th>设备名称</th>
                                <th>类型</th>
                                <th>状态</th>
                                <th>上次校准</th>
                                <th>下次校准</th>
                                <th>利用率</th>
                            </tr>
                        </thead>
                        <tbody>
                            {equipment.map((item) => {
                                const daysUntilCalibration = Math.floor(
                                    (new Date(item.nextCalibration) - new Date()) / (1000 * 60 * 60 * 24)
                                );

                                return (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="font-mono font-semibold text-brand-600">{item.id}</td>
                                        <td className="font-semibold">{item.name}</td>
                                        <td>
                                            <span className="badge bg-brand-100 text-brand-700">{item.type}</span>
                                        </td>
                                        <td>{getStatusBadge(item.status)}</td>
                                        <td>{new Date(item.lastCalibration).toLocaleDateString('zh-CN')}</td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <span>{new Date(item.nextCalibration).toLocaleDateString('zh-CN')}</span>
                                                {daysUntilCalibration < 7 && (
                                                    <AlertCircle size={16} className="text-scientific-fail" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <span className={`font-semibold ${item.utilization >= 80 ? 'text-scientific-pass' :
                                                    item.utilization >= 50 ? 'text-scientific-warning' : 'text-gray-600'
                                                }`}>
                                                {item.utilization}%
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Maintenance Schedule */}
            <div className="card">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">维护计划 Maintenance Schedule</h2>
                <div className="space-y-3">
                    {maintenanceSchedule.map((schedule, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Clock size={20} className={schedule.status === 'overdue' ? 'text-scientific-fail' : 'text-brand-600'} />
                                    <div>
                                        <div className="font-semibold">{schedule.equipment}</div>
                                        <div className="text-sm text-gray-600">{schedule.type}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-semibold">{schedule.scheduled}</div>
                                    {schedule.status === 'overdue' ? (
                                        <span className="badge badge-fail">逾期</span>
                                    ) : (
                                        <span className="badge bg-brand-500 text-white">已计划</span>
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
