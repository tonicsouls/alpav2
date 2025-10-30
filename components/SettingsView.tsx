import React, { useState } from 'react';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { WorkflowIcon } from './icons/WorkflowIcon';
import { FileSystemIcon } from './icons/FileSystemIcon';

interface SettingsViewProps {
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
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100"
            >
                <h3 className="text-md font-semibold flex items-center text-gray-800">
                    {icon}
                    {title}
                </h3>
                <svg
                    className={`w-5 h-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && <div className="p-4 bg-white border-t border-gray-200">{children}</div>}
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
                className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
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


export const SettingsView: React.FC<SettingsViewProps> = ({ 
    systemInstruction, onSystemInstructionChange, 
    quarantinePII, onQuarantinePIIChange,
    isCrmValidationEnabled, onIsCrmValidationEnabledChange,
    isAutoCategorizationEnabled, onIsAutoCategorizationEnabledChange,
    disabled 
}) => {
    return (
        <div className="space-y-8 max-w-4xl">
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                    AI Processing Instruction
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    Define the core instruction for the AI model. This guides its analysis and required output format.
                </p>
                <textarea
                    id="system-instruction"
                    rows={6}
                    value={systemInstruction}
                    onChange={(e) => onSystemInstructionChange(e.target.value)}
                    disabled={disabled}
                    className="mt-4 w-full bg-white border border-gray-300 rounded-md shadow-sm p-3 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Instruct the AI on its role and required output format..."
                />
            </div>
            
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
