import { useState } from 'react';
import { Network, Search } from 'lucide-react';

export default function KnowledgeGraph() {
    const nodes = [
        { id: 'F. prausnitzii', type: 'Microbe', connections: 8 },
        { id: 'IBD', type: 'Disease', connections: 12 },
        { id: 'SCFAs', type: 'Metabolite', connections: 6 },
        { id: 'IL-10', type: 'Cytokine', connections: 5 },
        { id: 'Mucin', type: 'Host Factor', connections: 4 }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <div className="mb-dense-6">
                <h1 className="text-3xl font-bold text-brand-800 mb-dense-2">
                    知识图谱 <span className="text-lg font-normal text-gray-600">Knowledge Graph</span>
                </h1>
                <p className="text-gray-600">Neo4j图数据库浏览器 | Graph Database Browser</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-dense-4 mb-dense-6">
                <div className="card bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                    <Network size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">1,247</div>
                    <div className="text-sm opacity-90">节点总数</div>
                </div>
                <div className="card bg-gradient-to-br from-scientific-pass to-green-600 text-white">
                    <div className="text-2xl font-bold">3,856</div>
                    <div className="text-sm opacity-90">关系总数</div>
                </div>
                <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-sm opacity-90">节点类型</div>
                </div>
                <div className="card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-sm opacity-90">关系类型</div>
                </div>
            </div>

            {/* Search */}
            <div className="card mb-dense-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="搜索节点或关系... (例: F. prausnitzii, IBD, produces)"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                    />
                </div>
            </div>

            {/* Graph Visualization Placeholder */}
            <div className="card mb-dense-6">
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                        <Network size={64} className="mx-auto text-brand-600 mb-4" />
                        <p className="text-gray-600 mb-2">Neo4j图可视化</p>
                        <p className="text-sm text-gray-500">集成Neo4j Bloom或D3.js进行交互式图谱展示</p>
                    </div>
                </div>
            </div>

            {/* Node Table */}
            <div className="card">
                <h2 className="text-xl font-semibold mb-4 text-brand-800">热门节点 Top Nodes</h2>
                <div className="overflow-x-auto">
                    <table className="table-dense">
                        <thead>
                            <tr>
                                <th>节点ID</th>
                                <th>类型</th>
                                <th>连接数</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nodes.map((node) => (
                                <tr key={node.id} className="hover:bg-gray-50">
                                    <td className="font-semibold">{node.id}</td>
                                    <td><span className="badge bg-brand-100 text-brand-700">{node.type}</span></td>
                                    <td className="text-right font-semibold">{node.connections}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
