import { useState } from 'react';
import { Target, TrendingUp, AlertCircle, Database } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import microbiomeData from '../data/microbiome_profiles.json';

export default function TargetValidation() {
    const diseases = [
        { id: 'IBD', name: '炎症性肠病', abbr: 'IBD', validated: true, confidence: 0.92, keySpecies: ['F. prausnitzii', 'A. muciniphila'], samples: 145 },
        { id: 'CDI', name: '艰难梭菌感染', abbr: 'C. diff', validated: true, confidence: 0.88, keySpecies: ['C. difficile', 'R. intestinalis'], samples: 98 },
        { id: 'T2D', name: '2型糖尿病', abbr: 'T2D', validated: false, confidence: 0.76, keySpecies: ['B. adolescentis', 'P. copri'], samples: 178 },
        { id: 'NAFLD', name: '非酒精性脂肪肝', abbr: 'NAFLD', validated: false, confidence: 0.71, keySpecies: ['E. coli', 'K. pneumoniae'], samples: 67 }
    ];

    // Disease-Microbiome association heatmap data
    const species = ['F. prausnitzii', 'A. muciniphila', 'B. longum', 'R. intestinalis', 'C. difficile', 'P. copri'];
    const diseaseLabels = ['IBD', 'CDI', 'T2D', 'NAFLD', 'Healthy'];

    const heatmapData = [
        [0, 0, 0.85], [0, 1, 0.72], [0, 2, 0.45], [0, 3, 0.38], [0, 4, -0.68],
        [1, 0, 0.78], [1, 1, 0.65], [1, 2, 0.52], [1, 3, 0.31], [1, 4, -0.55],
        [2, 0, 0.42], [2, 1, 0.38], [2, 2, 0.68], [2, 3, 0.45], [2, 4, 0.12],
        [3, 0, 0.71], [3, 1, 0.82], [3, 2, 0.35], [3, 3, 0.28], [3, 4, -0.48],
        [4, 0, -0.35], [4, 1, -0.82], [4, 2, -0.15], [4, 3, 0.12], [4, 4, 0.92],
        [5, 0, -0.22], [5, 1, -0.18], [5, 2, 0.75], [5, 3, 0.68], [5, 4, -0.42]
    ].map(item => [item[1], item[0], item[2]]);

    const heatmapChart = {
        title: { text: '疾病-微生物组关联热图 Disease-Microbiome Association', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: {
            position: 'top',
            formatter: (params) => {
                const disease = diseaseLabels[params.data[0]];
                const spec = species[params.data[1]];
                const corr = params.data[2];
                return `${disease} - ${spec}<br/>Correlation: ${corr.toFixed(2)}`;
            }
        },
        grid: { top: 60, bottom: 60, left: 140 },
        xAxis: {
            type: 'category',
            data: diseaseLabels,
            splitArea: { show: true }
        },
        yAxis: {
            type: 'category',
            data: species,
            splitArea: { show: true }
        },
        visualMap: {
            min: -1,
            max: 1,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: 10,
            inRange: {
                color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            }
        },
        series: [{
            name: 'Correlation',
            type: 'heatmap',
            data: heatmapData,
            label: {
                show: true,
                formatter: (params) => params.data[2].toFixed(2)
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };

    // Validation confidence chart
    const confidenceChart = {
        title: { text: '靶点验证置信度 Target Validation Confidence', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        xAxis: {
            type: 'category',
            data: diseases.map(d => d.abbr)
        },
        yAxis: { type: 'value', name: 'Confidence', max: 1 },
        series: [{
            name: 'Confidence Score',
            type: 'bar',
            data: diseases.map(d => ({
                value: d.confidence,
                itemStyle: {
                    color: d.validated ? '#10b981' : '#f59e0b'
                }
            })),
            label: {
                show: true,
                position: 'top',
                formatter: (params) => (params.value * 100).toFixed(0) + '%'
            }
        }]
    };

    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <div className="mb-dense-6">
                <h1 className="text-3xl font-bold text-brand-800 mb-dense-2">
                    靶点验证 <span className="text-lg font-normal text-gray-600">Target Validation</span>
                </h1>
                <p className="text-gray-600">疾病-微生物组关联分析 | Disease-Microbiome Association Analysis</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-dense-4 mb-dense-6">
                <div className="card bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                    <Target size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{diseases.length}</div>
                    <div className="text-sm opacity-90">候选靶点</div>
                </div>

                <div className="card bg-gradient-to-br from-scientific-pass to-green-600 text-white">
                    <TrendingUp size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{diseases.filter(d => d.validated).length}</div>
                    <div className="text-sm opacity-90">已验证</div>
                </div>

                <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                    <Database size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{microbiomeData.length}</div>
                    <div className="text-sm opacity-90">微生物组样本</div>
                </div>

                <div className="card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                    <AlertCircle size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">
                        {Math.round((diseases.reduce((sum, d) => sum + d.confidence, 0) / diseases.length) * 100)}%
                    </div>
                    <div className="text-sm opacity-90">平均置信度</div>
                </div>
            </div>

            {/* Heatmap */}
            <div className="card mb-dense-6">
                <ReactECharts option={heatmapChart} style={{ height: '400px' }} />
            </div>

            {/* Confidence Chart */}
            <div className="card mb-dense-6">
                <ReactECharts option={confidenceChart} style={{ height: '300px' }} />
            </div>

            {/* Disease Target Table */}
            <div className="card">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">疾病靶点列表 Disease Targets</h2>
                <div className="overflow-x-auto">
                    <table className="table-dense">
                        <thead>
                            <tr>
                                <th>疾病</th>
                                <th>英文缩写</th>
                                <th>关键物种</th>
                                <th>样本数</th>
                                <th>置信度</th>
                                <th>验证状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            {diseases.map((disease) => (
                                <tr key={disease.id} className="hover:bg-gray-50">
                                    <td className="font-semibold">{disease.name}</td>
                                    <td className="font-mono">{disease.abbr}</td>
                                    <td>
                                        <div className="flex flex-wrap gap-1">
                                            {disease.keySpecies.map((species, idx) => (
                                                <span key={idx} className="badge bg-brand-100 text-brand-700 text-xs italic">
                                                    {species}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="text-right">{disease.samples}</td>
                                    <td className="text-right">
                                        <span className={`font-semibold ${disease.confidence >= 0.85 ? 'text-scientific-pass' :
                                                disease.confidence >= 0.75 ? 'text-scientific-warning' : 'text-scientific-fail'
                                            }`}>
                                            {(disease.confidence * 100).toFixed(0)}%
                                        </span>
                                    </td>
                                    <td>
                                        {disease.validated ?
                                            <span className="badge badge-pass">已验证</span> :
                                            <span className="badge badge-warning">待验证</span>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 p-4 bg-brand-50 rounded-lg">
                    <h3 className="font-semibold text-brand-800 mb-2">分析方法 Analysis Methods</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="text-gray-600">统计检验:</span>
                            <span className="ml-2 font-semibold">Wilcoxon秩和检验</span>
                        </div>
                        <div>
                            <span className="text-gray-600">多重校正:</span>
                            <span className="ml-2 font-semibold">FDR (q<0.05)</span>
                        </div>
                        <div>
                            <span className="text-gray-600">效应量:</span>
                            <span className="ml-2 font-semibold">Cohen's d</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
