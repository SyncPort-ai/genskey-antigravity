import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, PieChart, BarChart3 } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

export default function FinancialDashboard() {
    const financials = {
        totalBudget: 50000000,
        ytdSpending: 28500000,
        q4Spending: 8200000,
        burnRate: 2350000,
        cashRunway: 9 // months
    };

    const projectSpending = [
        { project: 'GNS-IBD-001', budget: 15000000, spent: 10500000, category: 'Clinical' },
        { project: 'GNS-CDI-001', budget: 8000000, spent: 6800000, category: 'Clinical' },
        { project: 'GNS-T2D-002', budget: 5000000, spent: 2250000, category: 'Preclinical' },
        { project: 'Platform Tech', budget: 12000000, spent: 5950000, category: 'R&D' },
        { project: 'Manufacturing', budget: 10000000, spent: 3000000, category: 'Production' }
    ];

    // Monthly spending trend
    const spendingTrend = {
        title: { text: '月度支出趋势 Monthly Spending Trend (¥M)', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'axis', formatter: (params) => `${params[0].name}: ¥${params[0].value}M` },
        xAxis: {
            type: 'category',
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: { type: 'value', name: '¥M' },
        series: [{
            name: 'R&D支出',
            type: 'line',
            data: [1.8, 2.1, 2.5, 2.3, 2.8, 3.2, 2.9, 3.1, 2.7, 2.4, 2.2, 2.0],
            smooth: true,
            areaStyle: { color: 'rgba(14, 165, 233, 0.2)' },
            itemStyle: { color: '#0ea5e9' },
            lineStyle: { width: 3 }
        }]
    };

    // Category breakdown pie
    const categoryBreakdown = {
        title: { text: '支出分类 Spending by Category', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'item', formatter: '{b}: ¥{c}M ({d}%)' },
        legend: { bottom: 10 },
        series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            data: [
                { value: 17.3, name: '临床试验 Clinical', itemStyle: { color: '#0ea5e9' } },
                { value: 5.95, name: '研发 R&D', itemStyle: { color: '#10b981' } },
                { value: 3.0, name: '生产 Manufacturing', itemStyle: { color: '#f59e0b' } },
                { value: 1.5, name: '法规 Regulatory', itemStyle: { color: '#8b5cf6' } },
                { value: 0.75, name: '运营 Operations', itemStyle: { color: '#6b7280' } }
            ]
        }]
    };

    // Project ROI projection
    const roiProjection = {
        title: { text: '项目ROI预测 Project ROI Projection', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            data: projectSpending.map(p => p.project)
        },
        yAxis: { type: 'value', name: 'ROI倍数' },
        series: [{
            name: 'Projected ROI',
            type: 'bar',
            data: [3.2, 2.8, 5.1, 1.9, 1.5],
            itemStyle: {
                color: (params) => {
                    return params.value >= 3 ? '#10b981' : params.value >= 2 ? '#f59e0b' : '#ef4444';
                }
            }
        }]
    };

    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <div className="mb-dense-6">
                <h1 className="text-3xl font-bold text-brand-800 mb-dense-2">
                    财务仪表板 <span className="text-lg font-normal text-gray-600">Financial Dashboard</span>
                </h1>
                <p className="text-gray-600">研发支出分析与预算监控 | R&D Spending Analysis</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-dense-4 mb-dense-6">
                <div className="card bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                    <DollarSign size={28} className="mb-2 opacity-80" />
                    <div className="text-xl font-bold">¥{(financials.totalBudget / 1000000).toFixed(0)}M</div>
                    <div className="text-xs opacity-90">总预算</div>
                </div>

                <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                    <BarChart3 size={28} className="mb-2 opacity-80" />
                    <div className="text-xl font-bold">¥{(financials.ytdSpending / 1000000).toFixed(1)}M</div>
                    <div className="text-xs opacity-90">YTD支出</div>
                </div>

                <div className="card bg-gradient-to-br from-scientific-warning to-orange-600 text-white">
                    <TrendingDown size={28} className="mb-2 opacity-80" />
                    <div className="text-xl font-bold">¥{(financials.burnRate / 1000000).toFixed(2)}M</div>
                    <div className="text-xs opacity-90">月消耗率</div>
                </div>

                <div className="card bg-gradient-to-br from-scientific-pass to-green-600 text-white">
                    <TrendingUp size={28} className="mb-2 opacity-80" />
                    <div className="text-xl font-bold">{Math.round((financials.ytdSpending / financials.totalBudget) * 100)}%</div>
                    <div className="text-xs opacity-90">预算使用率</div>
                </div>

                <div className="card bg-gradient-to-br from-scientific-fail to-red-600 text-white">
                    <PieChart size={28} className="mb-2 opacity-80" />
                    <div className="text-xl font-bold">{financials.cashRunway}个月</div>
                    <div className="text-xs opacity-90">资金跑道</div>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-dense-6 mb-dense-6">
                <div className="card">
                    <ReactECharts option={spendingTrend} style={{ height: '300px' }} />
                </div>
                <div className="card">
                    <ReactECharts option={categoryBreakdown} style={{ height: '300px' }} />
                </div>
            </div>

            {/* Project Spending Table */}
            <div className="card mb-dense-6">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">项目支出明细 Project Spending Details</h2>
                <div className="overflow-x-auto">
                    <table className="table-dense">
                        <thead>
                            <tr>
                                <th>项目</th>
                                <th>类别</th>
                                <th>预算</th>
                                <th>已支出</th>
                                <th>余额</th>
                                <th>使用率</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projectSpending.map((project) => {
                                const utilization = (project.spent / project.budget) * 100;
                                const remaining = project.budget - project.spent;

                                return (
                                    <tr key={project.project} className="hover:bg-gray-50">
                                        <td className="font-semibold">{project.project}</td>
                                        <td>
                                            <span className="badge bg-brand-100 text-brand-700">{project.category}</span>
                                        </td>
                                        <td className="text-right">¥{(project.budget / 1000000).toFixed(1)}M</td>
                                        <td className="text-right">¥{(project.spent / 1000000).toFixed(1)}M</td>
                                        <td className="text-right">¥{(remaining / 1000000).toFixed(1)}M</td>
                                        <td className="text-right">
                                            <span className={`font-semibold ${utilization >= 90 ? 'text-scientific-fail' :
                                                    utilization >= 70 ? 'text-scientific-warning' : 'text-scientific-pass'
                                                }`}>
                                                {utilization.toFixed(1)}%
                                            </span>
                                        </td>
                                        <td>
                                            {utilization < 80 ?
                                                <span className="badge badge-pass">正常</span> :
                                                utilization < 95 ?
                                                    <span className="badge badge-warning">接近上限</span> :
                                                    <span className="badge badge-fail">超支风险</span>
                                            }
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ROI Projection */}
            <div className="card">
                <ReactECharts option={roiProjection} style={{ height: '300px' }} />
                <div className="mt-4 p-4 bg-brand-50 rounded-lg">
                    <h3 className="font-semibold text-brand-800 mb-2">投资回报分析 ROI Analysis</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="text-gray-600">预期平均ROI:</span>
                            <span className="ml-2 font-semibold text-scientific-pass">2.9x</span>
                        </div>
                        <div>
                            <span className="text-gray-600">IRR:</span>
                            <span className="ml-2 font-semibold">35%</span>
                        </div>
                        <div>
                            <span className="text-gray-600">NPV:</span>
                            <span className="ml-2 font-semibold">¥45M</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
