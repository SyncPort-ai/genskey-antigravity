import { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Database, Dna, Shield, FileText } from 'lucide-react';
import strainsData from '../data/strains.json';

export default function StrainLibrary() {
    const [strains, setStrains] = useState([]);
    const [filteredStrains, setFilteredStrains] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [safetyFilter, setSafetyFilter] = useState('all');
    const [phylumFilter, setPhylumFilter] = useState('all');
    const [selectedStrain, setSelectedStrain] = useState(null);

    useEffect(() => {
        setStrains(strainsData);
        setFilteredStrains(strainsData);
    }, []);

    useEffect(() => {
        let filtered = strains;

        if (searchTerm) {
            filtered = filtered.filter(s =>
                s.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.strain_id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (safetyFilter !== 'all') {
            filtered = filtered.filter(s => s.safety_level === safetyFilter);
        }

        if (phylumFilter !== 'all') {
            filtered = filtered.filter(s => s.phylum === phylumFilter);
        }

        setFilteredStrains(filtered);
    }, [searchTerm, safetyFilter, phylumFilter, strains]);

    const exportToCSV = () => {
        const headers = ['菌株ID', '物种名称', '门', '基因组大小(MB)', 'GC含量(%)', '安全等级', '状态'];
        const csvData = filteredStrains.map(s => [
            s.strain_id,
            s.species,
            s.phylum,
            s.genome_size_mb,
            s.gc_content,
            s.safety_level,
            s.status
        ]);

        const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `菌株库_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const getSafetyBadgeColor = (level) => {
        const colors = {
            'GRAS': 'bg-scientific-pass text-white',
            'QPS': 'bg-scientific-pass text-white',
            'BSL-1': 'bg-scientific-warning text-white',
            'Under Review': 'bg-gray-500 text-white'
        };
        return colors[level] || 'bg-gray-500 text-white';
    };

    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            {/* Header */}
            <div className="mb-dense-6">
                <h1 className="text-3xl font-bold text-brand-800 mb-dense-2">
                    菌株库 <span className="text-lg font-normal text-gray-600">Strain Library</span>
                </h1>
                <p className="text-gray-600">
                    共 <span className="font-semibold text-brand-600">{strains.length}</span> 株菌株 |
                    筛选后 <span className="font-semibold text-brand-600">{filteredStrains.length}</span> 株
                </p>
            </div>

            {/* Filters */}
            <div className="card mb-dense-6">
                <div className="flex flex-wrap gap-dense-4 items-center">
                    {/* Search */}
                    <div className="flex-1 min-w-[300px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="搜索菌株ID或物种名称..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Safety Filter */}
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                        value={safetyFilter}
                        onChange={(e) => setSafetyFilter(e.target.value)}
                    >
                        <option value="all">所有安全等级</option>
                        <option value="GRAS">GRAS</option>
                        <option value="QPS">QPS</option>
                        <option value="BSL-1">BSL-1</option>
                        <option value="Under Review">审核中</option>
                    </select>

                    {/* Phylum Filter */}
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                        value={phylumFilter}
                        onChange={(e) => setPhylumFilter(e.target.value)}
                    >
                        <option value="all">所有门</option>
                        <option value="Firmicutes">Firmicutes</option>
                        <option value="Bacteroidetes">Bacteroidetes</option>
                        <option value="Proteobacteria">Proteobacteria</option>
                        <option value="Actinobacteria">Actinobacteria</option>
                    </select>

                    <button onClick={exportToCSV} className="btn-primary">
                        <Download size={20} />
                        导出CSV
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-dense-4 mb-dense-6">
                <div className="card bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                    <Database size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{strains.filter(s => s.status === 'Active').length}</div>
                    <div className="text-sm opacity-90">活跃菌株</div>
                </div>

                <div className="card bg-gradient-to-br from-scientific-pass to-green-600 text-white">
                    <Shield size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{strains.filter(s => s.safety_level === 'GRAS' || s.safety_level === 'QPS').length}</div>
                    <div className="text-sm opacity-90">GRAS/QPS认证</div>
                </div>

                <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                    <Dna size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{strains.filter(s => s.sequenced).length}</div>
                    <div className="text-sm opacity-90">已完成测序</div>
                </div>

                <div className="card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                    <FileText size={32} className="mb-2 opacity-80" />
                    <div className="text-2xl font-bold">{strains.reduce((sum, s) => sum + s.num_bgcs, 0)}</div>
                    <div className="text-sm opacity-90">BGC总数</div>
                </div>
            </div>

            {/* Strain Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table-dense">
                        <thead>
                            <tr>
                                <th>菌株ID</th>
                                <th>物种名称</th>
                                <th>门 Phylum</th>
                                <th>基因组大小 (MB)</th>
                                <th>GC含量 (%)</th>
                                <th>基因数</th>
                                <th>BGC</th>
                                <th>安全等级</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStrains.slice(0, 50).map((strain) => (
                                <tr key={strain.strain_id} className="hover:bg-gray-50">
                                    <td className="font-mono font-semibold text-brand-600">{strain.strain_id}</td>
                                    <td className="italic">{strain.species}</td>
                                    <td>{strain.phylum}</td>
                                    <td className="text-right">{strain.genome_size_mb}</td>
                                    <td className="text-right">{strain.gc_content}</td>
                                    <td className="text-right">{strain.num_genes}</td>
                                    <td className="text-right">{strain.num_bgcs}</td>
                                    <td>
                                        <span className={`badge ${getSafetyBadgeColor(strain.safety_level)}`}>
                                            {strain.safety_level}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${strain.status === 'Active' ? 'badge-pass' : 'bg-gray-500 text-white'}`}>
                                            {strain.status === 'Active' ? '活跃' : strain.status === 'Archived' ? '归档' : '测试中'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => setSelectedStrain(strain)}
                                            className="text-brand-600 hover:text-brand-800"
                                            title="查看详情"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredStrains.length > 50 && (
                    <div className="px-6 py-4 border-t border-gray-200 text-center text-gray-600">
                        显示前50条结果，共 {filteredStrains.length} 条
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedStrain && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-brand-800">{selectedStrain.strain_id}</h2>
                                    <p className="text-lg italic text-gray-700">{selectedStrain.species}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedStrain(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="width" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-2 gap-6">
                            {/* Basic Info */}
                            <div className="col-span-2">
                                <h3 className="text-lg font-semibold mb-4 text-brand-700">基本信息</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-gray-600">NCBI Taxonomy ID:</span>
                                        <span className="ml-2 font-mono">{selectedStrain.ncbi_taxonomy_id}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">分离来源:</span>
                                        <span className="ml-2">{selectedStrain.isolation_source}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">采集日期:</span>
                                        <span className="ml-2">{new Date(selectedStrain.collection_date).toLocaleDateString('zh-CN')}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">氧气需求:</span>
                                        <span className="ml-2">{selectedStrain.oxygen_requirement}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Genomic Data */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-brand-700">基因组数据</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">基因组大小:</span>
                                        <span className="font-semibold">{selectedStrain.genome_size_mb} MB</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">GC含量:</span>
                                        <span className="font-semibold">{selectedStrain.gc_content}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">基因数:</span>
                                        <span className="font-semibold">{selectedStrain.num_genes}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">BGC数量:</span>
                                        <span className="font-semibold">{selectedStrain.num_bgcs}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">前噬菌体:</span>
                                        <span className="font-semibold">{selectedStrain.num_prophages}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Safety Profile */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-brand-700">安全性评估</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">安全等级:</span>
                                        <span className={`badge ${getSafetyBadgeColor(selectedStrain.safety_level)}`}>
                                            {selectedStrain.safety_level}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">AMR基因:</span>
                                        <span className={selectedStrain.amr_genes === 0 ? 'text-scientific-pass font-semibold' : 'text-scientific-fail font-semibold'}>
                                            {selectedStrain.amr_genes} 个
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">毒力因子:</span>
                                        <span className={selectedStrain.virulence_factors === 0 ? 'text-scientific-pass font-semibold' : 'text-scientific-fail font-semibold'}>
                                            {selectedStrain.virulence_factors} 个
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">耐胆汁:</span>
                                        <span className="font-semibold">{selectedStrain.bile_tolerance}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">耐酸 pH3:</span>
                                        <span className={`font-semibold ${selectedStrain.acid_tolerance_ph3 ? 'text-scientific-pass' : 'text-scientific-fail'}`}>
                                            {selectedStrain.acid_tolerance_ph3 ? '是' : '否'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Growth Parameters */}
                            <div className="col-span-2">
                                <h3 className="text-lg font-semibold mb-4 text-brand-700">生长参数</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <span className="text-gray-600">生长速率:</span>
                                        <span className="ml-2 font-semibold">{selectedStrain.growth_rate_h} /h</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">最适温度:</span>
                                        <span className="ml-2 font-semibold">{selectedStrain.optimal_temp_c}°C</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">最适pH:</span>
                                        <span className="ml-2 font-semibold">{selectedStrain.optimal_ph}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
                            <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                生成安全报告
                            </button>
                            <button className="btn-primary">
                                加入项目
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
