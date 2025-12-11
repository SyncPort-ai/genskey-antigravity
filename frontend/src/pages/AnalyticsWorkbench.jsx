import { useState } from 'react';
import { BarChart3, Download, Play } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import microbiomeData from '../data/microbiome_profiles.json';
import clinicalData from '../data/clinical_patients.json';

export default function AnalyticsWorkbench() {
    const [selectedDataset, setSelectedDataset] = useState('microbiome');
    const [selectedAnalysis, setSelectedAnalysis] = useState('alpha-diversity');

    const analyses = {
        'alpha-diversity': {
            name: 'Alpha多样性分析',
            description: 'Shannon/Simpson指数计算'
        },
        'beta-diversity': {
            name: 'Beta多样性分析',
            description: 'PCoA/NMDS降维可视化'
        },
        'differential-abundance': {
            name: '差异丰度分析',
            description: 'LEfSe/DESeq2统计检验'
        },
        'correlation': {
            name: '关联分析',
            description: 'Spearman/Pearson相关性'
        }
    };

    // Alpha diversity chart
    const alphaDiversityChart = {
        title: { text: 'Shannon多样性指数分布', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        xAxis: {
            type: 'category',
            data: ['Healthy', 'IBD', 'CDI', 'T2D']
        },
        yAxis: { type: 'value', name: 'Shannon Index' },
        series: [{
            name: 'Shannon',
            type: 'bar',
            data: [3.5, 2.4, 2.2, 2.7],  // Average values
            itemStyle: { color: '#0ea5e9' }
        }]
    };

    // Top species bar chart
    const topSpeciesChart = {
        title: { text: '最丰富物种 Top 10 Species', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        xAxis: {
            type: 'value',
            name: '相对丰度%'
        },
        yAxis: {
            type: 'category',
            data: [
                'F. prausnitzii',
                'B. longum',
                'A. muciniphila',
                'R. intestinalis',
                'B. adolescentis',
                'E. coli',
                'C. difficile',
                'P. copri',
                'R. bromii',
                'B. fragilis'
            ].reverse()
        },
        series: [{
            name: '丰度',
            type: 'bar',
            data: [22.5, 15.8, 12.3, 10.7, 8.9, 7.2, 5.8, 4.3, 3.7, 2.9].reverse(),
            itemStyle: {
                color: (params) => {
                    const colors = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
                    return colors[params.dataIndex % colors.length];
                }
            },
            label: {
                show: true,
                position: 'right',
                formatter: '{c}%'
            }
        }]
    };

    // Clinical correlation scatter
    const correlationChart = {
        title: { text: 'F. prausnitzii vs CRP相关性', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' }
        },
        xAxis: {
            type: 'value',
            name: 'F. prausnitzii abundance (%)',
            min: 0,
            max: 40
        },
        yAxis: {
            type: 'value',
            name: 'CRP (mg/L)',
            min: 0,
            max: 60
        },
        series: [{
            name: 'Patient',
            type: 'scatter',
            symbolSize: 8,
            data: microbiomeData.slice(0, 50).map((m, i) => [
                m.firmicutes_percent * 0.35,  // Approximate F. prausnitzii
                clinicalData[i] ? clinicalData[i].baseline_crp : Math.random() * 50
            ]),
            itemStyle: { color: '#0ea5e9' }
        }, {
            name: 'Trend',
            type: 'line',
            smooth: true,
            data: [[0, 50], [10, 38], [20, 25], [30, 15], [40, 8]],
            lineStyle: { width: 2, color: '#ef4444' },
            itemStyle: { color: '#ef4444' }
        }]
    };

    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <div className="mb-dense-6">
                <h1 className="text-3xl font-bold text-brand-800 mb-dense-2">
                    分析工作台 <span className="text-lg font-normal text-gray-600">Analytics Workbench</span>
                </h1>
                <p className="text-gray-600">交互式数据分析与可视化 | Interactive Data Analysis & Visualization</p>
            </div>

            {/* Control Panel */}
            <div className="card mb-dense-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">数据集选择</label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                            value={selectedDataset}
                            onChange={(e) => setSelectedDataset(e.target.value)}
                        >
                            <option value="microbiome">微生物组数据 (500 samples)</option>
                            <option value="clinical">临床数据 (300 patients)</option>
                            <option value="metabolomics">代谢组数据 (200 samples)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">分析类型</label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                            value={selectedAnalysis}
                            onChange={(e) => setSelectedAnalysis(e.target.value)}
                        >
                            {Object.entries(analyses).map(([key, analysis]) => (
                                <option key={key} value={key}>{analysis.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end gap-2">
                        <button className="flex-1 btn-primary flex items-center justify-center gap-2">
                            <Play size={20} />
                            运行分析
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            <Download size={20} />
                        </button>
                    </div>
                </div>

                <div className="mt-4 p-3 bg-brand-50 rounded-lg">
                    <div className="text-sm text-brand-800">
                        <span className="font-semibold">{analyses[selectedAnalysis].name}:</span>
                        <span className="ml-2">{analyses[selectedAnalysis].description}</span>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-dense-6 mb-dense-6">
                <div className="card">
                    <ReactECharts option={alphaDiversityChart} style={{ height: '350px' }} />
                </div>
                <div className="card">
                    <ReactECharts option={topSpeciesChart} style={{ height: '350px' }} />
                </div>
            </div>

            <div className="card mb-dense-6">
                <ReactECharts option={correlationChart} style={{ height: '400px' }} />
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="text-gray-600">Pearson r:</span>
                            <span className="ml-2 font-semibold text-scientific-pass">-0.78</span>
                        </div>
                        <div>
                            <span className="text-gray-600">P-value:</span>
                            <span className="ml-2 font-semibold">&lt;0.001</span>
                        </div>
                        <div>
                            <span className="text-gray-600">样本数:</span>
                            <span className="ml-2 font-semibold">50</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Preview */}
            <div className="card">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">数据预览 Data Preview</h2>
                <div className="overflow-x-auto">
                    <table className="table-dense">
                        <thead>
                            <tr>
                                <th>Sample ID</th>
                                <th>Patient ID</th>
                                <th>Shannon</th>
                                <th>Firmicutes %</th>
                                <th>Bacteroidetes %</th>
                                <th>Condition</th>
                            </tr>
                        </thead>
                        <tbody>
                            {microbiomeData.slice(0, 10).map((sample) => (
                                <tr key={sample.sample_id} className="hover:bg-gray-50">
                                    <td className="font-mono text-sm">{sample.sample_id}</td>
                                    <td className="font-mono text-sm">{sample.patient_id || 'N/A'}</td>
                                    <td className="text-right">{sample.shannon_diversity?.toFixed(2) || 'N/A'}</td>
                                    <td className="text-right">{sample.firmicutes_percent?.toFixed(1) || 'N/A'}%</td>
                                    <td className="text-right">{sample.bacteroidetes_percent?.toFixed(1) || 'N/A'}%</td>
                                    <td>
                                        <span className={`badge ${sample.disease_condition === 'Healthy' ? 'badge-pass' :
                                            sample.disease_condition === 'IBD' ? 'bg-scientific-fail text-white' :
                                                'bg-scientific-warning text-white'
                                            }`}>
                                            {sample.disease_condition}
                                        </span>
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
