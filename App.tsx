import React, { useState, useCallback, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { FileUpload } from './components/FileUpload';
import { WorkflowControls } from './components/WorkflowControls';
import { LogViewer } from './components/LogViewer';
import { SettingsView } from './components/SettingsView';
import { LogMessage, FileToProcess, ProcessStatus, AnalysisResult } from './types';
import { analyzeDocument } from './services/geminiService';
import { getCustomerShortId } from './services/crmService';
import { ResultsDisplay } from './components/ResultsDisplay';
import { SAMPLE_DOCUMENTS } from './data/sampleDocuments';
import { WorkflowView } from './components/WorkflowView';

type View = 'dashboard' | 'workflows' | 'logs' | 'settings';

const App: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [processedFiles, setProcessedFiles] = useState<FileToProcess[]>([]);
    const [logs, setLogs] = useState<LogMessage[]>([]);
    const [lastRunLogs, setLastRunLogs] = useState<LogMessage[]>([]);
    const [status, setStatus] = useState<ProcessStatus>('idle');
    const [activeView, setActiveView] = useState<View>('dashboard');
    
    // --- Configuration State ---
    const [model, setModel] = useState<string>('gemini-2.5-pro');
    const [systemInstruction, setSystemInstruction] = useState<string>(`You are a secure document analysis AI for a bank. Analyze the text content to determine the document type (e.g., 'Invoice', 'Tax Form', 'Loan Application', 'Other') and extract the primary customer identifier (name or account number). Respond ONLY with the specified JSON schema.`);
    const [quarantinePII, setQuarantinePII] = useState<boolean>(true);
    const [isCrmValidationEnabled, setIsCrmValidationEnabled] = useState<boolean>(true);
    const [isAutoCategorizationEnabled, setIsAutoCategorizationEnabled] = useState<boolean>(true);

    const logCounter = useRef(0);

    const addLog = useCallback((message: string, type: LogMessage['type'], fileName?: string) => {
        setLogs(prevLogs => {
            const newLog: LogMessage = {
                id: logCounter.current++,
                timestamp: new Date().toLocaleTimeString(),
                message,
                type,
                fileName,
            };
            return [...prevLogs, newLog];
        });
    }, []);

    const processFile = async (file: File): Promise<FileToProcess> => {
        const processedFile: FileToProcess = {
            id: `${file.name}-${file.lastModified}`,
            originalName: file.name,
            status: 'processing',
        };
        
        try {
            addLog(`Reading file content...`, 'info', file.name);
            const content = await file.text();

            addLog(`Analyzing document with model: ${model}...`, 'step', file.name);
            const analysisResult: AnalysisResult = await analyzeDocument(content, systemInstruction, model);
            
            if (!analysisResult || !analysisResult.fileType || !analysisResult.customerIdentifier) {
                throw new Error("AI analysis returned invalid data.");
            }

            if (quarantinePII && analysisResult.containsPII) {
                processedFile.status = 'error';
                processedFile.finalName = 'N/A';
                processedFile.destination = `C:\\Users\\User\\Documents\\Quarantined\\`;
                processedFile.reason = `Guardrail Triggered: Document contains potential PII and has been quarantined.`;
                addLog(processedFile.reason, 'error', file.name);
                return processedFile;
            }
             addLog(`Guardrail check passed.`, 'success', file.name);

            if (analysisResult.fileType === 'Other' || !analysisResult.hasCustomerData) {
                processedFile.status = 'error';
                processedFile.finalName = 'N/A';
                processedFile.destination = `C:\\Users\\User\\Documents\\Rejected\\`;
                processedFile.reason = `Incompatible document type (${analysisResult.fileType}) or missing customer data.`;
                throw new Error(processedFile.reason);
            }
            addLog(`AI Analysis: Type='${analysisResult.fileType}', Identifier='${analysisResult.customerIdentifier}'`, 'success', file.name);
            
            let shortId = analysisResult.customerIdentifier.replace(/\s+/g, '-').substring(0, 15);

            if (isCrmValidationEnabled) {
                addLog(`Validating identifier locally: '${analysisResult.customerIdentifier}'...`, 'step', file.name);
                const crmResult = await getCustomerShortId(analysisResult.customerIdentifier);
                if (!crmResult.isValid || !crmResult.shortId) {
                    throw new Error(`Local validation failed for identifier: ${analysisResult.customerIdentifier}`);
                }
                shortId = crmResult.shortId;
                addLog(`Local Match Found. Short ID: '${crmResult.shortId}'`, 'success', file.name);
            } else {
                addLog('Local CRM validation skipped by workflow configuration.', 'info', file.name);
            }
            
            addLog(`Generating new file name...`, 'step', file.name);
            const extension = file.name.split('.').pop() || 'txt';
            const fileTypeSlug = analysisResult.fileType.replace(/\s+/g, '-');
            processedFile.finalName = `${shortId}_${fileTypeSlug}.${extension}`;
            addLog(`New filename: ${processedFile.finalName}`, 'info', file.name);

            if (isAutoCategorizationEnabled) {
                addLog(`Determining local file destination...`, 'step', file.name);
                processedFile.destination = `C:\\Users\\User\\Documents\\Processed\\${shortId}\\${fileTypeSlug}\\`;
                addLog(`Destination: ${processedFile.destination}`, 'info', file.name);
            } else {
                processedFile.destination = `C:\\Users\\User\\Documents\\Processed\\Uncategorized\\`;
                addLog('Auto-categorization skipped. Using default folder.', 'info', file.name);
            }

            processedFile.status = 'success';
            addLog(`Successfully processed ${file.name}.`, 'success', file.name);
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            addLog(`Failed to process ${file.name}: ${errorMessage}`, 'error', file.name);
            processedFile.status = 'error';
            processedFile.reason = processedFile.reason || errorMessage;
        }

        return processedFile;
    };

    const handleProcessFiles = useCallback(async () => {
        if (files.length === 0) {
            addLog('No files selected for processing.', 'error');
            return;
        }

        setStatus('processing');
        setLogs([]);
        setProcessedFiles([]);
        addLog(`Starting batch processing for ${files.length} file(s)...`, 'step');

        const results: FileToProcess[] = [];
        for (const file of files) {
            const result = await processFile(file);
            results.push(result);
            setProcessedFiles([...results]);
        }
        
        addLog('Batch processing complete.', 'step');
        setStatus('completed');
    }, [files, addLog, systemInstruction, model, quarantinePII, isCrmValidationEnabled, isAutoCategorizationEnabled]);

    const handleReset = () => {
        setLastRunLogs(logs);
        setFiles([]);
        setProcessedFiles([]);
        setLogs([]);
        setStatus('idle');
    }
    
    const handleLoadSamples = useCallback(() => {
        const sampleFiles = SAMPLE_DOCUMENTS.map(doc => {
            return new File([doc.content], doc.name, {
                type: 'text/plain',
                lastModified: new Date().getTime(),
            });
        });
        setFiles(sampleFiles);
        addLog(`Loaded ${sampleFiles.length} sample documents. Ready to process.`, 'info');
    }, [addLog]);

    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return (
                    <>
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">
                                <span className="text-red-600">Secure</span> Document Processor
                            </h1>
                            <p className="text-gray-500 mt-2">
                                Automated file analysis, validation, and organization powered by AI.
                            </p>
                        </div>
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                <FileUpload 
                                    onFilesSelect={setFiles} 
                                    disabled={status === 'processing'}
                                    model={model}
                                    onModelChange={setModel}
                                    onLoadSamples={handleLoadSamples}
                                />
                                <WorkflowControls 
                                    onStart={handleProcessFiles} 
                                    onReset={handleReset}
                                    status={status}
                                    fileCount={files.length}
                                />
                            </div>
                            <div className="min-h-[600px]">
                                {status === 'idle' && (
                                    <div className="h-full flex items-center justify-center bg-white rounded-lg border-2 border-dashed border-gray-300 p-8">
                                        <div className="text-center">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                            </svg>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">Get Started</h3>
                                            <p className="mt-1 text-sm text-gray-500">Configure, upload documents, and start the workflow.</p>
                                        </div>
                                    </div>
                                )}
                                {status === 'processing' && <LogViewer logs={logs} />}
                                {status === 'completed' && <ResultsDisplay processedFiles={processedFiles} logs={logs}/>}
                            </div>
                        </div>
                    </>
                );
            case 'settings':
                 return (
                    <>
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                            <p className="text-gray-500 mt-2">
                                Fine-tune the behavior of the document processing workflow.
                            </p>
                        </div>
                        <SettingsView 
                            systemInstruction={systemInstruction}
                            onSystemInstructionChange={setSystemInstruction}
                            quarantinePII={quarantinePII}
                            onQuarantinePIIChange={setQuarantinePII}
                            isCrmValidationEnabled={isCrmValidationEnabled}
                            onIsCrmValidationEnabledChange={setIsCrmValidationEnabled}
                            isAutoCategorizationEnabled={isAutoCategorizationEnabled}
                            onIsAutoCategorizationEnabledChange={setIsAutoCategorizationEnabled}
                            disabled={status === 'processing'}
                        />
                    </>
                );
            case 'workflows':
                return (
                   <>
                       <div className="mb-8">
                           <h1 className="text-3xl font-bold text-gray-900">Workflow Diagram</h1>
                           <p className="text-gray-500 mt-2">
                               A step-by-step overview of the document processing pipeline. Configure steps directly on the diagram.
                           </p>
                       </div>
                       <WorkflowView 
                           quarantinePII={quarantinePII}
                           onQuarantinePIIChange={setQuarantinePII}
                           isCrmValidationEnabled={isCrmValidationEnabled}
                           onIsCrmValidationEnabledChange={setIsCrmValidationEnabled}
                           isAutoCategorizationEnabled={isAutoCategorizationEnabled}
                           onIsAutoCategorizationEnabledChange={setIsAutoCategorizationEnabled}
                           disabled={status === 'processing'}
                       />
                   </>
               );
            case 'logs':
                return (
                   <>
                       <div className="mb-8">
                           <h1 className="text-3xl font-bold text-gray-900">Logs</h1>
                           <p className="text-gray-500 mt-2">
                               Review the detailed processing log from the last completed workflow.
                           </p>
                       </div>
                       {lastRunLogs.length > 0 ? (
                           <div className="h-[calc(100vh-12rem)] relative">
                              <div className="absolute inset-0">
                                  <LogViewer logs={lastRunLogs} />
                              </div>
                           </div>
                       ) : (
                           <div className="h-96 flex items-center justify-center bg-white rounded-lg border-2 border-dashed border-gray-300 p-8">
                               <div className="text-center">
                                   <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                     <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 9.75h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5-13.5h16.5a1.5 1.5 0 011.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V7.5a1.5 1.5 0 011.5-1.5z" />
                                   </svg>
                                   <h3 className="mt-2 text-sm font-medium text-gray-900">No Logs Available</h3>
                                   <p className="mt-1 text-sm text-gray-500">Run a workflow from the dashboard to generate logs.</p>
                               </div>
                           </div>
                       )}
                   </>
               );
            default:
                return null;
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar activeView={activeView} onNavigate={setActiveView} />
            <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
                 {renderView()}
            </main>
        </div>
    );
};

export default App;