export interface LogMessage {
    id: number;
    timestamp: string;
    message: string;
    type: 'info' | 'success' | 'error' | 'step';
    fileName?: string;
}

export type ProcessStatus = 'idle' | 'processing' | 'completed';

export interface AnalysisResult {
    fileType: string;
    hasCustomerData: boolean;
    customerIdentifier: string;
    containsPII?: boolean; // Flag for guardrail simulation
}

export interface CrmResult {
    isValid: boolean;
    shortId: string | null;
}

export interface FileToProcess {
    id: string;
    originalName: string;
    status: 'pending' | 'processing' | 'success' | 'error';
    finalName?: string;
    destination?: string;
    reason?: string;
}