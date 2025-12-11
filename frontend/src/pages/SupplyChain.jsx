import { useState } from 'react';
import { Package, TruckIcon, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

export default function SupplyChain() {
    const inventory = [
        { material: '海藻酸钠', supplier: '青岛明月', stock: 450, unit: 'kg', reorderPoint: 200, leadTime: 15, lastOrder: '2025-11-28', status: 'sufficient' },
        { material: '壳聚糖', supplier: '金壳生物', stock: 180, unit: 'kg', reorderPoint: 150, leadTime: 20, lastOrder: '2025-12-01', status: 'low' },
        { material: '蔗糖', supplier: '中粮糖业', stock: 2500, unit: 'kg', reorderPoint: 1000, leadTime: 7, lastOrder: '2025-12-05', status: 'sufficient' },
        { material: 'HPMC肠溶衣', supplier: '信义肠衣', stock: 85, unit: 'kg', reorderPoint: 100, leadTime: 30, lastOrder: '2025-10-15', status: 'critical' },
        { material: '培养基粉', supplier: 'Oxoid', stock: 320, unit: 'kg', reorderPoint: 150, leadTime: 45, lastOrder: '2025-11-10', status: 'sufficient' }
    ];

    const suppliers = [
        { name: '青岛明月', category: '辅料', reliability: 0.98, onTimeDelivery: 0.96, qualityScore: 95 },
        { name: '金壳生物', category: '辅料', reliability: 0.92, onTimeDelivery: 0.89, qualityScore: 88 },
        { name: 'Oxoid', category: '培养基', reliability: 0.99, onTimeDelivery: 0.94, qualityScore: 98 },
        { name: '中粮糖业', category: '原料', reliability: 0.97, onTimeDelivery: 0.98, qualityScore: 92 }
    ];

    // Inventory levels chart
    const inventoryChart = {
        title: { text: '库存水平 Inventory Levels', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { data: ['当前库存', '安全库存线'] },
        xAxis: {
            type: 'category',
            data: inventory.map(i => i.material),
            axisLabel: { rotate: 30 }
        },
        yAxis: { type: 'value', name: 'kg' },
        series: [
            {
                name: '当前库存',
                type: 'bar',
                data: inventory.map(i => ({
                    value: i.stock,
                    itemStyle: {
                        color: i.stock > i.reorderPoint ? '#10b981' :
                            i.stock > i.reorderPoint * 0.5 ? '#f59e0b' : '#ef4444'
                    }
                }))
            },
            {
                name: '安全库存线',
                type: 'line',
                data: inventory.map(i => i.reorderPoint),
                itemStyle: { color: '#0ea5e9' },
                lineStyle: { width: 2, type: 'dashed' }
            }
        ]
    };

    // Supplier performance radar
    const supplierRadar = {
        title: { text: '供应商绩效 Supplier Performance', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: {},
        legend: { bottom: 10 },
        radar: {
            indicator: [
                { name: '可靠性', max: 100 },
                { name: '准时交付', max: 100 },
                { name: '质量评分', max: 100 }
            ]
        },
        series: [{
            type: 'radar',
            data: suppliers.map((s, idx) => ({
                value: [s.reliability * 100, s.onTimeDelivery * 100, s.qualityScore],
                name: s.name,
                itemStyle: { color: ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6'][idx] }
            }))
        }]
    };

    const getStatusBadge = (status) => {
        const badges = {
            sufficient: <span className="badge badge-pass">充足</span>,
            low: <span className="badge bg-scientific-warning text-white">偏低</span>,
            critical: <span className="badge badge-fail">紧急</span>
        };
        return badges[status];
    };

    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <div className="mb-dense-6">
                <h1 className="text-3xl font-bold text-brand-800 mb-dense-2">
                    供应链管理 <span className="text-lg font-normal text-gray-600">Supply Chain</span>
                </h1>
                <p className="text-gray-600">原料库存与供应商管理 | Raw Material Inventory & Supplier Management</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-dense-4 mb-dense-6">
                <div className="card bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                    <Package size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{inventory.length}</div>
                    <div className="text-sm opacity-90">原料品种</div>
                </div>

                <div className="card bg-gradient-to-br from-scientific-pass to-green-600 text-white">
                    <CheckCircle2 size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{inventory.filter(i => i.status === 'sufficient').length}</div>
                    <div className="text-sm opacity-90">库存充足</div>
                </div>

                <div className="card bg-gradient-to-br from-scientific-fail to-red-600 text-white">
                    <AlertTriangle size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{inventory.filter(i => i.status === 'critical').length}</div>
                    <div className="text-sm opacity-90">紧急补货</div>
                </div>

                <div className="card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                    <TruckIcon size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{suppliers.length}</div>
                    <div className="text-sm opacity-90">合格供应商</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-dense-6 mb-dense-6">
                <div className="card">
                    <ReactECharts option={inventoryChart} style={{ height: '300px' }} />
                </div>
                <div className="card">
                    <ReactECharts option={supplierRadar} style={{ height: '300px' }} />
                </div>
            </div>

            {/* Inventory Table */}
            <div className="card mb-dense-6">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">库存清单 Inventory List</h2>
                <div className="overflow-x-auto">
                    <table className="table-dense">
                        <thead>
                            <tr>
                                <th>原料名称</th>
                                <th>供应商</th>
                                <th>当前库存</th>
                                <th>安全库存</th>
                                <th>交货期(天)</th>
                                <th>上次订货</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="font-semibold">{item.material}</td>
                                    <td>{item.supplier}</td>
                                    <td className="text-right">
                                        <span className={`font-semibold ${item.stock > item.reorderPoint ? 'text-scientific-pass' :
                                                item.stock > item.reorderPoint * 0.5 ? 'text-scientific-warning' : 'text-scientific-fail'
                                            }`}>
                                            {item.stock} {item.unit}
                                        </span>
                                    </td>
                                    <td className="text-right">{item.reorderPoint} {item.unit}</td>
                                    <td className="text-right">{item.leadTime}</td>
                                    <td>{new Date(item.lastOrder).toLocaleDateString('zh-CN')}</td>
                                    <td>{getStatusBadge(item.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Supplier Performance Table */}
            <div className="card">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">供应商绩效 Supplier Performance</h2>
                <div className="overflow-x-auto">
                    <table className="table-dense">
                        <thead>
                            <tr>
                                <th>供应商</th>
                                <th>类别</th>
                                <th>可靠性</th>
                                <th>准时交付率</th>
                                <th>质量评分</th>
                                <th>综合评级</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map((supplier, index) => {
                                const overall = (supplier.reliability + supplier.onTimeDelivery + supplier.qualityScore / 100) / 3;

                                return (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="font-semibold">{supplier.name}</td>
                                        <td>
                                            <span className="badge bg-brand-100 text-brand-700">{supplier.category}</span>
                                        </td>
                                        <td className="text-right">
                                            <span className="font-semibold text-scientific-pass">
                                                {(supplier.reliability * 100).toFixed(1)}%
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <span className={`font-semibold ${supplier.onTimeDelivery >= 0.95 ? 'text-scientific-pass' :
                                                    supplier.onTimeDelivery >= 0.9 ? 'text-scientific-warning' : 'text-scientific-fail'
                                                }`}>
                                                {(supplier.onTimeDelivery * 100).toFixed(1)}%
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <span className="font-semibold">{supplier.qualityScore}</span>
                                        </td>
                                        <td>
                                            {overall >= 0.95 ?
                                                <span className="badge badge-pass">优秀</span> :
                                                overall >= 0.9 ?
                                                    <span className="badge badge-warning">良好</span> :
                                                    <span className="badge bg-gray-500 text-white">合格</span>
                                            }
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-orange-800">
                        <Clock size={16} />
                        <span>待处理采购订单: HPMC肠溶衣 - 需在7天内下单 (交货期30天)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
