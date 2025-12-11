import { useState } from 'react';
import { Database, Search, Download, Filter, TrendingUp, FileJson, Table } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

export default function DataLake() {
    const [selectedDataset, setSelectedDataset] = useState(null);

    const datasets = [
        {
            id: 'microbiome_profiles',
            name: '微生物组丰度数据',
            nameEn: 'Microbiome Abundance Profiles',
            type: '组学数据',
            size: '2.3 GB',
            samples: 500,
            features: 150,
            lastUpdated: '2025-12-10',
            format: 'JSON, CSV',
            description: '临床样本的16S rRNA测序数据，包含细菌丰度、多样性指标、患者元数据'
        },
        {
            id: 'clinical_trials',
            name: '临床试验数据',
            nameEn: 'Clinical Trial Data',
            type: '临床数据',
            size: '850 MB',
            samples: 300,
            features: 45,
            lastUpdated: '2025-12-11',
            format: 'JSON, Excel',
            description: 'GNS-IBD-001和GNS-CDI-001试验的完整数据集，包含基线、随访、不良事件'
        },
        {
            id: 'genomic_data',
            name: '基因组注释数据',
            nameEn: 'Genomic Annotations',
            type: '组学数据',
            size: '15.2 GB',
            samples: 495,
            features: 5000,
            lastUpdated: '2025-12-09',
            format: 'GFF3, GenBank',
            description: '菌株全基因组测序数据、基因注释、BGC位置、功能预测'
        },
        {
            id: 'manufacturing',
            name: '生产批次记录',
            nameEn: 'Manufacturing Batch Records',
            type: '生产数据',
            size: '1.5 GB',
            samples: 50,
            features: 200,
            lastUpdated: '2025-12-11',
            format: 'JSON, PDF',
            description: '发酵批次的完整工艺参数、QC检测结果、偏差记录'
        },
        {
            id: 'metabolomics',
            name: '代谢组学数据',
            nameEn: 'Metabolomics Data',
            type: '组学数据',
            size: '4.8 GB',
            samples: 200,
            features: 300,
            lastUpdated: '2025-12-08',
            format: 'mzML, CSV',
            description: 'LC-MS代谢组学数据，包含短链脂肪酸、胆汁酸、氨基酸谱'
        },
        {
            id: 'safety_reports',
            name: '安全性评估报告',
            nameEn: 'Safety Assessment Reports',
            type: '法规数据',
            size: '320 MB',
            samples: 150,
            features: 30,
            lastUpdated: '2025-12-10',
            format: 'PDF, JSON',
            description: 'AMR筛查、毒力因子检测、VFDB/CARD数据库比对结果'
        }
    ];

    const storageStats = {
        total: 50000, // GB
        used: 24600,
        datasets: datasets.length,
        samples: datasets.reduce((sum, d) => sum + d.samples, 0)
    };

    // Data type distribution chart
    const typeDistribution = {
        title: {
            text: '数据类型分布',
            textStyle: { fontSize: 16, fontWeight: 'bold' }
        },
        tooltip: { trigger: 'item' },
        legend: { bottom: 10 },
        series: [{
            name: '数据类型',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: { show: false },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            data: [
                { value: 3, name: '组学数据 Omics', itemStyle: { color: '#0ea5e9' } },
                { value: 1, name: '临床数据 Clinical', itemStyle: { color: '#10b981' } },
                { value: 1, name: '生产数据 Manufacturing', itemStyle: { color: '#f59e0b' } },
                { value: 1, name: '法规数据 Regulatory', itemStyle: { color: '#8b5cf6' } }
            ]
        }]
    };

    // Storage trend chart
    const storageTrend = {
        title: {
            text: '数据增长趋势 (TB)',
            textStyle: { fontSize: 16, fontWeight: 'bold' }
        },
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            data: ['2024-06', '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12']
        },
        yAxis: { type: 'value', name: 'TB' },
        series: [{
            name: '存储使用量',
            type: 'line',
            smooth: true,
            data: [5.2, 7.8, 10.5, 13.2, 16.8, 20.5, 24.6],
            areaStyle: { color: 'rgba(14, 165, 233, 0.2)' },
            itemStyle: { color: '#0ea5e9' },
            lineStyle: { width: 3 }
        }]
    };

    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            {/* Header */}
            <div className="mb-dense-6">
                <h1 className="text-3xl font-bold text-brand-800 mb-dense-2 flex items-center gap-3">
                    <Database className="text-brand-600" />
                    数据湖
                    <span className="text-lg font-normal text-gray-600">Data Lake</span>
                </h1>
                <p className="text-gray-600">
                    集中存储和管理所有研发数据 | Multi-Omics · Clinical · Manufacturing · Regulatory
                </p>
            </div>

            {/* Storage Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-dense-4 mb-dense-6">
                <div className="card bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                    <Database size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{storageStats.datasets}</div>
                    <div className="text-sm opacity-90">数据集</div>
                </div>

                <div className="card bg-gradient-to-br from-scientific-pass to-green-600 text-white">
                    <Table size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{storageStats.samples.toLocaleString()}</div>
                    <div className="text-sm opacity-90">样本数</div>
                </div>

                <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                    <TrendingUp size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{storageStats.used / 1000} TB</div>
                    <div className="text-sm opacity-90">已使用</div>
                </div>

                <div className="card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                    <FileJson size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{Math.round((storageStats.used / storageStats.total) * 100)}%</div>
                    <div className="text-sm opacity-90">存储使用率</div>
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

            {/* Search */}
            <div className="card mb-dense-6">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="搜索数据集... (例如：微生物组、临床试验、基因组)"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                        />
                    </div>
                    <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <Filter size={20} />
                        筛选
                    </button>
                </div>
            </div>

            {/* Dataset List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-dense-4">
                {datasets.map((dataset) => (
                    <div
                        key={dataset.id}
                        className="card hover:shadow-card-hover transition-shadow cursor-pointer"
                        onClick={() => setSelectedDataset(dataset)}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg text-brand-800">
                                    {dataset.name}
                                </h3>
                                <p className="text-sm text-gray-500">{dataset.nameEn}</p>
                            </div>
                            <Database className="text-brand-600" size={24} />
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">类型:</span>
                                <span className="font-medium">{dataset.type}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">大小:</span>
                                <span className="font-medium">{dataset.size}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">样本数:</span>
                                <span className="font-medium">{dataset.samples}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">更新:</span>
                                <span className="font-medium">{dataset.lastUpdated}</span>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">{dataset.description}</p>

                        <div className="flex gap-2">
                            <button className="flex-1 px-3 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors text-sm">
                                查看详情
                            </button>
                            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <Download size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail Modal */}
            {selectedDataset && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-brand-800">{selectedDataset.name}</h2>
                                    <p className="text-gray-600">{selectedDataset.nameEn}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedDataset(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-brand-700">数据集信息</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">数据类型:</span>
                                            <span className="font-medium">{selectedDataset.type}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">存储大小:</span>
                                            <span className="font-medium">{selectedDataset.size}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">样本数量:</span>
                                            <span className="font-medium">{selectedDataset.samples}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">特征数:</span>
                                            <span className="font-medium">{selectedDataset.features}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">文件格式:</span>
                                            <span className="font-medium">{selectedDataset.format}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">最后更新:</span>
                                            <span className="font-medium">{selectedDataset.lastUpdated}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-brand-700">访问权限</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-scientific-pass rounded-full" />
                                            <span className="text-sm">数据科学团队</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-scientific-pass rounded-full" />
                                            <span className="text-sm">研发部门</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-scientific-pass rounded-full" />
                                            <span className="text-sm">临床团队</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full" />
                                            <span className="text-sm text-gray-500">外部合作方 (需申请)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3 text-brand-700">数据描述</h3>
                                <p className="text-gray-700">{selectedDataset.description}</p>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3 text-brand-700">数据预览 (前5行)</h3>
                                <div className="overflow-x-auto bg-gray-50 rounded-lg p-4 font-mono text-sm">
                                    <div className="text-gray-600">
                                        {selectedDataset.id === 'microbiome_profiles' && (
                                            `sample_id,patient_id,shannon_diversity,firmicutes_%,bacteroidetes_%
SAMPLE0001,PT0042,3.45,62.3,28.7
SAMPLE0002,PT0158,2.89,45.1,41.2
SAMPLE0003,PT0203,4.12,71.5,18.3
SAMPLE0004,PT0091,3.67,58.9,32.1
...`
                                        )}
                                        {selectedDataset.id === 'clinical_trials' && (
                                            `patient_id,trial_id,baseline_crp,week12_crp,response
PT0001,GNS-IBD-001,45.2,12.3,TRUE
PT0002,GNS-IBD-001,38.7,35.1,FALSE
PT0003,GNS-CDI-001,52.1,8.9,TRUE
PT0004,GNS-IBD-001,41.3,15.7,TRUE
...`
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button className="flex-1 btn-primary">
                                    <Download size={20} />
                                    下载完整数据集
                                </button>
                                <button className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                                    在分析工作台打开
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
