import React, { useEffect, useRef, useMemo } from 'react';
import { LogMessage } from '../types';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface LogViewerProps {
    logs: LogMessage[];
}

const statusStyles: Record<LogMessage['type'], { icon: string; color: string }> = {
    info: { icon: 'i', color: 'text-gray-400' },
    step: { icon: '>', color: 'text-red-400 font-semibold' },
    success: { icon: '✓', color: 'text-green-400' },
    error: { icon: '!', color: 'text-red-400' },
};

export const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    const groupedLogs = useMemo(() => {
        // FIX: Replaced the generic type argument on `reduce` with a type assertion 
        // on the initial value to resolve the "Untyped function calls may not accept 
        // type arguments" error. This is a more robust way to type the accumulator.
        return logs.reduce((acc, log) => {
            const key = log.fileName || 'general';
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(log);
            return acc;
        }, {} as Record<string, LogMessage[]>);
    }, [logs]);

    const generalLogs = groupedLogs['general'] || [];
    const fileLogKeys = Object.keys(groupedLogs).filter(key => key !== 'general');

    const getFileStatus = (fileLogs: LogMessage[]): 'processing' | 'success' | 'error' => {
        if (fileLogs.some(log => log.type === 'error')) return 'error';
        if (fileLogs.some(log => log.message.startsWith('Successfully processed'))) return 'success';
        return 'processing';
    };

    return (
        <div className="bg-gray-900 text-gray-200 rounded-lg shadow-sm border border-gray-700 h-full flex flex-col">
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">Live Workflow Report</h2>
            </div>
            <div ref={logContainerRef} className="flex-grow p-4 overflow-y-auto font-mono text-sm space-y-4">
                {generalLogs.length > 0 && (
                    <div className="space-y-2 mb-4 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
                        {generalLogs.map(log => (
                             <div key={log.id} className={`flex items-start ${statusStyles[log.type].color}`}>
                                <span className="w-20 shrink-0 text-gray-500">[{log.timestamp}]</span>
                                <span className={`w-5 shrink-0 font-bold text-center`}>{statusStyles[log.type].icon}</span>
                                <p className="flex-1 break-words whitespace-pre-wrap">{log.message}</p>
                            </div>
                        ))}
                    </div>
                )}
                
                {fileLogKeys.map(fileName => {
                    const fileLogs = groupedLogs[fileName];
                    const status = getFileStatus(fileLogs);
                    return (
                        <div key={fileName} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                            <div className="p-3 bg-gray-700/50 flex items-center justify-between">
                                <div className="flex items-center">
                                    <DocumentTextIcon className="w-5 h-5 mr-3 text-gray-400" />
                                    <span className="font-semibold text-gray-200">{fileName}</span>
                                </div>
                                {status === 'processing' && (
                                    <div className="flex items-center text-xs text-blue-300">
                                        <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        In Progress
                                    </div>
                                )}
                                {status === 'success' && (
                                    <div className="flex items-center text-xs text-green-400">
                                        <CheckCircleIcon className="w-4 h-4 mr-1.5" />
                                        Completed
                                    </div>
                                )}
                                {status === 'error' && (
                                     <div className="flex items-center text-xs text-red-400">
                                        <XCircleIcon className="w-4 h-4 mr-1.5" />
                                        Failed
                                    </div>
                                )}
                            </div>
                            <div className="p-3 space-y-2">
                                {fileLogs.map(log => (
                                    <div key={log.id} className={`flex items-start ${statusStyles[log.type].color}`}>
                                        <span className="w-20 shrink-0 text-gray-500">[{log.timestamp}]</span>
                                        <span className={`w-5 shrink-0 font-bold text-center`}>{statusStyles[log.type].icon}</span>
                                        <p className="flex-1 break-words whitespace-pre-wrap">{log.message}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};