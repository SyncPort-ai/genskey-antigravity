import { useState } from 'react';
import { Cpu, GitBranch, TrendingUp, CheckCircle2, XCircle, Clock } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

export default function MLOps() {
    const models = [
        {
            name: 'GNN-InteractionPredictor-v2.3',
            version: 'v2.3',
            framework: 'PyTorch',
            status: 'production',
            accuracy: 0.87,
            f1Score: 0.85,
            lastTrained: '2025-12-08',
            modelSize: '156 MB',
            inferenceTime: '45 ms',
            deployedEndpoints: 3
        },
        {
            name: 'LSTM-MetabolitePredictor-v1.5',
            version: 'v1.5',
            framework: 'TensorFlow',
            status: 'staging',
            accuracy: 0.82,
            f1Score: 0.80,
            lastTrained: '2025-12-10',
            modelSize: '89 MB',
            inferenceTime: '32 ms',
            deployedEndpoints: 1
        },
        {
            name: 'RandomForest-SafetyClassifier-v3.1',
            version: 'v3.1',
            framework: 'Scikit-learn',
            status: 'production',
            accuracy: 0.94,
            f1Score: 0.93,
            lastTrained: '2025-12-05',
            modelSize: '12 MB',
            inferenceTime: '8 ms',
            deployedEndpoints: 5
        },
        {
            name: 'Transformer-LiteratureQA-v1.0',
            version: 'v1.0',
            framework: 'HuggingFace',
            status: 'development',
            accuracy: 0.76,
            f1Score: 0.74,
            lastTrained: '2025-12-11',
            modelSize: '420 MB',
            inferenceTime: '180 ms',
            deployedEndpoints: 0
        }
    ];

    const experiments = [
        { id: 'exp-2341', model: 'GNN-InteractionPredictor', params: 'lr=0.001, dropout=0.3', accuracy: 0.87, status: 'completed' },
        { id: 'exp-2340', model: 'GNN-InteractionPredictor', params: 'lr=0.0005, dropout=0.5', accuracy: 0.85, status: 'completed' },
        { id: 'exp-2342', model: 'LSTM-MetabolitePredictor', params: 'units=256, layers=3', accuracy: 0.82, status: 'running' },
        { id: 'exp-2343', model: 'Transformer-LiteratureQA', params: 'epochs=50, batch=16', accuracy: 0.76, status: 'running' }
    ];

    // Model performance over versions
    const performanceChart = {
        title: { text: '模型性能演进 Model Performance Evolution', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'axis' },
        legend: { data: ['Accuracy', 'F1 Score'] },
        xAxis: {
            type: 'category',
            data: ['v1.0', 'v1.5', 'v2.0', 'v2.1', 'v2.2', 'v2.3']
        },
        yAxis: { type: 'value', name: 'Score', min: 0.7, max: 1.0 },
        series: [
            {
                name: 'Accuracy',
                type: 'line',
                data: [0.75, 0.78, 0.82, 0.84, 0.86, 0.87],
                smooth: true,
                itemStyle: { color: '#0ea5e9' }
            },
            {
                name: 'F1 Score',
                type: 'line',
                data: [0.73, 0.76, 0.80, 0.82, 0.84, 0.85],
                smooth: true,
                itemStyle: { color: '#10b981' }
            }
        ]
    };

    // Training time comparison
    const trainingTimeChart = {
        title: { text: '训练时间对比 Training Time Comparison', textStyle: { fontSize: 16, fontWeight: 'bold' } },
        tooltip: { trigger: 'axis', formatter: '{b}: {c} hours' },
        xAxis: {
            type: 'category',
            data: models.map(m => m.name.split('-')[1])
        },
        yAxis: { type: 'value', name: 'Hours' },
        series: [{
            name: 'Training Time',
            type: 'bar',
            data: [12.5, 8.3, 2.1, 24.8],
            itemStyle: {
                color: (params) => {
                    const colors = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6'];
                    return colors[params.dataIndex];
                }
            }
        }]
    };

    const getStatusBadge = (status) => {
        const badges = {
            production: <span className="badge badge-pass">生产环境</span>,
            staging: <span className="badge bg-brand-500 text-white">测试环境</span>,
            development: <span className="badge bg-gray-500 text-white">开发中</span>
        };
        return badges[status];
    };

    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <div className="mb-dense-6">
                <h1 className="text-3xl font-bold text-brand-800 mb-dense-2">
                    ML运维 <span className="text-lg font-normal text-gray-600">MLOps</span>
                </h1>
                <p className="text-gray-600">机器学习模型注册表与实验追踪 | Model Registry & Experiment Tracking</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-dense-4 mb-dense-6">
                <div className="card bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                    <Cpu size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{models.length}</div>
                    <div className="text-sm opacity-90">注册模型</div>
                </div>

                <div className="card bg-gradient-to-br from-scientific-pass to-green-600 text-white">
                    <CheckCircle2 size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{models.filter(m => m.status === 'production').length}</div>
                    <div className="text-sm opacity-90">生产部署</div>
                </div>

                <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                    <GitBranch size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{experiments.length}</div>
                    <div className="text-sm opacity-90">实验记录</div>
                </div>

                <div className="card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                    <TrendingUp size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">
                        {(models.reduce((sum, m) => sum + m.accuracy, 0) / models.length * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm opacity-90">平均准确率</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-dense-6 mb-dense-6">
                <div className="card">
                    <ReactECharts option={performanceChart} style={{ height: '300px' }} />
                </div>
                <div className="card">
                    <ReactECharts option={trainingTimeChart} style={{ height: '300px' }} />
                </div>
            </div>

            {/* Model Registry */}
            <div className="card mb-dense-6">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">模型注册表 Model Registry</h2>
                <div className="overflow-x-auto">
                    <table className="table-dense">
                        <thead>
                            <tr>
                                <th>模型名称</th>
                                <th>版本</th>
                                <th>框架</th>
                                <th>准确率</th>
                                <th>F1 Score</th>
                                <th>模型大小</th>
                                <th>推理时间</th>
                                <th>部署端点</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            {models.map((model) => (
                                <tr key={model.name} className="hover:bg-gray-50">
                                    <td className="font-semibold">{model.name}</td>
                                    <td className="font-mono text-sm">{model.version}</td>
                                    <td>
                                        <span className="badge bg-brand-100 text-brand-700">{model.framework}</span>
                                    </td>
                                    <td className="text-right">
                                        <span className={`font-semibold ${model.accuracy >= 0.9 ? 'text-scientific-pass' :
                                                model.accuracy >= 0.8 ? 'text-scientific-warning' : 'text-scientific-fail'
                                            }`}>
                                            {(model.accuracy * 100).toFixed(1)}%
                                        </span>
                                    </td>
                                    <td className="text-right">{(model.f1Score * 100).toFixed(1)}%</td>
                                    <td className="text-right">{model.modelSize}</td>
                                    <td className="text-right">{model.inferenceTime}</td>
                                    <td className="text-right">{model.deployedEndpoints}</td>
                                    <td>{getStatusBadge(model.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Experiment Tracking */}
            <div className="card">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">实验追踪 Experiment Tracking</h2>
                <div className="space-y-3">
                    {experiments.map((exp) => (
                        <div key={exp.id} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-sm text-brand-600">{exp.id}</span>
                                    <span className="font-semibold">{exp.model}</span>
                                    {exp.status === 'running' && <Clock size={16} className="text-scientific-warning animate-pulse" />}
                                    {exp.status === 'completed' && <CheckCircle2 size={16} className="text-scientific-pass" />}
                                </div>
                                <div className="text-right">
                                    {exp.status === 'completed' && (
                                        <span className="font-semibold text-brand-600">Accuracy: {(exp.accuracy * 100).toFixed(1)}%</span>
                                    )}
                                    {exp.status === 'running' && (
                                        <span className="badge bg-brand-500 text-white">运行中...</span>
                                    )}
                                </div>
                            </div>
                            <div className="text-sm text-gray-600">
                                <span className="font-mono bg-gray-200 px-2 py-1 rounded">{exp.params}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
