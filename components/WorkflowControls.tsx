import React from 'react';
import { ProcessStatus } from '../types';

interface WorkflowControlsProps {
    onStart: () => void;
    onReset: () => void;
    status: ProcessStatus;
    fileCount: number;
}

export const WorkflowControls: React.FC<WorkflowControlsProps> = ({ onStart, onReset, status, fileCount }) => {
    const isProcessing = status === 'processing';
    const isCompleted = status === 'completed';

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">2. Execute Workflow</h2>
            <div className="space-y-4">
                <button
                    onClick={onStart}
                    disabled={isProcessing || fileCount === 0}
                    className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isProcessing ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        'Start Workflow'
                    )}
                </button>
                 {isCompleted && (
                    <button
                        onClick={onReset}
                        className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                    >
                        Process New Batch
                    </button>
                )}
            </div>
        </div>
    );
};
