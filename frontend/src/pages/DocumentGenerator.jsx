import { useState, useEffect } from 'react';
import { FileText, ChevronDown, Download, Loader, Edit, Save } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// In a real app, these would be fetched from a database
const initialTemplates = {
    research_report: {
        name: 'Research Report',
        template: `
# {project_name} - Research Report

**Date:** {date}
**Version:** 1.0

## 1. Executive Summary
{executive_summary}

## 2. Introduction
{introduction}

## 3. Methods
{methods}
`,
        fields: [
            { id: 'project_name', label: 'Project Name', type: 'text', defaultValue: 'GNS0042 Efficacy in IBD Models' },
            { id: 'executive_summary', label: 'Executive Summary', type: 'textarea', defaultValue: 'GNS0042 showed significant reduction in inflammation markers...' },
            { id: 'introduction', label: 'Introduction', type: 'textarea', defaultValue: 'Inflammatory Bowel Disease (IBD) is a chronic inflammatory condition...' },
            { id: 'methods', label: 'Methods', type: 'textarea', defaultValue: 'C57BL/6 mice were administered 3% DSS in drinking water...' },
        ],
    },
    protocol_sop: {
        name: 'Protocol SOP',
        template: `
# Standard Operating Procedure: {sop_title}

## 1. Purpose
{purpose}

## 2. Scope
{scope}
`,
        fields: [
            { id: 'sop_title', label: 'SOP Title', type: 'text', defaultValue: 'In Vitro SCFA Production Assay' },
            { id: 'purpose', label: 'Purpose', type: 'textarea', defaultValue: 'To quantify the production of Short-Chain Fatty Acids (SCFAs) by candidate strains.' },
            { id: 'scope', label: 'Scope', type: 'textarea', defaultValue: 'This SOP applies to all in vitro assays performed in the R&D lab.' },
        ],
    },
};

export default function DocumentGenerator() {
    const [templates, setTemplates] = useState(initialTemplates);
    const [selectedTemplate, setSelectedTemplate] = useState('research_report');
    const [formData, setFormData] = useState({});
    const [generatedDoc, setGeneratedDoc] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedTemplate, setEditedTemplate] = useState('');

    useEffect(() => {
        const defaultData = templates[selectedTemplate].fields.reduce((acc, field) => {
            acc[field.id] = field.defaultValue || '';
            return acc;
        }, {});
        setFormData(defaultData);
        setEditedTemplate(templates[selectedTemplate].template);
    }, [selectedTemplate, templates]);

    const handleTemplateChange = (e) => {
        setSelectedTemplate(e.target.value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedDoc('');
        // For prototype, we use the local template state
        const template = templates[selectedTemplate].template;
        const populatedDoc = template.replace(/{(\w+)}/g, (match, key) => formData[key] || match);
        
        // Simulate network delay
        await new Promise(res => setTimeout(res, 500));
        
        setGeneratedDoc(populatedDoc);
        setIsLoading(false);
    };

    const handleSaveTemplate = () => {
        // Prototype only: update local state
        setTemplates(prev => ({
            ...prev,
            [selectedTemplate]: {
                ...prev[selectedTemplate],
                template: editedTemplate,
            }
        }));
        alert('Template saved locally for this session.');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Left panel: Form */}
            <div className="w-1/2 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Document Generator</h1>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm">Edit Mode</span>
                        <button onClick={() => setIsEditMode(!isEditMode)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isEditMode ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEditMode ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>
                
                <div className="mb-6">
                    <label htmlFor="template-select" className="block text-sm font-medium text-gray-700 mb-2">
                        Select a Template
                    </label>
                    <div className="relative">
                        <select
                            id="template-select"
                            value={selectedTemplate}
                            onChange={handleTemplateChange}
                            className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none"
                        >
                            {Object.entries(templates).map(([id, { name }]) => (
                                <option key={id} value={id}>{name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                </div>

                {!isEditMode && (
                    <>
                        <div className="space-y-4">
                            {templates[selectedTemplate].fields.map(field => (
                                <div key={field.id}>
                                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">{field.label}</label>
                                    <div className="mt-1">
                                        <textarea
                                            id={field.id}
                                            name={field.id}
                                            rows={field.type === 'textarea' ? 3 : 1}
                                            value={formData[field.id] || ''}
                                            onChange={handleInputChange}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8">
                            <button onClick={handleGenerate} disabled={isLoading} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                                {isLoading ? <Loader className="animate-spin mr-2" /> : <FileText className="mr-2" />}
                                Generate Document
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Right panel: Preview / Editor */}
            <div className="w-1/2 p-8 bg-white border-l border-gray-200 overflow-y-auto flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">{isEditMode ? 'Edit Template' : 'Preview'}</h2>
                    {isEditMode ? (
                        <button onClick={handleSaveTemplate} className="flex items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                            <Save className="mr-2" size={18}/> Save Template (Prototype)
                        </button>
                    ) : (
                        <button className="p-2 rounded-md hover:bg-gray-100" disabled={!generatedDoc}>
                            <Download />
                        </button>
                    )}
                </div>
                {isEditMode ? (
                    <textarea
                        value={editedTemplate}
                        onChange={(e) => setEditedTemplate(e.target.value)}
                        className="flex-1 w-full font-mono text-sm bg-gray-50 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                ) : (
                    <article className="prose lg:prose-xl max-w-none">
                        <ReactMarkdown>{generatedDoc}</ReactMarkdown>
                    </article>
                )}
            </div>
        </div>
    );
}

