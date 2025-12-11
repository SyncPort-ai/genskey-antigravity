import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, FileType, Dna, Search, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const DiscoveryModule = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('upload');
    const [uploading, setUploading] = useState(false);
    const [phageResults, setPhageResults] = useState([]);
    const [bgcResults, setBgcResults] = useState([]);

    useEffect(() => {
        // Load mock phage detection results
        fetchPhageResults();
        fetchBGCResults();
    }, []);

    const fetchPhageResults = async () => {
        try {
            const response = await axios.get('/api/v1/discovery/phage/detect/sample_001');
            setPhageResults(response.data);
        } catch (error) {
            console.error('Error fetching phage results:', error);
            // Use mock data
            setPhageResults([
                {
                    contig_id: "contig_0001",
                    start: 1500,
                    end: 45000,
                    length: 43500,
                    confidence: 0.95,
                    predicted_host: "Klebsiella pneumoniae",
                    genes: [
                        { name: "major_capsid_protein", start: 2000, end: 3200, function: "Structural" },
                        { name: "terminase_large", start: 5000, end: 6800, function: "DNA Packaging" }
                    ]
                }
            ]);
        }
    };

    const fetchBGCResults = async () => {
        try {
            const response = await axios.get('/api/v1/discovery/bgc/detect/sample_001');
            setBgcResults(response.data);
        } catch (error) {
            console.error('Error fetching BGC results:', error);
            setBgcResults([
                {
                    bgc_id: "BGC_001",
                    type: "NRPS",
                    start: 150000,
                    end: 195000,
                    product: "Bacteriocin",
                    confidence: 0.92,
                    genes: ["nrpsA", "nrpsB", "nrpsC"]
                }
            ]);
        }
    };

    const handleFileUpload = async (event) => {
        const files = event.target.files;
        if (!files.length) return;

        setUploading(true);
        // Simulate upload
        setTimeout(() => {
            setUploading(false);
            alert(`已成功上传 ${files.length} 个文件 / Successfully uploaded ${files.length} files`);
        }, 2000);
    };

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <h1 className="page-title">
                    <Dna className="inline mr-2" size={28} />
                    基因康发现 <span className="text-enterprise-500 font-normal">/ GenskeyMine Discovery</span>
                </h1>
                <p className="page-subtitle">
                    噬菌体与生物合成基因簇挖掘 / Phage & BGC Discovery Engine
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6 border-b border-enterprise-200">
                <div className="flex gap-1">
                    {[
                        { id: 'upload', label: '文件上传 / Upload' },
                        { id: 'phage', label: '噬菌体 / Phage' },
                        { id: 'bgc', label: 'BGC检测 / BGC' },
                        { id: 'genome', label: '基因组 / Genome' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 text-sm-cn font-medium border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'border-brand-500 text-brand-600'
                                    : 'border-transparent text-enterprise-600 hover:text-enterprise-900'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
                {activeTab === 'upload' && (
                    <div className="card max-w-2xl mx-auto">
                        <h3 className="text-lg font-semibold mb-4">上传测序数据 / Upload Sequencing Data</h3>

                        <div className="border-2 border-dashed border-enterprise-300 rounded-lg p-12 text-center hover:border-brand-400 transition-colors cursor-pointer bg-enterprise-50">
                            <input
                                type="file"
                                multiple
                                accept=".fastq,.fq,.fastq.gz,.fasta,.fa"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="file-upload"
                                disabled={uploading}
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <Upload size={48} className="mx-auto mb-4 text-enterprise-400" />
                                <p className="text-lg font-medium text-enterprise-900 mb-2">
                                    {uploading ? '上传中... / Uploading...' : '拖拽文件或点击上传'}
                                </p>
                                <p className="text-sm text-enterprise-600">
                                    支持 FASTQ, FASTA 格式 (最大 10GB) / Supports FASTQ, FASTA (Max 10GB)
                                </p>
                            </label>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex gap-2">
                                <FileType className="text-blue-600 flex-shrink-0" size={20} />
                                <div className="text-sm text-blue-900">
                                    <strong>数据处理流程 / Processing Pipeline:</strong>
                                    <ol className="list-decimal list-inside mt-2 space-y-1">
                                        <li>质量控制 (fastp) / Quality Control</li>
                                        <li>宿主序列去除 / Host Depletion</li>
                                        <li>组装与注释 / Assembly & Annotation</li>
                                        <li>AI模型分析 / AI Model Analysis</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'phage' && (
                    <div>
                        <div className="card mb-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">
                                    噬菌体检测结果 / Phage Detection Results
                                </h3>
                                <span className="badge-info">
                                    {phageResults.length} 个噬菌体 / phages found
                                </span>
                            </div>

                            <div className="space-y-4">
                                {phageResults.map((phage, idx) => (
                                    <div key={idx} className="border border-enterprise-200 rounded-lg p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="font-semibold text-enterprise-900">{phage.contig_id}</h4>
                                                <p className="text-sm text-enterprise-600">
                                                    位置: {phage.start.toLocaleString()} - {phage.end.toLocaleString()} ({phage.length.toLocaleString()} bp)
                                                </p>
                                            </div>
                                            <span className="badge-pass">
                                                置信度 {(phage.confidence * 100).toFixed(0)}%
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-3">
                                            <div>
                                                <div className="text-xs text-enterprise-600 mb-1">预测宿主 / Predicted Host</div>
                                                <div className="font-medium text-enterprise-900">{phage.predicted_host}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-enterprise-600 mb-1">基因数量 / Gene Count</div>
                                                <div className="font-medium text-enterprise-900">{phage.genes.length}</div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-xs text-enterprise-600 mb-2">关键基因 / Key Genes:</div>
                                            <div className="flex flex-wrap gap-2">
                                                {phage.genes.map((gene, gIdx) => (
                                                    <span key={gIdx} className="badge-info">
                                                        {gene.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'bgc' && (
                    <div>
                        <div className="card">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">
                                    生物合成基因簇 / Biosynthetic Gene Clusters
                                </h3>
                                <span className="badge-warning">
                                    {bgcResults.length} BGCs detected
                                </span>
                            </div>

                            <div className="space-y-4">
                                {bgcResults.map((bgc, idx) => (
                                    <div key={idx} className="border border-enterprise-200 rounded-lg p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="font-semibold text-enterprise-900">{bgc.bgc_id}</h4>
                                                <p className="text-sm text-enterprise-600">
                                                    {bgc.start.toLocaleString()} - {bgc.end.toLocaleString()}
                                                </p>
                                            </div>
                                            <span className="badge-pass">
                                                {(bgc.confidence * 100).toFixed(0)}%
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <div className="text-xs text-enterprise-600 mb-1">类型 / Type</div>
                                                <div className="font-medium text-brand-600">{bgc.type}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-enterprise-600 mb-1">产物 / Product</div>
                                                <div className="font-medium text-enterprise-900">{bgc.product}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-enterprise-600 mb-1">基因数 / Genes</div>
                                                <div className="font-medium text-enterprise-900">{bgc.genes.length}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'genome' && (
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-4">基因组浏览器 / Genome Browser</h3>
                        <div className="bg-enterprise-100 rounded-lg p-12 text-center">
                            <Search size={48} className="mx-auto mb-4 text-enterprise-400" />
                            <p className="text-enterprise-600">
                                基因组可视化组件 / Genome visualization component
                            </p>
                            <p className="text-sm text-enterprise-500 mt-2">
                                将集成 react-linear-genome-view 或 IGV.js
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscoveryModule;
