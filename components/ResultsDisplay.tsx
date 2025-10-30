import React from 'react';
import { FileToProcess, LogMessage } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { FolderIcon } from './icons/FolderIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { LogViewer } from './LogViewer';

interface ResultsDisplayProps {
    processedFiles: FileToProcess[];
    logs: LogMessage[];
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ processedFiles, logs }) => {
    const successCount = processedFiles.filter(f => f.status === 'success').length;
    const errorCount = processedFiles.filter(f => f.status === 'error').length;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Processing Complete</h2>
                <div className="flex items-center space-x-6 mt-2 text-sm">
                    <div className="flex items-center text-green-600">
                        <CheckCircleIcon className="w-5 h-5 mr-1.5" />
                        <span className="font-medium">{successCount} Succeeded</span>
                    </div>
                    <div className="flex items-center text-red-600">
                        <XCircleIcon className="w-5 h-5 mr-1.5" />
                        <span className="font-medium">{errorCount} Failed</span>
                    </div>
                </div>
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
                <h3 className="text-md font-semibold text-gray-800 mb-4">File Processing Summary:</h3>
                <ul className="space-y-3">
                    {processedFiles.map(file => (
                        <li key={file.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-sm text-gray-500 truncate pr-4">{file.originalName}</span>
                                {file.status === 'success' ? (
                                    <span className="flex items-center text-xs font-semibold text-green-800 bg-green-100 px-2.5 py-1 rounded-full">
                                        <CheckCircleIcon className="w-4 h-4 mr-1.5" />
                                        Success
                                    </span>
                                ) : (
                                    <span className="flex items-center text-xs font-semibold text-red-800 bg-red-100 px-2.5 py-1 rounded-full">
                                        <XCircleIcon className="w-4 h-4 mr-1.5" />
                                        Failed
                                    </span>
                                )}
                            </div>
                            {file.status === 'success' && file.finalName && file.destination && (
                                <div className="mt-3 text-xs text-gray-500 font-mono space-y-2">
                                    <div className="flex items-center">
                                        <ArrowRightIcon className="w-4 h-4 mr-2 text-red-500" />
                                        <span>Renamed to: <span className="text-gray-700 font-semibold">{file.finalName}</span></span>
                                    </div>
                                     <div className="flex items-center">
                                        <FolderIcon className="w-4 h-4 mr-2 text-red-500" />
                                        <span>Final Location: <span className="text-gray-700">{file.destination}</span></span>
                                    </div>
                                </div>
                            )}
                             {file.status === 'error' && file.reason && (
                                <div className="mt-3 text-xs text-red-600 font-mono">
                                    <p>Reason: {file.reason}</p>
                                    {file.destination && (
                                        <div className="flex items-center mt-1">
                                            <FolderIcon className="w-4 h-4 mr-2" />
                                            <span>Location: <span className="text-red-500">{file.destination}</span></span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
                <div className="mt-6 border-t border-gray-200 pt-4">
                     <h3 className="text-md font-semibold text-gray-800 mb-4">Full Log:</h3>
                     <div className="h-64 relative">
                        <div className="absolute inset-0 border border-gray-200 rounded-lg">
                            <LogViewer logs={logs} />
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};