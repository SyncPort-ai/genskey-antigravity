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
import SampleTracking from './pages/SampleTracking';
import EquipmentManager from './pages/EquipmentManager';
import TargetValidation from './pages/TargetValidation';
import RegulatoryAffairs from './pages/RegulatoryAffairs';
import AnalyticsWorkbench from './pages/AnalyticsWorkbench';
import CopilotDashboard from './pages/CopilotDashboard';
import FormulationLab from './pages/FormulationLab';
import SupplyChain from './pages/SupplyChain';
import TeamPerformance from './pages/TeamPerformance';
import ProtocolLibrary from './pages/ProtocolLibrary';
import HitToLead from './pages/HitToLead';
import InVitroTesting from './pages/InVitroTesting';
import TrialDesign from './pages/TrialDesign';
import Pharmacovigilance from './pages/Pharmacovigilance';
import KnowledgeGraph from './pages/KnowledgeGraph';
import * as FinalPages from './pages/FinalBatchPages';

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
                        <Route path="/twin/supply" element={<SupplyChain />} />
                        <Route path="/twin/tech-transfer" element={<FinalPages.TechTransfer />} />

                        {/* Discovery extra routes */}
                        <Route path="/discovery/targets" element={<TargetValidation />} />
                        <Route path="/discovery/hit-to-lead" element={<HitToLead />} />

                        {/* R&D extra routes */}
                        <Route path="/design/formulation" element={<FormulationLab />} />
                        <Route path="/design/in-vitro" element={<InVitroTesting />} />
                        <Route path="/design/animal" element={<FinalPages.AnimalStudies />} />
                        <Route path="/design/ai-lab" element={<FinalPages.AILab />} />

                        {/* Clinical extra routes */}
                        <Route path="/trial/design" element={<TrialDesign />} />
                        <Route path="/trial/recruitment" element={<PatientRecruitment />} />
                        <Route path="/trial/regulatory" element={<RegulatoryAffairs />} />
                        <Route path="/trial/pharmacovigilance" element={<Pharmacovigilance />} />

                        {/* Data Science extra routes */}
                        <Route path="/data/mlops" element={<MLOps />} />
                        <Route path="/data/analytics" element={<AnalyticsWorkbench />} />
                        <Route path="/data/knowledge-graph" element={<KnowledgeGraph />} />

                        {/* AI Copilot extra routes */}
                        <Route path="/copilot/dashboard" element={<CopilotDashboard />} />
                        <Route path="/copilot/workflows" element={<FinalPages.WorkflowBuilder />} />
                        <Route path="/copilot/marketplace" element={<FinalPages.AgentMarketplace />} />

                        {/* Executive extra routes */}
                        <Route path="/executive/finance" element={<FinancialDashboard />} />
                        <Route path="/executive/team" element={<TeamPerformance />} />
                        <Route path="/executive/reports" element={<FinalPages.BoardReports />} />

                        {/* Lab routes */}
                        <Route path="/lab/samples" element={<SampleTracking />} />
                        <Route path="/lab/equipment" element={<EquipmentManager />} />
                        <Route path="/lab/protocols" element={<ProtocolLibrary />} />
                        <Route path="/lab/safety" element={<FinalPages.LabSafety />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
