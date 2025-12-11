import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Network as NetworkIcon, Zap, Filter, Download } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';

const DesignModule = () => {
    const { t } = useTranslation();
    const [networkData, setNetworkData] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        fetchNetworkData();
    }, []);

    const fetchNetworkData = async () => {
        try {
            const response = await axios.post('/api/v1/design/network/predict', {
                sample_ids: ['sample_001', 'sample_002']
            });
            setNetworkData(response.data);
        } catch (error) {
            console.error('Error fetching network:', error);
            // Use mock data
            setNetworkData({
                nodes: [
                    { id: 'strain_001', name: 'Bacteroides fragilis', name_zh: '脆弱拟杆菌', abundance: 0.35, phylum: 'Bacteroidetes', safety_level: 'BSL-1' },
                    { id: 'strain_002', name: 'Faecalibacterium prausnitzii', name_zh: '普氏粪杆菌', abundance: 0.25, phylum: 'Firmicutes', safety_level: 'BSL-1' },
                    { id: 'strain_003', name: 'Akkermansia muciniphila', name_zh: '嗜黏蛋白阿克曼菌', abundance: 0.15, phylum: 'Verrucomicrobia', safety_level: 'BSL-1' },
                    { id: 'pathogen_001', name: 'Klebsiella pneumoniae', name_zh: '肺炎克雷伯菌', abundance: 0.08, phylum: 'Proteobacteria', safety_level: 'BSL-2' }
                ],
                edges: [
                    { source: 'strain_001', target: 'strain_002', interaction_type: 'mutualism', strength: 0.85, confidence: 0.92 },
                    { source: 'strain_001', target: 'pathogen_001', interaction_type: 'competition', strength: -0.65, confidence: 0.90 },
                    { source: 'strain_003', target: 'pathogen_001', interaction_type: 'competition', strength: -0.72, confidence: 0.85 }
                ]
            });
        }
    };

    const getNetworkChartOption = () => {
        if (!networkData) return {};

        // Filter edges based on selected type
        let edges = networkData.edges;
        if (filterType !== 'all') {
            edges = edges.filter(e => e.interaction_type === filterType);
        }

        // Prepare graph data for ECharts
        const graphNodes = networkData.nodes.map(node => ({
            id: node.id,
            name: node.name_zh || node.name,
            value: node.abundance * 100,
            symbolSize: Math.max(30, node.abundance * 200),
            itemStyle: {
                color: node.safety_level === 'BSL-2' ? '#ef4444' :
                    node.phylum === 'Bacteroidetes' ? '#0ea5e9' :
                        node.phylum === 'Firmicutes' ? '#10b981' :
                            '#f59e0b'
            },
            label: {
                show: true,
                fontSize: 10
            }
        }));

        const graphLinks = edges.map(edge => ({
            source: edge.source,
            target: edge.target,
            value: Math.abs(edge.strength),
            lineStyle: {
                width: Math.abs(edge.strength) * 5,
                color: edge.interaction_type === 'mutualism' ? '#10b981' :
                    edge.interaction_type === 'competition' ? '#ef4444' :
                        '#f59e0b',
                curveness: 0.2
            },
            label: {
                show: false
            }
        }));

        return {
            title: {
                text: '微生物互作网络 / Microbial Interaction Network',
                left: 'center',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                formatter: (params) => {
                    if (params.dataType === 'node') {
                        const node = networkData.nodes.find(n => n.id === params.data.id);
                        return `
              <strong>${node.name_zh}</strong><br/>
              ${node.name}<br/>
              丰度: ${(node.abundance * 100).toFixed(1)}%<br/>
              门: ${node.phylum}<br/>
              安全等级: ${node.safety_level}
            `;
                    } else {
                        const edge = networkData.edges.find(e =>
                            e.source === params.data.source && e.target === params.data.target
                        );
                        return `
              <strong>互作类型:</strong> ${edge.interaction_type}<br/>
              <strong>强度:</strong> ${edge.strength.toFixed(2)}<br/>
              <strong>置信度:</strong> ${(edge.confidence * 100).toFixed(0)}%
            `;
                    }
                }
            },
            series: [
                {
                    type: 'graph',
                    layout: 'force',
                    data: graphNodes,
                    links: graphLinks,
                    roam: true,
                    draggable: true,
                    force: {
                        repulsion: 200,
                        edgeLength: 100,
                        gravity: 0.1
                    },
                    emphasis: {
                        focus: 'adjacency',
                        lineStyle: {
                            width: 8
                        }
                    }
                }
            ]
        };
    };

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <h1 className="page-title">
                    <NetworkIcon className="inline mr-2" size={28} />
                    基因康设计 <span className="text-enterprise-500 font-normal">/ GenskeyDesign Engineering</span>
                </h1>
                <p className="page-subtitle">
                    基于GNN的菌群组合优化 / GNN-based Consortium Optimization
                </p>
            </div>

            {/* Controls */}
            <div className="card mb-6">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-enterprise-600" />
                        <span className="text-sm-cn font-medium text-enterprise-700">互作过滤 / Filter:</span>
                    </div>

                    {['all', 'mutualism', 'competition', 'commensalism'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-3 py-1.5 rounded text-sm-cn transition-colors ${filterType === type
                                    ? 'bg-brand-500 text-white'
                                    : 'bg-enterprise-100 text-enterprise-700 hover:bg-enterprise-200'
                                }`}
                        >
                            {type === 'all' ? '全部 / All' :
                                type === 'mutualism' ? '共生 / Mutual' :
                                    type === 'competition' ? '竞争 / Compete' :
                                        '共栖 / Commensal'}
                        </button>
                    ))}

                    <div className="ml-auto flex gap-2">
                        <button className="btn-primary">
                            <Zap size={16} />
                            优化设计 / Optimize
                        </button>
                        <button className="btn-secondary">
                            <Download size={16} />
                            导出 / Export
                        </button>
                    </div>
                </div>
            </div>

            {/* Network Visualization */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-9">
                    <div className="card">
                        {networkData && (
                            <ReactECharts
                                option={getNetworkChartOption()}
                                style={{ height: '600px' }}
                                opts={{ renderer: 'canvas' }}
                            />
                        )}
                    </div>
                </div>

                {/* Info Panel */}
                <div className="col-span-12 lg:col-span-3">
                    <div className="card">
                        <h3 className="font-semibold text-enterprise-900 mb-4">
                            图例 / Legend
                        </h3>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-brand-500"></div>
                                <span className="text-sm-cn">拟杆菌门</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-scientific-pass"></div>
                                <span className="text-sm-cn">厚壁菌门</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-scientific-warning"></div>
                                <span className="text-sm-cn">疣微菌门</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-scientific-fail"></div>
                                <span className="text-sm-cn">病原菌 (BSL-2)</span>
                            </div>
                        </div>

                        <div className="border-t border-enterprise-200 pt-4">
                            <h4 className="font-semibold text-sm-cn text-enterprise-900 mb-3">
                                网络统计 / Statistics
                            </h4>
                            {networkData && (
                                <div className="space-y-2 text-sm-cn">
                                    <div className="flex justify-between">
                                        <span className="text-enterprise-600">节点数:</span>
                                        <span className="font-medium">{networkData.nodes.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-enterprise-600">互作数:</span>
                                        <span className="font-medium">{networkData.edges.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-enterprise-600">平均置信度:</span>
                                        <span className="font-medium">
                                            {(networkData.edges.reduce((sum, e) => sum + e.confidence, 0) / networkData.edges.length * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card mt-4">
                        <h3 className="font-semibold text-enterprise-900 mb-3">
                            AI模型 / Model Info
                        </h3>
                        <div className="space-y-2 text-sm-cn">
                            <div className="flex justify-between">
                                <span className="text-enterprise-600">模型:</span>
                                <span className="font-medium">MicrobeGAT-v1</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-enterprise-600">注意力头:</span>
                                <span className="font-medium">8</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-enterprise-600">训练样本:</span>
                                <span className="font-medium">15,000</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesignModule;
