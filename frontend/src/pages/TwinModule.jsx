import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlaskConical, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';

const TwinModule = () => {
    const { t } = useTranslation();
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [sensorData, setSensorData] = useState(null);
    const [historicalData, setHistoricalData] = useState(null);

    useEffect(() => {
        fetchBatches();
    }, []);

    useEffect(() => {
        if (selectedBatch) {
            fetchSensorData(selectedBatch);
            fetchHistoricalData(selectedBatch);
        }
    }, [selectedBatch]);

    const fetchBatches = async () => {
        try {
            const response = await axios.get('/api/v1/twin/batches/active');
            setBatches(response.data.batches);
            if (response.data.batches.length > 0) {
                setSelectedBatch(response.data.batches[0].batch_id);
            }
        } catch (error) {
            console.error('Error fetching batches:', error);
            const mockBatches = [
                {
                    batch_id: 'BATCH-2025-001',
                    strain_name: 'Faecalibacterium prausnitzii GK-001',
                    current_phase: '指数生长期 / Exponential Phase',
                    duration_hours: 12.0
                }
            ];
            setBatches(mockBatches);
            setSelectedBatch(mockBatches[0].batch_id);
        }
    };

    const fetchSensorData = async (batchId) => {
        try {
            const response = await axios.get(`/api/v1/twin/sensors/current/${batchId}`);
            setSensorData(response.data);
        } catch (error) {
            setSensorData({
                temperature: 37.1,
                ph: 6.85,
                dissolved_oxygen: 0.48,
                agitation_speed: 150,
                off_gas_co2: 3.6
            });
        }
    };

    const fetchHistoricalData = async (batchId) => {
        try {
            const response = await axios.get(`/api/v1/twin/history/${batchId}?hours=24`);
            setHistoricalData(response.data);
        } catch (error) {
            // Mock historical data
            const timePoints = Array.from({ length: 24 }, (_, i) => i);
            setHistoricalData({
                time_hours: timePoints,
                data: {
                    temperature: timePoints.map(t => 37 + Math.sin(t / 4) * 0.3),
                    ph: timePoints.map(t => 7.0 - 0.01 * t + Math.random() * 0.1),
                    biomass: timePoints.map(t => 0.5 + t * 0.3),
                    product: timePoints.map(t => 0.2 + t * 0.5)
                }
            });
        }
    };

    const getTrendChartOption = () => {
        if (!historicalData) return {};

        return {
            title: {
                text: '发酵过程趋势 / Fermentation Trends',
                textStyle: { fontSize: 14, fontWeight: 'bold' }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'cross' }
            },
            legend: {
                data: ['温度 / Temp', 'pH', '生物量 / Biomass', '产物 / Product'],
                bottom: 0
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: historicalData.time_hours.map(t => `${t}h`)
            },
            yAxis: [
                {
                    type: 'value',
                    name: '温度/pH',
                    position: 'left'
                },
                {
                    type: 'value',
                    name: '浓度 (g/L)',
                    position: 'right'
                }
            ],
            series: [
                {
                    name: '温度 / Temp',
                    type: 'line',
                    data: historicalData.data.temperature,
                    smooth: true,
                    itemStyle: { color: '#ef4444' }
                },
                {
                    name: 'pH',
                    type: 'line',
                    data: historicalData.data.ph,
                    smooth: true,
                    itemStyle: { color: '#f59e0b' }
                },
                {
                    name: '生物量 / Biomass',
                    type: 'line',
                    yAxisIndex: 1,
                    data: historicalData.data.biomass,
                    smooth: true,
                    itemStyle: { color: '#10b981' }
                },
                {
                    name: '产物 / Product',
                    type: 'line',
                    yAxisIndex: 1,
                    data: historicalData.data.product,
                    smooth: true,
                    itemStyle: { color: '#0ea5e9' }
                }
            ]
        };
    };

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <h1 className="page-title">
                    <FlaskConical className="inline mr-2" size={28} />
                    基因康孪生 <span className="text-enterprise-500 font-normal">/ GenskeyTwin Digital Manufacturing</span>
                </h1>
                <p className="page-subtitle">
                    实时发酵监控与过程优化 / Real-time Fermentation Monitoring
                </p>
            </div>

            {/* Batch Selection */}
            <div className="card mb-6">
                <div className="flex items-center gap-4">
                    <span className="text-sm-cn font-medium text-enterprise-700">选择批次 / Select Batch:</span>
                    {batches.map(batch => (
                        <button
                            key={batch.batch_id}
                            onClick={() => setSelectedBatch(batch.batch_id)}
                            className={`px-4 py-2 rounded-lg text-sm-cn transition-all ${selectedBatch === batch.batch_id
                                    ? 'bg-brand-500 text-white shadow-md'
                                    : 'bg-enterprise-100 text-enterprise-700 hover:bg-enterprise-200'
                                }`}
                        >
                            <div className="font-medium">{batch.batch_id}</div>
                            <div className="text-xs opacity-80">{batch.current_phase}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Real-time Sensors */}
            {sensorData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    <div className="card">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm-cn text-enterprise-600">温度 / Temperature</span>
                            <Activity size={16} className="text-scientific-pass" />
                        </div>
                        <div className="text-2xl font-bold text-enterprise-900">
                            {sensorData.temperature.toFixed(1)}°C
                        </div>
                        <div className="text-xs text-enterprise-500 mt-1">目标: 37.0±0.5°C</div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm-cn text-enterprise-600">pH值 / pH</span>
                            <Activity size={16} className="text-scientific-pass" />
                        </div>
                        <div className="text-2xl font-bold text-enterprise-900">
                            {sensorData.ph.toFixed(2)}
                        </div>
                        <div className="text-xs text-enterprise-500 mt-1">目标: 6.5-7.5</div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm-cn text-enterprise-600">溶氧 / DO</span>
                            <Activity size={16} className="text-scientific-warning" />
                        </div>
                        <div className="text-2xl font-bold text-enterprise-900">
                            {(sensorData.dissolved_oxygen * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-enterprise-500 mt-1">厌氧条件 / Anaerobic</div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm-cn text-enterprise-600">搅拌 / RPM</span>
                            <TrendingUp size={16} className="text-brand-500" />
                        </div>
                        <div className="text-2xl font-bold text-enterprise-900">
                            {sensorData.agitation_speed}
                        </div>
                        <div className="text-xs text-enterprise-500 mt-1">转/分钟</div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm-cn text-enterprise-600">CO₂排气 / Off-gas</span>
                            <Activity size={16} className="text-brand-500" />
                        </div>
                        <div className="text-2xl font-bold text-enterprise-900">
                            {sensorData.off_gas_co2.toFixed(1)}%
                        </div>
                        <div className="text-xs text-enterprise-500 mt-1">代谢活跃 / Active</div>
                    </div>
                </div>
            )}

            {/* Charts and Predictions */}
            <div className="grid grid-cols-12 gap-6">
                {/* Historical Trends */}
                <div className="col-span-12 lg:col-span-8">
                    <div className="card">
                        {historicalData && (
                            <ReactECharts
                                option={getTrendChartOption()}
                                style={{ height: '400px' }}
                            />
                        )}
                    </div>
                </div>

                {/* Soft Sensor Predictions */}
                <div className="col-span-12 lg:col-span-4">
                    <div className="card">
                        <h3 className="font-semibold text-enterprise-900 mb-4">
                            AI预测 / Soft Sensor
                        </h3>

                        <div className="space-y-4">
                            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                                <div className="text-xs text-emerald-700 mb-1">生物量 / Biomass</div>
                                <div className="text-xl font-bold text-emerald-900">7.5 g/L</div>
                                <div className="text-xs text-emerald-600 mt-1">置信度: 89%</div>
                            </div>

                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="text-xs text-blue-700 mb-1">产物滴度 / Titer</div>
                                <div className="text-xl font-bold text-blue-900">12.3 g/L</div>
                                <div className="text-xs text-blue-600 mt-1">置信度: 85%</div>
                            </div>

                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <div className="text-xs text-amber-700 mb-1">细胞存活率 / Viability</div>
                                <div className="text-xl font-bold text-amber-900">92.5%</div>
                                <div className="text-xs text-amber-600 mt-1">健康状态 / Healthy</div>
                            </div>
                        </div>

                        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                            <div className="flex gap-2">
                                <AlertCircle className="text-yellow-700 flex-shrink-0" size={18} />
                                <div className="text-sm text-yellow-900">
                                    <strong>AI建议 / Recommendation:</strong>
                                    <p className="mt-1">建议在2小时后降低搅拌速度至120 RPM以减少剪切应力</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TwinModule;
