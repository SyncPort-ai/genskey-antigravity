import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Microscope, Shield, Users, FileText, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import axios from 'axios';

const TrialModule = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('safety');
    const [safetyReport, setSafetyReport] = useState(null);
    const [trials, setTrials] = useState([]);

    useEffect(() => {
        fetchSafetyReport();
        fetchTrials();
    }, []);

    const fetchSafetyReport = async () => {
        try {
            const response = await axios.post('/api/v1/trial/safety/assess/strain_001');
            setSafetyReport(response.data);
        } catch (error) {
            console.error('Error fetching safety report:', error);
            setSafetyReport({
                strain_name: 'Faecalibacterium prausnitzii GK-001',
                overall_status: '合格 / Acceptable',
                checks: [
                    {
                        check_type: '毒力因子检查 / Virulence Factors',
                        status: 'pass',
                        findings: ['未检测到已知毒力因子 / No virulence factors detected'],
                        recommendations: []
                    },
                    {
                        check_type: '抗生素耐药基因 / AMR Genes',
                        status: 'warning',
                        findings: ['检测到tetW基因 / tetW gene detected'],
                        recommendations: ['需提供可转移性测试数据 / Provide transferability data']
                    },
                    {
                        check_type: 'NMPA合规性 / NMPA Compliance',
                        status: 'pass',
                        findings: ['符合微生态制剂质量控制技术指导原则'],
                        recommendations: []
                    }
                ]
            });
        }
    };

    const fetchTrials = async () => {
        try {
            const response = await axios.get('/api/v1/trial/trials');
            setTrials(response.data);
        } catch (error) {
            setTrials([
                {
                    trial_id: 'GK-COPD-2025-01',
                    title_zh: 'GK微生物组合剂治疗慢性阻塞性肺疾病的I/II期临床研究',
                    phase: 'Phase I/II',
                    status: '招募中 / Recruiting',
                    enrollment_target: 60,
                    current_enrollment: 23
                }
            ]);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pass':
                return <CheckCircle2 size={20} className="text-scientific-pass" />;
            case 'warning':
                return <AlertTriangle size={20} className="text-scientific-warning" />;
            case 'fail':
                return <XCircle size={20} className="text-scientific-fail" />;
            default:
                return null;
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pass':
                return 'badge-pass';
            case 'warning':
                return 'badge-warning';
            case 'fail':
                return 'badge-fail';
            default:
                return 'badge-info';
        }
    };

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <h1 className="page-title">
                    <Microscope className="inline mr-2" size={28} />
                    基因康临床 <span className="text-enterprise-500 font-normal">/ GenskeyTrial Clinical & Regulatory</span>
                </h1>
                <p className="page-subtitle">
                    安全评估、法规合规与临床试验管理 / Safety, Compliance & Trial Management
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6 border-b border-enterprise-200">
                <div className="flex gap-1">
                    {[
                        { id: 'safety', label: '安全评估 / Safety', icon: Shield },
                        { id: 'trials', label: '临床试验 / Trials', icon: Users },
                        { id: 'audit', label: '合规审计 / Audit', icon: FileText }
                    ].map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 text-sm-cn font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === tab.id
                                        ? 'border-brand-500 text-brand-600'
                                        : 'border-transparent text-enterprise-600 hover:text-enterprise-900'
                                    }`}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
                {activeTab === 'safety' && safetyReport && (
                    <div>
                        {/* Overview */}
                        <div className="card mb-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-enterprise-900 mb-1">
                                        {safetyReport.strain_name}
                                    </h3>
                                    <p className="text-sm text-enterprise-600">安全性评估报告 / Safety Assessment Report</p>
                                </div>
                                <span className={`badge ${safetyReport.overall_status.includes('合格') ? 'badge-pass' : 'badge-warning'}`}>
                                    {safetyReport.overall_status}
                                </span>
                            </div>
                        </div>

                        {/* Detailed Checks */}
                        <div className="space-y-4">
                            {safetyReport.checks.map((check, idx) => (
                                <div key={idx} className="card border-l-4" style={{
                                    borderLeftColor: check.status === 'pass' ? '#10b981' :
                                        check.status === 'warning' ? '#f59e0b' : '#ef4444'
                                }}>
                                    <div className="flex items-start gap-3 mb-3">
                                        {getStatusIcon(check.status)}
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-enterprise-900 mb-1">{check.check_type}</h4>
                                            <span className={`${getStatusBadge(check.status)}`}>
                                                {check.status === 'pass' ? '通过 / Pass' :
                                                    check.status === 'warning' ? '警告 / Warning' : '失败 / Fail'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="ml-8">
                                        <div className="mb-3">
                                            <div className="text-sm font-medium text-enterprise-700 mb-2">
                                                检测结果 / Findings:
                                            </div>
                                            <ul className="list-disc list-inside space-y-1">
                                                {check.findings.map((finding, fIdx) => (
                                                    <li key={fIdx} className="text-sm-cn text-enterprise-600">{finding}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        {check.recommendations.length > 0 && (
                                            <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                                                <div className="text-sm font-medium text-amber-900 mb-1">
                                                    建议 / Recommendations:
                                                </div>
                                                <ul className="list-disc list-inside space-y-1">
                                                    {check.recommendations.map((rec, rIdx) => (
                                                        <li key={rIdx} className="text-sm-cn text-amber-800">{rec}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="card mt-6">
                            <h4 className="font-semibold text-enterprise-900 mb-4">
                                后续步骤 / Next Actions
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button className="btn-primary">
                                    生成IND文档 / Generate IND
                                </button>
                                <button className="btn-secondary">
                                    下载报告 / Download Report
                                </button>
                                <button className="btn-secondary">
                                    请求审阅 / Request Review
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'trials' && (
                    <div>
                        <div className="card mb-4">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold">临床试验列表 / Clinical Trials</h3>
                                <button className="btn-primary">
                                    新建试验 / New Trial
                                </button>
                            </div>

                            <div className="space-y-4">
                                {trials.map(trial => (
                                    <div key={trial.trial_id} className="border border-enterprise-200 rounded-lg p-5 hover:border-brand-300 transition-colors">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <div className="text-xs text-brand-600 font-medium mb-1">
                                                    {trial.trial_id}
                                                </div>
                                                <h4 className="font-semibold text-enterprise-900 mb-1">
                                                    {trial.title_zh}
                                                </h4>
                                                <div className="flex items-center gap-2 text-sm text-enterprise-600">
                                                    <span className="badge-info">{trial.phase}</span>
                                                    <span className="badge-pass">{trial.status}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <div className="text-xs text-enterprise-600 mb-1">入组进度 / Enrollment</div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-enterprise-200 rounded-full h-2">
                                                        <div
                                                            className="bg-brand-500 h-2 rounded-full"
                                                            style={{ width: `${(trial.current_enrollment / trial.enrollment_target) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium text-enterprise-900">
                                                        {trial.current_enrollment} / {trial.enrollment_target}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-end justify-end gap-2">
                                                <button className="btn-secondary text-sm">查看详情 / View</button>
                                                <button className="btn-primary text-sm">管理 / Manage</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'audit' && (
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-4">
                            审计日志 / Audit Trail (21 CFR Part 11)
                        </h3>

                        <table className="table-dense">
                            <thead>
                                <tr>
                                    <th>时间 / Time</th>
                                    <th>用户 / User</th>
                                    <th>操作 / Action</th>
                                    <th>资源 / Resource</th>
                                    <th>详情 / Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>2025-12-11 14:25</td>
                                    <td>zhang.min@genskey.bio</td>
                                    <td><span className="badge-info">UPDATE</span></td>
                                    <td>strain/GK-001</td>
                                    <td className="text-xs">Safety level: BSL-2 → BSL-1</td>
                                </tr>
                                <tr>
                                    <td>2025-12-11 13:10</td>
                                    <td>li.wei@genskey.bio</td>
                                    <td><span className="badge-pass">CREATE</span></td>
                                    <td>project/GK-COPD-2025</td>
                                    <td className="text-xs">New project created</td>
                                </tr>
                                <tr>
                                    <td>2025-12-11 12:05</td>
                                    <td>wang.fang@genskey.bio</td>
                                    <td><span className="badge-warning">DELETE</span></td>
                                    <td>experiment/EXP-445</td>
                                    <td className="text-xs">Duplicate entry removed</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="mt-4 flex justify-between items-center text-sm text-enterprise-600">
                            <div>显示 1-3 / 共 156 条记录</div>
                            <div className="flex gap-2">
                                <button className="btn-secondary text-sm">上一页 / Previous</button>
                                <button className="btn-secondary text-sm">下一页 / Next</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrialModule;
