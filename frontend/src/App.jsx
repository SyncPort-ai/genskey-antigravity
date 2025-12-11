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
import PatientRecruitment from './pages/PatientRecruitment';
import ProductionSchedule from './pages/ProductionSchedule';
import FinancialDashboard from './pages/FinancialDashboard';
import MLOps from './pages/MLOps';
import * as Pages from './pages/PlaceholderPages';

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
                        <Route path="/twin/schedule" element={<ProductionSchedule />} />
                        <Route path="/twin/supply" element={<Pages.SupplyChain />} />
                        <Route path="/twin/tech-transfer" element={<Pages.TechTransfer />} />

                        {/* Discovery extra routes */}
                        <Route path="/discovery/targets" element={<Pages.TargetValidation />} />
                        <Route path="/discovery/hit-to-lead" element={<Pages.HitToLead />} />

                        {/* R&D extra routes */}
                        <Route path="/design/formulation" element={<Pages.FormulationLab />} />
                        <Route path="/design/in-vitro" element={<Pages.InVitroTesting />} />
                        <Route path="/design/animal" element={<Pages.AnimalStudies />} />
                        <Route path="/design/ai-lab" element={<Pages.AILab />} />

                        {/* Clinical extra routes */}
                        <Route path="/trial/design" element={<Pages.TrialDesign />} />
                        <Route path="/trial/recruitment" element={<PatientRecruitment />} />
                        <Route path="/trial/regulatory" element={<Pages.RegulatoryAffairs />} />
                        <Route path="/trial/pharmacovigilance" element={<Pages.Pharmacovigilance />} />

                        {/* Data Science extra routes */}
                        <Route path="/data/mlops" element={<MLOps />} />
                        <Route path="/data/analytics" element={<Pages.AnalyticsWorkbench />} />
                        <Route path="/data/knowledge-graph" element={<Pages.KnowledgeGraph />} />

                        {/* AI Copilot extra routes */}
                        <Route path="/copilot/dashboard" element={<Pages.CopilotDashboard />} />
                        <Route path="/copilot/workflows" element={<Pages.WorkflowBuilder />} />
                        <Route path="/copilot/marketplace" element={<Pages.AgentMarketplace />} />

                        {/* Executive extra routes */}
                        <Route path="/executive/finance" element={<FinancialDashboard />} />
                        <Route path="/executive/team" element={<Pages.TeamPerformance />} />
                        <Route path="/executive/reports" element={<Pages.BoardReports />} />

                        {/* Lab routes */}
                        <Route path="/lab/samples" element={<Pages.SampleTracking />} />
                        <Route path="/lab/equipment" element={<Pages.EquipmentManager />} />
                        <Route path="/lab/protocols" element={<Pages.ProtocolLibrary />} />
                        <Route path="/lab/safety" element={<Pages.LabSafety />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
