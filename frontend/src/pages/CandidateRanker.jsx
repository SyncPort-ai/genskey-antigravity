import { useState } from 'react';
import { Target, TrendingUp, AlertCircle, CheckCircle2, XCircle, Search, Filter, Award } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import candidateData from '../mock-data/candidate_scores.json';

export default function CandidateRanker() {
    const [filteredCandidates, setFilteredCandidates] = useState(candidateData.candidates);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [filterRuleGate, setFilterRuleGate] = useState('all');

    // Filter candidates by rule gate status
    const handleFilterChange = (status) => {
        setFilterRuleGate(status);
        if (status === 'all') {
            setFilteredCandidates(candidateData.candidates);
        } else {
            setFilteredCandidates(candidateData.candidates.filter(c => c.scores.rule_gate === status));
        }
    };

    // Get rule gate badge
    const getRuleGateBadge = (status) => {
        const badges = {
            'PASS': <span className="badge badge-pass flex items-center gap-1"><CheckCircle2 size={14} />通过</span>,
            'MANUAL_REVIEW': <span className="badge badge-warning flex items-center gap-1"><AlertCircle size={14} />待审查</span>,
            'REJECT': <span className="badge badge-fail flex items-center gap-1"><XCircle size={14} />拒绝</span>
        };
        return badges[status] || <span className="badge">未知</span>;
    };

    // Score breakdown radar chart
    const getScoreRadarChart = (candidate) => {
        if (!candidate) return null;

        return {
            title: { text: '多维度评分 Multi-Dimensional Scores', textStyle: { fontSize: 14, fontWeight: 'bold' } },
            radar: {
                indicator: [
                    { name: '生物相关性', max: 1 },
                    { name: '功能潜力', max: 1 },
                    { name: '安全性', max: 1 },
                    { name: '可培养性', max: 1 },
                    { name: '可递送性', max: 1 },
                    { name: 'IP新颖性', max: 1 }
                ],
                radius: '65%'
            },
            series: [{
                type: 'radar',
                data: [{
                    value: [
                        candidate.scores.bio_relevance,
                        candidate.scores.functional_potential,
                        candidate.scores.safety_score,
                        candidate.scores.manufacturability,
                        candidate.scores.deliverability,
                        candidate.scores.ip_score
                    ],
                    name: candidate.strain_id,
                    itemStyle: { color: '#0ea5e9' },
                    areaStyle: { opacity: 0.3 }
                }]
            }]
        };
    };

    // SHAP waterfall chart
    const getSHAPChart = (candidate) => {
        if (!candidate || !candidate.shap_explanation) return null;

        return {
            title: { text: 'SHAP特征重要性 Feature Importance', textStyle: { fontSize: 14, fontWeight: 'bold' } },
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            xAxis: { type: 'value', name: 'SHAP Value' },
            yAxis: {
                type: 'category',
                data: candidate.shap_explanation.map(f => f.feature).reverse()
            },
            series: [{
                type: 'bar',
                data: candidate.shap_explanation.map(f => ({
                    value: f.value,
                    itemStyle: { color: f.impact === 'positive' ? '#10b981' : '#ef4444' }
                })).reverse(),
                label: {
                    show: true,
                    position: 'right',
                    formatter: (params) => params.value.toFixed(2)
                }
            }]
        };
    };

    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <div className="mb-dense-6">
                <h1 className="text-3xl font-bold text-brand-800 mb-dense-2">
                    候选菌株排序 <span className="text-lg font-normal text-gray-600">Candidate Ranker</span>
                </h1>
                <p className="text-gray-600">基于ML的候选LBP菌株智能评分与排序系统 | ML-Powered Candidate Scoring System</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-dense-4 mb-dense-6">
                <div className="card bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                    <Target size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{candidateData.candidates.length}</div>
                    <div className="text-sm opacity-90">候选总数</div>
                </div>

                <div className="card bg-gradient-to-br from-scientific-pass to-green-600 text-white">
                    <CheckCircle2 size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">
                        {candidateData.candidates.filter(c => c.scores.rule_gate === 'PASS').length}
                    </div>
                    <div className="text-sm opacity-90">通过规则门控</div>
                </div>

                <div className="card bg-gradient-to-br from-scientific-warning to-orange-600 text-white">
                    <AlertCircle size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">
                        {candidateData.candidates.filter(c => c.scores.rule_gate === 'MANUAL_REVIEW').length}
                    </div>
                    <div className="text-sm opacity-90">需人工审查</div>
                </div>

                <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                    <Award size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{candidateData.metadata.model_version}</div>
                    <div className="text-sm opacity-90">ML模型版本</div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="card mb-dense-6">
                <div className="flex items-center gap-4">
                    <Filter size={20} className="text-gray-600" />
                    <span className="font-semibold text-gray-700">筛选条件:</span>
                    <button
                        onClick={() => handleFilterChange('all')}
                        className={`px-4 py-2 rounded-lg ${filterRuleGate === 'all' ? 'bg-brand-500 text-white' : 'bg-gray-100'}`}
                    >
                        全部 ({candidateData.candidates.length})
                    </button>
                    <button
                        onClick={() => handleFilterChange('PASS')}
                        className={`px-4 py-2 rounded-lg ${filterRuleGate === 'PASS' ? 'bg-scientific-pass text-white' : 'bg-gray-100'}`}
                    >
                        通过 ({candidateData.candidates.filter(c => c.scores.rule_gate === 'PASS').length})
                    </button>
                    <button
                        onClick={() => handleFilterChange('MANUAL_REVIEW')}
                        className={`px-4 py-2 rounded-lg ${filterRuleGate === 'MANUAL_REVIEW' ? 'bg-scientific-warning text-white' : 'bg-gray-100'}`}
                    >
                        待审查 ({candidateData.candidates.filter(c => c.scores.rule_gate === 'MANUAL_REVIEW').length})
                    </button>
                </div>
            </div>

            {/* Top Candidates Table */}
            <div className="card mb-dense-6">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">Top-{filteredCandidates.length} 候选排序 Ranked Candidates</h2>
                <div className="overflow-x-auto">
                    <table className="table-dense">
                        <thead>
                            <tr>
                                <th>排名</th>
                                <th>候选ID</th>
                                <th>物种</th>
                                <th>疾病靶点</th>
                                <th>最终评分</th>
                                <th>规则门控</th>
                                <th>推荐级别</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCandidates.map((candidate) => (
                                <tr key={candidate.strain_id} className="hover:bg-gray-50">
                                    <td className="text-center">
                                        <div className="flex items-center justify-center">
                                            {candidate.scores.rank <= 3 && (
                                                <Award size={16} className="text-yellow-500 mr-1" />
                                            )}
                                            <span className="font-bold text-brand-600">#{candidate.scores.rank}</span>
                                        </div>
                                    </td>
                                    <td className="font-mono text-sm font-semibold">{candidate.strain_id}</td>
                                    <td className="italic">{candidate.species}</td>
                                    <td>
                                        <span className="badge bg-blue-100 text-blue-800">{candidate.disease_target}</span>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-brand-500 h-2 rounded-full"
                                                    style={{ width: `${candidate.scores.final_score * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="font-semibold text-brand-700">
                                                {(candidate.scores.final_score * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    </td>
                                    <td>{getRuleGateBadge(candidate.scores.rule_gate)}</td>
                                    <td>
                                        <span className={`font-semibold ${candidate.priority === 'high' ? 'text-scientific-pass' :
                                                candidate.priority === 'medium' ? 'text-scientific-warning' :
                                                    'text-gray-600'
                                            }`}>
                                            {candidate.priority === 'high' ? '高' : candidate.priority === 'medium' ? '中' : '低'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => setSelectedCandidate(candidate)}
                                            className="text-brand-600 hover:text-brand-800 font-semibold"
                                        >
                                            查看详情
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Candidate Detail Modal/Card */}
            {selectedCandidate && (
                <div className="card mb-dense-6 border-2 border-brand-500">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-brand-800 mb-2">
                                {selectedCandidate.strain_id} - {selectedCandidate.species}
                            </h2>
                            <p className="text-gray-600">排名 #{selectedCandidate.scores.rank} | 评分 {(selectedCandidate.scores.final_score * 100).toFixed(1)}% | {selectedCandidate.recommendation}</p>
                        </div>
                        <button
                            onClick={() => setSelectedCandidate(null)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <XCircle size={24} />
                        </button>
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <ReactECharts option={getScoreRadarChart(selectedCandidate)} style={{ height: '300px' }} />
                        </div>
                        <div>
                            <ReactECharts option={getSHAPChart(selectedCandidate)} style={{ height: '300px' }} />
                        </div>
                    </div>

                    {/* Feature Details */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-brand-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">AMR基因数</div>
                            <div className="text-2xl font-bold text-brand-800">{selectedCandidate.features.safety.AMR_gene_count}</div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">SCFA产量潜力</div>
                            <div className="text-2xl font-bold text-green-700">{(selectedCandidate.features.functional.SCFA_production * 100).toFixed(0)}%</div>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">冻干存活率</div>
                            <div className="text-2xl font-bold text-purple-700">{(selectedCandidate.features.manufacturability.freeze_dry_survival * 100).toFixed(0)}%</div>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">生长速度</div>
                            <div className="text-2xl font-bold text-orange-700">{selectedCandidate.features.manufacturability.growth_rate_hours}h</div>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">黏膜粘附</div>
                            <div className="text-2xl font-bold text-blue-700">{(selectedCandidate.features.deliverability.mucus_adherence * 100).toFixed(0)}%</div>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">新颖性评分</div>
                            <div className="text-2xl font-bold text-yellow-700">{(selectedCandidate.features.ip.novelty_score * 100).toFixed(0)}%</div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button className="flex-1 btn-primary flex items-center justify-center gap-2">
                            <CheckCircle2 size={20} />
                            进入湿实验验证
                        </button>
                        <button className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2">
                            <AlertCircle size={20} />
                            标记为待审查
                        </button>
                        <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            导出报告
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
