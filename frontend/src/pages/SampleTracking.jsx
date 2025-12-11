import { useState } from 'react';
import { Package, MapPin, Search, Filter, Download, TrendingUp, AlertCircle } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

export default function SampleTracking() {
    const [samples, setSamples] = useState([
        { id: 'SMP-2025-0445', type: '粪便样本', patient: 'PT0042', trial: 'GNS-IBD-001', location: '冷冻库A-03-12', temp: -80, collected: '2025-12-08', status: 'stored' },
        { id: 'SMP-2025-0446', type: '血清样本', patient: 'PT0158', trial: 'GNS-IBD-001', location: '冷冻库B-05-08', temp: -20, collected: '2025-12-09', status: 'stored' },
        { id: 'SMP-2025-0447', type: '粪便样本', patient: 'PT0203', trial: 'GNS-CDI-001', location: '处理区', temp: 4, collected: '2025-12-11', status: 'processing' },
        { id: 'SMP-2025-0448', type: '唾液样本', patient: 'PT0091', trial: 'GNS-T2D-002', location: '冷冻库A-02-15', temp: -80, collected: '2025-12-10', status: 'stored' },
        { id: 'SMP-2025-0449', type: '粪便样本', patient: 'PT0127', trial: 'GNS-IBD-001', location: '送检中', temp: null, collected: '2025-12-11', status: 'in-transit' }
    ]);

    const storageStats = {
        totalSamples: 1247,
        freezer80: 856,
        freezer20: 278,
        refrigerator: 45,
        processing: 68
    };

    // Sample type distribution
    const typeDistribution = {
        title: { text: '样本类型分布', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'item' },
        legend: { bottom: 10 },
        series: [{
            type: 'pie',
            radius: '70%',
            data: [
                { value: 745, name: '粪便样本 Stool', itemStyle: { color: '#0ea5e9' } },
                { value: 312, name: '血清样本 Serum', itemStyle: { color: '#10b981' } },
                { value: 128, name: '唾液样本 Saliva', itemStyle: { color: '#f59e0b' } },
                { value: 62, name: '其他 Others', itemStyle: { color: '#8b5cf6' } }
            ]
        }]
    };

    // Storage trend
    const storageTrend = {
        title: { text: '月度入库趋势', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'] },
        yAxis: { type: 'value', name: '样本数' },
        series: [{
            name: '新入库',
            type: 'bar',
            data: [142, 168, 195, 223, 198, 185],
            itemStyle: { color: '#0ea5e9' }
        }]
    };

    const getStatusBadge = (status) => {
        const badges = {
            stored: <span className="badge badge-pass">已入库</span>,
            processing: <span className="badge bg-brand-500 text-white">处理中</span>,
            'in-transit': <span className="badge bg-scientific-warning text-white">运输中</span>,
            depleted: <span className="badge bg-gray-500 text-white">已用完</span>
        };
        return badges[status];
    };

    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <div className="mb-dense-6">
                <h1 className="text-3xl font-bold text-brand-800 mb-dense-2">
                    样品追踪 <span className="text-lg font-normal text-gray-600">Sample Tracking</span>
                </h1>
                <p className="text-gray-600">生物样本库存与位置管理 | Biospecimen Inventory Management</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-dense-4 mb-dense-6">
                <div className="card bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                    <Package size={28} className="mb-2 opacity-80" />
                    <div className="text-xl font-bold">{storageStats.totalSamples}</div>
                    <div className="text-xs opacity-90">总样本数</div>
                </div>

                <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                    <div className="text-sm mb-1 opacity-90">-80°C</div>
                    <div className="text-xl font-bold">{storageStats.freezer80}</div>
                    <div className="text-xs opacity-90">超低温冷冻</div>
                </div>

                <div className="card bg-gradient-to-br from-scientific-pass to-green-600 text-white">
                    <div className="text-sm mb-1 opacity-90">-20°C</div>
                    <div className="text-xl font-bold">{storageStats.freezer20}</div>
                    <div className="text-xs opacity-90">普通冷冻</div>
                </div>

                <div className="card bg-gradient-to-br from-scientific-warning to-orange-600 text-white">
                    <div className="text-sm mb-1 opacity-90">4°C</div>
                    <div className="text-xl font-bold">{storageStats.refrigerator}</div>
                    <div className="text-xs opacity-90">冷藏</div>
                </div>

                <div className="card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                    <TrendingUp size={28} className="mb-2 opacity-80" />
                    <div className="text-xl font-bold">{storageStats.processing}</div>
                    <div className="text-xs opacity-90">处理中</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-dense-6 mb-dense-6">
                <div className="card">
                    <ReactECharts option={typeDistribution} style={{ height: '300px' }} />
                </div>
                <div className="card">
                    <ReactECharts option={storageTrend} style={{ height: '300px' }} />
                </div>
            </div>

            {/* Search & Filter */}
            <div className="card mb-dense-6">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="搜索样本ID、患者ID或试验编号..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                        />
                    </div>
                    <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <Filter size={20} />
                        筛选
                    </button>
                    <button className="btn-primary">
                        <Download size={20} />
                        导出
                    </button>
                </div>
            </div>

            {/* Sample Table */}
            <div className="card">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">样本清单 Sample Inventory</h2>
                <div className="overflow-x-auto">
                    <table className="table-dense">
                        <thead>
                            <tr>
                                <th>样本ID</th>
                                <th>类型</th>
                                <th>患者</th>
                                <th>试验</th>
                                <th>存储位置</th>
                                <th>温度</th>
                                <th>采集日期</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            {samples.map((sample) => (
                                <tr key={sample.id} className="hover:bg-gray-50">
                                    <td className="font-mono font-semibold text-brand-600">{sample.id}</td>
                                    <td>
                                        <span className="badge bg-brand-100 text-brand-700">{sample.type}</span>
                                    </td>
                                    <td className="font-mono text-sm">{sample.patient}</td>
                                    <td className="font-mono text-sm">{sample.trial}</td>
                                    <td>
                                        <div className="flex items-center gap-1">
                                            <MapPin size={14} className="text-gray-400" />
                                            <span className="text-sm">{sample.location}</span>
                                        </div>
                                    </td>
                                    <td className="text-right">
                                        {sample.temp !== null ? (
                                            <span className={`font-semibold ${sample.temp <= -80 ? 'text-purple-600' :
                                                    sample.temp <= -20 ? 'text-brand-600' : 'text-scientific-warning'
                                                }`}>
                                                {sample.temp}°C
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td>{new Date(sample.collected).toLocaleDateString('zh-CN')}</td>
                                    <td>{getStatusBadge(sample.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 p-4 bg-brand-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-brand-800">
                        <AlertCircle size={16} />
                        <span>温度监控: 所有冷冻库温度正常 | 上次检查: 2小时前</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
