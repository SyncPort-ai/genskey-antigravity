import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import DiscoveryModule from './pages/DiscoveryModule';
import DesignModule from './pages/DesignModule';
import TwinModule from './pages/TwinModule';
import TrialModule from './pages/TrialModule';

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
                        <Route path="/discovery/*" element={<DiscoveryModule />} />
                        <Route path="/design/*" element={<DesignModule />} />
                        <Route path="/twin/*" element={<TwinModule />} />
                        <Route path="/trial/*" element={<TrialModule />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
