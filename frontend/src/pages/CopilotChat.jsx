import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, FileText, Database, TrendingUp, AlertCircle } from 'lucide-react';

export default function CopilotChat() {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: '你好！我是基因康AI助手。我可以帮助你进行文献检索、安全评估、方案设计、数据分析等工作。请问有什么可以帮助你的吗？',
            timestamp: new Date(),
            agent: 'Supervisor'
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [activeAgents, setActiveAgents] = useState([
        { name: 'Literature Agent', status: 'idle', icon: FileText },
        { name: 'Safety Agent', status: 'idle', icon: AlertCircle },
        { name: 'Design Agent', status: 'active', icon: Sparkles },
        { name: 'Analysis Agent', status: 'idle', icon: TrendingUp }
    ]);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = {
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const responses = [
                {
                    agent: 'Literature Agent',
                    content: `已在PubMed检索到15篇相关文献。关键发现：\n\n1. Faecalibacterium prausnitzii 与IBD缓解率显著相关 (p<0.001)\n2. 最新meta分析显示益生菌联合疗法优于单一菌株 (RR=1.45)\n3. 中国人群的肠道菌群组成与欧美人群存在显著差异\n\n完整文献列表已保存到数据湖。`
                },
                {
                    agent: 'Safety Agent',
                    content: '安全性分析完成：\n\n✅ 未检测到AMR基因\n✅ 未检测到毒力因子\n✅ GRAS认证状态：合格\n✅ 耐酸耐胆汁测试：通过\n\n建议：可以进入临床前研究阶段。'
                },
                {
                    agent: 'Design Agent',
                    content: '基于GNN模型优化的菌群组合方案：\n\n**推荐配方 #1:**\n- F. prausnitzii (40%)\n- B. longum (30%)\n- A. muciniphila (20%)\n- R. intestinalis (10%)\n\n预测协同指数：0.87 (高协同)\n代谢互补性：0.92\nIBD改善概率：78%\n\n是否需要我生成详细的制剂方案？'
                }
            ];

            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: randomResponse.content,
                timestamp: new Date(),
                agent: randomResponse.agent
            }]);

            setIsTyping(false);
        }, 2000);
    };

    const quickActions = [
        { icon: FileText, label: '文献检索', query: '检索IBD相关的益生菌治疗文献' },
        { icon: AlertCircle, label: '安全评估', query: '评估GNS0042菌株的安全性' },
        { icon: Sparkles, label: '设计方案', query: '为IBD患者设计最优菌群配方' },
        { icon: Database, label: '数据分析', query: '分析临床试验GNS-IBD-001的中期结果' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar - Active Agents */}
            <div className="w-64 bg-white border-r border-gray-200 p-4">
                <h2 className="text-lg font-semibold mb-4 text-brand-800">活跃智能体</h2>
                <div className="space-y-3">
                    {activeAgents.map((agent) => (
                        <div key={agent.name} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                            <agent.icon size={20} className={agent.status === 'active' ? 'text-scientific-pass' : 'text-gray-400'} />
                            <div className="flex-1">
                                <div className="text-sm font-medium">{agent.name}</div>
                                <div className="text-xs text-gray-500">
                                    {agent.status === 'active' ? '工作中' : '空闲'}
                                </div>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-scientific-pass animate-pulse' : 'bg-gray-300'}`} />
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-semibold mb-3 text-gray-700">快速操作</h3>
                    <div className="space-y-2">
                        {quickActions.map((action, index) => (
                            <button
                                key={index}
                                onClick={() => setInput(action.query)}
                                className="w-full flex items-center gap-2 p-2 text-sm text-left rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <action.icon size={16} className="text-brand-600" />
                                <span className="text-gray-700">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 p-4">
                    <h1 className="text-2xl font-bold text-brand-800 flex items-center gap-2">
                        <Bot className="text-brand-600" />
                        AI对话助手
                        <span className="text-sm font-normal text-gray-500">Intelligent Copilot Chat</span>
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        基于LangGraph多智能体系统 | 支持文献检索、安全评估、设计优化、数据分析
                    </p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {message.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
                                    <Bot size={20} className="text-white" />
                                </div>
                            )}

                            <div className={`max-w-2xl ${message.role === 'user' ? 'order-first' : ''}`}>
                                {message.role === 'assistant' && message.agent && (
                                    <div className="text-xs text-gray-500 mb-1">
                                        {message.agent}
                                    </div>
                                )}

                                <div
                                    className={`rounded-lg p-4 ${message.role === 'user'
                                            ? 'bg-brand-500 text-white'
                                            : 'bg-white border border-gray-200'
                                        }`}
                                >
                                    <div className="whitespace-pre-wrap">{message.content}</div>
                                    <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-brand-100' : 'text-gray-400'}`}>
                                        {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>

                            {message.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center flex-shrink-0">
                                    <User size={20} className="text-white" />
                                </div>
                            )}
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center">
                                <Bot size={20} className="text-white" />
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-white border-t border-gray-200 p-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="输入你的问题或需求... (例如：分析GNS0042的安全性)"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={20} />
                                发送
                            </button>
                        </div>

                        <div className="mt-2 text-xs text-gray-500 text-center">
                            AI助手可能会出错，请核对重要信息 | 基于GPT-4 + LangGraph
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
