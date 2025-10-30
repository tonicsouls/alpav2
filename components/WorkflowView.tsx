import React from 'react';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { CogIcon } from './icons/CogIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { FileSystemIcon } from './icons/FileSystemIcon';
import { FolderIcon } from './icons/FolderIcon';
import { ToggleSwitch } from './ToggleSwitch';

interface WorkflowViewProps {
    quarantinePII: boolean;
    onQuarantinePIIChange: (enabled: boolean) => void;
    isCrmValidationEnabled: boolean;
    onIsCrmValidationEnabledChange: (enabled: boolean) => void;
    isAutoCategorizationEnabled: boolean;
    onIsAutoCategorizationEnabledChange: (enabled: boolean) => void;
    disabled: boolean;
}

const WorkflowStep: React.FC<{ 
    icon: React.ReactNode; 
    title: string; 
    children: React.ReactNode; 
    isLast?: boolean; 
    isEnabled?: boolean;
    toggle?: React.ReactNode;
}> = ({ icon, title, children, isLast = false, isEnabled = true, toggle }) => (
    <div className={`flex transition-opacity duration-300 ${!isEnabled ? 'opacity-40' : ''}`}>
        <div className="flex flex-col items-center mr-6">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${isEnabled ? 'bg-red-500/10 border-red-500' : 'bg-gray-100 border-gray-300'}`}>
                <div className={`w-6 h-6 transition-colors ${isEnabled ? 'text-red-600' : 'text-gray-400'}`}>{icon}</div>
            </div>
            {!isLast && <div className="w-px h-full bg-gray-300"></div>}
        </div>
        <div className="pb-10 flex-1">
            <div className="flex justify-between items-start">
                 <div>
                    <h3 className={`text-lg font-semibold transition-colors ${isEnabled ? 'text-gray-900' : 'text-gray-500'}`}>{title}</h3>
                    <p className={`mt-2 text-gray-600 max-w-2xl transition-colors ${!isEnabled ? 'text-gray-400' : ''}`}>{children}</p>
                 </div>
                 {toggle && <div className="ml-4 pt-1">{toggle}</div>}
            </div>
        </div>
    </div>
);

export const WorkflowView: React.FC<WorkflowViewProps> = ({
    quarantinePII,
    onQuarantinePIIChange,
    isCrmValidationEnabled,
    onIsCrmValidationEnabledChange,
    isAutoCategorizationEnabled,
    onIsAutoCategorizationEnabledChange,
    disabled
}) => {
    return (
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <WorkflowStep title="1. File Ingestion" icon={<DocumentTextIcon />}>
                Files are uploaded via the dashboard's drag-and-drop area or the file browser. The system is configured to accept various text-based document formats for processing.
            </WorkflowStep>
            <WorkflowStep title="2. AI Analysis & Extraction" icon={<CogIcon />}>
                The selected AI model reads the document's text content. Guided by the system instruction, it determines the document's type, extracts the customer identifier, and flags for PII.
            </WorkflowStep>
            <WorkflowStep 
                title="3. Security Guardrail" 
                icon={<ShieldCheckIcon />} 
                isEnabled={quarantinePII}
                toggle={<ToggleSwitch label="Enable PII Quarantine" checked={quarantinePII} onChange={onQuarantinePIIChange} disabled={disabled} />}
            >
                If enabled, the AI's analysis is checked. Any document flagged as containing potential PII is immediately routed to a secure quarantine folder, and further processing is halted.
            </WorkflowStep>
            <WorkflowStep 
                title="4. CRM Validation" 
                icon={<UserGroupIcon />} 
                isEnabled={isCrmValidationEnabled}
                toggle={<ToggleSwitch label="Enable CRM Validation" checked={isCrmValidationEnabled} onChange={onIsCrmValidationEnabledChange} disabled={disabled} />}
            >
                When enabled, the extracted customer identifier is cross-referenced with the mock CRM database to retrieve a standardized short ID. If no match is found, the file is rejected.
            </WorkflowStep>
            <WorkflowStep 
                title="5. Renaming & Auto-Categorization" 
                icon={<FileSystemIcon />}
                isEnabled={isAutoCategorizationEnabled}
                toggle={<ToggleSwitch label="Enable Auto-Categorization" checked={isAutoCategorizationEnabled} onChange={onIsAutoCategorizationEnabledChange} disabled={disabled} />}
            >
                A new filename is generated using the short ID and document type. If enabled, a structured destination path is also created to automatically sort the file.
            </WorkflowStep>
            <WorkflowStep title="6. Final Output" icon={<FolderIcon />} isLast={true}>
                The document is moved to its final destination. With auto-categorization, the path is structured (e.g., <code className="text-sm bg-gray-100 text-red-600 py-0.5 px-1 rounded">.../Processed/CUST-ID/Invoice/</code>). If disabled, it goes to a general folder (e.g. <code className="text-sm bg-gray-100 text-gray-600 py-0.5 px-1 rounded">.../Processed/Uncategorized/</code>). Quarantined or rejected files are moved accordingly.
            </WorkflowStep>
        </div>
    );
};
