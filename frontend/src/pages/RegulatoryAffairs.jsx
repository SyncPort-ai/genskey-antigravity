import { useState } from 'react';
import { FileText, Send, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

export default function RegulatoryAffairs() {
    const submissions = [
        { id: 'IND-2024-001', type: 'IND', authority: 'NMPA', product: 'GNS-IBD-001', status: 'approved', submittedDate: '2024-08-15', responseDate: '2024-10-20', daysToReview: 66 },
        { id: 'IND-2024-002', type: 'IND', authority: 'FDA', product: 'GNS-CDI-001', status: 'under-review', submittedDate: '2024-11-01', responseDate: null, daysToReview: 40 },
        { id: 'CTA-2025-001', type: 'CTA', authority: 'NMPA', product: 'GNS-T2D-002', status: 'submitted', submittedDate: '2025-12-05', responseDate: null, daysToReview: 6 },
        { id: 'IMPD-2024-003', type: 'IMPD', authority: 'EMA', product: 'GNS-IBD-001', status: 'questions-pending', submittedDate: '2024-09-10', responseDate: null, daysToReview: 92 }
    ];

    const communications = [
        { date: '2025-12-10', authority: 'NMPA', type: '预沟通会议', topic: 'GNS-T2D-002临床试验设计', status: 'scheduled' },
        { date: '2025-11-28', authority: 'FDA', type: '信息请求', topic: 'GNS-CDI-001 CMC问题', status: 'responded' },
        { date: '2025-11-15', authority: 'NMPA', type: '补充资料', topic: 'GNS-IBD-001稳定性数据', status: 'submitted' }
    ];

    // Submission timeline chart
    const timelineChart = {
        title: { text: '申报时间线 Submission Timeline', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { data: ['NMPA', 'FDA', 'EMA'] },
        xAxis: {
            type: 'category',
            data: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025']
        },
        yAxis: { type: 'value', name: '申报数量' },
        series: [
            {
                name: 'NMPA',
                type: 'bar',
                stack: 'total',
                data: [0, 1, 1, 0, 1],
                itemStyle: { color: '#0ea5e9' }
            },
            {
                name: 'FDA',
                type: 'bar',
                stack: 'total',
                data: [0, 0, 1, 1, 0],
                itemStyle: { color: '#10b981' }
            },
            {
                name: 'EMA',
                type: 'bar',
                stack: 'total',
                data: [0, 0, 0, 1, 0],
                itemStyle: { color: '#f59e0b' }
            }
        ]
    };

    // Review time comparison
    const reviewTimeChart = {
        title: { text: '审评时间对比 Review Time Comparison (Days)', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            data: submissions.filter(s => s.status === 'approved').map(s => s.id)
        },
        yAxis: { type: 'value', name: '天数' },
        series: [{
            name: '审评天数',
            type: 'bar',
            data: submissions.filter(s => s.status === 'approved').map(s => ({
                value: s.daysToReview,
                itemStyle: {
                    color: s.daysToReview <= 60 ? '#10b981' : s.daysToReview <= 90 ? '#f59e0b' : '#ef4444'
                }
            })),
            label: {
                show: true,
                position: 'top',
                formatter: '{c} 天'
            }
        }]
    };

    const getStatusBadge = (status) => {
        const badges = {
            approved: <span className="badge badge-pass">已批准</span>,
            'under-review': <span className="badge bg-brand-500 text-white">审评中</span>,
            submitted: <span className="badge bg-purple-500 text-white">已提交</span>,
            'questions-pending': <span className="badge bg-scientific-warning text-white">问题待答复</span>
        };
        return badges[status];
    };

    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <div className="mb-dense-6">
                <h1 className="text-3xl font-bold text-brand-800 mb-dense-2">
                    法规事务 <span className="text-lg font-normal text-gray-600">Regulatory Affairs</span>
                </h1>
                <p className="text-gray-600">NMPA/FDA/EMA申报与沟通管理 | Regulatory Submissions & Communications</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-dense-4 mb-dense-6">
                <div className="card bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                    <FileText size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{submissions.length}</div>
                    <div className="text-sm opacity-90">总申报数</div>
                </div>

                <div className="card bg-gradient-to-br from-scientific-pass to-green-600 text-white">
                    <CheckCircle2 size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{submissions.filter(s => s.status === 'approved').length}</div>
                    <div className="text-sm opacity-90">已批准</div>
                </div>

                <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                    <Clock size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{submissions.filter(s => s.status === 'under-review' || s.status === 'submitted').length}</div>
                    <div className="text-sm opacity-90">审评中</div>
                </div>

                <div className="card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                    <Send size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{communications.length}</div>
                    <div className="text-sm opacity-90">沟通记录</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-dense-6 mb-dense-6">
                <div className="card">
                    <ReactECharts option={timelineChart} style={{ height: '300px' }} />
                </div>
                <div className="card">
                    <ReactECharts option={reviewTimeChart} style={{ height: '300px' }} />
                </div>
            </div>

            {/* Submissions Table */}
            <div className="card mb-dense-6">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">申报记录 Submission Records</h2>
                <div className="overflow-x-auto">
                    <table className="table-dense">
                        <thead>
                            <tr>
                                <th>申报编号</th>
                                <th>类型</th>
                                <th>监管机构</th>
                                <th>产品</th>
                                <th>提交日期</th>
                                <th>审评天数</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map((sub) => (
                                <tr key={sub.id} className="hover:bg-gray-50">
                                    <td className="font-mono font-semibold text-brand-600">{sub.id}</td>
                                    <td>
                                        <span className="badge bg-brand-100 text-brand-700">{sub.type}</span>
                                    </td>
                                    <td>
                                        <span className={`badge ${sub.authority === 'NMPA' ? 'bg-brand-500 text-white' :
                                                sub.authority === 'FDA' ? 'bg-scientific-pass text-white' :
                                                    'bg-scientific-warning text-white'
                                            }`}>
                                            {sub.authority}
                                        </span>
                                    </td>
                                    <td className="font-mono text-sm">{sub.product}</td>
                                    <td>{new Date(sub.submittedDate).toLocaleDateString('zh-CN')}</td>
                                    <td className="text-right">
                                        <span className={`font-semibold ${sub.daysToReview <= 60 ? 'text-scientific-pass' :
                                                sub.daysToReview <= 90 ? 'text-scientific-warning' : 'text-scientific-fail'
                                            }`}>
                                            {sub.daysToReview} 天
                                        </span>
                                    </td>
                                    <td>{getStatusBadge(sub.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Communications Log */}
            <div className="card">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">沟通记录 Communications Log</h2>
                <div className="space-y-3">
                    {communications.map((comm, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <span className={`badge ${comm.authority === 'NMPA' ? 'bg-brand-500 text-white' :
                                            comm.authority === 'FDA' ? 'bg-scientific-pass text-white' :
                                                'bg-scientific-warning text-white'
                                        }`}>
                                        {comm.authority}
                                    </span>
                                    <span className="font-semibold">{comm.type}</span>
                                </div>
                                <span className="text-sm text-gray-600">{comm.date}</span>
                            </div>
                            <div className="text-sm text-gray-700 mb-2">{comm.topic}</div>
                            <div>
                                {comm.status === 'scheduled' && <span className="badge bg-purple-500 text-white">已安排</span>}
                                {comm.status === 'responded' && <span className="badge badge-pass">已答复</span>}
                                {comm.status === 'submitted' && <span className="badge bg-brand-500 text-white">已提交</span>}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 p-4 bg-brand-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-brand-800">
                        <AlertCircle size={16} />
                        <span>即将到期: GNS-CDI-001 FDA IND审评进入Day 60，预计12月25日收到反馈</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
