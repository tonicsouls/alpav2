import React, { useState } from 'react';
import { CogIcon } from './icons/CogIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { WorkflowIcon } from './icons/WorkflowIcon';
import { FileSystemIcon } from './icons/FileSystemIcon';

interface SettingsPanelProps {
    model: string;
    onModelChange: (model: string) => void;
    systemInstruction: string;
    onSystemInstructionChange: (instruction: string) => void;
    quarantinePII: boolean;
    onQuarantinePIIChange: (enabled: boolean) => void;
    isCrmValidationEnabled: boolean;
    onIsCrmValidationEnabledChange: (enabled: boolean) => void;
    isAutoCategorizationEnabled: boolean;
    onIsAutoCategorizationEnabledChange: (enabled: boolean) => void;
    disabled: boolean;
}

const Section: React.FC<{ title: string, icon: React.ReactNode, children: React.ReactNode, defaultOpen?: boolean }> = ({ title, icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-gray-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left text-gray-800 hover:bg-gray-50"
            >
                <h2 className="text-md font-semibold flex items-center">
                    {icon}
                    {title}
                </h2>
                <svg
                    className={`w-5 h-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && <div className="p-4 pt-0">{children}</div>}
        </div>
    );
}

const Toggle: React.FC<{ id: string, label: string, description: string, checked: boolean, onChange: (checked: boolean) => void, disabled: boolean }> = ({ id, label, description, checked, onChange, disabled }) => (
    <div className="relative flex items-start">
        <div className="flex items-center h-5">
            <input
                id={id}
                name={id}
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
        </div>
        <div className="ml-3 text-sm">
            <label htmlFor={id} className={`font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
                {label}
            </label>
            <p className={` ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
                {description}
            </p>
        </div>
    </div>
);


export const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
    model, onModelChange, 
    systemInstruction, onSystemInstructionChange, 
    quarantinePII, onQuarantinePIIChange,
    isCrmValidationEnabled, onIsCrmValidationEnabledChange,
    isAutoCategorizationEnabled, onIsAutoCategorizationEnabledChange,
    disabled 
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
            <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900">Configuration</h2>
                <p className="text-sm text-gray-500">Adjust the local workflow settings.</p>
            </div>

            <Section title="AI Configuration" icon={<CogIcon className="w-5 h-5 mr-3 text-gray-500" />} defaultOpen={true}>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 mb-2">
                            AI Model (Local or Cloud)
                        </label>
                        <select
                            id="model-select"
                            value={model}
                            onChange={(e) => onModelChange(e.target.value)}
                            disabled={disabled}
                            className="w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="local-gemma-7b">gemma-7b (Local Simulated)</option>
                            <option value="gemini-2.5-pro">gemini-2.5-pro (Cloud)</option>
                            <option value="gemini-flash-latest">gemini-flash-latest (Cloud)</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="system-instruction" className="block text-sm font-medium text-gray-700 mb-2">
                            Processing Instruction
                        </label>
                        <textarea
                            id="system-instruction"
                            rows={5}
                            value={systemInstruction}
                            onChange={(e) => onSystemInstructionChange(e.target.value)}
                            disabled={disabled}
                            className="w-full bg-white border border-gray-300 rounded-md shadow-sm p-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="Instruct the AI on its role and required output format..."
                        />
                    </div>
                </div>
            </Section>

            <Section title="Security Guardrails" icon={<ShieldCheckIcon className="w-5 h-5 mr-3 text-gray-500" />} defaultOpen={true}>
                 <div className="space-y-4">
                    <Toggle 
                        id="quarantine-pii"
                        label="Quarantine documents with PII"
                        description="Automatically move files with potential PII to a secure quarantine folder for manual review."
                        checked={quarantinePII}
                        onChange={onQuarantinePIIChange}
                        disabled={disabled}
                    />
                </div>
            </Section>

            <Section title="Workflow Steps" icon={<WorkflowIcon className="w-5 h-5 mr-3 text-gray-500" />} defaultOpen={true}>
                 <div className="space-y-4">
                    <Toggle 
                        id="crm-validation"
                        label="Enable Local CRM Validation"
                        description="Validate customer identifiers against a local mock database to find a matching short ID."
                        checked={isCrmValidationEnabled}
                        onChange={onIsCrmValidationEnabledChange}
                        disabled={disabled}
                    />
                    <Toggle 
                        id="auto-categorization"
                        label="Enable Auto-Categorization"
                        description="Automatically create and sort files into categorized sub-folders based on document type."
                        checked={isAutoCategorizationEnabled}
                        onChange={onIsAutoCategorizationEnabledChange}
                        disabled={disabled}
                    />
                </div>
            </Section>
            
            <Section title="Local File System" icon={<FileSystemIcon className="w-5 h-5 mr-3 text-gray-500" />}>
                 <div className="space-y-4 text-sm">
                    <p className="text-gray-500">This simulates the output directories on your local machine. Paths are for demonstration only.</p>
                     <div>
                        <label htmlFor="processed-path" className="block font-medium text-gray-700">Processed Folder</label>
                        <input type="text" id="processed-path" value="C:\Users\User\Documents\Processed\" disabled className="mt-1 w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm p-2 text-gray-500 sm:text-sm cursor-not-allowed" />
                    </div>
                    <div>
                        <label htmlFor="quarantined-path" className="block font-medium text-gray-700">Quarantined Folder</label>
                        <input type="text" id="quarantined-path" value="C:\Users\User\Documents\Quarantined\" disabled className="mt-1 w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm p-2 text-gray-500 sm:text-sm cursor-not-allowed" />
                    </div>
                 </div>
            </Section>
        </div>
    );
};