import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    LayoutDashboard,
    Search,
    Network,
    FlaskConical,
    Microscope,
    Globe,
    ChevronRight,
    Activity,
    FileText,
    Database,
    Bot,
    TrendingUp
} from 'lucide-react';
import { useState } from 'react';

const Navigation = ({ onLanguageToggle, currentLang }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const [expandedItems, setExpandedItems] = useState(['discovery', 'design']);

    const navItems = [
        {
            id: 'dashboard',
            label: t('nav.dashboard'),
            icon: LayoutDashboard,
            path: '/dashboard'
        },
        {
            id: 'discovery',
            label: t('nav.discovery'),
            icon: FlaskConical,
            children: [
                { label: t('nav.discovery_phage'), path: '/discovery/phage' },
                { label: t('nav.discovery_bgc'), path: '/discovery/bgc' },
                { label: t('nav.discovery_targets'), path: '/discovery/targets' },
                { label: t('nav.discovery_library'), path: '/discovery/library' },
                { label: t('nav.discovery_hit_to_lead'), path: '/discovery/hit-to-lead' },
                { label: '候选排序 Candidate Ranker', path: '/discovery/candidate-ranker' }
            ]
        },
        {
            id: 'design',
            label: t('nav.design'),
            icon: Network,
            children: [
                { label: t('nav.design_network'), path: '/design/network' },
                { label: t('nav.design_formulation'), path: '/design/formulation' },
                { label: t('nav.design_in_vitro'), path: '/design/in-vitro' },
                { label: t('nav.design_animal'), path: '/design/animal' },
                { label: t('nav.design_ai_lab'), path: '/design/ai-lab' }
            ]
        },
        {
            id: 'twin',
            label: t('nav.twin'),
            icon: Activity,
            children: [
                { label: t('nav.twin_monitor'), path: '/twin/monitor' },
                { label: t('nav.twin_schedule'), path: '/twin/schedule' },
                { label: t('nav.twin_qc'), path: '/twin/qc' },
                { label: t('nav.twin_supply'), path: '/twin/supply' },
                { label: t('nav.twin_tech_transfer'), path: '/twin/tech-transfer' }
            ]
        },
        {
            id: 'trial',
            label: t('nav.trial'),
            icon: FileText,
            children: [
                { label: t('nav.trial_safety'), path: '/trial/safety' },
                { label: t('nav.trial_design'), path: '/trial/design' },
                { label: t('nav.trial_recruitment'), path: '/trial/recruitment' },
                { label: t('nav.trial_regulatory'), path: '/trial/regulatory' },
                { label: t('nav.trial_pharmacovigilance'), path: '/trial/pharmacovigilance' }
            ]
        },
        {
            id: 'data',
            label: t('nav.data_science'),
            icon: Database,
            children: [
                { label: t('nav.data_lake'), path: '/data/lake' },
                { label: t('nav.data_mlops'), path: '/data/mlops' },
                { label: t('nav.data_analytics'), path: '/data/analytics' },
                { label: t('nav.data_knowledge_graph'), path: '/data/knowledge-graph' }
            ]
        },
        {
            id: 'copilot',
            label: t('nav.copilot'),
            icon: Bot,
            children: [
                { label: t('nav.copilot_dashboard'), path: '/copilot/dashboard' },
                { label: t('nav.copilot_chat'), path: '/copilot/chat' },
                { label: 'LLM配置 LLM Config', path: '/copilot/llm-config' },
                { label: '文档生成 Document Generator', path: '/copilot/document-generator' },
                { label: t('nav.copilot_workflows'), path: '/copilot/workflows' },
                { label: t('nav.copilot_marketplace'), path: '/copilot/marketplace' }
            ]
        },
        {
            id: 'executive',
            label: t('nav.executive'),
            icon: TrendingUp,
            children: [
                { label: t('nav.executive_portfolio'), path: '/executive/portfolio' },
                { label: t('nav.executive_finance'), path: '/executive/finance' },
                { label: t('nav.executive_team'), path: '/executive/team' },
                { label: t('nav.executive_reports'), path: '/executive/reports' }
            ]
        },
        {
            id: 'lab',
            label: t('nav.lab'),
            icon: Microscope,
            children: [
                { label: t('nav.lab_samples'), path: '/lab/samples' },
                { label: t('nav.lab_equipment'), path: '/lab/equipment' },
                { label: t('nav.lab_protocols'), path: '/lab/protocols' },
                { label: t('nav.lab_safety'), path: '/lab/safety' }
            ]
        }
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
