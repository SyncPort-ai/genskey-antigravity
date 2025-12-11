import { useState } from 'react';
import { Users, TrendingUp, Calendar, AlertCircle, CheckCircle2, MapPin } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import clinicalPatientsData from '../data/clinical_patients.json';

export default function PatientRecruitment() {
    const trials = [
        { id: 'GNS-IBD-001', name: 'IBD益生菌疗法', target: 200, enrolled: 156, screening: 189, sites: 8 },
        { id: 'GNS-CDI-001', name: 'CDI粪菌替代', target: 100, enrolled: 87, screening: 102, sites: 5 },
        { id: 'GNS-T2D-002', name: '糖尿病调节', target: 150, enrolled: 45, screening: 67, sites: 6 }
    ];

    const sites = [
        { name: '北京协和医院', enrolled: 45, screening: 12, performance: 92 },
        { name: '上海瑞金医院', enrolled: 38, screening: 15, performance: 88 },
        { name: '广州中山医院', enrolled: 32, screening: 18, performance: 85 },
        { name: '成都华西医院', enrolled: 28, screening: 10, performance: 90 },
        { name: '杭州浙一医院', enrolled: 13, screening: 8, performance: 78 }
    ];

    // Screening funnel
    const funnelChart = {
        title: { text: '患者筛选漏斗 Screening Funnel', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'item', formatter: '{b}: {c}人 ({d}%)' },
        series: [{
            name: '筛选阶段',
            type: 'funnel',
            left: '10%',
            width: '80%',
            label: { formatter: '{b}: {c}人' },
            data: [
                { value: 450, name: '初筛登记 Prescreening' },
                { value: 358, name: '纳入标准筛查 Inclusion' },
                { value: 288, name: '签署知情同意 ICF Signed' },
                { value: 256, name: '基线检查完成 Baseline' },
                { value: 288, name: '随机入组 Randomized' }
            ],
            itemStyle: {
                color: (params) => {
                    const colors = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa'];
                    return colors[params.dataIndex];
                }
            }
        }]
    };

    // Enrollment trend
    const enrollmentTrend = {
        title: { text: '入组趋势 Enrollment Trend', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'axis' },
        legend: { data: ['GNS-IBD-001', 'GNS-CDI-001', 'GNS-T2D-002'] },
        xAxis: { type: 'category', data: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'] },
        yAxis: { type: 'value', name: '累计入组' },
        series: [
            {
                name: 'GNS-IBD-001',
                type: 'line',
                data: [15, 38, 67, 98, 128, 156],
                smooth: true,
                itemStyle: { color: '#0ea5e9' }
            },
            {
                name: 'GNS-CDI-001',
                type: 'line',
                data: [12, 28, 45, 61, 75, 87],
                smooth: true,
                itemStyle: { color: '#10b981' }
            },
            {
                name: 'GNS-T2D-002',
                type: 'line',
                data: [5, 12, 18, 28, 36, 45],
                smooth: true,
                itemStyle: { color: '#f59e0b' }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <div className="mb-dense-6">
                <h1 className="text-3xl font-bold text-brand-800 mb-dense-2">
                    患者招募 <span className="text-lg font-normal text-gray-600">Patient Recruitment</span>
                </h1>
                <p className="text-gray-600">临床试验受试者筛选与入组管理 | Subject Screening & Enrollment</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-dense-4 mb-dense-6">
                <div className="card bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                    <Users size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{trials.reduce((sum, t) => sum + t.enrolled, 0)}</div>
                    <div className="text-sm opacity-90">已入组患者</div>
                </div>

                <div className="card bg-gradient-to-br from-scientific-pass to-green-600 text-white">
                    <TrendingUp size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">
                        {Math.round((trials.reduce((sum, t) => sum + t.enrolled, 0) / trials.reduce((sum, t) => sum + t.target, 0)) * 100)}%
                    </div>
                    <div className="text-sm opacity-90">整体完成率</div>
                </div>

                <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                    <Calendar size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{trials.reduce((sum, t) => sum + t.screening, 0)}</div>
                    <div className="text-sm opacity-90">筛选中</div>
                </div>

                <div className="card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                    <MapPin size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{sites.length}</div>
                    <div className="text-sm opacity-90">研究中心</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-dense-6 mb-dense-6">
                <div className="card">
                    <ReactECharts option={funnelChart} style={{ height: '350px' }} />
                </div>
                <div className="card">
                    <ReactECharts option={enrollmentTrend} style={{ height: '350px' }} />
                </div>
            </div>

            {/* Trial Cards */}
            <div className="mb-dense-6">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">试验入组进度 Trial Enrollment Progress</h2>
                <div className="space-y-4">
                    {trials.map((trial) => {
                        const progress = Math.round((trial.enrolled / trial.target) * 100);
                        const isOnTrack = progress >= 60;

                        return (
                            <div key={trial.id} className="card">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-brand-800">{trial.name}</h3>
                                            {isOnTrack ?
                                                <CheckCircle2 size={20} className="text-scientific-pass" /> :
                                                <AlertCircle size={20} className="text-scientific-warning" />
                                            }
                                        </div>
                                        <p className="text-sm text-gray-600">{trial.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-brand-600">{progress}%</div>
                                        <div className="text-sm text-gray-500">完成度</div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                                        <span>入组进度</span>
                                        <span>{trial.enrolled} / {trial.target} 人</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className={`h-3 rounded-full ${isOnTrack ? 'bg-scientific-pass' : 'bg-scientific-warning'}`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">筛选中:</span>
                                        <span className="ml-2 font-semibold">{trial.screening}人</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">研究中心:</span>
                                        <span className="ml-2 font-semibold">{trial.sites}家</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">平均入组:</span>
                                        <span className="ml-2 font-semibold">{Math.round(trial.enrolled / trial.sites)}人/中心</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Site Performance */}
            <div className="card">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">研究中心绩效 Site Performance</h2>
                <div className="overflow-x-auto">
                    <table className="table-dense">
                        <thead>
                            <tr>
                                <th>研究中心</th>
                                <th>已入组</th>
                                <th>筛选中</th>
                                <th>入组率</th>
                                <th>绩效评分</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sites.map((site) => (
                                <tr key={site.name} className="hover:bg-gray-50">
                                    <td className="font-semibold">{site.name}</td>
                                    <td className="text-right">{site.enrolled}</td>
                                    <td className="text-right">{site.screening}</td>
                                    <td className="text-right">
                                        {Math.round((site.enrolled / (site.enrolled + site.screening)) * 100)}%
                                    </td>
                                    <td className="text-right">
                                        <span className={`font-semibold ${site.performance >= 90 ? 'text-scientific-pass' :
                                                site.performance >= 80 ? 'text-scientific-warning' : 'text-scientific-fail'
                                            }`}>
                                            {site.performance}分
                                        </span>
                                    </td>
                                    <td>
                                        {site.performance >= 85 ?
                                            <span className="badge badge-pass">优秀</span> :
                                            <span className="badge badge-warning">需改进</span>
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
