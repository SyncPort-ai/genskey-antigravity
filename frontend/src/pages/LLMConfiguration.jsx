import { useState, useEffect } from 'react';
import { Settings, Zap, DollarSign, Shield, TrendingUp, Check, AlertCircle } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

export default function LLMConfiguration() {
    const [config, setConfig] = useState(null);
    const [selectedProfile, setSelectedProfile] = useState('balanced');
    const [customConfig, setCustomConfig] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load config from backend
        fetch('/api/llm-config')
            .then(res => res.json())
            .then(data => {
                setConfig(data);
                setLoading(false);
            });
    }, []);

    if (loading || !config) {
        return <div className="p-6">Loading configuration...</div>;
    }

    const profiles = config.user_preferences.profiles;
    const currentProfile = profiles[selectedProfile];

    // Cost comparison chart
    const getCostComparisonChart = () => {
        return {
            title: { text: '月度成本对比 Monthly Cost Comparison', textStyle: { fontSize: 16 } },
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            xAxis: {
                type: 'category',
                data: Object.keys(profiles)
            },
            yAxis: { type: 'value', name: 'USD/月' },
            series: [{
                data: Object.values(profiles).map(p => p.estimated_monthly_cost),
                type: 'bar',
                itemStyle: {
                    color: (params) => {
                        const colors = ['#10b981', '#0ea5e9', '#8b5cf6', '#f59e0b'];
                        return colors[params.dataIndex];
                    }
                },
                label: {
                    show: true,
                    position: 'top',
                    formatter: '${c}'
                }
            }]
        };
    };

    // Model capability radar
    const getModelRadarChart = (modelId) => {
        const model = config.llm_providers.find(m => m.id === modelId);
        if (!model) return null;

        const capabilityScores = {
            'reasoning_quality': {
                'excellent': 1.0, 'very_good': 0.85,
                'good': 0.7, 'moderate': 0.5
            },
            'speed': {
                'very_fast': 1.0, 'fast': 0.8,
                'medium': 0.6, 'slow': 0.4
            }
        };

        return {
            radar: {
                indicator: [
                    { name: '推理质量', max: 1 },
                    { name: '速度', max: 1 },
                    { name: '上下文长度', max: 1 },
                    { name: '多模态', max: 1 },
                    { name: '性价比', max: 1 }
                ]
            },
            series: [{
                type: 'radar',
                data: [{
                    value: [
                        capabilityScores.reasoning_quality[model.capabilities.reasoning_quality] || 0.5,
                        capabilityScores.speed[model.capabilities.speed] || 0.5,
                        model.capabilities.max_context / 200000,
                        model.capabilities.supports_vision ? 1 : 0,
                        1 - (model.pricing.estimated_monthly_cost / 2500)
                    ],
                    name: model.name
                }]
            }]
        };
    };

    const handleProfileChange = (profile) => {
        setSelectedProfile(profile);
        // Apply profile configuration
        applyProfile(profile);
    };

    const applyProfile = async (profile) => {
        const response = await fetch('/api/llm-config/apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile })
        });
        if (response.ok) {
            alert('配置已应用 Configuration applied!');
        }
    };

    const updateTaskRouting = (task, modelId) => {
        setCustomConfig(prev => ({
            ...prev,
            task_routing: {
                ...prev.task_routing,
                [task]: { ...prev.task_routing?.[task], primary: modelId }
            }
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <div className="mb-dense-6">
                <h1 className="text-3xl font-bold text-brand-800 mb-dense-2">
                    LLM模型配置 <span className="text-lg font-normal text-gray-600">LLM Configuration</span>
                </h1>
                <p className="text-gray-600">自定义AI模型选择，平衡性能、成本和数据隐私 | Customize AI Model Selection</p>
            </div>

            {/* Profile Selection */}
            <div className="card mb-dense-6">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">预设配置方案 Preset Profiles</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {Object.entries(profiles).map(([key, profile]) => (
                        <button
                            key={key}
                            onClick={() => handleProfileChange(key)}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${selectedProfile === key
                                    ? 'border-brand-500 bg-brand-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="font-semibold text-brand-800 capitalize">
                                    {key.replace('_', ' ')}
                                </div>
                                {selectedProfile === key && <Check size={20} className="text-brand-600" />}
                            </div>
                            <div className="text-sm text-gray-600 mb-3">{profile.description}</div>
                            <div className="text-lg font-bold text-brand-600">
                                ${profile.estimated_monthly_cost}/月
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                主力模型: {profile.primary_models.join(', ').substring(0, 30)}...
                            </div>
                        </button>
                    ))}
                </div>

                <div className="mt-6">
                    <ReactECharts option={getCostComparisonChart()} style={{ height: '250px' }} />
                </div>
            </div>

            {/* Model Providers Overview */}
            <div className="card mb-dense-6">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">可用模型 Available Models</h2>
                <div className="overflow-x-auto">
                    <table className="table-dense">
                        <thead>
                            <tr>
                                <th>模型名称</th>
                                <th>提供商</th>
                                <th>推理质量</th>
                                <th>速度</th>
                                <th>上下文长度</th>
                                <th>成本/月</th>
                                <th>推荐场景</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            {config.llm_providers.map((model) => (
                                <tr key={model.id} className="hover:bg-gray-50">
                                    <td className="font-semibold">{model.name}</td>
                                    <td>{model.provider}</td>
                                    <td>
                                        <span className={`badge ${model.capabilities.reasoning_quality === 'excellent' ? 'badge-pass' :
                                                model.capabilities.reasoning_quality === 'very_good' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {model.capabilities.reasoning_quality}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${model.capabilities.speed === 'very_fast' ? 'badge-pass' :
                                                model.capabilities.speed === 'fast' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {model.capabilities.speed}
                                        </span>
                                    </td>
                                    <td className="text-right">{(model.capabilities.max_context / 1000).toFixed(0)}K</td>
                                    <td className="text-right font-semibold text-brand-700">
                                        ${model.pricing.estimated_monthly_cost}
                                    </td>
                                    <td className="text-sm">
                                        {model.recommended_for.map(tag => (
                                            <span key={tag} className="inline-block bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs mr-1 mb-1">
                                                {tag}
                                            </span>
                                        ))}
                                    </td>
                                    <td>
                                        {model.status === 'active' ? (
                                            <span className="badge badge-pass">Active</span>
                                        ) : (
                                            <span className="badge badge-warning">Optional</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Task-Based Routing */}
            <div className="card mb-dense-6">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">任务路由配置 Task Routing</h2>
                <p className="text-sm text-gray-600 mb-4">
                    为不同AI任务选择最合适的模型 | Select optimal models for different AI tasks
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(config.task_routing).map(([task, routing]) => (
                        <div key={task} className="p-4 bg-gray-50 rounded-lg">
                            <div className="font-semibold text-brand-800 mb-2 capitalize">
                                {task.replace(/_/g, ' ')}
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 w-20">主力:</span>
                                    <select
                                        value={routing.primary}
                                        onChange={(e) => updateTaskRouting(task, e.target.value)}
                                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm"
                                    >
                                        {config.llm_providers.filter(m => m.status === 'active').map(model => (
                                            <option key={model.id} value={model.id}>{model.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 w-20">备用:</span>
                                    <span className="text-sm text-gray-800">
                                        {config.llm_providers.find(m => m.id === routing.fallback)?.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 w-20">经济:</span>
                                    <span className="text-sm text-gray-800">
                                        {config.llm_providers.find(m => m.id === routing.budget_option)?.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Feature Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-dense-6">
                <div className="card">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="text-green-600" size={24} />
                        </div>
                        <div>
                            <div className="font-semibold text-brand-800">成本控制</div>
                            <div className="text-sm text-gray-600">Cost Control</div>
                        </div>
                    </div>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-green-600 mt-0.5" />
                            <span>按任务类型智能路由</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-green-600 mt-0.5" />
                            <span>简单任务用经济模型</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-green-600 mt-0.5" />
                            <span>自托管模型无限使用</span>
                        </li>
                    </ul>
                </div>

                <div className="card">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Zap className="text-purple-600" size={24} />
                        </div>
                        <div>
                            <div className="font-semibold text-brand-800">性能优化</div>
                            <div className="text-sm text-gray-600">Performance</div>
                        </div>
                    </div>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-purple-600 mt-0.5" />
                            <span>复杂推理用顶级模型</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-purple-600 mt-0.5" />
                            <span>自动Fallback容错</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-purple-600 mt-0.5" />
                            <span>流式输出即时反馈</span>
                        </li>
                    </ul>
                </div>

                <div className="card">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Shield className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <div className="font-semibold text-brand-800">数据隐私</div>
                            <div className="text-sm text-gray-600">Data Privacy</div>
                        </div>
                    </div>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-blue-600 mt-0.5" />
                            <span>自托管LLaMA3完全隐私</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-blue-600 mt-0.5" />
                            <span>敏感数据本地处理</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-blue-600 mt-0.5" />
                            <span>符合医药行业合规要求</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="card">
                <div className="flex gap-4">
                    <button
                        onClick={() => applyProfile(selectedProfile)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Settings size={20} />
                        应用配置 Apply Configuration
                    </button>
                    <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        测试模型 Test Models
                    </button>
                    <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        查看使用统计 View Usage Stats
                    </button>
                </div>

                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                    <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                        <span className="font-semibold">提示:</span> 更改配置后需重启AI服务生效。自托管模型需要配置GPU服务器。
                        Configuration changes require AI service restart. Self-hosted models need GPU server setup.
                    </div>
                </div>
            </div>
        </div>
    );
}
