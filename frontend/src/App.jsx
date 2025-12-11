import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import DiscoveryModule from './pages/DiscoveryModule';
import DesignModule from './pages/DesignModule';
import TwinModule from './pages/TwinModule';
import TrialModule from './pages/TrialModule';
import StrainLibrary from './pages/StrainLibrary';
import DataLake from './pages/DataLake';
import CopilotChat from './pages/CopilotChat';
import ExecutivePortfolio from './pages/ExecutivePortfolio';
import QualityControl from './pages/QualityControl';

function App() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'zh' ? 'en' : 'zh';
        i18n.changeLanguage(newLang);
    };

    return (
        <BrowserRouter>
            <div className="min-h-screen flex bg-enterprise-50">
                {/* Navigation Sidebar */}
                <Navigation onLanguageToggle={toggleLanguage} currentLang={i18n.language} />

                {/* Main Content Area */}
                <div className="flex-1 overflow-auto">
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />

                        {/* Discovery Routes */}
                        <Route path="/discovery/library" element={<StrainLibrary />} />
                        <Route path="/discovery/*" element={<DiscoveryModule />} />

                        {/* Design Routes */}
                        <Route path="/design/*" element={<DesignModule />} />

                        {/* Manufacturing/Twin Routes */}
                        <Route path="/twin/*" element={<TwinModule />} />

                        {/* Clinical/Trial Routes */}
                        <Route path="/trial/*" element={<TrialModule />} />

                        {/* Data Science Routes */}
                        <Route path="/data/lake" element={<DataLake />} />

                        {/* AI Copilot Routes */}
                        <Route path="/copilot/chat" element={<CopilotChat />} />

                        {/* Executive Routes */}
                        <Route path="/executive/portfolio" element={<ExecutivePortfolio />} />

                        {/* Manufacturing/QC Routes */}
                        <Route path="/twin/qc" element={<QualityControl />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
