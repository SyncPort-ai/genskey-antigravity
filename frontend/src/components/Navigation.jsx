import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    LayoutDashboard,
    Search,
    Network,
    FlaskConical,
    Microscope,
    Globe,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const Navigation = ({ onLanguageToggle, currentLang }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const [expandedItems, setExpandedItems] = useState(['discovery', 'design']);

    const navItems = [
        {
            id: 'dashboard',
            icon: LayoutDashboard,
            label: t('nav.dashboard'),
            path: '/dashboard'
        },
        {
            id: 'discovery',
            icon: Search,
            label: t('nav.discovery'),
            path: '/discovery',
            children: [
                { label: '文件上传 / Upload', path: '/discovery/upload' },
                { label: '噬菌体检测 / Phage', path: '/discovery/phage' },
                { label: 'BGC挖掘 / BGC', path: '/discovery/bgc' },
                { label: '基因组浏览 / Browser', path: '/discovery/genome' },
            ]
        },
        {
            id: 'design',
            icon: Network,
            label: t('nav.design'),
            path: '/design',
            children: [
                { label: '互作网络 / Network', path: '/design/network' },
                { label: '优化设计 / Optimize', path: '/design/optimize' },
                { label: '代谢模拟 / Simulate', path: '/design/simulate' },
            ]
        },
        {
            id: 'twin',
            icon: FlaskConical,
            label: t('nav.twin'),
            path: '/twin',
            children: [
                { label: '批次监控 / Batches', path: '/twin/batches' },
                { label: '实时数据 / Real-time', path: '/twin/realtime' },
                { label: '场景分析 / Scenarios', path: '/twin/scenarios' },
            ]
        },
        {
            id: 'trial',
            icon: Microscope,
            label: t('nav.trial'),
            path: '/trial',
            children: [
                { label: '安全评估 / Safety', path: '/trial/safety' },
                { label: '临床试验 / Trials', path: '/trial/clinical' },
                { label: '合规审计 / Audit', path: '/trial/audit' },
            ]
        },
    ];

    const toggleExpanded = (id) => {
        setExpandedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <div className="w-64 bg-white border-r border-enterprise-200 flex flex-col h-screen">
            {/* Logo Header */}
            <div className="p-6 border-b border-enterprise-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        基
                    </div>
                    <div>
                        <div className="font-bold text-enterprise-900">基因康</div>
                        <div className="text-xs text-enterprise-600">Genskey Bio</div>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    const expanded = expandedItems.includes(item.id);

                    return (
                        <div key={item.id} className="mb-1">
                            <Link
                                to={item.path}
                                onClick={() => item.children && toggleExpanded(item.id)}
                                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                  ${active
                                        ? 'bg-brand-50 text-brand-700 font-medium'
                                        : 'text-enterprise-700 hover:bg-enterprise-100'
                                    }
                `}
                            >
                                <Icon size={18} />
                                <span className="flex-1 text-sm-cn">{item.label}</span>
                                {item.children && (
                                    <ChevronRight
                                        size={14}
                                        className={`transition-transform ${expanded ? 'rotate-90' : ''}`}
                                    />
                                )}
                            </Link>

                            {/* Sub-items */}
                            {item.children && expanded && (
                                <div className="ml-9 mt-1 space-y-1">
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.path}
                                            to={child.path}
                                            className={`
                        block px-3 py-1.5 rounded text-xs-cn transition-all
                        ${location.pathname === child.path
                                                    ? 'text-brand-600 bg-brand-50 font-medium'
                                                    : 'text-enterprise-600 hover:text-enterprise-900 hover:bg-enterprise-50'
                                                }
                      `}
                                        >
                                            {child.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-enterprise-200">
                <button
                    onClick={onLanguageToggle}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-enterprise-100 transition-colors text-sm-cn text-enterprise-700"
                >
                    <Globe size={16} />
                    <span>{currentLang === 'zh' ? '中文' : 'English'}</span>
                </button>

                <div className="mt-3 px-3 text-xs text-enterprise-500">
                    Version 1.0.0
                </div>
            </div>
        </div>
    );
};

export default Navigation;
