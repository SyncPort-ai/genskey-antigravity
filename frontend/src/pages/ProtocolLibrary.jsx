import { useState } from 'react';
import { FileText, Search, Download, FolderOpen, Clock } from 'lucide-react';

export default function ProtocolLibrary() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const protocols = [
        {
            id: 'SOP-LAB-001',
            title: '微生物培养标准操作规程',
            category: '实验室操作',
            version: 'v2.3',
            effectiveDate: '2025-01-01',
            author: '张伟',
            status: 'active',
            downloads: 45
        },
        {
            id: 'SOP-QC-002',
            title: '活菌计数检测方法',
            category: '质量控制',
            version: 'v1.8',
            effectiveDate: '2024-11-15',
            author: '李娜',
            status: 'active',
            downloads: 67
        },
        {
            id: 'SOP-MFG-003',
            title: '发酵工艺参数设定',
            category: '生产制造',
            version: 'v3.1',
            effectiveDate: '2025-02-01',
            author: '王强',
            status: 'active',
            downloads: 89
        },
        {
            id: 'SOP-SAFE-004',
            title: '生物安全柜使用与维护',
            category: '安全管理',
            version: 'v2.0',
            effectiveDate: '2024-09-10',
            author: '刘静',
            status: 'active',
            downloads: 52
        },
        {
            id: 'SOP-DATA-005',
            title: '16S rRNA测序数据分析流程',
            category: '数据分析',
            version: 'v1.5',
            effectiveDate: '2024-12-01',
            author: '陈明',
            status: 'active',
            downloads: 38
        },
        {
            id: 'SOP-CLIN-006',
            title: '临床样本采集与保存',
            category: '临床试验',
            version: 'v2.2',
            effectiveDate: '2025-01-15',
            author: '赵敏',
            status: 'active',
            downloads: 73
        },
        {
            id: 'SOP-FORM-007',
            title: '冻干制剂制备工艺',
            category: '制剂开发',
            version: 'v1.9',
            effectiveDate: '2024-10-20',
            author: '周杰',
            status: 'active',
            downloads: 41
        },
        {
            id: 'SOP-REG-008',
            title: 'IND申报资料准备清单',
            category: '法规事务',
            version: 'v1.2',
            effectiveDate: '2024-08-05',
            author: '吴磊',
            status: 'revision',
            downloads: 28
        }
    ];

    const categories = [
        { value: 'all', label: '全部', count: protocols.length },
        { value: '实验室操作', label: '实验室操作', count: protocols.filter(p => p.category === '实验室操作').length },
        { value: '质量控制', label: '质量控制', count: protocols.filter(p => p.category === '质量控制').length },
        { value: '生产制造', label: '生产制造', count: protocols.filter(p => p.category === '生产制造').length },
        { value: '安全管理', label: '安全管理', count: protocols.filter(p => p.category === '安全管理').length },
        { value: '数据分析', label: '数据分析', count: protocols.filter(p => p.category === '数据分析').length },
        { value: '临床试验', label: '临床试验', count: protocols.filter(p => p.category === '临床试验').length },
        { value: '制剂开发', label: '制剂开发', count: protocols.filter(p => p.category === '制剂开发').length },
        { value: '法规事务', label: '法规事务', count: protocols.filter(p => p.category === '法规事务').length }
    ];

    const filteredProtocols = protocols.filter(protocol => {
        const matchesSearch = protocol.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            protocol.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || protocol.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getStatusBadge = (status) => {
        if (status === 'active') {
            return <span className="badge badge-pass">生效中</span>;
        }
        return <span className="badge bg-scientific-warning text-white">修订中</span>;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <div className="mb-dense-6">
                <h1 className="text-3xl font-bold text-brand-800 mb-dense-2">
                    方案库 <span className="text-lg font-normal text-gray-600">Protocol Library</span>
                </h1>
                <p className="text-gray-600">SOP文档管理系统 | SOP Document Management System</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-dense-4 mb-dense-6">
                <div className="card bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                    <FileText size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{protocols.length}</div>
                    <div className="text-sm opacity-90">SOP文档总数</div>
                </div>

                <div className="card bg-gradient-to-br from-scientific-pass to-green-600 text-white">
                    <FolderOpen size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{categories.length - 1}</div>
                    <div className="text-sm opacity-90">文档类别</div>
                </div>

                <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                    <Download size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{protocols.reduce((sum, p) => sum + p.downloads, 0)}</div>
                    <div className="text-sm opacity-90">总下载次数</div>
                </div>

                <div className="card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                    <Clock size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{protocols.filter(p => p.status === 'revision').length}</div>
                    <div className="text-sm opacity-90">待修订</div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="card mb-dense-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="搜索SOP编号或标题..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label} ({cat.count})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Protocol Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-dense-4">
                {filteredProtocols.map((protocol) => (
                    <div key={protocol.id} className="card hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-mono text-sm font-semibold text-brand-600">{protocol.id}</span>
                                    {getStatusBadge(protocol.status)}
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{protocol.title}</h3>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className="badge bg-brand-100 text-brand-700">{protocol.category}</span>
                                    <span className="badge bg-gray-100 text-gray-700">{protocol.version}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                            <div className="flex justify-between">
                                <span>生效日期:</span>
                                <span className="font-semibold">{new Date(protocol.effectiveDate).toLocaleDateString('zh-CN')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>编制人:</span>
                                <span className="font-semibold">{protocol.author}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>下载次数:</span>
                                <span className="font-semibold">{protocol.downloads}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="flex-1 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 flex items-center justify-center gap-2">
                                <FileText size={16} />
                                查看
                            </button>
                            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                <Download size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProtocols.length === 0 && (
                <div className="card text-center py-12">
                    <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">未找到匹配的SOP文档</p>
                </div>
            )}
        </div>
    );
}
