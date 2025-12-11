// Batch 5 - Remaining simplified pages with Chinese UI + English technical terms

import { FlaskConical, Microscope, TrendingUp, Package, Grid, Shield } from 'lucide-react';

export function AnimalStudies() {
    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <h1 className="text-3xl font-bold text-brand-800 mb-4">
                动物实验 <span className="text-lg font-normal text-gray-600">Animal Studies</span>
            </h1>
            <div className="card mb-4">
                <h2 className="text-xl font-semibold mb-3 text-brand-700">临床前动物模型试验 Preclinical Animal Models</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-brand-50 rounded">
                        <div className="font-semibold mb-2">DSS诱导的IBD模型</div>
                        <div className="text-sm text-gray-600">菌株: GNS0042 | 小鼠数: 60 | 疗效: 显著改善 (p&lt;0.01)</div>
                    </div>
                    <div className="p-4 bg-brand-50 rounded">
                        <div className="font-semibold mb-2">db/db糖尿病模型</div>
                        <div className="text-sm text-gray-600">菌株: GNS00 35 | 小鼠数: 48 | HbA1c: ↓28%</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function AILab() {
    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <h1 className="text-3xl font-bold text-brand-800 mb-4">
                AI实验室 <span className="text-lg font-normal text-gray-600">AI Lab</span>
            </h1>
            <div className="card">
                <h2 className="text-xl font-semibold mb-3 text-brand-700">模型训练和AutoML实验 ML Model Training</h2>
                <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded">
                        <div className="font-semibold">GNN-InteractionPredictor v2.4</div>
                        <div className="text-sm text-gray-600 mt-2">Training Accuracy: 89% | Validation: 87% | Test: 85%</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded">
                        <div className="font-semibold">AutoML菌株优化流程</div>
                        <div className="text-sm text-gray-600 mt-2">H2O AutoML | 候选模型: 128 | 最优: XGBoost</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function TechTransfer() {
    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <h1 className="text-3xl font-bold text-brand-800 mb-4">
                技术转移 <span className="text-lg font-normal text-gray-600">Tech Transfer</span>
            </h1>
            <div className="card">
                <h2 className="text-xl font-semibold mb-3 text-brand-700">工艺放大和技术转移 Scale-up & Technology Transfer</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-brand-50 rounded">
                        <div className="text-3xl font-bold text-brand-600">5L → 50L</div>
                        <div className="text-sm mt-2">实验室放大</div>
                    </div>
                    <div className="text-center p-4 bg-brand-50 rounded">
                        <div className="text-3xl font-bold text-brand-600">50L → 500L</div>
                        <div className="text-sm mt-2">中试放大</div>
                    </div>
                    <div className="text-center p-4 bg-brand-50 rounded">
                        <div className="text-3xl font-bold text-brand-600">500L → 2000L</div>
                        <div className="text-sm mt-2">生产规模</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function WorkflowBuilder() {
    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <h1 className="text-3xl font-bold text-brand-800 mb-4">
                工作流构建 <span className="text-lg font-normal text-gray-600">Workflow Builder</span>
            </h1>
            <div className="card">
                <h2 className="text-xl font-semibold mb-3 text-brand-700">LangGraph可视化编辑器 Visual Workflow Editor</h2>
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                    <div className="text-center">
                        <Grid size={48} className="mx-auto text-brand-600 mb-3" />
                        <p className="text-gray-600">LangGraph可视化流程图</p>
                        <p className="text-sm text-gray-500 mt-2">拖拽式多智能体工作流编排</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function AgentMarketplace() {
    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <h1 className="text-3xl font-bold text-brand-800 mb-4">
                智能体市场 <span className="text-lg font-normal text-gray-600">Agent Marketplace</span>
            </h1>
            <div className="card">
                <h2 className="text-xl font-semibold mb-3 text-brand-700">智能体目录和自定义构建 Agent Catalog</h2>
                <div className="grid grid-cols-2 gap-4">
                    {['Literature Agent', 'Safety Agent', 'Design Agent', 'Analysis Agent'].map(name => (
                        <div key={name} className="p-4 border border-brand-200 rounded hover:shadow">
                            <div className="font-semibold">{name}</div>
                            <div className="text-sm text-gray-600 mt-1">专业AI智能体 | 即刻部署</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function BoardReports() {
    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <h1 className="text-3xl font-bold text-brand-800 mb-4">
                董事会报告 <span className="text-lg font-normal text-gray-600">Board Reports</span>
            </h1>
            <div className="card">
                <h2 className="text-xl font-semibold mb-3 text-brand-700">季度总结和战略报告 Quarterly Summary</h2>
                <div className="space-y-3">
                    <div className="p-4 bg-brand-50 rounded">
                        <div className="font-semibold">2025 Q4 研发进展报告</div>
                        <div className="text-sm text-gray-600 mt-2">12个活跃项目 | ¥28.5M支出 | 3篇Nature Publication</div>
                    </div>
                    <div className="p-4 bg-brand-50 rounded">
                        <div className="font-semibold">2026 战略规划</div>
                        <div className="text-sm text-gray-600 mt-2">目标: 2个INDapproval | 预算: ¥50M | 团队扩张: 25%</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function LabSafety() {
    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <h1 className="text-3xl font-bold text-brand-800 mb-4">
                实验室安全 <span className="text-lg font-normal text-gray-600">Lab Safety</span>
            </h1>
            <div className="card">
                <h2 className="text-xl font-semibold mb-3 text-brand-700">安全事件报告和化学品管理 Safety Incident Reporting</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-scientific-pass/10 rounded">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield size={24} className="text-scientific-pass" />
                            <div className="font-semibold">BSL-2实验室</div>
                        </div>
                        <div className="text-sm">状态: 运行正常 | 上次检查: 2天前</div>
                    </div>
                    <div className="p-4 bg-brand-50 rounded">
                        <div className="font-semibold mb-2">化学品库存</div>
                        <div className="text-sm">总数: 156种 | MSDS: 100%完整</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
